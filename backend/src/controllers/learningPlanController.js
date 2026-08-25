const LearningPlan = require("../models/LearningPlan");
const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const ActivityLog = require("../models/ActivityLog");
const { generateDynamicRoadmap } = require("../services/groqRoadmapService");
const { sendRoadmapUpdateEmail } = require("../services/emailService");
const { emitStudentActivityEvent } = require("../services/eventService");

// Helper to calculate accurate task and roadmap metrics
const calculateRoadmapMetrics = (plan) => {
  let totalMandatoryTasks = 0;
  let completedMandatoryTasks = 0;

  plan.weeks.forEach((week) => {
    let weekMandatory = 0;
    let weekCompleted = 0;

    week.tasks.forEach((task) => {
      if (task.required) {
        totalMandatoryTasks++;
        weekMandatory++;
        if (task.completed || task.status === "COMPLETED") {
          completedMandatoryTasks++;
          weekCompleted++;
        }
      }
    });

    week.progressPercentage = weekMandatory > 0 ? Math.round((weekCompleted / weekMandatory) * 100) : 0;
    week.isCompleted = weekMandatory > 0 && weekCompleted === weekMandatory;
  });

  plan.overallProgressPercentage =
    totalMandatoryTasks > 0 ? Math.round((completedMandatoryTasks / totalMandatoryTasks) * 100) : 0;

  return plan;
};

// @desc    Get current user's personalized 6-week learning roadmap
// @route   GET /api/learning-plans/my-plan
const getMyPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    let plan = await LearningPlan.findOne({ userId });

    if (!plan || !plan.weeks || plan.weeks.length !== 6) {
      // Gather student profile context
      const profile = await StudentProfile.findOne({ user: userId });
      const skills = await StudentSkill.find({ userId });
      const latestAssessment = await AssessmentSubmission.findOne({ userId }).sort({ createdAt: -1 });

      const weakSkills = skills.filter((s) => s.selfRating < 3 || s.proficiency === "Beginner").map((s) => s.skillName);
      if (latestAssessment?.sectionScores) {
        Object.entries(latestAssessment.sectionScores).forEach(([sec, data]) => {
          const pct = typeof data === "object" ? data.percentage : 0;
          if (pct < 60) weakSkills.push(sec);
        });
      }

      const targetRole = profile?.targetRole || "Java Developer";

      const generated = await generateDynamicRoadmap({
        targetRole,
        studentSkills: skills,
        assessmentScores: latestAssessment ? latestAssessment.sectionScores : null,
        academicData: { cgpa: profile?.cgpa || 8.0, department: profile?.department },
        weakSkills: Array.from(new Set(weakSkills)),
      });

      plan = await LearningPlan.create({
        userId,
        targetRole,
        version: 1,
        generatedByAI: true,
        weeks: generated.weeks,
        weakAreasDetected: generated.weakAreasDetected || weakSkills,
        overallProgressPercentage: 0,
        profileSnapshot: {
          cgpa: profile?.cgpa || 8.0,
          readinessScore: profile?.readinessScore || 50,
          assessmentScore: profile?.assessmentScore || 0,
          codingProblemsSolved: profile?.codingProblemsSolved || 0,
          skillsCount: skills.length,
        },
      });

      // Send initial roadmap email
      try {
        await sendRoadmapUpdateEmail({
          to: req.user.email,
          name: req.user.name || "Candidate",
          targetRole,
          overallProgress: 0,
          nextTaskTitle: plan.weeks[0]?.tasks[0]?.title || "Start Week 1 Fundamentals",
          weakAreas: plan.weakAreasDetected,
          actionType: "GENERATED",
        });
      } catch (emailErr) {
        console.warn("[Roadmap Email Notice]:", emailErr.message);
      }
    } else {
      // Recalculate metrics to guarantee accuracy
      calculateRoadmapMetrics(plan);
      await plan.save();
    }

    return res.json({ success: true, plan });
  } catch (error) {
    console.error("Get learning plan error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle task completed status with sequential week unlock
// @route   PATCH /api/learning-plans/task-toggle
const toggleTask = async (req, res) => {
  try {
    const { weekNumber, taskId } = req.body;
    const userId = req.user._id;

    const plan = await LearningPlan.findOne({ userId });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    const weekIndex = plan.weeks.findIndex((w) => w.weekNumber === Number(weekNumber));
    if (weekIndex === -1) {
      return res.status(404).json({ success: false, message: "Week not found in roadmap" });
    }

    const week = plan.weeks[weekIndex];

    // Validate Sequential Week Access: Cannot modify locked weeks
    if (!week.isUnlocked) {
      return res.status(403).json({
        success: false,
        message: `Week ${weekNumber} is currently locked. Complete all mandatory tasks in Week ${weekNumber - 1} first.`,
      });
    }

    const task = week.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Toggle completion state
    const newCompletedState = !task.completed;
    task.completed = newCompletedState;
    task.status = newCompletedState ? "COMPLETED" : "IN_PROGRESS";
    task.completedAt = newCompletedState ? new Date() : null;

    // Check if Week is now fully completed
    const allWeekTasksDone = week.tasks.filter((t) => t.required).every((t) => t.completed);
    let newlyUnlockedWeekNumber = null;

    if (allWeekTasksDone && !week.isCompleted) {
      week.isCompleted = true;
      week.completedAt = new Date();

      // Sequential Unlock Next Week (if exists)
      if (weekIndex < plan.weeks.length - 1) {
        const nextWeek = plan.weeks[weekIndex + 1];
        if (!nextWeek.isUnlocked) {
          nextWeek.isUnlocked = true;
          nextWeek.unlockedAt = new Date();
          newlyUnlockedWeekNumber = nextWeek.weekNumber;

          // Unlock tasks in next week
          nextWeek.tasks.forEach((t) => {
            if (t.status === "LOCKED") t.status = "NOT_STARTED";
          });
        }
      }
    } else if (!allWeekTasksDone && week.isCompleted) {
      week.isCompleted = false;
      week.completedAt = null;
    }

    // Recalculate progress metrics
    calculateRoadmapMetrics(plan);
    await plan.save();

    // Trigger Activity Log
    await ActivityLog.create({
      userId,
      action: newCompletedState ? `Completed Task: ${task.title}` : `Reopened Task: ${task.title}`,
      category: "LEARNING",
      details: `Week ${weekNumber} &bull; Overall Progress: ${plan.overallProgressPercentage}%`,
    });

    emitStudentActivityEvent(userId, "ROADMAP_TASK_TOGGLED", {
      taskId,
      completed: newCompletedState,
      overallProgress: plan.overallProgressPercentage,
    });

    // Send milestone email if a new week was unlocked or full roadmap completed
    if (newlyUnlockedWeekNumber) {
      try {
        const nextTask = plan.weeks[weekIndex + 1]?.tasks[0]?.title || "Continue next week module";
        await sendRoadmapUpdateEmail({
          to: req.user.email,
          name: req.user.name || "Candidate",
          targetRole: plan.targetRole,
          overallProgress: plan.overallProgressPercentage,
          completedWeekNumber: week.weekNumber,
          unlockedWeekNumber: newlyUnlockedWeekNumber,
          nextTaskTitle: nextTask,
          weakAreas: plan.weakAreasDetected,
          actionType: "WEEK_UNLOCKED",
        });
      } catch (emailErr) {
        console.warn("[Roadmap Email Notice]:", emailErr.message);
      }
    } else if (plan.overallProgressPercentage === 100) {
      try {
        await sendRoadmapUpdateEmail({
          to: req.user.email,
          name: req.user.name || "Candidate",
          targetRole: plan.targetRole,
          overallProgress: 100,
          nextTaskTitle: "Apply to Priority Placement Drives",
          weakAreas: [],
          actionType: "COMPLETED",
        });
      } catch (emailErr) {
        console.warn("[Roadmap Email Notice]:", emailErr.message);
      }
    }

    return res.json({
      success: true,
      plan,
      unlockedWeekNumber: newlyUnlockedWeekNumber,
      message: newlyUnlockedWeekNumber
        ? `🎉 Week ${weekNumber} completed! Week ${newlyUnlockedWeekNumber} has been unlocked.`
        : "Task progress saved to database.",
    });
  } catch (error) {
    console.error("Toggle task error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Regenerate personalized 6-week roadmap with Groq AI (Preserves History)
// @route   POST /api/learning-plans/regenerate
const regeneratePlan = async (req, res) => {
  try {
    const { targetRole = "Java Developer" } = req.body;
    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ user: userId });
    const skills = await StudentSkill.find({ userId });
    const latestAssessment = await AssessmentSubmission.findOne({ userId }).sort({ createdAt: -1 });

    const weakSkills = skills.filter((s) => s.selfRating < 3 || s.proficiency === "Beginner").map((s) => s.skillName);
    if (latestAssessment?.sectionScores) {
      Object.entries(latestAssessment.sectionScores).forEach(([sec, data]) => {
        const pct = typeof data === "object" ? data.percentage : 0;
        if (pct < 60) weakSkills.push(sec);
      });
    }

    // Call Groq AI service for fresh 6-week roadmap
    const generated = await generateDynamicRoadmap({
      targetRole,
      studentSkills: skills,
      assessmentScores: latestAssessment ? latestAssessment.sectionScores : null,
      academicData: { cgpa: profile?.cgpa || 8.0, department: profile?.department },
      weakSkills: Array.from(new Set(weakSkills)),
    });

    let plan = await LearningPlan.findOne({ userId });

    if (plan) {
      // Archive current version into history array
      plan.history.push({
        version: plan.version || 1,
        targetRole: plan.targetRole,
        generatedAt: plan.generatedAt || new Date(),
        progressPercentage: plan.overallProgressPercentage || 0,
        weeksSummary: plan.weeks.map((w) => ({
          weekNumber: w.weekNumber,
          title: w.title,
          isCompleted: w.isCompleted,
          progressPercentage: w.progressPercentage,
        })),
      });

      plan.targetRole = targetRole;
      plan.version = (plan.version || 1) + 1;
      plan.weeks = generated.weeks;
      plan.weakAreasDetected = generated.weakAreasDetected || weakSkills;
      plan.overallProgressPercentage = 0;
      plan.generatedAt = new Date();
      await plan.save();
    } else {
      plan = await LearningPlan.create({
        userId,
        targetRole,
        version: 1,
        generatedByAI: true,
        weeks: generated.weeks,
        weakAreasDetected: generated.weakAreasDetected || weakSkills,
        overallProgressPercentage: 0,
        profileSnapshot: {
          cgpa: profile?.cgpa || 8.0,
          readinessScore: profile?.readinessScore || 50,
          assessmentScore: profile?.assessmentScore || 0,
          codingProblemsSolved: profile?.codingProblemsSolved || 0,
          skillsCount: skills.length,
        },
      });
    }

    // Log Activity
    await ActivityLog.create({
      userId,
      action: "Regenerated AI 6-Week Learning Roadmap",
      category: "LEARNING",
      details: `Generated Version ${plan.version} for ${targetRole}`,
    });

    // Send Roadmap Update Email
    try {
      await sendRoadmapUpdateEmail({
        to: req.user.email,
        name: req.user.name || "Candidate",
        targetRole,
        overallProgress: 0,
        nextTaskTitle: plan.weeks[0]?.tasks[0]?.title || "Start Week 1 Fundamentals",
        weakAreas: plan.weakAreasDetected,
        actionType: "GENERATED",
      });
    } catch (emailErr) {
      console.warn("[Roadmap Email Notice]:", emailErr.message);
    }

    return res.json({ success: true, plan });
  } catch (error) {
    console.error("Regenerate roadmap error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get roadmap version history
// @route   GET /api/learning-plans/history
const getRoadmapHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const plan = await LearningPlan.findOne({ userId });

    return res.json({
      success: true,
      history: plan?.history || [],
      currentVersion: plan?.version || 1,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyPlan,
  toggleTask,
  regeneratePlan,
  getRoadmapHistory,
};

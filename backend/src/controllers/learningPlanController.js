const LearningPlan = require("../models/LearningPlan");
const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const { generateLearningPlan } = require("../services/groqService");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get current user's learning plan
// @route   GET /api/learning-plans/my-plan
const getMyPlan = async (req, res) => {
  try {
    let plan = await LearningPlan.findOne({ userId: req.user._id });

    if (!plan) {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      const skills = await StudentSkill.find({ userId: req.user._id });
      const weakSkills = skills.filter((s) => s.selfRating < 3).map((s) => s.skillName);

      const generated = await generateLearningPlan({
        targetRole: profile?.targetRole || "Full Stack Software Engineer",
        gapSkills: weakSkills.length > 0 ? weakSkills : ["System Design", "Algorithms", "AWS Deployment"],
      });

      plan = await LearningPlan.create({
        userId: req.user._id,
        targetRole: profile?.targetRole || "Full Stack Software Engineer",
        generatedByAI: true,
        weeks: generated.weeks,
        overallProgressPercentage: 15,
      });
    }

    return res.json({ success: true, plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle task completed status
// @route   PATCH /api/learning-plans/task-toggle
const toggleTask = async (req, res) => {
  try {
    const { weekNumber, taskId } = req.body;

    const plan = await LearningPlan.findOne({ userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Learning plan not found" });
    }

    const week = plan.weeks.find((w) => w.weekNumber === Number(weekNumber));
    if (!week) {
      return res.status(404).json({ success: false, message: "Week not found in plan" });
    }

    const task = week.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;

    // Check if all tasks in week are done
    week.isCompleted = week.tasks.every((t) => t.completed);

    // Recalculate total progress
    let totalTasks = 0;
    let completedTasks = 0;
    plan.weeks.forEach((w) => {
      w.tasks.forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    plan.overallProgressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    await plan.save();

    return res.json({ success: true, plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Regenerate plan with AI
// @route   POST /api/learning-plans/regenerate
const regeneratePlan = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const skills = await StudentSkill.find({ userId: req.user._id });
    const weakSkills = skills.filter((s) => s.selfRating < 3).map((s) => s.skillName);

    const generated = await generateLearningPlan({
      targetRole: targetRole || "Full Stack Software Engineer",
      gapSkills: weakSkills,
    });

    let plan = await LearningPlan.findOne({ userId: req.user._id });
    if (plan) {
      plan.targetRole = targetRole || plan.targetRole;
      plan.weeks = generated.weeks;
      plan.overallProgressPercentage = 0;
      plan.generatedAt = new Date();
      await plan.save();
    } else {
      plan = await LearningPlan.create({
        userId: req.user._id,
        targetRole: targetRole || "Full Stack Software Engineer",
        generatedByAI: true,
        weeks: generated.weeks,
        overallProgressPercentage: 0,
      });
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: "Regenerated AI Learning Plan",
      category: "LEARNING",
      details: `Generated plan for ${plan.targetRole}`,
    });

    return res.json({ success: true, plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyPlan,
  toggleTask,
  regeneratePlan,
};

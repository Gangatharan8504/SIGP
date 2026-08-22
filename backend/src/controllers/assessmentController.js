const Assessment = require("../models/Assessment");
const Question = require("../models/Question");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const ActivityLog = require("../models/ActivityLog");
const { generateAssessmentQuestionsWithAI } = require("../services/groqService");
const { sendExamResultEmail } = require("../services/emailService");

// @desc    Get all assessments
// @route   GET /api/assessments
const getAssessments = async (req, res) => {
  try {
    const { category, targetRole } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (targetRole) query.targetRole = targetRole;

    const assessments = await Assessment.find(query).populate("questions", "title category difficulty type marks");
    return res.json({ success: true, count: assessments.length, assessments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Automatically Generate Assessment Questions with Groq AI
// @route   POST /api/assessments/generate-ai
const generateAIAssessment = async (req, res) => {
  try {
    const { topic = "Full Stack Web Development", difficulty = "Intermediate", questionCount = 5, durationMinutes = 15 } = req.body;

    const generated = await generateAssessmentQuestionsWithAI({
      topic,
      difficulty,
      questionCount: Number(questionCount) || 5,
      durationMinutes: Number(durationMinutes) || 15,
    });

    // Save Questions to DB
    const createdQuestionIds = [];
    for (const q of generated.questions) {
      const qDoc = await Question.create({
        title: q.title,
        description: q.description || q.explanation || "",
        category: q.category || topic,
        difficulty: q.difficulty || difficulty,
        type: "mcq",
        marks: q.marks || 10,
        options: q.options || [],
      });
      createdQuestionIds.push(qDoc._id);
    }

    // Save Assessment
    const newAssessment = await Assessment.create({
      title: generated.title || `${topic} AI Assessment`,
      description: generated.description || `AI-generated placement benchmark for ${topic}`,
      category: generated.category || "Technical Assessment",
      targetRole: "Software Engineer",
      skillTags: [topic, "Problem Solving", "Core CS"],
      difficulty,
      durationMinutes: Number(durationMinutes) || 15,
      totalMarks: generated.totalMarks || createdQuestionIds.length * 10,
      passingMarks: generated.passingMarks || Math.round(createdQuestionIds.length * 10 * 0.6),
      maxAttempts: 3,
      isSecureExamMode: true,
      questions: createdQuestionIds,
      createdBy: req.user._id,
    });

    await ActivityLog.create({
      userId: req.user._id,
      action: "Generated AI Assessment",
      category: "ASSESSMENT",
      details: `Generated ${newAssessment.title} with ${createdQuestionIds.length} questions (${durationMinutes} mins)`,
    });

    return res.status(201).json({
      success: true,
      assessment: newAssessment,
      message: "AI Assessment successfully created",
    });
  } catch (error) {
    console.error("Generate AI assessment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assessment by ID with questions for taking the test
// @route   GET /api/assessments/:id
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate("questions");
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    // Hide answers from questions when serving to test takers
    const sanitizedQuestions = assessment.questions.map((q) => {
      const qObj = q.toObject();
      if (qObj.options) {
        qObj.options = qObj.options.map((opt) => ({ text: opt.text }));
      }
      return qObj;
    });

    return res.json({
      success: true,
      assessment: {
        ...assessment.toObject(),
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment & analyze score breakdown
// @route   POST /api/assessments/:id/submit
const submitAssessment = async (req, res) => {
  try {
    const { answers = [], timeSpentSeconds = 0 } = req.body;
    const assessment = await Assessment.findById(req.params.id).populate("questions");

    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    let earnedMarks = 0;
    let totalPossibleMarks = 0;
    const gradedAnswers = [];
    const questionBreakdown = [];

    for (const q of assessment.questions) {
      const qMarks = q.marks || 10;
      totalPossibleMarks += qMarks;

      const studentAns = answers.find(
        (a) => a.questionId?.toString() === q._id.toString() || a.questionId === q._id.toString()
      );

      let isCorrect = false;
      let marksForThis = 0;
      const correctOptionIndex = q.options.findIndex((opt) => opt.isCorrect === true);
      const studentChosenIndex = studentAns?.selectedOptionIndex ?? studentAns?.selectedOption;

      if (studentChosenIndex !== undefined && studentChosenIndex === correctOptionIndex) {
        isCorrect = true;
        marksForThis = qMarks;
        earnedMarks += qMarks;
      }

      gradedAnswers.push({
        questionId: q._id,
        selectedOptionIndex: studentChosenIndex,
        isCorrect,
        marksEarned: marksForThis,
      });

      questionBreakdown.push({
        questionTitle: q.title,
        questionDescription: q.description,
        selectedOptionIndex: studentChosenIndex,
        selectedOptionText: studentChosenIndex !== undefined ? q.options[studentChosenIndex]?.text : "Not Attempted",
        correctOptionIndex,
        correctOptionText: correctOptionIndex !== -1 ? q.options[correctOptionIndex]?.text : "",
        isCorrect,
        marksEarned: marksForThis,
        maxMarks: qMarks,
        category: q.category,
      });
    }

    const percentage = totalPossibleMarks > 0 ? Math.round((earnedMarks / totalPossibleMarks) * 100) : 0;
    const passed = percentage >= (assessment.passingMarks ? (assessment.passingMarks / totalPossibleMarks) * 100 : 60);

    const submission = await AssessmentSubmission.create({
      assessmentId: assessment._id,
      userId: req.user._id,
      score: earnedMarks,
      maxScore: totalPossibleMarks,
      percentage,
      passed,
      answers: gradedAnswers,
      timeSpentSeconds,
    });

    // Update student profile assessment score and skill verifications
    await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { assessmentScore: percentage }
    );

    // Update verified skill scores for tags
    if (assessment.skillTags && assessment.skillTags.length > 0) {
      for (const tag of assessment.skillTags) {
        await StudentSkill.findOneAndUpdate(
          { userId: req.user._id, skillName: { $regex: new RegExp(`^${tag}$`, "i") } },
          { verifiedScore: percentage, verifiedViaAssessment: true }
        );
      }
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: "Completed Assessment",
      category: "ASSESSMENT",
      details: `${assessment.title}: ${percentage}% (${passed ? "PASSED" : "FAILED"})`,
    });

    // Format time spent (HH:MM:SS)
    const hrs = Math.floor(timeSpentSeconds / 3600);
    const mins = Math.floor((timeSpentSeconds % 3600) / 60);
    const secs = timeSpentSeconds % 60;
    const timeSpentFormatted = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    sendExamResultEmail({
      to: req.user.email,
      name: req.user.name,
      examTitle: assessment.title,
      score: earnedMarks,
      maxScore: totalPossibleMarks,
      percentage,
      passed,
      integrityScore: 100,
      timeSpentFormatted,
      sectionScores: {
        "Technical Evaluation": { score: earnedMarks, maxScore: totalPossibleMarks },
      },
    }).catch((err) => console.error("[Assessment Email Error]", err.message));

    return res.json({
      success: true,
      submission,
      feedback: {
        percentage,
        passed,
        earnedMarks,
        totalPossibleMarks,
        timeSpentSeconds,
        questionBreakdown,
        analysisSummary: {
          accuracyRate: `${percentage}%`,
          correctCount: gradedAnswers.filter((a) => a.isCorrect).length,
          totalQuestions: assessment.questions.length,
          verdict: passed ? "Tier-1 Placement Competency Benchmark Achieved" : "Needs Revision on Core Topics",
        },
      },
    });
  } catch (error) {
    console.error("Assessment submit error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's past submissions
// @route   GET /api/assessments/submissions/my
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await AssessmentSubmission.find({ userId: req.user._id })
      .populate("assessmentId", "title category difficulty durationMinutes")
      .sort({ completedAt: -1 });

    return res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAssessments,
  getAssessmentById,
  generateAIAssessment,
  submitAssessment,
  getMySubmissions,
};

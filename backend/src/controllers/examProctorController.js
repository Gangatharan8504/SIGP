const Assessment = require("../models/Assessment");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const ExamIntegrityEvent = require("../models/ExamIntegrityEvent");
const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const { emitStudentActivityEvent } = require("../services/eventService");
const { sendExamResultEmail } = require("../services/emailService");

// @desc    Start / Verify examination session with max 3 attempt check
// @route   POST /api/exam-proctor/session/start
const startExamSession = async (req, res) => {
  try {
    const { assessmentId, screenShareGranted = false } = req.body;
    const userId = req.user._id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    const previousAttempts = await AssessmentSubmission.find({ assessmentId, userId });
    const currentAttemptCount = previousAttempts.length;

    if (currentAttemptCount >= (assessment.maxAttempts || 3)) {
      return res.status(403).json({
        success: false,
        message: `Maximum allowed attempts (${assessment.maxAttempts || 3}) reached for this examination. Attempts exhausted.`,
        attemptsExhausted: true,
      });
    }

    const nextAttemptNumber = currentAttemptCount + 1;

    // Log screen sharing permission status
    if (screenShareGranted !== undefined) {
      await ExamIntegrityEvent.create({
        assessmentId,
        attemptNumber: nextAttemptNumber,
        studentId: userId,
        eventType: screenShareGranted ? "SCREEN_SHARE_ALLOWED" : "SCREEN_SHARE_DECLINED",
        severity: "LOW",
        details: screenShareGranted ? "Candidate approved screen share telemetry." : "Candidate declined optional screen share permission.",
      });
    }

    return res.json({
      success: true,
      assessment,
      attemptNumber: nextAttemptNumber,
      remainingAttempts: (assessment.maxAttempts || 3) - nextAttemptNumber,
      isSecureExamMode: assessment.isSecureExamMode,
      sectionTimings: assessment.sectionTimings || [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Log real-time proctoring integrity event
// @route   POST /api/exam-proctor/events/log
const logIntegrityEvent = async (req, res) => {
  try {
    const { assessmentId, attemptNumber, eventType, severity, details } = req.body;

    const event = await ExamIntegrityEvent.create({
      assessmentId,
      attemptNumber: attemptNumber || 1,
      studentId: req.user._id,
      eventType,
      severity: severity || "MEDIUM",
      details: details || `Recorded ${eventType} during exam session.`,
    });

    return res.status(201).json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit secure exam and grade with integrity scoring & section analysis
// @route   POST /api/exam-proctor/submit
const submitSecureExam = async (req, res) => {
  try {
    const {
      assessmentId,
      attemptNumber = 1,
      answers = [],
      timeSpentSeconds = 0,
      screenShareGranted = false,
      startTime,
    } = req.body;
    const userId = req.user._id;

    const assessment = await Assessment.findById(assessmentId).populate("questions");
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    // Check existing submissions for this attempt
    const existingAttempt = await AssessmentSubmission.findOne({
      assessmentId,
      userId,
      attemptNumber,
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: `Attempt ${attemptNumber} has already been submitted.`,
      });
    }

    // Compute marks and section breakdowns
    let earnedMarks = 0;
    let totalPossibleMarks = 0;
    const gradedAnswers = [];
    const questionBreakdown = [];

    const sectionScores = {
      aptitude: { score: 0, maxScore: 0 },
      reasoning: { score: 0, maxScore: 0 },
      verbal: { score: 0, maxScore: 0 },
      pseudoCode: { score: 0, maxScore: 0 },
      coding: { score: 0, maxScore: 0 },
    };

    for (const q of assessment.questions) {
      const qMarks = q.marks || 10;
      totalPossibleMarks += qMarks;

      const studentAns = answers.find(
        (a) => a.questionId?.toString() === q._id.toString() || a.questionId === q._id.toString()
      );

      let isCorrect = false;
      let marksForThis = 0;
      const correctOptionIndex = q.options?.findIndex((opt) => opt.isCorrect === true) ?? -1;
      const studentChosenIndex = studentAns?.selectedOptionIndex ?? studentAns?.selectedOption;

      if (q.type === "coding") {
        const passedCases = studentAns?.testCasesPassed ?? (studentAns?.codeSubmitted ? 1 : 0);
        if (passedCases > 0) {
          isCorrect = true;
          marksForThis = qMarks;
          earnedMarks += qMarks;
        }
      } else if (studentChosenIndex !== undefined && studentChosenIndex === correctOptionIndex) {
        isCorrect = true;
        marksForThis = qMarks;
        earnedMarks += qMarks;
      }

      // Track section scores
      const catLower = (q.category || "").toLowerCase();
      let sectionKey = "aptitude";
      if (catLower.includes("reasoning") || catLower.includes("logic")) sectionKey = "reasoning";
      else if (catLower.includes("verbal") || catLower.includes("english")) sectionKey = "verbal";
      else if (catLower.includes("pseudo") || catLower.includes("code")) sectionKey = "pseudoCode";
      else if (catLower.includes("coding") || q.type === "coding") sectionKey = "coding";

      if (sectionScores[sectionKey]) {
        sectionScores[sectionKey].maxScore += qMarks;
        sectionScores[sectionKey].score += marksForThis;
      }

      gradedAnswers.push({
        questionId: q._id,
        selectedOptionIndex: studentChosenIndex,
        codeSubmitted: studentAns?.codeSubmitted,
        isCorrect,
        marksEarned: marksForThis,
        section: sectionKey,
      });

      questionBreakdown.push({
        questionTitle: q.title,
        questionDescription: q.description,
        selectedOptionIndex: studentChosenIndex,
        selectedOptionText: studentChosenIndex !== undefined ? q.options?.[studentChosenIndex]?.text : "Not Answered",
        correctOptionIndex,
        correctOptionText: correctOptionIndex !== -1 ? q.options?.[correctOptionIndex]?.text : "",
        isCorrect,
        marksEarned: marksForThis,
        maxMarks: qMarks,
        category: q.category,
        explanation: q.explanation || "",
      });
    }

    const percentage = totalPossibleMarks > 0 ? Math.round((earnedMarks / totalPossibleMarks) * 100) : 0;
    const passed = percentage >= (assessment.passingMarks ? (assessment.passingMarks / totalPossibleMarks) * 100 : 60);

    // Calculate integrity score based on logged events during this attempt
    const eventsCount = await ExamIntegrityEvent.countDocuments({
      assessmentId,
      studentId: userId,
      attemptNumber,
    });

    const integrityScore = Math.max(20, 100 - eventsCount * 10);

    const submission = await AssessmentSubmission.create({
      assessmentId,
      userId,
      attemptNumber,
      score: earnedMarks,
      maxScore: totalPossibleMarks,
      percentage,
      passed,
      integrityScore,
      screenShareGranted,
      sectionScores,
      answers: gradedAnswers,
      timeSpentSeconds,
      startTime: startTime ? new Date(startTime) : new Date(Date.now() - timeSpentSeconds * 1000),
      endTime: new Date(),
    });

    // Update student profile with authentic earned assessment metrics
    await StudentProfile.findOneAndUpdate(
      { user: userId },
      { assessmentScore: percentage }
    );

    // Update verified skill tags
    if (assessment.skillTags && assessment.skillTags.length > 0) {
      for (const tag of assessment.skillTags) {
        await StudentSkill.findOneAndUpdate(
          { userId, skillName: { $regex: new RegExp(`^${tag}$`, "i") } },
          { verifiedScore: percentage, verifiedViaAssessment: true }
        );
      }
    }

    // Trigger activity log event
    await emitStudentActivityEvent({
      userId,
      eventType: "ASSESSMENT",
      skillNames: assessment.skillTags || ["Data Structures & Algorithms"],
      score: percentage,
      sourceTitle: `${assessment.title} (Attempt ${attemptNumber})`,
      sourceRefId: assessment._id.toString(),
      details: `Score: ${earnedMarks}/${totalPossibleMarks} (${percentage}%), Integrity: ${integrityScore}%`,
    });

    // Format time spent (HH:MM:SS)
    const hrs = Math.floor(timeSpentSeconds / 3600);
    const mins = Math.floor((timeSpentSeconds % 3600) / 60);
    const secs = timeSpentSeconds % 60;
    const timeSpentFormatted = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    // Dispatch automated score report email
    sendExamResultEmail({
      to: req.user.email,
      name: req.user.name,
      examTitle: assessment.title,
      score: earnedMarks,
      maxScore: totalPossibleMarks,
      percentage,
      passed,
      integrityScore,
      timeSpentFormatted,
      sectionScores,
      attemptNumber,
    }).catch((err) => console.error("[Exam Result Email Error]", err.message));

    return res.status(201).json({
      success: true,
      submission,
      feedback: {
        percentage,
        passed,
        earnedMarks,
        totalPossibleMarks,
        attemptNumber,
        integrityScore,
        remainingAttempts: (assessment.maxAttempts || 3) - attemptNumber,
        timeSpentSeconds,
        sectionScores,
        questionBreakdown,
        analysisSummary: {
          accuracyRate: `${percentage}%`,
          correctCount: gradedAnswers.filter((a) => a.isCorrect).length,
          totalQuestions: assessment.questions.length,
          verdict: passed ? "Tier-1 Placement Competency Benchmark Cleared" : "Needs Targeted Preparation on Weaker Topics",
        },
      },
    });
  } catch (err) {
    console.error("Secure exam submit error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  startExamSession,
  logIntegrityEvent,
  submitSecureExam,
};

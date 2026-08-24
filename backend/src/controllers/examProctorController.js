const Assessment = require("../models/Assessment");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const ExamIntegrityEvent = require("../models/ExamIntegrityEvent");
const ExamSession = require("../models/ExamSession");
const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const { emitStudentActivityEvent } = require("../services/eventService");
const { sendExamResultEmail } = require("../services/emailService");
const {
  EMPTY_STARTER_TEMPLATES,
  generateMockAssessmentQuestions,
  sanitizeQuestionsForClient,
  getCuratedDefaultBank,
} = require("../services/groqQuestionService");
const { runTestCases } = require("../services/codeExecutionService");
const { getGroqClient } = require("../config/ai");

// Helper to format duration in HH:MM:SS
const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// @desc    Start / Resume examination session with 3-attempt check, session persistence & AI question engine
// @route   POST /api/exam-proctor/session/start, POST /api/assessments/:assessmentId/generate
const startExamSession = async (req, res) => {
  try {
    const { assessmentId = "full-pattern-test", screenShareGranted = false, consentAccepted = true } = req.body;
    const userId = req.user._id;

    // Check completed attempts
    const completedAttempts = await AssessmentSubmission.find({
      userId,
      $or: [{ assessmentId }, { assessmentId: "full-pattern-test" }],
    }).sort({ attemptNumber: 1 });

    const attemptCount = completedAttempts.length;

    // Check if an active uncompleted session exists within valid exam duration (80 mins = 4800s)
    const existingSession = await ExamSession.findOne({
      studentId: userId,
      assessmentId,
      isCompleted: false,
    }).sort({ createdAt: -1 });

    if (existingSession) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(existingSession.startedAt).getTime()) / 1000);
      const examDurationSec = 80 * 60; // 80 minutes
      const remainingSeconds = examDurationSec - elapsedSeconds;

      if (remainingSeconds > 0) {
        // Session is still active: return exact same question set and saved drafts
        const sanitizedBank = sanitizeQuestionsForClient(existingSession.questions);
        return res.json({
          success: true,
          sessionId: existingSession._id,
          assessment: {
            _id: assessmentId,
            title: "Full Pattern Mock Assessment",
            description: "Official 5-Section Placement Assessment (Aptitude, Reasoning, Verbal, Pseudo Code, Coding)",
            durationMinutes: 80,
            totalQuestions: 42,
            totalMarks: 60,
            maxAttempts: 3,
            difficultyProfile: existingSession.difficultyProfile,
          },
          dynamicExam: sanitizedBank,
          savedAnswers: existingSession.savedAnswers || {},
          savedCodingAnswers: existingSession.savedCodingAnswers || {},
          timeLeft: remainingSeconds,
          attemptNumber: existingSession.attemptNumber,
          remainingAttempts: Math.max(0, 3 - existingSession.attemptNumber),
          isSecureExamMode: true,
          isResumed: true,
        });
      } else {
        // Session has expired: mark as completed
        existingSession.isCompleted = true;
        existingSession.submittedAt = new Date();
        existingSession.durationSeconds = 4800;
        await existingSession.save();
      }
    }

    // Strict 3-Attempt Check on backend
    if (attemptCount >= 3) {
      return res.status(403).json({
        success: false,
        message: "Maximum allowed attempts (3 of 3) reached for this examination benchmark. Attempts exhausted.",
        attemptsExhausted: true,
      });
    }

    const nextAttemptNumber = attemptCount + 1;
    const difficultyProfile =
      nextAttemptNumber === 1 ? "Easy + Medium" : nextAttemptNumber === 2 ? "Medium" : "Medium + Hard";

    const cleanTitle = "Full Pattern Mock Assessment";

    // Generate questions using Groq backend service
    const studentProfile = await StudentProfile.findOne({ user: userId });
    const fullQuestionsBank = await generateMockAssessmentQuestions({
      attemptNumber: nextAttemptNumber,
      targetRole: studentProfile?.targetRole || "Software Engineer",
      skillGaps: ["DSA", "System Design", "Aptitude"],
    });

    // Save active ExamSession in database with full answer key stored safely
    const session = await ExamSession.create({
      studentId: userId,
      assessmentId,
      attemptNumber: nextAttemptNumber,
      startedAt: new Date(),
      difficultyProfile,
      questions: fullQuestionsBank,
      savedAnswers: {},
      savedCodingAnswers: {},
      isCompleted: false,
    });

    // Log Start and Consent Events
    await ExamIntegrityEvent.create({
      assessmentId,
      attemptNumber: nextAttemptNumber,
      studentId: userId,
      eventType: "EXAM_START",
      severity: "LOW",
      details: `Candidate initiated Attempt ${nextAttemptNumber} of 3 (${difficultyProfile}). SessionId: ${session._id}`,
    });

    if (consentAccepted) {
      await ExamIntegrityEvent.create({
        assessmentId,
        attemptNumber: nextAttemptNumber,
        studentId: userId,
        eventType: "CONSENT_ACCEPTED",
        severity: "LOW",
        details: "Candidate accepted proctoring terms, camera monitoring, screen share, and privacy consent.",
      });
    }

    if (screenShareGranted) {
      await ExamIntegrityEvent.create({
        assessmentId,
        attemptNumber: nextAttemptNumber,
        studentId: userId,
        eventType: "SCREEN_SHARE_ALLOWED",
        severity: "LOW",
        details: "Candidate granted entire desktop screen share telemetry.",
      });
    }

    // Strip answers, explanations, and prebuilt solutions before sending to client
    const sanitizedBank = sanitizeQuestionsForClient(fullQuestionsBank);

    return res.json({
      success: true,
      sessionId: session._id,
      assessment: {
        _id: assessmentId,
        title: cleanTitle,
        description: "Official 5-Section Placement Assessment (Aptitude, Reasoning, Verbal, Pseudo Code, Coding)",
        durationMinutes: 80,
        totalQuestions: 42,
        totalMarks: 60,
        maxAttempts: 3,
        difficultyProfile,
      },
      dynamicExam: sanitizedBank,
      savedAnswers: {},
      savedCodingAnswers: {},
      timeLeft: 4800,
      attemptNumber: nextAttemptNumber,
      remainingAttempts: 3 - nextAttemptNumber,
      isSecureExamMode: true,
      isResumed: false,
    });
  } catch (err) {
    console.error("Start exam session error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Log real-time proctoring integrity event (DevTools, Tab Switch, Camera, Screen Share)
// @route   POST /api/exam-proctor/events/log
const logIntegrityEvent = async (req, res) => {
  try {
    const {
      assessmentId = "full-pattern-test",
      attemptNumber = 1,
      eventType,
      severity = "MEDIUM",
      details,
      durationSeconds = 0,
    } = req.body;
    const userId = req.user._id;

    if (!eventType) {
      return res.status(400).json({ success: false, message: "eventType is required" });
    }

    const event = await ExamIntegrityEvent.create({
      assessmentId,
      attemptNumber: Number(attemptNumber) || 1,
      studentId: userId,
      eventType,
      severity,
      details: details || `Integrity event: ${eventType}`,
      durationSeconds: Number(durationSeconds) || 0,
      timestamp: new Date(),
    });

    emitStudentActivityEvent(userId, "EXAM_PROCTOR_EVENT", {
      eventType,
      severity,
      assessmentId,
    });

    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error("Log integrity event error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Auto-save session progress into ExamSession document
// @route   POST /api/exam-proctor/autosave
const autoSaveSession = async (req, res) => {
  try {
    const { assessmentId = "full-pattern-test", attemptNumber = 1, answers = {}, codingAnswers = {} } = req.body;
    const userId = req.user._id;

    const session = await ExamSession.findOne({
      studentId: userId,
      assessmentId,
      attemptNumber: Number(attemptNumber) || 1,
      isCompleted: false,
    });

    if (session) {
      session.savedAnswers = answers;
      session.savedCodingAnswers = codingAnswers;
      session.lastAutoSaveAt = new Date();
      await session.save();
    }

    return res.json({ success: true, message: "Progress cached safely in cloud database." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit secure proctored examination and evaluate real answers against stored answer key
// @route   POST /api/exam-proctor/submit, POST /api/assessments/:assessmentId/submit
const submitSecureExam = async (req, res) => {
  try {
    const {
      assessmentId = "full-pattern-test",
      attemptNumber = 1,
      answers = {},
      codingAnswers = {},
      codingLanguages = {},
      screenShareGranted = false,
      ipAddress = req.ip || "127.0.0.1",
      browserUsed = req.headers["user-agent"] || "Chrome / Web",
      tabSwitches = 0,
      devToolsCount = 0,
      cameraInterruptionCount = 0,
      networkInterruptionCount = 0,
    } = req.body;
    const userId = req.user._id;

    // Idempotency: Check if an AssessmentSubmission already exists for this attempt
    const existingSubmission = await AssessmentSubmission.findOne({
      userId,
      assessmentId,
      attemptNumber: Number(attemptNumber) || 1,
    });

    if (existingSubmission) {
      return res.json({
        success: true,
        submissionId: existingSubmission._id,
        feedback: {
          examTitle: "Full Pattern Mock Assessment",
          completedAt: new Date(existingSubmission.completedAt || existingSubmission.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          attemptNumber: existingSubmission.attemptNumber,
          maxAttempts: 3,
          timeSpentFormatted: formatDuration(existingSubmission.timeSpentSeconds || 3100),
          timeSpentSeconds: existingSubmission.timeSpentSeconds || 3100,
          totalQuestions: 42,
          score: existingSubmission.score,
          maxScore: existingSubmission.maxScore || 60,
          percentage: existingSubmission.percentage,
          passed: existingSubmission.passed,
          integrityScore: existingSubmission.integrityScore,
          auditStatus: existingSubmission.reviewStatus,
          ipAddress: "Masked",
          tabSwitches: existingSubmission.tabSwitches || 0,
          devToolsCount: existingSubmission.devToolsCount || 0,
          cameraInterruptions: existingSubmission.cameraInterruptionCount || 0,
          screenShareInterruptions: 0,
          networkInterruptions: existingSubmission.networkInterruptionCount || 0,
          sectionScores: existingSubmission.sectionScores || {},
          aiRecommendations: existingSubmission.aiRecommendations || {},
          reviewData: existingSubmission.reviewData || [],
          emailSent: true,
          emailMessage: "Scorecard dispatched to your registered email address.",
        },
      });
    }

    // Find active exam session with the stored questions and answer keys
    let session = await ExamSession.findOne({
      studentId: userId,
      assessmentId,
      attemptNumber: Number(attemptNumber) || 1,
    }).sort({ createdAt: -1 });

    let fullBank = session?.questions || getCuratedDefaultBank(attemptNumber);
    const startedAt = session?.startedAt ? new Date(session.startedAt) : new Date(Date.now() - 3600000);
    const submittedAt = new Date();
    const timeSpentSeconds = Math.max(10, Math.round((submittedAt.getTime() - startedAt.getTime()) / 1000));
    const timeSpentFormatted = formatDuration(timeSpentSeconds);

    // Fixed 60 Marks Schema
    const sectionMetrics = {
      Aptitude: { questions: 10, answered: 0, correct: 0, incorrect: 0, unanswered: 10, score: 0, maximumScore: 10, percentage: 0 },
      Reasoning: { questions: 10, answered: 0, correct: 0, incorrect: 0, unanswered: 10, score: 0, maximumScore: 10, percentage: 0 },
      Verbal: { questions: 10, answered: 0, correct: 0, incorrect: 0, unanswered: 10, score: 0, maximumScore: 10, percentage: 0 },
      "Pseudo Code": { questions: 10, answered: 0, correct: 0, incorrect: 0, unanswered: 10, score: 0, maximumScore: 10, percentage: 0 },
      Coding: { questions: 2, answered: 0, correct: 0, incorrect: 0, unanswered: 2, score: 0, maximumScore: 20, percentage: 0 },
    };

    // Helper map of candidate's selected answers
    const answersMap = {};
    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        if (ans.section && ans.questionIndex !== undefined) {
          answersMap[`${ans.section}_${ans.questionIndex}`] = ans.selectedOptionIndex;
        } else if (ans.questionId) {
          answersMap[ans.questionId] = ans.selectedOptionIndex;
        }
      });
    } else if (typeof answers === "object") {
      Object.assign(answersMap, answers);
    }

    const reviewData = [];

    // Evaluate MCQ sections (Aptitude, Reasoning, Verbal, Pseudo Code)
    const evaluateSection = (secName, bankList) => {
      const metrics = sectionMetrics[secName];
      (bankList || []).forEach((q, idx) => {
        const studentAns = answersMap[`${secName}_${idx}`] !== undefined
          ? answersMap[`${secName}_${idx}`]
          : answersMap[q.id];

        const correctIdx = q.correctIndex !== undefined ? q.correctIndex : 0;
        const isAttempted = studentAns !== undefined && studentAns !== null;
        const isCorrect = isAttempted && Number(studentAns) === Number(correctIdx);

        if (isAttempted) {
          metrics.answered += 1;
          metrics.unanswered -= 1;
          if (isCorrect) {
            metrics.correct += 1;
            metrics.score += 1;
          } else {
            metrics.incorrect += 1;
          }
        }

        reviewData.push({
          section: secName,
          questionNumber: idx + 1,
          id: q.id || `${secName}_${idx + 1}`,
          topic: q.topic || "General",
          question: q.question || q.description || "",
          codeSnippet: q.codeSnippet || null,
          options: (q.options || []).map((opt) => (typeof opt === "string" ? opt : opt.text || "")),
          studentAnswerIndex: isAttempted ? studentAns : null,
          studentAnswerText: isAttempted && q.options[studentAns] ? (typeof q.options[studentAns] === "string" ? q.options[studentAns] : q.options[studentAns].text) : "Not Attempted",
          correctAnswerIndex: correctIdx,
          correctAnswerText: q.options[correctIdx] ? (typeof q.options[correctIdx] === "string" ? q.options[correctIdx] : q.options[correctIdx].text) : "",
          isCorrect,
          status: isCorrect ? "Correct" : isAttempted ? "Wrong" : "Unanswered",
          marksEarned: isCorrect ? 1 : 0,
          maxMarks: 1,
          explanation: q.explanation || "Review standard domain principles for this problem.",
        });
      });
      metrics.percentage = Number(((metrics.score / metrics.maximumScore) * 100).toFixed(2));
    };

    evaluateSection("Aptitude", fullBank.sections?.aptitude);
    evaluateSection("Reasoning", fullBank.sections?.reasoning);
    evaluateSection("Verbal", fullBank.sections?.verbal);
    evaluateSection("Pseudo Code", fullBank.sections?.pseudoCode);

    // Evaluate Coding Section (Real Sandboxed Code Evaluation)
    const codingList = fullBank.sections?.coding || [];
    for (let idx = 0; idx < codingList.length; idx++) {
      const c = codingList[idx];
      const submittedCode = codingAnswers[c.id] || codingAnswers[`Coding_${idx}`] || "";
      const lang = codingLanguages[c.id] || "java";
      const testCases = c.testCases || [
        { input: "sample in", output: "sample out", isHidden: false }
      ];

      let codingScore = 0;
      let evalStatus = "Not Attempted";
      let testResults = [];
      const hasCode = typeof submittedCode === "string" && submittedCode.trim().length > 30;

      if (hasCode) {
        sectionMetrics.Coding.answered += 1;
        sectionMetrics.Coding.unanswered -= 1;

        try {
          const evalResult = await runTestCases({
            language: lang,
            code: submittedCode,
            testCases,
          });

          evalStatus = evalResult.status;
          testResults = evalResult.testResults || [];
          const passedCount = evalResult.passedTestCases || 0;
          const totalCount = evalResult.totalTestCases || testCases.length;

          // 10 Marks per coding problem proportional to passed test cases
          codingScore = totalCount > 0 ? Math.round((passedCount / totalCount) * 10) : 0;
          if (codingScore >= 5) {
            sectionMetrics.Coding.correct += 1;
          } else {
            sectionMetrics.Coding.incorrect += 1;
          }
        } catch (execErr) {
          evalStatus = "Runtime Error";
          codingScore = 0;
        }
      }

      sectionMetrics.Coding.score += codingScore;

      reviewData.push({
        section: "Coding",
        questionNumber: idx + 1,
        id: c.id || `c_${idx + 1}`,
        topic: c.topic || "Algorithms",
        title: c.title || `Coding Challenge ${idx + 1}`,
        description: c.description || "",
        inputFormat: c.inputFormat || "",
        outputFormat: c.outputFormat || "",
        constraints: c.constraints || [],
        studentCode: submittedCode || "// No code submitted",
        language: lang,
        status: evalStatus,
        isCorrect: codingScore >= 5,
        marksEarned: codingScore,
        maxMarks: 10,
        testResults,
        explanation: `Coding challenge evaluates algorithmic edge cases across ${testCases.length} test cases.`,
      });
    }

    sectionMetrics.Coding.percentage = Number(((sectionMetrics.Coding.score / sectionMetrics.Coding.maximumScore) * 100).toFixed(2));

    // Aggregate Total Marks out of 60
    const totalQuestions = 42;
    const answeredQuestions =
      sectionMetrics.Aptitude.answered +
      sectionMetrics.Reasoning.answered +
      sectionMetrics.Verbal.answered +
      sectionMetrics["Pseudo Code"].answered +
      sectionMetrics.Coding.answered;

    const correctAnswers =
      sectionMetrics.Aptitude.correct +
      sectionMetrics.Reasoning.correct +
      sectionMetrics.Verbal.correct +
      sectionMetrics["Pseudo Code"].correct +
      sectionMetrics.Coding.correct;

    const incorrectAnswers =
      sectionMetrics.Aptitude.incorrect +
      sectionMetrics.Reasoning.incorrect +
      sectionMetrics.Verbal.incorrect +
      sectionMetrics["Pseudo Code"].incorrect +
      sectionMetrics.Coding.incorrect;

    const unansweredQuestions = totalQuestions - answeredQuestions;
    const totalScore =
      sectionMetrics.Aptitude.score +
      sectionMetrics.Reasoning.score +
      sectionMetrics.Verbal.score +
      sectionMetrics["Pseudo Code"].score +
      sectionMetrics.Coding.score;

    const maximumScore = 60; // 10 + 10 + 10 + 10 + 20 = 60 Marks
    const percentage = Number(((totalScore / maximumScore) * 100).toFixed(2));
    const passed = percentage >= 50;

    // Real Integrity Score Calculation from Events
    const recordedEvents = await ExamIntegrityEvent.find({
      studentId: userId,
      attemptNumber: Number(attemptNumber) || 1,
    });

    let realIntegrity = 100;
    let actualDevTools = Number(devToolsCount) || 0;
    let actualTabSwitches = Number(tabSwitches) || 0;
    let actualCameraDrops = Number(cameraInterruptionCount) || 0;
    let actualScreenDrops = 0;
    let actualNetworkDrops = Number(networkInterruptionCount) || 0;

    recordedEvents.forEach((evt) => {
      if (evt.eventType === "DEVTOOLS_OPENED") {
        realIntegrity -= 25;
        actualDevTools++;
      } else if (evt.eventType === "SCREEN_SHARE_STOPPED" || evt.eventType === "SCREEN_SHARE_INTERRUPTED") {
        realIntegrity -= 20;
        actualScreenDrops++;
      } else if (evt.eventType === "CAMERA_DISABLED" || evt.eventType === "CAMERA_ABSENCE" || evt.eventType === "CAMERA_INTERRUPTED") {
        realIntegrity -= 15;
        actualCameraDrops++;
      } else if (evt.eventType === "FULLSCREEN_EXIT") {
        realIntegrity -= 10;
      } else if (evt.eventType === "TAB_SWITCH" || evt.eventType === "FOCUS_LOSS") {
        realIntegrity -= 5;
        actualTabSwitches++;
      } else if (evt.eventType === "NETWORK_OFFLINE") {
        actualNetworkDrops++;
      }
    });

    const finalIntegrityScore = Math.max(10, Math.min(100, realIntegrity));

    // Dynamic Audit Status
    let auditStatus = "Verified Clean";
    if (actualDevTools > 0 || finalIntegrityScore < 60) {
      auditStatus = "Critical Review";
    } else if (finalIntegrityScore < 75) {
      auditStatus = "Warning";
    } else if (finalIntegrityScore < 90 || actualTabSwitches > 0) {
      auditStatus = "Needs Review";
    }

    // Historical Attempts from Database
    const previousSubmissions = await AssessmentSubmission.find({
      userId,
      $or: [{ assessmentId }, { assessmentId: "full-pattern-test" }],
    }).sort({ attemptNumber: 1 });

    const attemptsHistory = previousSubmissions.map((sub) => ({
      attemptNumber: sub.attemptNumber,
      completedDate: new Date(sub.completedAt || sub.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      score: `${sub.percentage}%`,
      rawScore: `${sub.score} / ${sub.maxScore || 60}`,
      integrityScore: `${sub.integrityScore}%`,
      reviewStatus: sub.reviewStatus || "Verified Clean",
      timeSpent: formatDuration(sub.timeSpentSeconds || 3100),
    }));

    const currentCompletedDate = submittedAt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    attemptsHistory.push({
      attemptNumber: Number(attemptNumber) || 1,
      completedDate: currentCompletedDate,
      score: `${percentage}%`,
      rawScore: `${totalScore} / ${maximumScore}`,
      integrityScore: `${finalIntegrityScore}%`,
      auditStatus,
      timeSpent: timeSpentFormatted,
    });

    // AI Performance Analysis via Groq
    let aiRecommendations = {
      strengths: [],
      weaknesses: [],
      actionableTips: [],
      verdict: passed
        ? "Placement Benchmark Standard Achieved"
        : "Focused Remediation Recommended Before Next Drive",
    };

    const groq = getGroqClient();
    if (groq) {
      try {
        const perfPrompt = `A candidate completed a 42-question placement assessment (Max Marks: 60).
Section Scores:
- Aptitude: ${sectionMetrics.Aptitude.score}/${sectionMetrics.Aptitude.maximumScore} (${sectionMetrics.Aptitude.percentage}%)
- Reasoning: ${sectionMetrics.Reasoning.score}/${sectionMetrics.Reasoning.maximumScore} (${sectionMetrics.Reasoning.percentage}%)
- Verbal: ${sectionMetrics.Verbal.score}/${sectionMetrics.Verbal.maximumScore} (${sectionMetrics.Verbal.percentage}%)
- Pseudo Code: ${sectionMetrics["Pseudo Code"].score}/${sectionMetrics["Pseudo Code"].maximumScore} (${sectionMetrics["Pseudo Code"].percentage}%)
- Coding: ${sectionMetrics.Coding.score}/${sectionMetrics.Coding.maximumScore} (${sectionMetrics.Coding.percentage}%)
- Total Score: ${totalScore}/${maximumScore} (${percentage}%)

Return ONLY a JSON object:
{
  "strengths": ["Top strength with specific area", "Second strength"],
  "weaknesses": ["Primary weakness with specific topic", "Second weakness"],
  "actionableTips": ["Specific recommendation 1", "Specific recommendation 2", "Next assessment target"],
  "verdict": "Clear 1-sentence verdict"
}`;

        const aiRes = await groq.chat.completions.create({
          messages: [{ role: "user", content: perfPrompt }],
          model: "openai/gpt-oss-20b",
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        let rawText = aiRes.choices[0]?.message?.content || "";
        rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        const parsedAI = JSON.parse(rawText);
        if (parsedAI.strengths && parsedAI.weaknesses) {
          aiRecommendations = parsedAI;
        }
      } catch (aiErr) {
        console.warn("[Groq Performance Analysis notice]:", aiErr.message);
      }
    }

    if (aiRecommendations.strengths.length === 0) {
      const sortedSecs = Object.entries(sectionMetrics).sort((a, b) => b[1].percentage - a[1].percentage);
      aiRecommendations.strengths = [
        `Highest accuracy demonstrated in ${sortedSecs[0][0]} (${sortedSecs[0][1].percentage}%).`,
        `Solid execution in ${sortedSecs[1][0]} (${sortedSecs[1][1].percentage}%).`,
      ];
      aiRecommendations.weaknesses = [
        `Area needing greatest reinforcement: ${sortedSecs[sortedSecs.length - 1][0]} (${sortedSecs[sortedSecs.length - 1][1].percentage}%).`,
        `Secondary review needed: ${sortedSecs[sortedSecs.length - 2][0]} (${sortedSecs[sortedSecs.length - 2][1].percentage}%).`,
      ];
      aiRecommendations.actionableTips = [
        `Complete 5 targeted practice modules in ${sortedSecs[sortedSecs.length - 1][0]}.`,
        `Target 75%+ score on your next mock assessment attempt.`,
      ];
    }

    // Mark session as completed
    if (session) {
      session.isCompleted = true;
      session.submittedAt = submittedAt;
      session.durationSeconds = timeSpentSeconds;
      await session.save();
    }

    // Save AssessmentSubmission in Database with full question reviewData
    const submission = await AssessmentSubmission.create({
      assessmentId: assessmentId,
      userId,
      attemptNumber: Number(attemptNumber) || 1,
      score: totalScore,
      maxScore: maximumScore,
      percentage,
      percentile: Math.min(99, Math.max(10, Math.round(percentage * 0.95))),
      passed,
      integrityScore: finalIntegrityScore,
      reviewStatus: auditStatus,
      screenShareGranted,
      ipAddress: String(ipAddress),
      browserUsed: String(browserUsed),
      tabSwitches: actualTabSwitches,
      devToolsCount: actualDevTools,
      cameraInterruptionCount: actualCameraDrops,
      networkInterruptionCount: actualNetworkDrops,
      sectionScores: sectionMetrics,
      answers,
      codingAnswers,
      reviewData,
      timeSpentSeconds,
      startTime: startedAt,
      endTime: submittedAt,
      completedAt: submittedAt,
      aiRecommendations,
    });

    // Update Student Profile Intelligence
    const userProfile = await StudentProfile.findOne({ user: userId });
    if (userProfile) {
      userProfile.assessmentScore = percentage;
      userProfile.readinessScore = Math.min(100, Math.round((userProfile.readinessScore || 50) * 0.4 + percentage * 0.6));
      await userProfile.save();
    }

    // Send Real Scorecard Email
    const user = req.user;
    let emailSent = false;
    try {
      const emailResult = await sendExamResultEmail({
        to: user.email,
        name: user.name || "Student Candidate",
        examTitle: "Full Pattern Mock Assessment",
        score: totalScore,
        maxScore: maximumScore,
        percentage,
        passed,
        integrityScore: finalIntegrityScore,
        timeSpentFormatted,
        sectionScores: sectionMetrics,
        attemptNumber: Number(attemptNumber) || 1,
      });
      emailSent = emailResult?.success === true;
    } catch (eErr) {
      console.warn("[Email dispatch notice]:", eErr.message);
      emailSent = false;
    }

    return res.json({
      success: true,
      submissionId: submission._id,
      feedback: {
        examTitle: "Full Pattern Mock Assessment",
        completedAt: submittedAt.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        attemptNumber: Number(attemptNumber) || 1,
        maxAttempts: 3,
        timeSpentFormatted,
        timeSpentSeconds,
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
        score: totalScore,
        maxScore: maximumScore,
        percentage,
        passed,
        integrityScore: finalIntegrityScore,
        auditStatus,
        ipAddress: "Masked",
        tabSwitches: actualTabSwitches,
        devToolsCount: actualDevTools,
        cameraInterruptions: actualCameraDrops,
        screenShareInterruptions: actualScreenDrops,
        networkInterruptions: actualNetworkDrops,
        sectionScores: sectionMetrics,
        aiRecommendations,
        reviewData,
        attemptHistory: attemptsHistory,
        emailSent,
        emailMessage: emailSent
          ? "Scorecard dispatched to your registered email address."
          : "Scorecard email could not be delivered.",
      },
    });
  } catch (err) {
    console.error("Submit secure exam error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get complete question review for an attempt
// @route   GET /api/exam-proctor/review/:attemptId, GET /api/assessments/attempts/:attemptId/review
const getAttemptReview = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    let submission = null;
    if (attemptId.match(/^[0-9a-fA-F]{24}$/)) {
      submission = await AssessmentSubmission.findById(attemptId);
    } else {
      submission = await AssessmentSubmission.findOne({
        userId,
        attemptNumber: Number(attemptId) || 1,
      }).sort({ createdAt: -1 });
    }

    if (!submission) {
      submission = await AssessmentSubmission.findOne({ userId }).sort({ createdAt: -1 });
    }

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    // Authorization: Student can only review their own submission unless faculty
    if (submission.userId.toString() !== userId.toString() && req.user.role !== "faculty" && req.user.role !== "placement_coordinator" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to review this candidate's assessment." });
    }

    return res.json({
      success: true,
      examTitle: "Full Pattern Mock Assessment",
      attemptNumber: submission.attemptNumber,
      score: submission.score,
      maxScore: submission.maxScore || 60,
      percentage: submission.percentage,
      timeSpentFormatted: formatDuration(submission.timeSpentSeconds || 3600),
      integrityScore: submission.integrityScore,
      auditStatus: submission.reviewStatus,
      completedAt: new Date(submission.completedAt || submission.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sectionScores: submission.sectionScores,
      reviewData: submission.reviewData || [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get real historical attempt results from DB with authorization check
// @route   GET /api/exam-proctor/history/:assessmentId, GET /api/assessments/attempts/:attemptId/result
const getAttemptHistory = async (req, res) => {
  try {
    const { assessmentId = "full-pattern-test" } = req.params;
    const userId = req.user._id;

    const submissions = await AssessmentSubmission.find({
      userId,
      $or: [{ assessmentId }, { assessmentId: "full-pattern-test" }],
    }).sort({ attemptNumber: 1 });

    const attempts = submissions.map((sub) => ({
      submissionId: sub._id,
      attemptNumber: sub.attemptNumber,
      completedDate: new Date(sub.completedAt || sub.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      score: `${sub.percentage}%`,
      rawScore: `${sub.score} / ${sub.maxScore || 60}`,
      integrityScore: `${sub.integrityScore}%`,
      reviewStatus: sub.reviewStatus || "Verified Clean",
      timeSpent: formatDuration(sub.timeSpentSeconds || 3100),
      sectionScores: sub.sectionScores,
      aiRecommendations: sub.aiRecommendations,
      hasReview: Array.isArray(sub.reviewData) && sub.reviewData.length > 0,
    }));

    return res.json({
      success: true,
      attempts,
      latestResult: submissions.length > 0 ? submissions[submissions.length - 1] : null,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Faculty audit analytics with full telemetry and unmasked IP
// @route   GET /api/exam-proctor/faculty/analytics/:assessmentId
const getFacultyExamAnalytics = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const submissions = await AssessmentSubmission.find({
      $or: [{ assessmentId }, { assessmentId: "full-pattern-test" }],
    })
      .populate("userId", "name email rollNumber department")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      submissions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  startExamSession,
  logIntegrityEvent,
  autoSaveSession,
  submitSecureExam,
  getAttemptReview,
  getAttemptHistory,
  getFacultyExamAnalytics,
};

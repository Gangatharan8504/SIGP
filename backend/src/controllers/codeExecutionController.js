const CodingProblem = require("../models/CodingProblem");
const CodingSubmission = require("../models/CodingSubmission");
const SavedCode = require("../models/SavedCode");
const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const { emitStudentActivityEvent } = require("../services/eventService");
const {
  COMPILER_MAP,
  executeCode,
  runTestCases,
  generateAiCodeReview,
  getAiCodingAssistantResponse,
} = require("../services/codeExecutionService");
const { seedCodingProblems } = require("../services/codingProblemSeed");

// Seed default problems on startup
seedCodingProblems().catch(() => {});

// @desc    Get all coding problems with filter and user solved status
// @route   GET /api/code/problems
const getPracticeProblems = async (req, res) => {
  try {
    const { category, difficulty, topic, search } = req.query;
    const userId = req.user?._id;

    let query = { status: "Published" };
    if (category && category !== "All") query.category = category;
    if (difficulty && difficulty !== "All") query.difficulty = difficulty;
    if (topic && topic !== "All") query.topics = topic;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const problems = await CodingProblem.find(query).select(
      "-testCases.isHidden -__v"
    ).sort({ createdAt: 1 });

    // Mark problems that this student has already solved
    let solvedProblemIds = new Set();
    if (userId) {
      const acceptedSubs = await CodingSubmission.find({
        studentId: userId,
        status: "Accepted",
      }).distinct("problemId");
      solvedProblemIds = new Set(acceptedSubs.map((id) => id.toString()));
    }

    const problemsWithSolved = problems.map((p) => ({
      _id: p._id,
      id: p._id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      category: p.category,
      topics: p.topics,
      skillsTested: p.skillsTested,
      acceptedCount: p.acceptedCount,
      submissionCount: p.submissionCount,
      isSolved: solvedProblemIds.has(p._id.toString()),
    }));

    return res.json({
      success: true,
      count: problemsWithSolved.length,
      problems: problemsWithSolved,
      languages: Object.keys(COMPILER_MAP).map((k) => ({
        id: k,
        name: COMPILER_MAP[k].name,
        ext: COMPILER_MAP[k].ext,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get problem details by ID or Slug with starter codes and public examples
// @route   GET /api/code/problems/:id
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    let problem = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await CodingProblem.findById(id);
    } else {
      problem = await CodingProblem.findOne({ slug: id });
    }

    if (!problem) {
      // Fallback to first problem if id not found
      problem = await CodingProblem.findOne();
    }

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Strip hidden test cases before sending to client
    const publicTestCases = (problem.testCases || [])
      .filter((tc) => !tc.isHidden)
      .map((tc, idx) => ({
        caseNumber: idx + 1,
        input: tc.input,
        output: tc.output,
        explanation: tc.explanation || "",
      }));

    return res.json({
      success: true,
      problem: {
        _id: problem._id,
        id: problem._id,
        title: problem.title,
        slug: problem.slug,
        description: problem.description,
        difficulty: problem.difficulty,
        category: problem.category,
        topics: problem.topics,
        skillsTested: problem.skillsTested,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        examples: problem.examples,
        starterCode: problem.starterCode,
        publicTestCases,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitMb: problem.memoryLimitMb,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Run code in sandbox against custom standard input (RUN button)
// @route   POST /api/code/run
const runCode = async (req, res) => {
  try {
    const { language = "java", code, stdin = "", problemId } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, message: "Source code is required" });
    }

    const executionResult = await executeCode({
      language,
      code,
      stdin,
    });

    return res.json({
      success: true,
      ...executionResult,
    });
  } catch (error) {
    console.error("Run code error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit code against full test case suite & update skill intelligence (SUBMIT button)
// @route   POST /api/code/problems/:id/submit, POST /api/code/submit
const submitSolution = async (req, res) => {
  try {
    const problemId = req.params.id || req.body.problemId;
    const { language = "java", code } = req.body;
    const userId = req.user?._id;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, message: "Source code is required" });
    }

    let problem = null;
    if (problemId && problemId.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await CodingProblem.findById(problemId);
    } else if (problemId) {
      problem = await CodingProblem.findOne({ slug: problemId });
    }

    if (!problem) {
      problem = await CodingProblem.findOne();
    }

    const testCases = problem?.testCases || [
      { input: "2 7 11 15\n9", output: "0 1", isHidden: false },
      { input: "3 2 4\n6", output: "1 2", isHidden: false },
      { input: "3 3\n6", output: "0 1", isHidden: false },
    ];

    // Execute test cases suite
    const evaluation = await runTestCases({
      language,
      code,
      testCases,
    });

    // Generate AI Review
    const aiReview = await generateAiCodeReview({
      problemTitle: problem?.title || "Coding Challenge",
      problemDescription: problem?.description || "",
      language,
      sourceCode: code,
      status: evaluation.status,
      testResults: evaluation.testResults,
    });

    // Record Submission in Database if user logged in
    let submission = null;
    if (userId && problem) {
      submission = await CodingSubmission.create({
        studentId: userId,
        problemId: problem._id,
        problemTitle: problem.title,
        language,
        sourceCode: code,
        status: evaluation.status,
        score: evaluation.score,
        totalTestCases: evaluation.totalTestCases,
        passedTestCases: evaluation.passedTestCases,
        runtimeMs: evaluation.runtimeMs,
        memoryMb: evaluation.memoryMb,
        stdout: evaluation.testResults[0]?.actualOutput || "",
        compileError: evaluation.compileError || "",
        testResults: evaluation.testResults,
        aiReview,
      });

      // Increment problem stats
      problem.submissionCount += 1;
      if (evaluation.status === "Accepted") {
        problem.acceptedCount += 1;
      }
      await problem.save();

      // Update Student Profile & Skills
      if (evaluation.status === "Accepted") {
        const studentProf = await StudentProfile.findOne({ user: userId });
        if (studentProf) {
          studentProf.codingProblemsSolved = (studentProf.codingProblemsSolved || 0) + 1;
          studentProf.readinessScore = Math.min(100, (studentProf.readinessScore || 50) + 2);
          await studentProf.save();
        }

        // Update DSA Skills Evidence
        const dsaSkill = await StudentSkill.findOne({ student: userId, skillName: "Data Structures & Algorithms" });
        if (dsaSkill) {
          dsaSkill.verifiedScore = Math.min(100, (dsaSkill.verifiedScore || 60) + 3);
          dsaSkill.status = "Verified";
          await dsaSkill.save();
        }

        emitStudentActivityEvent(userId, "CODING_PROBLEM_SOLVED", {
          problemTitle: problem.title,
          difficulty: problem.difficulty,
          language,
        });
      }
    }

    return res.json({
      success: true,
      submissionId: submission?._id,
      status: evaluation.status,
      score: evaluation.score,
      passedTestCases: evaluation.passedTestCases,
      totalTestCases: evaluation.totalTestCases,
      runtimeMs: evaluation.runtimeMs,
      memoryMb: evaluation.memoryMb,
      compileError: evaluation.compileError,
      testResults: evaluation.testResults,
      aiReview,
    });
  } catch (error) {
    console.error("Submit solution error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save draft code without submitting
// @route   POST /api/code/save
const saveDraftCode = async (req, res) => {
  try {
    const { problemId, language = "java", sourceCode } = req.body;
    const userId = req.user._id;

    if (!problemId || !sourceCode) {
      return res.status(400).json({ success: false, message: "problemId and sourceCode are required" });
    }

    const saved = await SavedCode.findOneAndUpdate(
      { studentId: userId, problemId, language },
      { sourceCode, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, message: "Code draft saved safely.", savedAt: saved.updatedAt });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved draft code
// @route   GET /api/code/saved/:problemId
const getSavedDraftCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { language } = req.query;
    const userId = req.user._id;

    let query = { studentId: userId, problemId };
    if (language) query.language = language;

    const saved = await SavedCode.findOne(query).sort({ updatedAt: -1 });
    return res.json({ success: true, savedCode: saved ? saved.sourceCode : null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's submission history
// @route   GET /api/code/submissions/my
const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.query;

    let query = { studentId: userId };
    if (problemId) query.problemId = problemId;

    const submissions = await CodingSubmission.find(query)
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Groq AI Coding Assistant (Explain, Hint, Error Diagnostic, Complexity Analysis)
// @route   POST /api/code/ai/assist
const getAiCodingAssistant = async (req, res) => {
  try {
    const { action, problemId, code, errorText, language } = req.body;

    let problem = null;
    if (problemId && problemId.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await CodingProblem.findById(problemId);
    } else {
      problem = { title: "Current Problem", description: "Algorithm implementation challenge." };
    }

    const aiRes = await getAiCodingAssistantResponse({
      action: action || "explainProblem",
      problem,
      code: code || "",
      errorText: errorText || "",
      language: language || "java",
    });

    return res.json({ success: true, ...aiRes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPracticeProblems,
  getProblemById,
  runCode,
  submitSolution,
  saveDraftCode,
  getSavedDraftCode,
  getMySubmissions,
  getAiCodingAssistant,
};

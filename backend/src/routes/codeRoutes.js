const express = require("express");
const {
  getPracticeProblems,
  getProblemById,
  runCode,
  submitSolution,
  saveDraftCode,
  getSavedDraftCode,
  getMySubmissions,
  getAiCodingAssistant,
} = require("../controllers/codeExecutionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Problem browsing and custom stdin runner
router.get("/problems", getPracticeProblems);
router.get("/problems/:id", getProblemById);
router.post("/run", runCode);

// Protected student submission, draft saving, history, and AI assistant
router.post("/submit", protect, submitSolution);
router.post("/problems/:id/submit", protect, submitSolution);
router.post("/save", protect, saveDraftCode);
router.get("/saved/:problemId", protect, getSavedDraftCode);
router.get("/submissions/my", protect, getMySubmissions);
router.post("/ai/assist", protect, getAiCodingAssistant);

module.exports = router;

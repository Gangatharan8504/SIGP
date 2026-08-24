const express = require("express");
const {
  getAssessments,
  getAssessmentById,
  generateAIAssessment,
  submitAssessment,
  getMySubmissions,
} = require("../controllers/assessmentController");
const {
  startExamSession,
  getAttemptHistory,
} = require("../controllers/examProctorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAssessments);
router.post("/generate-ai", protect, generateAIAssessment);
router.post("/:assessmentId/generate", protect, startExamSession);
router.get("/attempts/:attemptId/result", protect, getAttemptHistory);
router.get("/submissions/my", protect, getMySubmissions);
router.get("/:id", protect, getAssessmentById);
router.post("/:id/submit", protect, submitAssessment);

module.exports = router;

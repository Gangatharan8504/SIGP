const express = require("express");
const {
  startExamSession,
  logIntegrityEvent,
  autoSaveSession,
  submitSecureExam,
  getAttemptReview,
  getAttemptHistory,
  getFacultyExamAnalytics,
} = require("../controllers/examProctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/session/start", protect, startExamSession);
router.post("/events/log", protect, logIntegrityEvent);
router.post("/autosave", protect, autoSaveSession);
router.post("/submit", protect, submitSecureExam);
router.get("/review/:attemptId", protect, getAttemptReview);
router.get("/history/:assessmentId", protect, getAttemptHistory);
router.get(
  "/faculty/analytics/:assessmentId",
  protect,
  authorize("faculty", "placement_coordinator", "admin", "FACULTY", "PLACEMENT_COORDINATOR", "ADMIN"),
  getFacultyExamAnalytics
);

module.exports = router;

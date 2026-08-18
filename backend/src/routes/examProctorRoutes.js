const express = require("express");
const {
  startExamSession,
  logIntegrityEvent,
  submitSecureExam,
} = require("../controllers/examProctorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/session/start", protect, startExamSession);
router.post("/events/log", protect, logIntegrityEvent);
router.post("/submit", protect, submitSecureExam);

module.exports = router;

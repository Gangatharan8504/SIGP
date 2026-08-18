const express = require("express");
const {
  runSkillGapAnalysis,
  getLatestSkillGap,
  getCareerRecommendations,
  chatWithAgent,
} = require("../controllers/aiAnalysisController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/skill-gap", protect, runSkillGapAnalysis);
router.get("/skill-gap/latest", protect, getLatestSkillGap);
router.get("/career-recommendations", protect, getCareerRecommendations);
router.post("/agent/chat", protect, chatWithAgent);

module.exports = router;

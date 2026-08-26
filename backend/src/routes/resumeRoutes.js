const express = require("express");
const {
  uploadAndAnalyzeResume,
  getLatestAnalysis,
  downloadAtsResumePdf,
  generateSummary,
  improveProject,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), uploadAndAnalyzeResume);
router.get("/latest-analysis", protect, getLatestAnalysis);
router.post("/ai-summary", protect, generateSummary);
router.post("/ai-improve-project", protect, improveProject);
router.get("/download-pdf", protect, downloadAtsResumePdf);
router.post("/download-pdf", protect, downloadAtsResumePdf);

module.exports = router;

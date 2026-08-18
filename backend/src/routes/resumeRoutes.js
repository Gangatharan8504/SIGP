const express = require("express");
const { uploadAndAnalyzeResume, getLatestAnalysis, downloadAtsResumePdf } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), uploadAndAnalyzeResume);
router.get("/latest-analysis", protect, getLatestAnalysis);
router.get("/download-pdf", protect, downloadAtsResumePdf);
router.post("/download-pdf", protect, downloadAtsResumePdf);

module.exports = router;

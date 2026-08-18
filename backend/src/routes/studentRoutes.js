const express = require("express");
const {
  getProfile,
  updateProfile,
  getAcademics,
  saveAcademics,
  getProfileAuditHistory,
  getDashboardSummary,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/profile/audit-history", protect, getProfileAuditHistory);
router.get("/academics", protect, getAcademics);
router.post("/academics", protect, saveAcademics);
router.get("/dashboard-summary", protect, getDashboardSummary);

module.exports = router;
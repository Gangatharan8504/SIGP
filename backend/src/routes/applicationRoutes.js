const express = require("express");
const {
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMyApplications);
router.get("/all", protect, authorize("admin", "ADMIN", "FACULTY", "PLACEMENT_COORDINATOR"), getAllApplications);
router.patch("/:id/status", protect, authorize("admin", "ADMIN", "FACULTY", "PLACEMENT_COORDINATOR"), updateApplicationStatus);

module.exports = router;

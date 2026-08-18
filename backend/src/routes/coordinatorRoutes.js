const express = require("express");
const {
  getCoordinatorDashboard,
  getCompanyReadinessMatrix,
  getReadinessWeights,
  updateReadinessWeights,
} = require("../controllers/coordinatorController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const coordinatorOnly = [
  protect,
  authorize("placement_coordinator", "PLACEMENT_COORDINATOR", "admin", "ADMIN"),
];

router.get("/dashboard", ...coordinatorOnly, getCoordinatorDashboard);
router.get("/readiness-matrix", ...coordinatorOnly, getCompanyReadinessMatrix);
router.get("/readiness-weights", protect, getReadinessWeights);
router.put("/readiness-weights", ...coordinatorOnly, updateReadinessWeights);

module.exports = router;

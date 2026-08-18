const express = require("express");
const { getMyPlan, toggleTask, regeneratePlan } = require("../controllers/learningPlanController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my-plan", protect, getMyPlan);
router.patch("/task-toggle", protect, toggleTask);
router.post("/regenerate", protect, regeneratePlan);

module.exports = router;

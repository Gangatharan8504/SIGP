const express = require("express");
const {
  getFacultyDashboard,
  executeIntervention,
  reviewIntegrityEvent,
} = require("../controllers/facultyController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const facultyOnly = [protect, authorize("faculty", "FACULTY", "admin", "ADMIN")];

router.get("/dashboard", ...facultyOnly, getFacultyDashboard);
router.post("/interventions/execute", ...facultyOnly, executeIntervention);
router.patch("/integrity-events/:id/review", ...facultyOnly, reviewIntegrityEvent);

module.exports = router;

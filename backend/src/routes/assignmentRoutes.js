const express = require("express");
const {
  getAssignments,
  createAssignment,
  submitAssignment,
  gradeSubmission,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.headers.authorization) return protect(req, res, next);
  next();
}, getAssignments);

router.post("/", protect, authorize("faculty", "FACULTY", "admin", "ADMIN"), createAssignment);
router.post("/:id/submit", protect, submitAssignment);
router.post("/submissions/:id/grade", protect, authorize("faculty", "FACULTY", "admin", "ADMIN"), gradeSubmission);

module.exports = router;

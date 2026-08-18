const express = require("express");
const {
  getAdminStats,
  getAdminStudents,
  getStudentDetails,
  createSkill,
  createQuestion,
  getAllQuestions,
  createAssessment,
  createCompany,
  createPlacementDrive,
  createCourse,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Allow admin roles
const adminOnly = [protect, authorize("admin", "ADMIN", "FACULTY", "PLACEMENT_COORDINATOR")];

router.get("/stats", ...adminOnly, getAdminStats);
router.get("/students", ...adminOnly, getAdminStudents);
router.get("/students/:id", ...adminOnly, getStudentDetails);
router.post("/skills", ...adminOnly, createSkill);
router.get("/questions", ...adminOnly, getAllQuestions);
router.post("/questions", ...adminOnly, createQuestion);
router.post("/assessments", ...adminOnly, createAssessment);
router.post("/companies", ...adminOnly, createCompany);
router.post("/drives", ...adminOnly, createPlacementDrive);
router.post("/courses", ...adminOnly, createCourse);

module.exports = router;

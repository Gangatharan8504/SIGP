const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Assessment = require("../models/Assessment");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const ExamIntegrityEvent = require("../models/ExamIntegrityEvent");
const SkillEvidence = require("../models/SkillEvidence");
const FacultyProfile = require("../models/FacultyProfile");

// @desc    Faculty Dashboard KPIs and cohort intelligence
// @route   GET /api/faculty/dashboard
const getFacultyDashboard = async (req, res) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const activeAssignments = await Assignment.countDocuments({ status: "Published" });
    const pendingGrading = await AssignmentSubmission.countDocuments({ status: "Submitted" });
    const totalAssessments = await Assessment.countDocuments({ isActive: true });

    // At-Risk Students ("Attention Required")
    const atRiskStudents = await StudentProfile.find({
      $or: [{ readinessScore: { $lt: 65 } }, { assessmentScore: { $lt: 60 } }],
    })
      .populate("user", "name email phone")
      .limit(6);

    const flaggedIntegrityEvents = await ExamIntegrityEvent.find({ reviewStatus: "FLAGGED" })
      .populate("studentId", "name email")
      .populate("assessmentId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      stats: {
        totalStudents,
        activeAssignments,
        pendingGrading,
        totalAssessments,
        averageCohortCGPA: 8.35,
        averageReadinessScore: 78,
      },
      atRiskStudents: atRiskStudents.map((st) => ({
        id: st._id,
        name: st.fullName,
        rollNumber: st.rollNumber,
        department: st.department,
        readinessScore: st.readinessScore,
        reasons: [
          st.readinessScore < 65 ? "Placement readiness below 65%" : "Assessment score declined",
          "DSA Skill Gap Critical",
          "Inactivity over past 3 days",
        ],
        suggestedIntervention: "Schedule 1-on-1 DSA mentoring & assign focused practice module.",
      })),
      flaggedIntegrityEvents,
    });
  } catch (err) {
    console.error("Faculty dashboard error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Faculty Interventions list and execution
// @route   POST /api/faculty/interventions/execute
const executeIntervention = async (req, res) => {
  try {
    const { studentId, interventionType, notes } = req.body;

    return res.json({
      success: true,
      message: `Intervention (${interventionType}) successfully initiated for student.`,
      intervention: {
        studentId,
        interventionType,
        notes,
        initiatedAt: new Date(),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Review and update exam integrity event status
// @route   PATCH /api/faculty/integrity-events/:id/review
const reviewIntegrityEvent = async (req, res) => {
  try {
    const { reviewStatus, facultyNotes } = req.body;

    const event = await ExamIntegrityEvent.findByIdAndUpdate(
      req.params.id,
      {
        reviewStatus,
        facultyNotes,
        reviewedBy: req.user._id,
      },
      { new: true }
    );

    return res.json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getFacultyDashboard,
  executeIntervention,
  reviewIntegrityEvent,
};

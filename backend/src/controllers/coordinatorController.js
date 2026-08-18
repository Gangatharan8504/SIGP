const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const Company = require("../models/Company");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const StudentSkill = require("../models/StudentSkill");
const ReadinessWeightConfig = require("../models/ReadinessWeightConfig");

// @desc    Placement Coordinator Dashboard
// @route   GET /api/coordinator/dashboard
const getCoordinatorDashboard = async (req, res) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const placedStudents = await StudentProfile.countDocuments({
      placementStatus: { $in: ["Placed", "PLACED"] },
    });
    const placementReadyStudents = await StudentProfile.countDocuments({
      readinessScore: { $gte: 75 },
    });
    const totalCompanies = await Company.countDocuments();
    const activeDrives = await PlacementDrive.countDocuments({
      status: { $in: ["Upcoming", "Ongoing"] },
    });
    const totalApplications = await Application.countDocuments();
    const offersReceived = await Application.countDocuments({ status: "Offered" });

    return res.json({
      success: true,
      stats: {
        totalStudents,
        placedStudents,
        placementReadyStudents,
        totalCompanies,
        activeDrives,
        totalApplications,
        offersReceived,
        placementRatePct: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Company Readiness Matrix (Students x Companies)
// @route   GET /api/coordinator/readiness-matrix
const getCompanyReadinessMatrix = async (req, res) => {
  try {
    const students = await StudentProfile.find().populate("user", "name email");
    const companies = await Company.find();

    const matrix = await Promise.all(
      students.map(async (st) => {
        const academic = await Academic.findOne({ userId: st.user?._id });
        const skills = await StudentSkill.find({ userId: st.user?._id });
        const userSkillNames = skills.map((s) => s.skillName.toLowerCase());

        const companyEvaluations = companies.map((comp) => {
          const requiredTech = comp.requiredTechStack || [];
          let matched = 0;
          requiredTech.forEach((t) => {
            if (userSkillNames.some((us) => us.includes(t.toLowerCase()))) matched++;
          });

          const skillFitPct = requiredTech.length > 0 ? Math.round((matched / requiredTech.length) * 100) : 0;
          let status = "Eligible";
          let reason = "Meets all criteria";

          if (academic?.standingArrears > 0) {
            status = "Ineligible";
            reason = "Has active standing arrears";
          } else if (academic?.cgpa < 7.5 && comp.tier === "Super Dream") {
            status = "Almost Eligible";
            reason = "CGPA below 7.5 Super Dream cutoff";
          } else if (skillFitPct < 60) {
            status = "Almost Eligible";
            reason = "Skill gap in required tech stack";
          }

          return {
            companyId: comp._id,
            companyName: comp.name,
            tier: comp.tier,
            status,
            reason,
            skillFitPct,
          };
        });

        return {
          studentId: st._id,
          name: st.fullName,
          rollNumber: st.rollNumber,
          department: st.department,
          cgpa: academic?.cgpa ?? null,
          readinessScore: st.readinessScore,
          placementStatus: st.placementStatus,
          evaluations: companyEvaluations,
        };
      })
    );

    return res.json({
      success: true,
      count: matrix.length,
      companies: companies.map((c) => ({ id: c._id, name: c.name, tier: c.tier })),
      matrix,
    });
  } catch (err) {
    console.error("Matrix error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current placement readiness weights
// @route   GET /api/coordinator/readiness-weights
const getReadinessWeights = async (req, res) => {
  try {
    const config = await ReadinessWeightConfig.getActiveConfig();
    return res.json({ success: true, config });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update placement readiness weights
// @route   PUT /api/coordinator/readiness-weights
const updateReadinessWeights = async (req, res) => {
  try {
    const {
      academicWeight,
      skillsWeight,
      assessmentWeight,
      codingWeight,
      resumeWeight,
      projectsWeight,
      consistencyWeight,
      institutionName,
    } = req.body;

    const total =
      Number(academicWeight || 0) +
      Number(skillsWeight || 0) +
      Number(assessmentWeight || 0) +
      Number(codingWeight || 0) +
      Number(resumeWeight || 0) +
      Number(projectsWeight || 0) +
      Number(consistencyWeight || 0);

    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: `Sum of all readiness weights must equal 100%. Currently sums to ${total}%.`,
      });
    }

    let config = await ReadinessWeightConfig.findOne({ isActive: true });
    if (!config) {
      config = new ReadinessWeightConfig({ isActive: true });
    }

    if (academicWeight !== undefined) config.academicWeight = Number(academicWeight);
    if (skillsWeight !== undefined) config.skillsWeight = Number(skillsWeight);
    if (assessmentWeight !== undefined) config.assessmentWeight = Number(assessmentWeight);
    if (codingWeight !== undefined) config.codingWeight = Number(codingWeight);
    if (resumeWeight !== undefined) config.resumeWeight = Number(resumeWeight);
    if (projectsWeight !== undefined) config.projectsWeight = Number(projectsWeight);
    if (consistencyWeight !== undefined) config.consistencyWeight = Number(consistencyWeight);
    if (institutionName) config.institutionName = institutionName;
    config.configuredBy = req.user._id;

    await config.save();

    return res.json({
      success: true,
      message: "Placement readiness evaluation weights updated successfully.",
      config,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCoordinatorDashboard,
  getCompanyReadinessMatrix,
  getReadinessWeights,
  updateReadinessWeights,
};

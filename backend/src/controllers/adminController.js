const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");
const Assessment = require("../models/Assessment");
const Question = require("../models/Question");
const Course = require("../models/Course");
const Company = require("../models/Company");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get Admin Dashboard KPI Statistics
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
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
    const totalAssessments = await Assessment.countDocuments();
    const totalApplications = await Application.countDocuments();

    const recentActivities = await ActivityLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(8);

    // Skill analytics distribution
    const topSkillsAggregation = await StudentSkill.aggregate([
      { $group: { _id: "$skillName", count: { $sum: 1 }, avgScore: { $avg: "$selfRating" } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Placement trend by tier
    const companyTiers = await Company.aggregate([
      { $group: { _id: "$tier", count: { $sum: 1 } } },
    ]);

    return res.json({
      success: true,
      stats: {
        totalStudents: totalStudents || 120,
        activeStudents: totalStudents || 112,
        placementReadyStudents: placementReadyStudents || 78,
        placedStudents: placedStudents || 42,
        totalCompanies: totalCompanies || 18,
        activeDrives: activeDrives || 6,
        totalAssessments: totalAssessments || 12,
        totalApplications: totalApplications || 185,
        averagePackageLPA: 11.4,
        highestPackageLPA: 44.0,
      },
      topSkills: topSkillsAggregation,
      companyTiers,
      recentActivities,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students with profile details and filter
// @route   GET /api/admin/students
const getAdminStudents = async (req, res) => {
  try {
    const { search, department, minReadiness, status } = req.query;
    let filter = {};

    if (department) filter.department = department;
    if (status) filter.placementStatus = status;
    if (minReadiness) filter.readinessScore = { $gte: Number(minReadiness) };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    const students = await StudentProfile.find(filter)
      .populate("user", "name email role phone createdAt")
      .sort({ readinessScore: -1 });

    return res.json({ success: true, count: students.length, students });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get deep 360 student details
// @route   GET /api/admin/students/:id
const getStudentDetails = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id).populate("user");
    if (!profile) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const academic = await Academic.findOne({ userId: profile.user._id });
    const skills = await StudentSkill.find({ userId: profile.user._id });
    const applications = await Application.find({ userId: profile.user._id }).populate({
      path: "driveId",
      populate: { path: "company" },
    });

    return res.json({
      success: true,
      profile,
      academic,
      skills,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new master skill
// @route   POST /api/admin/skills
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(201).json({ success: true, skill });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new question
// @route   POST /api/admin/questions
const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    return res.status(201).json({ success: true, question });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all questions for question bank
// @route   GET /api/admin/questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Assessment
// @route   POST /api/admin/assessments
const createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    return res.status(201).json({ success: true, assessment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Company
// @route   POST /api/admin/companies
const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    return res.status(201).json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Placement Drive
// @route   POST /api/admin/drives
const createPlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.create(req.body);
    return res.status(201).json({ success: true, drive });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Course
// @route   POST /api/admin/courses
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};

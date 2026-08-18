const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const Academic = require("../models/Academic");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get all placement drives
// @route   GET /api/drives
const getDrives = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const drives = await PlacementDrive.find(query)
      .populate("company")
      .populate("eligibilityRule")
      .sort({ driveDate: 1 });

    // If user is authenticated, attach user's application status to each drive
    let appliedDriveIds = [];
    if (req.user) {
      const myApps = await Application.find({ userId: req.user._id });
      appliedDriveIds = myApps.map((a) => a.driveId.toString());
    }

    const drivesWithStatus = drives.map((d) => {
      const dObj = d.toObject();
      dObj.hasApplied = appliedDriveIds.includes(d._id.toString());
      return dObj;
    });

    return res.json({ success: true, count: drivesWithStatus.length, drives: drivesWithStatus });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get drive by ID
// @route   GET /api/drives/:id
const getDriveById = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      .populate("company")
      .populate("eligibilityRule");

    if (!drive) {
      return res.status(404).json({ success: false, message: "Placement drive not found" });
    }

    let application = null;
    if (req.user) {
      application = await Application.findOne({ driveId: drive._id, userId: req.user._id });
    }

    return res.json({
      success: true,
      drive,
      application,
      hasApplied: !!application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for placement drive
// @route   POST /api/drives/:id/apply
const applyForDrive = async (req, res) => {
  try {
    const driveId = req.params.id;
    const userId = req.user._id;

    const drive = await PlacementDrive.findById(driveId).populate("eligibilityRule");
    if (!drive) {
      return res.status(404).json({ success: false, message: "Drive not found" });
    }

    // Check if already applied
    const existing = await Application.findOne({ driveId, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied for this placement drive" });
    }

    // Eligibility check
    const academic = await Academic.findOne({ userId });
    const profile = await StudentProfile.findOne({ user: userId });

    const minCgpa = drive.eligibilityRule?.minCgpa || 6.5;
    const studentCgpa = academic?.cgpa || 7.0;

    if (academic && academic.standingArrears > (drive.eligibilityRule?.maxStandingArrears || 0)) {
      return res.status(400).json({
        success: false,
        message: `Ineligible: Drive requires at most ${drive.eligibilityRule?.maxStandingArrears || 0} active arrears.`,
      });
    }

    if (studentCgpa < minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Ineligible: Minimum CGPA requirement is ${minCgpa}. Your CGPA is ${studentCgpa}.`,
      });
    }

    const application = await Application.create({
      driveId,
      userId,
      status: "Applied",
      currentRound: drive.rounds?.[0]?.roundName || "Online Assessment",
      readinessScoreAtApply: profile?.readinessScore || 75,
      feedback: "Application submitted. Your profile has been forwarded to the hiring team.",
    });

    // Increment applicant count
    drive.applicantsCount = (drive.applicantsCount || 0) + 1;
    await drive.save();

    await Notification.create({
      userId,
      title: `Application Sent: ${drive.title}`,
      message: `You successfully applied for ${drive.role} (${drive.packageCTC} LPA). Keep practicing!`,
      type: "drive",
      actionUrl: "/applications",
    });

    await ActivityLog.create({
      userId,
      action: "Applied for Placement Drive",
      category: "DRIVE",
      details: `${drive.title} - ${drive.role}`,
    });

    return res.status(201).json({
      success: true,
      message: "Applied successfully to placement drive!",
      application,
    });
  } catch (error) {
    console.error("Apply drive error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDrives,
  getDriveById,
  applyForDrive,
};

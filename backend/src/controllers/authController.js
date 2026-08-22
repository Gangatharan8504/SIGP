const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const StudentSkill = require("../models/StudentSkill");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const { sendWelcomeEmail } = require("../services/emailService");

// @desc    Register a new user (Student, Faculty, Placement Coordinator)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      // Personal
      registerNumber,
      rollNumber,
      department,
      batch,
      batchYear,
      graduationYear,
      phone,
      dob,
      profilePhoto,
      collegeName,
      targetRole,
      // Academic
      tenthPercentage,
      tenthBoard,
      twelfthOrDiplomaPercentage,
      twelfthBoard,
      currentDegree,
      branch,
      currentSemester,
      cgpa,
      activeBacklogs,
      clearedArrears,
      gapYears,
      // Professional / Skills
      skills = [],
      codingProfiles = {},
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: (role || "student").toLowerCase(),
    });

    if (user.role.toLowerCase() === "student") {
      await StudentProfile.create({
        user: user._id,
        fullName: name,
        registerNumber: registerNumber || rollNumber || "",
        rollNumber: rollNumber || registerNumber || `SGIP-${Math.floor(1000 + Math.random() * 9000)}`,
        department: department || branch || "Computer Science and Engineering",
        batch: batch || "2022-2026",
        batchYear: Number(batchYear) || 2026,
        graduationYear: Number(graduationYear) || 2026,
        collegeName: collegeName || "Institute of Technology & Engineering",
        targetRole: targetRole || "Full Stack Software Engineer",
        phone: phone || "",
        dob: dob || "",
        profilePhoto: profilePhoto || "",
        linkedinUrl: linkedinUrl || codingProfiles.linkedin || "",
        githubUrl: githubUrl || codingProfiles.github || "",
        portfolioUrl: portfolioUrl || codingProfiles.portfolio || "",
        codingProfiles: {
          leetcode: codingProfiles.leetcode || "",
          codechef: codingProfiles.codechef || "",
          hackerrank: codingProfiles.hackerrank || "",
          github: githubUrl || codingProfiles.github || "",
          linkedin: linkedinUrl || codingProfiles.linkedin || "",
          portfolio: portfolioUrl || codingProfiles.portfolio || "",
        },
        // Real score initialization: clean null states (unearned until real assessments/resumes are uploaded)
        readinessScore: null,
        skillScore: null,
        resumeScore: null,
        assessmentScore: null,
        codingScore: null,
        projectsScore: null,
        consistencyScore: null,
      });

      await Academic.create({
        userId: user._id,
        tenthPercentage: tenthPercentage ? Number(tenthPercentage) : null,
        tenthBoard: tenthBoard || "",
        twelfthOrDiplomaPercentage: twelfthOrDiplomaPercentage ? Number(twelfthOrDiplomaPercentage) : null,
        twelfthBoard: twelfthBoard || "",
        currentDegree: currentDegree || "B.Tech",
        branch: branch || department || "Computer Science and Engineering",
        currentSemester: currentSemester ? Number(currentSemester) : null,
        cgpa: cgpa ? Number(cgpa) : null,
        activeBacklogs: Number(activeBacklogs) || 0,
        clearedArrears: Number(clearedArrears) || 0,
        historyOfArrears: (Number(activeBacklogs) || 0) + (Number(clearedArrears) || 0),
        standingArrears: Number(activeBacklogs) || 0,
        gapYears: Number(gapYears) || 0,
        graduationYear: Number(graduationYear) || Number(batchYear) || 2026,
        academicPerformanceScore: cgpa ? Math.min(100, Math.round((Number(cgpa) / 10) * 100)) : null,
      });

      // Save initial skills if provided by student
      if (Array.isArray(skills) && skills.length > 0) {
        const skillDocs = skills.map((s) => ({
          userId: user._id,
          skillName: typeof s === "string" ? s : s.skillName || s.name,
          category: typeof s === "object" ? s.category || "General" : "General",
          proficiency: typeof s === "object" ? s.proficiency || "Intermediate" : "Intermediate",
          selfRating: typeof s === "object" ? s.selfRating || 3 : 3,
          verifiedScore: null,
          verifiedViaAssessment: false,
        }));
        await StudentSkill.insertMany(skillDocs);
      }

      // In-app welcome notification
      await Notification.create({
        userId: user._id,
        title: "Welcome to SGIP Placement Platform!",
        message: "Complete your 42-question baseline assessment and upload your resume to generate your placement readiness score.",
        type: "system",
        actionUrl: "/dashboard",
      });
    }

    await ActivityLog.create({
      userId: user._id,
      action: "User Registered",
      category: "AUTH",
      details: `Registered as ${user.role} (${user.email})`,
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail({
      to: user.email,
      name: user.name,
      role: user.role,
      department: department || branch || "Computer Science and Engineering",
      rollNumber: registerNumber || rollNumber || "",
    }).catch((err) => {
      console.error("[Auth] Welcome email async dispatch failed:", err.message);
    });

    const token = user.getSignedJwtToken();

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const rawEmail = req.body?.email || req.body?.[0];
    const rawPassword = req.body?.password || req.body?.[1];

    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ success: false, message: "Please provide both an email and password." });
    }

    const email = String(rawEmail).toLowerCase().trim();
    const password = String(rawPassword);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please click 'Create student account' to register.",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Account security credentials missing. Please register or reset password.",
      });
    }

    let isMatch = false;
    try {
      isMatch = await user.matchPassword(password);
    } catch (pwErr) {
      console.warn("Password compare error:", pwErr.message);
      isMatch = false;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    try {
      await ActivityLog.create({
        userId: user._id,
        action: "User Logged In",
        category: "AUTH",
        details: `Logged in as ${user.role} (${user.email})`,
      });
    } catch (logErr) {
      console.warn("ActivityLog creation skipped during login:", logErr.message);
    }

    const token = user.getSignedJwtToken();

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Authentication service error. Please try again.",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Direct test handler to verify SMTP welcome email
// @route   POST /api/auth/test-welcome-email
const testWelcomeEmail = async (req, res) => {
  try {
    const targetEmail = req.body.email || "cooperative.team8503@gmail.com";
    const result = await sendWelcomeEmail({
      to: targetEmail,
      name: req.body.name || "Gangatharan",
      role: "student",
      department: "Computer Science and Engineering",
      rollNumber: "SGIP-2026",
    });

    if (result.success) {
      return res.json({ success: true, message: `Welcome email successfully sent to ${targetEmail}`, messageId: result.messageId });
    } else {
      return res.status(500).json({ success: false, message: "Failed to dispatch email", error: result.error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  testWelcomeEmail,
};

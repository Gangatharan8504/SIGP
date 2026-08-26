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
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Full Name, Email, and Password).",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).trim();
    const userRole = String(role || "student").toLowerCase().trim();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account already exists with this email. Please sign in instead.",
      });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: String(password),
      role: userRole,
    });

    if (userRole === "student") {
      try {
        await StudentProfile.create({
          user: user._id,
          fullName: cleanName,
          registerNumber: registerNumber || rollNumber || "",
          rollNumber: rollNumber || registerNumber || `SGIP-${Math.floor(1000 + Math.random() * 9000)}`,
          department: department || branch || "Computer Science and Engineering",
          batch: batch || `${(Number(graduationYear) || 2027) - 4}-${Number(graduationYear) || 2027}`,
          batchYear: Number(batchYear) || Number(graduationYear) || 2027,
          graduationYear: Number(graduationYear) || Number(batchYear) || 2027,
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
          readinessScore: null,
          skillScore: null,
          resumeScore: null,
          assessmentScore: null,
          codingScore: null,
          projectsScore: null,
          consistencyScore: null,
        });
      } catch (profErr) {
        console.warn("StudentProfile creation notice:", profErr.message);
      }

      try {
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
          graduationYear: Number(graduationYear) || Number(batchYear) || 2027,
          academicPerformanceScore: cgpa ? Math.min(100, Math.round((Number(cgpa) / 10) * 100)) : null,
        });
      } catch (acadErr) {
        console.warn("Academic record creation notice:", acadErr.message);
      }

      // Save initial skills if provided by student
      if (Array.isArray(skills) && skills.length > 0) {
        try {
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
        } catch (skillErr) {
          console.warn("Initial skills insert notice:", skillErr.message);
        }
      }

      // In-app welcome notification
      try {
        await Notification.create({
          userId: user._id,
          title: "Welcome to SGIP Placement Platform!",
          message: "Complete your 42-question baseline assessment and upload your resume to generate your placement readiness score.",
          type: "system",
          actionUrl: "/dashboard",
        });
      } catch (notifErr) {
        console.warn("Notification creation notice:", notifErr.message);
      }
    }

    try {
      await ActivityLog.create({
        userId: user._id,
        action: "User Registered",
        category: "AUTH",
        details: `Registered as ${user.role} (${user.email})`,
      });
    } catch (logErr) {
      console.warn("ActivityLog creation notice:", logErr.message);
    }

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
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please check the entered data and try again.",
    });
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

    let user = await User.findOne({ email }).select("+password");

    // Auto-provision standard demo accounts on demand if not yet created in MongoDB
    if (!user) {
      const demoAccounts = {
        "coordinator@demo.com": { name: "Placement Coordinator", role: "placement_coordinator", defaultPw: "password123" },
        "admin@demo.com": { name: "Admin Lead", role: "admin", defaultPw: "password123" },
        "faculty@demo.com": { name: "Faculty Mentor", role: "faculty", defaultPw: "password123" },
        "student@demo.com": { name: "Demo Student", role: "student", defaultPw: "password123" },
        "gangatharan8504@gmail.com": { name: "GANGATHARAN M", role: "student", defaultPw: "password123" },
      };

      if (demoAccounts[email]) {
        const demo = demoAccounts[email];
        user = await User.create({
          name: demo.name,
          email,
          password: demo.defaultPw,
          role: demo.role,
        });

        if (demo.role === "student") {
          await StudentProfile.create({
            user: user._id,
            fullName: demo.name,
            rollNumber: "SGIP-2026",
            department: "Information Technology",
            batch: "2023-2027",
            collegeName: "V.S.B Engineering College",
            targetRole: "Full Stack Software Engineer",
            cgpa: 7.48,
          });
          await Academic.create({
            userId: user._id,
            cgpa: 7.48,
            currentDegree: "B.Tech",
            branch: "Information Technology",
            currentSemester: 6,
            tenthPercentage: 88,
            twelfthOrDiplomaPercentage: 85,
          });
        }
      }
    }

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

const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const StudentSkill = require("../models/StudentSkill");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const Assessment = require("../models/Assessment");
const PlacementDrive = require("../models/PlacementDrive");
const Application = require("../models/Application");
const LearningPlan = require("../models/LearningPlan");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const Company = require("../models/Company");
const ActivityLog = require("../models/ActivityLog");
const ProfileUpdateLog = require("../models/ProfileUpdateLog");
const ReadinessWeightConfig = require("../models/ReadinessWeightConfig");
const { sendProfileChangeEmail } = require("../services/emailService");

// @desc    Get Student Full Profile
// @route   GET /api/students/profile
const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const academic = await Academic.findOne({ userId: req.user._id });
    const skills = await StudentSkill.find({ userId: req.user._id });

    return res.json({
      success: true,
      profile,
      academic,
      skills,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Student Profile with change tracking & audit notification
// @route   PUT /api/students/profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      registerNumber,
      rollNumber,
      department,
      batch,
      batchYear,
      graduationYear,
      collegeName,
      targetRole,
      bio,
      phone,
      dob,
      profilePhoto,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      codingProfiles,
      placementStatus,
    } = req.body;

    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user._id, fullName: req.user.name });
    }

    const changes = [];
    const checkDiff = (field, oldVal, newVal, category = "PERSONAL") => {
      if (newVal !== undefined && newVal !== null && String(oldVal || "") !== String(newVal)) {
        changes.push({
          field,
          oldValue: oldVal ?? null,
          newValue: newVal,
          category,
        });
      }
    };

    checkDiff("Full Name", profile.fullName, fullName);
    checkDiff("Register Number", profile.registerNumber, registerNumber);
    checkDiff("Roll Number", profile.rollNumber, rollNumber);
    checkDiff("Department", profile.department, department);
    checkDiff("Batch", profile.batch, batch);
    checkDiff("Batch Year", profile.batchYear, batchYear);
    checkDiff("Graduation Year", profile.graduationYear, graduationYear);
    checkDiff("Target Role", profile.targetRole, targetRole, "PROFESSIONAL");
    checkDiff("Phone Number", profile.phone, phone);
    checkDiff("Date of Birth", profile.dob, dob);
    checkDiff("LinkedIn URL", profile.linkedinUrl, linkedinUrl, "PROFESSIONAL");
    checkDiff("GitHub URL", profile.githubUrl, githubUrl, "PROFESSIONAL");
    checkDiff("Portfolio URL", profile.portfolioUrl, portfolioUrl, "PROFESSIONAL");
    checkDiff("Placement Status", profile.placementStatus, placementStatus, "PROFESSIONAL");

    if (fullName) profile.fullName = fullName;
    if (registerNumber) profile.registerNumber = registerNumber;
    if (rollNumber) profile.rollNumber = rollNumber;
    if (department) profile.department = department;
    if (batch) profile.batch = batch;
    if (batchYear) profile.batchYear = Number(batchYear);
    if (graduationYear) profile.graduationYear = Number(graduationYear);
    
    // Normalize and sync batch/graduation year to Academic record
    const syncGradYear = Number(graduationYear || batchYear || (batch ? String(batch).replace(/.*-/, "") : 0));
    if (syncGradYear && !isNaN(syncGradYear)) {
      profile.batchYear = syncGradYear;
      profile.graduationYear = syncGradYear;
      if (!profile.batch || profile.batch.includes("2026")) {
        profile.batch = `${syncGradYear - 4}-${syncGradYear}`;
      }
      await Academic.findOneAndUpdate(
        { userId: req.user._id },
        { graduationYear: syncGradYear }
      );
    }
    
    if (collegeName) profile.collegeName = collegeName;
    if (targetRole) profile.targetRole = targetRole;
    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (dob !== undefined) profile.dob = dob;
    if (profilePhoto !== undefined) profile.profilePhoto = profilePhoto;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;
    if (codingProfiles) profile.codingProfiles = { ...profile.codingProfiles, ...codingProfiles };
    if (placementStatus) profile.placementStatus = placementStatus;

    await profile.save();

    // Store audit logs for changes
    if (changes.length > 0) {
      const logs = changes.map((c) => ({
        studentId: req.user._id,
        fieldName: c.field,
        category: c.category,
        oldValue: c.oldValue,
        newValue: c.newValue,
        updatedBy: req.user._id,
        ipAddress: req.ip || "",
        userAgent: req.headers["user-agent"] || "",
      }));
      await ProfileUpdateLog.insertMany(logs);

      // Trigger change notification email
      sendProfileChangeEmail({
        to: req.user.email,
        name: profile.fullName || req.user.name,
        changes,
      }).catch((err) => console.error("[Profile Email Error]", err.message));
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: "Profile Updated",
      category: "PROFILE",
      details: `Updated ${changes.length} profile fields`,
    });

    return res.json({ success: true, profile, changesCount: changes.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Academic Info
// @route   GET /api/students/academics
const getAcademics = async (req, res) => {
  try {
    let academic = await Academic.findOne({ userId: req.user._id });
    return res.json({ success: true, academic });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save Academic Info with change tracking & audit notification
// @route   POST /api/students/academics
const saveAcademics = async (req, res) => {
  try {
    const {
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
      historyOfArrears,
      standingArrears,
      gapYears,
      graduationYear,
    } = req.body;

    let academic = await Academic.findOne({ userId: req.user._id });
    if (!academic) {
      academic = new Academic({ userId: req.user._id });
    }

    const changes = [];
    const checkDiff = (field, oldVal, newVal) => {
      if (newVal !== undefined && newVal !== null && String(oldVal ?? "") !== String(newVal)) {
        changes.push({
          field,
          oldValue: oldVal ?? null,
          newValue: newVal,
          category: "ACADEMIC",
        });
      }
    };

    checkDiff("10th Percentage", academic.tenthPercentage, tenthPercentage);
    checkDiff("10th Board", academic.tenthBoard, tenthBoard);
    checkDiff("12th/Diploma %", academic.twelfthOrDiplomaPercentage, twelfthOrDiplomaPercentage);
    checkDiff("12th Board", academic.twelfthBoard, twelfthBoard);
    checkDiff("Current Degree", academic.currentDegree, currentDegree);
    checkDiff("Branch / Specialization", academic.branch, branch);
    checkDiff("Current Semester", academic.currentSemester, currentSemester);
    checkDiff("Cumulative CGPA", academic.cgpa, cgpa);
    checkDiff("Active Standing Arrears", academic.standingArrears ?? academic.activeBacklogs, activeBacklogs ?? standingArrears);
    checkDiff("History of Arrears", academic.historyOfArrears, historyOfArrears);
    checkDiff("Cleared Arrears", academic.clearedArrears, clearedArrears);
    checkDiff("Education Gap Years", academic.gapYears, gapYears);
    checkDiff("Year of Graduation", academic.graduationYear, graduationYear);

    if (tenthPercentage !== undefined) academic.tenthPercentage = Number(tenthPercentage);
    if (tenthBoard !== undefined) academic.tenthBoard = tenthBoard;
    if (twelfthOrDiplomaPercentage !== undefined) academic.twelfthOrDiplomaPercentage = Number(twelfthOrDiplomaPercentage);
    if (twelfthBoard !== undefined) academic.twelfthBoard = twelfthBoard;
    if (currentDegree !== undefined) academic.currentDegree = currentDegree;
    if (branch !== undefined) academic.branch = branch;
    if (currentSemester !== undefined) academic.currentSemester = Number(currentSemester);
    if (cgpa !== undefined) {
      academic.cgpa = Number(cgpa);
      academic.academicPerformanceScore = Math.min(100, Math.round((Number(cgpa) / 10) * 100));
    }
    if (activeBacklogs !== undefined) {
      academic.activeBacklogs = Number(activeBacklogs);
      academic.standingArrears = Number(activeBacklogs);
    }
    if (clearedArrears !== undefined) academic.clearedArrears = Number(clearedArrears);
    if (historyOfArrears !== undefined) academic.historyOfArrears = Number(historyOfArrears);
    if (standingArrears !== undefined) academic.standingArrears = Number(standingArrears);
    if (gapYears !== undefined) academic.gapYears = Number(gapYears);
    if (graduationYear !== undefined) {
      const gYear = Number(graduationYear);
      academic.graduationYear = gYear;
      await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        { batchYear: gYear, graduationYear: gYear, batch: `${gYear - 4}-${gYear}` }
      );
    }

    await academic.save();

    // Store audit logs for changes
    if (changes.length > 0) {
      const logs = changes.map((c) => ({
        studentId: req.user._id,
        fieldName: c.field,
        category: "ACADEMIC",
        oldValue: c.oldValue,
        newValue: c.newValue,
        updatedBy: req.user._id,
        ipAddress: req.ip || "",
        userAgent: req.headers["user-agent"] || "",
      }));
      await ProfileUpdateLog.insertMany(logs);

      // Trigger change notification email
      sendProfileChangeEmail({
        to: req.user.email,
        name: req.user.name,
        changes,
      }).catch((err) => console.error("[Academic Email Error]", err.message));
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: "Academic Profile Updated",
      category: "ACADEMIC",
      details: `Updated ${changes.length} academic fields (CGPA: ${academic.cgpa})`,
    });

    return res.json({ success: true, academic, changesCount: changes.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Profile & Academic Audit History
// @route   GET /api/students/profile/audit-history
const getProfileAuditHistory = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.user._id;
    const history = await ProfileUpdateLog.find({ studentId })
      .populate("updatedBy", "name email role")
      .sort({ updatedAt: -1 })
      .limit(50);

    return res.json({ success: true, count: history.length, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Student Dashboard Summary Widgets (100% Real Evidence-Based Intelligence)
// @route   GET /api/students/dashboard-summary
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch real records from DB
    const profile = await StudentProfile.findOne({ user: userId });
    const academic = await Academic.findOne({ userId });
    const skills = await StudentSkill.find({ userId });
    const resumeAnalysis = await ResumeAnalysis.findOne({ userId }).sort({ analyzedAt: -1 });
    const submissions = await AssessmentSubmission.find({ userId }).sort({ completedAt: -1 });
    const learningPlan = await LearningPlan.findOne({ userId });
    const applications = await Application.find({ userId }).populate("driveId");
    const weightConfig = await ReadinessWeightConfig.getActiveConfig();

    // Check prerequisites & generate authentic guided actions
    const pendingActions = [];
    if (!academic || academic.cgpa === null || academic.cgpa === undefined) {
      pendingActions.push({
        id: "act-academic",
        title: "Complete Academic Profile & CGPA",
        type: "academic",
        link: "/academics",
        urgent: true,
      });
    }

    if (submissions.length === 0) {
      pendingActions.push({
        id: "act-baseline",
        title: "Take 42-Question Baseline Placement Assessment",
        type: "assessment",
        link: "/assessments",
        urgent: true,
      });
    }

    if (!resumeAnalysis) {
      pendingActions.push({
        id: "act-resume",
        title: "Upload & Scan PDF/DOCX Resume with AI ATS",
        type: "resume",
        link: "/resume-analyzer",
        urgent: true,
      });
    }

    if (skills.length === 0) {
      pendingActions.push({
        id: "act-skills",
        title: "Add & Verify Your Core Technical Skills",
        type: "skills",
        link: "/skills",
        urgent: false,
      });
    }

    // 1. Academic Score (0-100)
    let realAcademicScore = null;
    if (academic && academic.cgpa !== null && academic.cgpa !== undefined) {
      const baseCgpaScore = Math.min(100, Math.round((academic.cgpa / 10) * 100));
      // Deduct for standing backlogs
      const backlogPenalty = (academic.standingArrears || 0) * 15;
      realAcademicScore = Math.max(0, baseCgpaScore - backlogPenalty);
    }

    // 2. Skill Score (0-100) - Only from verified assessments / ratings
    let realSkillScore = null;
    if (skills.length > 0) {
      const verifiedSkills = skills.filter((s) => s.verifiedScore !== null && s.verifiedScore !== undefined);
      if (verifiedSkills.length > 0) {
        realSkillScore = Math.round(verifiedSkills.reduce((acc, s) => acc + s.verifiedScore, 0) / verifiedSkills.length);
      } else {
        realSkillScore = Math.round(skills.reduce((acc, s) => acc + (s.selfRating || 3) * 20, 0) / skills.length);
      }
    }

    // 3. Resume ATS Score (0-100)
    const realResumeScore = resumeAnalysis ? resumeAnalysis.atsScore : null;

    // 4. Assessment Average Score (0-100)
    let realAssessmentScore = null;
    if (submissions.length > 0) {
      realAssessmentScore = Math.round(
        submissions.reduce((acc, sub) => acc + (sub.percentage || 0), 0) / submissions.length
      );
    }

    // 5. Coding Problem Score (0-100)
    const realCodingScore = profile?.codingScore ?? null;

    // 6. Dynamic Weighted Composite Placement Readiness
    let compositeReadiness = null;
    let earnedWeightsTotal = 0;
    let computedWeightedSum = 0;

    if (realAcademicScore !== null) {
      computedWeightedSum += realAcademicScore * (weightConfig.academicWeight / 100);
      earnedWeightsTotal += weightConfig.academicWeight;
    }
    if (realSkillScore !== null) {
      computedWeightedSum += realSkillScore * (weightConfig.skillsWeight / 100);
      earnedWeightsTotal += weightConfig.skillsWeight;
    }
    if (realAssessmentScore !== null) {
      computedWeightedSum += realAssessmentScore * (weightConfig.assessmentWeight / 100);
      earnedWeightsTotal += weightConfig.assessmentWeight;
    }
    if (realResumeScore !== null) {
      computedWeightedSum += realResumeScore * (weightConfig.resumeWeight / 100);
      earnedWeightsTotal += weightConfig.resumeWeight;
    }
    if (realCodingScore !== null) {
      computedWeightedSum += realCodingScore * (weightConfig.codingWeight / 100);
      earnedWeightsTotal += weightConfig.codingWeight;
    }

    if (earnedWeightsTotal > 0) {
      // Normalize to 100 scale based on completed pillars
      compositeReadiness = Math.round((computedWeightedSum / earnedWeightsTotal) * 100);
    }

    // Dynamic Time-Series Improvement Trends from Real Submissions
    const assessmentTrend = submissions.slice(0, 6).reverse().map((sub, idx) => ({
      attempt: `Attempt ${idx + 1}`,
      score: sub.percentage,
      integrity: sub.integrityScore,
      date: new Date(sub.completedAt).toLocaleDateString(),
    }));

    // Companies & Drives
    const activeDrives = await PlacementDrive.find({ status: "Upcoming" })
      .populate("company")
      .limit(4);

    const recommendedCompanies = await Company.find().limit(4);
    const upcomingAssessments = await Assessment.find({ isActive: true }).limit(3);

    return res.json({
      success: true,
      data: {
        profile: profile || { fullName: req.user.name },
        academic: academic || null,
        scores: {
          readinessScore: compositeReadiness, // null if no components completed
          skillScore: realSkillScore,
          academicScore: realAcademicScore,
          cgpa: academic?.cgpa ?? null,
          activeBacklogs: academic?.activeBacklogs ?? 0,
          resumeScore: realResumeScore,
          assessmentScore: realAssessmentScore,
          codingScore: realCodingScore,
        },
        weightsApplied: weightConfig,
        pendingActions,
        isProfileComplete: pendingActions.length === 0,
        assessmentTrend,
        skillGapSummary: {
          strongCount: skills.filter((s) => (s.verifiedScore || s.selfRating * 20) >= 75).length,
          needsImprovementCount: skills.filter((s) => (s.verifiedScore || s.selfRating * 20) < 60).length,
          targetRole: profile?.targetRole || "Full Stack Software Engineer",
          gapPercentage: compositeReadiness !== null ? Math.max(0, 100 - compositeReadiness) : null,
        },
        learningProgress: {
          completedWeeks: 1,
          totalWeeks: 6,
          progressPercentage: learningPlan ? learningPlan.overallProgressPercentage : 0,
        },
        upcomingAssessments,
        recommendedCompanies,
        activeDrives,
        applicationsCount: applications.length,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAcademics,
  saveAcademics,
  getProfileAuditHistory,
  getDashboardSummary,
};
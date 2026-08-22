const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");
const StudentProfile = require("../models/StudentProfile");
const ActivityLog = require("../models/ActivityLog");
const ProfileUpdateLog = require("../models/ProfileUpdateLog");
const { sendSkillMatrixEmail } = require("../services/emailService");

// @desc    Get all available master skills catalog
// @route   GET /api/skills
const getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });
    return res.json({ success: true, count: skills.length, skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's added skills with Technical & Soft Skills Matrix Analytics
// @route   GET /api/skills/my-skills
const getMySkills = async (req, res) => {
  try {
    const skills = await StudentSkill.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    const technicalSkills = skills.filter((s) => {
      const cat = (s.category || "").toLowerCase();
      return !cat.includes("soft") && !cat.includes("aptitude") && !cat.includes("communication") && !cat.includes("behavioral");
    });

    const softSkills = skills.filter((s) => {
      const cat = (s.category || "").toLowerCase();
      return cat.includes("soft") || cat.includes("aptitude") || cat.includes("communication") || cat.includes("behavioral");
    });

    const verifiedCount = skills.filter((s) => s.verifiedViaAssessment).length;
    const avgSelfRating = skills.length > 0
      ? (skills.reduce((acc, s) => acc + (s.selfRating || 3), 0) / skills.length).toFixed(1)
      : "0.0";

    return res.json({
      success: true,
      count: skills.length,
      skills,
      analytics: {
        total: skills.length,
        technicalCount: technicalSkills.length,
        softCount: softSkills.length,
        verifiedCount,
        avgSelfRating,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or update a technical / soft skill with automated email notification & score sync
// @route   POST /api/skills/my-skills
const saveMySkill = async (req, res) => {
  try {
    const { skillName, category, proficiency, selfRating } = req.body;
    if (!skillName || !skillName.trim()) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    const trimmedName = skillName.trim();
    let actionType = "ADDED";
    let previousValues = null;

    let studentSkill = await StudentSkill.findOne({
      userId: req.user._id,
      skillName: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (studentSkill) {
      actionType = "UPDATED";
      previousValues = {
        proficiency: studentSkill.proficiency,
        selfRating: studentSkill.selfRating,
        category: studentSkill.category,
      };

      if (proficiency) studentSkill.proficiency = proficiency;
      if (selfRating !== undefined) studentSkill.selfRating = Number(selfRating);
      if (category) studentSkill.category = category;
      await studentSkill.save();
    } else {
      studentSkill = await StudentSkill.create({
        userId: req.user._id,
        skillName: trimmedName,
        category: category || "Frontend",
        proficiency: proficiency || "Intermediate",
        selfRating: Number(selfRating) || 4,
      });
    }

    // Recalculate student composite skill score
    const allSkills = await StudentSkill.find({ userId: req.user._id });
    let calculatedSkillScore = 0;
    if (allSkills.length > 0) {
      const totalPoints = allSkills.reduce((acc, s) => {
        const itemScore = s.verifiedViaAssessment && s.verifiedScore > 0
          ? s.verifiedScore
          : (s.selfRating || 3) * 20;
        return acc + itemScore;
      }, 0);
      calculatedSkillScore = Math.min(100, Math.round(totalPoints / allSkills.length));
    }

    await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { skillScore: calculatedSkillScore }
    );

    // Audit Log Creation
    await ActivityLog.create({
      userId: req.user._id,
      action: actionType === "ADDED" ? "Skill Added to Matrix" : "Skill Proficiency Updated",
      category: "SKILL",
      details: `${studentSkill.skillName} (${studentSkill.category} - ${studentSkill.proficiency}, ${studentSkill.selfRating}/5 Stars)`,
    });

    await ProfileUpdateLog.create({
      studentId: req.user._id,
      fieldName: `Skill: ${studentSkill.skillName}`,
      category: "SKILLS",
      oldValue: previousValues ? `${previousValues.proficiency} (${previousValues.selfRating}★)` : null,
      newValue: `${studentSkill.proficiency} (${studentSkill.selfRating}★)`,
      updatedBy: req.user._id,
      ipAddress: req.ip || "",
      userAgent: req.headers["user-agent"] || "",
    });

    // Automated Transactional Email Notification
    sendSkillMatrixEmail({
      to: req.user.email,
      name: req.user.name,
      actionType,
      skill: studentSkill,
      previousValues,
    }).catch((err) => console.error("[Skills Email Notification Error]", err.message));

    return res.json({
      success: true,
      actionType,
      skill: studentSkill,
      calculatedSkillScore,
      message: `${studentSkill.skillName} saved and audit email notification dispatched!`,
    });
  } catch (error) {
    console.error("Save skill error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student skill with automated email notification & score sync
// @route   DELETE /api/skills/my-skills/:id
const deleteMySkill = async (req, res) => {
  try {
    const skillToDelete = await StudentSkill.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!skillToDelete) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    await StudentSkill.findByIdAndDelete(req.params.id);

    // Recalculate student composite skill score after deletion
    const allSkills = await StudentSkill.find({ userId: req.user._id });
    let calculatedSkillScore = 0;
    if (allSkills.length > 0) {
      const totalPoints = allSkills.reduce((acc, s) => {
        const itemScore = s.verifiedViaAssessment && s.verifiedScore > 0
          ? s.verifiedScore
          : (s.selfRating || 3) * 20;
        return acc + itemScore;
      }, 0);
      calculatedSkillScore = Math.min(100, Math.round(totalPoints / allSkills.length));
    }

    await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { skillScore: calculatedSkillScore }
    );

    // Audit Log Creation
    await ActivityLog.create({
      userId: req.user._id,
      action: "Skill Removed from Matrix",
      category: "SKILL",
      details: `Removed ${skillToDelete.skillName} (${skillToDelete.category})`,
    });

    // Automated Transactional Email Notification
    sendSkillMatrixEmail({
      to: req.user.email,
      name: req.user.name,
      actionType: "DELETED",
      skill: skillToDelete,
    }).catch((err) => console.error("[Skills Delete Email Error]", err.message));

    return res.json({
      success: true,
      message: `${skillToDelete.skillName} removed from matrix and notification sent.`,
      calculatedSkillScore,
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSkills,
  getMySkills,
  saveMySkill,
  deleteMySkill,
};

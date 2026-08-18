const SkillEvidence = require("../models/SkillEvidence");
const StudentSkill = require("../models/StudentSkill");
const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const ActivityLog = require("../models/ActivityLog");

/**
 * SGIP Event Dispatcher & Intelligence Pipeline
 */
const emitStudentActivityEvent = async ({
  userId,
  eventType,
  skillNames = [],
  score = 100,
  sourceTitle = "",
  sourceRefId = "",
  details = "",
}) => {
  try {
    // 1. Create activity audit record
    await ActivityLog.create({
      userId,
      action: eventType,
      category: getCategoryFromEventType(eventType),
      details: `${sourceTitle}: ${details || `Score: ${score}%`}`,
    });

    // 2. Map skills to SkillEvidence
    for (const skillName of skillNames) {
      await SkillEvidence.create({
        userId,
        skillName,
        sourceType: eventType,
        sourceTitle,
        sourceReferenceId: sourceRefId,
        scoreEarned: score,
        confidenceWeight: getWeightForSource(eventType),
        evidenceSummary: `Verified via ${eventType.replace(/_/g, " ")} (${sourceTitle}) with score ${score}%`,
      });

      // Update student verified skill record
      let studentSkill = await StudentSkill.findOne({
        userId,
        skillName: { $regex: new RegExp(`^${skillName.trim()}$`, "i") },
      });

      if (studentSkill) {
        studentSkill.verifiedScore = Math.round((studentSkill.verifiedScore * 0.4) + (score * 0.6));
        studentSkill.verifiedViaAssessment = true;
        await studentSkill.save();
      } else {
        await StudentSkill.create({
          userId,
          skillName: skillName.trim(),
          category: "Core CS",
          proficiency: score >= 80 ? "Advanced" : "Intermediate",
          selfRating: 4,
          verifiedScore: score,
          verifiedViaAssessment: true,
        });
      }
    }

    // 3. Recalculate SGIP Growth Score & Placement Readiness
    await recalculateGrowthAndReadiness(userId);
  } catch (err) {
    console.error("Error in emitStudentActivityEvent:", err);
  }
};

const getCategoryFromEventType = (type) => {
  if (type.includes("ASSESSMENT") || type.includes("EXAM")) return "ASSESSMENT";
  if (type.includes("CODING") || type.includes("COMPILER")) return "CODING";
  if (type.includes("ASSIGNMENT")) return "LEARNING";
  if (type.includes("RESUME")) return "RESUME";
  if (type.includes("DRIVE") || type.includes("APPLICATION")) return "DRIVE";
  return "PROFILE";
};

const getWeightForSource = (type) => {
  switch (type) {
    case "ASSESSMENT":
    case "EXAM":
      return 1.0;
    case "COMPILER_SUBMISSION":
      return 0.9;
    case "ASSIGNMENT":
      return 0.85;
    case "PROJECT":
    case "HACKATHON":
      return 0.8;
    case "EXTERNAL_CODING":
      return 0.75;
    default:
      return 0.6;
  }
};

/**
 * Recomputes multi-dimensional SGIP Growth Score
 */
const recalculateGrowthAndReadiness = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId });
  const academic = (await Academic.findOne({ userId })) || { cgpa: 8.0 };
  const skills = await StudentSkill.find({ userId });
  const evidences = await SkillEvidence.find({ userId });

  if (!profile) return;

  const academicScore = Math.min(100, Math.round((academic.cgpa / 10) * 100));
  
  let skillVerifiedAvg = 70;
  if (skills.length > 0) {
    const verifiedSkills = skills.filter((s) => s.verifiedViaAssessment);
    if (verifiedSkills.length > 0) {
      skillVerifiedAvg = Math.round(
        verifiedSkills.reduce((acc, s) => acc + (s.verifiedScore || 70), 0) / verifiedSkills.length
      );
    }
  }

  const assessmentScore = profile.assessmentScore || 75;
  const resumeScore = profile.resumeScore || 80;
  const consistencyScore = Math.min(98, 70 + evidences.length * 3);

  // Growth Score Composite (Explainable components)
  const growthScore = Math.min(
    100,
    Math.round(
      academicScore * 0.25 +
      skillVerifiedAvg * 0.30 +
      assessmentScore * 0.20 +
      resumeScore * 0.15 +
      consistencyScore * 0.10
    )
  );

  profile.readinessScore = growthScore;
  profile.skillScore = skillVerifiedAvg;
  await profile.save();
};

module.exports = {
  emitStudentActivityEvent,
  recalculateGrowthAndReadiness,
};

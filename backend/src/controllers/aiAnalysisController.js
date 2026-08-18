const SkillAnalysis = require("../models/SkillAnalysis");
const StudentProfile = require("../models/StudentProfile");
const Academic = require("../models/Academic");
const StudentSkill = require("../models/StudentSkill");
const AssessmentSubmission = require("../models/AssessmentSubmission");
const { analyzeSkillGap, recommendCareers, runAIAgent } = require("../services/groqService");
const ActivityLog = require("../models/ActivityLog");

// @desc    Run AI Skill Gap Analysis
// @route   POST /api/ai/skill-gap
const runSkillGapAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ user: userId });
    const academic = (await Academic.findOne({ userId })) || { cgpa: 8.0 };
    const skills = await StudentSkill.find({ userId });
    const submissions = await AssessmentSubmission.find({ userId }).limit(5);

    const targetRole = req.body.targetRole || profile?.targetRole || "Full Stack Software Engineer";

    const aiResult = await analyzeSkillGap({
      cgpa: academic.cgpa,
      currentSkills: skills,
      targetRole,
      assessments: submissions,
      projects: req.body.projects || ["E-commerce App", "Real-time Chat", "Machine Learning Predictor"],
    });

    const analysis = await SkillAnalysis.create({
      userId,
      targetRole,
      gapPercentage: aiResult.gapPercentage,
      readinessScore: aiResult.readinessScore,
      strongSkills: aiResult.strongSkills,
      moderateSkills: aiResult.moderateSkills,
      weakSkills: aiResult.weakSkills,
      missingRequiredSkills: aiResult.missingRequiredSkills,
      recommendations: aiResult.recommendations,
      roleFitSummary: aiResult.roleFitSummary,
    });

    await StudentProfile.findOneAndUpdate(
      { user: userId },
      {
        readinessScore: aiResult.readinessScore,
        skillScore: Math.round(100 - aiResult.gapPercentage),
        targetRole,
      }
    );

    return res.json({ success: true, analysis });
  } catch (error) {
    console.error("AI Skill Gap error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get latest skill gap analysis
// @route   GET /api/ai/skill-gap/latest
const getLatestSkillGap = async (req, res) => {
  try {
    const analysis = await SkillAnalysis.findOne({ userId: req.user._id }).sort({ analyzedAt: -1 });
    return res.json({ success: true, analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Career Recommendations
// @route   GET /api/ai/career-recommendations
const getCareerRecommendations = async (req, res) => {
  try {
    const recommendations = await recommendCareers();
    return res.json({ success: true, recommendations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Chat with Specialized SGIP AI Agent
// @route   POST /api/ai/agent/chat
const chatWithAgent = async (req, res) => {
  try {
    const { agentType, query, context } = req.body;
    const userRole = (req.user?.role || "student").toLowerCase();

    const response = await runAIAgent({
      agentType: agentType || "Learning Agent",
      query,
      context: context || {},
      role: userRole,
    });

    return res.json({ success: true, ...response });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  runSkillGapAnalysis,
  getLatestSkillGap,
  getCareerRecommendations,
  chatWithAgent,
};

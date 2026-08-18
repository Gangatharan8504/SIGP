const Company = require("../models/Company");
const StudentSkill = require("../models/StudentSkill");
const Academic = require("../models/Academic");
const StudentProfile = require("../models/StudentProfile");

// @desc    Get all companies
// @route   GET /api/companies
const getCompanies = async (req, res) => {
  try {
    const { tier, industry, search } = req.query;
    let query = {};
    if (tier) query.tier = tier;
    if (industry) query.industry = industry;
    if (search) query.name = { $regex: search, $options: "i" };

    const companies = await Company.find(query).sort({ "typicalPackageLPA.max": -1 });
    return res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get personalized company matches for student
// @route   GET /api/companies/matches
const getCompanyMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ user: userId });
    const academic = (await Academic.findOne({ userId })) || { cgpa: 8.0, standingArrears: 0 };
    const skills = await StudentSkill.find({ userId });
    const userSkillNames = skills.map((s) => s.skillName.toLowerCase());

    const companies = await Company.find();

    const matches = companies.map((comp) => {
      let matchedCount = 0;
      const techStack = comp.requiredTechStack || [];

      techStack.forEach((reqTech) => {
        if (userSkillNames.some((us) => us.includes(reqTech.toLowerCase()) || reqTech.toLowerCase().includes(us))) {
          matchedCount++;
        }
      });

      const skillMatchPct = techStack.length > 0 ? (matchedCount / techStack.length) * 100 : 80;
      const cgpaFit = academic.cgpa >= 7.5 ? 100 : (academic.cgpa / 7.5) * 80;
      
      const overallMatch = Math.min(98, Math.max(45, Math.round(skillMatchPct * 0.6 + cgpaFit * 0.4)));

      let eligibilityStatus = "Eligible";
      let reason = "Meets all baseline CGPA and core skill stack prerequisites.";

      if (academic.standingArrears > 0) {
        eligibilityStatus = "Arrears Restriction";
        reason = "Company requires 0 standing backlogs.";
      } else if (overallMatch < 60) {
        eligibilityStatus = "Skill Gap";
        reason = "Missing key required competencies in their core production stack.";
      }

      return {
        company: comp,
        matchPercentage: overallMatch,
        matchedSkillsCount: matchedCount,
        totalRequiredSkills: techStack.length,
        eligibilityStatus,
        reason,
      };
    });

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyMatches,
};

const Skill = require("../models/Skill");
const StudentSkill = require("../models/StudentSkill");

// @desc    Get all available master skills
// @route   GET /api/skills
const getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const skills = await Skill.find(query).sort({ name: 1 });
    return res.json({ success: true, count: skills.length, skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's added skills
// @route   GET /api/skills/my-skills
const getMySkills = async (req, res) => {
  try {
    const skills = await StudentSkill.find({ userId: req.user._id });
    return res.json({ success: true, count: skills.length, skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or update a student skill
// @route   POST /api/skills/my-skills
const saveMySkill = async (req, res) => {
  try {
    const { skillName, category, proficiency, selfRating } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    let studentSkill = await StudentSkill.findOne({
      userId: req.user._id,
      skillName: { $regex: new RegExp(`^${skillName.trim()}$`, "i") },
    });

    if (studentSkill) {
      studentSkill.proficiency = proficiency || studentSkill.proficiency;
      studentSkill.selfRating = selfRating !== undefined ? Number(selfRating) : studentSkill.selfRating;
      if (category) studentSkill.category = category;
      await studentSkill.save();
    } else {
      studentSkill = await StudentSkill.create({
        userId: req.user._id,
        skillName: skillName.trim(),
        category: category || "Frontend",
        proficiency: proficiency || "Intermediate",
        selfRating: Number(selfRating) || 3,
      });
    }

    return res.json({ success: true, skill: studentSkill });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student skill
// @route   DELETE /api/skills/my-skills/:id
const deleteMySkill = async (req, res) => {
  try {
    await StudentSkill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    return res.json({ success: true, message: "Skill removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSkills,
  getMySkills,
  saveMySkill,
  deleteMySkill,
};

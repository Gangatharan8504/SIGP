const Course = require("../models/Course");
const Resource = require("../models/Resource");

// @desc    Get courses catalog
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: "i" };

    const courses = await Course.find(query).sort({ rating: -1 });
    return res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    return res.json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get placement study resources
// @route   GET /api/courses/resources/all
const getResources = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (type) query.type = type;
    if (search) query.title = { $regex: search, $options: "i" };

    const resources = await Resource.find(query).sort({ downloadsCount: -1 });
    return res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getResources,
};

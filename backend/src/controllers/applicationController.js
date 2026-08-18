const Application = require("../models/Application");

// @desc    Get current user's applications
// @route   GET /api/applications/my
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate({
        path: "driveId",
        populate: { path: "company" },
      })
      .sort({ appliedAt: -1 });

    return res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/all
const getAllApplications = async (req, res) => {
  try {
    const { status, driveId } = req.query;
    let query = {};
    if (status) query.status = status;
    if (driveId) query.driveId = driveId;

    const applications = await Application.find(query)
      .populate("userId", "name email")
      .populate({
        path: "driveId",
        populate: { path: "company" },
      })
      .sort({ appliedAt: -1 });

    return res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (Admin)
// @route   PATCH /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, currentRound, feedback } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (status) application.status = status;
    if (currentRound) application.currentRound = currentRound;
    if (feedback) application.feedback = feedback;

    await application.save();

    return res.json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};

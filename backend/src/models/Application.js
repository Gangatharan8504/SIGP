const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Online Test Cleared", "Technical Round", "HR Round", "Offered", "Rejected"],
      default: "Applied",
    },
    currentRound: {
      type: String,
      default: "Online Assessment",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    readinessScoreAtApply: {
      type: Number,
      default: 75,
    },
    feedback: {
      type: String,
      default: "Application submitted successfully.",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ driveId: 1, userId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;

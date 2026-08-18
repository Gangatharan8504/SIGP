const mongoose = require("mongoose");

const profileUpdateLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fieldName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["PERSONAL", "ACADEMIC", "SKILLS", "PROFESSIONAL", "RESUME", "OTHER"],
      default: "PERSONAL",
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "updatedAt", updatedAt: false },
  }
);

const ProfileUpdateLog = mongoose.model("ProfileUpdateLog", profileUpdateLogSchema);
module.exports = ProfileUpdateLog;

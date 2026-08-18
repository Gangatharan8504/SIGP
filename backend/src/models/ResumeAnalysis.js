const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      default: "Software Development Engineer",
    },
    overallScore: {
      type: Number,
      default: 78,
    },
    atsScore: {
      type: Number,
      default: 82,
    },
    structureScore: {
      type: Number,
      default: 75,
    },
    contentScore: {
      type: Number,
      default: 80,
    },
    matchedKeywords: [String],
    missingKeywords: [String],
    strongPoints: [String],
    improvementSuggestions: [String],
    bulletPointCritiques: [
      {
        original: String,
        suggested: String,
        reason: String,
      },
    ],
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
module.exports = ResumeAnalysis;

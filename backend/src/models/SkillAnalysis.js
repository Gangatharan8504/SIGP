const mongoose = require("mongoose");

const skillAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      default: "Full Stack Engineer",
    },
    gapPercentage: {
      type: Number,
      default: 28, // 28% gap, 72% ready
    },
    readinessScore: {
      type: Number,
      default: 72,
    },
    strongSkills: [
      {
        name: String,
        score: Number,
        status: { type: String, default: "Strong" },
      },
    ],
    moderateSkills: [
      {
        name: String,
        score: Number,
        status: { type: String, default: "Moderate" },
      },
    ],
    weakSkills: [
      {
        name: String,
        score: Number,
        status: { type: String, default: "Needs Improvement" },
      },
    ],
    missingRequiredSkills: [String],
    recommendations: [String],
    roleFitSummary: {
      type: String,
      default: "",
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SkillAnalysis = mongoose.model("SkillAnalysis", skillAnalysisSchema);
module.exports = SkillAnalysis;

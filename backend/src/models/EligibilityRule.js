const mongoose = require("mongoose");

const eligibilityRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Standard Engineering Eligibility",
    },
    minCgpa: {
      type: Number,
      default: 7.0,
    },
    minTenthPct: {
      type: Number,
      default: 65,
    },
    minTwelfthPct: {
      type: Number,
      default: 65,
    },
    maxStandingArrears: {
      type: Number,
      default: 0,
    },
    maxHistoryArrears: {
      type: Number,
      default: 2,
    },
    allowedBranches: {
      type: [String],
      default: ["Computer Science and Engineering", "Information Technology", "AI & Data Science", "ECE", "EEE"],
    },
    mandatorySkills: [String],
    minimumReadinessScore: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

const EligibilityRule = mongoose.model("EligibilityRule", eligibilityRuleSchema);
module.exports = EligibilityRule;

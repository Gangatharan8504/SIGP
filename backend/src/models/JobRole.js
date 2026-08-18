const mongoose = require("mongoose");

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: "Engineering",
    },
    description: {
      type: String,
      default: "",
    },
    requiredSkills: [
      {
        skillName: String,
        importance: { type: String, enum: ["Mandatory", "Preferred", "Optional"], default: "Mandatory" },
        minRating: { type: Number, default: 3 },
      },
    ],
    minCgpa: {
      type: Number,
      default: 7.0,
    },
    averageCtcLPA: {
      type: Number,
      default: 12,
    },
    marketDemand: {
      type: String,
      enum: ["Moderate", "High", "Very High"],
      default: "High",
    },
  },
  {
    timestamps: true,
  }
);

const JobRole = mongoose.model("JobRole", jobRoleSchema);
module.exports = JobRole;

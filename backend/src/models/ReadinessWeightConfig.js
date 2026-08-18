const mongoose = require("mongoose");

const readinessWeightConfigSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      default: "Default Placement Policy",
    },
    academicWeight: {
      type: Number,
      default: 20, // 20%
    },
    skillsWeight: {
      type: Number,
      default: 20, // 20%
    },
    assessmentWeight: {
      type: Number,
      default: 20, // 20%
    },
    codingWeight: {
      type: Number,
      default: 15, // 15%
    },
    resumeWeight: {
      type: Number,
      default: 10, // 10%
    },
    projectsWeight: {
      type: Number,
      default: 10, // 10%
    },
    consistencyWeight: {
      type: Number,
      default: 5, // 5%
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    configuredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Helper to get or create active configuration
readinessWeightConfigSchema.statics.getActiveConfig = async function () {
  let config = await this.findOne({ isActive: true });
  if (!config) {
    config = await this.create({
      institutionName: "Standard Placement Evaluation Framework",
      academicWeight: 20,
      skillsWeight: 20,
      assessmentWeight: 20,
      codingWeight: 15,
      resumeWeight: 10,
      projectsWeight: 10,
      consistencyWeight: 5,
    });
  }
  return config;
};

const ReadinessWeightConfig = mongoose.model("ReadinessWeightConfig", readinessWeightConfigSchema);
module.exports = ReadinessWeightConfig;

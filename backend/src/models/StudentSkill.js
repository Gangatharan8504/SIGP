const mongoose = require("mongoose");

const studentSkillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Frontend",
    },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    selfRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    verifiedScore: {
      type: Number,
      default: 0,
    },
    verifiedViaAssessment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

studentSkillSchema.index({ userId: 1, skillName: 1 }, { unique: true });

const StudentSkill = mongoose.model("StudentSkill", studentSkillSchema);
module.exports = StudentSkill;

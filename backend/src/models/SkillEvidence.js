const mongoose = require("mongoose");

const skillEvidenceSchema = new mongoose.Schema(
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
      index: true,
    },
    sourceType: {
      type: String,
      enum: [
        "ASSESSMENT",
        "COMPILER_SUBMISSION",
        "ASSIGNMENT",
        "PROJECT",
        "HACKATHON",
        "FACULTY_EVALUATION",
        "EXTERNAL_CODING",
      ],
      required: true,
    },
    sourceTitle: {
      type: String,
      required: true,
    },
    sourceReferenceId: {
      type: String,
      default: "",
    },
    scoreEarned: {
      type: Number,
      default: 100, // percentage or marks
    },
    confidenceWeight: {
      type: Number,
      default: 0.8, // 0.0 to 1.0
    },
    evidenceSummary: {
      type: String,
      default: "",
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SkillEvidence = mongoose.model("SkillEvidence", skillEvidenceSchema);
module.exports = SkillEvidence;

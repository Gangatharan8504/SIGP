const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Technical Aptitude",
    },
    targetRole: {
      type: String,
      default: "Software Engineer",
    },
    skillTags: [String],
    difficulty: {
      type: String,
      enum: ["Beginner", "Easy", "Medium", "Intermediate", "Advanced", "Hard"],
      default: "Intermediate",
    },
    isBaselineAssessment: {
      type: Boolean,
      default: false,
    },
    sectionTimings: [
      {
        sectionName: String,
        durationMinutes: Number,
        questionCount: Number,
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    durationMinutes: {
      type: Number,
      default: 30,
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 60,
    },
    maxAttempts: {
      type: Number,
      default: 3, // Strict SGIP examination maximum attempts = 3
    },
    isSecureExamMode: {
      type: Boolean,
      default: true,
    },
    randomizeQuestions: {
      type: Boolean,
      default: true,
    },
    randomizeOptions: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;

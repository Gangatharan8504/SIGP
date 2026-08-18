const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    tenthPercentage: {
      type: Number,
      default: null,
    },
    tenthBoard: {
      type: String,
      default: "",
    },
    twelfthOrDiplomaPercentage: {
      type: Number,
      default: null,
    },
    twelfthBoard: {
      type: String,
      default: "",
    },
    currentDegree: {
      type: String,
      default: "B.Tech",
    },
    branch: {
      type: String,
      default: "",
    },
    currentSemester: {
      type: Number,
      default: null,
    },
    cgpa: {
      type: Number,
      default: null,
    },
    activeBacklogs: {
      type: Number,
      default: 0,
    },
    clearedArrears: {
      type: Number,
      default: 0,
    },
    historyOfArrears: {
      type: Number,
      default: 0,
    },
    standingArrears: {
      type: Number,
      default: 0,
    },
    gapYears: {
      type: Number,
      default: 0,
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    academicPerformanceScore: {
      type: Number,
      default: null, // 0-100 derived from CGPA
    },
    semesterHistory: [
      {
        semester: Number,
        sgpa: Number,
        totalCredits: Number,
        subjects: [
          {
            code: String,
            name: String,
            grade: String,
            percentage: Number,
            category: { type: String, enum: ["CORE", "ELECTIVE", "LAB", "MATH", "HUMANITIES"], default: "CORE" },
          },
        ],
      },
    ],
    subjectStrengths: [
      {
        subjectName: String,
        scorePct: Number,
        status: { type: String, default: "Strong" },
      },
    ],
    subjectWeaknesses: [
      {
        subjectName: String,
        scorePct: Number,
        status: { type: String, default: "Needs Attention" },
        aiAdvice: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Academic = mongoose.model("Academic", academicSchema);
module.exports = Academic;

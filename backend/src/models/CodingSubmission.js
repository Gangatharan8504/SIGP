const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingProblem",
      required: true,
      index: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
      ],
      default: "Wrong Answer",
    },
    score: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    runtimeMs: {
      type: Number,
      default: 0,
    },
    memoryMb: {
      type: Number,
      default: 0,
    },
    stdout: {
      type: String,
      default: "",
    },
    stderr: {
      type: String,
      default: "",
    },
    compileError: {
      type: String,
      default: "",
    },
    testResults: [
      {
        caseNumber: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        isHidden: Boolean,
        executionTimeMs: Number,
      },
    ],
    aiReview: {
      correctness: String,
      efficiency: String,
      readability: String,
      timeComplexity: String,
      spaceComplexity: String,
      suggestions: [String],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

codingSubmissionSchema.index({ studentId: 1, problemId: 1, status: 1 });

const CodingSubmission = mongoose.model("CodingSubmission", codingSubmissionSchema);
module.exports = CodingSubmission;

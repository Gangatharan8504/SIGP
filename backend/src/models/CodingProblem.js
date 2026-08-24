const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    category: {
      type: String,
      default: "Data Structures & Algorithms",
    },
    topics: [{ type: String }],
    skillsTested: [{ type: String }],
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    examples: [
      {
        input: { type: String },
        output: { type: String },
        explanation: { type: String },
      },
    ],
    starterCode: {
      java: { type: String },
      python: { type: String },
      cpp: { type: String },
      c: { type: String },
      javascript: { type: String },
      sql: { type: String },
    },
    testCases: [
      {
        input: { type: String },
        output: { type: String },
        isHidden: { type: Boolean, default: false },
        explanation: { type: String },
      },
    ],
    timeLimitMs: {
      type: Number,
      default: 2000,
    },
    memoryLimitMb: {
      type: Number,
      default: 256,
    },
    acceptedCount: {
      type: Number,
      default: 0,
    },
    submissionCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Published", "Draft", "Archived"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

codingProblemSchema.index({ difficulty: 1, category: 1 });

const CodingProblem = mongoose.model("CodingProblem", codingProblemSchema);
module.exports = CodingProblem;

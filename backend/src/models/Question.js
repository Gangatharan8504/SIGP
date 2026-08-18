const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Data Structures & Algorithms",
    },
    skillTag: {
      type: String,
      default: "JavaScript",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Easy", "Medium", "Intermediate", "Advanced", "Hard"],
      default: "Easy",
    },
    type: {
      type: String,
      enum: ["mcq", "coding"],
      default: "mcq",
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    starterCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      cpp: { type: String, default: "" },
      java: { type: String, default: "" },
    },
    testCases: [
      {
        input: String,
        output: String,
        isHidden: { type: Boolean, default: false },
      },
    ],
    explanation: {
      type: String,
      default: "",
    },
    marks: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

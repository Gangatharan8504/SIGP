const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: String,
      default: "Computer Science and Engineering",
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      default: "",
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    submissionType: {
      type: String,
      enum: ["PDF", "ZIP", "CODE", "GITHUB", "TEXT", "PROJECT"],
      default: "GITHUB",
    },
    skillsMapped: [String],
    rubric: [
      {
        criteria: String,
        maxMarks: Number,
      },
    ],
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;

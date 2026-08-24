const mongoose = require("mongoose");

const examSessionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    difficultyProfile: {
      type: String,
      default: "Standard",
    },
    questions: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    savedAnswers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    savedCodingAnswers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastAutoSaveAt: {
      type: Date,
      default: Date.now,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

examSessionSchema.index({ studentId: 1, assessmentId: 1, attemptNumber: 1 });

const ExamSession = mongoose.model("ExamSession", examSessionSchema);
module.exports = ExamSession;

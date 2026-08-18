const mongoose = require("mongoose");

const assessmentSubmissionSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    integrityScore: {
      type: Number,
      default: 100, // Reduced when integrity events occur
    },
    screenShareGranted: {
      type: Boolean,
      default: false,
    },
    sectionScores: {
      aptitude: { score: { type: Number, default: 0 }, maxScore: { type: Number, default: 10 } },
      reasoning: { score: { type: Number, default: 0 }, maxScore: { type: Number, default: 10 } },
      verbal: { score: { type: Number, default: 0 }, maxScore: { type: Number, default: 10 } },
      pseudoCode: { score: { type: Number, default: 0 }, maxScore: { type: Number, default: 10 } },
      coding: { score: { type: Number, default: 0 }, maxScore: { type: Number, default: 20 } },
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOptionIndex: Number,
        codeSubmitted: String,
        isCorrect: Boolean,
        marksEarned: Number,
        section: String,
      },
    ],
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

assessmentSubmissionSchema.index({ assessmentId: 1, userId: 1, attemptNumber: 1 });

const AssessmentSubmission = mongoose.model(
  "AssessmentSubmission",
  assessmentSubmissionSchema
);
module.exports = AssessmentSubmission;

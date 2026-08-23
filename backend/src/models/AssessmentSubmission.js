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
    percentile: {
      type: Number,
      default: 50,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    integrityScore: {
      type: Number,
      default: 100, // Starts at 100, reduced for logged violations
    },
    reviewStatus: {
      type: String,
      enum: ["VERIFIED_CLEAN", "NEEDS_FACULTY_REVIEW", "PENALIZED", "FLAGGED"],
      default: "VERIFIED_CLEAN",
    },
    facultyReviewNotes: {
      type: String,
      default: "",
    },
    screenShareGranted: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    browserUsed: {
      type: String,
      default: "Chrome",
    },
    tabSwitches: {
      type: Number,
      default: 0,
    },
    devToolsCount: {
      type: Number,
      default: 0,
    },
    cameraInterruptionCount: {
      type: Number,
      default: 0,
    },
    networkInterruptionCount: {
      type: Number,
      default: 0,
    },
    warningCount: {
      type: Number,
      default: 0,
    },
    difficultyProfile: {
      type: String,
      default: "Easy + Medium",
    },
    sectionScores: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        Aptitude: { score: 0, maxScore: 10, avgScore: 5.32, topScore: 10, leastScore: 0 },
        Reasoning: { score: 0, maxScore: 10, avgScore: 6.15, topScore: 10, leastScore: 0 },
        Verbal: { score: 0, maxScore: 10, avgScore: 5.80, topScore: 10, leastScore: 0 },
        "Pseudo Code": { score: 0, maxScore: 10, avgScore: 4.90, topScore: 10, leastScore: 0 },
        Coding: { score: 0, maxScore: 20, avgScore: 8.50, topScore: 20, leastScore: 0 },
      },
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
    aiRecommendations: {
      strengths: [String],
      weaknesses: [String],
      actionableTips: [String],
      verdict: String,
    },
    improvementMetrics: {
      previousScore: Number,
      scoreDelta: Number,
      percentageChange: Number,
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

const mongoose = require("mongoose");

const assessmentSubmissionSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.Mixed,
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
      default: 60, // Fixed 60 marks total (10+10+10+10+20)
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
      default: "Verified Clean",
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
      default: {},
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    codingAnswers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    reviewData: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
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

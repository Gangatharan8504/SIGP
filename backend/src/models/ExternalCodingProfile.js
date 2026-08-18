const mongoose = require("mongoose");

const externalCodingProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "HackerRank", "CodeChef", "Codeforces", "GeeksforGeeks"],
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      default: "",
    },
    problemsSolved: {
      total: { type: Number, default: 150 },
      easy: { type: Number, default: 80 },
      medium: { type: Number, default: 55 },
      hard: { type: Number, default: 15 },
    },
    contestRating: {
      type: Number,
      default: 1650,
    },
    currentStreak: {
      type: Number,
      default: 18,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

externalCodingProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });

const ExternalCodingProfile = mongoose.model(
  "ExternalCodingProfile",
  externalCodingProfileSchema
);
module.exports = ExternalCodingProfile;

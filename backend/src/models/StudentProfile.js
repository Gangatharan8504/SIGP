const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    studentId: {
      type: String,
      default: function () {
        return `SGIP-${Math.floor(1000 + Math.random() * 9000)}`;
      },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    registerNumber: {
      type: String,
      trim: true,
      default: "",
    },
    rollNumber: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      default: "Computer Science and Engineering",
    },
    batch: {
      type: String,
      default: "2022-2026",
    },
    batchYear: {
      type: Number,
      default: 2026,
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    academicYear: {
      type: Number,
      default: 4,
    },
    collegeName: {
      type: String,
      default: "Institute of Technology & Engineering",
    },
    targetRole: {
      type: String,
      default: "Full Stack Software Engineer",
    },
    bio: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    portfolioUrl: {
      type: String,
      default: "",
    },
    codingProfiles: {
      leetcode: { type: String, default: "" },
      codechef: { type: String, default: "" },
      hackerrank: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    placementStatus: {
      type: String,
      enum: ["Seeking", "Placed", "Opted-Out", "SEEKING", "PLACED", "OPTED_OUT"],
      default: "Seeking",
    },
    // True Evidence-Based Computed Scores (null when unearned / pending)
    resumeScore: {
      type: Number,
      default: null,
    },
    skillScore: {
      type: Number,
      default: null,
    },
    readinessScore: {
      type: Number,
      default: null,
    },
    assessmentScore: {
      type: Number,
      default: null,
    },
    codingScore: {
      type: Number,
      default: null,
    },
    projectsScore: {
      type: Number,
      default: null,
    },
    consistencyScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
module.exports = StudentProfile;
const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "Associate Software Engineer",
    },
    packageCTC: {
      type: Number,
      required: true,
      default: 10, // LPA
    },
    driveDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    registrationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    jobLocation: {
      type: String,
      default: "Hyderabad / Bangalore",
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Internship + FTE", "Internship"],
      default: "Full-Time",
    },
    description: {
      type: String,
      default: "",
    },
    eligibilityRule: {
      minCgpa: { type: Number, default: 7.0 },
      maxArrears: { type: Number, default: 0 },
      allowedDepartments: [String],
    },
    rounds: [
      {
        roundNumber: Number,
        roundName: String,
        mode: { type: String, enum: ["Online Test", "Technical Interview 1", "Technical Interview 2", "HR Round", "Group Discussion"], default: "Online Test" },
        scheduledDate: Date,
      },
    ],
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementDrive = mongoose.model("PlacementDrive", placementDriveSchema);
module.exports = PlacementDrive;

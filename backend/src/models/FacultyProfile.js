const mongoose = require("mongoose");

const facultyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      default: "Computer Science and Engineering",
    },
    designation: {
      type: String,
      default: "Associate Professor & Placement Faculty Advisor",
    },
    assignedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    mentoringCohort: {
      batchYear: { type: Number, default: 2026 },
      department: { type: String, default: "Computer Science and Engineering" },
      totalMentees: { type: Number, default: 42 },
    },
  },
  {
    timestamps: true,
  }
);

const FacultyProfile = mongoose.model("FacultyProfile", facultyProfileSchema);
module.exports = FacultyProfile;

const mongoose = require("mongoose");

const examIntegrityEventSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        "TAB_SWITCH",
        "WINDOW_BLUR",
        "FULLSCREEN_EXIT",
        "COPY_PASTE",
        "CAMERA_ABSENCE",
        "MULTIPLE_FACES",
        "NETWORK_DISCONNECT",
        "SUSPICIOUS_KEYSTROKE",
        "SCREEN_SHARE_ALLOWED",
        "SCREEN_SHARE_DECLINED",
        "SCREEN_SHARE_STOPPED",
        "EXAM_START",
        "EXAM_SUBMIT",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    details: {
      type: String,
      default: "",
    },
    reviewStatus: {
      type: String,
      enum: ["FLAGGED", "REVIEWED_CLEARED", "PENALIZED", "UNDER_REVIEW"],
      default: "FLAGGED",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    facultyNotes: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ExamIntegrityEvent = mongoose.model(
  "ExamIntegrityEvent",
  examIntegrityEventSchema
);
module.exports = ExamIntegrityEvent;

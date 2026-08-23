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
        "WINDOW_MINIMIZE",
        "FOCUS_LOSS",
        "FULLSCREEN_EXIT",
        "DEVTOOLS_OPENED",
        "INSPECT_ELEMENT",
        "COPY_PASTE",
        "CLIPBOARD_OPERATION",
        "CAMERA_ABSENCE",
        "CAMERA_DISABLED",
        "CAMERA_BLOCKED",
        "MULTIPLE_FACES",
        "FACE_MISSING",
        "NETWORK_DISCONNECT",
        "NETWORK_SLOW",
        "SUSPICIOUS_KEYSTROKE",
        "SCREEN_SHARE_ALLOWED",
        "SCREEN_SHARE_DECLINED",
        "SCREEN_SHARE_STOPPED",
        "SCREEN_SHARE_INTERRUPTED",
        "SCREEN_SHARE_ENDED",
        "CONSENT_ACCEPTED",
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
    durationSeconds: {
      type: Number,
      default: 0,
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

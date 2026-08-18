const mongoose = require("mongoose");

const ragDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["PDF", "PPT", "PPTX", "DOCX", "TXT", "NOTES"],
      default: "PDF",
    },
    fileSize: {
      type: String,
      default: "1.5 MB",
    },
    totalChunks: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
      default: "Computer Science and Engineering",
    },
    subject: {
      type: String,
      default: "Data Structures and Algorithms",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const RAGDocument = mongoose.model("RAGDocument", ragDocumentSchema);
module.exports = RAGDocument;

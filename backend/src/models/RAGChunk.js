const mongoose = require("mongoose");

const ragChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RAGDocument",
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    keywords: [String],
    sourceCitation: {
      type: String,
      default: "", // e.g. "DSA Masterclass Module 2 - Page 14"
    },
    department: {
      type: String,
      default: "Computer Science and Engineering",
    },
    subject: {
      type: String,
      default: "Data Structures and Algorithms",
    },
  },
  {
    timestamps: true,
  }
);

ragChunkSchema.index({ content: "text", keywords: "text" });

const RAGChunk = mongoose.model("RAGChunk", ragChunkSchema);
module.exports = RAGChunk;

const mongoose = require("mongoose");

const savedCodeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingProblem",
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      default: "java",
    },
    sourceCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedCodeSchema.index({ studentId: 1, problemId: 1, language: 1 }, { unique: true });

const SavedCode = mongoose.model("SavedCode", savedCodeSchema);
module.exports = SavedCode;

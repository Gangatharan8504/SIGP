const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Interview Prep",
    },
    type: {
      type: String,
      enum: ["PDF", "CheatSheet", "Article", "Video", "Template"],
      default: "PDF",
    },
    link: {
      type: String,
      default: "#",
    },
    fileSize: {
      type: String,
      default: "2.4 MB",
    },
    tags: [String],
    downloadsCount: {
      type: Number,
      default: 150,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;

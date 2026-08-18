const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "Cloud & DevOps",
        "Core CS",
        "Data & AI",
        "Aptitude & Soft Skills",
        "Mobile",
      ],
      default: "Frontend",
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "Code",
    },
    demandLevel: {
      type: String,
      enum: ["High", "Very High", "Moderate"],
      default: "High",
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;

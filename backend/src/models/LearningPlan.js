const mongoose = require("mongoose");

const learningPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      default: "Full Stack Developer",
    },
    generatedByAI: {
      type: Boolean,
      default: true,
    },
    overallProgressPercentage: {
      type: Number,
      default: 35,
    },
    weeks: [
      {
        weekNumber: Number,
        title: String,
        theme: String,
        isCompleted: { type: Boolean, default: false },
        tasks: [
          {
            taskId: String,
            title: String,
            type: { type: String, enum: ["course", "practice", "assessment", "project", "resume"], default: "course" },
            estimatedHours: Number,
            completed: { type: Boolean, default: false },
            resourceLink: String,
          },
        ],
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const LearningPlan = mongoose.model("LearningPlan", learningPlanSchema);
module.exports = LearningPlan;

const mongoose = require("mongoose");

const roadmapTaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  type: {
    type: String,
    enum: ["course", "coding", "practice", "assessment", "project", "youtube", "theory", "resume"],
    default: "theory",
  },
  required: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "LOCKED"],
    default: "NOT_STARTED",
  },
  completed: { type: Boolean, default: false },
  dependsOn: [{ type: String }],
  estimatedMinutes: { type: Number, default: 45 },
  estimatedHours: { type: Number, default: 1 },
  resourceLink: { type: String, default: "" },
  youtubeResource: {
    title: { type: String, default: "" },
    url: { type: String, default: "" },
    topic: { type: String, default: "" },
    searchQuery: { type: String, default: "" },
  },
  completedAt: { type: Date },
});

const roadmapWeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  theme: { type: String, default: "" },
  description: { type: String, default: "" },
  learningObjectives: [{ type: String }],
  requiredSkills: [{ type: String }],
  estimatedHours: { type: Number, default: 10 },
  isUnlocked: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  progressPercentage: { type: Number, default: 0 },
  unlockedAt: { type: Date },
  completedAt: { type: Date },
  tasks: [roadmapTaskSchema],
});

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
      default: "Java Developer",
    },
    version: {
      type: Number,
      default: 1,
    },
    generatedByAI: {
      type: Boolean,
      default: true,
    },
    overallProgressPercentage: {
      type: Number,
      default: 0,
    },
    weakAreasDetected: [{ type: String }],
    profileSnapshot: {
      cgpa: Number,
      readinessScore: Number,
      assessmentScore: Number,
      codingProblemsSolved: Number,
      skillsCount: Number,
    },
    weeks: [roadmapWeekSchema],
    history: [
      {
        version: Number,
        targetRole: String,
        generatedAt: { type: Date, default: Date.now },
        progressPercentage: Number,
        weeksSummary: [
          {
            weekNumber: Number,
            title: String,
            isCompleted: Boolean,
            progressPercentage: Number,
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

learningPlanSchema.index({ userId: 1 });

const LearningPlan = mongoose.model("LearningPlan", learningPlanSchema);
module.exports = LearningPlan;

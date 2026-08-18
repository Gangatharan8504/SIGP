const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Full Stack Development",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    instructor: {
      type: String,
      default: "SGIP Masterclass",
    },
    durationHours: {
      type: Number,
      default: 12,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    },
    tags: [String],
    modules: [
      {
        title: String,
        lessonsCount: Number,
        duration: String,
        lessons: [
          {
            title: String,
            duration: String,
            videoUrl: String,
            summary: String,
          },
        ],
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
    },
    enrolledCount: {
      type: Number,
      default: 240,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

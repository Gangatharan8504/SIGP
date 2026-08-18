const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const skillRoutes = require("./routes/skillRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const codeRoutes = require("./routes/codeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const learningPlanRoutes = require("./routes/learningPlanRoutes");
const companyRoutes = require("./routes/companyRoutes");
const placementDriveRoutes = require("./routes/placementDriveRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const coordinatorRoutes = require("./routes/coordinatorRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const ragRoutes = require("./routes/ragRoutes");
const examProctorRoutes = require("./routes/examProctorRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Root Healthcheck
app.get("/", (req, res) => {
  res.json({
    message: "SGIP Student Growth Intelligence & Placement Platform API is running",
    version: "2.0.0",
    roles: ["STUDENT", "FACULTY", "PLACEMENT_COORDINATOR"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date(), version: "2.0.0" });
});

// API Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/learning-plans", learningPlanRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/drives", placementDriveRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/exam-proctor", examProctorRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

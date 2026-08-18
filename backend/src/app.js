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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Root & Healthcheck
const healthHandler = (req, res) => {
  res.json({
    status: "ok",
    message: "SGIP Student Growth Intelligence & Placement Platform API is running",
    timestamp: new Date(),
    version: "2.0.0",
    roles: ["STUDENT", "FACULTY", "PLACEMENT_COORDINATOR"],
  });
};

app.get("/", healthHandler);
app.get("/api", healthHandler);
app.get("/api/health", healthHandler);
app.get("/health", healthHandler);

// API Routes Mounting (support both /api/path and /path)
const routes = [
  { path: "auth", handler: authRoutes },
  { path: "students", handler: studentRoutes },
  { path: "skills", handler: skillRoutes },
  { path: "assessments", handler: assessmentRoutes },
  { path: "code", handler: codeRoutes },
  { path: "courses", handler: courseRoutes },
  { path: "learning-plans", handler: learningPlanRoutes },
  { path: "companies", handler: companyRoutes },
  { path: "drives", handler: placementDriveRoutes },
  { path: "applications", handler: applicationRoutes },
  { path: "resumes", handler: resumeRoutes },
  { path: "ai", handler: aiRoutes },
  { path: "notifications", handler: notificationRoutes },
  { path: "admin", handler: adminRoutes },
  { path: "faculty", handler: facultyRoutes },
  { path: "coordinator", handler: coordinatorRoutes },
  { path: "assignments", handler: assignmentRoutes },
  { path: "rag", handler: ragRoutes },
  { path: "exam-proctor", handler: examProctorRoutes },
];

routes.forEach(({ path: p, handler }) => {
  app.use(`/api/${p}`, handler);
  app.use(`/${p}`, handler);
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

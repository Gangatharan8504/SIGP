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

// Production CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.STREAMLIT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8501",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8501",
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/+$/, ""));

if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes(",")) {
  process.env.FRONTEND_URL.split(",").forEach((o) => {
    if (o.trim()) allowedOrigins.push(o.trim().replace(/\/+$/, ""));
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.trim().replace(/\/+$/, "");
    const isAllowed =
      allowedOrigins.some((allowed) => cleanOrigin === allowed) ||
      cleanOrigin.includes("localhost") ||
      cleanOrigin.includes("127.0.0.1") ||
      (/\.vercel\.app$/.test(cleanOrigin) && allowedOrigins.some((a) => a.includes("vercel.app"))) ||
      (/\.streamlit\.app$/.test(cleanOrigin) && allowedOrigins.some((a) => a.includes("streamlit.app")));

    if (isAllowed) {
      callback(null, true);
    } else {
      // Allow during transition or restrict to configured origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serverless Database Connection Assurance Middleware
const connectDB = require("./config/db");
app.use(async (req, res, next) => {
  // Allow healthcheck to return immediately
  if (req.path === "/health" || req.path === "/api/health") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err.message);
    return res.status(503).json({
      success: false,
      message: "Database connection initializing. Please retry in a few seconds.",
    });
  }
});

// Root & Healthcheck Endpoints
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SGIP Student Growth Intelligence & Placement Platform API is running",
    timestamp: new Date(),
    version: "2.0.0",
    roles: ["STUDENT", "FACULTY", "PLACEMENT_COORDINATOR"],
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "SGIP API Root",
    timestamp: new Date(),
    version: "2.0.0",
  });
});

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

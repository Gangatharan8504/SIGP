const connectDB = require("../backend/src/config/db");
const app = require("../backend/src/app");
const seedDatabase = require("../backend/src/seeds/seedData");

let isSeeded = false;

// Global Serverless DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      isSeeded = true;
      seedDatabase().catch((e) => console.error("Initial seed notice:", e.message));
    }
  } catch (err) {
    console.error("Vercel DB connection error:", err.message);
  }
  next();
});

module.exports = app;

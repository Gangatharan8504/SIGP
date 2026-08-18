const connectDB = require("../backend/src/config/db");
const app = require("../backend/src/app");
const seedDatabase = require("../backend/src/seeds/seedData");

let isSeeded = false;

module.exports = async (req, res) => {
  try {
    await connectDB();
    if (!isSeeded) {
      isSeeded = true;
      seedDatabase().catch((e) => console.error("Seed error:", e));
    }
  } catch (err) {
    console.error("Vercel Serverless DB connection error:", err);
  }
  return app(req, res);
};

const connectDB = require("../backend/src/config/db");
const app = require("../backend/src/app");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("Vercel Serverless MongoDB connection error:", err);
    }
  }
  return app(req, res);
};

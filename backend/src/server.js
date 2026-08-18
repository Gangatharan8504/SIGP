require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./seeds/seedData");
const { seedBaselineAssessment } = require("./seeds/seedBaselineAssessment");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await seedBaselineAssessment();

    app.listen(PORT, () => {
      console.log(`SGIP Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
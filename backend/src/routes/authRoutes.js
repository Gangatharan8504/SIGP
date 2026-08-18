const express = require("express");
const { register, login, getMe, testWelcomeEmail } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/test-welcome-email", testWelcomeEmail);

module.exports = router;

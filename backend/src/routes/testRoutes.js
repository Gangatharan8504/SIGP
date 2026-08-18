const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/create-test-user", async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash(
            "TestPassword123",
            12
        );

        const user = await User.create({
            email: "test@sgip.com",
            password: passwordHash,
            role: "STUDENT"
        });

        res.status(201).json({
            message: "Test user created successfully",
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create test user"
        });
    }
});

module.exports = router;
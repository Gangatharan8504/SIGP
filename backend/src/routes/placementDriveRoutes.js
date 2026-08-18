const express = require("express");
const { getDrives, getDriveById, applyForDrive } = require("../controllers/placementDriveController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res, next) => {
  // Optional auth to attach application status if token exists
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, getDrives);

router.get("/:id", (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, getDriveById);

router.post("/:id/apply", protect, applyForDrive);

module.exports = router;

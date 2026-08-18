const express = require("express");
const { getCompanies, getCompanyMatches } = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCompanies);
router.get("/matches", protect, getCompanyMatches);

module.exports = router;

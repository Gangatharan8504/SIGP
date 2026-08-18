const express = require("express");
const { getCourses, getCourseById, getResources } = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/resources/all", getResources);
router.get("/:id", getCourseById);

module.exports = router;

const express = require("express");
const {
  getAllSkills,
  getMySkills,
  saveMySkill,
  deleteMySkill,
} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllSkills);
router.get("/my-skills", protect, getMySkills);
router.post("/my-skills", protect, saveMySkill);
router.delete("/my-skills/:id", protect, deleteMySkill);

module.exports = router;

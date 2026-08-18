const express = require("express");
const { runCode, getPracticeQuestions } = require("../controllers/codeExecutionController");

const router = express.Router();

router.post("/run", runCode);
router.get("/practice-questions", getPracticeQuestions);

module.exports = router;

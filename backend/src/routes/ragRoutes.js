const express = require("express");
const {
  uploadRAGDocument,
  queryRAG,
  getRAGDocuments,
} = require("../controllers/ragController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/query", queryRAG);
router.get("/documents", getRAGDocuments);
router.post("/upload", protect, authorize("faculty", "FACULTY", "admin", "ADMIN"), uploadRAGDocument);

module.exports = router;

const RAGDocument = require("../models/RAGDocument");
const { ingestDocument, queryRAGKnowledge } = require("../services/ragService");

// @desc    Upload course document to RAG knowledge base
// @route   POST /api/rag/upload
const uploadRAGDocument = async (req, res) => {
  try {
    const { title, courseId, fileType, textContent, department, subject } = req.body;

    if (!textContent || textContent.length < 20) {
      return res.status(400).json({ success: false, message: "Document text content is required" });
    }

    const doc = await ingestDocument({
      title: title || "Course Material Notes",
      facultyId: req.user._id,
      courseId,
      fileName: req.body.fileName || "lecture_notes.pdf",
      fileType: fileType || "PDF",
      textContent,
      department: department || "Computer Science and Engineering",
      subject: subject || "DSA & Web Architecture",
    });

    return res.status(201).json({ success: true, document: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Query RAG knowledge base
// @route   POST /api/rag/query
const queryRAG = async (req, res) => {
  try {
    const { query, department, subject } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query string is required" });
    }

    const result = await queryRAGKnowledge({ query, department, subject });
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all indexed RAG documents
// @route   GET /api/rag/documents
const getRAGDocuments = async (req, res) => {
  try {
    const docs = await RAGDocument.find().populate("facultyId", "name email").sort({ uploadedAt: -1 });
    return res.json({ success: true, count: docs.length, documents: docs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  uploadRAGDocument,
  queryRAG,
  getRAGDocuments,
};

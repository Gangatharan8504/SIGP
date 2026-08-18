const Resume = require("../models/Resume");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const StudentProfile = require("../models/StudentProfile");
const { analyzeResumeATS } = require("../services/groqService");
const ActivityLog = require("../models/ActivityLog");
const path = require("path");

// Dynamic text extractors
let pdfParse;
let mammoth;
try {
  pdfParse = require("pdf-parse");
} catch (e) {}
try {
  mammoth = require("mammoth");
} catch (e) {}

/**
 * Helper to detect required resume sections
 */
const detectResumeStructure = (text) => {
  const lower = text.toLowerCase();

  const sections = {
    contact: Boolean(
      lower.includes("@") ||
      /\b\d{10}\b/.test(lower) ||
      lower.includes("phone") ||
      lower.includes("email") ||
      lower.includes("linkedin") ||
      lower.includes("github")
    ),
    education: Boolean(
      lower.includes("education") ||
      lower.includes("b.tech") ||
      lower.includes("b.e") ||
      lower.includes("degree") ||
      lower.includes("cgpa") ||
      lower.includes("university") ||
      lower.includes("college") ||
      lower.includes("school")
    ),
    skills: Boolean(
      lower.includes("skill") ||
      lower.includes("technical skill") ||
      lower.includes("proficiencies") ||
      lower.includes("technologies") ||
      lower.includes("languages") ||
      lower.includes("tools")
    ),
    projects: Boolean(
      lower.includes("project") ||
      lower.includes("academic project") ||
      lower.includes("experience") ||
      lower.includes("internship") ||
      lower.includes("work experience")
    ),
  };

  const missingSections = [];
  if (!sections.contact) missingSections.push("Contact Details (Email / Phone / LinkedIn)");
  if (!sections.education) missingSections.push("Education & Academic History");
  if (!sections.skills) missingSections.push("Technical Skills & Frameworks");
  if (!sections.projects) missingSections.push("Projects & Practical Experience");

  return {
    sectionsFound: sections,
    missingSections,
    isCompleteStructure: missingSections.length === 0,
  };
};

// @desc    Upload PDF/DOCX resume and perform AI ATS Analysis
// @route   POST /api/resumes/analyze
const uploadAndAnalyzeResume = async (req, res) => {
  try {
    let extractedText = req.body.resumeText || "";
    let fileName = "pasted_resume.txt";
    let fileSize = extractedText.length;
    let mimeType = "text/plain";

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
      const ext = path.extname(fileName).toLowerCase();

      if (ext === ".pdf" || ext === ".docx" || ext === ".doc") {
        // 1. Try Node parser first
        if (ext === ".pdf" && pdfParse && typeof pdfParse === "function") {
          try {
            const pdfData = await pdfParse(req.file.buffer);
            if (pdfData && pdfData.text) extractedText = pdfData.text;
          } catch (e) {}
        } else if ((ext === ".docx" || ext === ".doc") && mammoth) {
          try {
            const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
            if (docxData && docxData.value) extractedText = docxData.value;
          } catch (e) {}
        }

        // 2. High-precision Python fallback (pypdf/docx)
        if (!extractedText || extractedText.trim().length < 30) {
          try {
            const tempDir = path.resolve(__dirname, "../../uploads");
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
            const tempFilePath = path.join(tempDir, `temp_${Date.now()}_${fileName}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);

            const extractorScript = path.resolve(__dirname, "../services/extract_text.py");
            const pyOutput = await new Promise((resolve) => {
              exec(`python "${extractorScript}" "${tempFilePath}"`, { encoding: "utf8" }, (err, stdout) => {
                if (fs.existsSync(tempFilePath)) {
                  try { fs.unlinkSync(tempFilePath); } catch (uErr) {}
                }
                if (err || !stdout) resolve("");
                else resolve(stdout);
              });
            });

            if (pyOutput && pyOutput.trim().length > 0) {
              extractedText = pyOutput.trim();
            }
          } catch (pyErr) {
            console.error("Python extractor fallback error:", pyErr);
          }
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid resume file. Please upload a valid PDF or DOCX resume.",
        });
      }
    }

    // Clean whitespace
    extractedText = extractedText.replace(/\r\n/g, "\n").trim();

    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF resume file. Please upload an unencrypted, text-readable PDF (not a scanned image).",
      });
    }

    // Run structural integrity inspection
    const structureAnalysis = detectResumeStructure(extractedText);

    const profile = await StudentProfile.findOne({ user: req.user._id });
    const targetRole = req.body.targetRole || profile?.targetRole || "Software Development Engineer";

    // Run AI ATS analysis on genuine extracted content
    const analysisResult = await analyzeResumeATS({
      resumeText: extractedText,
      targetRole,
    });

    // Merge structural findings
    const finalMissingSections = [
      ...new Set([...structureAnalysis.missingSections, ...(analysisResult.missingSections || [])]),
    ];

    // Save resume record
    const resumeRecord = await Resume.create({
      userId: req.user._id,
      fileName,
      fileSize,
      mimeType,
      extractedText: extractedText.substring(0, 8000),
    });

    // Save analysis record
    const analysisDoc = await ResumeAnalysis.create({
      userId: req.user._id,
      targetRole,
      overallScore: analysisResult.overallScore,
      atsScore: analysisResult.atsScore,
      structureScore: analysisResult.structureScore || (structureAnalysis.isCompleteStructure ? 90 : 65),
      contentScore: analysisResult.contentScore,
      matchedKeywords: analysisResult.matchedKeywords || [],
      missingKeywords: analysisResult.missingKeywords || [],
      missingSkills: analysisResult.missingSkills || [],
      missingSections: finalMissingSections,
      strongPoints: analysisResult.strongPoints || [],
      improvementSuggestions: analysisResult.improvementSuggestions || [],
      bulletPointCritiques: analysisResult.bulletPointCritiques || [],
    });

    // Update student profile resume score
    await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { resumeScore: analysisResult.atsScore }
    );

    await ActivityLog.create({
      userId: req.user._id,
      action: "Analyzed Resume with AI ATS",
      category: "RESUME",
      details: `ATS Score: ${analysisResult.atsScore}/100 for ${targetRole} (${fileName})`,
    });

    return res.status(200).json({
      success: true,
      analysis: analysisDoc,
      structure: structureAnalysis,
      resume: resumeRecord,
    });
  } catch (error) {
    console.error("Resume analyze error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get latest resume analysis
// @route   GET /api/resumes/latest-analysis
const getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ userId: req.user._id }).sort({ analyzedAt: -1 });
    return res.json({ success: true, analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download standard ATS formatted resume PDF
// @route   GET /api/resumes/download-pdf or POST /api/resumes/download-pdf
const fs = require("fs");
const { exec } = require("child_process");

const downloadAtsResumePdf = async (req, res) => {
  try {
    const rootPath = path.resolve(__dirname, "../../..");
    const pdfPath = path.join(rootPath, "Gangatharan_M_Resume_Standard.pdf");
    const scriptPath = path.join(rootPath, "resume_pdf_generator.py");

    let cmd = `python "${scriptPath}"`;
    let tempJsonPath = null;

    if (req.body && Object.keys(req.body).length > 0) {
      tempJsonPath = path.join(rootPath, `temp_resume_${Date.now()}.json`);
      fs.writeFileSync(tempJsonPath, JSON.stringify(req.body, null, 2), "utf8");
      cmd = `python "${scriptPath}" "${tempJsonPath}" "${pdfPath}"`;
    }

    exec(cmd, (err) => {
      if (tempJsonPath && fs.existsSync(tempJsonPath)) {
        try { fs.unlinkSync(tempJsonPath); } catch (e) {}
      }
      if (err) {
        console.error("Python PDF generation error:", err);
      }
      if (fs.existsSync(pdfPath)) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="Gangatharan_M_ATS_Resume.pdf"');
        const fileStream = fs.createReadStream(pdfPath);
        return fileStream.pipe(res);
      } else {
        return res.status(404).json({ success: false, message: "Resume PDF could not be generated." });
      }
    });
  } catch (error) {
    console.error("Download PDF error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  getLatestAnalysis,
  downloadAtsResumePdf,
};

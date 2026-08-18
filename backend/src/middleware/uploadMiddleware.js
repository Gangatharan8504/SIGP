const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedMimes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const allowedExtensions = [".pdf", ".docx", ".doc"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    const isExtValid = allowedExtensions.includes(ext);
    const isMimeValid = allowedMimes.includes(mime) || mime === "application/octet-stream";

    if (isExtValid && isMimeValid) {
      cb(null, true);
    } else {
      cb(new Error("Invalid resume file. Please upload a valid PDF or DOCX resume."));
    }
  },
});

module.exports = upload;

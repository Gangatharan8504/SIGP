const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const { emitStudentActivityEvent } = require("../services/eventService");

// @desc    Get assignments (with filter)
// @route   GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const { department, status } = req.query;
    let query = {};
    if (department) query.department = department;
    if (status) query.status = status;

    const assignments = await Assignment.find(query)
      .populate("facultyId", "name email")
      .sort({ dueDate: 1 });

    // If student, attach their submission status
    let mySubmissions = [];
    if (req.user) {
      mySubmissions = await AssignmentSubmission.find({ studentId: req.user._id });
    }

    const assignmentsWithSub = assignments.map((a) => {
      const aObj = a.toObject();
      const sub = mySubmissions.find((s) => s.assignmentId.toString() === a._id.toString());
      aObj.submission = sub || null;
      aObj.hasSubmitted = !!sub;
      return aObj;
    });

    return res.json({ success: true, count: assignmentsWithSub.length, assignments: assignmentsWithSub });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new assignment (Faculty)
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      facultyId: req.user._id,
    });
    return res.status(201).json({ success: true, assignment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
const submitAssignment = async (req, res) => {
  try {
    const { submissionContent, githubUrl, fileUrl } = req.body;
    const assignmentId = req.params.id;

    let submission = await AssignmentSubmission.findOne({
      assignmentId,
      studentId: req.user._id,
    });

    if (submission) {
      submission.submissionContent = submissionContent || submission.submissionContent;
      submission.githubUrl = githubUrl || submission.githubUrl;
      submission.fileUrl = fileUrl || submission.fileUrl;
      submission.status = "Submitted";
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({
        assignmentId,
        studentId: req.user._id,
        submissionContent,
        githubUrl,
        fileUrl,
        status: "Submitted",
      });
    }

    return res.json({ success: true, submission });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Grade assignment (Faculty)
// @route   POST /api/assignments/submissions/:id/grade
const gradeSubmission = async (req, res) => {
  try {
    const { marksAwarded, facultyFeedback } = req.body;
    const submission = await AssignmentSubmission.findById(req.params.id)
      .populate("assignmentId")
      .populate("studentId");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    submission.marksAwarded = Number(marksAwarded);
    submission.facultyFeedback = facultyFeedback || "";
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();
    submission.status = "Graded";
    await submission.save();

    // Trigger Event Dispatcher to update student's verified skills
    const maxMarks = submission.assignmentId?.maxMarks || 100;
    const scorePct = Math.round((marksAwarded / maxMarks) * 100);

    await emitStudentActivityEvent({
      userId: submission.studentId._id,
      eventType: "ASSIGNMENT",
      skillNames: submission.assignmentId?.skillsMapped || ["Programming", "Problem Solving"],
      score: scorePct,
      sourceTitle: submission.assignmentId?.title || "Assignment",
      sourceRefId: submission.assignmentId?._id?.toString(),
      details: `Graded by faculty: ${marksAwarded}/${maxMarks}`,
    });

    return res.json({ success: true, submission });
  } catch (err) {
    console.error("Grade error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  submitAssignment,
  gradeSubmission,
};

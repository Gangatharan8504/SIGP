import React, { useState, useEffect } from 'react';
import { assignmentApi } from '../../../api/apis';
import {
  FileCode,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Award,
  Sparkles,
} from 'lucide-react';
import { Button, Badge, Spinner, Input, Modal } from '../../common/UIElements';
import confetti from 'canvas-confetti';

export const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState({ githubUrl: '', submissionContent: '', fileUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await assignmentApi.getAll();
      if (res.data.success) {
        setAssignments(res.data.assignments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      githubUrl: assignment.submission?.githubUrl || '',
      submissionContent: assignment.submission?.submissionContent || '',
      fileUrl: assignment.submission?.fileUrl || '',
    });
    setIsSubmitModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      const res = await assignmentApi.submit(selectedAssignment._id, formData);
      if (res.data.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setIsSubmitModalOpen(false);
        fetchAssignments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Faculty Course Assignments</h1>
        <p className="text-xs text-slate-400">Submit verified capstone code and receive rubric-evaluated faculty feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((a) => {
          const sub = a.submission;
          const isGraded = sub?.status === 'Graded';
          const isSubmitted = !!sub;

          return (
            <div
              key={a._id}
              className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {a.facultyId?.name || "Faculty Mentor"}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{a.title}</h3>
                  </div>

                  <Badge
                    variant={isGraded ? "emerald" : isSubmitted ? "indigo" : "amber"}
                    size="sm"
                  >
                    {isGraded ? `Score: ${sub.marksAwarded}/${a.maxMarks}` : isSubmitted ? "Submitted" : "Pending"}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{a.description}</p>

                {/* Rubric and Mapped Skills */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Due Date:
                    </span>
                    <span className="font-mono">{new Date(a.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Submission Type:</span>
                    <span className="font-bold text-white">{a.submissionType}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mapped Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(a.skillsMapped || []).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[10px] border border-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Graded Feedback Box */}
                {isGraded && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Award className="w-3.5 h-3.5" /> Faculty Evaluation & Feedback:
                    </div>
                    <p className="text-slate-300 text-[11px]">{sub.facultyFeedback}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <Button
                  variant={isSubmitted ? "secondary" : "primary"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleOpenSubmit(a)}
                  icon={isSubmitted ? CheckCircle2 : Send}
                >
                  {isSubmitted ? "Update Submission" : "Submit Assignment"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Assignment Solution">
        {selectedAssignment && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">{selectedAssignment.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{selectedAssignment.instructions}</p>
            </div>

            <Input
              label="GitHub Repository URL"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/your-username/repo-name"
              required
            />

            <div>
              <label className="text-xs font-semibold text-slate-300">Solution Description & Architecture Notes</label>
              <textarea
                rows={3}
                value={formData.submissionContent}
                onChange={(e) => setFormData({ ...formData, submissionContent: e.target.value })}
                placeholder="Explain key algorithms, time complexity benchmarks, and test coverage..."
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 mt-1 text-white outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>
                Submit to Faculty
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

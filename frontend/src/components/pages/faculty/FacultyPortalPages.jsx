import React, { useState, useEffect } from 'react';
import { facultyApi, assignmentApi, ragApi, adminApi } from '../../../api/apis';
import {
  Users,
  AlertTriangle,
  FileCheck,
  BookOpen,
  Plus,
  Send,
  Sparkles,
  Shield,
  Upload,
  CheckCircle,
  FileText,
  Clock,
  Award,
} from 'lucide-react';
import { MetricCard } from '../../common/MetricCard';
import { Button, Badge, Spinner, Input, Modal } from '../../common/UIElements';

export const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const res = await facultyApi.getDashboard();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIntervention = async (studentId, interventionType) => {
    try {
      await facultyApi.executeIntervention({
        studentId,
        interventionType,
        notes: "Automated mentoring notice sent via Faculty Advisor Console.",
      });
      alert(`Mentoring intervention successfully scheduled for candidate.`);
    } catch (e) {
      alert("Failed to initiate intervention.");
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const stats = data?.stats || {
    totalStudents: 42,
    activeAssignments: 3,
    pendingGrading: 4,
    averageCohortCGPA: 8.35,
    averageReadinessScore: 78,
  };

  const atRiskStudents = data?.atRiskStudents || [];
  const flaggedEvents = data?.flaggedIntegrityEvents || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo">Faculty Intelligence Console</Badge>
            <span className="text-xs text-slate-400 font-mono">Department of Computer Science & Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Cohort Academic & Placement Mentorship</h1>
          <p className="text-xs text-slate-400">Monitor student learning progress, grade submissions, and trigger early interventions</p>
        </div>

        <div className="flex items-center gap-2">
          <a href="/faculty/assignments">
            <Button variant="primary" size="sm" icon={Plus}>
              Create Assignment
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Mentored Cohort"
          value={stats.totalStudents}
          subtitle="Final Year 2026 Batch"
          icon={Users}
          color="indigo"
        />
        <MetricCard
          title="Cohort Avg CGPA"
          value={stats.averageCohortCGPA}
          subtitle="8.35 / 10.0"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Placement Readiness"
          value={`${stats.averageReadinessScore}%`}
          subtitle="Cohort benchmark"
          icon={Sparkles}
          color="violet"
        />
        <MetricCard
          title="Pending Submissions"
          value={stats.pendingGrading}
          subtitle="Awaiting rubric evaluation"
          icon={FileCheck}
          color="amber"
        />
      </div>

      {/* At-Risk Students ("Attention Required") */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Attention Required: At-Risk Candidates</h3>
          </div>
          <Badge variant="rose" size="sm">{atRiskStudents.length} Flagged</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {atRiskStudents.map((st) => (
            <div key={st.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{st.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{st.rollNumber}</p>
                  </div>
                  <Badge variant="rose" size="sm">Score: {st.readinessScore}%</Badge>
                </div>

                <div className="mt-3 space-y-1">
                  {st.reasons.map((r, i) => (
                    <p key={i} className="text-[11px] text-rose-300/90 flex items-center gap-1.5">
                      • {r}
                    </p>
                  ))}
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                  <strong>AI Suggested Action:</strong> {st.suggestedIntervention}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleIntervention(st.id, "1-on-1 Mentoring")}
                >
                  Initiate Mentoring Action
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    maxMarks: 100,
    submissionType: 'GITHUB',
    skillsMapped: 'Data Structures & Algorithms, Node.js',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await assignmentApi.getAll();
      if (res.data.success) setAssignments(res.data.assignments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await assignmentApi.create({
        ...formData,
        skillsMapped: formData.skillsMapped.split(',').map((s) => s.trim()),
      });
      setIsModalOpen(false);
      fetchAssignments();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Course Assignments & Rubric Grading</h1>
          <p className="text-xs text-slate-400">Author capstone engineering challenges and evaluate student GitHub repositories</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((a) => (
          <div key={a._id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="indigo" size="sm">{a.submissionType}</Badge>
              <span className="text-xs font-bold text-emerald-400">Max Marks: {a.maxMarks}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{a.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{a.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
              <span className="text-indigo-400 font-semibold">{a.status}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course Assignment">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Assignment Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <div>
            <label className="text-xs font-semibold text-slate-300">Problem Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 mt-1 text-white outline-none"
              required
            />
          </div>
          <Input label="Mapped Skills (comma separated)" value={formData.skillsMapped} onChange={(e) => setFormData({ ...formData, skillsMapped: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Publish Assignment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const FacultyRAGKnowledge = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Data Structures & Algorithms',
    textContent: '',
  });

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await ragApi.getDocuments();
      if (res.data.success) setDocuments(res.data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await ragApi.upload(formData);
      setIsModalOpen(false);
      fetchDocs();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Course RAG Knowledge Ingestion</h1>
          <p className="text-xs text-slate-400">Upload approved curriculum notes and slides for grounded AI student retrieval</p>
        </div>
        <Button variant="primary" size="sm" icon={Upload} onClick={() => setIsModalOpen(true)}>
          Upload Course Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((d) => (
          <div key={d._id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="indigo" size="sm">{d.subject}</Badge>
              <span className="text-xs font-mono text-emerald-400">{d.totalChunks} Chunks Indexed</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{d.title}</h3>
            <p className="text-xs text-slate-400 font-mono">{d.fileName} • {d.fileSize}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Course Knowledge Notes">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input label="Document Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <div>
            <label className="text-xs font-semibold text-slate-300">Course Notes / Syllabus Text</label>
            <textarea
              rows={6}
              value={formData.textContent}
              onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
              placeholder="Paste curriculum text or lecture summaries..."
              className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 mt-1 text-white outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Index for RAG</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

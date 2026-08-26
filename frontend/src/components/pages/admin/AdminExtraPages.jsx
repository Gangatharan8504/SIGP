import React, { useState, useEffect } from 'react';
import { adminApi, assessmentApi, courseApi, companyApi } from '../../../api/apis';
import { HelpCircle, Plus, FileCheck, BookOpen, Building2, BarChart3, FileText, Settings, Download } from 'lucide-react';
import { Button, Badge, Spinner, Input, Modal } from '../../common/UIElements';
import { SkillRadarChart, ReadinessTrendChart } from '../../charts/SkillCharts';
import { DatabaseStorageMonitor } from '../../admin/DatabaseStorageMonitor';

export const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    type: 'mcq',
    marks: 10,
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await adminApi.getQuestions();
      if (res.data.success) setQuestions(res.data.questions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createQuestion(formData);
      setIsModalOpen(false);
      fetchQuestions();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Question Bank & Coding Challenges</h1>
          <p className="text-xs text-slate-400">Manage technical MCQs and automated test-case coding questions</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Create Question</Button>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
          <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Difficulty</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {questions.map((q) => (
              <tr key={q._id}>
                <td className="py-3 font-bold text-white">{q.title}</td>
                <td className="py-3 text-slate-400">{q.category}</td>
                <td className="py-3">
                  <Badge variant={q.difficulty === 'Easy' ? 'emerald' : 'amber'} size="sm">{q.difficulty}</Badge>
                </td>
                <td className="py-3 uppercase font-mono text-[10px] text-indigo-400">{q.type}</td>
                <td className="py-3 font-bold">{q.marks || 10}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Question">
        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <Input label="Question Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <div>
            <label className="text-xs font-semibold text-slate-300">Question Description / Problem Statement</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 mt-1 text-white outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
            <Input label="Marks" type="number" value={formData.marks} onChange={(e) => setFormData({ ...formData, marks: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Question</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const AssessmentsManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await assessmentApi.getAll();
      if (res.data.success) setAssessments(res.data.assessments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Assessments Management</h1>
        <p className="text-xs text-slate-400">Configure benchmark tests, durations, and passing cutoffs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((a) => (
          <div key={a._id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="indigo" size="sm">{a.category}</Badge>
              <span className="text-xs font-mono text-slate-400">{a.durationMinutes} Mins</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{a.title}</h3>
            <p className="text-xs text-slate-400">{a.description}</p>
            <div className="flex justify-between text-xs pt-3 border-t border-slate-800">
              <span className="text-slate-400">Questions: <strong className="text-white">{a.questions?.length || 4}</strong></span>
              <span className="text-emerald-400 font-bold">Pass: {a.passingMarks}/{a.totalMarks}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseApi.getCourses();
      if (res.data.success) setCourses(res.data.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Placement Courses Master</h1>
        <p className="text-xs text-slate-400">Curate modules and instructional syllabus for campus cohorts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c._id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">{c.title}</h3>
            <p className="text-xs text-slate-400">{c.instructor}</p>
            <div className="flex justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
              <span>{c.durationHours} Hours</span>
              <span className="text-amber-400 font-bold">★ {c.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await companyApi.getAll();
      if (res.data.success) setCompanies(res.data.companies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Corporate Recruiting Partners</h1>
        <p className="text-xs text-slate-400">Manage hiring companies, package tiers, and required tech stacks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((c) => (
          <div key={c._id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant={c.tier === 'Super Dream' ? 'rose' : 'indigo'} size="sm">{c.tier}</Badge>
              <span className="text-xs font-bold text-emerald-400">₹{c.typicalPackageLPA?.max} LPA max</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{c.name}</h3>
            <p className="text-xs text-slate-400">{c.industry} • {c.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Institutional Placement Analytics</h1>
        <p className="text-xs text-slate-400">Multi-cohort performance trends and skill readiness distribution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Cohort Skill Competency Radar</h3>
          <SkillRadarChart />
        </div>
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">6-Month Average Readiness Growth</h3>
          <ReadinessTrendChart />
        </div>
      </div>
    </div>
  );
};

export const ReportsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Placement Reports & Exports</h1>
          <p className="text-xs text-slate-400">Generate compliance reports for NAAC, NIRF, and recruitment partners</p>
        </div>
        <Button variant="primary" size="sm" icon={Download} onClick={() => alert("Exporting Placement Summary CSV...")}>
          Export CSV Report
        </Button>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Available Export Templates</h3>
        <div className="divide-y divide-slate-800/60">
          {[
            { title: "2026 Batch Final Placement & CTC Audit Report", format: "CSV / XLSX", size: "1.4 MB" },
            { title: "Department-wise Skill Gap & Benchmark Summary", format: "PDF", size: "3.2 MB" },
            { title: "Drive Attendance & Offer Conversion Statistics", format: "CSV", size: "850 KB" }
          ].map((rep, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{rep.title}</p>
                <p className="text-[10px] text-slate-400 font-mono">{rep.format} • {rep.size}</p>
              </div>
              <Button variant="secondary" size="sm" icon={Download} onClick={() => alert(`Downloading ${rep.title}...`)}>
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminSettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Institutional Portal Settings</h1>
        <p className="text-xs text-slate-400">Configure cutoff defaults, Groq AI API keys, and campus rules</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Global Eligibility Defaults</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Default Min CGPA" type="number" step="0.1" defaultValue="7.0" />
          <Input label="Max Allowed Standing Arrears" type="number" defaultValue="0" />
        </div>
      </div>
    </div>
  );
};

export const DatabaseMonitoringPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">MongoDB Database Usage &amp; Storage Monitoring</h1>
        <p className="text-xs text-slate-400">Live storage quotas, collection indexes, and performance telemetry from MongoDB Atlas</p>
      </div>
      <DatabaseStorageMonitor />
    </div>
  );
};

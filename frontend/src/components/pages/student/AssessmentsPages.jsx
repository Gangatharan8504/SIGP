import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { assessmentApi } from '../../../api/apis';
import {
  FileCheck,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Target,
  Zap,
  PlusCircle,
  Bot,
  Brain,
  Check,
} from 'lucide-react';
import { Button, Badge, Spinner, Modal } from '../../common/UIElements';

export const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // AI Test Generator Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('React.js & State Architecture');
  const [aiDifficulty, setAiDifficulty] = useState('Intermediate');
  const [aiDuration, setAiDuration] = useState(15);
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAssess, resSubs] = await Promise.all([
        assessmentApi.getAll(),
        assessmentApi.getMySubmissions(),
      ]);
      if (resAssess.data.success) setAssessments(resAssess.data.assessments || []);
      if (resSubs.data.success) setMySubmissions(resSubs.data.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiTest = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setGeneratingAi(true);
    try {
      const res = await assessmentApi.generateAI({
        topic: aiTopic,
        difficulty: aiDifficulty,
        durationMinutes: aiDuration,
        questionCount: aiQuestionCount,
      });
      if (res.data.success && res.data.assessment) {
        setShowAiModal(false);
        await fetchData();
        navigate(`/secure-exam/${res.data.assessment._id}`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to generate AI assessment');
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const categories = [
    'All',
    'Technical Aptitude & DSA',
    'Web Development',
    'Database Systems',
    'Core CS',
    'Aptitude & Logic',
  ];

  const filteredAssessments = assessments.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.targetRole && item.targetRole.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    return matchesCat && matchesSearch && matchesDiff;
  });

  const totalCompleted = mySubmissions.length;
  const avgScore =
    totalCompleted > 0
      ? Math.round(mySubmissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / totalCompleted)
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="rose">Proctored Benchmark Suite</Badge>
              <span className="text-xs text-rose-300 light:text-rose-800 font-mono">Strict Max 3 Attempts</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white light:text-rose-950 tracking-tight">
              Mock Assessments & Quizzes
            </h1>
            <p className="text-xs sm:text-sm text-rose-200/80 light:text-rose-800 max-w-2xl leading-relaxed">
              Validate your algorithmic problem-solving and domain competencies under timed, secure webcam conditions to boost your verified skill score.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Bot}
            onClick={() => setShowAiModal(true)}
            className="shadow-lg shadow-rose-600/30 font-bold shrink-0"
          >
            ✨ Generate Custom AI Test
          </Button>
        </div>

        {/* 3 Quick Metric Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rose-500/20">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 light:bg-white border border-rose-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-rose-300/70 light:text-slate-600 font-semibold">Available Tests</p>
              <p className="text-lg font-black text-white light:text-slate-900">{assessments.length}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 light:bg-white border border-rose-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-rose-300/70 light:text-slate-600 font-semibold">Completed Tests</p>
              <p className="text-lg font-black text-white light:text-slate-900">{totalCompleted}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 light:bg-white border border-rose-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-rose-300/70 light:text-slate-600 font-semibold">Avg Verified Score</p>
              <p className="text-lg font-black text-white light:text-slate-900">{avgScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 light:bg-white text-rose-200/70 light:text-rose-900 hover:text-white border border-rose-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input & Difficulty Dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-rose-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search benchmark tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 light:bg-white border border-rose-500/25 text-xs text-white light:text-slate-900 pl-9 pr-3 py-2 rounded-xl outline-none focus:border-rose-500 transition"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 light:bg-white border border-rose-500/25 text-xs text-rose-200 light:text-rose-900 px-3 py-2 rounded-xl outline-none focus:border-rose-500 transition"
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Full Pattern Mock Assessment Hero Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-wider">
                Official Mock Assessment
              </span>
              <Badge variant="emerald">5 Core Sections &bull; 42 Questions &bull; 96 Marks</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Full Pattern Mock Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Section-timed proctored benchmark: <strong>Aptitude (10m)</strong>, <strong>Reasoning (10m)</strong>, <strong>Verbal (10m)</strong>, <strong>Pseudo Code (10m)</strong>, and <strong>Coding (20m)</strong> with live camera &amp; screen share proctoring.
            </p>
          </div>

          <Link to="/secure-exam/pattern-test" className="shrink-0 w-full md:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={Sparkles}
              className="w-full md:w-auto font-black shadow-xl bg-indigo-600 hover:bg-indigo-500 text-white border-0"
            >
              Launch Mock Exam (60 Mins)
            </Button>
          </Link>
        </div>
      </div>

      {/* Available Assessments Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white light:text-rose-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" /> Available Benchmark Tests
            <span className="text-xs text-rose-300 light:text-rose-700 font-normal">({filteredAssessments.length} found)</span>
          </h2>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-rose-500/20 space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white light:text-rose-950">No Benchmark Tests Found</h3>
            <p className="text-xs text-rose-300/70 light:text-slate-600">Try adjusting your category filter, or generate a custom AI test.</p>
            <Button variant="primary" size="sm" icon={Bot} onClick={() => setShowAiModal(true)}>
              Generate AI Test Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((item) => (
              <div
                key={item._id}
                className="glass-card-hover rounded-3xl p-6 border border-rose-500/20 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="rose" size="sm">{item.category}</Badge>
                    <Badge
                      variant={
                        item.difficulty === 'Easy'
                          ? 'emerald'
                          : item.difficulty === 'Intermediate'
                          ? 'pink'
                          : 'crimson'
                      }
                      size="sm"
                    >
                      {item.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white light:text-rose-950 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-rose-200/70 light:text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Skills tags */}
                  {item.skillTags && item.skillTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.skillTags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 light:text-rose-800 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Chips */}
                  <div className="flex items-center justify-between text-xs text-rose-300 light:text-rose-800 pt-3 border-t border-rose-500/15">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-400" /> {item.durationMinutes || 60} Mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> {item.totalMarks || 96} Marks
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> Max 3
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to={`/secure-exam/${item._id}`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full font-bold shadow-md shadow-rose-600/25"
                      icon={ArrowRight}
                    >
                      Start Proctored Test
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Test Generator Modal */}
      <Modal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        title="✨ Generate AI Benchmark Test"
      >
        <form onSubmit={handleGenerateAiTest} className="space-y-4">
          <p className="text-xs text-rose-200/80 light:text-slate-600">
            Groq Llama 3.3 will dynamically author industry-grade placement questions with automated scoring and webcam proctoring.
          </p>

          <div>
            <label className="block text-xs font-bold text-rose-200 light:text-rose-950 uppercase tracking-wider mb-1">
              Target Topic or Skill
            </label>
            <input
              type="text"
              required
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. React.js & Redux Toolkit, Graph DP, Spring Boot"
              className="w-full bg-slate-900 light:bg-white border border-rose-500/30 text-xs text-white light:text-slate-900 p-3 rounded-xl outline-none focus:border-rose-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-200 light:text-rose-950 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value)}
                className="w-full bg-slate-900 light:bg-white border border-rose-500/30 text-xs text-white light:text-slate-900 p-2.5 rounded-xl outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-200 light:text-rose-950 uppercase tracking-wider mb-1">
                Duration (Mins)
              </label>
              <select
                value={aiDuration}
                onChange={(e) => setAiDuration(Number(e.target.value))}
                className="w-full bg-slate-900 light:bg-white border border-rose-500/30 text-xs text-white light:text-slate-900 p-2.5 rounded-xl outline-none"
              >
                <option value={10}>10 Mins</option>
                <option value={15}>15 Mins</option>
                <option value={20}>20 Mins</option>
                <option value={30}>30 Mins</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-200 light:text-rose-950 uppercase tracking-wider mb-1">
                Questions
              </label>
              <select
                value={aiQuestionCount}
                onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-900 light:bg-white border border-rose-500/30 text-xs text-white light:text-slate-900 p-2.5 rounded-xl outline-none"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-rose-500/20 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowAiModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={generatingAi}
              icon={Sparkles}
              className="font-bold shadow-md shadow-rose-600/30"
            >
              Generate & Launch Test
            </Button>
          </div>
        </form>
      </Modal>

      {/* Past Submissions History Table */}
      {mySubmissions.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-white light:text-rose-950 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" /> Past Submission History & Verification
          </h2>
          <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 overflow-x-auto shadow-lg">
            <table className="w-full text-left text-xs text-rose-200 light:text-slate-700 min-w-[550px]">
              <thead className="border-b border-rose-500/20 text-rose-400 light:text-rose-900 uppercase font-bold text-[11px]">
                <tr>
                  <th className="pb-3">Assessment Title</th>
                  <th className="pb-3">Score Earned</th>
                  <th className="pb-3">Percentage</th>
                  <th className="pb-3">Result</th>
                  <th className="pb-3">Completed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10">
                {mySubmissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-rose-500/5 transition">
                    <td className="py-3 font-semibold text-white light:text-slate-900">
                      {sub.assessmentId?.title || "Software Engineering Benchmark"}
                    </td>
                    <td className="py-3 font-mono font-bold text-rose-300 light:text-rose-800">
                      {sub.score} / {sub.maxScore}
                    </td>
                    <td className="py-3 font-bold text-emerald-400 light:text-emerald-700">
                      {sub.percentage}%
                    </td>
                    <td className="py-3">
                      <Badge variant={sub.passed ? "emerald" : "rose"} size="sm">
                        {sub.passed ? "PASSED" : "FAILED"}
                      </Badge>
                    </td>
                    <td className="py-3 text-rose-300/70 light:text-slate-600 font-mono text-[11px]">
                      {new Date(sub.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const AssessmentTakePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in sec
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (!result && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !result) {
      handleSubmitTest();
    }
  }, [timeLeft, result]);

  const fetchAssessment = async () => {
    try {
      const res = await assessmentApi.getById(id);
      if (res.data.success) {
        setAssessment(res.data.assessment);
        setTimeLeft((res.data.assessment.durationMinutes || 30) * 60);
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to load assessment');
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const res = await assessmentApi.submit(id, { answers: formattedAnswers });
      if (res.data.success) {
        setResult(res.data.feedback);
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!assessment) return null;

  const questions = assessment.questions || [];
  const currentQ = questions[currentIndex];

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Result View
  if (result) {
    const breakdown = result.questionBreakdown || [];

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
        <div className="glass-panel rounded-3xl p-8 border border-rose-500/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-rose-600/30">
            {result.passed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <div>
            <Badge variant={result.passed ? "emerald" : "rose"} size="lg">
              {result.passed ? "ASSESSMENT PASSED" : "BENCHMARK NOT CLEARED"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white light:text-rose-950 mt-3">
              {assessment.title}
            </h2>
            <p className="text-xs text-rose-300 light:text-rose-800 mt-1">Verified Skill Evidence has been logged to your candidate profile</p>
          </div>

          {/* Score Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 light:bg-rose-50 border border-rose-500/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400">Score Earned</span>
              <p className="text-xl font-black text-white light:text-slate-900">{result.earnedMarks} / {result.totalPossibleMarks}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400">Accuracy Rate</span>
              <p className="text-xl font-black text-emerald-400 light:text-emerald-700">{result.percentage}%</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400">Passing Cutoff</span>
              <p className="text-lg font-black text-white light:text-slate-900">{assessment.passingMarks || 20} Marks</p>
            </div>
          </div>

          {/* Question Breakdown Analysis */}
          {breakdown.length > 0 && (
            <div className="space-y-3 text-left pt-4 border-t border-rose-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 light:text-rose-900">
                Detailed Question-by-Question Analysis
              </h4>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {breakdown.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border ${
                      q.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-white light:text-slate-900">Q{idx + 1}. {q.questionTitle}</span>
                      <Badge variant={q.isCorrect ? "emerald" : "rose"} size="sm">
                        {q.isCorrect ? `+${q.marksEarned} Marks` : `0 / ${q.maxMarks}`}
                      </Badge>
                    </div>
                    <div className="text-[11px] space-y-1">
                      <p className="text-rose-200/80 light:text-slate-700">
                        <strong>Your Answer:</strong> {q.selectedOptionText}
                      </p>
                      {!q.isCorrect && (
                        <p className="text-emerald-400 font-semibold">
                          <strong>Correct Answer:</strong> {q.correctOptionText}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <Link to="/assessments">
              <Button variant="outline" size="md">Back to Assessments</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="md">View Growth Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Test Header */}
      <div className="glass-panel rounded-3xl p-5 border border-rose-500/25 flex items-center justify-between shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white light:text-rose-950">{assessment.title}</h2>
          <p className="text-xs text-rose-300 light:text-rose-800">Question {currentIndex + 1} of {questions.length}</p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 light:bg-white border border-rose-500/30 text-rose-400 light:text-rose-800 font-mono font-bold text-sm shadow-inner">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/25 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="pink" size="sm">{currentQ.category || "Technical"}</Badge>
              <span className="text-xs font-mono text-rose-300 light:text-rose-800 font-bold">{currentQ.marks || 10} Marks</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white light:text-rose-950 leading-snug">
              {currentQ.title}
            </h3>
            {currentQ.description && (
              <p className="text-xs text-rose-200/80 light:text-slate-700 leading-relaxed pt-1">
                {currentQ.description}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {(currentQ.options || []).map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentQ._id] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ._id, oIdx)}
                  className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition flex items-center justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/20 text-white light:text-rose-950 border-rose-500 shadow-md shadow-rose-600/20 font-bold'
                      : 'bg-slate-900/80 light:bg-white text-rose-100 light:text-slate-800 border-rose-500/20 hover:bg-rose-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-gradient-to-tr from-rose-600 to-pink-600 text-white' : 'bg-slate-800 light:bg-rose-100 text-rose-300 light:text-rose-800'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-rose-500/20">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              Previous Question
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={submitting}
                onClick={handleSubmitTest}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 border-emerald-500/30"
              >
                Submit Completed Test
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

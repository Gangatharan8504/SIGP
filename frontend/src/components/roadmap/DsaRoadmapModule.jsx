import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DSA_PHASES,
  PATTERN_RECOGNITION_GUIDE,
  INITIAL_DSA_PROBLEMS,
  INITIAL_MISTAKE_JOURNAL,
  WEEKLY_LEADERBOARD_SAMPLE,
} from '../../utils/dsaMasterRoadmapData';
import { PLACEMENT_ROADMAP_STAGES } from '../../utils/aptitudeMasterRoadmapData';
import {
  Code2,
  Terminal,
  Brain,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  Award,
  AlertTriangle,
  Clock,
  RotateCcw,
  Check,
  Target,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Filter,
  Search,
  Building2,
  ExternalLink,
  Flame,
  Plus,
  Trash2,
  BookmarkPlus,
  Trophy,
  X,
} from 'lucide-react';
import { Button, Badge } from '../common/UIElements';
import confetti from 'canvas-confetti';

const COMPANY_LIST = [
  'All Companies',
  'TCS',
  'Infosys',
  'Cognizant',
  'Accenture',
  'Capgemini',
  'Wipro',
  'Amazon',
  'Microsoft',
  'Google',
];

export const DsaRoadmapModule = () => {
  const [problems, setProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_dsa_problems_data');
      return saved ? JSON.parse(saved) : INITIAL_DSA_PROBLEMS;
    } catch (e) {
      return INITIAL_DSA_PROBLEMS;
    }
  });

  const [mistakeJournal, setMistakeJournal] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_dsa_mistake_journal');
      return saved ? JSON.parse(saved) : INITIAL_MISTAKE_JOURNAL;
    } catch (e) {
      return INITIAL_MISTAKE_JOURNAL;
    }
  });

  const [todayTasks, setTodayTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_dsa_today_tasks');
      return saved ? JSON.parse(saved) : { t1: true, t2: true, t3: false, t4: false, t5: false };
    } catch (e) {
      return { t1: true, t2: true, t3: false, t4: false, t5: false };
    }
  });

  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'patterns' | 'journal' | 'leaderboard'
  const [activeProblemModal, setActiveProblemModal] = useState(null);
  const [notification, setNotification] = useState(null);

  // New mistake log modal state
  const [showAddMistakeModal, setShowAddMistakeModal] = useState(false);
  const [newMistake, setNewMistake] = useState({
    problemTitle: '',
    mistake: '',
    correctPattern: 'Sliding Window',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    keyLearning: '',
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('sgip_dsa_problems_data', JSON.stringify(problems));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [problems]);

  useEffect(() => {
    try {
      localStorage.setItem('sgip_dsa_mistake_journal', JSON.stringify(mistakeJournal));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [mistakeJournal]);

  useEffect(() => {
    try {
      localStorage.setItem('sgip_dsa_today_tasks', JSON.stringify(todayTasks));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [todayTasks]);

  // Overall calculations
  const totalProblemsCount = problems.length;
  const solvedProblems = problems.filter((p) => p.status === 'Solved');
  const easySolved = solvedProblems.filter((p) => p.difficulty === 'Easy').length;
  const mediumSolved = solvedProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardSolved = solvedProblems.filter((p) => p.difficulty === 'Hard').length;
  const overallDsaProgress = Math.round((solvedProblems.length / totalProblemsCount) * 100);

  // Mark solved handler
  const handleToggleSolved = (problemId) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.problemId === problemId) {
          const isNowSolved = p.status !== 'Solved';
          if (isNowSolved) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          }
          return {
            ...p,
            status: isNowSolved ? 'Solved' : 'In Progress',
            attempts: (p.attempts || 0) + 1,
            bestRuntime: isNowSolved ? p.bestRuntime || '2 ms' : p.bestRuntime,
          };
        }
        return p;
      })
    );

    if (activeProblemModal && activeProblemModal.problemId === problemId) {
      setActiveProblemModal((prev) => ({
        ...prev,
        status: prev.status !== 'Solved' ? 'Solved' : 'In Progress',
      }));
    }

    setNotification({ type: 'success', message: '✓ Problem status updated successfully!' });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add mistake journal entry
  const handleAddMistakeSubmit = (e) => {
    e.preventDefault();
    if (!newMistake.problemTitle || !newMistake.keyLearning) return;

    const entry = {
      id: `mj_${Date.now()}`,
      ...newMistake,
      dateLogged: new Date().toISOString().split('T')[0],
    };

    setMistakeJournal([entry, ...mistakeJournal]);
    setShowAddMistakeModal(false);
    setNewMistake({
      problemTitle: '',
      mistake: '',
      correctPattern: 'Sliding Window',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      keyLearning: '',
    });
    setNotification({ type: 'success', message: '📝 Logged to DSA Mistake Journal!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteMistake = (id) => {
    setMistakeJournal((prev) => prev.filter((m) => m.id !== id));
  };

  // Filtered problems list
  const filteredProblems = problems.filter((p) => {
    if (selectedPhase !== 'ALL' && p.phase !== parseInt(selectedPhase, 10)) return false;
    if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
    if (selectedCompany !== 'All Companies' && !p.companyTags.includes(selectedCompany)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        String(p.leetcodeNumber).includes(q) ||
        p.patterns.some((pat) => pat.toLowerCase().includes(q)) ||
        p.topics.some((top) => top.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-purple-950/90 border-purple-500/50 text-purple-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* 10-Stage Placement Master Roadmap Stepper Header */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-950/90 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              Stage 1: Completed ✓
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold animate-pulse">
              Stage 2: Active Roadmap
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:inline-block">
              Placement Roadmap Pipeline
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            14 DSA Phases &bull; Pattern-First Methodology
          </span>
        </div>

        {/* Horizontal 10-Stage Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {PLACEMENT_ROADMAP_STAGES.map((stg) => {
            const isStage1 = stg.id === 1;
            const isStage2 = stg.id === 2;
            return (
              <div
                key={stg.id}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 border transition ${
                  isStage2
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-950/50'
                    : isStage1
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isStage2 ? 'bg-white text-indigo-700 font-bold' : isStage1 ? 'bg-emerald-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isStage1 ? '✓' : stg.id}
                </span>
                <span>{stg.id === 2 ? 'LeetCode & DSA' : stg.name}</span>
                {isStage2 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main LeetCode DSA Dashboard KPI Overview Bar */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-indigo-500/20 shadow-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold font-mono">
                ⚡ LeetCode &amp; DSA Roadmap
              </span>
              <span className="text-xs text-indigo-300 font-mono font-bold">
                Pattern Recognition &bull; Easy &rarr; Medium &rarr; Hard &bull; Interview Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Data Structures &amp; Algorithms Master Track
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">
              Curated LeetCode patterns designed for Google, Amazon, Microsoft, TCS NQT, Infosys, and Product Company Coding Rounds.
            </p>
          </div>

          {/* Quick Compiler Jump Button */}
          <div className="flex items-center gap-2">
            <Link to="/practice">
              <Button
                variant="primary"
                size="sm"
                icon={Terminal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50"
              >
                Open SGIP Compiler
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Overall Progress */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">DSA Progress</span>
            <div className="text-lg font-black text-indigo-400">{overallDsaProgress}%</div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${overallDsaProgress}%` }} />
            </div>
          </div>

          {/* 2. Total Solved */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total Solved</span>
            <div className="text-lg font-black text-white">{solvedProblems.length} / {totalProblemsCount}</div>
            <span className="text-[9px] text-slate-500 font-mono">Curated High-Yield</span>
          </div>

          {/* 3. Easy Solved */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">🟢 Easy</span>
            <div className="text-lg font-black text-emerald-400">{easySolved} Solved</div>
            <span className="text-[9px] text-emerald-500 font-mono">Target: 40+</span>
          </div>

          {/* 4. Medium Solved */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">🟡 Medium</span>
            <div className="text-lg font-black text-amber-400">{mediumSolved} Solved</div>
            <span className="text-[9px] text-amber-500 font-mono">Target: 30+</span>
          </div>

          {/* 5. Hard Solved */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">🔴 Hard</span>
            <div className="text-lg font-black text-rose-400">{hardSolved} Solved</div>
            <span className="text-[9px] text-rose-500 font-mono">Advanced Tech</span>
          </div>

          {/* 6. Accuracy */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Accuracy</span>
            <div className="text-lg font-black text-cyan-400">81%</div>
            <span className="text-[9px] text-slate-500 font-mono">First-Pass Rate</span>
          </div>

          {/* 7. Current Streak */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Streak</span>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1">
              12 Days <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Consistency High</span>
          </div>

          {/* 8. Interview Readiness */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-300 block font-mono">Readiness</span>
            <div className="text-lg font-black text-white">76%</div>
            <span className="text-[9px] text-indigo-300 font-mono">Tier-1 Product</span>
          </div>
        </div>
      </div>

      {/* Today's DSA Plan & Weak Area Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Today's DSA Plan */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's DSA Plan &bull; Day 15 Goal</h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-300">
              {Object.values(todayTasks).filter(Boolean).length} / 5 Done
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 't1', title: 'Learn Sliding Window Core Pattern & Substring Templates', time: '20 min' },
              { id: 't2', title: 'Solve Easy: Best Time to Buy and Sell Stock (#121)', time: '15 min' },
              { id: 't3', title: 'Solve Easy: Valid Palindrome (#125)', time: '15 min' },
              { id: 't4', title: 'Solve Medium: Longest Substring Without Repeating Chars (#3)', time: '25 min' },
              { id: 't5', title: 'Review Mistakes in DSA Mistake Journal', time: '10 min' },
            ].map((task) => {
              const isChecked = !!todayTasks[task.id];
              return (
                <label
                  key={task.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setTodayTasks((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="truncate">
                      <p className={`font-bold ${isChecked ? 'line-through opacity-75' : ''}`}>{task.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{task.time}</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Weak Area Diagnostics & Weekly Challenge */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weak Area Diagnostics &amp; Challenge</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Adaptive Insights</span>
          </div>

          {/* Weak vs Strong Area Pills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block">⚠️ Needs Practice</span>
              <p className="font-bold text-white">Sliding Window (52% Acc)</p>
              <p className="font-bold text-white">Binary Search (48% Acc)</p>
              <p className="text-[10px] text-slate-300 font-mono mt-1">
                Recommendation: Solve 5 Easy Binary Search problems before Mediums.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block">✓ Mastered Patterns</span>
              <p className="font-bold text-white">Arrays (92% Acc)</p>
              <p className="font-bold text-white">HashMap (88% Acc)</p>
              <p className="font-bold text-white">Strings (85% Acc)</p>
            </div>
          </div>

          {/* Weekly Challenge Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">Week 3 LeetCode Challenge (10 Problems)</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                ✓ 7 Completed &bull; ○ 3 Remaining &bull; Accuracy: 78%
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-bold text-[10px] font-mono">
              70% Done
            </span>
          </div>
        </div>
      </div>

      {/* Main Roadmap Sub-Navigation Bar */}
      <div className="glass-panel rounded-2xl p-2 border border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-900/90 shadow-xl">
        {[
          { id: 'problems', label: '💻 LeetCode Problem Bank', icon: Code2 },
          { id: 'patterns', label: '🧠 Pattern Recognition Guide (8)', icon: Brain },
          { id: 'journal', label: '📝 DSA Mistake Journal', icon: BookmarkPlus },
          { id: 'leaderboard', label: '🏆 Weekly Student Leaderboard', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LEETCODE PROBLEMS MATRIX */}
      {activeTab === 'problems' && (
        <div className="space-y-4">
          {/* Filters Bar: Phase, Difficulty, Company, Search */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search problem name, pattern, or #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-1.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Phase Dropdown */}
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">All 14 Phases</option>
                {DSA_PHASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    Phase {p.id}: {p.title.split('–')[1] || p.title}
                  </option>
                ))}
              </select>

              {/* Difficulty Dropdown */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>

              {/* Company Tag Filter */}
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer"
              >
                {COMPANY_LIST.map((comp) => (
                  <option key={comp} value={comp}>
                    🏢 {comp}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {filteredProblems.length} Problems
            </span>
          </div>

          {/* Problems Cards Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((prob) => {
              const isSolved = prob.status === 'Solved';

              return (
                <div
                  key={prob.problemId}
                  className={`glass-panel rounded-3xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl ${
                    isSolved
                      ? 'bg-slate-950/90 border-emerald-500/30'
                      : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-950/30'
                  }`}
                >
                  <div>
                    {/* Top Row: #Number + Difficulty Badge + Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{prob.leetcodeNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                            prob.difficulty === 'Easy'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : prob.difficulty === 'Medium'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>

                      {isSolved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Solved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono">
                          {prob.status}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white hover:text-indigo-300 transition">
                      {prob.title}
                    </h3>

                    {/* Patterns Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {prob.patterns.map((pat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono"
                        >
                          🧠 {pat}
                        </span>
                      ))}
                    </div>

                    {/* Company Tags */}
                    <div className="flex items-center gap-1 flex-wrap mt-2">
                      {prob.companyTags.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[9px] font-mono"
                        >
                          🏢 {comp}
                        </span>
                      ))}
                    </div>

                    {/* Stats: Acceptance & Estimated Time */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                      <span>Acceptance: {prob.acceptanceRate}</span>
                      <span>Best Time: {prob.bestRuntime || '—'}</span>
                      <span>Est: {prob.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setActiveProblemModal(prob)}
                      className="flex-1 text-xs font-bold bg-slate-900 border-slate-700 hover:border-indigo-400"
                    >
                      Open Problem Flow
                    </Button>

                    <Button
                      variant={isSolved ? 'secondary' : 'primary'}
                      size="xs"
                      icon={isSolved ? CheckCircle2 : Check}
                      onClick={() => handleToggleSolved(prob.problemId)}
                      className={`text-xs font-bold ${
                        isSolved
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isSolved ? 'Done ✓' : 'Mark Solved'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PATTERN RECOGNITION GUIDE */}
      {activeTab === 'patterns' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20 bg-slate-900/90 shadow-2xl space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span>Pattern Recognition Guide: "How to Identify the Right DSA Pattern"</span>
            </h3>
            <p className="text-xs text-slate-300">
              Master the core mental models top engineers use to recognize problem archetypes instantly in FAANG and IT interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PATTERN_RECOGNITION_GUIDE.map((pat) => (
              <div
                key={pat.id}
                className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-950/90 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-indigo-300">{pat.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>Time: <strong className="text-emerald-400">{pat.timeComplexity}</strong></span>
                    <span>Space: <strong className="text-cyan-400">{pat.spaceComplexity}</strong></span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                    When to Use:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{pat.whenToUse}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                    Identification Clues:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pat.clues.map((clue, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                      >
                        &bull; {clue}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                    Classic Problems:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pat.classicProblems.map((prob, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold"
                      >
                        {prob}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DSA MISTAKE JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-indigo-400" />
                <span>DSA Mistake Journal &amp; Key Learnings</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Record your misconceptions, brute-force pitfalls, and insights so you never repeat the same mistake.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setShowAddMistakeModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Log New Mistake
            </Button>
          </div>

          {/* Mistakes Cards List */}
          <div className="space-y-3">
            {mistakeJournal.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{entry.problemTitle}</h4>
                    <span className="text-[10px] font-mono text-indigo-300">
                      Correct Pattern: <strong>{entry.correctPattern}</strong> &bull; Logged: {entry.dateLogged}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMistake(entry.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition"
                    title="Delete log entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block mb-1">
                      ⚠️ My Initial Mistake:
                    </span>
                    <p>{entry.mistake}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block mb-1">
                      💡 Key Learning &amp; Optimal Approach:
                    </span>
                    <p>{entry.keyLearning}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      Time: {entry.timeComplexity} &bull; Space: {entry.spaceComplexity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WEEKLY LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/90 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Weekly DSA Problem Solving Leaderboard</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Privacy-friendly placement cohort rankings based on verified LeetCode problems solved this week.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                Week 3 Live
              </span>
            </div>

            <div className="space-y-2 mt-4">
              {WEEKLY_LEADERBOARD_SAMPLE.map((student) => (
                <div
                  key={student.rank}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs ${
                    student.isCurrentUser
                      ? 'bg-indigo-950/70 border-indigo-500/50 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl font-mono font-bold flex items-center justify-center text-xs ${
                      student.rank === 1
                        ? 'bg-amber-400 text-black'
                        : student.rank === 2
                        ? 'bg-slate-300 text-black'
                        : student.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {student.rank}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 font-mono font-bold flex items-center justify-center text-white text-xs">
                      {student.avatar}
                    </div>

                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {student.isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white text-[9px] font-mono">
                            YOU
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">Tier: {student.tier}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <span className="text-amber-400 font-bold">{student.streak}</span>
                    <span className="font-bold text-white">{student.problems} Solved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Problem Solving Interactive Drawer / Modal (8-Step Flow) */}
      {activeProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    #{activeProblemModal.leetcodeNumber} &bull; {activeProblemModal.phaseTitle}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                      activeProblemModal.difficulty === 'Easy'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : activeProblemModal.difficulty === 'Medium'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {activeProblemModal.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">{activeProblemModal.title}</h2>
              </div>

              <button
                onClick={() => setActiveProblemModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 8-Step Problem Solving Workflow Stepper */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">
                8-Step Problem Solving Framework
              </span>
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono text-slate-400 scrollbar-none py-1">
                <span>1. Understand</span> &rarr;
                <span className="text-indigo-300 font-bold">2. Identify Pattern</span> &rarr;
                <span>3. Brute Force</span> &rarr;
                <span className="text-emerald-300 font-bold">4. Optimize</span> &rarr;
                <span>5. Write Code</span> &rarr;
                <span>6. Test</span> &rarr;
                <span>7. Submit</span> &rarr;
                <span>8. Review</span>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Problem Statement</h4>
              <p className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                {activeProblemModal.description}
              </p>
            </div>

            {/* Identified Pattern & Approach */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-indigo-300 uppercase tracking-wider">
                Optimal Pattern &amp; Algorithm Approach
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">Recognized Pattern:</span>
                  {activeProblemModal.patterns.map((pat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold font-mono text-[10px]"
                    >
                      {pat}
                    </span>
                  ))}
                </div>

                <p className="font-mono text-[11px] leading-relaxed text-slate-300">
                  {activeProblemModal.approach}
                </p>

                <div className="flex items-center gap-4 pt-1 text-[10px] font-mono text-slate-400 border-t border-slate-800/80">
                  <span>Time Complexity: <strong className="text-emerald-400">{activeProblemModal.timeComplexity}</strong></span>
                  <span>Space Complexity: <strong className="text-cyan-400">{activeProblemModal.spaceComplexity}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <Link to="/practice">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Terminal}
                  className="bg-indigo-950 border-indigo-500/40 text-indigo-300 font-bold text-xs"
                >
                  Solve in SGIP Compiler &rarr;
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  variant={activeProblemModal.status === 'Solved' ? 'secondary' : 'primary'}
                  size="sm"
                  icon={activeProblemModal.status === 'Solved' ? CheckCircle2 : Check}
                  onClick={() => handleToggleSolved(activeProblemModal.problemId)}
                  className={`text-xs font-bold ${
                    activeProblemModal.status === 'Solved'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {activeProblemModal.status === 'Solved' ? 'Solved ✓' : 'Mark as Solved'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveProblemModal(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Mistake Journal Log Modal */}
      {showAddMistakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-indigo-400" />
                <span>Log to DSA Mistake Journal</span>
              </h3>
              <button
                onClick={() => setShowAddMistakeModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMistakeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Problem Title &amp; Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Longest Substring Without Repeating Characters (#3)"
                  value={newMistake.problemTitle}
                  onChange={(e) => setNewMistake({ ...newMistake, problemTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">My Initial Mistake / Wrong Approach</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Used nested loops O(n²) instead of single-pass sliding window..."
                  value={newMistake.mistake}
                  onChange={(e) => setNewMistake({ ...newMistake, mistake: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Correct Pattern</label>
                  <input
                    type="text"
                    value={newMistake.correctPattern}
                    onChange={(e) => setNewMistake({ ...newMistake, correctPattern: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Time Complexity</label>
                  <input
                    type="text"
                    value={newMistake.timeComplexity}
                    onChange={(e) => setNewMistake({ ...newMistake, timeComplexity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Space Complexity</label>
                  <input
                    type="text"
                    value={newMistake.spaceComplexity}
                    onChange={(e) => setNewMistake({ ...newMistake, spaceComplexity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Key Learning Insight *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Always check if a moving window with frequency map can satisfy continuous range constraints in O(n)..."
                  value={newMistake.keyLearning}
                  onChange={(e) => setNewMistake({ ...newMistake, keyLearning: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAddMistakeModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                  Save Journal Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  PLACEMENT_ROADMAP_STAGES,
  APTITUDE_PHASES,
  INITIAL_APTITUDE_TOPICS,
} from '../../utils/aptitudeMasterRoadmapData';
import {
  SAMPLE_TOPIC_PRACTICE,
  SAMPLE_TOPIC_QUIZ,
} from '../../utils/aptitudeQuestionBank';
import {
  Calculator,
  TrendingUp,
  Layers,
  BarChart3,
  Brain,
  BookOpen,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  ExternalLink,
  Sparkles,
  Zap,
  Award,
  AlertTriangle,
  ChevronRight,
  Clock,
  HelpCircle,
  RotateCcw,
  Check,
  Target,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Button, Badge } from '../common/UIElements';
import confetti from 'canvas-confetti';

const PHASE_ICONS = {
  1: Calculator,
  2: TrendingUp,
  3: Layers,
  4: BarChart3,
  5: Brain,
  6: BookOpen,
};

export const AptitudeRoadmapModule = () => {
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_aptitude_master_topics');
      return saved ? JSON.parse(saved) : INITIAL_APTITUDE_TOPICS;
    } catch (e) {
      return INITIAL_APTITUDE_TOPICS;
    }
  });

  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [activeTopicModal, setActiveTopicModal] = useState(null);
  const [modalTab, setModalTab] = useState('learn'); // 'learn' | 'practice' | 'quiz'
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScoreResult, setQuizScoreResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [todayTasksCompleted, setTodayTasksCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_today_aptitude_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save topics state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sgip_aptitude_master_topics', JSON.stringify(topics));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [topics]);

  // Save today's task checklist
  useEffect(() => {
    try {
      localStorage.setItem('sgip_today_aptitude_tasks', JSON.stringify(todayTasksCompleted));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [todayTasksCompleted]);

  // Overall calculations
  const totalTopicsCount = topics.length; // 36
  const completedTopicsCount = topics.filter((t) => t.completed).length;
  const overallProgressPercentage = Math.round((completedTopicsCount / totalTopicsCount) * 100);

  const totalQuestionsSolved = topics.reduce((acc, t) => acc + (t.questionsSolved || 0), 0);
  const attemptedQuizzes = topics.filter((t) => t.quizScore > 0);
  const averageQuizScore = attemptedQuizzes.length > 0
    ? Math.round(attemptedQuizzes.reduce((acc, t) => acc + t.quizScore, 0) / attemptedQuizzes.length)
    : 0;

  // Level determination
  const getCurrentLevel = () => {
    if (overallProgressPercentage >= 85) return { name: 'Placement Ready', color: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' };
    if (overallProgressPercentage >= 50) return { name: 'Advanced', color: 'text-purple-400', badge: 'bg-purple-950 text-purple-300 border-purple-500/40' };
    if (overallProgressPercentage >= 20) return { name: 'Intermediate', color: 'text-blue-400', badge: 'bg-blue-950 text-blue-300 border-blue-500/40' };
    return { name: 'Beginner', color: 'text-amber-400', badge: 'bg-amber-950 text-amber-300 border-amber-500/40' };
  };

  const currentLevel = getCurrentLevel();

  // Category readiness calculations
  const getCategoryReadiness = (catName) => {
    const catTopics = topics.filter((t) => t.category === catName);
    if (catTopics.length === 0) return 0;
    const avgScore = catTopics.reduce((acc, t) => acc + (t.quizScore || (t.completed ? 80 : 0)), 0) / catTopics.length;
    const completionRate = (catTopics.filter((t) => t.completed).length / catTopics.length) * 100;
    return Math.round((avgScore * 0.6) + (completionRate * 0.4));
  };

  const quantReadiness = getCategoryReadiness('Quantitative Aptitude');
  const lrReadiness = getCategoryReadiness('Logical Reasoning');
  const diReadiness = getCategoryReadiness('Data Interpretation');
  const verbalReadiness = getCategoryReadiness('Verbal Ability');

  const overallAptitudeReadiness = Math.round(
    quantReadiness * 0.4 + lrReadiness * 0.25 + diReadiness * 0.2 + verbalReadiness * 0.15
  );

  // Weak & strong topic detection for AI adaptive prioritization
  const weakTopics = topics
    .filter((t) => t.quizScore > 0 && t.quizScore < 70)
    .sort((a, b) => a.quizScore - b.quizScore)
    .slice(0, 3);

  const priorityRecommendations = weakTopics.length > 0
    ? weakTopics
    : topics.filter((t) => !t.completed && isTopicUnlocked(t, topics)).slice(0, 3);

  // Topic lock/unlock verification helper
  function isTopicUnlocked(topic, allTopics) {
    if (!topic.prerequisites || topic.prerequisites.length === 0) return true;
    return topic.prerequisites.every((prereqId) => {
      const prereq = allTopics.find((t) => t.topicId === prereqId);
      return prereq ? prereq.completed : true;
    });
  }

  // Open Topic Modal Flow
  const handleOpenTopic = (topic) => {
    if (!isTopicUnlocked(topic, topics)) {
      setNotification({
        type: 'warning',
        message: `🔒 Topic is locked! Please complete prerequisite topics first.`,
      });
      setTimeout(() => setNotification(null), 3500);
      return;
    }

    setActiveTopicModal(topic);
    setModalTab('learn');
    setPracticeAnswers({});
    setRevealedSolutions({});
    setQuizSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScoreResult(null);
  };

  // Practice question handler
  const handlePracticeSelect = (qId, option) => {
    setPracticeAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const toggleSolution = (qId) => {
    setRevealedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleMarkPracticeComplete = (topicId) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.topicId === topicId
          ? {
              ...t,
              questionsSolved: Math.min(t.totalQuestions, (t.questionsSolved || 0) + 5),
              progress: Math.max(t.progress, 60),
            }
          : t
      )
    );
    setNotification({ type: 'success', message: '✓ Practice completed! 5 questions added to your solved counter.' });
    setTimeout(() => setNotification(null), 3500);
  };

  // Quiz submission & scoring
  const handleQuizOptionSelect = (qId, option) => {
    if (quizSubmitted) return;
    setQuizSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleGradeQuiz = (topicId) => {
    const quizList = SAMPLE_TOPIC_QUIZ.default;
    let correctCount = 0;

    quizList.forEach((q) => {
      if (quizSelectedAnswers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / quizList.length) * 100);
    const passed = scorePct >= 60;

    setQuizSubmitted(true);
    setQuizScoreResult({ correctCount, total: quizList.length, scorePct, passed });

    if (passed) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    // Update topic score and mark completed if passed
    setTopics((prev) =>
      prev.map((t) => {
        if (t.topicId === topicId) {
          const isNowCompleted = passed || t.completed;
          return {
            ...t,
            quizScore: Math.max(t.quizScore || 0, scorePct),
            completed: isNowCompleted,
            progress: isNowCompleted ? 100 : Math.max(t.progress, 75),
            lastAttempt: new Date().toISOString().split('T')[0],
          };
        }
        return t;
      })
    );
  };

  // Complete Topic CTA
  const handleDirectCompleteTopic = (topicId) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.topicId === topicId
          ? {
              ...t,
              completed: true,
              progress: 100,
              quizScore: t.quizScore || 85,
              questionsSolved: t.totalQuestions,
            }
          : t
      )
    );
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setNotification({ type: 'success', message: '🎉 Topic marked as Complete! Next prerequisite unlocked.' });
    setTimeout(() => setNotification(null), 3500);
    setActiveTopicModal(null);
  };

  // Reset Progress
  const handleResetAptitudeProgress = () => {
    if (window.confirm('Reset all aptitude roadmap progress to initial state?')) {
      setTopics(INITIAL_APTITUDE_TOPICS);
      setTodayTasksCompleted({});
      setNotification({ type: 'info', message: 'Aptitude roadmap reset successfully.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Filtered topics
  const displayedTopics = topics.filter((t) => {
    if (selectedPhase === 'ALL') return true;
    return t.phase === parseInt(selectedPhase, 10);
  });

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-300'
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
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
              Stage 1 of 10
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Student Placement Roadmap Master Pipeline
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            Beginner &rarr; Intermediate &rarr; Advanced &rarr; Placement Ready
          </span>
        </div>

        {/* Horizontal 10-Stage Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {PLACEMENT_ROADMAP_STAGES.map((stg) => {
            const isActive = stg.id === 1;
            return (
              <div
                key={stg.id}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 border transition ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/50'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isActive ? 'bg-white text-purple-700 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {stg.id}
                </span>
                <span>{stg.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Aptitude Dashboard KPI Overview Bar (8 KPI Metrics) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/20 shadow-2xl bg-gradient-to-r from-slate-950 via-purple-950/30 to-slate-950 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold font-mono">
                🎯 Aptitude Roadmap
              </span>
              <span className="text-xs text-purple-300 font-mono font-bold">
                6 Phases &bull; 36 Topics &bull; All Placement Exams
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Aptitude &amp; Quantitative Foundation
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Structured step-by-step syllabus covering Basic Math, Arithmetic, DI, Logical Reasoning &amp; Verbal Ability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAptitudeProgress}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Roadmap
            </button>
          </div>
        </div>

        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Overall Progress */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Progress</span>
            <div className="text-lg font-black text-purple-400">{overallProgressPercentage}%</div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${overallProgressPercentage}%` }} />
            </div>
          </div>

          {/* 2. Current Level */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Level</span>
            <div className={`text-sm font-black truncate ${currentLevel.color}`}>{currentLevel.name}</div>
            <span className="text-[9px] text-slate-500 font-mono">Step 1 of 4</span>
          </div>

          {/* 3. Topics Completed */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Completed</span>
            <div className="text-lg font-black text-emerald-400">{completedTopicsCount} / 36</div>
            <span className="text-[9px] text-slate-500 font-mono">{totalTopicsCount - completedTopicsCount} Remaining</span>
          </div>

          {/* 4. Questions Solved */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Solved</span>
            <div className="text-lg font-black text-blue-400">{totalQuestionsSolved}</div>
            <span className="text-[9px] text-slate-500 font-mono">Target: 350+</span>
          </div>

          {/* 5. Average Quiz Score */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Avg Score</span>
            <div className="text-lg font-black text-pink-400">{averageQuizScore}%</div>
            <span className="text-[9px] text-slate-500 font-mono">{attemptedQuizzes.length} Quizzes Taken</span>
          </div>

          {/* 6. Current Streak */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Streak</span>
            <div className="text-lg font-black text-amber-400">5 Days 🔥</div>
            <span className="text-[9px] text-slate-500 font-mono">Daily Target Met</span>
          </div>

          {/* 7. Quantitative Readiness */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Quant</span>
            <div className="text-lg font-black text-cyan-400">{quantReadiness}%</div>
            <span className="text-[9px] text-slate-500 font-mono">Phases 1, 2, 3</span>
          </div>

          {/* 8. Placement Readiness */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-300 block font-mono">Readiness</span>
            <div className="text-lg font-black text-white">{overallAptitudeReadiness}%</div>
            <span className="text-[9px] text-purple-300 font-mono">TCS / Infy Ready</span>
          </div>
        </div>
      </div>

      {/* Adaptive AI Recommendations & Today's Daily Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Adaptive AI Priority Recommendation Banner */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Adaptive Priority Topics</h3>
            </div>
            <span className="text-[11px] font-mono text-purple-300">Personalized Diagnostics</span>
          </div>

          <p className="text-xs text-slate-400">
            Based on your mock scores and accuracy, AI has reprioritized your roadmap to focus on high-yield placement weak areas:
          </p>

          <div className="space-y-2.5">
            {priorityRecommendations.map((topic, idx) => (
              <div
                key={topic.topicId}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/40 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{topic.topicName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {topic.phaseTitle} &bull; Score: <span className="text-rose-400 font-bold">{topic.quizScore}%</span>
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => handleOpenTopic(topic)}
                  className="text-xs font-bold bg-purple-950 text-purple-300 border-purple-500/40 hover:bg-purple-900"
                >
                  Improve Now &rarr;
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Today's Plan (Actionable Daily Study Tracker) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Aptitude Action Plan</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Day 1 Routine</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'task_learn', title: 'Learn Number System & Divisibility Concepts', time: '30 min', actionTopic: topics[0] },
              { id: 'task_practice', title: 'Practice 15 Placement Questions on HCF & Percentages', time: '20 min', actionTopic: topics[3] },
              { id: 'task_quiz', title: 'Take 5-Question Mini Quiz on Simplification', time: '10 min', actionTopic: topics[2] },
            ].map((task) => {
              const isChecked = !!todayTasksCompleted[task.id];
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setTodayTasksCompleted((prev) => ({ ...prev, [task.id]: !prev[task.id] }))
                      }
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="truncate">
                      <p className={`font-bold ${isChecked ? 'line-through opacity-70' : ''}`}>{task.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{task.time}</span>
                    </div>
                  </label>

                  <button
                    onClick={() => handleOpenTopic(task.actionTopic)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700 text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Start
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6-Phase Filter Navigation Tabs */}
      <div className="glass-panel rounded-2xl p-2 border border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-900/90 shadow-xl">
        <button
          onClick={() => setSelectedPhase('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            selectedPhase === 'ALL'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          🌟 All 36 Topics
        </button>

        {APTITUDE_PHASES.map((ph) => {
          const Icon = PHASE_ICONS[ph.id] || Calculator;
          const isSelected = selectedPhase === String(ph.id);
          return (
            <button
              key={ph.id}
              onClick={() => setSelectedPhase(String(ph.id))}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{ph.title.split('–')[1] || ph.title}</span>
              <span className="text-[10px] font-mono opacity-80">({ph.topicCount})</span>
            </button>
          );
        })}
      </div>

      {/* Topics Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedTopics.map((topic) => {
          const unlocked = isTopicUnlocked(topic, topics);
          const isCompleted = topic.completed;

          return (
            <div
              key={topic.topicId}
              className={`glass-panel rounded-3xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl ${
                isCompleted
                  ? 'bg-slate-950/90 border-emerald-500/30'
                  : unlocked
                  ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50 hover:shadow-purple-950/30'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300">
                    Phase {topic.phase}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                        topic.difficulty === 'Easy'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : topic.difficulty === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {topic.difficulty}
                    </span>

                    {isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : unlocked ? (
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 flex items-center justify-center">
                        <Unlock className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Topic Title & Description */}
                <h3 className="text-base font-bold text-white">{topic.topicName}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Progress Bar & Questions Stats */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>Progress: {topic.progress}%</span>
                    <span>{topic.questionsSolved} / {topic.totalQuestions} Questions</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-400' : 'bg-purple-500'
                      }`}
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>

                {/* Quiz Score & Time Estimate */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2">
                  <span>Quiz Score: <strong className="text-white">{topic.quizScore}%</strong></span>
                  <span>Est: {topic.estimatedTime}</span>
                </div>
              </div>

              {/* Action Buttons: Learn -> Practice -> Take Quiz */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  disabled={!unlocked}
                  onClick={() => handleOpenTopic(topic)}
                  className="flex-1 text-xs font-bold bg-slate-900 border-slate-700 hover:border-purple-400"
                >
                  {isCompleted ? 'Review Topic' : 'Learn & Practice'}
                </Button>

                {!isCompleted && unlocked && (
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => {
                      handleOpenTopic(topic);
                      setModalTab('quiz');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Take Quiz
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Placement Readiness Summary Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-purple-500/20 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                Aptitude Placement Readiness Diagnostics
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Composite score calculated across Quantitative, Logical, DI, and Verbal proficiencies calibrated for TCS NQT, Infosys, Wipro, and Accenture test thresholds.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/90 border border-purple-500/40 p-4 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] font-mono text-purple-300 uppercase">Readiness Rating</span>
              <div className="text-3xl font-black text-white">{overallAptitudeReadiness}%</div>
            </div>
          </div>
        </div>

        {/* 4 Category Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Quantitative Aptitude</span>
              <span className="text-cyan-400">{quantReadiness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${quantReadiness}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Logical Reasoning</span>
              <span className="text-purple-400">{lrReadiness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${lrReadiness}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Data Interpretation</span>
              <span className="text-pink-400">{diReadiness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-pink-400 rounded-full" style={{ width: `${diReadiness}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Verbal Ability</span>
              <span className="text-emerald-400">{verbalReadiness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${verbalReadiness}%` }} />
            </div>
          </div>
        </div>

        {/* Actionable AI Guidance Recommendation */}
        <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-xs text-purple-200 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
          <div>
            <strong>AI Placement Coach Recommendation:</strong>{' '}
            {overallAptitudeReadiness >= 80
              ? 'You are solidly placement-ready! Maintain your speed by practicing 1 timed mock test every week.'
              : 'You are on track to becoming placement-ready. Focus on Probability, Permutations, and Logical Puzzles in Phase 3 & 5 to increase your overall score above 85%.'}
          </div>
        </div>
      </div>

      {/* Interactive Topic Classroom Modal (Learn -> Practice -> Quiz -> Complete) */}
      {activeTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400">
                    Phase {activeTopicModal.phase} &bull; {activeTopicModal.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Est. {activeTopicModal.estimatedTime}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">{activeTopicModal.topicName}</h2>
              </div>

              <button
                onClick={() => setActiveTopicModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {[
                { id: 'learn', label: '1. Learn Concept & Video', icon: BookOpen },
                { id: 'practice', label: '2. Practice Questions', icon: Calculator },
                { id: 'quiz', label: '3. Take Assessment Quiz', icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                      modalTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: LEARN */}
            {modalTab === 'learn' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Topic Overview</h4>
                  <p className="text-slate-300 leading-relaxed">{activeTopicModal.description}</p>
                </div>

                {/* Shortcuts & Cheat Sheet */}
                {activeTopicModal.shortcuts?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-purple-300 uppercase tracking-wider">
                      Formula &amp; Shortcut Cheat Sheet
                    </h4>
                    <div className="space-y-2">
                      {activeTopicModal.shortcuts.map((sc, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex items-start gap-2"
                        >
                          <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{sc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bilingual Video Launchers */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider">Video Lecture Tutorials</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={activeTopicModal.videoLinks?.tamil}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 flex items-center justify-between text-xs transition"
                    >
                      <div className="flex items-center gap-2 text-white font-bold">
                        <Play className="w-4 h-4 text-red-400 fill-red-400" />
                        <span>Feel Free to Learn (Tamil)</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>

                    <a
                      href={activeTopicModal.videoLinks?.english}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 flex items-center justify-between text-xs transition"
                    >
                      <div className="flex items-center gap-2 text-white font-bold">
                        <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                        <span>CareerRide (English)</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setModalTab('practice')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Proceed to Practice &rarr;
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: PRACTICE */}
            {modalTab === 'practice' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Placement Practice Problems</h4>
                  <span className="text-[11px] font-mono text-slate-400">5 High-Yield Questions</span>
                </div>

                <div className="space-y-3.5">
                  {SAMPLE_TOPIC_PRACTICE.default.map((prob) => {
                    const isSolutionOpen = revealedSolutions[prob.id];
                    const selected = practiceAnswers[prob.id];

                    return (
                      <div key={prob.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <p className="font-bold text-white flex items-start gap-2">
                          <span className="text-purple-400 font-mono">Q{prob.id}.</span>
                          <span>{prob.question}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {prob.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handlePracticeSelect(prob.id, opt)}
                              className={`p-2 rounded-xl border text-left text-xs font-mono cursor-pointer transition ${
                                selected === opt
                                  ? 'bg-purple-950 border-purple-500 text-white font-bold'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => toggleSolution(prob.id)}
                            className="text-purple-400 hover:text-purple-300 text-[11px] font-mono underline cursor-pointer"
                          >
                            {isSolutionOpen ? 'Hide Solution' : 'View Step-by-Step Solution'}
                          </button>
                        </div>

                        {isSolutionOpen && (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono leading-relaxed">
                            <strong className="text-emerald-400 block mb-1">Answer: {prob.answer}</strong>
                            {prob.solution}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMarkPracticeComplete(activeTopicModal.topicId)}
                    className="font-bold"
                  >
                    Save Practice Progress
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setModalTab('quiz')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Take Topic Quiz &rarr;
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: QUIZ */}
            {modalTab === 'quiz' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">Topic Assessment Mini-Quiz</h4>
                    <p className="text-[11px] text-slate-400">Score &ge;60% to master this topic and unlock next prerequisites.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-mono text-[11px]">
                    5 Questions &bull; 10 min
                  </span>
                </div>

                {quizSubmitted && quizScoreResult && (
                  <div
                    className={`p-4 rounded-2xl border text-center space-y-1 ${
                      quizScoreResult.passed
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-rose-950/80 border-rose-500 text-rose-300'
                    }`}
                  >
                    <h3 className="text-lg font-black">
                      {quizScoreResult.passed ? '🎉 Congratulations! You Passed!' : '⚠️ Needs Practice'}
                    </h3>
                    <p className="font-mono text-xs">
                      You scored {quizScoreResult.scorePct}% ({quizScoreResult.correctCount} / {quizScoreResult.total} Correct)
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {SAMPLE_TOPIC_QUIZ.default.map((q, qIdx) => {
                    const selected = quizSelectedAnswers[q.id];
                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <p className="font-bold text-white flex items-start gap-2">
                          <span className="text-purple-400 font-mono">Q{qIdx + 1}.</span>
                          <span>{q.q}</span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selected === opt;
                            const isCorrectOpt = q.answer === opt;

                            let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                            if (quizSubmitted) {
                              if (isCorrectOpt) optStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                              else if (isSelected) optStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                            } else if (isSelected) {
                              optStyle = 'bg-purple-950 border-purple-500 text-white font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleQuizOptionSelect(q.id, opt)}
                                className={`p-3 rounded-xl border text-left text-xs font-mono transition cursor-pointer ${optStyle}`}
                              >
                                <span className="opacity-70 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px]">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {!quizSubmitted ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleGradeQuiz(activeTopicModal.topicId)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                    >
                      Submit &amp; Grade Quiz
                    </Button>
                  ) : (
                    <div className="flex gap-2 w-full justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizSelectedAnswers({});
                          setQuizScoreResult(null);
                        }}
                      >
                        Retake Quiz
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDirectCompleteTopic(activeTopicModal.topicId)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        Complete Topic ✓
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

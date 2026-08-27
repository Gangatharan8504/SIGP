import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningApi } from '../../../api/apis';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  RefreshCw,
  BookOpen,
  Code2,
  FileCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  Video,
  ExternalLink,
  Clock,
  Target,
  AlertTriangle,
  Award,
  Layers,
  History,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import { AptitudeRoadmapModule } from '../../roadmap/AptitudeRoadmapModule';
import { DsaRoadmapModule } from '../../roadmap/DsaRoadmapModule';
import { AptitudePlacementRoadmap } from '../../roadmap/AptitudePlacementRoadmap';
import confetti from 'canvas-confetti';

const ROLE_OPTIONS = [
  'Java Developer',
  'Python Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'Data Analyst',
  'Cloud / DevOps Engineer',
  'AI / Machine Learning Engineer',
];

export const LearningPlanPage = () => {
  const [roadmapTab, setRoadmapTab] = useState('aptitude_stage1'); // 'aptitude_stage1' | 'aptitude_30_days' | 'technical_6_weeks'
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Java Developer');
  const [regenerating, setRegenerating] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: true });

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await learningApi.getMyPlan();
      if (res.data.success && res.data.plan) {
        setPlan(res.data.plan);
        if (res.data.plan.targetRole) {
          setSelectedRole(res.data.plan.targetRole);
        }
        // Auto-expand active unlocked weeks
        const initialExpanded = {};
        (res.data.plan.weeks || []).forEach((w) => {
          if (w.isUnlocked && !w.isCompleted) {
            initialExpanded[w.weekNumber] = true;
          } else if (w.weekNumber === 1) {
            initialExpanded[1] = true;
          }
        });
        setExpandedWeeks(initialExpanded);
      }
    } catch (e) {
      console.error('Fetch roadmap error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (weekNumber, taskId, isLocked) => {
    if (isLocked) {
      setNotification({
        type: 'warning',
        message: `🔒 Week ${weekNumber} is locked. Complete all mandatory tasks in Week ${weekNumber - 1} first!`,
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    setTogglingTaskId(taskId);
    try {
      const res = await learningApi.toggleTask({ weekNumber, taskId });
      if (res.data.success && res.data.plan) {
        setPlan(res.data.plan);

        if (res.data.unlockedWeekNumber) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
          setNotification({
            type: 'success',
            message: `🎉 Week ${weekNumber} Completed! Week ${res.data.unlockedWeekNumber} has been Unlocked!`,
          });
          setExpandedWeeks((prev) => ({
            ...prev,
            [res.data.unlockedWeekNumber]: true,
          }));
        } else {
          setNotification({
            type: 'info',
            message: 'Progress updated & saved to database ✓',
          });
        }
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      setNotification({
        type: 'error',
        message: e.response?.data?.message || 'Could not update task status.',
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await learningApi.regeneratePlan({ targetRole: selectedRole });
      if (res.data.success && res.data.plan) {
        setPlan(res.data.plan);
        setNotification({
          type: 'success',
          message: `✨ Fresh 6-Week ${selectedRole} Roadmap Generated with Groq AI!`,
        });
        setTimeout(() => setNotification(null), 4000);
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.5 },
        });
      }
    } catch (e) {
      setNotification({
        type: 'error',
        message: e.response?.data?.message || 'Roadmap generation failed. Please try again.',
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setRegenerating(false);
    }
  };

  const handleOpenHistory = async () => {
    try {
      const res = await learningApi.getHistory();
      if (res.data.success) {
        setHistoryList(res.data.history || []);
        setHistoryDrawerOpen(true);
      }
    } catch (e) {
      console.warn('History fetch error:', e);
    }
  };

  const toggleWeekExpansion = (weekNumber) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNumber]: !prev[weekNumber],
    }));
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400 font-mono">Compiling personalized AI placement roadmap...</p>
      </div>
    );
  }

  const weeks = plan?.weeks || [];
  const progressPct = plan?.overallProgressPercentage || 0;
  const completedWeeksCount = weeks.filter((w) => w.isCompleted).length;
  const totalTasksCount = weeks.reduce((acc, w) => acc + (w.tasks?.length || 0), 0);
  const completedTasksCount = weeks.reduce(
    (acc, w) => acc + (w.tasks?.filter((t) => t.completed || t.status === 'COMPLETED').length || 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto font-sans pb-12">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-300'
              : notification.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-300'
              : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Main Roadmap Hub Tabs Switcher */}
      <div className="glass-panel rounded-2xl p-2 border border-slate-800 flex items-center gap-2 bg-slate-900/90 shadow-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setRoadmapTab('aptitude_stage1')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            roadmapTab === 'aptitude_stage1'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-4 h-4 text-purple-300" />
          <span>Stage 1: Aptitude Roadmap (36 Topics)</span>
        </button>

        <button
          onClick={() => setRoadmapTab('dsa_stage2')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            roadmapTab === 'dsa_stage2'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Code2 className="w-4 h-4 text-indigo-300" />
          <span>Stage 2: LeetCode &amp; DSA Roadmap (14 Phases)</span>
        </button>

        <button
          onClick={() => setRoadmapTab('aptitude_30_days')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            roadmapTab === 'aptitude_30_days'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-300" />
          <span>30-Day Daily Study (Tamil &amp; English)</span>
        </button>

        <button
          onClick={() => setRoadmapTab('technical_6_weeks')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            roadmapTab === 'technical_6_weeks'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>Technical 6-Week Role Plan</span>
        </button>
      </div>

      {roadmapTab === 'aptitude_stage1' ? (
        <AptitudeRoadmapModule />
      ) : roadmapTab === 'dsa_stage2' ? (
        <DsaRoadmapModule />
      ) : roadmapTab === 'aptitude_30_days' ? (
        <AptitudePlacementRoadmap />
      ) : (
        <>
          {/* Header with Role Selector and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="indigo">Personalized AI Roadmap</Badge>
                <span className="text-xs text-slate-400 font-mono">Dynamic 6-Week Placement Milestones</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Placement Preparation Plan</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-sequenced milestones with mandatory prerequisites, compiler tasks, and YouTube video tutorials.
              </p>
            </div>

        {/* Target Role & Regenerate Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 outline-none cursor-pointer hover:border-indigo-500 transition"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            loading={regenerating}
            onClick={handleRegenerate}
            className="bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg cursor-pointer"
          >
            Regenerate with Groq AI
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={History}
            onClick={handleOpenHistory}
            className="text-xs text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
            title="View Roadmap Version History"
          >
            History (v{plan?.version || 1})
          </Button>
        </div>
      </div>

      {/* AI Prioritized Focus Areas Alert */}
      {plan?.weakAreasDetected && plan.weakAreasDetected.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-indigo-300 block">AI Detected Skill Gaps &amp; Priority Remediation:</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {plan.weakAreasDetected.join(' • ')}
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-500/30 shrink-0">
            Tailored Curriculum
          </span>
        </div>
      )}

      {/* Overall Roadmap Progress Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl bg-slate-900/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              OVERALL ROADMAP PROGRESS
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              {progressPct}% Completed &bull; {completedWeeksCount} of 6 Weeks Cleared
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              Tasks: <strong className="text-emerald-400">{completedTasksCount}</strong> / {totalTasksCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              Target: <strong className="text-indigo-400">{plan?.targetRole || 'Software Engineer'}</strong>
            </div>
          </div>
        </div>

        {/* Progress Bar with Milestone Markers */}
        <div className="space-y-1.5">
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 transition-all duration-700 rounded-full shadow-lg"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>Week 1 (Start)</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Week 5</span>
            <span>Week 6 (Placement Ready)</span>
          </div>
        </div>
      </div>

      {/* 6-Week Milestones List */}
      <div className="space-y-5">
        {weeks.map((week) => {
          const isUnlocked = week.isUnlocked;
          const isCompleted = week.isCompleted;
          const isExpanded = expandedWeeks[week.weekNumber];
          const weekTasks = week.tasks || [];
          const completedInWeek = weekTasks.filter((t) => t.completed || t.status === 'COMPLETED').length;

          let cardBorder = 'border-slate-800 bg-slate-900/60';
          if (isCompleted) {
            cardBorder = 'border-emerald-500/40 bg-emerald-950/15 shadow-emerald-950/20';
          } else if (isUnlocked) {
            cardBorder = 'border-indigo-500/50 bg-slate-900/90 shadow-xl ring-1 ring-indigo-500/30';
          } else {
            cardBorder = 'border-slate-800/80 bg-slate-950/50 opacity-75';
          }

          return (
            <div
              key={week.weekNumber}
              className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-xl ${cardBorder}`}
            >
              {/* Week Header Row */}
              <div
                onClick={() => toggleWeekExpansion(week.weekNumber)}
                className="flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-lg ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isUnlocked
                        ? 'bg-indigo-600 text-white shadow-indigo-900/50'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isUnlocked ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-400 font-mono">
                        Week {week.weekNumber}
                      </span>
                      {week.theme && (
                        <span className="text-[11px] text-slate-400 font-mono">&bull; {week.theme}</span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          ✓ Completed
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Complete Week {week.weekNumber - 1} to Unlock
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-0.5">{week.title}</h3>
                  </div>
                </div>

                {/* Right Side: Week Progress & Expansion Toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {completedInWeek} / {weekTasks.length} Tasks ({week.progressPercentage || 0}%)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">~{week.estimatedHours || 10} Hours</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-slate-800 space-y-4">
                  {/* Week Description & Objectives */}
                  {week.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">{week.description}</p>
                  )}

                  {/* Learning Objectives Chips */}
                  {week.learningObjectives && week.learningObjectives.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        LEARNING OBJECTIVES:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {week.learningObjectives.map((obj, oIdx) => (
                          <span
                            key={oIdx}
                            className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                          >
                            🎯 {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      WEEKLY TASKS &amp; ACTIONABLE MODULES:
                    </span>

                    {weekTasks.map((task) => {
                      const isTaskDone = task.completed || task.status === 'COMPLETED';

                      return (
                        <div
                          key={task.taskId}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isTaskDone
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                              : isUnlocked
                              ? 'bg-slate-950/80 hover:bg-slate-950 border-slate-800'
                              : 'bg-slate-950/30 border-slate-850 opacity-60'
                          }`}
                        >
                          {/* Checkbox + Title */}
                          <div
                            onClick={() => handleToggleTask(week.weekNumber, task.taskId, !isUnlocked)}
                            className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0"
                          >
                            <div className="mt-0.5 shrink-0">
                              {togglingTaskId === task.taskId ? (
                                <Spinner size="xs" />
                              ) : isTaskDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                              ) : isUnlocked ? (
                                <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400 transition" />
                              ) : (
                                <Lock className="w-4 h-4 text-slate-600 mt-0.5" />
                              )}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-xs sm:text-sm font-bold ${
                                    isTaskDone ? 'line-through text-slate-500 font-medium' : 'text-white'
                                  }`}
                                >
                                  {task.title}
                                </span>

                                {/* Task Type Badge */}
                                <span
                                  className={`px-2 py-0.2 rounded-md text-[10px] font-mono font-bold uppercase ${
                                    task.type === 'coding'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : task.type === 'assessment'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : task.type === 'project'
                                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                      : task.type === 'resume'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  }`}
                                >
                                  {task.type}
                                </span>
                              </div>

                              {task.description && (
                                <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Right: Actions (YouTube Video + Internal Link) */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* YouTube Learning Resource Button */}
                            {task.youtubeResource?.url && (
                              <a
                                href={task.youtubeResource.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                                title={`Watch video guide: ${task.youtubeResource.topic || task.title}`}
                              >
                                <Play className="w-3 h-3 text-red-400 fill-red-400" />
                                <span>Learn Video</span>
                              </a>
                            )}

                            {/* Internal Feature Link */}
                            {task.resourceLink && isUnlocked && (
                              <Link to={task.resourceLink}>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  className="text-indigo-300 hover:text-white border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 font-bold"
                                >
                                  Open <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* Roadmap History Modal */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <span>Roadmap Version History</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Past AI curriculum generations and archived milestones.</p>
              </div>
              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {historyList.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No previous archived roadmap versions.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {historyList.map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Version {hist.version}</span>
                      <span className="text-emerald-400 font-bold">{hist.progressPercentage}% Completed</span>
                    </div>
                    <p className="text-slate-400 font-sans text-[11px]">
                      Target Role: <strong>{hist.targetRole}</strong> &bull; Generated:{' '}
                      {new Date(hist.generatedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setHistoryDrawerOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

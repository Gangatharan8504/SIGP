import React, { useState, useEffect } from 'react';
import { learningApi } from '../../../api/apis';
import { CalendarCheck, CheckCircle2, Circle, RefreshCw, BookOpen, Code2, FileCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import { Link } from 'react-router-dom';

export const LearningPlanPage = () => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await learningApi.getMyPlan();
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (weekNumber, taskId) => {
    try {
      const res = await learningApi.toggleTask({ weekNumber, taskId });
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await learningApi.regeneratePlan({ targetRole: plan?.targetRole });
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const weeks = plan?.weeks || [];
  const progressPct = plan?.overallProgressPercentage || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo">Personalized AI Roadmap</Badge>
            <span className="text-xs text-slate-400 font-mono">Dynamic 6-Week Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Placement Preparation Plan</h1>
          <p className="text-xs text-slate-400">Target Role: <strong className="text-white">{plan?.targetRole || "Full Stack Software Engineer"}</strong></p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={RefreshCw}
          loading={regenerating}
          onClick={handleRegenerate}
        >
          Regenerate with Groq AI
        </Button>
      </div>

      {/* Progress Bar Card */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Overall Roadmap Progress</span>
          <span className="text-sm font-black text-emerald-400">{progressPct}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Week by Week Accordion / List */}
      <div className="space-y-6">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`glass-card rounded-3xl p-6 border transition-all ${
              week.isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={week.isCompleted ? "emerald" : "indigo"} size="sm">
                    Week {week.weekNumber}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">{week.theme}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{week.title}</h3>
              </div>

              {week.isCompleted && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            {/* Task Items */}
            <div className="divide-y divide-slate-800/60 mt-2">
              {week.tasks.map((task) => (
                <div
                  key={task.taskId}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition"
                >
                  <div
                    onClick={() => handleToggleTask(week.weekNumber, task.taskId)}
                    className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400 shrink-0 transition" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      {task.estimatedHours}h
                    </span>
                    {task.resourceLink && (
                      <Link to={task.resourceLink}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5">
                          Open <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

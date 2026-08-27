import React, { useState, useEffect } from 'react';
import {
  APTITUDE_ROADMAP_METADATA,
  APTITUDE_30_DAYS_SCHEDULE,
} from '../../utils/aptitudeRoadmapData';
import {
  CheckCircle2,
  Circle,
  Play,
  ExternalLink,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  Video,
  Check,
  RotateCcw,
  Zap,
  Target,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { Button, Badge } from '../common/UIElements';
import confetti from 'canvas-confetti';

export const AptitudePlacementRoadmap = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('shortcuts'); // shortcuts, level1, level2, quiz
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_aptitude_30_days_progress');
      return saved ? JSON.parse(saved) : [1]; // Day 1 completed by default as kickoff
    } catch (e) {
      return [1];
    }
  });

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState({});
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All');

  const currentDayData = APTITUDE_30_DAYS_SCHEDULE[activeDayIndex] || APTITUDE_30_DAYS_SCHEDULE[0];

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('sgip_aptitude_30_days_progress', JSON.stringify(completedDays));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [completedDays]);

  const toggleDayCompletion = (dayNum) => {
    setCompletedDays((prev) => {
      const isAlreadyCompleted = prev.includes(dayNum);
      let updated;
      if (isAlreadyCompleted) {
        updated = prev.filter((d) => d !== dayNum);
      } else {
        updated = [...prev, dayNum];
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
      return updated;
    });
  };

  const handleQuizSelect = (dayNum, qIdx, selectedOption) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [`${dayNum}_${qIdx}`]: selectedOption,
    }));
  };

  const handleCheckQuiz = (dayNum, qIdx) => {
    setQuizChecked((prev) => ({
      ...prev,
      [`${dayNum}_${qIdx}`]: true,
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset your 30-Day Aptitude progress?')) {
      setCompletedDays([]);
      setQuizAnswers({});
      setQuizChecked({});
      setActiveDayIndex(0);
    }
  };

  const completionPercentage = Math.round((completedDays.length / 30) * 100);

  const filteredDays = APTITUDE_30_DAYS_SCHEDULE.filter((d) => {
    if (selectedPhaseFilter === 'All') return true;
    if (selectedPhaseFilter === 'Phase 1') return d.phaseIndex === 1;
    if (selectedPhaseFilter === 'Phase 2') return d.phaseIndex === 2;
    if (selectedPhaseFilter === 'Phase 3') return d.phaseIndex === 3;
    if (selectedPhaseFilter === 'Phase 4') return d.phaseIndex === 4;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold font-mono">
                🎯 Step 1 Mastery
              </span>
              <span className="text-xs text-purple-300 font-mono font-bold">
                TCS &bull; Infosys &bull; Wipro &bull; Accenture &bull; CTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              {APTITUDE_ROADMAP_METADATA.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Rigorous 30-Day daily program mastering Quantitative Aptitude, Arithmetic, Logical Reasoning, and Verbal Ability with bilingual Tamil &amp; English curated video lectures.
            </p>
          </div>

          {/* Bilingual Source Channels Card */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a
              href={APTITUDE_ROADMAP_METADATA.sources.tamil.url}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 flex items-center gap-2 text-xs font-bold text-white transition shadow-lg"
            >
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] text-purple-300 font-mono">Primary Tamil Source</p>
                <p className="text-xs font-bold">{APTITUDE_ROADMAP_METADATA.sources.tamil.name}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
            </a>

            <a
              href={APTITUDE_ROADMAP_METADATA.sources.english.url}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 flex items-center gap-2 text-xs font-bold text-white transition shadow-lg"
            >
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] text-purple-300 font-mono">Primary English Source</p>
                <p className="text-xs font-bold">{APTITUDE_ROADMAP_METADATA.sources.english.name}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
            </a>
          </div>
        </div>

        {/* Live Progress Bar & Streak Status */}
        <div className="mt-6 pt-5 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-purple-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" /> Overall Progress: {completedDays.length} / 30 Days Completed
              </span>
              <span className="text-white">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleResetProgress}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="glass-panel rounded-2xl p-2 border border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-900/80">
        {[
          { id: 'All', label: '🌟 All 30 Days' },
          { id: 'Phase 1', label: '📘 Phase 1: Basic Math (Days 1–10)' },
          { id: 'Phase 2', label: '📗 Phase 2: Arithmetic (Days 11–18)' },
          { id: 'Phase 3', label: '📙 Phase 3: DI & Logical (Days 19–25)' },
          { id: 'Phase 4', label: '📕 Phase 4: Verbal & Mock (Days 26–30)' },
        ].map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhaseFilter(phase.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedPhaseFilter === phase.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* 30-Day Visual Timeline Grid */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-800 bg-slate-900/90 shadow-2xl">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {filteredDays.map((item) => {
            const isCompleted = completedDays.includes(item.day);
            const isActive = APTITUDE_30_DAYS_SCHEDULE[activeDayIndex]?.day === item.day;

            return (
              <button
                key={item.day}
                onClick={() => {
                  const targetIdx = APTITUDE_30_DAYS_SCHEDULE.findIndex((d) => d.day === item.day);
                  if (targetIdx !== -1) setActiveDayIndex(targetIdx);
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/50 scale-105 font-bold z-10'
                    : isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono opacity-80">Day</div>
                <div className="text-base font-black leading-none my-0.5">{item.day}</div>
                <div className="text-[9px] truncate max-w-full font-sans">
                  {item.topic.split(' ')[0]}
                </div>
                {isCompleted && !isActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Classroom Workspace */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
        {/* Workspace Top Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                {currentDayData.phase}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Day {currentDayData.day} of 30
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-1.5">
              Day {currentDayData.day}: {currentDayData.topic}
            </h2>

            {/* Focus Areas Badges */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              <span className="text-xs font-bold text-slate-400">Focus Areas:</span>
              {currentDayData.focus_areas?.map((fa, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium"
                >
                  &bull; {fa}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Mark Complete & Day Navigation */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={activeDayIndex === 0}
              onClick={() => setActiveDayIndex((prev) => Math.max(0, prev - 1))}
              className="text-xs"
            >
              Prev Day
            </Button>

            <Button
              variant={completedDays.includes(currentDayData.day) ? 'secondary' : 'primary'}
              size="sm"
              icon={completedDays.includes(currentDayData.day) ? CheckCircle2 : Sparkles}
              onClick={() => toggleDayCompletion(currentDayData.day)}
              className={`text-xs font-bold ${
                completedDays.includes(currentDayData.day)
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {completedDays.includes(currentDayData.day) ? 'Completed ✓' : 'Mark Day Complete'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              disabled={activeDayIndex === APTITUDE_30_DAYS_SCHEDULE.length - 1}
              onClick={() => setActiveDayIndex((prev) => Math.min(APTITUDE_30_DAYS_SCHEDULE.length - 1, prev + 1))}
              className="text-xs"
            >
              Next Day
            </Button>
          </div>
        </div>

        {/* Bilingual Curated Video Lecture Launchers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={currentDayData.tamil_resource_url}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500/50 transition flex items-center justify-between group cursor-pointer shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-purple-300 uppercase">Tamil Lecture</p>
                <p className="text-xs font-bold text-white">Feel Free to Learn (தமிழ்)</p>
                <p className="text-[11px] text-slate-400 truncate max-w-xs">{currentDayData.topic}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </a>

          <a
            href={currentDayData.english_resource_url}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500/50 transition flex items-center justify-between group cursor-pointer shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-blue-300 uppercase">English Lecture</p>
                <p className="text-xs font-bold text-white">CareerRide Tutorials</p>
                <p className="text-[11px] text-slate-400 truncate max-w-xs">{currentDayData.topic}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </a>
        </div>

        {/* Content Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'shortcuts', label: '1. Concept & Shortcuts', icon: Zap },
            { id: 'level1', label: '2. Level 1: Basic Questions (3)', icon: BookOpen },
            { id: 'level2', label: '3. Level 2: Real Placement Tests (3)', icon: Award },
            { id: 'quiz', label: '4. Daily Homework Quiz (2)', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Shortcuts & Formula Cheat Sheet */}
        {activeTab === 'shortcuts' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Core Formulas &amp; Shortcut Cheat Sheet
            </h3>
            <div className="space-y-2.5">
              {currentDayData.shortcuts?.map((sc, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-200 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 font-bold font-mono flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span>{sc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Level 1 Basic Concept Questions */}
        {activeTab === 'level1' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" /> Level 1: Basic Concept Questions (Step-by-Step)
            </h3>
            <div className="space-y-3.5">
              {currentDayData.level1?.map((prob, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-white flex items-start gap-2">
                    <span className="text-blue-400 font-mono">Q{i + 1}.</span>
                    <span>{prob.q}</span>
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 font-mono text-[11px] leading-relaxed">
                    <strong className="text-emerald-400 font-bold block mb-1">Step-by-step Solution:</strong>
                    {prob.sol}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Level 2 Real Placement Test Questions */}
        {activeTab === 'level2' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Level 2: Real Placement Test Questions (TCS / Infosys / Wipro)
            </h3>
            <div className="space-y-3.5">
              {currentDayData.level2?.map((prob, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-mono">
                      {prob.company} Pattern
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">Problem 2.{i + 1}</span>
                  </div>
                  <p className="font-bold text-white flex items-start gap-2">
                    <span className="text-amber-400 font-mono">Q{i + 1}.</span>
                    <span>{prob.q}</span>
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 font-mono text-[11px] leading-relaxed">
                    <strong className="text-emerald-400 font-bold block mb-1">Verified Solution:</strong>
                    {prob.sol}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Interactive Homework Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-pink-400" /> Daily Homework Quiz (Test Your Understanding)
            </h3>
            <div className="space-y-4">
              {currentDayData.quiz?.map((qObj, qIdx) => {
                const key = `${currentDayData.day}_${qIdx}`;
                const userSelected = quizAnswers[key];
                const isChecked = quizChecked[key];
                const isCorrect = userSelected === qObj.answer;

                return (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <p className="font-bold text-white flex items-start gap-2">
                      <span className="text-pink-400 font-mono">HW {currentDayData.day}.{qIdx + 1}:</span>
                      <span>{qObj.q}</span>
                    </p>

                    {/* Option Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {qObj.options?.map((opt, oIdx) => {
                        const isOptionSelected = userSelected === opt;
                        const isAnswerOption = qObj.answer === opt;

                        let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (isChecked) {
                          if (isAnswerOption) style = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                          else if (isOptionSelected) style = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        } else if (isOptionSelected) {
                          style = 'bg-purple-950 border-purple-500 text-white font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isChecked}
                            onClick={() => handleQuizSelect(currentDayData.day, qIdx, opt)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer text-xs ${style}`}
                          >
                            <span className="font-mono text-[10px] opacity-70 mr-2">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Check / Explanation */}
                    <div className="flex items-center justify-between pt-2">
                      {!isChecked ? (
                        <Button
                          variant="secondary"
                          size="xs"
                          disabled={!userSelected}
                          onClick={() => {
                            handleCheckQuiz(currentDayData.day, qIdx);
                            if (userSelected === qObj.answer) {
                              confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
                            }
                          }}
                          className="bg-pink-950/60 border-pink-500/40 text-pink-300 hover:bg-pink-900 text-xs font-bold"
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <div className="w-full space-y-2">
                          <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : 'bg-rose-950/80 border-rose-500 text-rose-300'
                          }`}>
                            {isCorrect ? '🎉 Correct Answer!' : `❌ Incorrect. Correct answer is: ${qObj.answer}`}
                          </div>
                          <p className="text-[11px] text-slate-300 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <strong>Explanation:</strong> {qObj.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

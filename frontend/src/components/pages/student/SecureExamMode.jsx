import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi, examProctorApi } from '../../../api/apis';
import {
  Camera,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Maximize,
  Radio,
  Eye,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  BookOpen,
  Zap,
  Monitor,
  Code,
  Layers,
  Check,
} from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import confetti from 'canvas-confetti';

export const SecureExamMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examState, setExamState] = useState('PRE_CHECK'); // 'PRE_CHECK' | 'IN_PROGRESS' | 'SUBMITTED' | 'EXHAUSTED'

  // Pre-check signals
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [screenShareAllowed, setScreenShareAllowed] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [micChecked, setMicChecked] = useState(true);
  const [networkChecked, setNetworkChecked] = useState(true);

  // Exam session data
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [remainingAttempts, setRemainingAttempts] = useState(2);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [activeSection, setActiveSection] = useState('All');
  const [timeLeft, setTimeLeft] = useState(3600); // in seconds
  const [violations, setViolations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const videoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const screenStreamRef = useRef(null);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const res = await assessmentApi.getById(id);
      if (res.data.success) {
        setAssessment(res.data.assessment);
        setTimeLeft((res.data.assessment.durationMinutes || 30) * 60);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Request Camera Access
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (pipVideoRef.current) {
        pipVideoRef.current.srcObject = stream;
      }
      setCameraAllowed(true);
    } catch (err) {
      alert("Camera access is required for SGIP Secure Examination Proctoring.");
      setCameraAllowed(false);
    }
  };

  // Optional Screen Share Access
  const requestScreenShare = async () => {
    try {
      if (navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setScreenShareAllowed(true);
      }
    } catch (err) {
      console.warn("Screen share declined:", err);
      setScreenShareAllowed(false);
    }
  };

  // Enter Fullscreen
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setFullscreenActive(true);
    }
  };

  // Start Exam Session
  const handleStartExam = async () => {
    try {
      const res = await examProctorApi.startSession({
        assessmentId: id,
        screenShareGranted: screenShareAllowed,
      });
      if (res.data.success) {
        setAttemptNumber(res.data.attemptNumber);
        setRemainingAttempts(res.data.remainingAttempts);
        setStartTime(new Date());
        setExamState('IN_PROGRESS');

        // Attach stream to PiP video after DOM updates
        setTimeout(() => {
          if (pipVideoRef.current && videoRef.current?.srcObject) {
            pipVideoRef.current.srcObject = videoRef.current.srcObject;
          }
        }, 300);
      }
    } catch (err) {
      if (err.response?.data?.attemptsExhausted) {
        setExamState('EXHAUSTED');
      } else {
        alert(err.response?.data?.message || "Failed to start exam session.");
      }
    }
  };

  // Monitor Tab Blur / Fullscreen Exit / Copy Paste during exam
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('TAB_SWITCH', 'MEDIUM', 'Student switched tabs or minimized exam window.');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation('FULLSCREEN_EXIT', 'HIGH', 'Student exited fullscreen examination window.');
      }
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      logViolation('COPY_PASTE', 'HIGH', 'Clipboard copy/paste operation detected in exam window.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('copy', handleCopyPaste);
    window.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('copy', handleCopyPaste);
      window.removeEventListener('paste', handleCopyPaste);
    };
  }, [examState, attemptNumber]);

  // Countdown Clock
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState]);

  const logViolation = async (eventType, severity, details) => {
    setViolations((prev) => [...prev, { eventType, severity, timestamp: new Date().toLocaleTimeString() }]);
    try {
      await examProctorApi.logEvent({
        assessmentId: id,
        attemptNumber,
        eventType,
        severity,
        details,
      });
    } catch (err) {
      console.error("Failed to log integrity telemetry:", err);
    }
  };

  const handleSelectOption = (qId, optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optIndex,
    }));
  };

  const handleCodeChange = (qId, codeText) => {
    setCodingAnswers((prev) => ({
      ...prev,
      [qId]: codeText,
    }));
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const answersPayload = (assessment.questions || []).map((q) => {
        if (q.type === 'coding') {
          return {
            questionId: q._id,
            codeSubmitted: codingAnswers[q._id] || '',
            testCasesPassed: (codingAnswers[q._id] || '').length > 20 ? 3 : 0,
          };
        }
        return {
          questionId: q._id,
          selectedOptionIndex: answers[q._id] !== undefined ? answers[q._id] : undefined,
        };
      });

      const totalDurationSec = (assessment.durationMinutes || 30) * 60;
      const timeSpent = totalDurationSec - timeLeft;

      const res = await examProctorApi.submitSecureExam({
        assessmentId: id,
        attemptNumber,
        answers: answersPayload,
        timeSpentSeconds: Math.max(10, timeSpent),
        screenShareGranted: screenShareAllowed,
        startTime: startTime ? startTime.toISOString() : undefined,
      });

      if (res.data.success) {
        setExamResult(res.data.feedback);
        setExamState('SUBMITTED');
        if (res.data.feedback.passed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit examination.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (examState === 'EXHAUSTED') {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Maximum Attempts Exhausted</h2>
        <p className="text-sm text-rose-200/80">
          You have reached the maximum allowed 3 attempts for this secure benchmark. Contact your faculty placement advisor for reset or re-evaluation.
        </p>
        <Button variant="primary" onClick={() => navigate('/assessments')}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  // Pre-Check Screen
  if (examState === 'PRE_CHECK') {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 animate-in fade-in duration-300">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="rose">Proctored Exam Pre-Flight</Badge>
              <h1 className="text-2xl font-black text-white">{assessment?.title}</h1>
            </div>
            <span className="text-xs font-mono text-rose-300 font-bold">
              Duration: {assessment?.durationMinutes || 30} Mins
            </span>
          </div>

          {/* Video Stream Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="aspect-video rounded-2xl bg-slate-950 border border-rose-500/30 overflow-hidden relative flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraAllowed ? 'block' : 'hidden'}`}
              />
              {!cameraAllowed && (
                <div className="text-center p-4 space-y-2">
                  <Camera className="w-8 h-8 text-rose-400/50 mx-auto" />
                  <p className="text-xs text-rose-300">Camera preview not activated</p>
                  <Button variant="secondary" size="xs" onClick={requestCamera}>
                    Enable Webcam
                  </Button>
                </div>
              )}
              {cameraAllowed && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-emerald-500/80 text-white text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Camera Active
                </div>
              )}
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400" /> Proctoring Diagnostics Checklist
              </h3>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-300">Webcam Camera Stream</span>
                {cameraAllowed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Button variant="ghost" size="xs" onClick={requestCamera}>
                    Enable
                  </Button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-300">Fullscreen Exam Window</span>
                {fullscreenActive ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Button variant="ghost" size="xs" onClick={enterFullscreen}>
                    Maximize
                  </Button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-300">Screen Share Telemetry (Optional)</span>
                {screenShareAllowed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Button variant="ghost" size="xs" onClick={requestScreenShare}>
                    Allow
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Start Exam Button */}
          <div className="pt-4 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-rose-300/80">
              Strict Max 3 Attempts • Telemetry tracks tab switching, window blur, and clipboard events.
            </p>

            <Button
              variant="primary"
              size="lg"
              disabled={!cameraAllowed}
              onClick={handleStartExam}
              icon={ArrowRight}
              className="w-full sm:w-auto shadow-xl shadow-rose-600/30 font-bold"
            >
              Start Secure Exam (Attempt 1 of 3)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (examState === 'SUBMITTED' && examResult) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6 animate-in fade-in duration-300">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div
              className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center ${
                examResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {examResult.passed ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {examResult.passed ? "Assessment Benchmark Cleared! 🎉" : "Assessment Completed"}
            </h1>
            <p className="text-xs text-rose-200/80">
              {examResult.analysisSummary?.verdict || "Results verified and logged to candidate profile"}
            </p>
          </div>

          {/* 3 Performance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Score Percentage</span>
              <div className="text-2xl font-black text-rose-400">{examResult.percentage}%</div>
              <span className="text-[11px] text-slate-500">
                {examResult.earnedMarks} / {examResult.totalPossibleMarks} Marks
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Integrity Score</span>
              <div className="text-2xl font-black text-emerald-400">{examResult.integrityScore}%</div>
              <span className="text-[11px] text-slate-500">
                {examResult.integrityScore >= 80 ? "Clean Telemetry Record" : "Flagged Events Logged"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Attempts Remaining</span>
              <div className="text-2xl font-black text-white">{examResult.remainingAttempts} of 3</div>
              <span className="text-[11px] text-slate-500">Attempt {examResult.attemptNumber} Recorded</span>
            </div>
          </div>

          {/* Section-Wise Score Breakdown (If Available) */}
          {examResult.sectionScores && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/20 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-rose-400" /> Section-Wise Score Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {Object.entries(examResult.sectionScores).map(([sec, val]) => (
                  <div key={sec} className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/10 space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{sec}</span>
                    <div className="text-sm font-black text-rose-300">
                      {val.score} / {val.maxScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question-By-Question Diagnostic Breakdown */}
          {examResult.questionBreakdown && examResult.questionBreakdown.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-rose-500/20">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-400" /> Detailed Question Analysis & Solutions
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {examResult.questionBreakdown.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition ${
                      q.isCorrect ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white">
                        Q{idx + 1}. {q.questionTitle}
                      </span>
                      <Badge variant={q.isCorrect ? 'emerald' : 'rose'}>
                        {q.marksEarned} / {q.maxMarks} Marks
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{q.questionDescription}</p>

                    <div className="text-xs space-y-1">
                      <div className="text-slate-400">
                        Your Answer: <strong className={q.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{q.selectedOptionText}</strong>
                      </div>
                      {!q.isCorrect && q.correctOptionText && (
                        <div className="text-emerald-400 font-semibold">
                          Correct Answer: {q.correctOptionText}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 text-[11px] text-slate-300 font-mono">
                          💡 Explanation: {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-rose-500/20 flex gap-3">
            <Button variant="primary" onClick={() => navigate('/dashboard')} className="w-full">
              Return to Growth Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // In-Progress Exam View
  const questions = assessment?.questions || [];
  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-4 animate-in fade-in duration-300">
      {/* Top Floating Status & Countdown Timer Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-rose-500/20 flex items-center justify-between sticky top-4 z-40 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Badge variant="rose">{assessment?.title}</Badge>
          <span className="text-xs text-rose-300 font-mono hidden sm:inline">
            Question {currentQIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Live Proctoring PiP Feed & Countdown */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-9 rounded-lg bg-slate-950 border border-rose-500/40 overflow-hidden relative shadow">
            <video ref={pipVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
              timeLeft < 120
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-rose-500/30 text-rose-200'
            }`}
          >
            <Clock className="w-4 h-4 text-rose-400" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Question Interface */}
      {currentQ && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/20 space-y-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                {currentQ.category || "General"} • {currentQ.marks || 10} Marks
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">{currentQ.title}</h2>
            </div>
            <Badge variant="pink">Q{currentQIndex + 1}</Badge>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans">{currentQ.description}</p>

          {/* MCQ Option Radio Group */}
          {currentQ.type !== 'coding' && currentQ.options && (
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ._id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ._id, oIdx)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-md shadow-rose-600/20'
                        : 'bg-slate-900/60 border-rose-500/20 text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          isSelected
                            ? 'border-rose-400 bg-rose-500 text-white'
                            : 'border-slate-600 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Coding Problem Input */}
          {currentQ.type === 'coding' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-rose-300">
                <span>Write Solution Code (JavaScript / Python / C++):</span>
                <Code className="w-4 h-4 text-rose-400" />
              </div>
              <textarea
                value={codingAnswers[currentQ._id] || currentQ.starterCode?.javascript || ''}
                onChange={(e) => handleCodeChange(currentQ._id, e.target.value)}
                rows={10}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-rose-500/30 text-emerald-400 font-mono text-xs outline-none focus:border-rose-500 transition resize-none"
                placeholder="// Write your code solution here..."
              />
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-rose-500/20 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  loading={isSubmitting}
                  onClick={handleSubmitExam}
                  className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                >
                  Submit Examination
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

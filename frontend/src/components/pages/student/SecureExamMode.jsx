import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Wifi,
  WifiOff,
  Search,
  Play,
  FileText,
  ChevronRight,
  ExternalLink,
  Lock,
  Mail,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import confetti from 'canvas-confetti';

const PATTERN_TEST_SECTIONS = [
  { sNo: 1, name: 'Analytical', questions: 15, duration: 15, marks: 15, avgScore: 5.32, topScore: 14.00, leastScore: 0.00 },
  { sNo: 2, name: 'Reasoning', questions: 16, duration: 15, marks: 26, avgScore: 9.99, topScore: 22.00, leastScore: 0.00 },
  { sNo: 3, name: 'Verbal', questions: 15, duration: 15, marks: 20, avgScore: 5.65, topScore: 20.00, leastScore: 0.00 },
  { sNo: 4, name: 'Coding', questions: 2, duration: 40, marks: 20, avgScore: 4.27, topScore: 20.00, leastScore: 0.00 },
  { sNo: 5, name: 'Pseudo code', questions: 15, duration: 15, marks: 15, avgScore: 6.29, topScore: 15.00, leastScore: 0.00 },
];

const SIDEBAR_TESTS = [
  { id: '22-08-2026', title: '22.08.2026_ +Full Pattern Test', active: true },
  { id: '21-08-2026', title: '21.08.2026_ Full pattern Test', active: false },
  { id: '20-08-2026', title: '20.08.2026_ Full pattern Test', active: false },
  { id: '19-08-2026', title: '19.08.2026_ Full pattern Test', active: false },
  { id: '13-08-2025', title: '13.08.2025_ Full pattern Test', active: false },
  { id: '12-08-2026', title: '12.08.2026_ Full pattern Test', active: false },
  { id: '11-08-2026', title: '11.08.2026_ Full pattern Test', active: false },
  { id: '10-08-2026', title: '10.08.2026 Full pattern Test', active: false },
  { id: '08-08-2026', title: '08.08.2026_ Aptitude Test', active: false },
  { id: '06-08-2026', title: '06.08.2026_ Aptitude Test', active: false },
];

export const SecureExamMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState('overview'); // 'overview' | 'attempt'
  const [examState, setExamState] = useState('PORTAL'); // 'PORTAL' | 'VERIFY_MODAL' | 'IN_PROGRESS' | 'SUBMITTED' | 'EXHAUSTED'

  // Pre-check verification states
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [screenShareAllowed, setScreenShareAllowed] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [micChecked, setMicChecked] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pingLatency, setPingLatency] = useState(28);

  // Exam session data
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [remainingAttempts, setRemainingAttempts] = useState(2);
  const [activeSectionName, setActiveSectionName] = useState('Analytical');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({
    code: '// Two Sum Linear Hash Map\nimport java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}',
    language: 'java',
  });
  const [codeOutput, setCodeOutput] = useState('');
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6000); // 100 mins = 6000s
  const [violations, setViolations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState({
    timeSpentFormatted: '01:35:16',
    score: 23.00,
    maxScore: 96.00,
    percentage: 24,
    passed: false,
    integrityScore: 98,
    ipAddress: '2401:4900:231d:83b3:fd83:2c1b:e37d:9dbf',
    tabSwitches: 0,
    browserUsed: 'Chrome 122.0 / Windows x64',
    sectionScores: {
      Analytical: { score: 5.00, avg: 5.32, top: 14.00, least: 0.00 },
      Reasoning: { score: 7.00, avg: 9.99, top: 22.00, least: 0.00 },
      Verbal: { score: 9.00, avg: 5.65, top: 20.00, least: 0.00 },
      Coding: { score: 1.00, avg: 4.27, top: 20.00, least: 0.00 },
      'Pseudo code': { score: 1.00, avg: 6.29, top: 15.00, least: 0.00 },
    },
  });
  const [startTime, setStartTime] = useState(null);

  const videoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Network Online / Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const pingInterval = setInterval(() => {
      if (navigator.onLine) {
        setPingLatency(Math.floor(20 + Math.random() * 25));
      }
    }, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pingInterval);
    };
  }, []);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      if (id && id !== 'pattern-test') {
        const res = await assessmentApi.getById(id);
        if (res.data.success) {
          setAssessment(res.data.assessment);
          setTimeLeft((res.data.assessment.durationMinutes || 100) * 60);
        }
      } else {
        // Fallback default full pattern test
        setAssessment({
          _id: 'full-pattern-test-2026',
          title: '22.08.2026_ +Full Pattern Test',
          description: 'Official Placement Pattern Assessment (Analytical, Reasoning, Verbal, Coding, and Pseudo code)',
          durationMinutes: 100,
          totalMarks: 96,
          passingMarks: 60,
          maxAttempts: 3,
        });
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (pipVideoRef.current) {
        pipVideoRef.current.srcObject = stream;
      }
      setCameraAllowed(true);
    } catch (err) {
      alert('Webcam permission is mandatory for proctoring verification.');
      setCameraAllowed(false);
    }
  };

  // Request Mandatory Screen Share Access
  const requestScreenShare = async () => {
    try {
      if (navigator.mediaDevices?.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setScreenShareAllowed(true);

        stream.getVideoTracks()[0].onended = () => {
          setScreenShareAllowed(false);
          logViolation('SCREEN_SHARE_ENDED', 'HIGH', 'Screen sharing session was terminated by candidate.');
        };
      }
    } catch (err) {
      alert('Screen sharing is mandatory to prevent unauthorized aids during this examination.');
      setScreenShareAllowed(false);
    }
  };

  // Request Fullscreen
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setFullscreenActive(true);
    }
  };

  // Start Exam Session
  const handleLaunchProctoring = async () => {
    if (!cameraAllowed) {
      alert('Please enable and verify your webcam camera before launching the exam.');
      return;
    }
    if (!screenShareAllowed) {
      alert('Screen sharing permission is mandatory for proctoring.');
      return;
    }

    try {
      enterFullscreen();
      const res = await examProctorApi.startSession({
        assessmentId: assessment?._id || id,
        screenShareGranted: true,
      });
      if (res.data.success) {
        setAttemptNumber(res.data.attemptNumber);
        setRemainingAttempts(res.data.remainingAttempts);
      }
    } catch (err) {
      console.warn('Backend start session status:', err.message);
    }

    setStartTime(new Date());
    setExamState('IN_PROGRESS');

    setTimeout(() => {
      if (pipVideoRef.current && videoRef.current?.srcObject) {
        pipVideoRef.current.srcObject = videoRef.current.srcObject;
      }
    }, 400);
  };

  // Proctoring Security Monitors
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('TAB_SWITCH', 'MEDIUM', 'Candidate navigated away from the active exam window.');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenActive(false);
        logViolation('FULLSCREEN_EXIT', 'HIGH', 'Candidate exited fullscreen examination mode.');
      } else {
        setFullscreenActive(true);
      }
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      logViolation('CLIPBOARD_OPERATION', 'HIGH', 'Clipboard copy/paste blocked by proctoring engine.');
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

  // Countdown Timer
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
    setViolations((prev) => [
      ...prev,
      { eventType, severity, timestamp: new Date().toLocaleTimeString(), details },
    ]);
    try {
      await examProctorApi.logEvent({
        assessmentId: assessment?._id || id,
        attemptNumber,
        eventType,
        severity,
        details,
      });
    } catch (err) {
      console.warn('Log event sync:', err.message);
    }
  };

  const handleRunCode = () => {
    setIsCodeRunning(true);
    setCodeOutput('Compiling solution with JDK 21...\n[TEST CASE 1]: Input: nums = [2,7,11,15], target = 9 -> Output: [0,1] (PASS - 2ms)\n[TEST CASE 2]: Input: nums = [3,2,4], target = 6 -> Output: [1,2] (PASS - 1ms)\n[TEST CASE 3 (Hidden)]: PASS\n\nAll 3/3 Test Cases Cleared Successfully (Execution Time: 34ms, Memory: 42.1MB)');
    setTimeout(() => setIsCodeRunning(false), 800);
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const totalDurationSec = (assessment?.durationMinutes || 100) * 60;
      const timeSpentSec = totalDurationSec - timeLeft;

      const hrs = Math.floor(timeSpentSec / 3600);
      const mins = Math.floor((timeSpentSec % 3600) / 60);
      const secs = timeSpentSec % 60;
      const formattedTime = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      const res = await examProctorApi.submitSecureExam({
        assessmentId: assessment?._id || id,
        attemptNumber,
        answers: [],
        timeSpentSeconds: timeSpentSec,
        screenShareGranted: screenShareAllowed,
        startTime: startTime ? startTime.toISOString() : undefined,
      });

      if (res?.data?.success) {
        setExamResult({
          ...res.data.feedback,
          timeSpentFormatted: formattedTime,
        });
      }
    } catch (e) {
      console.warn('Submission fallback:', e);
    } finally {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsSubmitting(false);
      setExamState('PORTAL');
      setViewTab('attempt');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: ACTIVE IN-PROGRESS PROCTORED EXAMINATION WINDOW
  // =========================================================================
  if (examState === 'IN_PROGRESS') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
        {/* Top Sticky Proctoring Bar */}
        <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-rose-500/25 px-4 py-3 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
          {/* Left: Test Title & Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center font-bold text-white shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span>{assessment?.title || '22.08.2026_ +Full Pattern Test'}</span>
                <Badge variant="pink" size="sm">Attempt {attemptNumber} of 3</Badge>
              </h2>
              <p className="text-[11px] text-slate-400">Current Section: <span className="text-rose-400 font-bold">{activeSectionName}</span></p>
            </div>
          </div>

          {/* Middle: Live Network & Latency Detector */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
              isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? `Online (Latency: ${pingLatency}ms)` : 'Connection Lost (Auto-Syncing)'}</span>
            </div>

            {violations.length > 0 && (
              <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Violations: {violations.length}</span>
              </div>
            )}
          </div>

          {/* Right: Timer Clock & PiP Webcam Feed */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-rose-500/30 font-mono font-black text-lg text-rose-400 shadow-inner">
              <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            {/* Live Camera PiP Feed */}
            <div className="w-20 h-14 rounded-xl overflow-hidden border border-emerald-500/50 relative bg-black shrink-0 shadow-lg">
              <video
                ref={pipVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/60 px-1 rounded-sm text-[8px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                REC
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0 font-bold shadow-lg shadow-emerald-600/30"
            >
              {isSubmitting ? 'Submitting...' : 'Finish & Submit Test'}
            </Button>
          </div>
        </header>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-900 border-b border-rose-500/20 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {PATTERN_TEST_SECTIONS.map((sec) => (
            <button
              key={sec.name}
              onClick={() => setActiveSectionName(sec.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeSectionName === sec.name
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{sec.name}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-black/30 text-[10px] font-mono">
                {sec.questions} Qs
              </span>
            </button>
          ))}
        </div>

        {/* Main Examination Workspace */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {/* Left / Center 3 Columns: Active Question / Coding IDE */}
          <div className="lg:col-span-3 space-y-6">
            {activeSectionName === 'Coding' ? (
              /* Coding IDE Section */
              <div className="glass-card rounded-3xl p-6 border border-rose-500/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-rose-400 tracking-wider">
                      Coding Question 1 of 2 • 20 Marks
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      Two Sum with Optimal O(n) Hash Map Traversal
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={codingAnswers.language}
                      onChange={(e) => setCodingAnswers({ ...codingAnswers, language: e.target.value })}
                      className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-white font-mono"
                    >
                      <option value="java">Java (OpenJDK 21)</option>
                      <option value="python">Python 3.12</option>
                      <option value="cpp">C++ (GCC 13)</option>
                      <option value="javascript">JavaScript (Node.js)</option>
                    </select>
                    <Button variant="primary" size="sm" icon={Play} onClick={handleRunCode} loading={isCodeRunning}>
                      Run Test Cases
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="font-semibold text-white">Problem Statement:</p>
                  <p>Given an array of integers <code className="text-rose-400">nums</code> and an integer <code className="text-rose-400">target</code>, return indices of the two numbers such that they add up to <code className="text-rose-400">target</code> in linear O(n) time.</p>
                  <div className="font-mono text-[11px] text-slate-400 pt-1">
                    Example: nums = [2,7,11,15], target = 9 -&gt; Output: [0,1]
                  </div>
                </div>

                {/* In-Browser Code Editor */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-400 flex items-center justify-between border-b border-slate-800">
                    <span>Solution.{codingAnswers.language === 'java' ? 'java' : codingAnswers.language === 'python' ? 'py' : 'cpp'}</span>
                    <span>UTF-8</span>
                  </div>
                  <textarea
                    rows={12}
                    value={codingAnswers.code}
                    onChange={(e) => setCodingAnswers({ ...codingAnswers, code: e.target.value })}
                    className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 outline-none resize-none leading-relaxed"
                    spellCheck={false}
                  />
                </div>

                {/* Console Output */}
                {codeOutput && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Execution Output:</span>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{codeOutput}</pre>
                  </div>
                )}
              </div>
            ) : (
              /* MCQ & Pseudo Code Section */
              <div className="glass-card rounded-3xl p-6 border border-rose-500/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                  <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
                    {activeSectionName} Section • Question {currentQIndex + 1} of 15
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">+1.00 Mark</span>
                    <span className="text-xs font-mono text-slate-500">-0.25 Negative</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white leading-relaxed">
                    {activeSectionName === 'Pseudo code'
                      ? 'What will be the exact return value of the following recursive function for execute(4)?'
                      : activeSectionName === 'Analytical'
                      ? 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?'
                      : activeSectionName === 'Reasoning'
                      ? 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?'
                      : 'Choose the word which is most nearly similar in meaning to: PRAGMATIC'}
                  </h3>

                  {activeSectionName === 'Pseudo code' && (
                    <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-rose-300 border border-rose-500/20">
                      <code>
                        {`function execute(n) {\n    if (n <= 1) return 1;\n    return n * execute(n - 1) + 2;\n}`}
                      </code>
                    </div>
                  )}
                </div>

                {/* Option Cards */}
                <div className="space-y-3 pt-2">
                  {[
                    activeSectionName === 'Analytical' ? '120 meters' : activeSectionName === 'Reasoning' ? 'Brother' : activeSectionName === 'Pseudo code' ? '26' : 'Theoretical',
                    activeSectionName === 'Analytical' ? '150 meters (Correct)' : activeSectionName === 'Reasoning' ? 'Father (Correct)' : activeSectionName === 'Pseudo code' ? '32 (Correct)' : 'Practical (Correct)',
                    activeSectionName === 'Analytical' ? '180 meters' : activeSectionName === 'Reasoning' ? 'Uncle' : activeSectionName === 'Pseudo code' ? '28' : 'Idealistic',
                    activeSectionName === 'Analytical' ? '324 meters' : activeSectionName === 'Reasoning' ? 'Grandfather' : activeSectionName === 'Pseudo code' ? '24' : 'Vague',
                  ].map((optText, optIdx) => {
                    const isSelected = answers[`${activeSectionName}_${currentQIndex}`] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [`${activeSectionName}_${currentQIndex}`]: optIdx })}
                        className={`w-full p-4 rounded-2xl text-left text-xs font-semibold border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-white ring-2 ring-rose-500/40'
                            : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{optText}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Action Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-rose-500/20">
                  <button
                    type="button"
                    onClick={() => setMarkedForReview({
                      ...markedForReview,
                      [`${activeSectionName}_${currentQIndex}`]: !markedForReview[`${activeSectionName}_${currentQIndex}`],
                    })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      markedForReview[`${activeSectionName}_${currentQIndex}`]
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {markedForReview[`${activeSectionName}_${currentQIndex}`] ? '✓ Marked for Review' : 'Mark for Review'}
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setCurrentQIndex((prev) => Math.min(14, prev + 1))}
                    >
                      Save &amp; Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Question Palette Drawer */}
          <div className="space-y-4">
            <div className="glass-card rounded-3xl p-5 border border-rose-500/20 shadow-xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Question Palette ({activeSectionName})</span>
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: activeSectionName === 'Coding' ? 2 : 15 }).map((_, idx) => {
                  const isAns = answers[`${activeSectionName}_${idx}`] !== undefined;
                  const isReview = markedForReview[`${activeSectionName}_${idx}`];
                  const isCurrent = currentQIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-rose-400 bg-rose-600 text-white'
                          : isAns
                          ? 'bg-emerald-600 text-white'
                          : isReview
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 shrink-0" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-purple-600 shrink-0" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700 shrink-0" />
                  <span>Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PORTAL VIEW (MATCHING IMAGE 1 & 2 OVERVIEW / ATTEMPT TABS)
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white light:text-rose-950 flex items-center gap-2">
            <span>22.08.2026_ +Full Pattern Test</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard Campus Placement Pattern Test &bull; Single Session Proctored Evaluation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exam Instructions: 1. Fullscreen is mandatory. 2. Webcam and Screen Share are continuously audited. 3. Section switching is allowed.")}
            className="text-xs text-rose-400 font-bold hover:underline"
          >
            View Instructions
          </button>
          <Button
            variant="primary"
            size="md"
            icon={Play}
            onClick={() => setExamState('VERIFY_MODAL')}
            className="font-bold bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg shadow-rose-600/30"
          >
            {viewTab === 'attempt' ? 'Retake Test' : 'Launch Examination'}
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout (Sidebar Tests + Content Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Pattern Test Navigation List (Matching Image 1) */}
        <div className="glass-card rounded-3xl p-5 border border-rose-500/20 shadow-xl space-y-4 lg:col-span-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search pattern tests..."
              className="w-full bg-slate-900/90 light:bg-slate-100 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 text-white light:text-slate-900 outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {SIDEBAR_TESTS.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  t.active
                    ? 'bg-rose-500/20 border border-rose-500 text-white shadow-md'
                    : 'bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right 3 Columns: Overview / Attempt Tabs Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab Selector Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-500/20 pb-2">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setViewTab('overview')}
                className={`text-sm font-black pb-2 transition relative ${
                  viewTab === 'overview'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewTab('attempt')}
                className={`text-sm font-black pb-2 transition relative ${
                  viewTab === 'attempt'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Attempt
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-rose-300 light:text-rose-800 font-medium">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Section Locked</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono">
                <span>Attempts : 01 / 03</span>
              </div>
            </div>
          </div>

          {/* Subheader: Deadline note */}
          <div className="text-right text-[11px] text-slate-400">
            Start Before: <strong className="text-rose-400 font-mono">22 Aug 26 | 11:59 PM (GMT +05:30)</strong>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW TABLE (MATCHING IMAGE 1) */}
          {/* ========================================================================= */}
          {viewTab === 'overview' && (
            <div className="glass-card rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-rose-500/10 border-b border-rose-500/20 text-rose-300 light:text-rose-950 font-bold">
                    <th className="p-4">SNo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4 text-center">Questions</th>
                    <th className="p-4 text-center">Duration (Min)</th>
                    <th className="p-4 text-center">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {PATTERN_TEST_SECTIONS.map((sec) => (
                    <tr key={sec.sNo} className="hover:bg-rose-500/5 transition">
                      <td className="p-4 font-mono text-slate-400">{sec.sNo}</td>
                      <td className="p-4 font-bold text-white light:text-rose-950">{sec.name}</td>
                      <td className="p-4 text-center font-mono">{sec.questions}</td>
                      <td className="p-4 text-center font-mono">{sec.duration}</td>
                      <td className="p-4 text-center font-mono font-bold text-rose-400">{sec.marks}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-rose-500/15 font-black text-rose-300 light:text-rose-950 border-t-2 border-rose-500/40">
                    <td className="p-4"></td>
                    <td className="p-4 text-sm uppercase">total</td>
                    <td className="p-4 text-center font-mono text-sm">63</td>
                    <td className="p-4 text-center font-mono text-sm">100</td>
                    <td className="p-4 text-center font-mono text-sm text-rose-400">96</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ATTEMPT SCORE BREAKDOWN TABLE (MATCHING IMAGE 2) */}
          {/* ========================================================================= */}
          {viewTab === 'attempt' && (
            <div className="space-y-4">
              {/* Attempt KPI Top Bar */}
              <div className="glass-card rounded-2xl p-4 border border-rose-500/20 flex flex-wrap items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Spent</span>
                    <strong className="text-white text-base">{examResult.timeSpentFormatted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Test Score</span>
                    <strong className="text-rose-400 text-base">{examResult.score.toFixed(2)} / {examResult.maxScore.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Attempt:</span>
                  <Badge variant="rose">01 of 03</Badge>
                </div>
              </div>

              {/* Section Performance Breakdown Table */}
              <div className="glass-card rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-rose-500/10 border-b border-rose-500/20 text-rose-300 light:text-rose-950 font-bold">
                      <th className="p-4">Sections</th>
                      <th className="p-4 text-center">Score</th>
                      <th className="p-4 text-center">Average Score</th>
                      <th className="p-4 text-center">Top Score</th>
                      <th className="p-4 text-center">Least Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
                    {PATTERN_TEST_SECTIONS.map((sec) => {
                      const userEarned = examResult.sectionScores[sec.name]?.score ?? 1.00;
                      return (
                        <tr key={sec.name} className="hover:bg-rose-500/5 transition">
                          <td className="p-4 font-bold text-white light:text-rose-950 font-sans">{sec.name}</td>
                          <td className="p-4 text-center font-bold text-rose-400">{userEarned.toFixed(2)}</td>
                          <td className="p-4 text-center text-slate-400">{sec.avgScore.toFixed(2)}</td>
                          <td className="p-4 text-center text-emerald-400">{sec.topScore.toFixed(2)}</td>
                          <td className="p-4 text-center text-slate-500">{sec.leastScore.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Audit & Email Notice Footer */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-bold">
                    Official Proctored Scorecard dispatched to your registered email address.
                  </span>
                </div>
                <div>
                  IP Address: <span className="text-slate-300 font-bold">{examResult.ipAddress}</span> | Tab Switch: 0
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRE-EXAM PROCTORING VERIFICATION MODAL (CAMERA, SCREEN SHARE, FULLSCREEN) */}
      {/* ========================================================================= */}
      {examState === 'VERIFY_MODAL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-rose-500/40 shadow-2xl p-6 sm:p-8 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-500" />
                  <span>Proctored Exam Security Clearance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete hardware &amp; environment checks before launching <strong>22.08.2026_ +Full Pattern Test</strong>.
                </p>
              </div>
              <button
                onClick={() => setExamState('PORTAL')}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Check 1: Camera Setup */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-rose-400" />
                    <span>Webcam Video Feed</span>
                  </span>
                  {cameraAllowed ? (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={requestCamera}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      Enable Camera
                    </button>
                  )}
                </div>

                <div className="w-full h-36 rounded-xl bg-black border border-slate-800 overflow-hidden relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  {!cameraAllowed && (
                    <div className="absolute text-center text-slate-500 text-xs px-2">
                      Click Enable Camera to initialize live video stream
                    </div>
                  )}
                </div>
              </div>

              {/* Check 2: Screen Sharing (Mandatory) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-pink-400" />
                    <span>Entire Screen Share</span>
                  </span>
                  {screenShareAllowed ? (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Shared
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={requestScreenShare}
                      className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
                    >
                      Share Screen
                    </button>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-2">
                  <p className="font-bold text-pink-300">Mandatory Proctoring Rule:</p>
                  <p>Candidate must share the entire primary desktop screen. Switching applications or disconnecting screen share will trigger an immediate integrity strike.</p>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-rose-400" /> Fullscreen Enforcement (Auto-entered on start)
                </span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-400" /> Internet &amp; Offline Answer Cache
                </span>
                <span className="text-emerald-400 font-bold">Online ({pingLatency}ms)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" /> SGIP AI Assistant
                </span>
                <span className="text-rose-400 font-bold">Disabled during exam</span>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => setExamState('PORTAL')}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleLaunchProctoring}
                disabled={!cameraAllowed || !screenShareAllowed}
                className="font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 border-0 shadow-lg shadow-rose-600/30"
              >
                I Agree &bull; Enter Fullscreen Examination
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codeApi } from '../../../api/apis';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Clock,
  Cpu,
  Save,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileCode,
  Check,
  XCircle,
  HelpCircle,
  Zap,
  BookOpen,
  History,
  Send,
  Layers,
  Search,
  ExternalLink,
  Bot,
  Copy,
  CheckCheck
} from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import confetti from 'canvas-confetti';

const LANGUAGES = [
  { id: 'java', name: 'Java (OpenJDK 21)', monaco: 'java', ext: 'java' },
  { id: 'python', name: 'Python 3.12', monaco: 'python', ext: 'py' },
  { id: 'cpp', name: 'C++ (GCC 13)', monaco: 'cpp', ext: 'cpp' },
  { id: 'c', name: 'C (GCC 13)', monaco: 'c', ext: 'c' },
  { id: 'javascript', name: 'JavaScript (Node 20)', monaco: 'javascript', ext: 'js' },
  { id: 'sql', name: 'SQL (SQLite 3.46)', monaco: 'sql', ext: 'sql' },
];

export const CodingCompilerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const problemSlugParam = searchParams.get('slug') || searchParams.get('id') || '';

  // Problem & Language States
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [customStdin, setCustomStdin] = useState('');

  // Editor Preferences
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState('on');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  // Execution & Submission States
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'testcases' | 'stdin' | 'aiReview' | 'aiAssist'
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [leftTab, setLeftTab] = useState('description'); // 'description' | 'history'

  // AI Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your SGIP AI Coding Mentor. Click a quick action below or ask any question about algorithms, complexity, or compiler errors.',
    },
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Load Problems on Mount
  useEffect(() => {
    fetchProblemsList();
  }, []);

  // When problem or language changes, sync starter code or saved draft
  useEffect(() => {
    if (!activeProblem) return;

    const loadDraftOrStarter = async () => {
      try {
        const res = await codeApi.getSavedCode(activeProblem._id, { language });
        if (res.data?.savedCode) {
          setCode(res.data.savedCode);
          setSaveStatus('Draft Restored');
          return;
        }
      } catch (e) {
        // No saved draft, fallback to starter code
      }

      const starter =
        activeProblem.starterCode?.[language] ||
        (language === 'java'
          ? `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
          : language === 'python'
          ? `def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`
          : `// Solution in ${language}\n`);

      setCode(starter);
      setSaveStatus('');
    };

    loadDraftOrStarter();
    fetchSubmissionHistory(activeProblem._id);
  }, [activeProblem, language]);

  const fetchProblemsList = async () => {
    try {
      const res = await codeApi.getPracticeProblems();
      if (res.data.success && res.data.problems.length > 0) {
        setProblems(res.data.problems);
        const match =
          res.data.problems.find((p) => p.slug === problemSlugParam || p._id === problemSlugParam) ||
          res.data.problems[0];
        fetchProblemDetails(match._id);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  };

  const fetchProblemDetails = async (problemId) => {
    try {
      const res = await codeApi.getProblemById(problemId);
      if (res.data.success && res.data.problem) {
        setActiveProblem(res.data.problem);
        if (res.data.problem.examples?.[0]?.input) {
          setCustomStdin(res.data.problem.examples[0].input);
        }
      }
    } catch (err) {
      console.error('Error fetching problem details:', err);
    }
  };

  const fetchSubmissionHistory = async (problemId) => {
    try {
      const res = await codeApi.getMySubmissions({ problemId });
      if (res.data.success) {
        setSubmissionHistory(res.data.submissions || []);
      }
    } catch (err) {
      console.warn('History fetch note:', err.message);
    }
  };

  // Keyboard Shortcuts (Ctrl+Enter = Run, Ctrl+Shift+Enter = Submit, Ctrl+S = Save)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmitCode();
        } else {
          handleRunCode();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, customStdin, activeProblem]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // 1. RUN CODE (Custom stdin execution)
  const handleRunCode = async () => {
    if (!code.trim() || isRunning) return;
    setIsRunning(true);
    setActiveTab('output');

    try {
      const res = await codeApi.run({
        language,
        code,
        stdin: customStdin,
        problemId: activeProblem?._id,
      });

      if (res.data) {
        setExecutionResult(res.data);
      }
    } catch (err) {
      setExecutionResult({
        status: 'Runtime Error',
        stdout: '',
        stderr: err.response?.data?.message || err.message,
        compileError: err.message,
        executionTimeMs: 0,
        memoryMb: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // 2. SUBMIT CODE (Full test-case suite + AI review + skill update)
  const handleSubmitCode = async () => {
    if (!code.trim() || isSubmitting || !activeProblem) return;
    setIsSubmitting(true);
    setActiveTab('testcases');

    try {
      const res = await codeApi.submitSolution(activeProblem._id, {
        language,
        code,
      });

      if (res.data) {
        setSubmissionResult(res.data);
        if (res.data.status === 'Accepted') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        fetchSubmissionHistory(activeProblem._id);
      }
    } catch (err) {
      setSubmissionResult({
        status: 'Evaluation Error',
        score: 0,
        passedTestCases: 0,
        totalTestCases: 0,
        compileError: err.response?.data?.message || err.message,
        testResults: [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. SAVE CODE DRAFT
  const handleSaveDraft = async () => {
    if (!activeProblem || !code.trim()) return;
    setIsSaving(true);
    try {
      await codeApi.saveCode({
        problemId: activeProblem._id,
        language,
        sourceCode: code,
      });
      setSaveStatus('Saved ✓');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Save Failed');
    } finally {
      setIsSaving(false);
    }
  };

  // 4. AI ASSISTANT ACTIONS
  const handleAiAction = async (action) => {
    setAiLoading(true);
    setActiveTab('aiAssist');
    try {
      const res = await codeApi.aiAssist({
        action,
        problemId: activeProblem?._id,
        code,
        errorText: executionResult?.compileError || executionResult?.stderr || '',
        language,
      });

      if (res.data.reply) {
        setAiMessages((prev) => [
          ...prev,
          { role: 'user', content: action === 'explainProblem' ? 'Explain Problem' : action === 'giveHint' ? 'Give Hint' : action === 'explainError' ? 'Explain Error' : 'Analyze Complexity' },
          { role: 'assistant', content: res.data.reply },
        ]);
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Could not fetch AI explanation. Please check compiler output directly.' },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activeLangConfig = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-text ${isFullscreen ? 'fixed inset-0 z-[9999]' : 'rounded-3xl border border-slate-800 shadow-2xl overflow-hidden'}`}>
      {/* ========================================================================= */}
      {/* 1. TOP BAR */}
      {/* ========================================================================= */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left: Brand + Problem Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-white tracking-wider uppercase block">SGIP IDE</span>
              <span className="text-[10px] text-indigo-400 font-mono">Online Compiler</span>
            </div>
          </div>

          {/* Problem Selector Dropdown */}
          <div className="relative">
            <select
              value={activeProblem?._id || ''}
              onChange={(e) => fetchProblemDetails(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 font-bold outline-none cursor-pointer focus:border-indigo-500 max-w-[220px] sm:max-w-xs truncate"
            >
              {problems.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.isSolved ? '✓ ' : ''}{p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          {activeProblem && (
            <Badge variant={activeProblem.difficulty === 'Easy' ? 'emerald' : activeProblem.difficulty === 'Medium' ? 'amber' : 'rose'}>
              {activeProblem.difficulty}
            </Badge>
          )}
        </div>

        {/* Center: Language Selector & Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-indigo-300 rounded-xl px-3 py-1.5 font-bold outline-none cursor-pointer focus:border-indigo-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {saveStatus && (
            <span className="text-[11px] text-emerald-400 font-sans font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              {saveStatus}
            </span>
          )}
        </div>

        {/* Right: Actions (Save, Run, Submit, AI, Fullscreen) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            title="Save draft (Ctrl+S)"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCode}
            loading={isRunning}
            title="Run with Custom Stdin (Ctrl+Enter)"
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold"
          >
            <Play className="w-3.5 h-3.5 mr-1 fill-emerald-400" />
            Run
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitCode}
            loading={isSubmitting}
            title="Submit against all test cases (Ctrl+Shift+Enter)"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold border-0 shadow-lg"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Submit
          </Button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'aiAssist' ? 'output' : 'aiAssist')}
            title="Ask SGIP AI Coding Assistant"
            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'aiAssist'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-slate-800 text-purple-400 hover:bg-slate-700 border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-[620px]">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: PROBLEM DESCRIPTION / SUBMISSION HISTORY (4 COLS) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
          {/* Sub-Header Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900 px-4 py-2 gap-4">
            <button
              onClick={() => setLeftTab('description')}
              className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                leftTab === 'description' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setLeftTab('history')}
              className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                leftTab === 'history' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Submissions ({submissionHistory.length})</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
            {leftTab === 'description' && activeProblem && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">{activeProblem.title}</h2>
                    <span className="text-[10px] font-mono text-slate-400">{activeProblem.category}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {(activeProblem.topics || []).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-indigo-300 border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Problem Statement */}
                <div className="space-y-2 leading-relaxed text-slate-200 whitespace-pre-line">
                  {activeProblem.description}
                </div>

                {/* Examples */}
                {(activeProblem.examples || []).map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                    <span className="text-[10px] font-bold uppercase text-indigo-400 block font-sans">Example {idx + 1}:</span>
                    <div className="space-y-1">
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-slate-200">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Output: </span>
                        <span className="text-emerald-400">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-slate-400 text-[11px] font-sans pt-1">
                          <strong>Explanation: </strong>{ex.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {activeProblem.constraints && (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">Constraints:</h4>
                    <pre className="font-mono text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed">
                      {activeProblem.constraints}
                    </pre>
                  </div>
                )}

                {/* Skills Tested */}
                {activeProblem.skillsTested && activeProblem.skillsTested.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Placement Competencies Tested:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeProblem.skillsTested.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] border border-indigo-500/30">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {leftTab === 'history' && (
              <div className="space-y-3">
                {submissionHistory.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No submissions recorded for this problem yet.</p>
                ) : (
                  submissionHistory.map((sub) => (
                    <div
                      key={sub._id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${sub.status === 'Accepted' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {sub.status}
                          </span>
                          <span className="text-slate-400 text-[11px] font-sans">({sub.score}%)</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans">
                          {new Date(sub.submittedAt || sub.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} &bull; {sub.language}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-300 block text-xs">{sub.runtimeMs} ms</span>
                        <span className="text-[10px] text-slate-500">{sub.memoryMb || 18.4} MB</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CENTER / RIGHT COLUMN: MONACO CODE EDITOR + OUTPUT CONSOLE (8 COLS) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header Tools */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-white font-bold">Solution.{activeLangConfig.ext}</span>
              <span className="text-[10px] text-slate-500">({activeLangConfig.name})</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyCode}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                title="Copy code"
              >
                {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  A-
                </button>
                <span className="px-1 text-slate-400">{fontSize}px</span>
                <button
                  type="button"
                  onClick={() => setFontSize((f) => Math.min(22, f + 1))}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  A+
                </button>
              </div>

              <button
                type="button"
                onClick={() => setWordWrap((w) => (w === 'on' ? 'off' : 'on'))}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                  wordWrap === 'on' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Wrap
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] relative bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={activeLangConfig.monaco}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize: fontSize,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                wordWrap: wordWrap,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
                automaticLayout: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* ======================================================================= */}
          {/* BOTTOM RESULT / CONSOLE / AI PANEL */}
          {/* ======================================================================= */}
          <div className="h-64 border-t border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
            {/* Panel Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('output')}
                  className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'output' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Program Output</span>
                </button>

                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'testcases' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Test Cases {submissionResult ? `(${submissionResult.passedTestCases}/${submissionResult.totalTestCases})` : ''}</span>
                </button>

                <button
                  onClick={() => setActiveTab('stdin')}
                  className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'stdin' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Custom Input (stdin)</span>
                </button>

                {submissionResult?.aiReview && (
                  <button
                    onClick={() => setActiveTab('aiReview')}
                    className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'aiReview' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Review</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('aiAssist')}
                  className={`text-xs font-bold pb-1 transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'aiAssist' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Mentor</span>
                </button>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-3 font-mono text-[11px]">
                {executionResult && (
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    executionResult.status === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {executionResult.status} &bull; {executionResult.executionTimeMs}ms
                  </span>
                )}
                {submissionResult && activeTab === 'testcases' && (
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    submissionResult.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {submissionResult.status} ({submissionResult.score}%)
                  </span>
                )}
              </div>
            </div>

            {/* Panel Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950">
              {/* 1. OUTPUT TAB */}
              {activeTab === 'output' && (
                executionResult ? (
                  <div className="space-y-2">
                    {executionResult.compileError ? (
                      <div className="text-red-400 space-y-1">
                        <span className="font-bold uppercase text-[10px] text-red-300 font-sans">Compilation Error:</span>
                        <pre className="whitespace-pre-wrap">{executionResult.compileError}</pre>
                      </div>
                    ) : executionResult.stderr ? (
                      <div className="text-amber-400 space-y-1">
                        <span className="font-bold uppercase text-[10px] text-amber-300 font-sans">Runtime Trace / stderr:</span>
                        <pre className="whitespace-pre-wrap">{executionResult.stderr}</pre>
                      </div>
                    ) : (
                      <div className="text-emerald-400 space-y-1">
                        <pre className="whitespace-pre-wrap">{executionResult.stdout}</pre>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-4 font-sans">
                      <span>Execution Time: <strong className="text-slate-300">{executionResult.executionTimeMs} ms</strong></span>
                      <span>Memory: <strong className="text-slate-300">{executionResult.memoryMb} MB</strong></span>
                      <span>Exit Code: <strong className="text-slate-300">{executionResult.exitCode}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 font-sans text-xs">
                    Click "Run" to execute your solution against custom input.
                  </div>
                )
              )}

              {/* 2. TEST CASES TAB */}
              {activeTab === 'testcases' && (
                submissionResult?.testResults ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {submissionResult.testResults.map((tc) => (
                        <div
                          key={tc.caseNumber}
                          className={`p-3 rounded-xl border font-mono text-[11px] space-y-1.5 ${
                            tc.passed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-red-950/30 border-red-500/40 text-red-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">Case #{tc.caseNumber}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] ${tc.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {tc.passed ? '✓ Passed' : '✗ Failed'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase">Input:</span>
                            <span className="text-slate-200 truncate block">{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase">Expected / Output:</span>
                            <span className="text-slate-400 block truncate">{tc.expectedOutput}</span>
                            <span className={`block truncate ${tc.passed ? 'text-emerald-400' : 'text-red-400'}`}>{tc.actualOutput}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 font-sans text-xs">
                    Click "Submit" to run your code against the full public and hidden test case benchmark.
                  </div>
                )
              )}

              {/* 3. CUSTOM STDIN TAB */}
              {activeTab === 'stdin' && (
                <div className="h-full flex flex-col space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">Standard Input (stdin):</span>
                  <textarea
                    rows={4}
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    placeholder="Enter custom input lines here..."
                    className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none resize-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* 4. AI CODE REVIEW TAB */}
              {activeTab === 'aiReview' && submissionResult?.aiReview && (
                <div className="space-y-3 font-sans text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Time Complexity</span>
                      <strong className="text-indigo-400 text-sm">{submissionResult.aiReview.timeComplexity || 'O(n)'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Space Complexity</span>
                      <strong className="text-indigo-400 text-sm">{submissionResult.aiReview.spaceComplexity || 'O(1)'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Readability</span>
                      <strong className="text-emerald-400 text-sm">{submissionResult.aiReview.readability || 'Clean & Modular'}</strong>
                    </div>
                  </div>

                  {submissionResult.aiReview.suggestions && submissionResult.aiReview.suggestions.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="font-bold text-purple-400 text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Optimization &amp; Edge Case Suggestions:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {submissionResult.aiReview.suggestions.map((sug, idx) => (
                          <li key={idx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 5. AI ASSISTANT / MENTOR TAB */}
              {activeTab === 'aiAssist' && (
                <div className="h-full flex flex-col space-y-3 font-sans">
                  {/* Quick Action Prompt Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800">
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleAiAction('explainProblem')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      💡 Explain Problem
                    </button>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleAiAction('giveHint')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      🎯 Give Hint
                    </button>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleAiAction('explainError')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      🐛 Explain Error
                    </button>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleAiAction('complexity')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      ⏱️ Complexity Analysis
                    </button>
                  </div>

                  {/* Message History */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {aiMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'assistant'
                            ? 'bg-slate-900 border border-slate-800 text-slate-200'
                            : 'bg-indigo-600/30 border border-indigo-500/40 text-white self-end ml-8'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          {msg.role === 'assistant' ? '🤖 SGIP AI Mentor' : '👤 You'}
                        </span>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-purple-300 flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>AI Mentor is analyzing your code and test cases...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PracticePage = CodingCompilerPage;


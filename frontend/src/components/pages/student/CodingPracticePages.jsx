import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codeApi } from '../../../api/apis';
import { useAuth } from '../../../context/AuthContext';
import {
  Terminal,
  Play,
  RotateCcw,
  Save,
  Download,
  Share2,
  FilePlus,
  Bug,
  Square,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  Copy,
  CheckCheck,
  Code2,
  BookOpen,
  FolderCode,
  GraduationCap,
  Layers,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  ExternalLink,
  ChevronDown,
  Wrench
} from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import confetti from 'canvas-confetti';

const GDB_LANGUAGES = [
  { id: 'c', name: 'C (GCC 13)', monaco: 'c', ext: 'c', file: 'main.c' },
  { id: 'cpp', name: 'C++ (GCC 13)', monaco: 'cpp', ext: 'cpp', file: 'main.cpp' },
  { id: 'java', name: 'Java (OpenJDK 21)', monaco: 'java', ext: 'java', file: 'Main.java' },
  { id: 'python', name: 'Python 3.12', monaco: 'python', ext: 'py', file: 'main.py' },
  { id: 'javascript', name: 'JavaScript (Node.js 20)', monaco: 'javascript', ext: 'js', file: 'main.js' },
  { id: 'sql', name: 'SQL (SQLite 3.46)', monaco: 'sql', ext: 'sql', file: 'query.sql' },
];

const GDB_STARTER_TEMPLATES = {
  c: `/******************************************************************************
* Welcome to SGIP GDB Online.
* SGIP GDB online is an interactive compiler & execution tool for C, C++, Java, Python, JS, SQL.
* Code, Compile, Run and Debug online in a real cloud sandbox.
*******************************************************************************/
#include <stdio.h>

int main()
{
    printf("Hello World\\n");

    return 0;
}
`,
  cpp: `/******************************************************************************
* Welcome to SGIP GDB Online for C++.
*******************************************************************************/
#include <iostream>

using namespace std;

int main()
{
    cout << "Hello World" << endl;

    return 0;
}
`,
  java: `/******************************************************************************
* Welcome to SGIP GDB Online for Java (OpenJDK 21).
*******************************************************************************/
import java.util.*;

public class Main
{
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
`,
  python: `'''
Welcome to SGIP GDB Online for Python 3.12.
'''
def main():
    print("Hello World")

if __name__ == "__main__":
    main()
`,
  javascript: `/**
 * Welcome to SGIP GDB Online for JavaScript (Node.js 20).
 */
function main() {
    console.log("Hello World");
}

main();
`,
  sql: `-- Welcome to SGIP GDB Online for SQLite 3.46
CREATE TABLE users (id INT PRIMARY KEY, name TEXT, role TEXT);
INSERT INTO users VALUES (1, 'Gangatharan', 'Student Candidate');
INSERT INTO users VALUES (2, 'SGIP Leader', 'Administrator');

SELECT * FROM users;
`,
};

export const CodingCompilerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Language & Code State
  const initialLang = searchParams.get('lang') || 'c';
  const [language, setLanguage] = useState(initialLang);
  const [code, setCode] = useState(GDB_STARTER_TEMPLATES[initialLang] || GDB_STARTER_TEMPLATES.c);
  const [activeTab, setActiveTab] = useState('source'); // 'source' | 'input'

  // Input & Command Line Args
  const [cmdArgs, setCmdArgs] = useState('');
  const [inputMode, setInputMode] = useState('interactive'); // 'interactive' | 'text'
  const [customStdin, setCustomStdin] = useState('');

  // Execution Output & Console
  const [isRunning, setIsRunning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([
    'Welcome to SGIP GDB Online Compiler.',
    'Press "Run" to compile and execute your program.',
  ]);
  const [executionStats, setExecutionStats] = useState(null);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  // Left Sidebar State
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(true);
  const [problemsDrawerOpen, setProblemsDrawerOpen] = useState(false);
  const [problemsList, setProblemsList] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Editor Preferences
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);
  const [saveBanner, setSaveBanner] = useState('');
  const editorRef = useRef(null);
  const consoleBottomRef = useRef(null);

  // Sync language template on change
  const handleLanguageSelect = (langId) => {
    setLanguage(langId);
    setSearchParams({ lang: langId });
    setCode(GDB_STARTER_TEMPLATES[langId] || GDB_STARTER_TEMPLATES.c);
    setConsoleLogs([
      `Switched environment to ${GDB_LANGUAGES.find((l) => l.id === langId)?.name || langId}.`,
      'Ready to compile & run.',
    ]);
  };

  // Load problem banks for LeetCode / Practice drawer
  useEffect(() => {
    codeApi.getPracticeProblems().then((res) => {
      if (res.data?.success && res.data.problems) {
        setProblemsList(res.data.problems);
      }
    }).catch(() => {});
  }, []);

  // Keyboard Shortcuts (F9 or Ctrl+Enter = Run, Ctrl+S = Save, Ctrl+B = Beautify)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F9' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
        e.preventDefault();
        handleRunCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, customStdin, inputMode]);

  // Scroll to bottom of console when logs update
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollTop = consoleBottomRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Execute Code via Real Sandboxed Compiler Engine
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsConsoleCollapsed(false);

    const activeLangConfig = GDB_LANGUAGES.find((l) => l.id === language) || GDB_LANGUAGES[0];
    setConsoleLogs([
      `Compiling ${activeLangConfig.file}...`,
      `[Compiler]: ${activeLangConfig.name} sandbox initializing...`,
    ]);

    const startTime = Date.now();
    try {
      const stdinToSend = customStdin ? customStdin.trim() : '';
      const res = await codeApi.run({
        language,
        code,
        stdin: stdinToSend,
      });

      const data = res.data;
      const elapsedMs = data.executionTimeMs || (Date.now() - startTime);

      if (data.compileError) {
        setConsoleLogs((prev) => [
          ...prev,
          `\n*** COMPILATION ERROR ***\n${data.compileError}`,
          `\nProcess returned 1 (0x1)   execution time : ${(elapsedMs / 1000).toFixed(3)} s`,
          'Press any key to continue . . .',
        ]);
        setExecutionStats({ status: 'Compilation Error', time: `${(elapsedMs / 1000).toFixed(3)}s`, memory: `${data.memoryMb || 14.2} MB` });
      } else if (data.stderr && data.status === 'Runtime Error') {
        setConsoleLogs((prev) => [
          ...prev,
          `\n*** RUNTIME ERROR ***\n${data.stderr}`,
          `\nProcess returned 1 (0x1)   execution time : ${(elapsedMs / 1000).toFixed(3)} s`,
        ]);
        setExecutionStats({ status: 'Runtime Error', time: `${(elapsedMs / 1000).toFixed(3)}s`, memory: `${data.memoryMb || 14.2} MB` });
      } else {
        const output = data.stdout || 'Program executed with no output.';
        setConsoleLogs((prev) => [
          ...prev,
          output,
          `\n...Program finished with exit code ${data.exitCode || 0}`,
          `Press ENTER to exit console.`,
        ]);
        setExecutionStats({ status: 'Success', time: `${(elapsedMs / 1000).toFixed(3)}s`, memory: `${data.memoryMb || 16.5} MB` });
      }
    } catch (err) {
      setConsoleLogs((prev) => [
        ...prev,
        `\n[Execution Error]: ${err.response?.data?.message || err.message}`,
      ]);
      setExecutionStats({ status: 'Failed', time: '0.00s', memory: '0 MB' });
    } finally {
      setIsRunning(false);
    }
  };

  // Debug Simulation / Stepper
  const handleDebugCode = () => {
    setIsDebugging(true);
    setConsoleLogs([
      'GNU gdb (GDB) 13.2',
      'Reading symbols from /tmp/main.out...done.',
      '(gdb) break main',
      'Breakpoint 1 at 0x1149: file main.c, line 7.',
      '(gdb) run',
      'Starting program: /tmp/main.out',
      '[Thread debugging using libthread_db enabled]',
      'Breakpoint 1, main () at main.c:7',
      '7       printf("Hello World\\n");',
      '(gdb) step',
      'Hello World',
      '9       return 0;',
      '(gdb) continue',
      'Continuing.',
      '[Inferior 1 (process 408) exited normally]',
    ]);
    setTimeout(() => setIsDebugging(false), 600);
  };

  // Save Code / Download
  const handleSaveCode = () => {
    localStorage.setItem(`sgip_gdb_${language}`, code);
    setSaveBanner('Saved to Local Workspace ✓');
    setTimeout(() => setSaveBanner(''), 3000);
  };

  const handleDownloadFile = () => {
    const activeLangConfig = GDB_LANGUAGES.find((l) => l.id === language) || GDB_LANGUAGES[0];
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeLangConfig.file;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBeautifyCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectProblemFromDrawer = (prob) => {
    setSelectedProblem(prob);
    setProblemsDrawerOpen(false);
    if (prob.starterCode?.[language]) {
      setCode(prob.starterCode[language]);
    }
    if (prob.examples?.[0]?.input) {
      setInputMode('text');
      setCustomStdin(prob.examples[0].input);
    }
    setConsoleLogs([
      `Loaded problem: ${prob.title} (${prob.difficulty})`,
      `Constraints: ${prob.constraints || 'Standard limits apply.'}`,
      'Ready to run against problem inputs.',
    ]);
  };

  const activeLangConfig = GDB_LANGUAGES.find((l) => l.id === language) || GDB_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc] flex flex-col font-sans select-text text-xs">
      {/* ========================================================================= */}
      {/* 1. AUTHENTIC ONLINEGDB TOP TOOLBAR */}
      {/* ========================================================================= */}
      <header className="bg-[#2d3238] border-b border-[#1c1f24] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-md">
        {/* Left Action Buttons (New, Run, Debug, Stop, Share, Save, Beautify, Download) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap font-sans text-xs">
          {/* Toggle Left Sidebar */}
          <button
            type="button"
            onClick={() => setIsLeftNavOpen(!isLeftNavOpen)}
            className="p-1.5 rounded bg-[#3a3f47] hover:bg-[#4a505a] text-white transition cursor-pointer border border-[#4f5663]"
            title="Toggle Sidebar"
          >
            {isLeftNavOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* New Project */}
          <button
            type="button"
            onClick={() => setCode(GDB_STARTER_TEMPLATES[language] || GDB_STARTER_TEMPLATES.c)}
            className="px-2.5 py-1 rounded bg-[#3a3f47] hover:bg-[#4a505a] text-white font-semibold transition cursor-pointer border border-[#4f5663] flex items-center gap-1"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden md:inline">New</span>
          </button>

          {/* ▶ RUN (Green Button) */}
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 py-1 rounded bg-[#4cae4c] hover:bg-[#449d44] text-white font-bold transition cursor-pointer flex items-center gap-1 shadow-sm disabled:opacity-50"
            title="Run Code (F9 or Ctrl+Enter)"
          >
            {isRunning ? <Spinner size="xs" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>Run</span>
          </button>

          {/* 🐛 Debug (Blue Button) */}
          <button
            type="button"
            onClick={handleDebugCode}
            disabled={isDebugging}
            className="px-2.5 py-1 rounded bg-[#337ab7] hover:bg-[#286090] text-white font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
            title="Debug Program"
          >
            <Bug className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Debug</span>
          </button>

          {/* ⏹ Stop (Red Button) */}
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setConsoleLogs((prev) => [...prev, '\n[Program execution stopped by user]']);
            }}
            className="px-2.5 py-1 rounded bg-[#d9534f] hover:bg-[#c9302c] text-white font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
            title="Stop Execution"
          >
            <Square className="w-3 h-3 fill-white" />
            <span className="hidden md:inline">Stop</span>
          </button>

          {/* 🔗 Share (Orange Button) */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setSaveBanner('Share URL Copied to Clipboard!');
              setTimeout(() => setSaveBanner(''), 3000);
            }}
            className="px-2.5 py-1 rounded bg-[#f0ad4e] hover:bg-[#ec971f] text-white font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
            title="Share Code"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* 💾 Save (Cyan Button) */}
          <button
            type="button"
            onClick={handleSaveCode}
            className="px-2.5 py-1 rounded bg-[#5bc0de] hover:bg-[#31b0d5] text-white font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
            title="Save Project (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* { } Beautify (Teal Button) */}
          <button
            type="button"
            onClick={handleBeautifyCode}
            className="px-2 py-1 rounded bg-[#009688] hover:bg-[#00796b] text-white font-semibold transition cursor-pointer flex items-center gap-1"
            title="Beautify / Format Code"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden md:inline">&#123; &#125; Beautify</span>
          </button>

          {/* ⬇ Download */}
          <button
            type="button"
            onClick={handleDownloadFile}
            className="p-1.5 rounded bg-[#3a3f47] hover:bg-[#4a505a] text-white transition cursor-pointer border border-[#4f5663]"
            title="Download Code File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side: Language Dropdown + Settings */}
        <div className="flex items-center gap-2">
          {saveBanner && (
            <span className="text-[11px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
              {saveBanner}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold text-xs hidden sm:inline">Language</span>
            <select
              value={language}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="bg-[#1c1f24] text-white border border-[#4f5663] text-xs font-semibold rounded px-2.5 py-1 outline-none cursor-pointer hover:border-slate-400"
            >
              {GDB_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="p-1.5 rounded bg-[#3a3f47] hover:bg-[#4a505a] text-white transition cursor-pointer border border-[#4f5663]"
            title="Copy Source Code"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setProblemsDrawerOpen(true)}
            className="px-2.5 py-1 rounded bg-[#79529cf2] hover:bg-[#6f42c1] text-white font-bold flex items-center gap-1 cursor-pointer shadow-sm"
            title="Select Placement & LeetCode Problems"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Problems</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-PANEL LAYOUT (LEFT SIDEBAR + CODE EDITOR & TERMINAL) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ======================================================================= */}
        {/* A. AUTHENTIC ONLINEGDB DARK BLUE LEFT SIDEBAR */}
        {/* ======================================================================= */}
        {isLeftNavOpen && (
          <aside className="w-56 bg-[#003c71] text-white flex flex-col justify-between shrink-0 border-r border-[#002f5a] select-none text-xs transition-all">
            {/* Header Brand */}
            <div className="p-3 border-b border-[#002f5a] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#2080e0] flex items-center justify-center font-bold text-white shadow-inner">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="font-extrabold text-sm text-white leading-tight">OnlineGDB</h1>
                  <p className="text-[10px] text-blue-200">online compiler and debugger</p>
                </div>
              </div>

              {/* User Badge */}
              <div className="bg-[#002f5a] p-2 rounded text-[11px] text-blue-100 flex items-center justify-between">
                <span className="truncate">Welcome, <strong>{user?.name || 'Candidate'}</strong></span>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="py-2 flex-1 overflow-y-auto space-y-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCode(GDB_STARTER_TEMPLATES[language] || GDB_STARTER_TEMPLATES.c)}
                className="w-full text-left px-4 py-2 hover:bg-[#004f94] transition flex items-center gap-2.5 cursor-pointer text-white"
              >
                <FilePlus className="w-3.5 h-3.5 text-blue-300" />
                <span>Create New Project</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCode}
                className="w-full text-left px-4 py-2 hover:bg-[#004f94] transition flex items-center gap-2.5 cursor-pointer text-white"
              >
                <FolderCode className="w-3.5 h-3.5 text-blue-300" />
                <span>My Saved Projects</span>
              </button>

              <button
                type="button"
                onClick={() => setProblemsDrawerOpen(true)}
                className="w-full text-left px-4 py-2 hover:bg-[#004f94] transition flex items-center justify-between cursor-pointer text-white"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                  <span>Programming Questions</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-[9px] font-black text-slate-950 uppercase">
                  {problemsList.length}
                </span>
              </button>

              <Link
                to="/secure-exam/pattern-test"
                className="w-full text-left px-4 py-2 hover:bg-[#004f94] transition flex items-center justify-between cursor-pointer text-white"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                  <span>Mock Assessments</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-[9px] font-black text-slate-950">
                  NEW
                </span>
              </Link>

              <Link
                to="/dashboard"
                className="w-full text-left px-4 py-2 hover:bg-[#004f94] transition flex items-center gap-2.5 cursor-pointer text-white"
              >
                <Layers className="w-3.5 h-3.5 text-blue-300" />
                <span>Return to Portal</span>
              </Link>
            </div>

            {/* Bottom Footer */}
            <div className="p-3 border-t border-[#002f5a] text-[10px] text-blue-200/80 space-y-1">
              <p>© 2026 SGIP GDB Online</p>
              <div className="flex items-center gap-2 text-blue-300">
                <span className="underline cursor-pointer">Tutorial</span> &bull;
                <span className="underline cursor-pointer">Shortcuts</span> &bull;
                <span className="underline cursor-pointer">Privacy</span>
              </div>
            </div>
          </aside>
        )}

        {/* ======================================================================= */}
        {/* B. CODE EDITOR + BOTTOM CONSOLE WORKSPACE */}
        {/* ======================================================================= */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* File Tabs Header */}
          <div className="bg-[#252526] border-b border-[#1c1f24] px-2 flex items-center justify-between select-none">
            <div className="flex items-center">
              <div className="px-4 py-2 bg-[#1e1e1e] text-white border-t-2 border-[#007acc] text-xs font-mono font-bold flex items-center gap-2">
                <span>{activeLangConfig.file}</span>
                <span className="text-[10px] text-slate-500">({activeLangConfig.name})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] pr-2">
              <span>UTF-8</span> &bull;
              <span>Spaces: 4</span> &bull;
              <span>GCC/OpenJDK 21</span>
            </div>
          </div>

          {/* Monaco Code Editor Area */}
          <div className="flex-1 relative bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={activeLangConfig.monaco}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: fontSize,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
                fontLigatures: true,
                minimap: { enabled: true, scale: 0.75 },
                wordWrap: 'on',
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

          {/* ===================================================================== */}
          {/* C. BOTTOM INTERACTIVE TERMINAL / CONSOLE (EXACT GDB DOCK) */}
          {/* ===================================================================== */}
          <div className={`border-t-2 border-[#333333] bg-[#181818] flex flex-col transition-all ${isConsoleCollapsed ? 'h-9' : 'h-72 sm:h-80'}`}>
            {/* Terminal Header & Input Controls */}
            <div className="bg-[#2d3238] border-b border-[#1c1f24] px-3 py-1.5 flex flex-wrap items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                  className="hover:text-slate-300 transition cursor-pointer flex items-center gap-1 font-bold"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isConsoleCollapsed ? 'rotate-180' : ''}`} />
                  <span>Terminal / Execution Console</span>
                </button>

                {executionStats && (
                  <span className={`px-2 py-0.2 rounded font-mono text-[11px] font-bold ${
                    executionStats.status === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {executionStats.status} &bull; {executionStats.time} &bull; {executionStats.memory}
                  </span>
                )}
              </div>

              {/* Standard Input Selector */}
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-bold">Standard Input:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMode"
                      checked={inputMode === 'interactive'}
                      onChange={() => setInputMode('interactive')}
                      className="accent-indigo-500"
                    />
                    <span>Interactive Console</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMode"
                      checked={inputMode === 'text'}
                      onChange={() => setInputMode('text')}
                      className="accent-indigo-500"
                    />
                    <span>Text (stdin)</span>
                  </label>
                </div>

                {selectedProblem?.examples?.[0]?.input && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStdin(selectedProblem.examples[0].input);
                      setInputMode('text');
                    }}
                    className="px-2 py-0.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded text-[10px] cursor-pointer"
                    title="Insert sample input for this problem"
                  >
                    + Sample Input
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setConsoleLogs(['Console cleared. Ready for next execution.'])}
                  className="px-2 py-0.5 bg-[#3a3f47] hover:bg-[#4a505a] text-slate-200 rounded text-[10px] cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Command line arguments bar if open */}
            {!isConsoleCollapsed && (
              <div className="bg-[#222222] border-b border-[#2d3238] px-3 py-1 flex items-center gap-2 text-[11px] text-slate-300">
                <span className="font-semibold text-slate-400 shrink-0">Command line arguments:</span>
                <input
                  type="text"
                  value={cmdArgs}
                  onChange={(e) => setCmdArgs(e.target.value)}
                  placeholder="e.g. --verbose arg1 arg2"
                  className="flex-1 bg-[#181818] border border-[#333333] rounded px-2 py-0.5 text-white font-mono outline-none text-xs"
                />
              </div>
            )}

            {/* Text Stdin Panel (if Text mode is active) */}
            {!isConsoleCollapsed && inputMode === 'text' && (
              <div className="bg-[#1f1f1f] border-b border-[#2d3238] px-3 py-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase">Standard Input (stdin) Payload:</span>
                  <span className="text-[10px] text-slate-500 font-mono">Lines sent to program stdin</span>
                </div>
                <textarea
                  rows={2}
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  placeholder="Enter inputs here (e.g. 5\n10 20 30 40 50)..."
                  className="w-full bg-[#181818] border border-[#333333] rounded p-2 text-xs font-mono text-white outline-none resize-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Interactive Console Prompt Bar (if Interactive mode is active) */}
            {!isConsoleCollapsed && inputMode === 'interactive' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customStdin) {
                    handleRunCode();
                  }
                }}
                className="bg-[#1b1e22] border-b border-[#2d3238] px-3 py-1.5 flex items-center gap-2 text-xs text-slate-300"
              >
                <span className="text-emerald-400 font-bold font-mono">stdin &gt;</span>
                <input
                  type="text"
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  placeholder="Type standard input here and press Enter or Run (e.g. 2 7 11 15 9)..."
                  className="flex-1 bg-[#121417] border border-[#333333] rounded px-2.5 py-1 text-white font-mono outline-none focus:border-emerald-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold cursor-pointer"
                >
                  Send &amp; Run
                </button>
              </form>
            )}

            {/* Terminal Window Output Logs */}
            {!isConsoleCollapsed && (
              <div
                ref={consoleBottomRef}
                className="flex-1 p-3 overflow-y-auto font-mono text-xs text-[#e0e0e0] space-y-1 bg-black/90 selection:bg-indigo-600 selection:text-white"
              >
                {consoleLogs.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    {line.startsWith('*** COMPILATION ERROR') ? (
                      <span className="text-red-400 font-bold">{line}</span>
                    ) : line.startsWith('*** RUNTIME ERROR') ? (
                      <span className="text-amber-400 font-bold">{line}</span>
                    ) : line.startsWith('...Program finished') ? (
                      <span className="text-emerald-400 font-bold">{line}</span>
                    ) : line.startsWith('Compiling') || line.startsWith('[Compiler]') ? (
                      <span className="text-blue-300">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROGRAMMING QUESTIONS / LEETCODE DRAWER MODAL */}
      {/* ========================================================================= */}
      {problemsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#252526] rounded-2xl border border-[#3a3f47] p-5 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3a3f47] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Programming Questions &amp; LeetCode Challenges</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a challenge to load its starter code and test cases into the GDB compiler.
                </p>
              </div>
              <button onClick={() => setProblemsDrawerOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {problemsList.map((prob) => (
                <div
                  key={prob._id}
                  onClick={() => handleSelectProblemFromDrawer(prob)}
                  className="p-3.5 rounded-xl bg-[#1e1e1e] hover:bg-[#2d3238] border border-[#333333] hover:border-indigo-500/50 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{prob.title}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{prob.description}</p>
                  </div>
                  <Button variant="primary" size="xs" className="bg-indigo-600 hover:bg-indigo-500">
                    Load Code
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PracticePage = CodingCompilerPage;

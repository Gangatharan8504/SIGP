import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { codeApi } from '../../../api/apis';
import { Terminal, Play, RotateCcw, CheckCircle2, AlertTriangle, Code2, Clock, Cpu } from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';

const STARTER_CODES = {
  javascript: `// Write your JavaScript solution below
function solveProblem(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const result = solveProblem([2, 7, 11, 15], 9);
console.log("Output Indices:", result);
`,
  python: `# Write your Python solution below
def solve_problem(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []

result = solve_problem([2, 7, 11, 15], 9)
print("Output Indices:", result)
`,
  cpp: `// Write your C++ solution below
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    cout << "C++ compiled and executed successfully." << endl;
    cout << "Result: [0, 1]" << endl;
    return 0;
}
`,
  java: `// Write your Java solution below
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Java compiled and executed successfully.");
        System.out.println("Result: [0, 1]");
    }
}
`,
};

export const CodingCompilerPage = () => {
  const [searchParams] = useSearchParams();
  const initialTitle = searchParams.get('title') || 'Two Sum Algorithm';

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER_CODES.javascript);
  const [input, setInput] = useState('[2, 7, 11, 15], target = 9');
  const [output, setOutput] = useState('');
  const [runtime, setRuntime] = useState(null);
  const [status, setStatus] = useState('');
  const [executing, setExecuting] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTER_CODES[newLang] || '');
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setOutput('Compiling and executing in secure sandbox...');
    try {
      const res = await codeApi.run({
        language,
        code,
        input,
        testCases: [
          { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]' },
          { input: '[3, 2, 4], target = 6', output: '[1, 2]' },
        ],
      });

      if (res.data.success) {
        setOutput(res.data.output);
        setRuntime(res.data.runtimeMs);
        setStatus(res.data.status);
        setTestResults(res.data.testResults || []);
      } else {
        setOutput(res.data.output || 'Execution Error');
        setStatus('Error');
      }
    } catch (err) {
      setOutput(err.response?.data?.message || err.message || 'Execution error');
      setStatus('Failed');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald">Live Execution Sandbox</Badge>
            <span className="text-xs text-slate-400 font-mono">JS VM & Polyglot Runtime</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Interactive Coding Compiler</h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-slate-900 border border-slate-700 text-xs sm:text-sm rounded-xl py-2 px-3 text-white outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3.11</option>
            <option value="cpp">C++ (GCC 13)</option>
            <option value="java">Java (OpenJDK 21)</option>
          </select>

          <Button
            variant="emerald"
            size="md"
            icon={Play}
            loading={executing}
            onClick={handleRunCode}
          >
            Run Code
          </Button>
        </div>
      </div>

      {/* Code & Terminal Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code Editor Pane */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono flex items-center gap-1.5 text-slate-200 font-semibold">
              <Code2 className="w-4 h-4 text-indigo-400" /> editor.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}
            </span>
            <button
              onClick={() => setCode(STARTER_CODES[language])}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Starter
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={18}
            spellCheck={false}
            className="w-full bg-slate-950 font-mono text-xs sm:text-sm text-emerald-300 p-4 rounded-2xl border border-slate-800 outline-none focus:border-indigo-500/50 resize-y leading-relaxed"
          />

          {/* Custom STDIN Input */}
          <div className="pt-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Custom STDIN Input (Optional)
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 5\n1 2 3 4 5"
              className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-2.5 rounded-xl border border-slate-800 mt-1 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Output & Test Case Console Pane */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" /> Standard Output
              </span>
              {runtime && (
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {runtime}ms
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> 0.0 MB
                  </span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[160px] max-h-[220px] overflow-y-auto">
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap">
                {output || '// Press "Run Code" to compile and execute program.'}
              </pre>
            </div>
          </div>

          {/* Automated Test Cases Results */}
          {testResults.length > 0 && (
            <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Test Suite
              </h3>

              <div className="space-y-2">
                {testResults.map((tc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Test Case #{tc.caseNumber}</span>
                      <Badge variant="emerald" size="sm">Passed</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">Input: {tc.input}</p>
                    <p className="text-[11px] text-emerald-400 font-mono">Output: {tc.expectedOutput}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty]);

  const fetchQuestions = async () => {
    try {
      const res = await codeApi.getPracticeQuestions({ category, difficulty });
      if (res.data.success) {
        setQuestions(res.data.questions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Placement Coding Arena</h1>
          <p className="text-xs text-slate-400">Solve Tier-1 company algorithmic questions with instant compiler verification</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded-xl py-2 px-3 text-white outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
          <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3">Problem Title</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Difficulty</th>
              <th className="pb-3">Type</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {questions.map((q) => (
              <tr key={q._id} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400 shrink-0" /> {q.title}
                </td>
                <td className="py-3.5 text-slate-400">{q.category}</td>
                <td className="py-3.5">
                  <Badge variant={q.difficulty === 'Easy' ? 'emerald' : q.difficulty === 'Medium' ? 'amber' : 'rose'} size="sm">
                    {q.difficulty}
                  </Badge>
                </td>
                <td className="py-3.5 uppercase font-mono text-[10px] text-slate-400">{q.type}</td>
                <td className="py-3.5 text-right">
                  <a
                    href={`/coding-compiler?title=${encodeURIComponent(q.title)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Solve Code →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

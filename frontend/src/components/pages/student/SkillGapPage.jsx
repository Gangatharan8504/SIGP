import React, { useState, useEffect } from 'react';
import { aiApi } from '../../../api/apis';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Brain, Target, Compass } from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import { ScoreGauge } from '../../common/ScoreGauge';
import { SkillRadarChart } from '../../charts/SkillCharts';
import { Link } from 'react-router-dom';

export const SkillGapPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await aiApi.getLatestSkillGap();
      if (res.data.success && res.data.analysis) {
        setAnalysis(res.data.analysis);
        setTargetRole(res.data.analysis.targetRole || 'Full Stack Software Engineer');
      } else {
        // Run initial analysis
        runAnalysis();
      }
    } catch (e) {
      runAnalysis();
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (selectedRole) => {
    setAnalyzing(true);
    try {
      const role = selectedRole || targetRole;
      const res = await aiApi.runSkillGap({ targetRole: role });
      if (res.data.success) {
        setAnalysis(res.data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setTargetRole(newRole);
    runAnalysis(newRole);
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Role Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo">Groq LLM Intelligence</Badge>
            <span className="text-xs text-slate-400 font-mono">Llama 3.3 70B</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">AI Skill Gap Diagnostic</h1>
          <p className="text-xs text-slate-400">Benchmarked against Tier-1 & Dream company technical hiring standards</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={targetRole}
            onChange={handleRoleChange}
            disabled={analyzing}
            className="bg-slate-900 border border-slate-700 text-xs sm:text-sm rounded-xl py-2 px-3 text-white outline-none focus:border-indigo-500 font-medium"
          >
            <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
            <option value="Backend & Distributed Systems">Backend & Distributed Systems</option>
            <option value="Frontend / UI Engineer">Frontend / UI Engineer</option>
            <option value="AI / ML Solutions Engineer">AI / ML Solutions Engineer</option>
            <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
          </select>

          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            loading={analyzing}
            onClick={() => runAnalysis()}
          >
            Re-Analyze
          </Button>
        </div>
      </div>

      {/* Main Analysis Summary Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Role Fit & Diagnostic Verdict</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {analysis?.roleFitSummary ||
              `Candidate demonstrates high proficiency in core frontend frameworks and algorithms. To reach the 90%+ readiness threshold for ${targetRole}, focus on closing gaps in system architecture, Docker containerization, and advanced tree/graph problems.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Role</span>
              <p className="text-xs font-bold text-white truncate mt-0.5">{analysis?.targetRole || targetRole}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Gap Percentage</span>
              <p className="text-xs font-bold text-emerald-300 mt-0.5">{analysis?.gapPercentage || 24}% Remaining</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Hiring Probability</span>
              <p className="text-xs font-bold text-indigo-300 mt-0.5">High for Tier-1</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-center">
          <ScoreGauge
            score={analysis?.readinessScore || 76}
            size={160}
            title="Readiness Score"
            subtitle={`${100 - (analysis?.readinessScore || 76)}% Gap to Close`}
          />
        </div>
      </div>

      {/* Radar Chart & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Competency Radar vs Benchmark</h3>
          <SkillRadarChart />
        </div>

        {/* Strong / Weak / Missing Skills */}
        <div className="lg:col-span-6 space-y-4">
          {/* Strong Skills */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Competencies (Placement Ready)
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis?.strongSkills || [
                { name: "JavaScript (ES6+)", score: 90 },
                { name: "React.js Components", score: 85 },
                { name: "REST API Design", score: 82 },
                { name: "MongoDB Schema Design", score: 80 }
              ]).map((s, i) => (
                <Badge key={i} variant="emerald" size="md">
                  {s.name || s} {s.score ? `(${s.score}%)` : ''}
                </Badge>
              ))}
            </div>
          </div>

          {/* Weak Skills */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Needs Immediate Practice
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis?.weakSkills || [
                { name: "Dynamic Programming (DP)", score: 45 },
                { name: "System Design & Low-Level Architecture", score: 50 },
                { name: "Database Indexing & Query Tuning", score: 55 }
              ]).map((s, i) => (
                <Badge key={i} variant="amber" size="md">
                  {s.name || s} {s.score ? `(${s.score}%)` : ''}
                </Badge>
              ))}
            </div>
          </div>

          {/* Missing Required Skills */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Critical Missing Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis?.missingRequiredSkills || [
                "Docker & Containerization",
                "Redis Distributed Caching",
                "CI/CD Pipeline Automation"
              ]).map((s, i) => (
                <Badge key={i} variant="rose" size="md">{s}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> AI Strategic Recommendations
          </h3>
          <Link to="/learning-plan">
            <Button variant="emerald" size="sm" icon={ArrowRight}>
              Generate Custom Learning Plan
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(analysis?.recommendations || [
            "Complete the Advanced Tree & Graph problem set on the Practice Compiler.",
            "Containerize your portfolio project with Docker and deploy to AWS / GCP.",
            "Run an ATS Resume scan to ensure all required keywords are embedded in project descriptions.",
            "Schedule weekly timed mock technical assessments to build interview speed under pressure."
          ]).map((rec, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

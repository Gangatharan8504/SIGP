import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Gauge,
  Brain,
  FileCheck,
  Building2,
  Code2,
  Terminal,
  Trophy,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Target,
  GraduationCap,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button, Badge } from '../common/UIElements';
import { ScoreGauge } from '../common/ScoreGauge';

export const LandingPage = () => {
  const [demoCgpa, setDemoCgpa] = useState(8.5);
  const [demoDsaScore, setDemoDsaScore] = useState(80);
  const [demoProjectScore, setDemoProjectScore] = useState(85);

  const calculatedReadiness = Math.round(
    ((demoCgpa / 10) * 100 * 0.3) + (demoDsaScore * 0.4) + (demoProjectScore * 0.3)
  );

  return (
    <div className="space-y-24 py-8">
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card border border-rose-500/30 text-rose-300 light:text-rose-700 text-xs font-semibold shadow-md shadow-rose-950/20">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Next-Generation AI Placement Readiness SaaS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white light:text-rose-950 tracking-tight leading-[1.1]">
          Bridging the Gap Between <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300">Campus Learning & Dream Placements</span>
        </h1>

        <p className="text-base sm:text-xl text-rose-200/80 light:text-rose-800 max-w-2xl mx-auto leading-relaxed">
          Analyze student skill gaps, get AI-tailored study roadmaps, practice coding in an interactive sandbox, ATS-score resumes, and match directly with top hiring companies.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Start Student Assessment
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Sign In to Workspace
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Calculator Box */}
        <div className="mt-12 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Live Simulation</Badge>
              <h3 className="text-lg font-bold text-white">Instant Placement Readiness Calculator</h3>
            </div>
            <p className="text-xs text-slate-400">
              Adjust your parameters to see how SGIP's multi-dimensional AI scoring predicts placement probability.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Academic CGPA:</span>
                  <span className="font-bold text-indigo-400">{demoCgpa} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={demoCgpa}
                  onChange={(e) => setDemoCgpa(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>DSA & Algorithmic Problem Solving:</span>
                  <span className="font-bold text-emerald-400">{demoDsaScore}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={demoDsaScore}
                  onChange={(e) => setDemoDsaScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Full-Stack Projects & Architecture:</span>
                  <span className="font-bold text-violet-400">{demoProjectScore}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={demoProjectScore}
                  onChange={(e) => setDemoProjectScore(parseInt(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <ScoreGauge
              score={calculatedReadiness}
              size={170}
              title="Predicted Readiness"
              subtitle={calculatedReadiness >= 80 ? "Super Dream Tier Eligible" : calculatedReadiness >= 65 ? "Dream Tier Eligible" : "Skill Booster Recommended"}
            />
            <Link to="/login" className="w-full mt-3">
              <Button variant="emerald" size="sm" className="w-full">
                Unlock Full AI Gap Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COMPLETE STUDENT PLACEMENT JOURNEY */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="cyan">Standardized Methodology</Badge>
          <h2 className="text-3xl font-extrabold text-white">The SGIP Placement Transformation Journey</h2>
          <p className="text-sm text-slate-400">
            From initial registration to landing the offer letter — our AI guides every step.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
          {[
            { step: "01", title: "Profile & Academics", desc: "Sync CGPA & backlogs" },
            { step: "02", title: "Skill Verification", desc: "Take timed assessments" },
            { step: "03", title: "AI Skill Gap Report", desc: "Identify missing skills" },
            { step: "04", title: "Personalized Plan", desc: "6-week curated roadmap" },
            { step: "05", title: "ATS Resume Scan", desc: "Groq LLM bullet critique" },
            { step: "06", title: "Placement Drives", desc: "Apply & track interviews" },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between group hover:border-indigo-500/40 transition">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  {item.step}
                </span>
                <h4 className="text-xs font-bold text-white mt-2.5">{item.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES BENTO GRID */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="indigo">Enterprise Features</Badge>
          <h2 className="text-3xl font-extrabold text-white">Engineered for Students & Placement Cells</h2>
          <p className="text-sm text-slate-400">
            Comprehensive modules powering every facet of collegiate recruitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Groq AI Skill Gap Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates granular reports contrasting student proficiency with industry target roles like Full Stack, Cloud/DevOps, and AI Engineering.
            </p>
            <div className="pt-2">
              <Link to="/skill-gap" className="text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:underline">
                View Skill Gap Engine <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">ATS Resume Parsing & Optimizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated Applicant Tracking System scoring, keyword density verification, and actionable XYZ-formula bullet point rewrite suggestions.
            </p>
            <div className="pt-2">
              <Link to="/resume-analyzer" className="text-xs font-semibold text-emerald-400 flex items-center gap-1 hover:underline">
                Explore Resume ATS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Coding Playground</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live multi-language code compiler supporting JavaScript, Python, C++, and Java with automatic test case validation and time complexity analysis.
            </p>
            <div className="pt-2">
              <Link to="/coding-compiler" className="text-xs font-semibold text-violet-400 flex items-center gap-1 hover:underline">
                Launch Compiler <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-indigo-500/30 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Elevate Your Campus Placement Results?
          </h2>
          <p className="text-sm text-slate-300">
            Join thousands of engineering students and placement officers tracking readiness on SGIP.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-lg shadow-rose-600/30">
              Create Student Account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="border-rose-500/30 text-rose-200 light:text-rose-900">
              Sign In to Portal
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

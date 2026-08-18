import React, { useState, useEffect } from 'react';
import { companyApi, studentApi } from '../../../api/apis';
import { Building2, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Gauge, ArrowRight } from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import { ScoreGauge } from '../../common/ScoreGauge';
import { SkillRadarChart, ReadinessTrendChart } from '../../charts/SkillCharts';
import { Link } from 'react-router-dom';

export const CompanyMatchingPage = () => {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await companyApi.getMatches();
      if (res.data.success) {
        setMatches(res.data.matches || []);
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Company Matching & Eligibility Radar</h1>
        <p className="text-xs text-slate-400">Calculates your real-time shortlisting probability for active hiring partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((item, i) => (
          <div key={i} className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-indigo-400 text-base">
                    {item.company.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{item.company.name}</h3>
                    <p className="text-xs text-slate-400">{item.company.industry} • {item.company.location}</p>
                  </div>
                </div>

                <Badge variant={item.matchPercentage >= 80 ? "emerald" : "indigo"} size="sm">
                  {item.matchPercentage}% Fit
                </Badge>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Typical Package Range:</span>
                <span className="font-bold text-emerald-400">
                  ₹{item.company.typicalPackageLPA?.min} - ₹{item.company.typicalPackageLPA?.max} LPA
                </span>
              </div>

              {/* Status and Reason */}
              <div className="mt-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  {item.eligibilityStatus === 'Eligible' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Status: {item.eligibilityStatus}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5">{item.reason}</p>
              </div>

              {/* Tech stack */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {(item.company.requiredTechStack || []).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <Link to="/placement-drives">
                <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
                  View Active Drives for {item.company.name}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlacementReadinessPage = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await studentApi.getDashboardSummary();
      if (res.data.success) {
        setSummary(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const scores = summary?.scores || { readinessScore: 84, skillScore: 82, academicScore: 85, resumeScore: 88, assessmentScore: 80 };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="indigo">Composite Analytics</Badge>
          <span className="text-xs text-slate-400 font-mono">Weighted Multi-Index Score</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Placement Readiness Intelligence</h1>
        <p className="text-xs text-slate-400">Deep-dive mathematical breakdown of your readiness algorithm</p>
      </div>

      {/* Main Breakdown Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <h3 className="text-lg font-bold text-white">Mathematical Weighting Formula</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your Placement Readiness composite is formulated as:
            <br />
            <code className="text-indigo-300 font-mono text-xs block my-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              Readiness = (35% Skill Verification) + (25% Academic CGPA) + (20% Resume ATS Score) + (20% Mock Assessments)
            </code>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Skills (35%)</span>
              <p className="text-base font-bold text-indigo-400 mt-0.5">{scores.skillScore}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Academics (25%)</span>
              <p className="text-base font-bold text-emerald-400 mt-0.5">{scores.academicScore}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Resume ATS (20%)</span>
              <p className="text-base font-bold text-violet-400 mt-0.5">{scores.resumeScore}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Mock Tests (20%)</span>
              <p className="text-base font-bold text-amber-400 mt-0.5">{scores.assessmentScore}%</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-center">
          <ScoreGauge
            score={scores.readinessScore}
            size={160}
            title="Composite Score"
            subtitle="Tier-1 Product Ready"
          />
        </div>
      </div>

      {/* Historical Trend Growth Chart */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">6-Month Placement Readiness Trajectory</h3>
        <ReadinessTrendChart />
      </div>
    </div>
  );
};

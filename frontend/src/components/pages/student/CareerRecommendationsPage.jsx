import React, { useState, useEffect } from 'react';
import { aiApi } from '../../../api/apis';
import { Compass, TrendingUp, CheckCircle, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import { Link } from 'react-router-dom';

export const CareerRecommendationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await aiApi.getCareerRecommendations();
      if (res.data.success) {
        setCareers(res.data.recommendations || []);
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
        <div className="flex items-center gap-2">
          <Badge variant="indigo">AI Career Counselor</Badge>
          <span className="text-xs text-slate-400 font-mono">Market Demand Alignment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Personalized Career Paths</h1>
        <p className="text-xs text-slate-400">
          Ranked based on your verified skill scores, academic background, and hiring demand trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map((career, i) => (
          <div key={i} className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant={career.matchPercentage >= 90 ? "emerald" : "indigo"} size="sm">
                    {career.matchPercentage}% Profile Fit
                  </Badge>
                  <h3 className="text-lg font-bold text-white mt-2">{career.role}</h3>
                </div>
                <Badge variant="amber" size="sm">
                  {career.demand || "High Demand"}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {career.description}
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Average Compensation:</span>
                <span className="font-bold text-emerald-400">{career.averageSalaryLPA}</span>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Required Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {(career.keySkillsNeeded || []).map((sk, skIdx) => (
                    <span key={skIdx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <Link to={`/skill-gap`} className="w-full">
                <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
                  Set as Target Role & View Skill Gap
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

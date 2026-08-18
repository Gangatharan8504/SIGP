import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { studentApi } from '../../../api/apis';
import {
  Sparkles,
  Award,
  GraduationCap,
  FileCheck,
  FileSearch,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Layers,
  BarChart3,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { MetricCard } from '../../common/MetricCard';
import { ScoreGauge } from '../../common/ScoreGauge';
import { Button, Badge, Spinner } from '../../common/UIElements';
import { SkillRadarChart, SkillBarChart } from '../../charts/SkillCharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [chartView, setChartView] = useState('radar'); // 'radar' | 'bar'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await studentApi.getDashboardSummary();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const scores = data?.scores || {};
  const profile = data?.profile || {};
  const academic = data?.academic;
  const pendingActions = data?.pendingActions || [];
  const weights = data?.weightsApplied || {
    academicWeight: 20,
    skillsWeight: 20,
    assessmentWeight: 20,
    codingWeight: 15,
    resumeWeight: 10,
    projectsWeight: 10,
    consistencyWeight: 5,
  };
  const activeDrives = data?.activeDrives || [];
  const recommendedCompanies = data?.recommendedCompanies || [];
  const assessmentTrend = data?.assessmentTrend || [];

  const hasReadinessScore = scores.readinessScore !== null && scores.readinessScore !== undefined;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {hasReadinessScore ? (
              <Badge variant="emerald">
                {scores.readinessScore >= 75 ? "Placement Ready" : "Building Readiness"}
              </Badge>
            ) : (
              <Badge variant="amber">Pending Evaluation</Badge>
            )}
            <Badge variant="pink">{profile.targetRole || "Full Stack Software Engineer"}</Badge>
            <span className="text-xs text-rose-300 light:text-rose-800 font-mono font-bold">
              Batch {profile.batchYear || 2026}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white light:text-rose-950">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-rose-200/90 light:text-rose-900 max-w-xl">
            {hasReadinessScore ? (
              <>
                Your dynamic placement readiness score is{' '}
                <strong className="text-emerald-400 light:text-emerald-700 font-bold">
                  {scores.readinessScore}%
                </strong>
                . Evaluated from your verified assessments, CGPA, and ATS resume audit.
              </>
            ) : (
              <>
                Complete your required baseline assessment and upload your resume to generate your official placement readiness score.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2 justify-center md:justify-start">
            <Link to="/assessments">
              <Button variant="primary" size="sm" icon={Sparkles} className="font-bold shadow-md shadow-rose-600/30">
                {scores.assessmentScore !== null ? "Take Assessment" : "Take Baseline Assessment"}
              </Button>
            </Link>
            <Link to="/resume-analyzer">
              <Button
                variant="secondary"
                size="sm"
                icon={FileSearch}
                className="font-bold border-rose-500/40 text-rose-200 light:text-rose-950 light:bg-rose-100/90 shadow-md"
              >
                {scores.resumeScore !== null ? "Scan Updated Resume" : "Upload PDF Resume"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Big Readiness Score Radial Gauge */}
        <div className="z-10 bg-slate-950/90 light:bg-white rounded-2xl p-2 border border-rose-500/30 shadow-xl shrink-0">
          <ScoreGauge
            score={hasReadinessScore ? scores.readinessScore : 0}
            size={140}
            title="Readiness Score"
            subtitle={
              hasReadinessScore
                ? scores.readinessScore >= 80
                  ? "Super Dream Ready"
                  : scores.readinessScore >= 60
                  ? "Dream Tier Ready"
                  : "Foundation Tier"
                : "Action Needed"
            }
          />
        </div>
      </div>

      {/* Mandatory Action Items Guide (If any items pending) */}
      {pendingActions.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white light:text-slate-900">
              Required Actions to Complete Your Profile ({pendingActions.length} Pending)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pendingActions.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-slate-900/80 light:bg-white border border-rose-500/20 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                    {act.type}
                  </span>
                  <h4 className="text-xs font-bold text-white light:text-slate-900">{act.title}</h4>
                </div>
                <Link to={act.link}>
                  <Button variant="primary" size="xs" className="w-full" icon={ArrowRight}>
                    Complete Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Score KPI Widgets (Real Data Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Verified Skill Score"
          value={scores.skillScore !== null ? `${scores.skillScore}%` : "No Skills"}
          subtitle={scores.skillScore !== null ? "From assessments & practice" : "Add skills to track"}
          icon={Award}
          color="rose"
          trend={
            scores.skillScore !== null
              ? { positive: true, text: "Verified by tests" }
              : { positive: false, text: "Pending verification" }
          }
        />
        <MetricCard
          title="Academic CGPA"
          value={scores.cgpa !== null ? `${scores.cgpa}` : "Not Set"}
          subtitle={
            academic
              ? `${academic.standingArrears || 0} Standing Arrears`
              : "Complete academic profile"
          }
          icon={GraduationCap}
          color="emerald"
          trend={
            scores.cgpa !== null && scores.cgpa >= 7.5
              ? { positive: true, text: "Meets Tier-1 Cutoff" }
              : { positive: false, text: "Update academic record" }
          }
        />
        <MetricCard
          title="Resume ATS Score"
          value={scores.resumeScore !== null ? `${scores.resumeScore}/100` : "No Resume"}
          subtitle={scores.resumeScore !== null ? "Parsed with Groq AI" : "Upload PDF/DOCX"}
          icon={FileSearch}
          color="pink"
          trend={
            scores.resumeScore !== null
              ? { positive: true, text: "Target role aligned" }
              : { positive: false, text: "Run ATS analysis" }
          }
        />
        <MetricCard
          title="Assessment Average"
          value={scores.assessmentScore !== null ? `${scores.assessmentScore}%` : "Not Taken"}
          subtitle={
            scores.assessmentScore !== null
              ? "Across proctored benchmarks"
              : "42-Question baseline pending"
          }
          icon={FileCheck}
          color="amber"
          trend={
            scores.assessmentScore !== null
              ? { positive: true, text: "Proctored & graded" }
              : { positive: false, text: "Take baseline test" }
          }
        />
      </div>

      {/* Academic Credentials & CGPA Intelligence Showcase */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
          <div>
            <h3 className="text-base font-bold text-white light:text-rose-950 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-rose-400" /> Academic Credentials &amp; CGPA Intelligence
            </h3>
            <p className="text-xs text-rose-300/80 light:text-rose-800">
              Verified university semester metrics, cumulative CGPA, and arrears history
            </p>
          </div>
          <Link to="/academics">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Manage Academic Details
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-rose-50/50 border border-rose-500/20 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Cumulative CGPA</span>
            <div className="text-2xl font-black text-rose-400 light:text-rose-700">
              {academic?.cgpa !== null && academic?.cgpa !== undefined ? `${academic.cgpa} / 10.0` : "Not Entered"}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">
              {academic?.cgpa >= 8.5 ? "★ High Distinction" : academic?.cgpa >= 7.5 ? "✓ First Class" : "Standard Tier"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-rose-50/50 border border-rose-500/20 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Active Backlogs</span>
            <div className="text-2xl font-black text-white light:text-slate-900">
              {academic?.activeBacklogs ?? academic?.standingArrears ?? 0}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              {(academic?.activeBacklogs ?? 0) === 0 ? "Eligible for All Companies" : "Cleared: " + (academic?.clearedArrears ?? 0)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-rose-50/50 border border-rose-500/20 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">10th Standard</span>
            <div className="text-xl font-black text-rose-300 light:text-rose-900">
              {academic?.tenthPercentage ? `${academic.tenthPercentage}%` : "Pending"}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">{academic?.tenthBoard || "Board Exam"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-rose-50/50 border border-rose-500/20 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">12th / Diploma</span>
            <div className="text-xl font-black text-rose-300 light:text-rose-900">
              {academic?.twelfthOrDiplomaPercentage ? `${academic.twelfthOrDiplomaPercentage}%` : "Pending"}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">{academic?.twelfthBoard || "Higher Secondary"}</div>
          </div>
        </div>
      </div>

      {/* Dynamic Placement Readiness Pillar Weights (Coordinator Configured) */}
      <div className="glass-card rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white light:text-rose-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" /> Placement Readiness Formula & Pillars
            </h3>
            <p className="text-xs text-rose-300/80 light:text-rose-800">
              Evaluated using institutional coordinator weights totaling 100%
            </p>
          </div>
          <span className="text-xs text-emerald-400 light:text-emerald-700 font-mono font-bold">
            Real Database Computation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Academics</span>
            <div className="text-sm font-black text-rose-300">{weights.academicWeight}%</div>
            <div className="text-[10px] text-slate-400">
              {scores.academicScore !== null ? `${scores.academicScore}%` : "Pending"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Skills</span>
            <div className="text-sm font-black text-rose-300">{weights.skillsWeight}%</div>
            <div className="text-[10px] text-slate-400">
              {scores.skillScore !== null ? `${scores.skillScore}%` : "Pending"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Assessment</span>
            <div className="text-sm font-black text-rose-300">{weights.assessmentWeight}%</div>
            <div className="text-[10px] text-slate-400">
              {scores.assessmentScore !== null ? `${scores.assessmentScore}%` : "Pending"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Coding</span>
            <div className="text-sm font-black text-rose-300">{weights.codingWeight}%</div>
            <div className="text-[10px] text-slate-400">
              {scores.codingScore !== null ? `${scores.codingScore}%` : "0%"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Resume</span>
            <div className="text-sm font-black text-rose-300">{weights.resumeWeight}%</div>
            <div className="text-[10px] text-slate-400">
              {scores.resumeScore !== null ? `${scores.resumeScore}%` : "Pending"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Projects</span>
            <div className="text-sm font-black text-rose-300">{weights.projectsWeight}%</div>
            <div className="text-[10px] text-slate-400">100%</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Consistency</span>
            <div className="text-sm font-black text-rose-300">{weights.consistencyWeight}%</div>
            <div className="text-[10px] text-slate-400">Active</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Radar / Bar & Performance History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Competency vs Industry Bar */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white light:text-rose-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" /> Skill Competency vs Industry Bar
              </h3>
              <p className="text-xs text-rose-300/80 light:text-rose-800">
                Target: {profile.targetRole || "Full Stack Software Engineer"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartView(chartView === 'radar' ? 'bar' : 'radar')}
                className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 light:text-rose-800 hover:bg-rose-500/20 text-xs font-semibold transition"
              >
                {chartView === 'radar' ? 'Switch to Bar View' : 'Switch to Radar View'}
              </button>
              <Link to="/skills">
                <Button variant="ghost" size="sm">Manage Skills</Button>
              </Link>
            </div>
          </div>

          {chartView === 'radar' ? <SkillRadarChart /> : <SkillBarChart />}
        </div>

        {/* Real Assessment Progression & Audit */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white light:text-rose-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" /> Assessment Attempt History
            </h3>
            <Link to="/assessments">
              <Button variant="ghost" size="sm">View All Tests</Button>
            </Link>
          </div>

          {assessmentTrend.length > 0 ? (
            <div className="space-y-3">
              {assessmentTrend.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-rose-500/20 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{item.attempt}</div>
                    <div className="text-[10px] text-slate-400">{item.date} • Integrity: {item.integrity}%</div>
                  </div>
                  <div className="text-sm font-black text-rose-400">{item.score}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <FileCheck className="w-10 h-10 text-rose-400/50 mx-auto" />
              <p className="text-xs text-rose-200/70">No completed assessment attempts recorded yet.</p>
              <Link to="/assessments">
                <Button variant="primary" size="sm" icon={Sparkles}>
                  Take 42-Q Baseline Test
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Campus Drives */}
      <div className="glass-card rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white light:text-rose-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-400" /> Active & Upcoming Placement Drives
            </h3>
            <p className="text-xs text-rose-300/80 light:text-rose-800">
              Live recruitment drives matching your verified profile
            </p>
          </div>
          <Link to="/placement-drives">
            <Button variant="ghost" size="sm">View All Drives</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeDrives.length > 0 ? (
            activeDrives.map((drive) => (
              <div
                key={drive._id}
                className="p-4 rounded-2xl bg-slate-900/80 light:bg-white border border-rose-500/20 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white light:text-slate-900">
                      {drive.company?.name || "Tier-1 Tech"}
                    </span>
                    <Badge variant="rose">{drive.tier || "Super Dream"}</Badge>
                  </div>
                  <div className="text-xs text-rose-300 light:text-rose-700 font-semibold">
                    {drive.jobRole}
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400 light:text-emerald-700">
                    ₹{drive.salaryPackageLPA} LPA
                  </div>
                </div>

                <Link to="/placement-drives">
                  <Button variant="outline" size="xs" className="w-full">
                    View Criteria & Apply
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-4 py-8 text-center text-xs text-rose-200/70">
              No new placement drives announced this week. Check back soon.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

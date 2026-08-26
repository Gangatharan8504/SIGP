import React, { useState, useEffect } from 'react';
import { coordinatorApi } from '../../../api/apis';
import {
  Users,
  Briefcase,
  Building2,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
} from 'lucide-react';
import { MetricCard } from '../../common/MetricCard';
import { Button, Badge, Spinner, Input } from '../../common/UIElements';
import { DatabaseStorageMonitor } from '../../admin/DatabaseStorageMonitor';

export const CoordinatorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await coordinatorApi.getDashboard();
      if (res.data.success) setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const stats = data?.stats || {
    totalStudents: 124,
    placedStudents: 48,
    placementReadyStudents: 86,
    totalCompanies: 18,
    activeDrives: 4,
    placementRatePct: 39,
    averagePackageLPA: 12.4,
    highestPackageLPA: 44.0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">Placement Coordinator Console</Badge>
            <span className="text-xs text-slate-400 font-mono">Academic Year 2025-2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Institutional Recruitment Intelligence</h1>
          <p className="text-xs text-slate-400">Track candidate eligibility matrices, campus drives, and company conversion funnels</p>
        </div>

        <div className="flex items-center gap-2">
          <a href="/coordinator/readiness-matrix">
            <Button variant="primary" size="sm" icon={Building2}>
              Open Readiness Matrix
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Placement Ready"
          value={stats.placementReadyStudents}
          subtitle="Score >= 75%"
          icon={Sparkles}
          color="emerald"
        />
        <MetricCard
          title="Offers Secured"
          value={stats.placedStudents}
          subtitle={`Avg CTC: ₹${stats.averagePackageLPA} LPA`}
          icon={Award}
          color="amber"
        />
        <MetricCard
          title="Active Drives"
          value={stats.activeDrives}
          subtitle={`${stats.totalCompanies} Corporate Partners`}
          icon={Briefcase}
          color="indigo"
        />
        <MetricCard
          title="Top Offer CTC"
          value={`₹${stats.highestPackageLPA} LPA`}
          subtitle="Google Campus Drive"
          icon={Building2}
          color="rose"
        />
      </div>

      {/* MongoDB Database Storage Telemetry */}
      <DatabaseStorageMonitor />
    </div>
  );
};

export const CompanyReadinessMatrix = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const res = await coordinatorApi.getReadinessMatrix();
      if (res.data.success) setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const companies = data?.companies || [];
  const matrix = (data?.matrix || []).filter((st) => {
    return st.name.toLowerCase().includes(search.toLowerCase()) || st.rollNumber.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Company Readiness Matrix</h1>
          <p className="text-xs text-slate-400">Live multi-company eligibility and skill alignment matrix across student cohort</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search candidate name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
          <Button variant="secondary" size="sm" icon={Download} onClick={() => alert("Exporting Matrix to CSV...")}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 min-w-[800px]">
          <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3">Candidate</th>
              <th className="pb-3">CGPA</th>
              <th className="pb-3">Readiness</th>
              {companies.map((c) => (
                <th key={c.id} className="pb-3 text-center">
                  <p className="font-bold text-white">{c.name}</p>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">{c.tier}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrix.map((row) => (
              <tr key={row.studentId} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 font-bold text-white">
                  <p>{row.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono font-normal">{row.rollNumber}</p>
                </td>
                <td className="py-3.5 font-mono">{row.cgpa}</td>
                <td className="py-3.5 font-bold text-emerald-400">{row.readinessScore}%</td>
                {row.evaluations.map((ev, i) => (
                  <td key={i} className="py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        ev.status === 'Eligible'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : ev.status === 'Almost Eligible'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                      title={ev.reason}
                    >
                      {ev.status === 'Eligible' && <CheckCircle2 className="w-3 h-3" />}
                      {ev.status === 'Almost Eligible' && <Sparkles className="w-3 h-3" />}
                      {ev.status === 'Ineligible' && <XCircle className="w-3 h-3" />}
                      {ev.status}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

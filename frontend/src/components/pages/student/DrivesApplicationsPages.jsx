import React, { useState, useEffect } from 'react';
import { driveApi } from '../../../api/apis';
import { Briefcase, Calendar, MapPin, DollarSign, CheckCircle2, Send, Clock, Building2, ArrowRight } from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import confetti from 'canvas-confetti';

export const PlacementDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await driveApi.getAll();
      if (res.data.success) {
        setDrives(res.data.drives || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    setApplyingId(driveId);
    try {
      const res = await driveApi.apply(driveId);
      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setDrives((prev) =>
          prev.map((d) => (d._id === driveId ? { ...d, hasApplied: true } : d))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply for drive');
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Campus Placement Drives</h1>
        <p className="text-xs text-slate-400">Apply to scheduled on-campus & virtual hiring recruitment events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map((drive) => (
          <div key={drive._id} className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-indigo-400 text-base">
                    {drive.company?.name?.[0] || "C"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{drive.company?.name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">{drive.role}</p>
                  </div>
                </div>

                <Badge variant={drive.packageCTC >= 25 ? "rose" : drive.packageCTC >= 15 ? "indigo" : "emerald"} size="sm">
                  ₹{drive.packageCTC} LPA
                </Badge>
              </div>

              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {drive.description}
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Drive Date:
                  </span>
                  <span className="font-mono">{new Date(drive.driveDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location:
                  </span>
                  <span className="truncate">{drive.jobLocation}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Min CGPA Required:</span>
                  <span className="font-bold text-white">{drive.eligibilityRule?.minCgpa || 7.0}</span>
                </div>
              </div>

              {/* Rounds */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hiring Pipeline</span>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 flex-wrap">
                  {(drive.rounds || []).map((r, rIdx) => (
                    <span key={rIdx} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px]">
                      {r.roundName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <Button
                variant={drive.hasApplied ? "secondary" : "primary"}
                size="md"
                className="w-full"
                disabled={drive.hasApplied}
                loading={applyingId === drive._id}
                onClick={() => handleApply(drive._id)}
                icon={drive.hasApplied ? CheckCircle2 : Send}
              >
                {drive.hasApplied ? "Applied Successfully" : "One-Click Apply"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await driveApi.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.applications || []);
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
        <h1 className="text-2xl sm:text-3xl font-black text-white">My Placement Applications</h1>
        <p className="text-xs text-slate-400">Live tracking of your drive applications and interview rounds</p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No active applications yet</h3>
          <p className="text-xs text-slate-400">Explore upcoming placement drives and submit your first application</p>
          <a href="/placement-drives">
            <Button variant="primary" size="sm">Browse Live Drives</Button>
          </a>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
            <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="pb-3">Company & Role</th>
                <th className="pb-3">Package CTC</th>
                <th className="pb-3">Current Round</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5">
                    <p className="font-bold text-white">{app.driveId?.company?.name || "Company"}</p>
                    <p className="text-[11px] text-indigo-400">{app.driveId?.role || "SDE"}</p>
                  </td>
                  <td className="py-3.5 font-bold text-emerald-400">₹{app.driveId?.packageCTC || 12} LPA</td>
                  <td className="py-3.5 text-slate-200">{app.currentRound}</td>
                  <td className="py-3.5">
                    <Badge
                      variant={
                        app.status === 'Offered'
                          ? 'emerald'
                          : app.status === 'Rejected'
                          ? 'rose'
                          : 'indigo'
                      }
                      size="sm"
                    >
                      {app.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

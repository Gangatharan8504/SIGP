import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/apis';
import {
  Users,
  Briefcase,
  Building2,
  Award,
  TrendingUp,
  FileCheck,
  Search,
  Download,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MetricCard } from '../../common/MetricCard';
import { Button, Badge, Spinner, Input, Modal } from '../../common/UIElements';
import { SkillRadarChart } from '../../charts/SkillCharts';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const data = stats?.stats || {
    totalStudents: 124,
    activeStudents: 118,
    placementReadyStudents: 82,
    placedStudents: 46,
    totalCompanies: 18,
    activeDrives: 6,
    averagePackageLPA: 12.2,
    highestPackageLPA: 44.0,
  };

  const activities = stats?.recentActivities || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">Placement Officer Console</Badge>
            <span className="text-xs text-slate-400 font-mono">Academic Year 2025-2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Institutional Placement Analytics</h1>
          <p className="text-xs text-slate-400">Live recruitment monitoring and student readiness intelligence</p>
        </div>

        <div className="flex items-center gap-2">
          <a href="/admin/drives">
            <Button variant="primary" size="sm" icon={Briefcase}>
              Schedule New Drive
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Registered"
          value={data.totalStudents}
          subtitle="95% Active this week"
          icon={Users}
          color="indigo"
          trend={{ positive: true, text: "+14 students" }}
        />
        <MetricCard
          title="Placement Ready"
          value={`${data.placementReadyStudents}`}
          subtitle="Score >= 75% threshold"
          icon={Sparkles}
          color="emerald"
          trend={{ positive: true, text: "68% of cohort" }}
        />
        <MetricCard
          title="Offers Secured"
          value={data.placedStudents}
          subtitle="Avg CTC: 12.2 LPA"
          icon={Award}
          color="amber"
          trend={{ positive: true, text: "Max 44 LPA" }}
        />
        <MetricCard
          title="Active Drives"
          value={data.activeDrives}
          subtitle="18 Companies Registered"
          icon={Building2}
          color="violet"
          trend={{ positive: true, text: "3 ongoing this week" }}
        />
      </div>

      {/* Main Grid: Cohort Readiness Radar & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Cohort Skill Benchmark vs Industry Standards</h3>
            <Badge variant="indigo" size="sm">CSE & IT</Badge>
          </div>
          <SkillRadarChart />
        </div>

        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Recent Campus Activities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time candidate log</p>

            <div className="divide-y divide-slate-800/60 mt-3 max-h-72 overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No recent activities</p>
              ) : (
                activities.map((act) => (
                  <div key={act._id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-white">{act.action}</p>
                      <p className="text-[11px] text-slate-400">{act.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <a href="/admin/students" className="block">
              <Button variant="secondary" size="sm" className="w-full">
                Open Full Student Directory
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search, department]);

  const fetchStudents = async () => {
    try {
      const res = await adminApi.getStudents({ search, department });
      if (res.data.success) {
        setStudents(res.data.students || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await adminApi.getStudentDetails(id);
      if (res.data.success) {
        setSelectedStudent(res.data);
        setIsDetailOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Student Candidate Directory</h1>
          <p className="text-xs text-slate-400">Filter candidates by department, CGPA, and AI readiness scores</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded-xl py-2.5 px-3 text-white outline-none"
          >
            <option value="">All Branches</option>
            <option value="Computer Science and Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="AI & Data Science">AI & DS</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
          <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3">Candidate Name</th>
              <th className="pb-3">Roll Number</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Target Role</th>
              <th className="pb-3">Readiness Score</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">360 View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {students.map((st) => (
              <tr key={st._id} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 font-bold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400 text-xs">
                    {st.fullName[0]}
                  </div>
                  <span>{st.fullName}</span>
                </td>
                <td className="py-3.5 font-mono text-slate-300">{st.rollNumber || "N/A"}</td>
                <td className="py-3.5 text-slate-400 truncate max-w-[150px]">{st.department}</td>
                <td className="py-3.5 text-indigo-400 font-semibold">{st.targetRole}</td>
                <td className="py-3.5 font-black text-emerald-400">{st.readinessScore || 75}%</td>
                <td className="py-3.5">
                  <Badge variant={st.placementStatus === 'Placed' ? 'emerald' : 'indigo'} size="sm">
                    {st.placementStatus || "Seeking"}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => handleViewDetails(st._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 360 Student Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Student 360 Profile" maxWidth="max-w-2xl">
        {selectedStudent && (
          <div className="space-y-6 text-xs text-slate-300">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                {selectedStudent.profile.fullName[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudent.profile.fullName}</h3>
                <p className="text-slate-400">{selectedStudent.profile.rollNumber} • {selectedStudent.profile.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Academic CGPA</span>
                <p className="text-base font-bold text-white mt-0.5">{selectedStudent.academic?.cgpa || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Placement Readiness</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{selectedStudent.profile.readinessScore || 75}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Verified Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedStudent.skills || []).map((sk, i) => (
                  <Badge key={i} variant="indigo" size="sm">{sk.skillName} ({sk.selfRating}★)</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

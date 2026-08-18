import React, { useState, useEffect } from 'react';
import { adminApi, skillApi, companyApi, driveApi } from '../../../api/apis';
import { Award, Plus, Briefcase, Building2, HelpCircle, FileCheck, Send, CheckCircle, BarChart3, Save } from 'lucide-react';
import { Button, Badge, Spinner, Input, Modal } from '../../common/UIElements';

export const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Frontend', demandLevel: 'High' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await skillApi.getAll();
      if (res.data.success) setSkills(res.data.skills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createSkill(formData);
      setIsModalOpen(false);
      setFormData({ name: '', category: 'Frontend', demandLevel: 'High' });
      fetchSkills();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Skills Master Directory</h1>
          <p className="text-xs text-slate-400">Institutional skill taxonomy and market demand classification</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Add Master Skill</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div key={s._id} className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <Badge variant="indigo" size="sm">{s.category}</Badge>
              <h4 className="text-sm font-bold text-white mt-1">{s.name}</h4>
            </div>
            <Badge variant="amber" size="sm">{s.demandLevel}</Badge>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Master Skill">
        <form onSubmit={handleCreateSkill} className="space-y-4">
          <Input label="Skill Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Core CS">Core CS</option>
                <option value="Data & AI">Data & AI</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-slate-300">Demand Level</label>
              <select
                value={formData.demandLevel}
                onChange={(e) => setFormData({ ...formData, demandLevel: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
              >
                <option value="High">High</option>
                <option value="Very High">Very High</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save to Master</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const PlacementDrivesManagement = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    role: 'Associate Software Engineer',
    packageCTC: 12,
    jobLocation: 'Bangalore',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resDrives, resComps] = await Promise.all([
        driveApi.getAll(),
        companyApi.getAll(),
      ]);
      if (resDrives.data.success) setDrives(resDrives.data.drives || []);
      if (resComps.data.success) {
        setCompanies(resComps.data.companies || []);
        if (resComps.data.companies?.length > 0) {
          setFormData((prev) => ({ ...prev, company: resComps.data.companies[0]._id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createDrive(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Placement Drives Manager</h1>
          <p className="text-xs text-slate-400">Publish recruitment events, configure CTC packages, and set cutoffs</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Schedule New Drive</Button>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
          <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3">Company & Title</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Package CTC</th>
              <th className="pb-3">Drive Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {drives.map((d) => (
              <tr key={d._id} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5">
                  <p className="font-bold text-white">{d.company?.name || "Company"}</p>
                  <p className="text-[11px] text-slate-400">{d.title}</p>
                </td>
                <td className="py-3.5 text-indigo-400 font-semibold">{d.role}</td>
                <td className="py-3.5 font-bold text-emerald-400">₹{d.packageCTC} LPA</td>
                <td className="py-3.5 text-slate-400 font-mono">{new Date(d.driveDate).toLocaleDateString()}</td>
                <td className="py-3.5">
                  <Badge variant={d.status === 'Upcoming' ? 'emerald' : 'indigo'} size="sm">
                    {d.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Placement Drive">
        <form onSubmit={handleCreateDrive} className="space-y-4">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-300">Select Company</label>
            <select
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
              required
            >
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.tier})</option>
              ))}
            </select>
          </div>

          <Input label="Drive Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Google Campus Hiring 2026" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Job Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            <Input label="CTC Package (LPA)" type="number" value={formData.packageCTC} onChange={(e) => setFormData({ ...formData, packageCTC: e.target.value })} required />
          </div>
          <Input label="Job Location" value={formData.jobLocation} onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })} required />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Publish Drive</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await adminApi.getAllApplications();
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await adminApi.updateApplicationStatus(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Placement Applications Pipeline</h1>
        <p className="text-xs text-slate-400">Review student drive applications and advance hiring stages</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
          <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3">Candidate</th>
              <th className="pb-3">Company & Role</th>
              <th className="pb-3">Readiness Score</th>
              <th className="pb-3">Current Status</th>
              <th className="pb-3 text-right">Advance Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5">
                  <p className="font-bold text-white">{app.userId?.name || "Student"}</p>
                  <p className="text-[11px] text-slate-400">{app.userId?.email}</p>
                </td>
                <td className="py-3.5">
                  <p className="font-semibold text-slate-200">{app.driveId?.company?.name}</p>
                  <p className="text-[11px] text-indigo-400">{app.driveId?.role}</p>
                </td>
                <td className="py-3.5 font-bold text-emerald-400">{app.readinessScoreAtApply}%</td>
                <td className="py-3.5">
                  <Badge variant={app.status === 'Offered' ? 'emerald' : app.status === 'Rejected' ? 'rose' : 'indigo'} size="sm">
                    {app.status}
                  </Badge>
                </td>
                <td className="py-3.5 text-right space-x-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-1.5 text-white outline-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Online Test Cleared">Online Test Cleared</option>
                    <option value="Technical Round">Technical Round</option>
                    <option value="HR Round">HR Round</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

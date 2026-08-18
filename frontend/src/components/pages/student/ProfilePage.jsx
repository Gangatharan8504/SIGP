import React, { useState, useEffect } from 'react';
import { studentApi } from '../../../api/apis';
import { User, Mail, Phone, Globe, Code2, Save, GraduationCap, CheckCircle } from 'lucide-react';
import { Button, Input, Badge, Spinner } from '../../common/UIElements';

export const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    rollNumber: '',
    department: 'Computer Science and Engineering',
    batchYear: 2026,
    targetRole: 'Full Stack Software Engineer',
    bio: '',
    phone: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    placementStatus: 'Seeking',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await studentApi.getProfile();
      if (res.data.success && res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await studentApi.updateProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Student Profile & Placement Identity</h1>
          <p className="text-xs text-slate-400">Manage your bio, portfolio links, and target career specializations</p>
        </div>
        <Badge variant={profile.placementStatus === 'Placed' ? 'emerald' : 'indigo'}>
          {profile.placementStatus || 'Seeking Placements'}
        </Badge>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} required />
            <Input label="Roll Number" name="rollNumber" value={profile.rollNumber} onChange={handleChange} />
            <Input label="Contact Phone" name="phone" value={profile.phone} onChange={handleChange} icon={Phone} />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Placement Status</label>
              <select
                name="placementStatus"
                value={profile.placementStatus}
                onChange={handleChange}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm rounded-xl py-2.5 px-3 outline-none focus:border-indigo-500"
              >
                <option value="Seeking">Seeking Placement Opportunities</option>
                <option value="Placed">Already Placed</option>
                <option value="Opted-Out">Higher Studies / Opted-Out</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Role</label>
              <select
                name="targetRole"
                value={profile.targetRole}
                onChange={handleChange}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm rounded-xl py-2.5 px-3 outline-none focus:border-indigo-500"
              >
                <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                <option value="Backend & Distributed Systems">Backend & Distributed Systems</option>
                <option value="Frontend / UI Engineer">Frontend / UI Engineer</option>
                <option value="AI / ML Solutions Engineer">AI / ML Solutions Engineer</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                <option value="Data Engineer">Data Engineer</option>
              </select>
            </div>

            <Input label="Batch Year" name="batchYear" type="number" value={profile.batchYear} onChange={handleChange} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Professional Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={profile.bio}
              onChange={handleChange}
              placeholder="Highlight your engineering passions, core frameworks, and hackathon wins..."
              className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm rounded-xl p-3 mt-1.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* External Links */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Social & Portfolio Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="LinkedIn Profile" name="linkedinUrl" value={profile.linkedinUrl} onChange={handleChange} icon={Globe} placeholder="https://linkedin.com/in/..." />
            <Input label="GitHub Profile" name="githubUrl" value={profile.githubUrl} onChange={handleChange} icon={Code2} placeholder="https://github.com/..." />
            <Input label="Personal Portfolio" name="portfolioUrl" value={profile.portfolioUrl} onChange={handleChange} icon={Globe} placeholder="https://yourdomain.dev" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" loading={saving} icon={Save}>
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

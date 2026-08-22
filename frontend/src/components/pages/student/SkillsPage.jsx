import React, { useState, useEffect } from 'react';
import { skillApi } from '../../../api/apis';
import {
  Award,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  Search,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Mail,
  HeartHandshake,
  Cpu,
  Edit2,
  Check,
  X,
  Filter,
  BarChart2
} from 'lucide-react';
import { Button, Input, Badge, Modal, Spinner } from '../../common/UIElements';

const PRESET_TECH_SKILLS = [
  { name: 'Java', category: 'Core CS' },
  { name: 'React.js', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Python', category: 'Backend' },
  { name: 'Data Structures & Algorithms', category: 'Core CS' },
  { name: 'SQL / MySQL', category: 'Database' },
  { name: 'Docker & Containers', category: 'Cloud & DevOps' },
  { name: 'Git & Version Control', category: 'Cloud & DevOps' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'RESTful APIs', category: 'Backend' },
];

const PRESET_SOFT_SKILLS = [
  { name: 'Problem-Solving & Analytical Thinking', category: 'Soft Skills' },
  { name: 'Teamwork & Cross-functional Collaboration', category: 'Soft Skills' },
  { name: 'Communication & Technical Presentation', category: 'Soft Skills' },
  { name: 'Adaptability & Rapid Learning', category: 'Soft Skills' },
  { name: 'Leadership & Conflict Resolution', category: 'Soft Skills' },
  { name: 'Time Management & Agile Delivery', category: 'Soft Skills' },
  { name: 'Critical Thinking & Debugging', category: 'Soft Skills' },
];

export const SkillsPage = () => {
  const [loading, setLoading] = useState(true);
  const [mySkills, setMySkills] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'TECH' | 'SOFT' | 'VERIFIED'
  const [actionNotice, setActionNotice] = useState('');

  const [currentSkill, setCurrentSkill] = useState({
    skillName: '',
    category: 'Frontend',
    proficiency: 'Intermediate',
    selfRating: 4,
  });

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    try {
      const [resMy, resMaster] = await Promise.all([
        skillApi.getMySkills(),
        skillApi.getAll(),
      ]);
      if (resMy.data.success) {
        setMySkills(resMy.data.skills || []);
        if (resMy.data.analytics) setAnalytics(resMy.data.analytics);
      }
      if (resMaster.data.success) {
        setMasterSkills(resMaster.data.skills || []);
      }
    } catch (e) {
      console.error('Error fetching skills:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (preset = null) => {
    setIsEditing(false);
    if (preset) {
      setCurrentSkill({
        skillName: preset.name,
        category: preset.category,
        proficiency: 'Intermediate',
        selfRating: 4,
      });
    } else {
      setCurrentSkill({
        skillName: '',
        category: 'Frontend',
        proficiency: 'Intermediate',
        selfRating: 4,
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setIsEditing(true);
    setCurrentSkill({
      skillName: skill.skillName,
      category: skill.category,
      proficiency: skill.proficiency,
      selfRating: skill.selfRating,
    });
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!currentSkill.skillName.trim()) return;

    try {
      const res = await skillApi.saveMySkill(currentSkill);
      setIsModalOpen(false);
      setActionNotice(
        `✓ ${currentSkill.skillName} successfully updated. Notification email dispatched to your inbox!`
      );
      setTimeout(() => setActionNotice(''), 5000);
      fetchSkillsData();
    } catch (e) {
      console.error('Save skill error:', e);
    }
  };

  const handleDeleteSkill = async (id, skillName) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}" from your Matrix?`)) return;
    try {
      await skillApi.deleteMySkill(id);
      setMySkills((prev) => prev.filter((s) => s._id !== id));
      setActionNotice(`Removed ${skillName}. Audit notification sent.`);
      setTimeout(() => setActionNotice(''), 4000);
      fetchSkillsData();
    } catch (e) {
      console.error('Delete skill error:', e);
    }
  };

  const handleQuickStarRating = async (skill, newRating) => {
    try {
      await skillApi.saveMySkill({
        skillName: skill.skillName,
        category: skill.category,
        proficiency: skill.proficiency,
        selfRating: newRating,
      });
      setActionNotice(`Updated ${skill.skillName} rating to ${newRating}/5 Stars.`);
      setTimeout(() => setActionNotice(''), 4000);
      fetchSkillsData();
    } catch (e) {
      console.error('Quick rating error:', e);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Filter skills based on search & category tab
  const filteredSkills = mySkills.filter((s) => {
    const isSoft =
      (s.category || '').toLowerCase().includes('soft') ||
      (s.category || '').toLowerCase().includes('aptitude') ||
      (s.category || '').toLowerCase().includes('communication');

    if (activeFilter === 'TECH' && isSoft) return false;
    if (activeFilter === 'SOFT' && !isSoft) return false;
    if (activeFilter === 'VERIFIED' && !s.verifiedViaAssessment) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.skillName.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.proficiency && s.proficiency.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const technicalCount = mySkills.filter(
    (s) => !(s.category || '').toLowerCase().includes('soft')
  ).length;
  const softCount = mySkills.filter((s) =>
    (s.category || '').toLowerCase().includes('soft')
  ).length;
  const verifiedCount = mySkills.filter((s) => s.verifiedViaAssessment).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="rose">Technical &amp; Soft Skills Matrix</Badge>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                <Mail className="w-3.5 h-3.5" />
                <span>Real-time Email Audit Active</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white light:text-rose-950 tracking-tight mt-2">
              Competency Matrix &amp; Skill Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 mt-1 max-w-2xl">
              Track both hard technical stacks and essential soft skills. Matrix modifications automatically recalculate your readiness score and dispatch transactional audit emails.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => handleOpenAddModal()}
            className="shadow-lg shadow-rose-600/30 font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 border-0"
          >
            Add Skill to Matrix
          </Button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-rose-500/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Matrix Skills</span>
            <Layers className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{mySkills.length}</div>
          <div className="text-[10px] text-rose-300 font-medium">Registered in profile</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-rose-500/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Technical Stack</span>
            <Cpu className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-pink-400">{technicalCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Core engineering skills</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-rose-500/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Soft &amp; Behavioral</span>
            <HeartHandshake className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">{softCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Leadership &amp; teamwork</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-rose-500/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Competencies</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-300 font-medium">Passed proctored tests</div>
        </div>
      </div>

      {/* Quick 1-Click Preset Suggestions */}
      <div className="glass-card rounded-3xl p-6 border border-rose-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 light:text-rose-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Recommended Industry Presets (1-Click Add)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any badge to register</span>
        </div>

        {/* Technical Chips */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block mb-2">
            Technical Stack:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_TECH_SKILLS.map((preset) => {
              const alreadyAdded = mySkills.some(
                (s) => s.skillName.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => !alreadyAdded && handleOpenAddModal(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    alreadyAdded
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-slate-900/80 hover:bg-rose-500/20 border border-rose-500/20 text-slate-200 hover:text-white cursor-pointer hover:border-rose-500/40'
                  }`}
                >
                  {alreadyAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Soft Skills Chips */}
        <div className="pt-2 border-t border-rose-500/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-2">
            Soft Skills &amp; Behavioral:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_SOFT_SKILLS.map((preset) => {
              const alreadyAdded = mySkills.some(
                (s) => s.skillName.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => !alreadyAdded && handleOpenAddModal(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    alreadyAdded
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-slate-900/80 hover:bg-pink-500/20 border border-pink-500/20 text-slate-200 hover:text-white cursor-pointer hover:border-pink-500/40'
                  }`}
                >
                  {alreadyAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-pink-400" />}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 light:bg-slate-200 border border-rose-500/30 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: `All Skills (${mySkills.length})` },
            { id: 'TECH', label: `Technical (${technicalCount})` },
            { id: 'SOFT', label: `Soft Skills (${softCount})` },
            { id: 'VERIFIED', label: `Verified (${verifiedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search registered skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      {/* Skills Matrix Cards Grid */}
      {filteredSkills.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-rose-500/20 space-y-3">
          <Award className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Skills Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {search
              ? `No skills match "${search}". Try clearing your search.`
              : 'Add technical stacks and soft skills to populate your competency matrix.'}
          </p>
          <Button variant="primary" size="sm" onClick={() => handleOpenAddModal()}>
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => {
            const isSoft =
              (skill.category || '').toLowerCase().includes('soft') ||
              (skill.category || '').toLowerCase().includes('aptitude');

            return (
              <div
                key={skill._id}
                className="glass-card rounded-3xl p-5 border border-rose-500/20 flex flex-col justify-between space-y-4 hover:border-rose-500/40 transition shadow-xl relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={isSoft ? 'pink' : 'rose'} size="sm">
                      {skill.category || (isSoft ? 'Soft Skills' : 'Technical')}
                    </Badge>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEditModal(skill)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill._id, skill.skillName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white light:text-rose-950 mt-2">
                    {skill.skillName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Proficiency:{' '}
                    <span className="text-rose-300 light:text-rose-800 font-bold">
                      {skill.proficiency || 'Intermediate'}
                    </span>
                  </p>
                </div>

                {/* Star Rating Interactive Bar */}
                <div className="space-y-2 pt-3 border-t border-rose-500/15">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Self Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleQuickStarRating(skill, star)}
                          className="focus:outline-hidden group/star p-0.5"
                          title={`Rate ${star} Stars`}
                        >
                          <Star
                            className={`w-4 h-4 transition ${
                              star <= (skill.selfRating || 3)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-amber-400 font-bold ml-1 text-xs">
                        {skill.selfRating || 3}/5
                      </span>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Assessment Check:</span>
                    {skill.verifiedViaAssessment ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified ({skill.verifiedScore}%)
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Self-Reported</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Skill: ${currentSkill.skillName}` : 'Add Skill to Competency Matrix'}
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 light:text-slate-800 mb-1 block">
              Skill Name *
            </label>
            <input
              type="text"
              list="master-skills-datalist"
              value={currentSkill.skillName}
              onChange={(e) => setCurrentSkill({ ...currentSkill, skillName: e.target.value })}
              placeholder="e.g. Java, React.js, Problem-Solving, Teamwork..."
              required
              disabled={isEditing}
              className="w-full bg-slate-900 light:bg-white border border-rose-500/30 text-sm rounded-xl p-3 text-white light:text-slate-900 outline-none focus:border-rose-500"
            />
            <datalist id="master-skills-datalist">
              {masterSkills.map((ms) => (
                <option key={ms._id} value={ms.name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-300 light:text-slate-800">
                Skill Domain / Category
              </label>
              <select
                value={currentSkill.category}
                onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                className="bg-slate-900 light:bg-white border border-rose-500/30 text-xs rounded-xl p-3 text-white light:text-slate-900 outline-none focus:border-rose-500"
              >
                <optgroup label="Technical Engineering">
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend &amp; APIs</option>
                  <option value="Database">Database &amp; Storage</option>
                  <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                  <option value="Core CS">Core CS &amp; Algorithms</option>
                  <option value="Data & AI">Data Engineering &amp; AI</option>
                </optgroup>
                <optgroup label="Soft Skills &amp; Behavioral">
                  <option value="Soft Skills">Soft Skills &amp; Problem Solving</option>
                  <option value="Communication">Communication &amp; Presentation</option>
                  <option value="Leadership">Leadership &amp; Management</option>
                  <option value="Aptitude & Logical">Aptitude &amp; Logical Reasoning</option>
                </optgroup>
              </select>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-300 light:text-slate-800">
                Proficiency Level
              </label>
              <select
                value={currentSkill.proficiency}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill, proficiency: e.target.value })
                }
                className="bg-slate-900 light:bg-white border border-rose-500/30 text-xs rounded-xl p-3 text-white light:text-slate-900 outline-none focus:border-rose-500"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Practiced)</option>
                <option value="Advanced">Advanced (Production Ready)</option>
                <option value="Expert">Expert (Architecture Level)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 light:text-slate-800 mb-1">
              <span>Self-Assessment Star Rating:</span>
              <span className="text-amber-400 font-bold">{currentSkill.selfRating} / 5 Stars</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={currentSkill.selfRating}
              onChange={(e) =>
                setCurrentSkill({ ...currentSkill, selfRating: parseInt(e.target.value) })
              }
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1★ Novice</span>
              <span>3★ Competent</span>
              <span>5★ Master</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 light:bg-slate-100 border border-rose-500/20 text-[11px] text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Saving will automatically recalculate your readiness score and dispatch an audited diff email.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {isEditing ? 'Update Skill' : 'Save to Matrix'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

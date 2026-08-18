import React, { useState, useEffect } from 'react';
import { skillApi } from '../../../api/apis';
import { Award, Plus, Trash2, Star, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { Button, Input, Badge, Modal, Spinner } from '../../common/UIElements';

export const SkillsPage = () => {
  const [loading, setLoading] = useState(true);
  const [mySkills, setMySkills] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [newSkill, setNewSkill] = useState({
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
      if (resMy.data.success) setMySkills(resMy.data.skills || []);
      if (resMaster.data.success) setMasterSkills(resMaster.data.skills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skillName) return;

    try {
      await skillApi.saveMySkill(newSkill);
      setIsAddModalOpen(false);
      setNewSkill({ skillName: '', category: 'Frontend', proficiency: 'Intermediate', selfRating: 4 });
      fetchSkillsData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await skillApi.deleteMySkill(id);
      setMySkills((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const filteredSkills = mySkills.filter((s) =>
    s.skillName.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Technical & Soft Skills Matrix</h1>
          <p className="text-xs text-slate-400">Rate your proficiencies and verify competencies via assessments</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add New Skill
        </Button>
      </div>

      {/* Search and Category Summary */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search added skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Total Skills: <strong className="text-white">{mySkills.length}</strong></span>
          <span>•</span>
          <span>Verified: <strong className="text-emerald-400">{mySkills.filter(s => s.verifiedViaAssessment).length}</strong></span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div key={skill._id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="indigo" size="sm">{skill.category}</Badge>
                <h3 className="text-base font-bold text-white mt-1.5">{skill.skillName}</h3>
                <p className="text-xs text-slate-400">Proficiency: <span className="text-slate-200 font-medium">{skill.proficiency}</span></p>
              </div>

              <button
                onClick={() => handleDeleteSkill(skill._id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {/* Star Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Self Rating:</span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= skill.selfRating ? 'fill-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Assessment Verification Badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Assessment Check:</span>
                {skill.verifiedViaAssessment ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified ({skill.verifiedScore}%)
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Unverified</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Skill to Profile">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Choose or Type Skill</label>
            <input
              type="text"
              list="master-skills-list"
              value={newSkill.skillName}
              onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
              placeholder="e.g. React.js, Python, Docker..."
              required
              className="w-full bg-slate-900 border border-slate-700 text-sm rounded-xl p-2.5 mt-1 text-white outline-none focus:border-indigo-500"
            />
            <datalist id="master-skills-list">
              {masterSkills.map((ms) => (
                <option key={ms._id} value={ms.name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Core CS">Core CS / Algorithms</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Aptitude & Soft Skills">Aptitude & Soft Skills</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-slate-300">Proficiency</label>
              <select
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Self Rating:</span>
              <span className="text-amber-400 font-bold">{newSkill.selfRating} / 5 Stars</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={newSkill.selfRating}
              onChange={(e) => setNewSkill({ ...newSkill, selfRating: parseInt(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Skill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

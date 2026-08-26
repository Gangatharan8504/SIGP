import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Layers,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  BookOpen,
  Languages,
  Check,
  Send,
  Zap,
  Palette,
  Type,
} from 'lucide-react';
import { Button, Input, Badge, Spinner } from '../common/UIElements';
import {
  ATSSwanTemplate,
  ModernBearTemplate,
  MinimalRavenTemplate,
  FresherPenguinTemplate,
} from './ResumeTemplates';
import { DEFAULT_RESUME_DATA } from '../../utils/defaultResume';
import { generatePdfFromElement, printResumeElement } from '../../utils/pdfGenerator';
import { resumeApi } from '../../api/apis';
import confetti from 'canvas-confetti';

const GORESUME_TEMPLATES = [
  { id: 'swan', name: 'Swan (ATS Single-Column)', archetype: 'ATS Standard', chosen: '5.1K users', desc: 'Highest ATS readability' },
  { id: 'bear', name: 'Bear (Modern Accent)', archetype: 'Modern Tech', chosen: '4.8K users', desc: 'Clean sidebar accent' },
  { id: 'raven', name: 'Raven (Minimal B&W)', archetype: 'Clean Minimal', chosen: '4.2K users', desc: 'High-contrast monochrome' },
  { id: 'penguin', name: 'Penguin (Fresher/Student)', archetype: 'University First', chosen: '5.5K users', desc: 'Education & Projects first' },
];

const COLOR_SWATCHES = [
  { id: 'indigo', name: 'Indigo', hex: '#4f46e5' },
  { id: 'purple', name: 'Purple', hex: '#9333ea' },
  { id: 'rose', name: 'Rose', hex: '#e11d48' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'slate', name: 'Slate', hex: '#0f172a' },
  { id: 'navy', name: 'Navy', hex: '#1e3a8a' },
];

const FONT_OPTIONS = [
  { id: 'sans', name: 'Modern Sans' },
  { id: 'serif', name: 'Classic Serif' },
  { id: 'mono', name: 'Clean Mono' },
];

export const ResumeBuilder = ({ onSendToATS }) => {
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('sgip_resume_maker_data');
      return saved ? JSON.parse(saved) : DEFAULT_RESUME_DATA;
    } catch (e) {
      return DEFAULT_RESUME_DATA;
    }
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('swan');
  const [themeColor, setThemeColor] = useState('indigo');
  const [fontFamily, setFontFamily] = useState('sans');
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isImprovingProjId, setIsImprovingProjId] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);

  // Skill input state
  const [skillInputs, setSkillInputs] = useState({
    programming: '',
    frontend: '',
    backend: '',
    database: '',
    tools: '',
  });

  const previewRef = useRef(null);

  // Auto-save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('sgip_resume_maker_data', JSON.stringify(resumeData));
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [resumeData]);

  // Calculate live ATS Completeness Score
  const calculateATSScore = () => {
    let score = 0;
    const { personalInfo, summary, education, skills, projects, experience, certifications } = resumeData;

    if (personalInfo.fullName && personalInfo.email && personalInfo.phone) score += 20;
    if (personalInfo.linkedinUrl || personalInfo.githubUrl) score += 10;
    if (summary && summary.length > 50) score += 15;
    if (education && education.length > 0) score += 15;
    if (skills && Object.values(skills).some((arr) => arr?.length >= 3)) score += 15;
    if (projects && projects.length >= 1) score += 15;
    if (experience && experience.length >= 1) score += 5;
    if (certifications && certifications.length >= 1) score += 5;

    return Math.min(100, score);
  };

  const atsScore = calculateATSScore();

  // Helper to update personalInfo
  const handlePersonalChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Helper to generate AI summary
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const allSkills = Object.values(resumeData.skills || {}).flat().filter(Boolean);
      const res = await resumeApi.generateSummary({
        targetRole: resumeData.personalInfo?.professionalTitle || 'Software Engineer',
        skills: allSkills,
        degree: resumeData.education?.[0]?.degree || '',
      });

      if (res.data?.success && res.data.summary) {
        setResumeData((prev) => ({ ...prev, summary: res.data.summary }));
        setNotification({ type: 'success', text: '✨ Professional summary generated with AI!' });
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (e) {
      console.error('AI summary error:', e);
      setNotification({ type: 'error', text: 'Could not generate summary. Please try again.' });
      setTimeout(() => setNotification(null), 3500);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Helper to improve project description
  const handleImproveProject = async (projId) => {
    const targetProj = resumeData.projects.find((p) => p.id === projId);
    if (!targetProj) return;

    setIsImprovingProjId(projId);
    try {
      const res = await resumeApi.improveProject({
        projectName: targetProj.name,
        technologies: targetProj.technologies,
        rawDescription: targetProj.description,
      });

      if (res.data?.success && res.data.improvedDescription) {
        setResumeData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === projId ? { ...p, description: res.data.improvedDescription } : p
          ),
        }));
        setNotification({ type: 'success', text: '🚀 Project description enhanced with Google XYZ action verbs!' });
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (e) {
      console.error('Project improve error:', e);
    } finally {
      setIsImprovingProjId(null);
    }
  };

  // Skill Add / Remove
  const handleAddSkill = (category) => {
    const val = skillInputs[category]?.trim();
    if (!val) return;

    setResumeData((prev) => {
      const currentList = prev.skills[category] || [];
      if (currentList.includes(val)) return prev;
      return {
        ...prev,
        skills: { ...prev.skills, [category]: [...currentList, val] },
      };
    });

    setSkillInputs((prev) => ({ ...prev, [category]: '' }));
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills[category] || []).filter((s) => s !== skillToRemove),
      },
    }));
  };

  // Education Helpers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu_${Date.now()}`,
      degree: 'B.Tech Information Technology',
      institution: 'University / College Name',
      location: 'City, State',
      startYear: '2023',
      endYear: '2027',
      cgpa: '8.0',
      description: '',
    };
    setResumeData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleRemoveEducation = (id) => {
    setResumeData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  // Experience Helpers
  const handleAddExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}`,
      jobTitle: 'Software Engineering Intern',
      company: 'Company Name',
      location: 'City, Country',
      startDate: 'June 2026',
      endDate: 'August 2026',
      currentlyWorking: false,
      description: '• Developed core frontend and backend components.\n• Implemented RESTful APIs and optimized database queries.',
    };
    setResumeData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const handleRemoveExperience = (id) => {
    setResumeData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  };

  // Project Helpers
  const handleAddProject = () => {
    const newProj = {
      id: `proj_${Date.now()}`,
      name: 'Full Stack Web Project',
      technologies: 'React.js, Node.js, MongoDB',
      description: '• Built responsive user interfaces and secure RESTful APIs.\n• Implemented database schema and real-time state synchronization.',
      githubUrl: 'https://github.com/example/project',
      demoUrl: '',
    };
    setResumeData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const handleRemoveProject = (id) => {
    setResumeData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  // Certification Helpers
  const handleAddCert = () => {
    const newCert = {
      id: `cert_${Date.now()}`,
      name: 'Certification Title',
      organization: 'Issuing Organization',
      issueDate: '2026',
      credentialUrl: '',
    };
    setResumeData((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const handleRemoveCert = (id) => {
    setResumeData((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c.id !== id) }));
  };

  // Achievement Helpers
  const handleAddAchievement = () => {
    const newAch = {
      id: `ach_${Date.now()}`,
      title: 'Achievement Title',
      description: 'Brief description of award, ranking, or competitive coding milestone.',
    };
    setResumeData((prev) => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  };

  const handleRemoveAchievement = (id) => {
    setResumeData((prev) => ({ ...prev, achievements: prev.achievements.filter((a) => a.id !== id) }));
  };

  // Download PDF Handler (Strict 1-Page)
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const fileName = `${(resumeData.personalInfo?.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`;
      const success = await generatePdfFromElement(previewRef.current, fileName);

      if (success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setNotification({ type: 'success', text: `✓ 1-Page ${fileName} downloaded successfully!` });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Reset or Clear
  const handleClearResume = () => {
    if (window.confirm('Are you sure you want to clear the resume? This will reset all fields.')) {
      setResumeData({
        personalInfo: { fullName: '', professionalTitle: '', email: '', phone: '', location: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '' },
        summary: '',
        education: [],
        skills: { programming: [], frontend: [], backend: [], database: [], tools: [] },
        experience: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        interests: [],
      });
    }
  };

  const handleResetToSample = () => {
    if (window.confirm('Reset resume to standard sample data?')) {
      setResumeData(DEFAULT_RESUME_DATA);
    }
  };

  // Convert to plain text for ATS analysis
  const handleAnalyzeInATS = () => {
    const p = resumeData.personalInfo || {};
    let text = `${p.fullName || 'NAME'}\n`;
    text += `${p.phone || ''} | ${p.email || ''} | ${p.location || ''}\n`;
    if (p.linkedinUrl) text += `LinkedIn: ${p.linkedinUrl} | `;
    if (p.githubUrl) text += `GitHub: ${p.githubUrl} | `;
    if (p.portfolioUrl) text += `Portfolio: ${p.portfolioUrl}`;
    text += `\n\nPROFESSIONAL SUMMARY\n${resumeData.summary || ''}\n\n`;

    if (resumeData.education?.length > 0) {
      text += `EDUCATION\n`;
      resumeData.education.forEach((e) => {
        text += `${e.degree} - ${e.institution} (${e.startYear} - ${e.endYear})\nCGPA: ${e.cgpa}\n`;
      });
      text += `\n`;
    }

    if (resumeData.skills) {
      text += `TECHNICAL SKILLS\n`;
      Object.entries(resumeData.skills).forEach(([cat, list]) => {
        if (list?.length > 0) text += `• ${cat.toUpperCase()}: ${list.join(', ')}\n`;
      });
      text += `\n`;
    }

    if (resumeData.projects?.length > 0) {
      text += `PROJECTS\n`;
      resumeData.projects.forEach((proj) => {
        text += `${proj.name} (${proj.technologies})\n${proj.description}\n`;
      });
      text += `\n`;
    }

    if (resumeData.experience?.length > 0) {
      text += `EXPERIENCE\n`;
      resumeData.experience.forEach((exp) => {
        text += `${exp.jobTitle} - ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}\n`;
      });
      text += `\n`;
    }

    if (onSendToATS) {
      onSendToATS(text, p.professionalTitle || 'Full Stack Software Engineer');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950 border-red-500/50 text-red-300'
          }`}
        >
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* GoResume-Style Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold font-mono">
                ⚡ GoResume.io Engine
              </span>
              <span className="text-xs text-purple-300 font-mono font-bold">
                80+ ATS Templates &bull; Land 3x More Interviews
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Build your ATS Resume <span className="text-purple-400">in just 2 minutes for FREE!</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Strict ATS-friendly templates trusted by technical recruiters worldwide. Guaranteed 1-page PDF export with zero formatting loss.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleResetToSample}
              className="text-xs text-slate-300 hover:text-white border border-slate-800"
            >
              Load Sample
            </Button>

            <Button
              variant="ghost"
              size="xs"
              icon={Trash2}
              onClick={handleClearResume}
              className="text-xs text-rose-400 hover:text-rose-300 border border-slate-800"
            >
              Clear
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Printer}
              onClick={() => printResumeElement(previewRef.current)}
              className="text-xs font-bold"
            >
              Print 1-Page
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Download}
              loading={isDownloadingPdf}
              onClick={handleDownloadPdf}
              className="bg-purple-600 hover:bg-purple-500 font-bold shadow-lg shadow-purple-950/50 text-white"
            >
              Download 1-Page PDF
            </Button>
          </div>
        </div>

        {/* GoResume Template Selector Grid Carousel */}
        <div className="mt-6 pt-5 border-t border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Choose an ATS Template</span>
            <span className="text-[11px] text-slate-400 font-mono">100% Recruiter Tested</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GORESUME_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedTemplate === tmpl.id
                    ? 'bg-purple-950/80 border-purple-500 shadow-lg shadow-purple-950/50 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{tmpl.name}</span>
                  {selectedTemplate === tmpl.id && <Check className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{tmpl.desc}</p>
                <span className="inline-block mt-2 text-[9px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded">
                  ★ Chosen by {tmpl.chosen}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Resume Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Section Pills */}
          <div className="glass-panel rounded-2xl p-2 border border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'personal', label: '1. Personal' },
              { id: 'summary', label: '2. Summary' },
              { id: 'education', label: '3. Education' },
              { id: 'skills', label: '4. Skills' },
              { id: 'experience', label: '5. Experience' },
              { id: 'projects', label: '6. Projects' },
              { id: 'certifications', label: '7. Certs & More' },
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Form Content Cards */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4 text-xs">
            {/* 1. PERSONAL INFO */}
            {activeSection === 'personal' && (
              <div className="space-y-3.5">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Information</h3>
                  <p className="text-[11px] text-slate-400">Enter your full name and contact details.</p>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Alex Johnson"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    required
                  />

                  <Input
                    label="Professional Target Role / Title"
                    placeholder="e.g. Full Stack Software Engineer"
                    value={resumeData.personalInfo.professionalTitle}
                    onChange={(e) => handlePersonalChange('professionalTitle', e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="alex.dev@example.com"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      required
                    />

                    <Input
                      label="Phone Number"
                      placeholder="+91 98765 43210"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    />
                  </div>

                  <Input
                    label="Location (City, State, Country)"
                    placeholder="Chennai, Tamil Nadu, India"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="LinkedIn Profile URL"
                      placeholder="https://linkedin.com/in/username"
                      value={resumeData.personalInfo.linkedinUrl}
                      onChange={(e) => handlePersonalChange('linkedinUrl', e.target.value)}
                    />

                    <Input
                      label="GitHub Profile URL"
                      placeholder="https://github.com/username"
                      value={resumeData.personalInfo.githubUrl}
                      onChange={(e) => handlePersonalChange('githubUrl', e.target.value)}
                    />
                  </div>

                  <Input
                    label="Portfolio Website URL"
                    placeholder="https://yourportfolio.dev"
                    value={resumeData.personalInfo.portfolioUrl}
                    onChange={(e) => handlePersonalChange('portfolioUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 2. SUMMARY */}
            {activeSection === 'summary' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Professional Summary</h3>
                    <p className="text-[11px] text-slate-400">A concise 3-sentence summary of your core strengths.</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Sparkles}
                    loading={isGeneratingSummary}
                    onClick={handleGenerateSummary}
                    className="bg-purple-600/30 text-purple-300 border-purple-500/40 hover:bg-purple-600/50"
                  >
                    Generate with AI
                  </Button>
                </div>

                <textarea
                  rows={6}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a concise career summary or click 'Generate with AI'..."
                  className="w-full bg-slate-950 border border-slate-700 text-xs rounded-2xl p-3 text-slate-200 outline-none focus:border-purple-500 transition leading-relaxed"
                />
              </div>
            )}

            {/* 3. EDUCATION */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Education &amp; Academics</h3>
                    <p className="text-[11px] text-slate-400">Add your college degree and schooling records.</p>
                  </div>
                  <Button variant="secondary" size="xs" icon={Plus} onClick={handleAddEducation}>
                    Add Degree
                  </Button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between text-slate-400 font-bold text-[11px]">
                      <span>Degree Entry #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Input
                      label="Degree / Certificate Name"
                      value={edu.degree}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => (item.id === edu.id ? { ...item, degree: e.target.value } : item)),
                        }))
                      }
                      placeholder="e.g. B.Tech in Information Technology"
                    />

                    <Input
                      label="College / Institution / Board"
                      value={edu.institution}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          education: prev.education.map((item) => (item.id === edu.id ? { ...item, institution: e.target.value } : item)),
                        }))
                      }
                      placeholder="e.g. V.S.B Engineering College"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="Start Year"
                        value={edu.startYear}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            education: prev.education.map((item) => (item.id === edu.id ? { ...item, startYear: e.target.value } : item)),
                          }))
                        }
                        placeholder="2023"
                      />
                      <Input
                        label="End Year"
                        value={edu.endYear}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            education: prev.education.map((item) => (item.id === edu.id ? { ...item, endYear: e.target.value } : item)),
                          }))
                        }
                        placeholder="2027"
                      />
                      <Input
                        label="CGPA / %"
                        value={edu.cgpa}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            education: prev.education.map((item) => (item.id === edu.id ? { ...item, cgpa: e.target.value } : item)),
                          }))
                        }
                        placeholder="8.4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. TECHNICAL SKILLS */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Categorized Technical Skills</h3>
                  <p className="text-[11px] text-slate-400">Type a skill and press Enter or click Add.</p>
                </div>

                {[
                  { key: 'programming', label: 'Programming Languages', placeholder: 'Java, Python, C++, JavaScript' },
                  { key: 'frontend', label: 'Frontend Technologies', placeholder: 'React.js, Tailwind CSS, HTML5, CSS3' },
                  { key: 'backend', label: 'Backend & APIs', placeholder: 'Node.js, Express.js, REST APIs, Microservices' },
                  { key: 'database', label: 'Databases & Caching', placeholder: 'MongoDB, MySQL, PostgreSQL, Redis' },
                  { key: 'tools', label: 'Developer Tools & Cloud', placeholder: 'Git, GitHub, Docker, Postman, Linux' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <label className="text-[11px] font-bold text-slate-300 block">{label}</label>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 min-h-6">
                      {(resumeData.skills[key] || []).map((sk) => (
                        <span
                          key={sk}
                          className="bg-purple-950 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <span>{sk}</span>
                          <button
                            onClick={() => handleRemoveSkill(key, sk)}
                            className="text-purple-400 hover:text-white cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={skillInputs[key]}
                        onChange={(e) => setSkillInputs({ ...skillInputs, [key]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(key);
                          }
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500"
                      />
                      <Button variant="secondary" size="xs" onClick={() => handleAddSkill(key)}>
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. EXPERIENCE */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Experience &amp; Internships</h3>
                    <p className="text-[11px] text-slate-400">Add internships, freelance, or work experience.</p>
                  </div>
                  <Button variant="secondary" size="xs" icon={Plus} onClick={handleAddExperience}>
                    Add Experience
                  </Button>
                </div>

                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-slate-400 font-bold text-[11px]">
                      <span>Experience #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Job / Internship Title"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item) => (item.id === exp.id ? { ...item, jobTitle: e.target.value } : item)),
                          }))
                        }
                        placeholder="e.g. Full Stack Intern"
                      />

                      <Input
                        label="Company / Organization"
                        value={exp.company}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item) => (item.id === exp.id ? { ...item, company: e.target.value } : item)),
                          }))
                        }
                        placeholder="e.g. NexGen Tech"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item) => (item.id === exp.id ? { ...item, startDate: e.target.value } : item)),
                          }))
                        }
                        placeholder="June 2026"
                      />

                      <Input
                        label="End Date"
                        value={exp.endDate}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item) => (item.id === exp.id ? { ...item, endDate: e.target.value } : item)),
                          }))
                        }
                        placeholder="August 2026"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Bullet Point Responsibilities</label>
                      <textarea
                        rows={4}
                        value={exp.description}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            experience: prev.experience.map((item) => (item.id === exp.id ? { ...item, description: e.target.value } : item)),
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white outline-none focus:border-purple-500 leading-relaxed font-mono"
                        placeholder="• Developed features...\n• Improved response latency..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. PROJECTS */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Projects</h3>
                    <p className="text-[11px] text-slate-400">Showcase software development capstone projects.</p>
                  </div>
                  <Button variant="secondary" size="xs" icon={Plus} onClick={handleAddProject}>
                    Add Project
                  </Button>
                </div>

                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-slate-400 font-bold text-[11px]">
                      <span>Project #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Input
                      label="Project Title"
                      value={proj.name}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, name: e.target.value } : item)),
                        }))
                      }
                      placeholder="e.g. E-Waste Recycling Platform"
                    />

                    <Input
                      label="Technologies Used"
                      value={proj.technologies}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, technologies: e.target.value } : item)),
                        }))
                      }
                      placeholder="React.js, Node.js, Express, MongoDB"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="GitHub Code URL"
                        value={proj.githubUrl}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, githubUrl: e.target.value } : item)),
                          }))
                        }
                        placeholder="https://github.com/..."
                      />

                      <Input
                        label="Live Demo Link"
                        value={proj.demoUrl}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, demoUrl: e.target.value } : item)),
                          }))
                        }
                        placeholder="https://demo.vercel.app"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Project Description Bullets</label>
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Sparkles}
                          loading={isImprovingProjId === proj.id}
                          onClick={() => handleImproveProject(proj.id)}
                          className="text-[10px] text-purple-400 hover:text-purple-300 py-0.5 px-2"
                        >
                          Improve with AI
                        </Button>
                      </div>
                      <textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, description: e.target.value } : item)),
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl p-2.5 text-white outline-none focus:border-purple-500 leading-relaxed font-mono"
                        placeholder="• Engineered platform with..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. CERTS & ACHIEVEMENTS */}
            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Certifications &amp; Awards</h3>
                    <p className="text-[11px] text-slate-400">Add credentials, honors, and hackathon wins.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="xs" icon={Plus} onClick={handleAddCert}>
                      + Cert
                    </Button>
                    <Button variant="secondary" size="xs" icon={Plus} onClick={handleAddAchievement}>
                      + Award
                    </Button>
                  </div>
                </div>

                {/* Certifications List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Certifications:</span>
                  {resumeData.certifications.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.organization} &bull; {c.issueDate}</p>
                      </div>
                      <button onClick={() => handleRemoveCert(c.id)} className="text-rose-400 hover:text-rose-300 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Achievements List */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 block">Achievements &amp; Honors:</span>
                  {resumeData.achievements.map((a) => (
                    <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{a.title}</p>
                        <p className="text-[10px] text-slate-400">{a.description}</p>
                      </div>
                      <button onClick={() => handleRemoveAchievement(a.id)} className="text-rose-400 hover:text-rose-300 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GoResume-Style Live 1-Page A4 Canvas + Customizer */}
        <div className="lg:col-span-7 space-y-4">
          {/* Style Customizer Toolbar */}
          <div className="glass-panel rounded-2xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 shadow-xl">
            {/* Color Swatch Picker */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Palette className="w-3 h-3 text-purple-400" /> Color:
              </span>
              <div className="flex items-center gap-1.5">
                {COLOR_SWATCHES.map((sw) => (
                  <button
                    key={sw.id}
                    onClick={() => setThemeColor(sw.id)}
                    style={{ backgroundColor: sw.hex }}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer border ${
                      themeColor === sw.id ? 'ring-2 ring-purple-400 scale-110 border-white' : 'border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                    title={sw.name}
                  />
                ))}
              </div>
            </div>

            {/* Typography Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Type className="w-3 h-3 text-purple-400" /> Font:
              </span>
              <div className="flex gap-1">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      fontFamily === f.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Controls & Score */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-0.5">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.1))}
                  className="text-slate-400 hover:text-white text-xs font-mono p-1"
                >
                  -
                </button>
                <span className="text-[10px] font-mono text-slate-300 font-bold px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(1.2, prev + 0.1))}
                  className="text-slate-400 hover:text-white text-xs font-mono p-1"
                >
                  +
                </button>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-bold font-mono">
                ATS Score: {atsScore}%
              </div>
            </div>
          </div>

          {/* Strict 1-Page A4 Canvas */}
          <div className="w-full overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-4 flex justify-center shadow-2xl">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                width: '210mm',
                height: '297mm',
                maxHeight: '297mm',
              }}
              className="transition-transform duration-200"
            >
              <div id="printable-resume-canvas" ref={previewRef} className="rounded shadow-2xl overflow-hidden print:shadow-none bg-white">
                {selectedTemplate === 'swan' && <ATSSwanTemplate data={resumeData} themeColor={themeColor} font={fontFamily} />}
                {selectedTemplate === 'bear' && <ModernBearTemplate data={resumeData} themeColor={themeColor} font={fontFamily} />}
                {selectedTemplate === 'raven' && <MinimalRavenTemplate data={resumeData} />}
                {selectedTemplate === 'penguin' && <FresherPenguinTemplate data={resumeData} themeColor={themeColor} font={fontFamily} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Award,
  Code,
  Globe,
  Phone,
  Calendar,
  CheckCircle2,
  Upload,
  FileText,
  X,
  AlertCircle,
} from 'lucide-react';
import { Button, Input } from '../common/UIElements';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    rollNumber: '',
    registerNumber: '',
    department: 'Computer Science and Engineering',
    batch: '2023-2027',
    batchYear: 2027,
    graduationYear: 2027,
    collegeName: 'Institute of Technology & Engineering',
    // Step 2: Academic
    tenthPercentage: '',
    tenthBoard: 'CBSE',
    twelfthOrDiplomaPercentage: '',
    twelfthBoard: 'State Board',
    currentDegree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    currentSemester: '7',
    cgpa: '',
    activeBacklogs: '0',
    clearedArrears: '0',
    gapYears: '0',
    // Step 3: Professional & Coding
    targetRole: 'Full Stack Software Engineer',
    skills: 'JavaScript, React, Node.js, DSA',
    leetcode: '',
    codechef: '',
    hackerrank: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    setResumeError('');
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setResumeError('Invalid resume file. Please upload a valid PDF or DOCX resume.');
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume file size must be less than 5MB.');
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
        setError('Please fill in Name, Email, and Password.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Split skills string into array
      const parsedSkills = formData.skills
        ? formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((name) => ({ skillName: name, category: 'General', selfRating: 4 }))
        : [];

      await register({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: 'student',
        tenthPercentage: formData.tenthPercentage ? Number(formData.tenthPercentage) : null,
        twelfthOrDiplomaPercentage: formData.twelfthOrDiplomaPercentage ? Number(formData.twelfthOrDiplomaPercentage) : null,
        currentSemester: formData.currentSemester ? Number(formData.currentSemester) : null,
        cgpa: formData.cgpa ? Number(formData.cgpa) : null,
        activeBacklogs: Number(formData.activeBacklogs) || 0,
        clearedArrears: Number(formData.clearedArrears) || 0,
        gapYears: Number(formData.gapYears) || 0,
        batchYear: Number(formData.batchYear) || 2027,
        graduationYear: Number(formData.graduationYear) || 2027,
        skills: parsedSkills,
        codingProfiles: {
          leetcode: formData.leetcode || '',
          codechef: formData.codechef || '',
          hackerrank: formData.hackerrank || '',
          github: formData.githubUrl || '',
          linkedin: formData.linkedinUrl || '',
          portfolio: formData.portfolioUrl || '',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message?.includes('Network Error')) {
        setError('Network Error: Unable to connect to backend server. Please verify your connection.');
      } else {
        setError('Registration failed. Please check the entered data and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-10 px-4 overflow-hidden">
      {/* Background Ambient Red-Pink Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-600/20 to-transparent blur-3xl pointer-events-none animate-glow-pink" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-bl from-pink-600/25 via-red-600/20 to-transparent blur-3xl pointer-events-none animate-glow-pink" style={{ animationDelay: '2.5s' }} />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-rose-500/20 shadow-2xl relative">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Step Student Registration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Create Candidate Account
            </h1>
            <p className="text-xs text-rose-200/80">
              Step {step} of 3 &bull;{' '}
              {step === 1
                ? 'Personal Information'
                : step === 2
                ? 'Academic Credentials & Backlogs'
                : 'Professional, Skills & Resume Upload'}
            </p>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div
                className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
                  step >= 1 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-slate-800'
                }`}
              />
              <div
                className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
                  step >= 2 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-slate-800'
                }`}
              />
              <div
                className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
                  step >= 3 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-slate-800'
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  name="name"
                  placeholder="e.g. Gangatharan M"
                  value={formData.name}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  label="Email Address *"
                  name="email"
                  type="email"
                  placeholder="gangatharan@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password *"
                  name="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="e.g. +91 7666578504"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Register Number"
                  name="registerNumber"
                  placeholder="e.g. 721422104035"
                  value={formData.registerNumber}
                  onChange={handleChange}
                />
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  icon={Calendar}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-rose-100 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-900/90 border border-rose-500/30 text-slate-100 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  >
                    <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics and Communication">Electronics & Communication</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-rose-100 flex items-center gap-1.5">
                    Graduation Year
                  </label>
                  <select
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full bg-slate-900/90 border border-rose-500/30 text-slate-100 text-xs rounded-xl py-2.5 px-3.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 shadow-xl shadow-rose-600/30 border-0"
                icon={ArrowRight}
              >
                Proceed to Academic Credentials (Step 2)
              </Button>
            </form>
          )}

          {/* Step 2: Academic Credentials */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="10th Percentage / CGPA *"
                  name="tenthPercentage"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 88.5"
                  value={formData.tenthPercentage}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="10th Board"
                  name="tenthBoard"
                  placeholder="CBSE / ICSE / State Board"
                  value={formData.tenthBoard}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="12th / Diploma Percentage *"
                  name="twelfthOrDiplomaPercentage"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 85.0"
                  value={formData.twelfthOrDiplomaPercentage}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="12th Board / Polytechnic"
                  name="twelfthBoard"
                  placeholder="CBSE / State Board"
                  value={formData.twelfthBoard}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Degree & Branch"
                  name="currentDegree"
                  placeholder="B.Tech Computer Science"
                  value={formData.currentDegree}
                  onChange={handleChange}
                />
                <Input
                  label="Cumulative CGPA (on 10.0 scale) *"
                  name="cgpa"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 8.4"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Current Semester"
                  name="currentSemester"
                  type="number"
                  placeholder="e.g. 7"
                  value={formData.currentSemester}
                  onChange={handleChange}
                />
                <Input
                  label="Active Backlogs *"
                  name="activeBacklogs"
                  type="number"
                  placeholder="0"
                  value={formData.activeBacklogs}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cleared Arrears History"
                  name="clearedArrears"
                  type="number"
                  placeholder="0"
                  value={formData.clearedArrears}
                  onChange={handleChange}
                />
                <Input
                  label="Education Gap Years"
                  name="gapYears"
                  type="number"
                  placeholder="0"
                  value={formData.gapYears}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-2/3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 shadow-xl shadow-rose-600/30 border-0"
                  icon={ArrowRight}
                >
                  Proceed to Skills &amp; Resume (Step 3)
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Professional, Coding Profiles & Resume Upload */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Target Job Role"
                name="targetRole"
                placeholder="e.g. Full Stack Software Engineer"
                value={formData.targetRole}
                onChange={handleChange}
                icon={Sparkles}
              />

              <Input
                label="Skills (Comma-Separated)"
                name="skills"
                placeholder="e.g. React, Node.js, Python, PostgreSQL, Data Structures"
                value={formData.skills}
                onChange={handleChange}
                icon={Code}
              />

              {/* Resume Upload File Box */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-rose-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    Resume Upload (.pdf or .docx only)
                  </span>
                  <span className="text-[10px] text-rose-300 font-normal">Optional - Can also upload in dashboard</span>
                </label>

                <div className="relative">
                  <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-dashed border-rose-500/40 hover:border-rose-500 cursor-pointer transition group">
                    <Upload className="w-6 h-6 text-rose-400 group-hover:scale-110 transition duration-200 mb-1" />
                    <span className="text-xs font-bold text-rose-200">
                      {resumeFile ? resumeFile.name : "Click to select or drag PDF / DOCX resume"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : "Supports unencrypted PDF or DOCX (Max 5MB)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>

                  {resumeFile && (
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {resumeError && (
                  <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {resumeError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Profile URL"
                  name="githubUrl"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  icon={Code}
                />
                <Input
                  label="LinkedIn Profile URL"
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  icon={Globe}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="LeetCode Profile / Username"
                  name="leetcode"
                  placeholder="e.g. leetcode_user"
                  value={formData.leetcode}
                  onChange={handleChange}
                />
                <Input
                  label="Portfolio Website URL"
                  name="portfolioUrl"
                  placeholder="https://myportfolio.dev"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  icon={Globe}
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-[11px] text-rose-200">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  All metrics will be calculated purely from your authentic inputs, verified assessments, and resume scans.
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-2/3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 shadow-xl shadow-rose-600/30 border-0"
                  icon={ArrowRight}
                >
                  Complete Registration
                </Button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-rose-200/60">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-400 hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Target,
  BookOpen,
  FileCheck,
  Code2,
  FolderGit2,
  FileText,
  Building2,
  Briefcase,
  Layers,
  Send,
  Users,
  Upload,
  BarChart3,
  HelpCircle,
  Clock,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isStudent, isFaculty, isPlacementCoordinator } = useAuth();

  if (!user) return null;

  const studentNavItems = [
    { label: 'Growth Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Academics & CGPA', path: '/academics', icon: GraduationCap },
    { label: 'Verified Skills Matrix', path: '/skills', icon: Sparkles },
    { label: 'AI Skill Gap Diagnostic', path: '/skill-gap', icon: Target },
    { label: 'Personalized Roadmap', path: '/learning-plan', icon: BookOpen },
    { label: 'Faculty Assignments', path: '/assignments', icon: FileCheck },
    { label: 'Mock Assessments & Exams', path: '/secure-exam/pattern-test', icon: Clock },
    { label: 'Coding Compiler & LeetCode', path: '/compiler', icon: Code2 },
    { label: 'Projects & Hackathons', path: '/projects', icon: FolderGit2 },
    { label: 'Resume ATS Engine', path: '/resume-analyzer', icon: FileText },
    { label: 'Company Matchmaker', path: '/company-matching', icon: Building2 },
    { label: 'Placement Drives', path: '/placement-drives', icon: Briefcase },
    { label: 'My Applications', path: '/applications', icon: Send },
  ];

  const facultyNavItems = [
    { label: 'Faculty Intelligence', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Course Assignments', path: '/faculty/assignments', icon: FileCheck },
    { label: 'Assessments & Quizzes', path: '/admin/assessments', icon: Clock },
    { label: 'Question Bank', path: '/admin/question-bank', icon: HelpCircle },
    { label: 'RAG Knowledge Ingestion', path: '/faculty/rag', icon: Upload },
    { label: 'Student Directory & 360', path: '/admin/students', icon: Users },
  ];

  const coordinatorNavItems = [
    { label: 'Recruitment Analytics', path: '/coordinator/dashboard', icon: LayoutDashboard },
    { label: 'Company Readiness Matrix', path: '/coordinator/readiness-matrix', icon: Layers },
    { label: 'Placement Drives Manager', path: '/admin/placement-drives', icon: Briefcase },
    { label: 'Applications Pipeline', path: '/admin/applications', icon: Send },
    { label: 'Corporate Partners', path: '/admin/companies', icon: Building2 },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
    { label: 'NIRF / NAAC Reports', path: '/admin/reports', icon: BarChart3 },
  ];

  let navItems = studentNavItems;
  let portalTitle = "Student Placement Portal";
  if (isFaculty) {
    navItems = facultyNavItems;
    portalTitle = "Faculty Advisor Console";
  } else if (isPlacementCoordinator) {
    navItems = coordinatorNavItems;
    portalTitle = "Placement Coordinator Portal";
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-rose-500/15 bg-slate-950/95 light:bg-white/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-none">
          <div className="px-3 py-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 light:text-rose-600">
              {portalTitle}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600/20 via-pink-600/15 to-rose-600/10 text-rose-300 light:text-rose-700 border border-rose-500/30 shadow-md shadow-rose-950/20 font-bold'
                      : 'text-rose-200/60 light:text-slate-600 hover:text-white light:hover:text-rose-900 hover:bg-rose-500/10 light:hover:bg-rose-50 border border-transparent'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0 text-rose-400 light:text-rose-600" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-rose-500/15 bg-slate-950/90 light:bg-white">
          <div className="flex items-center justify-between text-[11px] text-rose-300 light:text-slate-700 font-semibold">
            <span>SGIP Connected Engine</span>
            <span className="font-mono text-emerald-400 light:text-emerald-700 font-black">Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

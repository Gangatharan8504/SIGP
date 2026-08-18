import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  LogOut,
  Bell,
  Menu,
  ChevronDown,
  GraduationCap,
  Sun,
  Moon,
} from 'lucide-react';
import { Button, Badge } from '../common/UIElements';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isFaculty, isPlacementCoordinator } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (isFaculty) return 'Faculty Advisor';
    if (isPlacementCoordinator) return 'Placement Coordinator';
    return 'Student Candidate';
  };

  const getRoleBadgeVariant = () => {
    if (isFaculty) return 'violet';
    if (isPlacementCoordinator) return 'rose';
    return 'emerald';
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-rose-500/15 bg-slate-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/15 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                SGIP
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  AI-Ready
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Theme Switcher & Actions / Profile */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-white transition flex items-center justify-center"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300 animate-in spin-in-90 duration-300" /> : <Moon className="w-4 h-4 text-rose-400 animate-in spin-in-90 duration-300" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Link */}
              <Link
                to="/notifications"
                className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/15 transition relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-rose-600/30">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                    <Badge variant={getRoleBadgeVariant()} size="sm" className="mt-0.5 text-[9px] py-0 px-1">
                      {getRoleLabel()}
                    </Badge>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-rose-300/80" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950 border border-rose-500/25 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-rose-500/20">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-rose-300/70 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={isFaculty ? "/faculty/dashboard" : isPlacementCoordinator ? "/coordinator/dashboard" : "/dashboard"}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-rose-100 hover:text-white hover:bg-rose-500/15 rounded-xl transition"
                      >
                        <GraduationCap className="w-4 h-4 text-rose-400" /> My Portal Dashboard
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-rose-500/20">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/15 rounded-xl transition font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Secure Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-rose-500/30 text-rose-200 hover:bg-rose-500/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-rose-600/30 border-0">
                  Join SGIP
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

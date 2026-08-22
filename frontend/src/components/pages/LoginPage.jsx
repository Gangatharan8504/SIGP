import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Key, User } from 'lucide-react';
import { Button, Input, Badge } from '../common/UIElements';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLogin = async (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    try {
      const data = await login({ email: loginEmail, password: loginPassword });
      const userRole = (data?.user?.role || '').toLowerCase();

      if (userRole === 'faculty') {
        navigate('/faculty/dashboard');
      } else if (userRole === 'placement_coordinator' || userRole === 'admin') {
        navigate('/coordinator/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.message?.includes('Network Error')) {
        setError('Network Error: Unable to reach the server. Please check your internet connection or try again.');
      } else {
        setError('Invalid email or password. Please check your credentials or register a new account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    executeLogin(demoEmail, demoPassword);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-10 px-4 overflow-hidden">
      {/* Reddish-Pink Ambient Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-rose-600/30 via-pink-600/20 to-transparent blur-3xl pointer-events-none animate-glow-pink" />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-pink-600/25 via-red-600/20 to-transparent blur-3xl pointer-events-none animate-glow-pink"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-rose-500/20 shadow-2xl shadow-rose-950/40 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 p-0.5 shadow-xl shadow-rose-500/30 mx-auto animate-float">
              <div className="w-full h-full rounded-[14px] bg-slate-950/40 backdrop-blur-xs flex items-center justify-center text-white">
                <Sparkles className="w-7 h-7 text-rose-300" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white light:text-rose-950 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-rose-200/80 light:text-rose-800">
              Sign in to your SGIP Placement Intelligence workspace
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 light:text-rose-950 font-medium text-center shadow-lg leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              label="Institutional Email"
              type="email"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 shadow-xl shadow-rose-600/30 border-0 font-bold"
              icon={ArrowRight}
            >
              Sign In to SGIP
            </Button>
          </form>

          {/* 1-Click Fast Demo Logins */}
          <div className="space-y-2 pt-2 border-t border-rose-500/20">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Fast 1-Click Sign-In:</span>
              <Badge variant="rose" size="sm">Demo Accounts</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('gangatharan8504@gmail.com', 'password123')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 border border-rose-500/20 text-slate-200 hover:text-white text-xs font-bold transition text-left flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">Student Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('coordinator@demo.com', 'password123')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-pink-500/20 border border-pink-500/20 text-slate-200 hover:text-white text-xs font-bold transition text-left flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="truncate">Coordinator</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-rose-200/70 light:text-rose-700">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-rose-400 font-bold hover:text-rose-300 light:text-rose-600 hover:underline"
            >
              Create student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

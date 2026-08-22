import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button, Input } from '../common/UIElements';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email: email.trim(), password });
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
        setError('Network Error: Unable to connect to backend server. Please verify your connection.');
      } else {
        setError('Invalid email or password. Please verify your credentials or create a new student account.');
      }
    } finally {
      setLoading(false);
    }
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

          <div className="pt-3 border-t border-rose-500/20 text-center text-xs text-rose-200/70 light:text-rose-700">
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

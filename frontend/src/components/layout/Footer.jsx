import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white tracking-tight">SGIP Placement AI</span>
          <span>© 2026. Empowering Next-Gen Engineering Careers.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/features" className="hover:text-slate-200 transition">Features</Link>
          <Link to="/pricing" className="hover:text-slate-200 transition">Pricing</Link>
          <Link to="/about" className="hover:text-slate-200 transition">About</Link>
          <Link to="/contact" className="hover:text-slate-200 transition">Contact</Link>
          <span className="text-slate-400">Privacy Policy</span>
          <span className="text-slate-400">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

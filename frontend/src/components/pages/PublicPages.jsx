import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileSearch, Terminal, Building2, Trophy, Award, Check, Sparkles } from 'lucide-react';
import { Button, Badge } from '../common/UIElements';

export const FeaturesPage = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Skill Gap Intelligence",
      desc: "Our Groq-backed engine diagnoses specific weaknesses against hiring bars for Tier-1, Dream, and Super Dream tech companies.",
    },
    {
      icon: FileSearch,
      title: "Deep ATS Resume Analyzer",
      desc: "Instant ATS compliance score, keyword match detection, and Google XYZ-format bullet point optimization recommendations.",
    },
    {
      icon: Terminal,
      title: "Live Sandbox Compiler",
      desc: "Practice coding challenges in JavaScript, Python, C++, and Java with stdin/stdout execution and automated test validation.",
    },
    {
      icon: Building2,
      title: "Smart Company Matchmaking",
      desc: "Evaluates CGPA, historical arrears, and verified skills against company eligibility criteria to calculate hiring match percentage.",
    },
    {
      icon: Trophy,
      title: "Personalized 6-Week Roadmaps",
      desc: "Week-by-week actionable milestones, dynamic course suggestions, and mock tests customized to your career ambitions.",
    },
    {
      icon: Award,
      title: "Placement Drive Pipeline",
      desc: "One-click application mechanism with instant eligibility check and real-time round-by-round status tracking.",
    },
  ];

  return (
    <div className="py-8 space-y-16 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <Badge variant="indigo">Complete Capabilities</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Platform Features & Architecture</h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Every tool an engineering student or placement director needs for guaranteed campus recruitment success.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PricingPage = () => {
  return (
    <div className="py-8 space-y-16 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <Badge variant="emerald">Transparent Plans</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Institutional & Student Pricing</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Scalable pricing for individual candidates and entire engineering colleges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Student Starter</h3>
            <p className="text-xs text-slate-400 mt-1">For individual practice & resume checks</p>
            <div className="mt-4">
              <span className="text-3xl font-black text-white">Free</span>
              <span className="text-xs text-slate-400"> / Forever</span>
            </div>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {['Basic Placement Readiness Score', '3 AI Resume Scans / month', 'Access to Practice Coding Compiler', 'View Upcoming Placement Drives'].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <Link to="/register" className="block">
            <Button variant="secondary" className="w-full">Get Started</Button>
          </Link>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-2 border-indigo-500 shadow-2xl space-y-6 relative">
          <div className="absolute -top-3 right-6">
            <Badge variant="indigo">Most Popular</Badge>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Student Pro AI</h3>
            <p className="text-xs text-slate-400 mt-1">Unlimited AI coaching & company matching</p>
            <div className="mt-4">
              <span className="text-3xl font-black text-white">₹499</span>
              <span className="text-xs text-slate-400"> / semester</span>
            </div>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {['Unlimited Groq AI Skill Gap Reports', 'Unlimited ATS Resume Critiques & Rewrites', 'Personalized 8-Week AI Learning Plan', 'Full-Length Tier-1 Mock Assessments', 'Priority Placement Drive Alerts'].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <Link to="/register" className="block">
            <Button variant="primary" className="w-full">Upgrade to Pro</Button>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">College Enterprise</h3>
            <p className="text-xs text-slate-400 mt-1">For universities & placement cells</p>
            <div className="mt-4">
              <span className="text-3xl font-black text-white">Custom</span>
              <span className="text-xs text-slate-400"> / Annual Campus License</span>
            </div>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {['Full Institutional Admin Dashboard', 'Custom Eligibility Filtering Matrix', 'Campus-Wide Skill Analytics & CSV Export', 'Automated Multi-Round Drive Management', 'Dedicated Account Manager & Training'].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="block">
            <Button variant="outline" className="w-full">Contact Institutional Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AboutPage = () => {
  return (
    <div className="py-8 space-y-12 max-w-4xl mx-auto text-left">
      <div className="text-center space-y-3">
        <Badge variant="indigo">Our Mission</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white">About SGIP Placement Platform</h1>
        <p className="text-sm text-slate-400">
          Transforming campus placements through real-time AI skill benchmarking.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          The <strong className="text-white">SGIP SaaS Platform</strong> was built to solve the systemic disconnect between academic curricula and rapidly evolving corporate hiring standards.
        </p>
        <p>
          By uniting multi-dimensional scoring (Academics, DSA, Full-Stack projects, ATS compliance, and soft skills), SGIP gives students a clear, measurable roadmap to bridge their gaps while equipping placement officers with live cohort analytics.
        </p>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  return (
    <div className="py-8 space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <Badge variant="indigo">Support & Inquiries</Badge>
        <h1 className="text-3xl font-black text-white">Get in Touch</h1>
        <p className="text-xs text-slate-400">Reach our engineering and placement partnership team</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Name</label>
            <input className="w-full bg-slate-900 border border-slate-700 text-sm rounded-xl p-2.5 mt-1 text-white outline-none" placeholder="Your Name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Email</label>
            <input className="w-full bg-slate-900 border border-slate-700 text-sm rounded-xl p-2.5 mt-1 text-white outline-none" placeholder="name@college.edu" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300">Message</label>
          <textarea rows={4} className="w-full bg-slate-900 border border-slate-700 text-sm rounded-xl p-2.5 mt-1 text-white outline-none" placeholder="Describe your college placement requirements..." />
        </div>
        <Button variant="primary" className="w-full">Send Message</Button>
      </div>
    </div>
  );
};

import React from 'react';
import { FolderGit2, Trophy, ExternalLink, Code2, Star, Calendar, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../../common/UIElements';

export const ProjectsPage = () => {
  const projects = [
    {
      title: "AI-Powered Smart LMS & Placement Tracker",
      category: "Full Stack & AI",
      tags: ["React 19", "Node.js", "MongoDB", "Groq LLM", "Tailwind CSS"],
      desc: "Architected an end-to-end recruitment SaaS matching students with enterprise drives via real-time skill benchmarking.",
      github: "https://github.com/example/sgip",
      live: "https://sgip.example.dev",
      stars: 42,
    },
    {
      title: "Distributed High-Throughput E-Commerce Gateway",
      category: "Microservices & Cloud",
      tags: ["Go", "Docker", "Redis", "PostgreSQL", "Kafka"],
      desc: "Engineered scalable checkout and inventory microservices handling 2,000+ concurrent payment transactions with zero deadlock.",
      github: "https://github.com/example/ecommerce",
      live: "#",
      stars: 28,
    },
    {
      title: "Automated Resume ATS Scoring & Keyword Parser",
      category: "Natural Language Processing",
      tags: ["Python", "FastAPI", "SpaCy", "Llama-3", "ChromaDB"],
      desc: "Built an ATS benchmark engine comparing candidate resumes against FAANG job descriptions with bullet point rewrite suggestions.",
      github: "https://github.com/example/ats-analyzer",
      live: "#",
      stars: 35,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Capstone Projects & Portfolio</h1>
          <p className="text-xs text-slate-400">High-impact engineering projects evaluated during technical placement rounds</p>
        </div>
        <Button variant="primary" size="md" icon={FolderGit2}>
          Add New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <div key={i} className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="indigo" size="sm">{proj.category}</Badge>
                <span className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {proj.stars}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{proj.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{proj.desc}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {proj.tags.map((t, tIdx) => (
                  <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <a href={proj.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition">
                <Code2 className="w-4 h-4" /> Codebase
              </a>
              <a href={proj.live} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 font-semibold hover:underline">
                Live Demo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HackathonsPage = () => {
  const hackathons = [
    {
      title: "Smart India Hackathon (SIH 2026)",
      organizer: "Ministry of Education & AICTE",
      status: "Registration Open",
      prize: "₹1,00,000 / Problem Statement",
      dates: "Sept 15 - 18, 2026",
      category: "National Level Innovation",
    },
    {
      title: "Google Solution Challenge 2026",
      organizer: "Google Developer Student Clubs",
      status: "Upcoming",
      prize: "$10,000 Global Winner Fund",
      dates: "Oct 01 - 15, 2026",
      category: "UN Sustainable Development Goals",
    },
    {
      title: "Microsoft Imagine Cup 2026",
      organizer: "Microsoft Azure Team",
      status: "Registration Open",
      prize: "$100,000 + Azure Credits",
      dates: "Nov 10 - 20, 2026",
      category: "AI & Cloud Architecture",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Hackathons & Competitive Challenges</h1>
        <p className="text-xs text-slate-400">Participate in nationwide coding competitions to earn direct recruiter fast-tracks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hackathons.map((h, i) => (
          <div key={i} className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="emerald" size="sm">{h.status}</Badge>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              <h3 className="text-base font-bold text-white mt-3">{h.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{h.organizer}</p>

              <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Prize Pool:</span>
                  <span className="font-bold text-emerald-400">{h.prize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event Dates:</span>
                  <span className="text-slate-200 font-mono">{h.dates}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
              Register / Team Up
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

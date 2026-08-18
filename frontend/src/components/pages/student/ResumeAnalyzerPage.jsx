import React, { useState } from 'react';
import { Sparkles, ExternalLink, RefreshCw, Layers, ShieldCheck, Terminal, Download, FileText } from 'lucide-react';
import { Button, Badge } from '../../common/UIElements';

export const ResumeAnalyzerPage = () => {
  const [iframeKey, setIframeKey] = useState(Date.now());
  const streamlitUrl = import.meta.env.VITE_STREAMLIT_URL || "http://localhost:8501";

  const handleRefresh = () => {
    setIframeKey(Date.now());
  };

  const handleOpenExternal = () => {
    window.open(streamlitUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">Python Streamlit Engine</Badge>
            <span className="text-xs text-rose-300 light:text-rose-800 font-mono font-bold">
              Groq LLM &bull; ReportLab PDF Generator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white light:text-rose-950 mt-1">
            AI Resume ATS Analyzer &amp; PDF Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Powered by Python Streamlit with strict PDF/DOCX binary parsing, 5-section structural verification, Google XYZ bullet rewrites, and single-column ATS PDF export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            icon={RefreshCw}
            className="border-rose-500/30 text-rose-200 light:text-rose-900"
          >
            Reload Engine
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenExternal}
            icon={ExternalLink}
            className="shadow-lg shadow-rose-600/30 font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 border-0"
          >
            Open in New Window
          </Button>
        </div>
      </div>

      {/* Embedded Streamlit Application Container */}
      <div className="glass-card rounded-3xl p-3 border border-rose-500/20 shadow-2xl overflow-hidden relative">
        <div className="bg-slate-950/80 light:bg-slate-100 px-4 py-2.5 rounded-2xl flex items-center justify-between border border-rose-500/20 mb-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-[11px] text-rose-300 light:text-slate-800">
            <Terminal className="w-4 h-4 text-rose-400" />
            <span>streamlit run streamlit_app.py --server.port 8501</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400 light:text-emerald-700">Port 8501 Active</span>
          </div>
        </div>

        <div className="w-full h-[88vh] min-h-[750px] rounded-2xl overflow-hidden border border-rose-500/20 bg-slate-950">
          <iframe
            key={iframeKey}
            src={streamlitUrl}
            title="SGIP AI Resume ATS Analyzer Streamlit App"
            className="w-full h-full border-0"
            allow="clipboard-write; clipboard-read"
          />
        </div>
      </div>
    </div>
  );
};

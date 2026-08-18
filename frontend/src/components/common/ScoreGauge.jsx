import React from 'react';

export const ScoreGauge = ({ score = 0, size = 160, strokeWidth = 14, title = "Readiness Score", subtitle = "Placement Ready" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let color = "#ef4444"; // red < 50
  let badgeBg = "bg-rose-500/10 text-rose-400 light:text-rose-700 light:bg-rose-100 border-rose-500/20";
  if (clampedScore >= 80) {
    color = "#10b981"; // emerald
    badgeBg = "bg-emerald-500/10 text-emerald-400 light:text-emerald-800 light:bg-emerald-100 border-emerald-500/20";
  } else if (clampedScore >= 65) {
    color = "#6366f1"; // indigo
    badgeBg = "bg-indigo-500/10 text-indigo-400 light:text-indigo-800 light:bg-indigo-100 border-indigo-500/20";
  } else if (clampedScore >= 50) {
    color = "#f59e0b"; // amber
    badgeBg = "bg-amber-500/10 text-amber-400 light:text-amber-800 light:bg-amber-100 border-amber-500/20";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(244, 63, 94, 0.15)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white light:text-slate-900">{clampedScore}%</span>
          <span className="text-xs font-bold text-slate-400 light:text-slate-500 mt-0.5">SCORE</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-sm font-bold text-slate-200 light:text-slate-900">{title}</h4>
        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeBg}`}>
          {subtitle || (clampedScore >= 80 ? "Super Prepared" : clampedScore >= 65 ? "Good Readiness" : "Action Needed")}
        </span>
      </div>
    </div>
  );
};

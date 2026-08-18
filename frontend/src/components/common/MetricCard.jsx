import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30',
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/30',
  };

  const activeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-card-hover rounded-2xl p-5 border flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle background gradient flare */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${activeColor} blur-xl opacity-30 group-hover:opacity-60 transition-opacity`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mt-1.5">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-slate-800/80 border ${activeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-400">{subtitle}</span>
        {trend && (
          <span className={`font-semibold flex items-center gap-0.5 ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.positive ? '↑' : '↓'} {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export const SkillRadarChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { subject: 'Data Structures', student: 82, benchmark: 90, fullMark: 100 },
    { subject: 'Algorithms', student: 80, benchmark: 85, fullMark: 100 },
    { subject: 'React.js Frontend', student: 90, benchmark: 80, fullMark: 100 },
    { subject: 'Node.js Backend', student: 85, benchmark: 85, fullMark: 100 },
    { subject: 'Database Design', student: 78, benchmark: 80, fullMark: 100 },
    { subject: 'System Design', student: 65, benchmark: 75, fullMark: 100 },
    { subject: 'Cloud & DevOps', student: 60, benchmark: 70, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#e11d48" strokeOpacity={0.25} />
          <PolarAngleAxis dataKey="subject" stroke="#fda4af" tick={{ fontSize: 11, fill: '#f43f5e', fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#f43f5e" strokeOpacity={0.4} tick={{ fontSize: 9 }} />
          <Radar
            name="Your Proficiency"
            dataKey="student"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.45}
          />
          <Radar
            name="Industry Benchmark Bar"
            dataKey="benchmark"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 text-xs mt-2 text-rose-200 light:text-rose-900 font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" /> Your Proficiency (%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> Industry Benchmark Bar (%)
        </span>
      </div>
    </div>
  );
};

export const SkillBarChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { skill: 'DSA', student: 82, benchmark: 90 },
    { skill: 'React', student: 90, benchmark: 80 },
    { skill: 'Node.js', student: 85, benchmark: 85 },
    { skill: 'MongoDB', student: 78, benchmark: 80 },
    { skill: 'System Design', student: 65, benchmark: 75 },
    { skill: 'Docker/AWS', student: 60, benchmark: 70 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey="skill" stroke="#e11d48" tick={{ fontSize: 11, fill: '#f43f5e', fontWeight: 600 }} />
          <YAxis domain={[0, 100]} stroke="#e11d48" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#120919',
              borderColor: 'rgba(244, 63, 94, 0.4)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Bar name="Your Score (%)" dataKey="student" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          <Bar name="Industry Cutoff Bar (%)" dataKey="benchmark" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ReadinessTrendChart = ({ data = [] }) => {
  const defaultData = [
    { month: 'Month 1', score: 58 },
    { month: 'Month 2', score: 65 },
    { month: 'Month 3', score: 72 },
    { month: 'Month 4', score: 77 },
    { month: 'Month 5', score: 81 },
    { month: 'Current', score: 84 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.length > 0 ? data : defaultData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScorePink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#e11d48" tick={{ fontSize: 11, fill: '#f43f5e' }} />
          <YAxis domain={[40, 100]} stroke="#e11d48" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#120919', borderColor: '#f43f5e', borderRadius: '12px', color: '#fff' }}
          />
          <Area type="monotone" dataKey="score" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorScorePink)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

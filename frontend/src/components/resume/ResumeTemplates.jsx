import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

const COLOR_MAP = {
  rose: {
    primary: '#e11d48',
    secondary: '#ffe4e6',
    border: '#fda4af',
    text: '#be123c',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    bar: 'bg-rose-600',
    line: 'border-rose-300',
  },
  indigo: {
    primary: '#4f46e5',
    secondary: '#e0e7ff',
    border: '#a5b4fc',
    text: '#3730a3',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    bar: 'bg-indigo-600',
    line: 'border-indigo-300',
  },
  purple: {
    primary: '#9333ea',
    secondary: '#f3e8ff',
    border: '#d8b4fe',
    text: '#6b21a8',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    bar: 'bg-purple-600',
    line: 'border-purple-300',
  },
  emerald: {
    primary: '#059669',
    secondary: '#d1fae5',
    border: '#6ee7b7',
    text: '#065f46',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-600',
    line: 'border-emerald-300',
  },
  slate: {
    primary: '#0f172a',
    secondary: '#f1f5f9',
    border: '#cbd5e1',
    text: '#334155',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    bar: 'bg-slate-900',
    line: 'border-slate-400',
  },
  navy: {
    primary: '#1e3a8a',
    secondary: '#dbeafe',
    border: '#93c5fd',
    text: '#1e40af',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    bar: 'bg-blue-900',
    line: 'border-blue-300',
  },
};

const FONT_MAP = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

// =========================================================================
// 1. TEMPLATE: SWAN (ATS STANDARD - SINGLE COLUMN)
// =========================================================================
export const ATSSwanTemplate = ({ data, themeColor = 'slate', font = 'serif' }) => {
  const c = COLOR_MAP[themeColor] || COLOR_MAP.slate;
  const f = FONT_MAP[font] || 'font-serif';
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = {},
    experience = [],
    projects = [],
    certifications = [],
    achievements = [],
    languages = [],
  } = data || {};

  return (
    <div className={`bg-white text-slate-900 ${f} leading-snug p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[11px] space-y-2.5 overflow-hidden box-border`}>
      {/* Header */}
      <div className="text-center border-b pb-2 space-y-0.5" style={{ borderColor: c.primary }}>
        <h1 className="text-xl font-bold uppercase tracking-wider" style={{ color: c.primary }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-700">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-700">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && (
            <>
              <span>&bull;</span>
              <a href={`mailto:${personalInfo.email}`} className="text-slate-900 underline">
                {personalInfo.email}
              </a>
            </>
          )}
          {personalInfo.location && (
            <>
              <span>&bull;</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedinUrl && (
            <>
              <span>&bull;</span>
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-900 underline">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.githubUrl && (
            <>
              <span>&bull;</span>
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="text-slate-900 underline">
                GitHub
              </a>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Professional Summary
          </h2>
          <p className="text-[10.5px] text-justify text-slate-800 leading-tight">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Technical Skills
          </h2>
          <div className="space-y-0.5 text-[10.5px] text-slate-800 leading-tight">
            {skills.programming?.length > 0 && (
              <p><strong className="font-semibold text-black">Programming:</strong> {skills.programming.join(', ')}</p>
            )}
            {skills.frontend?.length > 0 && (
              <p><strong className="font-semibold text-black">Frontend:</strong> {skills.frontend.join(', ')}</p>
            )}
            {skills.backend?.length > 0 && (
              <p><strong className="font-semibold text-black">Backend &amp; APIs:</strong> {skills.backend.join(', ')}</p>
            )}
            {skills.database?.length > 0 && (
              <p><strong className="font-semibold text-black">Databases:</strong> {skills.database.join(', ')}</p>
            )}
            {skills.tools?.length > 0 && (
              <p><strong className="font-semibold text-black">Developer Tools:</strong> {skills.tools.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Experience &amp; Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between font-bold text-black leading-tight">
                <span>{exp.jobTitle} &mdash; <span className="font-semibold text-slate-800">{exp.company}</span></span>
                <span className="font-normal text-slate-600 text-[10px]">{exp.startDate} &ndash; {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              {exp.description && (
                <div className="text-slate-800 space-y-0.5 pl-2 text-[10px] leading-tight">
                  {exp.description.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Key Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between font-bold text-black leading-tight">
                <span>
                  {proj.name}
                  {proj.technologies && (
                    <span className="font-normal italic text-slate-700 text-[10px]"> | {proj.technologies}</span>
                  )}
                </span>
                <span className="space-x-1.5 text-[10px]">
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline text-slate-800">Code</a>}
                  {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="underline text-slate-800">Live</a>}
                </span>
              </div>
              {proj.description && (
                <div className="text-slate-800 space-y-0.5 pl-2 text-[10px] leading-tight">
                  {proj.description.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between items-start text-[10.5px] leading-tight">
              <div>
                <strong className="font-bold text-black">{edu.degree}</strong>
                <p className="text-slate-800 text-[10px]">{edu.institution}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-700 text-[10px] font-semibold">{edu.startYear} &ndash; {edu.endYear}</span>
                {edu.cgpa && <p className="font-bold text-black text-[10px]">CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications?.length > 0 || achievements?.length > 0) && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Certifications &amp; Honors
          </h2>
          <div className="space-y-0.5 text-[10px] text-slate-800 leading-tight">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="flex justify-between">
                <span>&bull; <strong>{cert.name}</strong> &mdash; {cert.organization}</span>
                {cert.issueDate && <span className="text-slate-600">{cert.issueDate}</span>}
              </div>
            ))}
            {achievements.map((ach, idx) => (
              <p key={ach.id || idx}>&bull; <strong>{ach.title}:</strong> {ach.description}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. TEMPLATE: BEAR (MODERN ACCENT WITH PILLS)
// =========================================================================
export const ModernBearTemplate = ({ data, themeColor = 'indigo', font = 'sans' }) => {
  const c = COLOR_MAP[themeColor] || COLOR_MAP.indigo;
  const f = FONT_MAP[font] || 'font-sans';
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = {},
    experience = [],
    projects = [],
    certifications = [],
    achievements = [],
  } = data || {};

  return (
    <div className={`bg-white text-slate-900 ${f} p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[11px] space-y-2.5 overflow-hidden box-border`}>
      {/* Header with Color Accent Border */}
      <div className="border-l-4 pl-3 space-y-0.5" style={{ borderColor: c.primary }}>
        <h1 className="text-xl font-black tracking-tight" style={{ color: c.primary }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-600 pt-0.5">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedinUrl && (
            <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: c.primary }}>
              LinkedIn
            </a>
          )}
          {personalInfo.githubUrl && (
            <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: c.primary }}>
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Professional Summary
          </h2>
          <p className="text-[10.5px] text-slate-700 leading-tight">{summary}</p>
        </div>
      )}

      {/* Skills Chips */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1 text-[10px]">
            {Object.entries(skills).map(([cat, arr]) =>
              arr?.map((skill, sIdx) => (
                <span key={`${cat}_${sIdx}`} className={`px-1.5 py-0.5 rounded font-medium ${c.badge}`}>
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Experience &amp; Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between items-baseline font-bold text-slate-900 leading-tight">
                <span>{exp.jobTitle} &bull; <span style={{ color: c.primary }}>{exp.company}</span></span>
                <span className="text-slate-500 text-[10px] font-normal">{exp.startDate} &ndash; {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              {exp.description && (
                <div className="text-slate-700 pl-2 space-y-0.5 text-[10px] leading-tight">
                  {exp.description.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Key Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between items-baseline font-bold text-slate-900 leading-tight">
                <span>{proj.name} <span className="text-[10px] font-normal text-slate-500 italic">({proj.technologies})</span></span>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] underline" style={{ color: c.primary }}>
                    Code &rarr;
                  </a>
                )}
              </div>
              {proj.description && (
                <div className="text-slate-700 pl-2 space-y-0.5 text-[10px] leading-tight">
                  {proj.description.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between text-[10.5px] leading-tight">
              <div>
                <strong className="text-slate-900">{edu.degree}</strong>
                <p className="text-slate-600 text-[10px]">{edu.institution}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">{edu.startYear} &ndash; {edu.endYear}</span>
                {edu.cgpa && <p className="font-bold text-[10px]" style={{ color: c.primary }}>CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5" style={{ color: c.primary, borderColor: c.border }}>
            Certifications
          </h2>
          {certifications.map((cDoc, i) => (
            <p key={i} className="text-[10px] text-slate-700">
              &bull; <strong>{cDoc.name}</strong> &mdash; {cDoc.organization} ({cDoc.issueDate})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. TEMPLATE: RAVEN (MINIMAL MONOSPACE B&W)
// =========================================================================
export const MinimalRavenTemplate = ({ data }) => {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = {},
    experience = [],
    projects = [],
    certifications = [],
  } = data || {};

  return (
    <div className="bg-white text-black font-mono p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[10.5px] space-y-2.5 overflow-hidden box-border">
      {/* Header */}
      <div className="text-center space-y-0.5 border-b-2 border-black pb-1.5">
        <h1 className="text-lg font-bold tracking-widest uppercase">{personalInfo.fullName}</h1>
        <p className="text-[9.5px] uppercase tracking-wider">{personalInfo.professionalTitle}</p>
        <p className="text-[9px] text-slate-700">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.githubUrl, personalInfo.linkedinUrl]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-0.5">
          <h2 className="font-bold uppercase text-[10.5px] border-b border-black">/// SUMMARY</h2>
          <p className="leading-tight text-justify">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-0.5">
          <h2 className="font-bold uppercase text-[10.5px] border-b border-black">/// SKILLS</h2>
          <p className="leading-tight text-[10px]">{Object.values(skills).flat().filter(Boolean).join(' • ')}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="space-y-1">
          <h2 className="font-bold uppercase text-[10.5px] border-b border-black">/// EXPERIENCE</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-0.5 text-[10px]">
              <div className="flex justify-between font-bold">
                <span>{exp.jobTitle}, {exp.company}</span>
                <span>{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              <p className="whitespace-pre-line pl-2 leading-tight">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="space-y-1">
          <h2 className="font-bold uppercase text-[10.5px] border-b border-black">/// PROJECTS</h2>
          {projects.map((p, idx) => (
            <div key={idx} className="space-y-0.5 text-[10px]">
              <div className="flex justify-between font-bold">
                <span>{p.name} [{p.technologies}]</span>
                <span>{p.githubUrl && 'SRC'}</span>
              </div>
              <p className="whitespace-pre-line pl-2 leading-tight">{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="space-y-0.5">
          <h2 className="font-bold uppercase text-[10.5px] border-b border-black">/// EDUCATION</h2>
          {education.map((e, idx) => (
            <div key={idx} className="flex justify-between text-[10px]">
              <span>{e.degree} - {e.institution}</span>
              <span>{e.cgpa ? `CGPA: ${e.cgpa}` : `${e.startYear}-${e.endYear}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 4. TEMPLATE: PENGUIN (STUDENT / FRESHER PRIORITY)
// =========================================================================
export const FresherPenguinTemplate = ({ data, themeColor = 'emerald', font = 'sans' }) => {
  const c = COLOR_MAP[themeColor] || COLOR_MAP.emerald;
  const f = FONT_MAP[font] || 'font-sans';
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = {},
    projects = [],
    experience = [],
    certifications = [],
  } = data || {};

  return (
    <div className={`bg-white text-slate-900 ${f} p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[11px] space-y-2.5 overflow-hidden box-border`}>
      {/* Header */}
      <div className="text-center pb-1.5 border-b-2 space-y-0.5" style={{ borderColor: c.primary }}>
        <h1 className="text-xl font-black text-slate-900">{personalInfo.fullName}</h1>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: c.primary }}>
          {personalInfo.professionalTitle}
        </p>
        <p className="text-[10px] text-slate-600">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.githubUrl, personalInfo.linkedinUrl]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Objective */}
      {summary && (
        <div className="space-y-0.5">
          <h2 className={`text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
            Career Objective
          </h2>
          <p className="text-[10.5px] text-slate-700 leading-tight px-1.5">{summary}</p>
        </div>
      )}

      {/* Education First */}
      {education?.length > 0 && (
        <div className="space-y-1">
          <h2 className={`text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
            Education &amp; Academics
          </h2>
          {education.map((e, idx) => (
            <div key={idx} className="flex justify-between px-1.5 text-[10.5px] leading-tight">
              <div>
                <strong className="text-slate-900">{e.degree}</strong>
                <p className="text-slate-600 text-[10px]">{e.institution}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">{e.startYear} &ndash; {e.endYear}</span>
                {e.cgpa && <p className="font-bold text-[10px]" style={{ color: c.primary }}>CGPA: {e.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-0.5">
          <h2 className={`text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
            Technical Skills
          </h2>
          <div className="px-1.5 space-y-0.5 text-[10.5px] text-slate-800 leading-tight">
            {skills.programming?.length > 0 && (
              <p><strong>Programming:</strong> {skills.programming.join(', ')}</p>
            )}
            {skills.frontend?.length > 0 && (
              <p><strong>Web Technologies:</strong> {skills.frontend.join(', ')}</p>
            )}
            {skills.backend?.length > 0 && (
              <p><strong>Backend &amp; Database:</strong> {skills.backend.concat(skills.database || []).join(', ')}</p>
            )}
            {skills.tools?.length > 0 && (
              <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Academic Projects */}
      {projects?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className={`text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
            Key Projects
          </h2>
          {projects.map((p, idx) => (
            <div key={idx} className="px-1.5 space-y-0.5 text-[10.5px]">
              <div className="flex justify-between font-bold text-slate-900 leading-tight">
                <span>{p.name} {p.technologies && <span className="font-normal italic text-slate-600 text-[10px]">({p.technologies})</span>}</span>
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="underline text-[10px]" style={{ color: c.primary }}>Code</a>}
              </div>
              <div className="text-slate-700 pl-1.5 space-y-0.5 text-[10px] leading-tight">
                {p.description?.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="space-y-1">
          <h2 className={`text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
            Internships &amp; Training
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="px-1.5 space-y-0.5 text-[10.5px]">
              <div className="flex justify-between font-bold leading-tight">
                <span>{exp.jobTitle} &mdash; {exp.company}</span>
                <span className="text-slate-500 font-normal text-[10px]">{exp.startDate} &ndash; {exp.endDate}</span>
              </div>
              <div className="text-slate-700 pl-1.5 text-[10px] leading-tight">
                {exp.description?.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="space-y-0.5">
          <h2 className={`text-[10.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
            Certifications &amp; Courses
          </h2>
          <div className="px-1.5 space-y-0.5 text-[10px] text-slate-700 leading-tight">
            {certifications.map((cDoc, i) => (
              <p key={i}>&bull; <strong>{cDoc.name}</strong> &mdash; {cDoc.organization} ({cDoc.issueDate})</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

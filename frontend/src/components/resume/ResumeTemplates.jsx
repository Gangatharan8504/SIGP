import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

/**
 * Common Helper to render formatted contact item
 */
const ContactItem = ({ icon: Icon, text, link, isLink = false }) => {
  if (!text) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-700">
      {Icon && <Icon className="w-3 h-3 text-slate-500 shrink-0" />}
      {isLink ? (
        <a href={link || text} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-indigo-600 underline">
          {text.replace(/^https?:\/\/(www\.)?/, '')}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </span>
  );
};

// ==========================================
// 1. TEMPLATE 1: ATS PROFESSIONAL (Standard)
// ==========================================
export const ATSProfessionalTemplate = ({ data }) => {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = {},
    experience = [],
    projects = [],
    certifications = [],
    achievements = [],
    positions = [],
    languages = [],
    interests = [],
  } = data || {};

  return (
    <div className="bg-white text-slate-900 font-serif leading-normal p-8 sm:p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl text-[12px] space-y-4">
      {/* Header */}
      <div className="text-center border-b border-slate-400 pb-3 space-y-1">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-700">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-700">
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
          {personalInfo.portfolioUrl && (
            <>
              <span>&bull;</span>
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-slate-900 underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Professional Summary
          </h2>
          <p className="text-[11.5px] text-justify text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Technical Skills
          </h2>
          <div className="space-y-0.5 text-[11.5px] text-slate-800">
            {skills.programming?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Programming Languages:</strong>{' '}
                {skills.programming.join(', ')}
              </p>
            )}
            {skills.frontend?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Frontend Technologies:</strong>{' '}
                {skills.frontend.join(', ')}
              </p>
            )}
            {skills.backend?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Backend &amp; APIs:</strong>{' '}
                {skills.backend.join(', ')}
              </p>
            )}
            {skills.database?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Databases:</strong>{' '}
                {skills.database.join(', ')}
              </p>
            )}
            {skills.tools?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Developer Tools &amp; Cloud:</strong>{' '}
                {skills.tools.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Experience / Internship */}
      {experience?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Experience &amp; Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-0.5 text-[11.5px]">
              <div className="flex justify-between font-bold text-black">
                <span>
                  {exp.jobTitle} &mdash; <span className="font-semibold text-slate-800">{exp.company}</span>
                </span>
                <span className="font-normal text-slate-600">
                  {exp.startDate} &ndash; {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.location && <p className="italic text-slate-600 text-[10.5px]">{exp.location}</p>}
              {exp.description && (
                <div className="text-slate-800 space-y-0.5 pl-3">
                  {exp.description.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="leading-tight">
                      {line.startsWith('•') ? line : `• ${line}`}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Key Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="space-y-0.5 text-[11.5px]">
              <div className="flex justify-between font-bold text-black">
                <span>
                  {proj.name}
                  {proj.technologies && (
                    <span className="font-normal italic text-slate-700"> | {proj.technologies}</span>
                  )}
                </span>
                <span className="space-x-2 text-[10.5px]">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline text-slate-800">
                      Code
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="underline text-slate-800">
                      Live
                    </a>
                  )}
                </span>
              </div>
              {proj.description && (
                <div className="text-slate-800 space-y-0.5 pl-3">
                  {proj.description.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="leading-tight">
                      {line.startsWith('•') ? line : `• ${line}`}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between items-start text-[11.5px]">
              <div>
                <strong className="font-bold text-black">{edu.degree}</strong>
                <p className="text-slate-800">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.description && <p className="text-[10.5px] text-slate-600">{edu.description}</p>}
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-700 font-semibold">{edu.startYear} &ndash; {edu.endYear}</span>
                {edu.cgpa && <p className="font-bold text-black">CGPA / %: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Certifications
          </h2>
          <div className="space-y-0.5 text-[11.5px] text-slate-800">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="flex justify-between">
                <span>
                  &bull; <strong className="text-black">{cert.name}</strong> &mdash; {cert.organization}
                </span>
                {cert.issueDate && <span className="text-slate-600">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Awards */}
      {achievements?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Achievements &amp; Honors
          </h2>
          <div className="space-y-0.5 text-[11.5px] text-slate-800 pl-3">
            {achievements.map((ach, idx) => (
              <p key={ach.id || idx}>
                &bull; <strong className="text-black">{ach.title}:</strong> {ach.description}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Interests */}
      {(languages?.length > 0 || interests?.length > 0) && (
        <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200 text-[11px] text-slate-700">
          {languages?.length > 0 && (
            <div>
              <strong className="font-bold uppercase text-black text-[10px]">Languages: </strong>
              <span>{languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}</span>
            </div>
          )}
          {interests?.length > 0 && (
            <div>
              <strong className="font-bold uppercase text-black text-[10px]">Interests: </strong>
              <span>{interests.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. TEMPLATE 2: MODERN PROFESSIONAL
// ==========================================
export const ModernProfessionalTemplate = ({ data }) => {
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
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl text-[12px] space-y-4">
      {/* Modern Header with Indigo Accent */}
      <div className="border-l-4 border-indigo-600 pl-4 space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 pt-1">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedinUrl && (
            <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">
              LinkedIn
            </a>
          )}
          {personalInfo.githubUrl && (
            <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
            About Me
          </h2>
          <p className="text-[11.5px] text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills Chips */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
            Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1 text-[11px]">
            {Object.entries(skills).map(([cat, arr]) =>
              arr?.map((skill, sIdx) => (
                <span key={`${cat}_${sIdx}`} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
            Work Experience &amp; Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-1 text-[11.5px]">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{exp.jobTitle} &bull; <span className="text-indigo-600">{exp.company}</span></span>
                <span className="text-slate-500 text-[10.5px] font-normal">{exp.startDate} &ndash; {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              {exp.description && (
                <div className="text-slate-700 pl-3 space-y-0.5">
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
        <div className="space-y-2.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
            Featured Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="space-y-0.5 text-[11.5px]">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{proj.name} <span className="text-[10.5px] font-normal text-slate-500 italic">({proj.technologies})</span></span>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[10.5px] text-indigo-600 underline">
                    Repository &rarr;
                  </a>
                )}
              </div>
              {proj.description && (
                <div className="text-slate-700 pl-3 space-y-0.5">
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
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between text-[11.5px]">
              <div>
                <strong className="text-slate-900">{edu.degree}</strong>
                <p className="text-slate-600">{edu.institution}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">{edu.startYear} &ndash; {edu.endYear}</span>
                {edu.cgpa && <p className="font-bold text-indigo-600">CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Languages */}
      {certifications?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">
            Certifications
          </h2>
          {certifications.map((c, i) => (
            <p key={i} className="text-[11px] text-slate-700">
              &bull; <strong>{c.name}</strong> &mdash; {c.organization} ({c.issueDate})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. TEMPLATE 3: MINIMAL B&W
// ==========================================
export const MinimalTemplate = ({ data }) => {
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
    <div className="bg-white text-black font-mono p-8 sm:p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl text-[11px] space-y-4">
      {/* Minimal Header */}
      <div className="text-center space-y-0.5 border-b-2 border-black pb-2">
        <h1 className="text-xl font-bold tracking-widest uppercase">{personalInfo.fullName}</h1>
        <p className="text-[10px] uppercase tracking-wider">{personalInfo.professionalTitle}</p>
        <p className="text-[9.5px] text-slate-700">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.githubUrl, personalInfo.linkedinUrl]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-0.5">
          <h2 className="font-bold uppercase text-[11px] border-b border-black">/// SUMMARY</h2>
          <p className="leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-0.5">
          <h2 className="font-bold uppercase text-[11px] border-b border-black">/// SKILLS</h2>
          <p>{Object.values(skills).flat().filter(Boolean).join(' • ')}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold uppercase text-[11px] border-b border-black">/// EXPERIENCE</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-bold">
                <span>{exp.jobTitle}, {exp.company}</span>
                <span>{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              <p className="whitespace-pre-line pl-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold uppercase text-[11px] border-b border-black">/// PROJECTS</h2>
          {projects.map((p, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-bold">
                <span>{p.name} [{p.technologies}]</span>
                <span>{p.githubUrl && 'SRC'}</span>
              </div>
              <p className="whitespace-pre-line pl-2">{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="space-y-1">
          <h2 className="font-bold uppercase text-[11px] border-b border-black">/// EDUCATION</h2>
          {education.map((e, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{e.degree} - {e.institution}</span>
              <span>{e.cgpa ? `CGPA: ${e.cgpa}` : `${e.startYear}-${e.endYear}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. TEMPLATE 4: FRESHER / STUDENT
// ==========================================
export const FresherStudentTemplate = ({ data }) => {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = {},
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    languages = [],
  } = data || {};

  return (
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl text-[12px] space-y-4">
      {/* Header */}
      <div className="text-center pb-2 border-b-2 border-emerald-600 space-y-0.5">
        <h1 className="text-2xl font-black text-slate-900">{personalInfo.fullName}</h1>
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{personalInfo.professionalTitle}</p>
        <p className="text-[11px] text-slate-600">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.githubUrl, personalInfo.linkedinUrl]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Objective */}
      {summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Career Objective
          </h2>
          <p className="text-[11.5px] text-slate-700 leading-relaxed px-2">{summary}</p>
        </div>
      )}

      {/* Education First for Freshers */}
      {education?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Education &amp; Academics
          </h2>
          {education.map((e, idx) => (
            <div key={idx} className="flex justify-between px-2 text-[11.5px]">
              <div>
                <strong className="text-slate-900">{e.degree}</strong>
                <p className="text-slate-600">{e.institution}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">{e.startYear} &ndash; {e.endYear}</span>
                {e.cgpa && <p className="font-bold text-emerald-700">CGPA: {e.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Technical Skills
          </h2>
          <div className="px-2 space-y-0.5 text-[11.5px] text-slate-800">
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
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Academic &amp; Practical Projects
          </h2>
          {projects.map((p, idx) => (
            <div key={idx} className="px-2 space-y-0.5 text-[11.5px]">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{p.name} {p.technologies && <span className="font-normal italic text-slate-600">({p.technologies})</span>}</span>
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-emerald-700 underline text-[10.5px]">Code</a>}
              </div>
              <div className="text-slate-700 pl-2 space-y-0.5">
                {p.description?.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience / Internship */}
      {experience?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Internships &amp; Training
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="px-2 space-y-0.5 text-[11.5px]">
              <div className="flex justify-between font-bold">
                <span>{exp.jobTitle} &mdash; {exp.company}</span>
                <span className="text-slate-500 font-normal">{exp.startDate} &ndash; {exp.endDate}</span>
              </div>
              <div className="text-slate-700 pl-2">
                {exp.description?.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line.startsWith('•') ? line : `• ${line}`}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements */}
      {certifications?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Certifications &amp; Courses
          </h2>
          <div className="px-2 space-y-0.5 text-[11px] text-slate-700">
            {certifications.map((c, i) => (
              <p key={i}>&bull; <strong>{c.name}</strong> &mdash; {c.organization} ({c.issueDate})</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

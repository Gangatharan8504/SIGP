import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

/**
 * Common Helper to render formatted contact item
 */
const ContactItem = ({ icon: Icon, text, link, isLink = false }) => {
  if (!text) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] text-slate-700">
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
    languages = [],
    interests = [],
  } = data || {};

  return (
    <div className="bg-white text-slate-900 font-serif leading-snug p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[11px] space-y-2.5 overflow-hidden box-border">
      {/* Header */}
      <div className="text-center border-b border-slate-400 pb-2 space-y-0.5">
        <h1 className="text-xl font-bold uppercase tracking-wider text-black">
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
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Professional Summary
          </h2>
          <p className="text-[10.5px] text-justify text-slate-800 leading-tight">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Technical Skills
          </h2>
          <div className="space-y-0.5 text-[10.5px] text-slate-800 leading-tight">
            {skills.programming?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Programming:</strong>{' '}
                {skills.programming.join(', ')}
              </p>
            )}
            {skills.frontend?.length > 0 && (
              <p>
                <strong className="font-semibold text-black">Frontend:</strong>{' '}
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
                <strong className="font-semibold text-black">Tools &amp; Cloud:</strong>{' '}
                {skills.tools.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Experience / Internship */}
      {experience?.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Experience &amp; Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between font-bold text-black leading-tight">
                <span>
                  {exp.jobTitle} &mdash; <span className="font-semibold text-slate-800">{exp.company}</span>
                </span>
                <span className="font-normal text-slate-600 text-[10px]">
                  {exp.startDate} &ndash; {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
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
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
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
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between items-start text-[10.5px] leading-tight">
              <div>
                <strong className="font-bold text-black">{edu.degree}</strong>
                <p className="text-slate-800 text-[10px]">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-700 text-[10px] font-semibold">{edu.startYear} &ndash; {edu.endYear}</span>
                {edu.cgpa && <p className="font-bold text-black text-[10px]">CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements Combined */}
      {(certifications?.length > 0 || achievements?.length > 0) && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-black">
            Certifications &amp; Achievements
          </h2>
          <div className="space-y-0.5 text-[10px] text-slate-800 leading-tight">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="flex justify-between">
                <span>&bull; <strong>{cert.name}</strong> &mdash; {cert.organization}</span>
                {cert.issueDate && <span className="text-slate-600">{cert.issueDate}</span>}
              </div>
            ))}
            {achievements.map((ach, idx) => (
              <p key={ach.id || idx}>
                &bull; <strong>{ach.title}:</strong> {ach.description}
              </p>
            ))}
          </div>
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
  } = data || {};

  return (
    <div className="bg-white text-slate-900 font-sans p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[11px] space-y-2.5 overflow-hidden box-border">
      {/* Modern Header with Indigo Accent */}
      <div className="border-l-4 border-indigo-600 pl-3 space-y-0.5">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-600 pt-0.5">
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
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-0.5">
            About Me
          </h2>
          <p className="text-[10.5px] text-slate-700 leading-tight">{summary}</p>
        </div>
      )}

      {/* Skills Chips */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-0.5">
            Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1 text-[10px]">
            {Object.entries(skills).map(([cat, arr]) =>
              arr?.map((skill, sIdx) => (
                <span key={`${cat}_${sIdx}`} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
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
          <h2 className="text-[10.5px] font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-0.5">
            Work Experience &amp; Internships
          </h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between items-baseline font-bold text-slate-900 leading-tight">
                <span>{exp.jobTitle} &bull; <span className="text-indigo-600">{exp.company}</span></span>
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
          <h2 className="text-[10.5px] font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-0.5">
            Featured Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="space-y-0.5 text-[10.5px]">
              <div className="flex justify-between items-baseline font-bold text-slate-900 leading-tight">
                <span>{proj.name} <span className="text-[10px] font-normal text-slate-500 italic">({proj.technologies})</span></span>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 underline">
                    Repo &rarr;
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
          <h2 className="text-[10.5px] font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-0.5">
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
                {edu.cgpa && <p className="font-bold text-indigo-600 text-[10px]">CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-0.5">
            Certifications
          </h2>
          {certifications.map((c, i) => (
            <p key={i} className="text-[10px] text-slate-700">
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
  } = data || {};

  return (
    <div className="bg-white text-black font-mono p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[10.5px] space-y-2.5 overflow-hidden box-border">
      {/* Minimal Header */}
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
          <p className="leading-tight">{summary}</p>
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
  } = data || {};

  return (
    <div className="bg-white text-slate-900 font-sans p-6 sm:p-7 w-[210mm] max-w-[210mm] min-h-[297mm] max-h-[297mm] mx-auto shadow-2xl text-[11px] space-y-2.5 overflow-hidden box-border">
      {/* Header */}
      <div className="text-center pb-1.5 border-b-2 border-emerald-600 space-y-0.5">
        <h1 className="text-xl font-black text-slate-900">{personalInfo.fullName}</h1>
        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{personalInfo.professionalTitle}</p>
        <p className="text-[10px] text-slate-600">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.githubUrl, personalInfo.linkedinUrl]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Objective */}
      {summary && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
            Career Objective
          </h2>
          <p className="text-[10.5px] text-slate-700 leading-tight px-1.5">{summary}</p>
        </div>
      )}

      {/* Education First for Freshers */}
      {education?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
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
                {e.cgpa && <p className="font-bold text-emerald-700 text-[10px]">CGPA: {e.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills && Object.values(skills).some((arr) => arr?.length > 0) && (
        <div className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
            Technical Skills
          </h2>
          <div className="px-1.5 space-y-0.5 text-[10.5px] text-slate-800 leading-tight">
            {skills.programming?.length > 0 && (
              <p><strong>Programming:</strong> {skills.programming.join(', ')}</p>
            )}
            {skills.frontend?.length > 0 && (
              <p><strong>Web Tech:</strong> {skills.frontend.join(', ')}</p>
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
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
            Academic &amp; Practical Projects
          </h2>
          {projects.map((p, idx) => (
            <div key={idx} className="px-1.5 space-y-0.5 text-[10.5px]">
              <div className="flex justify-between font-bold text-slate-900 leading-tight">
                <span>{p.name} {p.technologies && <span className="font-normal italic text-slate-600 text-[10px]">({p.technologies})</span>}</span>
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-emerald-700 underline text-[10px]">Code</a>}
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

      {/* Experience / Internship */}
      {experience?.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
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
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
            Certifications &amp; Courses
          </h2>
          <div className="px-1.5 space-y-0.5 text-[10px] text-slate-700 leading-tight">
            {certifications.map((c, i) => (
              <p key={i}>&bull; <strong>{c.name}</strong> &mdash; {c.organization} ({c.issueDate})</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { learningApi } from '../../../api/apis';
import { BookOpen, FileText, Download, Star, Clock, UserCheck, Search, ArrowRight } from 'lucide-react';
import { Button, Badge, Spinner, Input } from '../../common/UIElements';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const fetchCourses = async () => {
    try {
      const res = await learningApi.getCourses({ search });
      if (res.data.success) {
        setCourses(res.data.courses || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Curated Placement Courses</h1>
          <p className="text-xs text-slate-400">Master high-yield DSA patterns, full-stack microservices, and HR frameworks</p>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c._id} className="glass-card-hover rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between">
            <div className="h-44 w-full relative overflow-hidden bg-slate-900">
              <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <Badge variant="indigo" size="sm">{c.level}</Badge>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-indigo-400">{c.category}</span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {c.durationHours} Hours
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {c.rating}
                  </span>
                </div>

                <Button variant="primary" size="sm" className="w-full" icon={ArrowRight}>
                  View Syllabus & Start
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await learningApi.getResources();
      if (res.data.success) {
        setResources(res.data.resources || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Placement Study Materials & Cheat Sheets</h1>
        <p className="text-xs text-slate-400">Download high-yield revision summaries for DSA, OS, DBMS, and ATS resumes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div key={res._id} className="glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="indigo" size="sm">{res.type}</Badge>
                <span className="text-xs font-mono text-slate-400">{res.fileSize}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{res.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{res.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{res.downloadsCount}+ downloads</span>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => alert(`Downloading "${res.title}"...`)}
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

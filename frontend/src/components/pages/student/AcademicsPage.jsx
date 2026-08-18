import React, { useState, useEffect } from 'react';
import { studentApi } from '../../../api/apis';
import { GraduationCap, Save, CheckCircle, AlertTriangle, Mail, ShieldCheck, History } from 'lucide-react';
import { Button, Input, Badge, Spinner } from '../../common/UIElements';

export const AcademicsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [changesCount, setChangesCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [academic, setAcademic] = useState({
    tenthPercentage: '',
    tenthBoard: 'CBSE',
    twelfthOrDiplomaPercentage: '',
    twelfthBoard: 'State Board',
    currentDegree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    currentSemester: 7,
    cgpa: '',
    activeBacklogs: 0,
    clearedArrears: 0,
    standingArrears: 0,
    historyOfArrears: 0,
    gapYears: 0,
    graduationYear: 2026,
  });

  useEffect(() => {
    fetchAcademics();
  }, []);

  const fetchAcademics = async () => {
    try {
      const res = await studentApi.getAcademics();
      if (res.data.success && res.data.academic) {
        const d = res.data.academic;
        setAcademic({
          tenthPercentage: d.tenthPercentage ?? '',
          tenthBoard: d.tenthBoard || 'CBSE',
          twelfthOrDiplomaPercentage: d.twelfthOrDiplomaPercentage ?? '',
          twelfthBoard: d.twelfthBoard || 'State Board',
          currentDegree: d.currentDegree || 'B.Tech',
          branch: d.branch || 'Computer Science and Engineering',
          currentSemester: d.currentSemester ?? 7,
          cgpa: d.cgpa ?? '',
          activeBacklogs: d.activeBacklogs ?? d.standingArrears ?? 0,
          clearedArrears: d.clearedArrears ?? 0,
          standingArrears: d.standingArrears ?? d.activeBacklogs ?? 0,
          historyOfArrears: d.historyOfArrears ?? 0,
          gapYears: d.gapYears ?? 0,
          graduationYear: d.graduationYear ?? 2026,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcademic((prev) => {
      const updated = { ...prev, [name]: value };
      // Keep standing arrears and active backlogs synced
      if (name === 'activeBacklogs') {
        updated.standingArrears = value;
      }
      if (name === 'standingArrears') {
        updated.activeBacklogs = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      const payload = {
        tenthPercentage: academic.tenthPercentage !== '' ? Number(academic.tenthPercentage) : null,
        tenthBoard: academic.tenthBoard,
        twelfthOrDiplomaPercentage: academic.twelfthOrDiplomaPercentage !== '' ? Number(academic.twelfthOrDiplomaPercentage) : null,
        twelfthBoard: academic.twelfthBoard,
        currentDegree: academic.currentDegree,
        branch: academic.branch,
        currentSemester: academic.currentSemester !== '' ? Number(academic.currentSemester) : null,
        cgpa: academic.cgpa !== '' ? Number(academic.cgpa) : null,
        activeBacklogs: Number(academic.activeBacklogs) || 0,
        clearedArrears: Number(academic.clearedArrears) || 0,
        standingArrears: Number(academic.activeBacklogs) || 0,
        historyOfArrears: (Number(academic.activeBacklogs) || 0) + (Number(academic.clearedArrears) || 0),
        gapYears: Number(academic.gapYears) || 0,
        graduationYear: academic.graduationYear !== '' ? Number(academic.graduationYear) : null,
      };

      const res = await studentApi.saveAcademics(payload);
      if (res.data.success) {
        setSuccess(true);
        setChangesCount(res.data.changesCount || 0);
        if (res.data.academic) {
          const d = res.data.academic;
          setAcademic((prev) => ({
            ...prev,
            cgpa: d.cgpa ?? prev.cgpa,
            activeBacklogs: d.activeBacklogs ?? prev.activeBacklogs,
            standingArrears: d.standingArrears ?? prev.standingArrears,
            clearedArrears: d.clearedArrears ?? prev.clearedArrears,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save academic details. Please verify your input.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const currentBacklogs = Number(academic.activeBacklogs || academic.standingArrears || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="rose">Academic Intelligence</Badge>
            <span className="text-xs text-rose-300 light:text-rose-800 font-mono">Automated Audit &amp; Diff Dispatch</span>
          </div>
          <h1 className="text-2xl font-black text-white light:text-rose-950 mt-1">
            Academic Credentials &amp; Backlogs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accurate academic data is utilized by the automated placement eligibility filter. Changes trigger transactional diff notifications.
          </p>
        </div>

        <Badge variant={currentBacklogs === 0 ? "emerald" : "rose"}>
          {currentBacklogs === 0 ? "Zero Active Backlogs" : `${currentBacklogs} Standing Arrear(s)`}
        </Badge>
      </div>

      {/* Success Notification Alert */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 space-y-1 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Academic Credentials &amp; Backlogs Updated Successfully!</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs pl-7">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>
              {changesCount > 0
                ? `An automated audit email detailing ${changesCount} modified field(s) has been dispatched to your registered email.`
                : "All academic records are synced and up-to-date in the database."}
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Degree & College Info */}
        <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-200 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-rose-400" /> Current Higher Education
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Current Degree"
              name="currentDegree"
              value={academic.currentDegree}
              onChange={handleChange}
              required
            />
            <Input
              label="Branch / Specialization"
              name="branch"
              value={academic.branch}
              onChange={handleChange}
              required
            />
            <Input
              label="Current Semester"
              name="currentSemester"
              type="number"
              value={academic.currentSemester}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Cumulative GPA (CGPA on 10.0 Scale)"
              name="cgpa"
              type="number"
              step="0.01"
              placeholder="e.g. 7.48"
              value={academic.cgpa}
              onChange={handleChange}
              required
            />
            <Input
              label="Year of Graduation"
              name="graduationYear"
              type="number"
              placeholder="2026 / 2027"
              value={academic.graduationYear}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Schooling & Diploma */}
        <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-200">Secondary &amp; Higher Secondary</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="10th Standard Percentage / CGPA"
              name="tenthPercentage"
              type="number"
              step="0.1"
              placeholder="e.g. 85.5"
              value={academic.tenthPercentage}
              onChange={handleChange}
              required
            />
            <Input
              label="10th Examination Board"
              name="tenthBoard"
              value={academic.tenthBoard}
              onChange={handleChange}
              placeholder="CBSE / ICSE / State Board"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="12th / Diploma Percentage"
              name="twelfthOrDiplomaPercentage"
              type="number"
              step="0.1"
              placeholder="e.g. 88.0"
              value={academic.twelfthOrDiplomaPercentage}
              onChange={handleChange}
              required
            />
            <Input
              label="12th Examination Board / Polytechnic"
              name="twelfthBoard"
              value={academic.twelfthBoard}
              onChange={handleChange}
              placeholder="CBSE / State Board"
            />
          </div>
        </div>

        {/* Backlogs and Gaps */}
        <div className="glass-panel rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Arrears &amp; Education Gap
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Active Standing Arrears"
              name="activeBacklogs"
              type="number"
              placeholder="0"
              value={academic.activeBacklogs}
              onChange={handleChange}
              required
            />
            <Input
              label="History of Arrears (Cleared)"
              name="clearedArrears"
              type="number"
              placeholder="0"
              value={academic.clearedArrears}
              onChange={handleChange}
              required
            />
            <Input
              label="Education Gap Years"
              name="gapYears"
              type="number"
              placeholder="0"
              value={academic.gapYears}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
            className="shadow-xl shadow-rose-600/30 font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 border-0 px-8"
          >
            Save Academic Records &amp; Send Audit Email
          </Button>
        </div>
      </form>
    </div>
  );
};

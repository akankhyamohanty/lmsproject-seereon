import { useState, useEffect } from 'react';
import {
  Clock, Calendar, AlertCircle, LogIn, LogOut,
  Users, GraduationCap, ChevronRight, User,
  CheckCircle, XCircle, ShieldCheck, BookOpen,
  Lock, Unlock, ClipboardList, ChevronDown
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SHIFT_START = { h: 9, m: 30 };
const SHIFT_END   = { h: 18, m: 30 };
const toMin = (h, m) => h * 60 + m;
const getCurrentTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
};
const fmt12 = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return `${((h % 12) || 12)}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
const isShiftActive = () => {
  const n = new Date();
  const mins = toMin(n.getHours(), n.getMinutes());
  return mins >= toMin(SHIFT_START.h, SHIFT_START.m) && mins <= toMin(SHIFT_END.h, SHIFT_END.m);
};
const formatDate = (d) => {
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); }
  catch { return d; }
};
const getTodayDate = () => new Date().toISOString().split('T')[0];

// ─── Static data ──────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  { id:1, name:'Mathematics' }, { id:2, name:'Physics' },
  { id:3, name:'Chemistry' },   { id:4, name:'English' },
  { id:5, name:'Computer Science' }, { id:6, name:'Biology' },
];
const CLASSES = [
  { id:1, name:'Class 10-A' }, { id:2, name:'Class 10-B' },
  { id:3, name:'Class 11-A' }, { id:4, name:'Class 11-B' },
  { id:5, name:'Class 12-A' }, { id:6, name:'Class 12-B' },
];
const PERIODS = [
  { id:1, name:'Period 1', time:'8:00 AM - 9:00 AM' },
  { id:2, name:'Period 2', time:'9:30 AM - 10:30 AM' },
  { id:3, name:'Period 3', time:'10:45 AM - 11:45 AM' },
  { id:4, name:'Period 4', time:'12:30 PM - 1:30 PM' },
];

// ─── Shared Punch Card ────────────────────────────────────────────────────────
function PunchCard({ accent = 'blue' }) {
  const [punchIn,  setPunchIn]  = useState(null);
  const [punchOut, setPunchOut] = useState(null);
  const [shiftOn,  setShiftOn]  = useState(isShiftActive());
  const [clockNow, setClockNow] = useState(getCurrentTime());

  useEffect(() => {
    const t = setInterval(() => { setClockNow(getCurrentTime()); setShiftOn(isShiftActive()); }, 60000);
    return () => clearInterval(t);
  }, []);

  const getDuration = () => {
    if (!punchIn || !punchOut) return null;
    const [ih,im] = punchIn.split(':').map(Number);
    const [oh,om] = punchOut.split(':').map(Number);
    const diff = toMin(oh,om) - toMin(ih,im);
    if (diff <= 0) return null;
    return `${Math.floor(diff/60)}h ${diff%60}m`;
  };
  const duration = getDuration();
  const accentText = accent === 'blue' ? 'text-blue-600' : 'text-blue-600';
  const accentDots = accent === 'blue' ? 'bg-blue-400' : 'bg-blue-400';

  return (
    <div className="bg-white rounded-8xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${accentText}`} />
          <h2 className="font-bold text-gray-900">Today's Punch</h2>
          <span className="text-xs text-gray-400 font-medium">{formatDate(getTodayDate())}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700 tabular-nums">{fmt12(clockNow)}</span>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${shiftOn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${shiftOn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            {shiftOn ? 'Shift Active' : 'Outside Shift'}
          </span>
        </div>
      </div>
      <div className="p-6">
        {!shiftOn && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-amber-700 text-xs font-semibold">Punch-in / punch-out available during shift hours only (9:30 AM - 6:30 PM).</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className={`rounded-xl border-2 p-4 text-center transition-all ${punchIn ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-dashed border-gray-300'}`}>
            <LogIn className={`w-5 h-5 mx-auto mb-1 ${punchIn ? 'text-emerald-600' : 'text-gray-400'}`} />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Punch In</p>
            <p className={`text-xl font-black tabular-nums ${punchIn ? 'text-emerald-700' : 'text-gray-300'}`}>{punchIn ? fmt12(punchIn) : '--:-- --'}</p>
            {!punchIn && (
              <button type="button" onClick={() => { if (shiftOn) { setPunchIn(getCurrentTime()); setPunchOut(null); } }} disabled={!shiftOn}
                className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all active:scale-95">
                Punch In
              </button>
            )}
            {punchIn && <p className="mt-2 text-xs text-emerald-600 font-semibold">Recorded</p>}
          </div>
          <div className="text-center py-2">
            {duration
              ? <><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</p><p className={`text-2xl font-black ${accentText}`}>{duration}</p></>
              : punchIn && !punchOut
                ? <><p className="text-xs font-semibold text-gray-400 uppercase mb-1">In progress</p><div className="flex justify-center gap-1">{[0,1,2].map(i=><span key={i} className={`w-2 h-2 ${accentDots} rounded-full animate-bounce`} style={{animationDelay:`${i*0.15}s`}} />)}</div></>
                : <p className="text-xs text-gray-300 font-medium">9:30 AM - 6:30 PM</p>}
          </div>
          <div className={`rounded-xl border-2 p-4 text-center transition-all ${punchOut ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-dashed border-gray-300'}`}>
            <LogOut className={`w-5 h-5 mx-auto mb-1 ${punchOut ? 'text-red-500' : 'text-gray-400'}`} />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Punch Out</p>
            <p className={`text-xl font-black tabular-nums ${punchOut ? 'text-red-600' : 'text-gray-300'}`}>{punchOut ? fmt12(punchOut) : '--:-- --'}</p>
            {punchIn && !punchOut && (
              <button type="button" onClick={() => { if (shiftOn) setPunchOut(getCurrentTime()); }} disabled={!shiftOn}
                className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all active:scale-95">
                Punch Out
              </button>
            )}
            {punchOut && <p className="mt-2 text-xs text-red-500 font-semibold">Done</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Faculty Page ─────────────────────────────────────────────────────────────
function FacultyAttendance({ onSwitch, approvedSessions, setApprovedSessions }) {
  const [activeTab, setActiveTab] = useState('approve');
  const [form, setForm]           = useState({ date: getTodayDate(), department:'', classAssigned:'', period:'', remarks:'' });
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState('');
  const [error,   setError]       = useState('');

  const [facultyRecords, setFacultyRecords] = useState([]);
  const [attForm, setAttForm]     = useState({ date: getTodayDate(), department:'', status:'present', remarks:'' });
  const [attLoading, setAttLoading] = useState(false);
  const [attSuccess, setAttSuccess] = useState('');
  const [attError,   setAttError]   = useState('');

  const setField    = (f, v) => { setForm(p => ({...p, [f]: v})); setError(''); };
  const setAttField = (f, v) => { setAttForm(p => ({...p, [f]: v})); setAttError(''); };

  const handleApprove = async () => {
    if (!form.date || !form.department || !form.classAssigned || !form.period) {
      setError('Please fill all required fields.'); return;
    }
    const dept   = DEPARTMENTS.find(d => d.id === parseInt(form.department))?.name;
    const cls    = CLASSES.find(c => c.id === parseInt(form.classAssigned))?.name;
    const period = PERIODS.find(p => p.id === parseInt(form.period));
    if (!dept || !cls || !period) { setError('Invalid selection.'); return; }

    if (approvedSessions.some(s =>
      s.date === form.date && s.department === dept &&
      s.classAssigned === cls && s.periodId === parseInt(form.period)
    )) {
      setError(`Already approved: ${dept} - ${cls} - ${period.name} on this date.`); return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const session = {
      id: Date.now(), date: form.date, department: dept, classAssigned: cls,
      periodId: parseInt(form.period), periodName: period.name, periodTime: period.time,
      remarks: form.remarks, approvedAt: new Date().toISOString(), studentCount: 0,
    };
    setApprovedSessions(prev => [session, ...prev]);
    setSuccess(`Approved! Students in ${cls} can now mark attendance for ${dept} - ${period.name}.`);
    setForm({ date: getTodayDate(), department:'', classAssigned:'', period:'', remarks:'' });
    setLoading(false);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleRevoke = (id) => setApprovedSessions(prev => prev.filter(s => s.id !== id));

  const handleMarkFaculty = async () => {
    if (!attForm.date || !attForm.department) { setAttError('Please fill all required fields.'); return; }
    const dept = DEPARTMENTS.find(d => d.id === parseInt(attForm.department))?.name;
    if (!dept) { setAttError('Invalid department.'); return; }
    if (facultyRecords.some(r => r.date === attForm.date && r.department === dept)) {
      setAttError(`Already marked for ${dept} on this date.`); return;
    }
    setAttLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setFacultyRecords(prev => [{ id: Date.now(), ...attForm, department: dept, timestamp: new Date().toISOString() }, ...prev]);
    setAttSuccess('Your attendance has been marked!');
    setAttForm({ date: getTodayDate(), department:'', status:'present', remarks:'' });
    setAttLoading(false);
    setTimeout(() => setAttSuccess(''), 3000);
  };

  const todaySessions = approvedSessions.filter(s => s.date === getTodayDate());
  const sel = "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Faculty Portal</span>
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200">
            <ShieldCheck className="w-3 h-3" /> Approval Control
          </span>
        </div>
        <button type="button" onClick={onSwitch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm font-semibold text-gray-600 hover:text-blue-700 transition-all group">
          <GraduationCap className="w-4 h-4" /> Student Portal
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Faculty Portal</h1>
            <p className="text-gray-500">Approve sessions and manage attendance</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{key:'approve',label:'Approve Sessions'},{key:'attendance',label:'My Attendance'},{key:'history',label:'Session History'}].map(t=>(
              <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab===t.key ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-blue-600 border border-gray-200 hover:border-blue-300'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <PunchCard accent="blue" />

        {/* ── APPROVE TAB ── */}
        {activeTab === 'approve' && (
          <>
            {todaySessions.length > 0 && (
              <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {todaySessions.length} session{todaySessions.length>1?'s':''} approved today
                </p>
                <div className="space-y-2">
                  {todaySessions.map(s=>(
                    <div key={s.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-blue-100">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Unlock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-sm font-semibold text-gray-800">{s.department} - {s.classAssigned}</span>
                        <span className="text-xs text-gray-500">{s.periodName} ({s.periodTime})</span>
                        {s.studentCount > 0 && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{s.studentCount} marked</span>}
                      </div>
                      <button type="button" onClick={() => handleRevoke(s.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-all ml-2">
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Approve Attendance Session</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Once approved, students in the selected class can mark their attendance</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                    <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} className={sel} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                    <select value={form.department} onChange={e => setField('department', e.target.value)} className={sel}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class</label>
                    <select value={form.classAssigned} onChange={e => setField('classAssigned', e.target.value)} className={sel}>
                      <option value="">Select class</option>
                      {CLASSES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Period</label>
                    <select value={form.period} onChange={e => setField('period', e.target.value)} className={sel}>
                      <option value="">Select period</option>
                      {PERIODS.map(p=><option key={p.id} value={p.id}>{p.name} - {p.time}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-left">Remarks <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={form.remarks} placeholder="e.g. Guest lecture, Lab session..."
                    onChange={e => setField('remarks', e.target.value)} className={sel} />
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"/>
                    <p className="text-emerald-700 text-sm font-medium">{success}</p>
                  </div>
                )}
                <button type="button" onClick={handleApprove} disabled={loading}
                  className={`w-full py-3.5 px-4 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 transition-all
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-600 active:scale-95'}`}>
                  {loading
                    ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>Approving...</>
                    : <><ShieldCheck className="w-4 h-4"/>Approve Session & Unlock for Students</>}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 text-left">
              <h2 className="text-xl font-bold text-gray-900">My Attendance</h2>
              <p className="text-gray-500 text-sm mt-1">Mark your own daily attendance record</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                  <input type="date" value={attForm.date} onChange={e => setAttField('date', e.target.value)} className={sel}/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <select value={attForm.department} onChange={e => setAttField('department', e.target.value)} className={sel}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Status</label>
                <div className="flex gap-3">
                  {[
                    {val:'present',bg:'bg-emerald-50',bd:'border-emerald-400',tx:'text-emerald-700',dot:'bg-emerald-500'},
                    {val:'absent', bg:'bg-red-50',    bd:'border-red-400',    tx:'text-red-700',    dot:'bg-red-500'   },
                    {val:'leave',  bg:'bg-amber-50',  bd:'border-amber-400',  tx:'text-amber-700',  dot:'bg-amber-500' },
                  ].map(({val,bg,bd,tx,dot}) => (
                    <button key={val} type="button" onClick={() => setAttField('status', val)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold text-sm transition-all
                        ${attForm.status===val ? `${bg} ${bd} ${tx}` : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${attForm.status===val ? dot : 'bg-gray-300'}`}/>
                      {val.charAt(0).toUpperCase()+val.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-left">Remarks <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={attForm.remarks} placeholder="e.g. Medical leave..."
                  onChange={e => setAttField('remarks', e.target.value)} className={sel}/>
              </div>
              {attError   && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-700 text-sm font-medium">{attError}</p></div>}
              {attSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg"><p className="text-emerald-700 text-sm font-medium">✓ {attSuccess}</p></div>}
              <button type="button" onClick={handleMarkFaculty} disabled={attLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all
                  ${attLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-600 active:scale-95'}`}>
                {attLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>Marking...</> : <><Clock className="w-4 h-4"/>Mark Attendance</>}
              </button>
            </div>
            {facultyRecords.length > 0 && (
              <div className="border-t border-gray-100 overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Date','Department','Status','Remarks'].map(h=>(
                      <th key={h} className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {facultyRecords.map(r=>(
                      <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(r.date)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{r.department}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${r.status==='present'?'bg-emerald-50 text-emerald-700':r.status==='absent'?'bg-red-50 text-red-700':'bg-amber-50 text-amber-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${r.status==='present'?'bg-emerald-500':r.status==='absent'?'bg-red-500':'bg-amber-500'}`}/>
                            {r.status.charAt(0).toUpperCase()+r.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 italic">{r.remarks||<span className="text-gray-300 not-italic">-</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">All Approved Sessions</h2>
            </div>
            <div className="overflow-x-auto">
              {approvedSessions.length > 0 ? (
                <table className="w-full text-left">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Date','Department','Class','Period','Student Responses','Action'].map(h=>(
                      <th key={h} className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {approvedSessions.map(s=>(
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(s.date)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{s.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.classAssigned}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.periodName}<br/><span className="text-xs text-gray-400">{s.periodTime}</span></td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                            <Users className="w-3 h-3"/>{s.studentCount} marked
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => handleRevoke(s.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-all">
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                  <p className="font-medium">No sessions approved yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Student Page ─────────────────────────────────────────────────────────────
function StudentAttendance({ onSwitch, approvedSessions, setApprovedSessions }) {
  const [activeTab, setActiveTab] = useState('mark');
  const [records,   setRecords]   = useState([]);
  const [filter,    setFilter]    = useState('');
  const [loading,   setLoading]   = useState(null);
  const [submitted, setSubmitted] = useState({});
  const [expanded,  setExpanded]  = useState(null);

  const todaySessions = approvedSessions.filter(s => s.date === getTodayDate());

  const handleMark = async (session, status) => {
    setLoading(session.id);
    await new Promise(r => setTimeout(r, 600));
    const record = {
      id: Date.now(), sessionId: session.id, date: session.date,
      department: session.department, classAssigned: session.classAssigned,
      periodName: session.periodName, periodTime: session.periodTime,
      status, timestamp: new Date().toISOString(),
    };
    setRecords(prev => [record, ...prev]);
    setSubmitted(prev => ({...prev, [session.id]: status}));
    setApprovedSessions(prev => prev.map(s => s.id===session.id ? {...s, studentCount: s.studentCount+1} : s));
    setLoading(null);
  };

  const stats = {
    total:   records.length,
    present: records.filter(r=>r.status==='present').length,
    absent:  records.filter(r=>r.status==='absent').length,
    get pct(){ return this.total>0?((this.present/this.total)*100).toFixed(1):0; },
  };

  const filtered = filter
    ? records.filter(r=>r.department===DEPARTMENTS.find(d=>d.id===parseInt(filter))?.name)
    : records;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Student Portal</span>
        </div>
        <button type="button" onClick={onSwitch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-all group">
          <User className="w-4 h-4"/> Faculty Portal
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"/>
        </button>
      </div>

      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Attendance</h1>
            <p className="text-gray-500">Mark attendance for faculty-approved sessions only</p>
          </div>
          <div className="flex gap-2">
            {['mark','history'].map(tab=>(
              <button key={tab} type="button" onClick={()=>setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab===tab?'bg-blue-600 text-white shadow-sm':'bg-white text-blue-600 border border-gray-200 hover:border-blue-300'}`}>
                {tab==='mark'?'Mark Attendance':'View History'}
              </button>
            ))}
          </div>
        </div>

        <PunchCard accent="blue"/>

        {activeTab === 'mark' && (
          <>
            <div className={`mb-5 p-4 rounded-xl border flex items-start gap-3 ${todaySessions.length>0?'bg-blue-50 border-blue-200':'bg-amber-50 border-amber-200'}`}>
              {todaySessions.length > 0 ? (
                <><Unlock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"/>
                  <div>
                    <p className="font-semibold text-blue-900">{todaySessions.length} session{todaySessions.length>1?'s':''} unlocked by faculty</p>
                    <p className="text-blue-700 text-sm mt-0.5">Select Present or Absent for each session below.</p>
                  </div></>
              ) : (
                <><Lock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0"/>
                  <div>
                    <p className="font-semibold text-amber-900">No sessions available yet</p>
                    <p className="text-amber-700 text-sm mt-0.5">Your faculty needs to approve a session before you can mark attendance.</p>
                  </div></>
              )}
            </div>

            <div className="space-y-4">
              {todaySessions.map(session=>{
                const marked     = submitted[session.id];
                const isLoading  = loading === session.id;
                const isExpanded = expanded === session.id;
                return (
                  <div key={session.id} className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-all ${marked?(marked==='present'?'border-emerald-200':'border-red-200'):'border-gray-200 hover:border-blue-200'}`}>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${marked?(marked==='present'?'bg-emerald-100':'bg-red-100'):'bg-blue-100'}`}>
                          <BookOpen className={`w-5 h-5 ${marked?(marked==='present'?'text-emerald-600':'text-red-600'):'text-blue-600'}`}/>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{session.department} — {session.classAssigned}</p>
                          <p className="text-sm text-gray-500">{session.periodName} · {session.periodTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {marked && (
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${marked==='present'?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-red-50 text-red-700 border border-red-200'}`}>
                            {marked==='present'?<CheckCircle className="w-3.5 h-3.5"/>:<XCircle className="w-3.5 h-3.5"/>}
                            {marked.charAt(0).toUpperCase()+marked.slice(1)} ✓
                          </span>
                        )}
                        {session.remarks && (
                          <button type="button" onClick={()=>setExpanded(isExpanded?null:session.id)}
                            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                            Note <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded?'rotate-180':''}`}/>
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded && session.remarks && (
                      <div className="px-6 pb-3">
                        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 italic">"{session.remarks}"</p>
                      </div>
                    )}
                    {!marked && (
                      <div className="px-6 pb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mark your attendance</p>
                        <div className="flex gap-3">
                          <button type="button" onClick={()=>handleMark(session,'present')} disabled={isLoading}
                            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white transition-all active:scale-95">
                            {isLoading?<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>:<CheckCircle className="w-4 h-4"/>}
                            Present
                          </button>
                          <button type="button" onClick={()=>handleMark(session,'absent')} disabled={isLoading}
                            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white transition-all active:scale-95">
                            {isLoading?<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>:<XCircle className="w-4 h-4"/>}
                            Absent
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {approvedSessions.filter(s=>s.date!==getTodayDate()).length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Past Sessions (Locked)</p>
                <div className="space-y-2">
                  {approvedSessions.filter(s=>s.date!==getTodayDate()).map(session=>(
                    <div key={session.id} className="bg-white rounded-xl border border-gray-200 px-5 py-3.5 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-gray-400"/>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{session.department} — {session.classAssigned}</p>
                          <p className="text-xs text-gray-400">{formatDate(session.date)} · {session.periodName}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">Expired</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {label:'Total Classes',value:stats.total,    color:'text-gray-900'},
                {label:'Present',      value:stats.present,  color:'text-emerald-600'},
                {label:'Absent',       value:stats.absent,   color:'text-red-600'},
                {label:'Percentage',   value:`${stats.pct}%`,color:'text-blue-600'},
              ].map(s=>(
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{s.label}</p>
                  <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900">Attendance History</h2>
                <select value={filter} onChange={e=>setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  <option value="">All Subjects</option>
                  {DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="overflow-x-auto">
                {filtered.length > 0 ? (
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-gray-100 bg-gray-50">
                      {['Date','Subject','Class','Period','Status'].map(h=>(
                        <th key={h} className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filtered.map(r=>(
                        <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3.5 text-sm text-gray-600">{formatDate(r.date)}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">{r.department}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{r.classAssigned}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{r.periodName}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${r.status==='present'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${r.status==='present'?'bg-emerald-500':'bg-red-500'}`}/>
                              {r.status.charAt(0).toUpperCase()+r.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-16 text-center text-gray-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                    <p className="font-medium">No attendance records yet</p>
                    <p className="text-sm mt-1">Mark attendance from an approved session first</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AttendanceApp() {
  const [view, setView] = useState('faculty');
  const [approvedSessions, setApprovedSessions] = useState([]);

  return view === 'faculty'
    ? <FacultyAttendance onSwitch={()=>setView('student')} approvedSessions={approvedSessions} setApprovedSessions={setApprovedSessions}/>
    : <StudentAttendance onSwitch={()=>setView('faculty')} approvedSessions={approvedSessions} setApprovedSessions={setApprovedSessions}/>;
}
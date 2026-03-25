import { useState, useEffect } from "react";
import {
  Calendar, Save, Users, Clock,
  LogIn, LogOut, AlertCircle, ShieldCheck,
  BookOpen, CheckCircle, XCircle, HourglassIcon, UserCheck,
} from "lucide-react";

const SHIFT_START = { h: 9, m: 30 };
const SHIFT_END   = { h: 18, m: 30 };

const toMin          = (h, m) => h * 60 + m;
const nowMin         = () => { const n = new Date(); return toMin(n.getHours(), n.getMinutes()); };
const getCurrentTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
};
const fmt12 = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return `${((h % 12) || 12)}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
};
const isShiftActive = () => {
  const n = nowMin();
  return n >= toMin(SHIFT_START.h, SHIFT_START.m) && n <= toMin(SHIFT_END.h, SHIFT_END.m);
};
const getDuration = (punchIn, punchOut) => {
  if (!punchIn || !punchOut) return null;
  const [ih, im] = punchIn.split(":").map(Number);
  const [oh, om] = punchOut.split(":").map(Number);
  const diff = toMin(oh, om) - toMin(ih, im);
  if (diff <= 0) return null;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};
const formatTableDate = (d) => {
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch { return d; }
};

const LS_KEY        = (date) => `faculty_attendance_${date}`;
const ADMIN_LS_KEY  = (date) => `admin_attendance_${date}`;

const loadFromLS    = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};
const saveToLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch (e) { console.error("localStorage save failed:", e); }
};

const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Physics", "Chemistry", "English"];

const FACULTY = [
  { id: 1, empId: "FAC001", name: "Dr. Arjun Mehta",    designation: "Professor",        dept: "Computer Science", icon: "CS" },
  { id: 2, empId: "FAC002", name: "Dr. Kavitha Nair",   designation: "Assoc. Professor",  dept: "Mathematics",      icon: "MA" },
  { id: 3, empId: "FAC003", name: "Prof. Rajan Pillai", designation: "Assistant Prof.",   dept: "Physics",          icon: "PH" },
  { id: 4, empId: "FAC004", name: "Dr. Sunita Rao",     designation: "Professor",         dept: "Chemistry",        icon: "CH" },
  { id: 5, empId: "FAC005", name: "Mr. Deepak Kumar",   designation: "Lecturer",          dept: "Computer Science", icon: "CS" },
  { id: 6, empId: "FAC006", name: "Dr. Meena Iyer",     designation: "Assoc. Professor",  dept: "English",          icon: "EN" },
  { id: 7, empId: "FAC007", name: "Prof. Suresh Babu",  designation: "Assistant Prof.",   dept: "Mathematics",      icon: "MA" },
  { id: 8, empId: "FAC008", name: "Dr. Anita Joshi",    designation: "Professor",         dept: "Physics",          icon: "PH" },
];

const deptColor = (dept) => ({
  "Computer Science": { bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-200",    avatar: "bg-blue-600" },
  "Mathematics":      { bg: "bg-violet-100",  text: "text-violet-700",  border: "border-violet-200",  avatar: "bg-violet-600" },
  "Physics":          { bg: "bg-cyan-100",    text: "text-cyan-700",    border: "border-cyan-200",    avatar: "bg-cyan-600" },
  "Chemistry":        { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", avatar: "bg-emerald-600" },
  "English":          { bg: "bg-rose-100",    text: "text-rose-700",    border: "border-rose-200",    avatar: "bg-rose-600" },
}[dept] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", avatar: "bg-gray-600" });

const initAdminRecord  = () => ({ punchIn: null, punchOut: null, status: "Absent" });
const initFacRecord    = () => ({ punchIn: null, punchOut: null, status: "Absent", approvedBy: null });
const initFacRecords   = () => Object.fromEntries(FACULTY.map((f) => [f.id, initFacRecord()]));

export default function InstituteAttendance() {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [date, setDate]           = useState(getTodayDate());
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [clockNow, setClockNow]   = useState(getCurrentTime());
  const [shiftOn, setShiftOn]     = useState(isShiftActive());
  const [filterTab, setFilterTab] = useState("all");
  const [saved, setSaved]         = useState(false);
  const [saveMsg, setSaveMsg]     = useState("");

  const [adminRecord, setAdminRecord] = useState(() =>
    loadFromLS(ADMIN_LS_KEY(getTodayDate()), initAdminRecord())
  );

  const [records, setRecords] = useState(() =>
    loadFromLS(LS_KEY(getTodayDate()), initFacRecords())
  );

  useEffect(() => {
    setAdminRecord(loadFromLS(ADMIN_LS_KEY(date), initAdminRecord()));
    setRecords(loadFromLS(LS_KEY(date), initFacRecords()));
    setSaved(false);
    setSaveMsg("");
  }, [date]);

  useEffect(() => {
    const poll = setInterval(() => {
      setRecords(loadFromLS(LS_KEY(date), initFacRecords()));
    }, 15000);
    return () => clearInterval(poll);
  }, [date]);

  useEffect(() => {
    const t = setInterval(() => {
      setClockNow(getCurrentTime());
      setShiftOn(isShiftActive());
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const handleAdminPunchIn = () => {
    if (!shiftOn || adminRecord.punchIn) return;
    const now    = getCurrentTime();
    const isLate = nowMin() > toMin(SHIFT_START.h, SHIFT_START.m) + 15;
    const updated = { ...adminRecord, punchIn: now, status: isLate ? "Late" : "Present" };
    setAdminRecord(updated);
    saveToLS(ADMIN_LS_KEY(date), updated);
    setSaveMsg("Your punch-in recorded successfully.");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleAdminPunchOut = () => {
    if (!shiftOn || !adminRecord.punchIn || adminRecord.punchOut) return;
    const updated = { ...adminRecord, punchOut: getCurrentTime() };
    setAdminRecord(updated);
    saveToLS(ADMIN_LS_KEY(date), updated);
    setSaveMsg("Your punch-out recorded successfully.");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const mutate = (updater) => {
    setRecords((prev) => {
      const next = updater(prev);
      saveToLS(LS_KEY(date), next);
      return next;
    });
    setSaved(false);
  };

  const handleApprove = (id) => {
    const rec = records[id];
    if (!rec.punchIn || rec.status !== "Pending") return;
    const [ih, im] = rec.punchIn.split(":").map(Number);
    const isLate   = toMin(ih, im) > toMin(SHIFT_START.h, SHIFT_START.m) + 15;
    mutate((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: isLate ? "Late" : "Present", approvedBy: "Institute Admin" },
    }));
  };

  const handleReject = (id) => {
    mutate((prev) => ({
      ...prev,
      [id]: { ...prev[id], punchIn: null, status: "Rejected", approvedBy: null },
    }));
  };

  const approveAll = () => {
    mutate((prev) => {
      const next = { ...prev };
      FACULTY.forEach(({ id }) => {
        if (next[id].status === "Pending") {
          const [ih, im] = next[id].punchIn.split(":").map(Number);
          const isLate   = toMin(ih, im) > toMin(SHIFT_START.h, SHIFT_START.m) + 15;
          next[id] = { ...next[id], status: isLate ? "Late" : "Present", approvedBy: "Institute Admin" };
        }
      });
      return next;
    });
  };

  const handlePunchOutAll = () => {
    if (!shiftOn) return;
    const now = getCurrentTime();
    mutate((prev) => {
      const next = { ...prev };
      FACULTY.forEach(({ id }) => {
        if (next[id].punchIn && !next[id].punchOut &&
            (next[id].status === "Present" || next[id].status === "Late"))
          next[id] = { ...next[id], punchOut: now };
      });
      return next;
    });
  };

  const handlePunchOut = (id) => {
    const rec = records[id];
    if (!shiftOn || !rec.punchIn || rec.punchOut) return;
    if (rec.status !== "Present" && rec.status !== "Late") return;
    mutate((prev) => ({ ...prev, [id]: { ...prev[id], punchOut: getCurrentTime() } }));
  };

  const handleSave = () => {
    saveToLS(LS_KEY(date), records);
    saveToLS(ADMIN_LS_KEY(date), adminRecord);
    setSaved(true);
    setSaveMsg(`Saved for ${formatTableDate(date)}`);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const baseFaculty    = selectedDept === "All Departments" ? FACULTY : FACULTY.filter((f) => f.dept === selectedDept);
  const visibleFaculty =
    filterTab === "pending"  ? baseFaculty.filter((f) => records[f.id].status === "Pending")
    : filterTab === "approved" ? baseFaculty.filter((f) => ["Present","Late"].includes(records[f.id].status))
    : filterTab === "absent"   ? baseFaculty.filter((f) => ["Absent","Rejected"].includes(records[f.id].status))
    : baseFaculty;

  const allRecs      = Object.values(records);
  const presentCount = allRecs.filter((r) => r.status === "Present" || r.status === "Late").length;
  const pendingCount = allRecs.filter((r) => r.status === "Pending").length;
  const absentCount  = allRecs.filter((r) => r.status === "Absent").length;
  const lateCount    = allRecs.filter((r) => r.status === "Late").length;
  const rejectedCount= allRecs.filter((r) => r.status === "Rejected").length;

  const adminDur = getDuration(adminRecord.punchIn, adminRecord.punchOut);

  const statusBadge = (r) => {
    if (r.status === "Pending")  return { label: "Awaiting Approval", cls: "bg-amber-50 text-amber-700 border-amber-300" };
    if (r.status === "Rejected") return { label: "Rejected",          cls: "bg-red-50 text-red-600 border-red-200" };
    if (r.punchOut)              return { label: "Completed",         cls: "bg-blue-50 text-blue-600 border-blue-200" };
    if (r.status === "Late")     return { label: "Late",              cls: "bg-orange-50 text-orange-600 border-orange-200" };
    if (r.status === "Present")  return { label: "Present",           cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    return                              { label: "Absent",            cls: "bg-red-50 text-red-500 border-red-200" };
  };

  const TABS = [
    { id: "all",      label: "All",             count: baseFaculty.length },
    { id: "pending",  label: "Pending",          count: baseFaculty.filter(f => records[f.id].status === "Pending").length },
    { id: "approved", label: "Approved",         count: baseFaculty.filter(f => ["Present","Late"].includes(records[f.id].status)).length },
    { id: "absent",   label: "Absent/Rejected",  count: baseFaculty.filter(f => ["Absent","Rejected"].includes(records[f.id].status)).length },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="w-full max-w-8xl mx-auto px-4 py-8 pb-32">

        {/* ── HEADER ── */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                Institute Attendance
              </h1>
              <p className="text-sm text-slate-500" style={{ fontFamily: "sans-serif" }}>
                Mark your attendance · Approve faculty · Shift:{" "}
                <span className="font-semibold text-slate-700">9:30 AM – 6:30 PM</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3" style={{ fontFamily: "sans-serif" }}>
            <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-xl text-sm">
              <Calendar size={14} className="text-slate-400" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="outline-none bg-transparent text-slate-700 font-semibold" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-xl text-sm">
              <BookOpen size={14} className="text-slate-400" />
              <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                className="outline-none bg-transparent text-slate-700 font-semibold">
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── ADMIN OWN ATTENDANCE ── */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2"
            style={{ fontFamily: "sans-serif" }}>
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-blue-600">My Attendance (Institute Admin)</h2>
            <span className="ml-auto text-xs font-semibold text-blue-600">{formatTableDate(date)}</span>
          </div>

          <div className="p-6" style={{ fontFamily: "sans-serif" }}>
            {!shiftOn && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-semibold">
                  Punch-in is only available during shift hours (9:30 AM – 6:30 PM).
                </p>
              </div>
            )}

            {saveMsg && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-blue-600 text-xs font-semibold">{saveMsg}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md relative">
                  IA
                  {adminRecord.status === "Present" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                  {adminRecord.status === "Late" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800" style={{ fontFamily: "Georgia, serif" }}>Institute Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                    adminRecord.status === "Present" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : adminRecord.status === "Late"   ? "bg-orange-50 text-orange-600 border-orange-200"
                    : adminRecord.punchOut            ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {adminRecord.punchOut ? "Completed" : adminRecord.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold min-w-[120px] ${
                  adminRecord.punchIn
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-slate-50 border-dashed border-slate-300 text-slate-400"
                }`}>
                  <LogIn size={14} className={adminRecord.punchIn ? "text-emerald-500" : "text-slate-300"} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-black opacity-60">Punch In</p>
                    <p className="tabular-nums text-base">{adminRecord.punchIn ? fmt12(adminRecord.punchIn) : "--:-- --"}</p>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-400 min-w-[50px] text-center">
                  {adminDur ? (
                    <span className="text-blue-600 font-bold text-sm">{adminDur}</span>
                  ) : adminRecord.punchIn && !adminRecord.punchOut ? (
                    <div className="flex gap-0.5 justify-center">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  ) : <span className="text-slate-300 text-base">→</span>}
                </div>

                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold min-w-[120px] ${
                  adminRecord.punchOut
                    ? "bg-rose-50 border-rose-300 text-rose-600"
                    : "bg-slate-50 border-dashed border-slate-300 text-slate-400"
                }`}>
                  <LogOut size={14} className={adminRecord.punchOut ? "text-rose-400" : "text-slate-300"} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-black opacity-60">Punch Out</p>
                    <p className="tabular-nums text-base">{adminRecord.punchOut ? fmt12(adminRecord.punchOut) : "--:-- --"}</p>
                  </div>
                </div>

                <div className="flex gap-3 ml-auto">
                  <button
                    onClick={handleAdminPunchIn}
                    disabled={!shiftOn || !!adminRecord.punchIn}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition active:scale-95 shadow-sm ${
                      adminRecord.punchIn
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 cursor-default"
                        : shiftOn
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}>
                    <LogIn size={14} />
                    {adminRecord.punchIn ? "Punched In ✓" : "Punch In"}
                  </button>

                  <button
                    onClick={handleAdminPunchOut}
                    disabled={!shiftOn || !adminRecord.punchIn || !!adminRecord.punchOut}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition active:scale-95 shadow-sm ${
                      adminRecord.punchOut
                        ? "bg-rose-100 text-rose-600 border-rose-200 cursor-default"
                        : adminRecord.punchIn && shiftOn
                        ? "bg-white text-slate-700 border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}>
                    <LogOut size={14} />
                    {adminRecord.punchOut ? "Punched Out ✓" : "Punch Out"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FACULTY APPROVAL PANEL ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3"
            style={{ fontFamily: "sans-serif" }}>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800">Faculty Attendance Approval</h2>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">{formatTableDate(date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700 tabular-nums">{fmt12(clockNow)}</span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                shiftOn ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${shiftOn ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {shiftOn ? "Shift Active" : "Outside Shift"}
              </span>
            </div>
          </div>

          <div className="p-6" style={{ fontFamily: "sans-serif" }}>
            {pendingCount > 0 && (
              <div className="mb-5 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HourglassIcon className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-amber-800 text-xs font-bold">
                    {pendingCount} faculty member{pendingCount > 1 ? "s" : ""} awaiting your approval
                  </p>
                </div>
                <button onClick={approveAll}
                  className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition whitespace-nowrap">
                  Approve All
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
              {[
                { label: "Present",  value: presentCount,   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
                { label: "Absent",   value: absentCount,    color: "text-red-600",     bg: "bg-red-50 border-red-100" },
                { label: "Late",     value: lateCount,      color: "text-orange-600",  bg: "bg-orange-50 border-orange-100" },
                { label: "Pending",  value: pendingCount,   color: "text-amber-600",   bg: "bg-amber-50 border-amber-100" },
                { label: "Rejected", value: rejectedCount,  color: "text-rose-600",    bg: "bg-rose-50 border-rose-100" },
                { label: "Total",    value: FACULTY.length, color: "text-slate-800",   bg: "bg-slate-50 border-slate-200" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-3 text-center ${s.bg}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={approveAll} disabled={pendingCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                <CheckCircle size={14} /> Approve All Pending
              </button>
              <button onClick={handlePunchOutAll} disabled={!shiftOn}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                <LogOut size={14} /> Punch-Out All Approved
              </button>
            </div>
          </div>
        </div>

        {/* ── FACULTY LIST ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 pt-4 pb-0 bg-slate-50 border-b border-slate-200" style={{ fontFamily: "sans-serif" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                <Users size={16} /> Faculty Members
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{visibleFaculty.length} shown</span>
            </div>
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setFilterTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t-lg border-b-2 transition-all ${
                    filterTab === tab.id
                      ? "border-indigo-600 text-indigo-700 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                      tab.id === "pending"  ? "bg-amber-100 text-amber-700"
                      : tab.id === "approved" ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                    }`}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {visibleFaculty.map((faculty) => {
              const rec         = records[faculty.id];
              const badge       = statusBadge(rec);
              const isPending   = rec.status === "Pending";
              const isApproved  = rec.status === "Present" || rec.status === "Late";
              const canPunchOut = shiftOn && isApproved && !rec.punchOut;
              const dur         = getDuration(rec.punchIn, rec.punchOut);
              const dc          = deptColor(faculty.dept);

              return (
                <div key={faculty.id}
                  className={`p-4 transition-colors ${isPending ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-slate-50"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className={`w-11 h-11 rounded-xl ${dc.avatar} flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm relative`}>
                        {faculty.icon}
                        {isPending && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          </span>
                        )}
                        {isApproved && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Georgia, serif" }}>{faculty.name}</p>
                        <p className="text-xs text-slate-500" style={{ fontFamily: "sans-serif" }}>{faculty.designation}</p>
                        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${dc.bg} ${dc.text} ${dc.border}`}
                          style={{ fontFamily: "sans-serif" }}>
                          {faculty.dept}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center gap-2 flex-wrap" style={{ fontFamily: "sans-serif" }}>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold min-w-[105px] ${
                        isPending   ? "bg-amber-50 border-amber-300 text-amber-700"
                        : rec.punchIn ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-slate-50 border-dashed border-slate-300 text-slate-400"
                      }`}>
                        <LogIn size={12} className={isPending ? "text-amber-500" : rec.punchIn ? "text-emerald-500" : "text-slate-300"} />
                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-black opacity-60">Requested In</p>
                          <p className="tabular-nums">{rec.punchIn ? fmt12(rec.punchIn) : "--:-- --"}</p>
                        </div>
                      </div>

                      <div className="text-center text-xs font-semibold text-slate-400 min-w-[44px]">
                        {dur ? <span className="text-indigo-600 font-bold">{dur}</span>
                          : isApproved && !rec.punchOut ? (
                            <div className="flex gap-0.5 justify-center">
                              {[0,1,2].map(i => (
                                <span key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                                  style={{ animationDelay: `${i * 0.15}s` }} />
                              ))}
                            </div>
                          ) : <span className="text-slate-300">→</span>}
                      </div>

                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold min-w-[105px] ${
                        rec.punchOut
                          ? "bg-rose-50 border-rose-300 text-rose-600"
                          : "bg-slate-50 border-dashed border-slate-300 text-slate-400"
                      }`}>
                        <LogOut size={12} className={rec.punchOut ? "text-rose-400" : "text-slate-300"} />
                        <div>
                          <p className="text-[9px] uppercase tracking-wider font-black opacity-60">Out</p>
                          <p className="tabular-nums">{rec.punchOut ? fmt12(rec.punchOut) : "--:-- --"}</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${badge.cls}`}>
                        {badge.label}
                      </span>

                      <div className="flex gap-2 ml-auto flex-wrap">
                        {isPending && (
                          <>
                            <button onClick={() => handleApprove(faculty.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 transition active:scale-95 shadow-sm">
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button onClick={() => handleReject(faculty.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-red-50 text-red-600 border-red-300 hover:bg-red-100 transition active:scale-95">
                              <XCircle size={12} /> Reject
                            </button>
                          </>
                        )}
                        {isApproved && (
                          <>
                            <button onClick={() => handlePunchOut(faculty.id)} disabled={!canPunchOut}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition active:scale-95 ${
                                rec.punchOut
                                  ? "bg-rose-100 text-rose-600 border-rose-200 cursor-default"
                                  : canPunchOut
                                  ? "bg-white text-slate-600 border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
                                  : "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                              }`}>
                              <LogOut size={12} />
                              {rec.punchOut ? "Out ✓" : "Punch Out"}
                            </button>
                            <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-wider self-center">
                              <ShieldCheck size={10} /> Approved
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleFaculty.length === 0 && (
            <div className="py-16 text-center text-slate-400" style={{ fontFamily: "sans-serif" }}>
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No faculty in this view</p>
            </div>
          )}
        </div>
      </div>

      {/* ── SAVE BAR (Reset button removed) ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] flex justify-between items-center z-10"
        style={{ fontFamily: "sans-serif" }}>
        <p className="text-xs text-slate-500 hidden sm:block">
          {saveMsg
            ? <span className="text-emerald-600 font-semibold">✓ {saveMsg}</span>
            : <>
                <span className="font-semibold text-indigo-700">Admin: {adminRecord.status}</span> ·{" "}
                <span className="font-semibold text-emerald-700">{presentCount}</span> faculty approved ·{" "}
                <span className="font-semibold text-amber-600">{pendingCount}</span> pending
              </>
          }
        </p>
        <div className="flex gap-3 ml-auto">
          <button onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg ${
              saved
                ? "bg-emerald-600 text-white shadow-emerald-500/30"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-indigo-500/30"
            }`}>
            <Save size={15} />
            {saved ? "Saved ✓" : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
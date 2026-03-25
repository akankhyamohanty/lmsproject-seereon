import { useState, useEffect } from "react";
import {
  Calendar, Clock, LogIn, LogOut, 
  AlertCircle, GraduationCap, HourglassIcon, 
  CheckCircle, XCircle, Briefcase, ChevronLeft, ChevronRight
} from "lucide-react";

// --- CONFIGURATION ---
const SHIFT_START = { h: 9, m: 30 };
const SHIFT_END   = { h: 18, m: 30 };

// Logged-in User Context
const ME = { id: 1, name: "Dr. Arjun Mehta", designation: "Professor", dept: "Computer Science" };

// --- HELPERS ---
const toMin = (h, m) => h * 60 + m;
const nowMin = () => { const n = new Date(); return toMin(n.getHours(), n.getMinutes()); };
const getCurrentTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
};
const fmt12 = (t) => {
  if (!t) return "--:--";
  const [h, m] = t.split(":").map(Number);
  return `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
const isShiftActive = () => {
  const n = nowMin();
  return n >= toMin(SHIFT_START.h, SHIFT_START.m) && n <= toMin(SHIFT_END.h, SHIFT_END.m);
};

// Calculate duration in decimal hours for easier math
const getDurationData = (punchIn, punchOut) => {
  if (!punchIn || !punchOut) return 0;
  const [ih, im] = punchIn.split(":").map(Number);
  const [oh, om] = punchOut.split(":").map(Number);
  return (toMin(oh, om) - toMin(ih, im)) / 60;
};

const formatDuration = (hours) => {
  if (hours <= 0) return "0h 0m";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

export default function MyAttendancePortal() {
  const getToday = () => new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(getToday());
  const [clockNow, setClockNow] = useState(getCurrentTime());
  const [history, setHistory] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({ punchIn: null, punchOut: null, status: "Absent" });

  // 1. Fetch History from LocalStorage (Simulating a DB)
  useEffect(() => {
    const allRecords = [];
    const today = new Date();
    
    // Look back 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const saved = localStorage.getItem(`faculty_attendance_${ME.id}_${dateStr}`);
      if (saved) {
        allRecords.push({ date: dateStr, ...JSON.parse(saved) });
      }
    }
    setHistory(allRecords);

    // Set today's specific record
    const todaySaved = localStorage.getItem(`faculty_attendance_${ME.id}_${date}`);
    setCurrentRecord(todaySaved ? JSON.parse(todaySaved) : { punchIn: null, punchOut: null, status: "Absent" });
  }, [date]);

  // 2. Real-time Clock
  useEffect(() => {
    const t = setInterval(() => setClockNow(getCurrentTime()), 10000);
    return () => clearInterval(t);
  }, []);

  // 3. Stats Logic
  const stats = history.reduce((acc, rec) => {
    if (rec.status === "Present" || rec.status === "Late") acc.present++;
    if (rec.status === "Absent") acc.absent++;
    acc.hours += getDurationData(rec.punchIn, rec.punchOut);
    return acc;
  }, { present: 0, absent: 0, hours: 0 });

  // 4. Handlers
  const handlePunch = (type) => {
    const newRec = { ...currentRecord };
    if (type === 'in') {
      newRec.punchIn = getCurrentTime();
      newRec.status = "Pending";
    } else {
      newRec.punchOut = getCurrentTime();
    }
    setCurrentRecord(newRec);
    localStorage.setItem(`faculty_attendance_${ME.id}_${date}`, JSON.stringify(newRec));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-8xl mx-auto">
        
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{ME.name}</h1>
              <p className="text-slate-500 font-medium text-md">{ME.designation} • {ME.dept}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
             <Clock size={18} className="text-indigo-500" />
             <span className="text-lg font-bold tabular-nums">{fmt12(clockNow)}</span>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Days Present", val: stats.present, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total Hours", val: formatDuration(stats.hours), color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Days Absent", val: stats.absent, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Current Status", val: currentRecord.status, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-5 rounded-3xl border border-white shadow-sm`}>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* PUNCH CARD (LEFT) */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-6">Today's Session</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">In</p>
                    <p className="font-black text-lg">{fmt12(currentRecord.punchIn)}</p>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-100"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Out</p>
                    <p className="font-black text-lg">{fmt12(currentRecord.punchOut)}</p>
                  </div>
                </div>

                {!currentRecord.punchIn ? (
                  <button 
                    onClick={() => handlePunch('in')}
                    disabled={!isShiftActive()}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} /> Punch In
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePunch('out')}
                    disabled={!!currentRecord.punchOut || currentRecord.status === "Pending"}
                    className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:border-rose-200 hover:text-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    <LogOut size={18} /> Punch Out
                  </button>
                )}
                
                {currentRecord.status === "Pending" && (
                  <div className="flex items-center gap-2 justify-center text-amber-600 text-sm font-bold animate-pulse">
                    <HourglassIcon size={14} /> Waiting for Approval
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
               <div className="flex items-center gap-3 mb-2">
                  <AlertCircle size={18} className="text-indigo-300" />
                  <p className="font-bold text-md">Shift Policy</p>
               </div>
               <p className="text-sm text-indigo-200 leading-relaxed">
                 Attendance requires Institute Admin approval. Punch-in is only available between 9:30 AM and 6:30 PM.
               </p>
            </div>
          </div>

          {/* HISTORY LIST (RIGHT) */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-black text-lg">Activity History</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><ChevronLeft size={20} /></button>
                  <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
                {history.length > 0 ? history.map((rec, i) => {
                  const duration = getDurationData(rec.punchIn, rec.punchOut);
                  return (
                    <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[50px]">
                          <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(rec.date).toLocaleString('default', { month: 'short' })}</p>
                          <p className="text-xl font-black leading-none">{new Date(rec.date).getDate()}</p>
                        </div>
                        <div>
                          <p className="font-bold text-md">{new Date(rec.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            <span>{fmt12(rec.punchIn)}</span>
                            <span>•</span>
                            <span>{fmt12(rec.punchOut)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                          <p className="text-[9px] font-black text-slate-300 uppercase">Work Time</p>
                          <p className="text-sm font-bold text-blue-600">{formatDuration(duration)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          rec.status === "Present" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          rec.status === "Late" ? "bg-orange-50 text-orange-600 border-orange-100" :
                          "bg-slate-50 text-slate-400 border-slate-100"
                        }`}>
                          {rec.status}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-20 text-center opacity-30">
                    <Briefcase size={40} className="mx-auto mb-4" />
                    <p className="font-bold">No history available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
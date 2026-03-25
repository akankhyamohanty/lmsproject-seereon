import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar, Clock, LogIn, LogOut, 
  AlertCircle, GraduationCap, HourglassIcon, 
  CheckCircle, XCircle, Briefcase, ChevronLeft, ChevronRight,
  Loader2
} from "lucide-react";

// --- CONFIGURATION ---
const SHIFT_START = { h: 9, m: 30 };
const SHIFT_END   = { h: 18, m: 30 };

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
  const [clockNow, setClockNow] = useState(getCurrentTime());
  const [history, setHistory] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({ punchIn: null, punchOut: null, status: "Absent" });
  const [profile, setProfile] = useState({ name: "Loading...", designation: "", dept: "" });
  const [loading, setLoading] = useState(true);

  // 🎯 REMOVED: token and headers variables from here

  // 1. Fetch Dynamic Data from Backend
  const fetchAttendanceData = async () => {
    try {
      // 🎯 FIXED: Replaced { headers } with { withCredentials: true } for all 3 requests
      const [profRes, historyRes, todayRes] = await Promise.all([
        axios.get("http://localhost:5000/api/faculty/profile", { withCredentials: true }),
        axios.get("http://localhost:5000/api/faculty/attendance/history", { withCredentials: true }),
        axios.get("http://localhost:5000/api/faculty/attendance/today", { withCredentials: true })
      ]);

      if (profRes.data.success) setProfile(profRes.data.data);
      if (historyRes.data.success) setHistory(historyRes.data.data);
      if (todayRes.data.success && todayRes.data.data) {
        setCurrentRecord(todayRes.data.data);
      } else {
        setCurrentRecord({ punchIn: null, punchOut: null, status: "Absent" });
      }
    } catch (err) {
      console.error("Error fetching portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // 2. Real-time Clock
  useEffect(() => {
    const t = setInterval(() => setClockNow(getCurrentTime()), 10000);
    return () => clearInterval(t);
  }, []);

  // 3. Stats Logic (Dynamic based on API history)
  const stats = history.reduce((acc, rec) => {
    if (rec.status === "Present" || rec.status === "Late") acc.present++;
    if (rec.status === "Absent") acc.absent++;
    acc.hours += getDurationData(rec.punchIn, rec.punchOut);
    return acc;
  }, { present: 0, absent: 0, hours: 0 });

  // 4. Punch Handlers (Axios POST)
  const handlePunch = async (type) => {
    try {
      // 🎯 FIXED: Replaced { headers } with { withCredentials: true }
      const res = await axios.post(
        "http://localhost:5000/api/faculty/attendance/punch",
        { type },
        { withCredentials: true }
      );

      if (res.data.success) {
        fetchAttendanceData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Punch action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="font-bold text-slate-400">Loading Attendance Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-8xl mx-auto">
        
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <GraduationCap size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
              <p className="text-slate-500 font-medium text-md">{profile.designation} • {profile.dept}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
             <Clock size={18} className="text-indigo-500" />
             <span className="text-lg font-bold tabular-nums">{fmt12(clockNow)}</span>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
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
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <LogIn size={18} /> Punch In
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePunch('out')}
                    disabled={!!currentRecord.punchOut}
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

            <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 text-left">
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
                      <div className="flex items-center gap-4 text-left">
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
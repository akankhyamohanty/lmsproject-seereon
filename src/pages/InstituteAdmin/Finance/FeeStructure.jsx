import React, { useState, useEffect } from "react";
import {
  Save, X, Check, ChevronDown, BookOpen, Clock, Hash,
  DollarSign, Layers, AlertCircle, FileText, Send, CheckCircle,
  Bell, Search, GraduationCap, CalendarDays, MessageSquare,
  UserCheck, Megaphone, Inbox, Trash2, TrendingUp, Receipt
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const COURSES = [
  { name: "B.Tech Computer Science",        duration: 4, semesters: 8 },
  { name: "B.Tech Information Technology",  duration: 4, semesters: 8 },
  { name: "B.Tech Electronics & Communication", duration: 4, semesters: 8 },
  { name: "B.Tech Mechanical Engineering",  duration: 4, semesters: 8 },
  { name: "B.Tech Civil Engineering",       duration: 4, semesters: 8 },
  { name: "B.Sc Computer Science",          duration: 3, semesters: 6 },
  { name: "B.Sc Mathematics",               duration: 3, semesters: 6 },
  { name: "B.Sc Physics",                   duration: 3, semesters: 6 },
  { name: "MBA",                            duration: 2, semesters: 4 },
  { name: "BBA",                            duration: 3, semesters: 6 },
  { name: "M.Tech",                         duration: 2, semesters: 4 },
  { name: "MCA",                            duration: 2, semesters: 4 },
];

const FEE_TITLES = [
  "Tuition Fee", "Exam Fee", "Lab Fee", "Library Fee",
  "Sports Fee", "Infrastructure Fee", "Development Fee", "Hostel Fee",
];

const FS_KEY    = "fee_structures_v3";
const ST_KEY    = "fee_students_v3";
const NOTIF_KEY = "fee_notifications_v1";

const getFS     = () => { try { return JSON.parse(localStorage.getItem(FS_KEY)    || "[]"); } catch { return []; } };
const saveFS    = (d) => localStorage.setItem(FS_KEY, JSON.stringify(d));
const getST     = () => { try { return JSON.parse(localStorage.getItem(ST_KEY)    || "[]"); } catch { return []; } };
const getNotifs = () => { try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]"); } catch { return []; } };
const saveNotifs= (d) => localStorage.setItem(NOTIF_KEY, JSON.stringify(d));

const seedStudents = () => {
  if (getST().length > 0) return;
  localStorage.setItem(ST_KEY, JSON.stringify([
    { id: 1, name: "Rahul Sharma",  email: "rahul@edu.in",  phone: "9876543210", rollNo: "CSE-001", course: "B.Tech Computer Science",       department: "Computer Science",       year: "2024-25", studentStatus: "Active"   },
    { id: 2, name: "Priya Das",     email: "priya@edu.in",  phone: "9876543211", rollNo: "IT-002",  course: "B.Tech Information Technology",  department: "Information Technology", year: "2024-25", studentStatus: "Active"   },
    { id: 3, name: "Amit Verma",    email: "amit@edu.in",   phone: "9876543212", rollNo: "MBA-003", course: "MBA",                            department: "Business Administration", year: "2024-25", studentStatus: "Active"   },
    { id: 4, name: "Sneha Patel",   email: "sneha@edu.in",  phone: "9876543213", rollNo: "CSE-004", course: "B.Tech Computer Science",        department: "Computer Science",       year: "2024-25", studentStatus: "On Leave" },
    { id: 5, name: "Karan Singh",   email: "karan@edu.in",  phone: "9876543214", rollNo: "BSC-005", course: "B.Sc Mathematics",               department: "Mathematics",            year: "2024-25", studentStatus: "Active"   },
  ]));
};

const defaultFS = { course: "", feeTitle: "", semesters: [], amountPerSem: "", status: "Draft" };

// ─── Semester Grid ─────────────────────────────────────────────────────────────
const SemesterGrid = ({ total, selected, onToggle }) => (
  <div className="grid grid-cols-4 gap-2">
    {Array.from({ length: total }, (_, i) => i + 1).map(sem => {
      const active = selected.includes(sem);
      return (
        <button key={sem} type="button" onClick={() => onToggle(sem)}
          className={`relative h-11 rounded-xl font-black text-sm transition-all duration-200 border-2 ${
            active
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
          }`}>
          {active && <Check size={10} className="absolute top-1 right-1" />}
          S{sem}
        </button>
      );
    })}
  </div>
);

// ─── Fee Structure Form ────────────────────────────────────────────────────────
const FeeStructureForm = ({ onSaved }) => {
  const [form, setForm]     = useState(defaultFS);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const course = COURSES.find(c => c.name === form.course);

  const toggleSem = (s) => setForm(p => ({
    ...p,
    semesters: p.semesters.includes(s)
      ? p.semesters.filter(x => x !== s)
      : [...p.semesters, s].sort((a, b) => a - b),
  }));

  const validate = () => {
    const e = {};
    if (!form.course)    e.course     = "Select a course";
    if (!form.feeTitle)  e.feeTitle   = "Select fee type";
    if (!form.amountPerSem || isNaN(form.amountPerSem) || Number(form.amountPerSem) <= 0)
                         e.amountPerSem = "Enter valid amount";
    if (form.semesters.length === 0) e.semesters = "Select at least one semester";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const entry = {
        id: Date.now(), ...form,
        totalAmount: Number(form.amountPerSem) * form.semesters.length,
        createdAt: new Date().toISOString(),
      };
      saveFS([...getFS(), entry]);
      setSaving(false); setSaved(true);
      setForm(defaultFS); setErrors({});
      onSaved?.();
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-blue-600 px-6 py-5 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl"><Layers size={18} className="text-white" /></div>
        <div>
          <h2 className="text-white font-black text-lg">Fee Structure</h2>
          <p className="text-blue-200 text-xs mt-0.5">Define course-wise fee configuration</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Course */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <BookOpen size={10} /> Course Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.course}
              onChange={e => setForm(p => ({ ...p, course: e.target.value, semesters: [] }))}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none appearance-none transition-all
                ${errors.course ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"}`}>
              <option value="">Select Course</option>
              {COURSES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.course && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{errors.course}</p>}
          {course && (
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                <Clock size={11} /> {course.duration} years
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
                <Hash size={11} /> {course.semesters} semesters
              </span>
            </div>
          )}
        </div>

        {/* Fee Type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <FileText size={10} /> Fee Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.feeTitle} onChange={e => setForm(p => ({ ...p, feeTitle: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none appearance-none transition-all
                ${errors.feeTitle ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"}`}>
              <option value="">Select Fee Type</option>
              {FEE_TITLES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.feeTitle && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{errors.feeTitle}</p>}
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <DollarSign size={10} /> Amount Per Semester <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-sm">₹</span>
            <input type="number" value={form.amountPerSem}
              onChange={e => setForm(p => ({ ...p, amountPerSem: e.target.value }))}
              placeholder="0"
              className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-semibold outline-none transition-all
                ${errors.amountPerSem ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"}`} />
          </div>
          {errors.amountPerSem && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{errors.amountPerSem}</p>}
        </div>

        {/* Semesters */}
        {course ? (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1"><Hash size={10} /> Select Semesters <span className="text-red-500">*</span></span>
              {form.semesters.length > 0 && (
                <span className="text-indigo-600 font-bold normal-case">{form.semesters.length} selected</span>
              )}
            </label>
            <SemesterGrid total={course.semesters} selected={form.semesters} onToggle={toggleSem} />
            {errors.semesters && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{errors.semesters}</p>}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-semibold">Select a course to see semester options</p>
          </div>
        )}

        {/* Summary */}
        {form.course && form.semesters.length > 0 && form.amountPerSem && (
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Per Semester</span>
                <span className="text-slate-800 font-bold">₹{Number(form.amountPerSem).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Semesters</span>
                <span className="text-slate-800 font-bold">{form.semesters.length} ({form.semesters.map(s => `S${s}`).join(", ")})</span>
              </div>
              <div className="border-t border-indigo-200 pt-2 flex justify-between">
                <span className="text-xs font-black text-slate-700">Total Amount</span>
                <span className="text-base font-black text-indigo-700">
                  ₹{(Number(form.amountPerSem) * form.semesters.length).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={saving || saved}
          className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all
            ${saved    ? "bg-emerald-500 text-white"
            : saving   ? "bg-indigo-400 text-white cursor-wait"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"}`}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : saving ? "Saving..." : <><Save size={16} /> Save Fee Structure</>}
        </button>
      </div>
    </div>
  );
};

// ─── Student Fee Notification Panel ───────────────────────────────────────────
const StudentFeeNotification = ({ onSent }) => {
  const [students,     setStudents]     = useState([]);
  const [structures,   setStructures]   = useState([]);
  const [search,       setSearch]       = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedFee,  setSelectedFee]  = useState("");
  const [message,      setMessage]      = useState("");
  const [dueDate,      setDueDate]      = useState("");
  const [sending,      setSending]      = useState(false);
  const [sent,         setSent]         = useState(false);
  const [notifHistory, setNotifHistory] = useState([]);
  const [tab,          setTab]          = useState("send");

  useEffect(() => {
    seedStudents();
    setStudents(getST());
    setStructures(getFS());
    setNotifHistory(getNotifs());
  }, []);

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
    s.course?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (id) =>
    setSelectedStudents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleAll = () =>
    setSelectedStudents(selectedStudents.length === filtered.length ? [] : filtered.map(s => s.id));

  const selectedFeeObj = structures.find(f => String(f.id) === String(selectedFee));

  const handleSend = () => {
    if (selectedStudents.length === 0 || !selectedFee) return;
    setSending(true);
    setTimeout(() => {
      const notif = {
        id: Date.now(),
        feeId: selectedFee,
        feeTitle: selectedFeeObj?.feeTitle || "—",
        course:   selectedFeeObj?.course   || "—",
        amount:   selectedFeeObj?.totalAmount || 0,
        students: selectedStudents.map(id => students.find(s => s.id === id)?.name).filter(Boolean),
        studentCount: selectedStudents.length,
        message, dueDate,
        sentAt: new Date().toISOString(),
      };
      const updated = [notif, ...getNotifs()];
      saveNotifs(updated);
      setNotifHistory(updated);
      setSending(false); setSent(true);
      setSelectedStudents([]); setSelectedFee(""); setMessage(""); setDueDate("");
      onSent?.();
      setTimeout(() => { setSent(false); setTab("history"); }, 1500);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl"><Bell size={18} className="text-white" /></div>
          <div>
            <h2 className="text-white font-black text-lg">Fee Notifications</h2>
            <p className="text-blue-200 text-xs mt-0.5">Send fee details to students</p>
          </div>
        </div>
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          {[{ key: "send", label: "Send", Icon: Send }, { key: "history", label: "History", Icon: Inbox }].map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${tab === key ? "bg-white text-blue-700" : "text-white/80 hover:text-white"}`}>
              <Icon size={12} />{label}
            </button>
          ))}
        </div>
      </div>

      {tab === "send" ? (
        <div className="p-5 space-y-4">
          {/* Fee Structure Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Receipt size={10} /> Select Fee Structure <span className="text-red-500">*</span>
            </label>
            {structures.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-700">No fee structures available. Create one first.</p>
              </div>
            ) : (
              <div className="relative">
                <select value={selectedFee} onChange={e => setSelectedFee(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all">
                  <option value="">Select Fee Structure</option>
                  {structures.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.course} — {f.feeTitle} (₹{Number(f.totalAmount).toLocaleString()})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
            {selectedFeeObj && (
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex-1">
                  <p className="text-xs font-black text-indigo-800">{selectedFeeObj.feeTitle}</p>
                  <p className="text-[10px] text-indigo-500 mt-0.5">{selectedFeeObj.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-indigo-700">₹{Number(selectedFeeObj.totalAmount).toLocaleString()}</p>
                  <p className="text-[10px] text-indigo-400">{selectedFeeObj.semesters?.length} sem(s)</p>
                </div>
              </div>
            )}
          </div>

          {/* Due Date + Note */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <CalendarDays size={10} /> Due Date
              </label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <MessageSquare size={10} /> Note (Optional)
              </label>
              <input type="text" value={message} onChange={e => setMessage(e.target.value)}
                placeholder="e.g. Pay before deadline"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
            </div>
          </div>

          {/* Student Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <GraduationCap size={10} /> Select Students <span className="text-red-500">*</span>
              </label>
              {selectedStudents.length > 0 && (
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedStudents.length} selected
                </span>
              )}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
            </div>

            {filtered.length > 0 && (
              <button onClick={toggleAll}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${selectedStudents.length === filtered.length && filtered.length > 0
                    ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                  {selectedStudents.length === filtered.length && filtered.length > 0 && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs font-bold text-slate-600">Select All ({filtered.length})</span>
              </button>
            )}

            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {students.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl">
                  <GraduationCap size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">No students found</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-400">No matching students</p>
                </div>
              ) : (
                filtered.map(st => {
                  const isSelected = selectedStudents.includes(st.id);
                  return (
                    <div key={st.id} onClick={() => toggleStudent(st.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                        ${isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                        {isSelected && <Check size={10} className="text-white" />}
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs uppercase flex-shrink-0">
                        {st.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{st.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{st.rollNo} · {st.course}</p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0
                        ${st.studentStatus === "Active"  ? "bg-emerald-100 text-emerald-700"
                        : st.studentStatus === "Alumni"  ? "bg-slate-100 text-slate-500"
                        : "bg-amber-100 text-amber-700"}`}>{st.studentStatus}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button onClick={handleSend}
            disabled={sending || sent || selectedStudents.length === 0 || !selectedFee}
            className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all
              ${sent    ? "bg-emerald-500 text-white"
              : sending ? "bg-blue-400 text-white cursor-wait"
              : selectedStudents.length === 0 || !selectedFee
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"}`}>
            {sent    ? <><CheckCircle size={16} /> Notification Sent!</>
            : sending ? "Sending..."
            : <><Send size={16} /> Send to {selectedStudents.length > 0 ? `${selectedStudents.length} Student${selectedStudents.length > 1 ? "s" : ""}` : "Students"}</>}
          </button>
        </div>
      ) : (
        /* History */
        <div className="p-5">
          <div className="space-y-3 max-h-[520px] overflow-y-auto">
            {notifHistory.length === 0 ? (
              <div className="py-16 text-center">
                <Megaphone size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">No notifications sent yet</p>
                <p className="text-xs text-slate-300 mt-1">Switch to Send tab to notify students</p>
              </div>
            ) : (
              notifHistory.map(n => (
                <div key={n.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-slate-800">{n.feeTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.course}</p>
                    </div>
                    <span className="text-sm font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                      ₹{Number(n.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(n.students || []).slice(0, 4).map(name => (
                      <span key={name} className="flex items-center gap-1 text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        <UserCheck size={9} />{name}
                      </span>
                    ))}
                    {(n.students || []).length > 4 && (
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5">+{n.students.length - 4} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      {n.dueDate  && <span className="flex items-center gap-1"><CalendarDays size={9} /> Due: {n.dueDate}</span>}
                      {n.message  && <span className="flex items-center gap-1"><MessageSquare size={9} /> {n.message}</span>}
                    </div>
                    <span className="text-[9px] text-slate-400">
                      {new Date(n.sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600">
                      Sent to {n.studentCount} student{n.studentCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Fee Structure Table ───────────────────────────────────────────────────────
const FeeStructureTable = ({ structures, onDelete, onPublish }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h3 className="font-black text-slate-800">Fee Structures</h3>
        <p className="text-xs text-slate-400 mt-0.5">{structures.length} configuration{structures.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Draft
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-2" /> Published
      </div>
    </div>
    {structures.length === 0 ? (
      <div className="py-16 text-center">
        <Layers size={40} className="mx-auto text-slate-200 mb-3" />
        <p className="text-sm font-bold text-slate-400">No fee structures yet</p>
        <p className="text-xs text-slate-300 mt-1">Fill the form to create one</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Course", "Fee Type", "Semesters", "Per Sem", "Total", "Status", ""].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {structures.map((fs, i) => (
              <tr key={fs.id} className="hover:bg-slate-50 transition-colors group"
                style={{ animation: `fadeIn 0.3s ease ${i * 50}ms both` }}>
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-800 max-w-[160px] truncate">{fs.course}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{fs.feeTitle}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {fs.semesters.map(s => (
                      <span key={s} className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">S{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-700">₹{Number(fs.amountPerSem).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-black text-slate-900">₹{Number(fs.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border
                    ${fs.status === "Published"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"}`}>{fs.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {fs.status === "Draft" && (
                      <button onClick={() => onPublish(fs.id)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Publish">
                        <Send size={13} />
                      </button>
                    )}
                    <button onClick={() => onDelete(fs.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
export const FeeStructure = () => {
  const [structures, setStructures] = useState([]);
  const [students,   setStudents]   = useState([]);
  const [tick,       setTick]       = useState(0);
  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    seedStudents();
    setStructures(getFS());
    setStudents(getST());
  }, [tick]);

  const deleteFS  = (id) => { saveFS(getFS().filter(f => f.id !== id)); reload(); };
  const publishFS = (id) => { saveFS(getFS().map(f => f.id === id ? { ...f, status: "Published" } : f)); reload(); };

  const totalPublished = structures.filter(s => s.status === "Published").length;
  const totalNotifs    = getNotifs().length;

  return (
    <>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="w-full font-sans text-left pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fee Configuration</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Manage fee structures and send notifications to students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Structures",    value: structures.length, color: "indigo",  Icon: Layers       },
            { label: "Published",           value: totalPublished,    color: "emerald", Icon: CheckCircle  },
            { label: "Total Students",      value: students.length,   color: "teal",    Icon: GraduationCap},
            { label: "Notifications Sent",  value: totalNotifs,       color: "blue",    Icon: Bell         },
          ].map(({ label, value, color, Icon }, i) => {
            const cls = {
              indigo:  "bg-indigo-50 text-indigo-600 border-indigo-100",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
              teal:    "bg-teal-50 text-teal-600 border-teal-100",
              blue:    "bg-blue-50 text-blue-600 border-blue-100",
            }[color];
            return (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                style={{ animation: `fadeIn 0.3s ease ${i * 70}ms both` }}>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${cls}`}><Icon size={16} /></div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FeeStructureForm onSaved={reload} />
          <StudentFeeNotification onSent={reload} />
        </div>

        <FeeStructureTable structures={structures} onDelete={deleteFS} onPublish={publishFS} />
      </div>
    </>
  );
};

export default FeeStructure;
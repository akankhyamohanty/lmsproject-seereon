import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Save, X, Check, ChevronDown, BookOpen,
  GraduationCap, Clock, Hash, DollarSign, Layers, AlertCircle,
  Banknote, User, Mail, Phone, CalendarDays, Building2, CheckCircle,
  FileText, Send, Eye, MoreVertical, TrendingUp
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const COURSES = [
  { name: "B.Tech Computer Science", duration: 4, semesters: 8 },
  { name: "B.Tech Information Technology", duration: 4, semesters: 8 },
  { name: "B.Tech Electronics & Communication", duration: 4, semesters: 8 },
  { name: "B.Tech Mechanical Engineering", duration: 4, semesters: 8 },
  { name: "B.Tech Civil Engineering", duration: 4, semesters: 8 },
  { name: "B.Sc Computer Science", duration: 3, semesters: 6 },
  { name: "B.Sc Mathematics", duration: 3, semesters: 6 },
  { name: "B.Sc Physics", duration: 3, semesters: 6 },
  { name: "MBA", duration: 2, semesters: 4 },
  { name: "BBA", duration: 3, semesters: 6 },
  { name: "M.Tech", duration: 2, semesters: 4 },
  { name: "MCA", duration: 2, semesters: 4 },
];

const FEE_TITLES = [
  "Tuition Fee", "Exam Fee", "Lab Fee", "Library Fee",
  "Sports Fee", "Infrastructure Fee", "Development Fee", "Hostel Fee",
];

const STUDENT_STATUS = ["Active", "Alumni", "On Leave"];

const FS_KEY = "fee_structures_v3";
const ST_KEY = "fee_students_v3";

const getFS = () => { try { return JSON.parse(localStorage.getItem(FS_KEY) || "[]"); } catch { return []; } };
const saveFS = (d) => localStorage.setItem(FS_KEY, JSON.stringify(d));
const getST = () => { try { return JSON.parse(localStorage.getItem(ST_KEY) || "[]"); } catch { return []; } };
const saveST = (d) => localStorage.setItem(ST_KEY, JSON.stringify(d));

const defaultFS = { course: "", feeTitle: "", semesters: [], amountPerSem: "", status: "Draft" };
const defaultST = { name: "", email: "", phone: "", rollNo: "", course: "", department: "", year: "", enrollDate: "", studentStatus: "Active" };

// ─── Semester Grid ────────────────────────────────────────────────────────────
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

// ─── FeeStructure Form ────────────────────────────────────────────────────────
const FeeStructureForm = ({ onSaved }) => {
  const [form, setForm] = useState(defaultFS);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const course = COURSES.find(c => c.name === form.course);

  const toggleSem = (s) => {
    setForm(p => ({
      ...p,
      semesters: p.semesters.includes(s)
        ? p.semesters.filter(x => x !== s)
        : [...p.semesters, s].sort((a, b) => a - b)
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.course) e.course = "Select a course";
    if (!form.feeTitle) e.feeTitle = "Select fee type";
    if (!form.amountPerSem || isNaN(form.amountPerSem) || Number(form.amountPerSem) <= 0) e.amountPerSem = "Enter valid amount";
    if (form.semesters.length === 0) e.semesters = "Select at least one semester";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const list = getFS();
      const entry = {
        id: Date.now(),
        ...form,
        totalAmount: Number(form.amountPerSem) * form.semesters.length,
        createdAt: new Date().toISOString(),
      };
      saveFS([...list, entry]);
      setSaving(false);
      setSaved(true);
      setForm(defaultFS);
      setErrors({});
      onSaved?.();
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl"><Layers size={18} className="text-white" /></div>
          <div>
            <h2 className="text-white font-black text-lg">Fee Structure</h2>
            <p className="text-indigo-200 text-xs mt-0.5">Define course-wise fee configuration</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Course */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <BookOpen size={10} /> Course Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value, semesters: [] }))}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none appearance-none transition-all
                ${errors.course ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white"}`}>
              <option value="">Select Course</option>
              {COURSES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.course && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{errors.course}</p>}

          {/* Duration badge */}
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

        {/* Fee Title */}
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
            <input type="number" value={form.amountPerSem} onChange={e => setForm(p => ({ ...p, amountPerSem: e.target.value }))}
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
              {[
                { label: "Per Semester", value: `₹${Number(form.amountPerSem).toLocaleString()}` },
                { label: "Semesters", value: `${form.semesters.length} (${form.semesters.map(s => `S${s}`).join(", ")})` },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">{r.label}</span>
                  <span className="text-slate-800 font-bold">{r.value}</span>
                </div>
              ))}
              <div className="border-t border-indigo-200 pt-2 flex justify-between">
                <span className="text-xs font-black text-slate-700">Total Amount</span>
                <span className="text-base font-black text-indigo-700">
                  ₹{(Number(form.amountPerSem) * form.semesters.length).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={saving || saved}
          className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all
            ${saved
              ? "bg-emerald-500 text-white"
              : saving
              ? "bg-indigo-400 text-white cursor-wait"
              : "bg-blue-600 hover:bg-blue-600 text-white shadow-lg shadow-indigo-200 active:scale-[0.98]"}`}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : saving ? "Saving..." : <><Save size={16} /> Save Fee Structure</>}
        </button>
      </div>
    </div>
  );
};

// ─── Student Form ─────────────────────────────────────────────────────────────
const StudentForm = ({ onSaved }) => {
  const [form, setForm] = useState(defaultST);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const h = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.rollNo.trim()) e.rollNo = "Required";
    if (!form.course) e.course = "Required";
    if (!form.department.trim()) e.department = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const list = getST();
      saveST([...list, { id: Date.now(), ...form, createdAt: new Date().toISOString() }]);
      setSaving(false);
      setSaved(true);
      setForm(defaultST);
      setErrors({});
      onSaved?.();
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const Field = ({ label, name, type = "text", placeholder, required, children }) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children || (
        <input type={type} name={name} value={form[name] || ""} onChange={h} placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all
            ${errors[name] ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white"}`} />
      )}
      {errors[name] && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={10} />{errors[name]}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl"><GraduationCap size={18} className="text-white" /></div>
          <div>
            <h2 className="text-white font-black text-lg">Student Registration</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Add student to fee management</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Full Name" name="name" placeholder="e.g. Rahul Sharma" required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" name="email" type="email" placeholder="student@edu.in" required />
            <Field label="Phone" name="phone" type="tel" placeholder="9876543210" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Roll Number" name="rollNo" placeholder="ROLL-001" required />
            <Field label="Academic Year" name="year" placeholder="2024-25" />
          </div>

          <Field label="Course" name="course" required>
            <div className="relative">
              <select name="course" value={form.course} onChange={h}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none appearance-none transition-all
                  ${errors.course ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white"}`}>
                <option value="">Select Course</option>
                {COURSES.map(c => <option key={c.name}>{c.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {errors.course && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertCircle size={10} />{errors.course}</p>}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Department" name="department" placeholder="Computer Science" required />
            <Field label="Enroll Date" name="enrollDate" type="date" />
          </div>

          <Field label="Status" name="studentStatus">
            <div className="relative">
              <select name="studentStatus" value={form.studentStatus} onChange={h}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none appearance-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all">
                {STUDENT_STATUS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </Field>
        </div>

        <button onClick={handleSubmit} disabled={saving || saved}
          className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all
            ${saved
              ? "bg-emerald-500 text-white"
              : saving
              ? "bg-emerald-400 text-white cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]"}`}>
          {saved ? <><CheckCircle size={16} /> Student Added!</> : saving ? "Saving..." : <><Plus size={16} /> Add Student</>}
        </button>
      </div>
    </div>
  );
};

// ─── Fee Structure Table ──────────────────────────────────────────────────────
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
        <p className="text-xs text-slate-300 mt-1">Fill the form above to create one</p>
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
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    fs.status === "Published"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>{fs.status}</span>
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

// ─── Student Table ────────────────────────────────────────────────────────────
const StudentTable = ({ students, onDelete }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100">
      <h3 className="font-black text-slate-800">Registered Students</h3>
      <p className="text-xs text-slate-400 mt-0.5">{students.length} student{students.length !== 1 ? "s" : ""} enrolled</p>
    </div>

    {students.length === 0 ? (
      <div className="py-16 text-center">
        <GraduationCap size={40} className="mx-auto text-slate-200 mb-3" />
        <p className="text-sm font-bold text-slate-400">No students registered yet</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Student", "Roll No", "Course", "Department", "Year", "Status", ""].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((st, i) => (
              <tr key={st.id} className="hover:bg-slate-50 transition-colors group"
                style={{ animation: `fadeIn 0.3s ease ${i * 40}ms both` }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-xs uppercase flex-shrink-0">
                      {st.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{st.name}</p>
                      <p className="text-xs text-slate-400">{st.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono font-bold text-slate-600">{st.rollNo}</td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-600 max-w-[120px] truncate">{st.course}</td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-600">{st.department}</td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-600">{st.year || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    st.studentStatus === "Active" ? "bg-emerald-100 text-emerald-700"
                    : st.studentStatus === "Alumni" ? "bg-slate-100 text-slate-600"
                    : "bg-amber-100 text-amber-700"
                  }`}>{st.studentStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(st.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={13} />
                  </button>
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
// MAIN FeeStructure Page
// ══════════════════════════════════════════════════════════════════════════════
export const FeeStructure = () => {
  const [structures, setStructures] = useState([]);
  const [students, setStudents] = useState([]);
  const [tick, setTick] = useState(0);

  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    setStructures(getFS());
    setStudents(getST());
  }, [tick]);

  const deleteFS = (id) => { saveFS(getFS().filter(f => f.id !== id)); reload(); };
  const publishFS = (id) => {
    saveFS(getFS().map(f => f.id === id ? { ...f, status: "Published" } : f));
    reload();
  };
  const deleteST = (id) => { saveST(getST().filter(s => s.id !== id)); reload(); };

  const totalPublished = structures.filter(s => s.status === "Published").length;
  const totalRevenue = structures.reduce((s, f) => s + (f.totalAmount || 0), 0);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="w-full font-sans text-left pb-12">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fee Configuration</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Manage fee structures and student enrollment</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Structures", value: structures.length, color: "indigo", icon: Layers },
            { label: "Published",        value: totalPublished,    color: "emerald", icon: CheckCircle },
            { label: "Total Students",   value: students.length,   color: "teal",   icon: GraduationCap },
            { label: "Fee Revenue",      value: `₹${(totalRevenue/1000).toFixed(0)}K`, color: "violet", icon: TrendingUp },
          ].map((s, i) => {
            const Icon = s.icon;
            const cls = {
              indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
              teal: "bg-teal-50 text-teal-600 border-teal-100",
              violet: "bg-violet-50 text-violet-600 border-violet-100",
            }[s.color];
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                style={{ animation: `fadeIn 0.3s ease ${i * 70}ms both` }}>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${cls}`}>
                  <Icon size={16} />
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Two-column: Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FeeStructureForm onSaved={reload} />
          <StudentForm onSaved={reload} />
        </div>

        {/* Fee Structure Table */}
        <div className="mb-6">
          <FeeStructureTable structures={structures} onDelete={deleteFS} onPublish={publishFS} />
        </div>

        {/* Student Table */}
        <StudentTable students={students} onDelete={deleteST} />

      </div>
    </>
  );
};

export default FeeStructure;
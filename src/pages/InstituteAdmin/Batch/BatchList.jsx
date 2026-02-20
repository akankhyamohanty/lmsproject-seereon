import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, RefreshCw, Filter, Eye, Pencil, Trash2,
  Loader, Users, BookOpen, Building2, Layers, CheckCircle,
  Calendar, Hash, UserCheck, ShieldCheck, X,
  AlertTriangle, TrendingUp, Clock
} from "lucide-react";
import { getBatches, saveBatches, DEPARTMENTS, COLOR_MAP } from "./BatchStorage";

// ─── Seed dummy batches if none exist ────────────────────────────────────────
const seedBatches = () => {
  if (getBatches().length > 0) return;
  const dummy = [
    {
      id: 1, name: "Batch 2024-25 CSE", academic_year: "2024-25",
      start_year: "2024", end_year: "2028", max_strength: "120",
      department_id: "cs", department_name: "Computer Science",
      course: "B.Tech CSE",
      sections: [{ name: "A", strength: "60" }, { name: "B", strength: "60" }],
      proctor: { id: 1, first_name: "Anjali", last_name: "Sharma", designation: "Senior Professor", department: "Computer Science", email: "anjali@example.com" },
      hod:     { id: 3, first_name: "Priya",  last_name: "Nair",   designation: "Professor",         department: "Computer Science", email: "priya@example.com" },
      students: Array.from({ length: 85 }, (_, i) => ({ id: i+1, first_name: `Student`, last_name: `${i+1}` })),
      student_count: 85, status: "active", created_at: new Date("2024-01-15").toISOString(),
    },
    {
      id: 2, name: "Batch 2024-25 Mathematics", academic_year: "2024-25",
      start_year: "2024", end_year: "2027", max_strength: "60",
      department_id: "math", department_name: "Mathematics",
      course: "B.Sc Mathematics",
      sections: [{ name: "A", strength: "60" }],
      proctor: { id: 2, first_name: "Rohan", last_name: "Verma", designation: "Assistant Professor", department: "Mathematics", email: "rohan@example.com" },
      hod: null,
      students: Array.from({ length: 42 }, (_, i) => ({ id: i+100, first_name: `Student`, last_name: `${i+1}` })),
      student_count: 42, status: "active", created_at: new Date("2024-02-10").toISOString(),
    },
    {
      id: 3, name: "Batch 2023-24 Physics", academic_year: "2023-24",
      start_year: "2023", end_year: "2027", max_strength: "80",
      department_id: "phys", department_name: "Physics",
      course: "B.Sc Physics",
      sections: [{ name: "A", strength: "40" }, { name: "B", strength: "40" }],
      proctor: { id: 3, first_name: "Priya", last_name: "Nair", designation: "Professor", department: "Physics", email: "priya@example.com" },
      hod: { id: 3, first_name: "Priya", last_name: "Nair", designation: "Professor", department: "Physics", email: "priya@example.com" },
      students: Array.from({ length: 75 }, (_, i) => ({ id: i+200, first_name: `Student`, last_name: `${i+1}` })),
      student_count: 75, status: "archived", created_at: new Date("2023-07-20").toISOString(),
    },
  ];
  saveBatches(dummy);
};

// blue-600 hex constant for inline styles
const B6 = "#2563eb";
const B6_10 = "rgba(37,99,235,0.1)";
const B6_08 = "rgba(37,99,235,0.08)";
const B6_06 = "rgba(37,99,235,0.06)";
const B6_12 = "rgba(37,99,235,0.12)";
const B6_15 = "rgba(37,99,235,0.15)";
const B6_20 = "rgba(37,99,235,0.2)";
const B6_05 = "rgba(37,99,235,0.05)";

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal = ({ batch, onClose, onEdit, onDelete }) => {
  if (!batch) return null;
  const fillPct = batch.max_strength
    ? Math.min(100, Math.round((batch.student_count / parseInt(batch.max_strength)) * 100))
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: B6_15, backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden"
        style={{ animation: "modalIn 0.28s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 32px 80px rgba(37,99,235,0.22), 0 0 0 1px ${B6_12}` }}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-10 flex-shrink-0 bg-blue-600">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 10% 60%, #fff 0%, transparent 50%), radial-gradient(circle at 85% 10%, #fff 0%, transparent 50%)" }} />
          <div className="relative flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Layers size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">{batch.name}</h2>
                <p className="text-white/65 text-sm mt-0.5">{batch.course} · {batch.department_name}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white text-blue-600">
                    {batch.status}
                  </span>
                  <span className="text-white/50 text-xs font-medium">{batch.academic_year}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose}
              className="text-white/70 hover:text-white rounded-xl p-2 transition-all"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 -mt-4 relative z-10 mx-4 rounded-2xl overflow-hidden flex-shrink-0 bg-white"
          style={{ boxShadow: `0 4px 24px ${B6_15}, 0 0 0 1px ${B6_10}` }}>
          {[
            { label: "Sections", value: batch.sections?.length || 0 },
            { label: "Students", value: batch.student_count || 0 },
            { label: "Capacity", value: `${fillPct}%` },
            { label: "Max",      value: batch.max_strength || "—" },
          ].map((stat, i) => (
            <div key={stat.label} className="py-4 px-2 text-center"
              style={{ borderRight: i < 3 ? `1px solid ${B6_10}` : "none" }}>
              <p className="text-2xl font-black text-blue-600">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-0.5"
                style={{ color: "rgba(37,99,235,0.45)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4 mt-2">

          {/* Capacity bar */}
          <div className="p-4 rounded-2xl" style={{ background: B6_05, border: `1px solid ${B6_12}` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(37,99,235,0.5)" }}>Batch Capacity</span>
              <span className="text-xs font-bold text-blue-600">{batch.student_count} / {batch.max_strength} students</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: B6_10 }}>
              <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${fillPct}%` }} />
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Details */}
            <div className="bg-white rounded-2xl p-4 space-y-3" style={{ border: `1px solid ${B6_12}` }}>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(37,99,235,0.45)" }}>Batch Details</p>
              {[
                { label: "Academic Year", value: batch.academic_year,   icon: Calendar  },
                { label: "Course",        value: batch.course,           icon: BookOpen  },
                { label: "Department",    value: batch.department_name,  icon: Building2 },
                { label: "Duration",      value: batch.start_year && batch.end_year ? `${batch.start_year} – ${batch.end_year}` : "—", icon: Clock },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: B6_08 }}>
                    <row.icon size={13} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase" style={{ color: "rgba(37,99,235,0.45)" }}>{row.label}</p>
                    <p className="text-sm font-semibold text-blue-600">{row.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sections */}
            <div className="bg-white rounded-2xl p-4" style={{ border: `1px solid ${B6_12}` }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(37,99,235,0.45)" }}>Sections</p>
              <div className="space-y-2">
                {(batch.sections || []).map((sec, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: B6_05 }}>
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                      {sec.name}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-600">Section {sec.name}</p>
                      <p className="text-xs" style={{ color: "rgba(37,99,235,0.45)" }}>Strength: {sec.strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* People */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Proctor", person: batch.proctor, icon: UserCheck   },
              { label: "HOD",     person: batch.hod,     icon: ShieldCheck },
            ].map(({ label, person, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-4" style={{ border: `1px solid ${B6_12}` }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(37,99,235,0.45)" }}>{label}</p>
                {person ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black uppercase text-sm">
                      {person.first_name?.[0]}{person.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-blue-600 text-sm">{person.first_name} {person.last_name}</p>
                      <p className="text-xs" style={{ color: "rgba(37,99,235,0.45)" }}>{person.designation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2" style={{ color: "rgba(37,99,235,0.35)" }}>
                    <Icon size={16} /><span className="text-sm font-medium">Not assigned</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${B6_10}` }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-blue-600 text-sm font-bold transition-all hover:bg-blue-600/5"
            style={{ border: `1px solid ${B6_20}` }}>
            Close
          </button>
          <div className="flex-1" />
          <button onClick={() => { onClose(); onDelete(batch); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-blue-600 text-sm font-bold transition-all hover:bg-blue-600/5"
            style={{ border: `1px solid ${B6_20}` }}>
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => { onClose(); onEdit(batch); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all"
            style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
            <Pencil size={15} /> Edit Batch
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ batch, onClose, onConfirm }) => {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const isMatch = confirm.trim().toLowerCase() === batch.name.toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: B6_15, backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && !loading && onClose()}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden"
        style={{ animation: "modalIn 0.28s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 24px 60px rgba(37,99,235,0.2), 0 0 0 1px ${B6_12}` }}
      >
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">Delete Batch</h2>
              <p className="text-white/65 text-sm mt-1">This will permanently remove the batch and all its data.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: B6_05, border: `1px solid ${B6_12}` }}>
            <Layers size={20} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-black text-blue-600">{batch.name}</p>
              <p className="text-sm" style={{ color: "rgba(37,99,235,0.5)" }}>{batch.course} · {batch.student_count} students</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider" style={{ color: "rgba(37,99,235,0.6)" }}>
              Type{" "}
              <span className="font-mono px-1.5 py-0.5 rounded text-blue-600" style={{ background: B6_08, border: `1px solid ${B6_15}` }}>
                {batch.name}
              </span>{" "}
              to confirm
            </label>
            <input
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder={batch.name}
              className="mt-2 w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all text-blue-600 placeholder:text-blue-600/30"
              style={{
                border: `1px solid ${confirm.length > 0 ? (isMatch ? B6 : B6_20) : B6_20}`,
                background: confirm.length > 0 && isMatch ? B6_05 : "white",
              }}
            />
            {isMatch && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <CheckCircle size={11} /> Ready to delete
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-blue-600 font-bold text-sm transition-all disabled:opacity-50 hover:bg-blue-600/5"
              style={{ border: `1px solid ${B6_20}` }}>
              Cancel
            </button>
            <button
              onClick={() => { if (!isMatch) return; setLoading(true); setTimeout(() => onConfirm(batch.id), 700); }}
              disabled={!isMatch || loading}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: isMatch && !loading ? B6 : B6_10,
                color: isMatch && !loading ? "white" : "rgba(37,99,235,0.35)",
                cursor: isMatch && !loading ? "pointer" : "not-allowed",
                boxShadow: isMatch && !loading ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
              }}>
              {loading ? <><Loader size={15} className="animate-spin" /> Deleting...</> : <><Trash2 size={15} /> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN BatchList
// ══════════════════════════════════════════════════════════════════════════════
export const BatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterDept, setFilterDept]   = useState("all");
  const [filterYear, setFilterYear]   = useState("all");
  const [viewBatch, setViewBatch]     = useState(null);
  const [deleteBatch, setDeleteBatch] = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    seedBatches();
    setTimeout(() => { setBatches(getBatches()); setLoading(false); }, 400);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    const removed = batches.find(b => b.id === id);
    const updated = batches.filter(b => b.id !== id);
    setBatches(updated);
    saveBatches(updated);
    setDeleteBatch(null);
    showToast(`"${removed?.name}" deleted`);
  };

  const years = [...new Set(batches.map(b => b.academic_year).filter(Boolean))];
  const depts = [...new Set(batches.map(b => b.department_id).filter(Boolean))];

  const filtered = batches.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase())
      || b.course?.toLowerCase().includes(search.toLowerCase())
      || b.department_name?.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || b.department_id === filterDept;
    const matchYear = filterYear === "all" || b.academic_year === filterYear;
    return matchSearch && matchDept && matchYear;
  });

  const totalStudents = batches.reduce((s, b) => s + (b.student_count || 0), 0);
  const activeBatches = batches.filter(b => b.status === "active").length;

  return (
    <>
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]"
          style={{ animation: "toastIn 0.3s ease" }}>
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-sm"
            style={{ boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}>
            <CheckCircle size={15} /> {toast}
          </div>
        </div>
      )}

      <div className="font-sans w-full text-left pb-12">

        {/* ── Page Header ───────────────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-black text-blue-600 tracking-tight">Batch Management</h1>
            <p className="text-sm font-medium mt-1" style={{ color: "rgba(37,99,235,0.5)" }}>
              Manage batches, sections, and student assignments
              {batches.length > 0 && (
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  {batches.length} batches
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} disabled={loading}
              className="bg-white text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600/5 transition-all flex items-center gap-2"
              style={{ border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px ${B6_08}` }}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={() => navigate("/admin/batch/create")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
              style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
              <Plus size={18} /> New Batch
            </button>
          </div>
        </div>

        {/* ── Summary cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Batches",  value: batches.length, icon: Layers      },
            { label: "Active",         value: activeBatches,  icon: CheckCircle },
            { label: "Total Students", value: totalStudents,  icon: Users       },
            { label: "Departments",    value: depts.length,   icon: Building2   },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-5 relative overflow-hidden"
                style={{ animation: `fadeIn 0.3s ease ${i * 80}ms both`, border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px ${B6_06}` }}>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full" style={{ background: B6_06 }} />
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-3xl font-black text-blue-600">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: "rgba(37,99,235,0.45)" }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Filters ───────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600/40" size={16} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search batches by name, course, department..."
              className="w-full bg-white pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all text-blue-600 placeholder:text-blue-600/30"
              style={{ border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px ${B6_06}` }}
              onFocus={e => e.target.style.borderColor = B6}
              onBlur={e => e.target.style.borderColor = B6_20}
            />
          </div>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
            className="px-4 py-3 bg-white rounded-xl text-sm font-semibold outline-none transition-all text-blue-600 min-w-[160px]"
            style={{ border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px ${B6_06}` }}>
            <option value="all">All Departments</option>
            {DEPARTMENTS.filter(d => depts.includes(d.id)).map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
            className="px-4 py-3 bg-white rounded-xl text-sm font-semibold outline-none transition-all text-blue-600 min-w-[140px]"
            style={{ border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px ${B6_06}` }}>
            <option value="all">All Years</option>
            {years.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* ── Batch cards grid ──────────────────────────── */}
        {loading ? (
          <div className="py-20 text-center flex items-center justify-center gap-2" style={{ color: "rgba(37,99,235,0.45)" }}>
            <Loader size={20} className="animate-spin" /> Loading batches...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Filter size={48} className="mx-auto mb-3" style={{ color: B6_20 }} />
            <p className="text-lg font-bold" style={{ color: "rgba(37,99,235,0.45)" }}>
              {batches.length === 0 ? "No batches yet" : "No batches match filters"}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(37,99,235,0.3)" }}>
              {batches.length === 0 ? "Click 'New Batch' to create your first batch." : "Try clearing your search or filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((batch, idx) => {
              const fillPct = batch.max_strength
                ? Math.min(100, Math.round(((batch.student_count || 0) / parseInt(batch.max_strength)) * 100))
                : 0;
              const dept = DEPARTMENTS.find(d => d.id === batch.department_id);

              return (
                <div key={batch.id}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1"
                  style={{ animation: `fadeIn 0.3s ease ${idx * 60}ms both`, border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px ${B6_06}` }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,99,235,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 2px 12px ${B6_06}`}
                  onClick={() => setViewBatch(batch)}
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-blue-600" />

                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: B6_08, border: `1px solid ${B6_12}` }}>
                          {dept?.icon || "📚"}
                        </div>
                        <div>
                          <h3 className="font-black text-blue-600 text-sm leading-tight">{batch.name}</h3>
                          <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(37,99,235,0.4)" }}>{batch.academic_year}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                        {batch.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 mb-4">
                      {[
                        { icon: BookOpen,  text: batch.course },
                        { icon: Hash,      text: `${batch.sections?.length || 0} section(s): ${(batch.sections || []).map(s => s.name).join(", ")}` },
                        { icon: UserCheck, text: batch.proctor ? `${batch.proctor.first_name} ${batch.proctor.last_name}` : "No proctor" },
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-blue-600">
                          <Icon size={13} className="flex-shrink-0" style={{ color: "rgba(37,99,235,0.4)" }} />
                          <span className="font-medium truncate">{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Capacity bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold mb-1.5" style={{ color: "rgba(37,99,235,0.4)" }}>
                        <span>{batch.student_count || 0} students</span>
                        <span>{fillPct}% full</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: B6_10 }}>
                        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${fillPct}%` }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3"
                      style={{ borderTop: `1px solid ${B6_08}` }}
                      onClick={e => e.stopPropagation()}>
                      {[
                        { label: "View",  icon: Eye,    onClick: () => setViewBatch(batch) },
                        { label: "Edit",  icon: Pencil, onClick: () => navigate(`/admin/batch/create?edit=${batch.id}`) },
                      ].map(({ label, icon: Icon, onClick }) => (
                        <button key={label} onClick={onClick}
                          className="flex-1 py-2 rounded-xl text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                          style={{ background: B6_06 }}
                          onMouseEnter={e => e.currentTarget.style.background = B6_12}
                          onMouseLeave={e => e.currentTarget.style.background = B6_06}>
                          <Icon size={13} /> {label}
                        </button>
                      ))}
                      <button onClick={() => setDeleteBatch(batch)}
                        className="py-2 px-3 rounded-xl text-blue-600 text-xs font-bold transition-all"
                        style={{ background: B6_06 }}
                        onMouseEnter={e => e.currentTarget.style.background = B6_12}
                        onMouseLeave={e => e.currentTarget.style.background = B6_06}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {viewBatch && (
        <ViewModal
          batch={viewBatch}
          onClose={() => setViewBatch(null)}
          onEdit={() => navigate(`/admin/batch/create?edit=${viewBatch.id}`)}
          onDelete={b => { setViewBatch(null); setDeleteBatch(b); }}
        />
      )}
      {deleteBatch && (
        <DeleteModal
          batch={deleteBatch}
          onClose={() => setDeleteBatch(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default BatchList;
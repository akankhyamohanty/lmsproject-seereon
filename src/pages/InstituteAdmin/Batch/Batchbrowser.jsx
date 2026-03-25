import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Plus, Eye, Pencil, Trash2,
  BookOpen, Building2, Layers, Users, Hash, UserCheck,
  ShieldCheck, Calendar, Search, X, CheckCircle, Loader,
  AlertTriangle, RefreshCw, Home, ArrowRight, GraduationCap
} from "lucide-react";
import { getBatches, saveBatches, DEPARTMENTS } from "./BatchStorage.jsx";

// ─── Theme ────────────────────────────────────────────────────────────────────
const B6    = "#2563eb";
const B6_05 = "rgba(37,99,235,0.05)";
const B6_08 = "rgba(37,99,235,0.08)";
const B6_10 = "rgba(37,99,235,0.10)";
const B6_12 = "rgba(37,99,235,0.12)";
const B6_15 = "rgba(37,99,235,0.15)";
const B6_20 = "rgba(37,99,235,0.20)";

// ─── Known program prefixes (order matters — longest first) ──────────────────
const PROGRAM_PREFIXES = [
  "B.Tech", "M.Tech", "B.Sc", "M.Sc", "B.A.", "M.A.",
  "B.Com", "M.Com", "BA LLB", "BBA LLB", "BBA", "MBA",
  "BCA", "MCA", "LLM", "LLB", "MBBS", "BDS",
  "B.Pharm", "M.Pharm", "Diploma",
];

// Extract { program, specialization } from a course name
const parseCourse = (course = "") => {
  for (const prefix of PROGRAM_PREFIXES) {
    if (course.startsWith(prefix)) {
      const spec = course.slice(prefix.length).trim();
      return { program: prefix, specialization: spec || prefix };
    }
  }
  return { program: course, specialization: course };
};

// Program icon mapping
const PROGRAM_ICONS = {
  "B.Tech": "🎓", "M.Tech": "🔬", "B.Sc":  "⚗️",  "M.Sc":  "🧪",
  "BCA":    "💻", "MCA":   "🖥️",  "BBA":   "💼", "MBA":   "📊",
  "B.Com":  "📒", "M.Com": "📈", "LLB":   "⚖️",  "LLM":   "🏛️",
  "MBBS":   "🏥", "BDS":   "🦷", "B.Pharm":"💊", "Diploma":"📋",
  "BA LLB": "⚖️",  "BBA LLB":"⚖️",
};

// ─── Seed dummy batches ───────────────────────────────────────────────────────
const seedBatches = async () => {
  const existing = await getBatches();
  if (existing.length > 0) return;
  const dummy = [
    // B.Tech CSE
    {
      id: 1, name: "B.Tech CSE 2024-25 Batch A", academic_year: "2024-25",
      start_year: "2024", end_year: "2028", max_strength: "120",
      department_id: "cs", department_name: "Computer Science", course: "B.Tech CSE",
      sections: [{ name: "A", strength: "60" }, { name: "B", strength: "60" }],
      proctor: { id: 1, first_name: "Anjali", last_name: "Sharma", designation: "Senior Professor", department: "Computer Science" },
      hod: { id: 3, first_name: "Priya", last_name: "Nair", designation: "Professor", department: "Computer Science" },
      student_count: 85, status: "active", created_at: new Date("2024-01-15").toISOString(),
    },
    {
      id: 2, name: "B.Tech CSE 2023-24 Batch", academic_year: "2023-24",
      start_year: "2023", end_year: "2027", max_strength: "120",
      department_id: "cs", department_name: "Computer Science", course: "B.Tech CSE",
      sections: [{ name: "A", strength: "60" }, { name: "B", strength: "60" }],
      proctor: { id: 2, first_name: "Rohan", last_name: "Verma", designation: "Assistant Professor", department: "Computer Science" },
      hod: null,
      student_count: 110, status: "active", created_at: new Date("2023-07-10").toISOString(),
    },
    // B.Tech Civil
    {
      id: 3, name: "B.Tech Civil 2024-25 Batch", academic_year: "2024-25",
      start_year: "2024", end_year: "2028", max_strength: "80",
      department_id: "civil", department_name: "Civil Engineering", course: "B.Tech Civil",
      sections: [{ name: "A", strength: "40" }, { name: "B", strength: "40" }],
      proctor: { id: 4, first_name: "Suresh", last_name: "Kumar", designation: "Professor", department: "Civil Engineering" },
      hod: null,
      student_count: 68, status: "active", created_at: new Date("2024-07-01").toISOString(),
    },
    {
      id: 4, name: "B.Tech Civil 2023-24 Batch", academic_year: "2023-24",
      start_year: "2023", end_year: "2027", max_strength: "80",
      department_id: "civil", department_name: "Civil Engineering", course: "B.Tech Civil",
      sections: [{ name: "A", strength: "80" }],
      proctor: { id: 4, first_name: "Suresh", last_name: "Kumar", designation: "Professor", department: "Civil Engineering" },
      hod: null,
      student_count: 72, status: "active", created_at: new Date("2023-07-05").toISOString(),
    },
    // B.Tech Mechanical
    {
      id: 5, name: "B.Tech Mech 2024-25 Batch", academic_year: "2024-25",
      start_year: "2024", end_year: "2028", max_strength: "80",
      department_id: "mech", department_name: "Mechanical Engineering", course: "B.Tech Mechanical",
      sections: [{ name: "A", strength: "40" }, { name: "B", strength: "40" }],
      proctor: { id: 5, first_name: "Vikram", last_name: "Rao", designation: "Professor", department: "Mechanical Engineering" },
      hod: null,
      student_count: 55, status: "active", created_at: new Date("2024-07-10").toISOString(),
    },
    // B.Tech Electrical
    {
      id: 6, name: "B.Tech Electrical 2024-25", academic_year: "2024-25",
      start_year: "2024", end_year: "2028", max_strength: "60",
      department_id: "elec", department_name: "Electrical Engineering", course: "B.Tech Electrical",
      sections: [{ name: "A", strength: "60" }],
      proctor: { id: 6, first_name: "Meena", last_name: "Pillai", designation: "Associate Professor", department: "Electrical Engineering" },
      hod: null,
      student_count: 48, status: "active", created_at: new Date("2024-07-15").toISOString(),
    },
    // MCA
    {
      id: 7, name: "MCA 2024-25 Batch", academic_year: "2024-25",
      start_year: "2024", end_year: "2026", max_strength: "60",
      department_id: "cs", department_name: "Computer Science", course: "MCA",
      sections: [{ name: "A", strength: "60" }],
      proctor: { id: 1, first_name: "Anjali", last_name: "Sharma", designation: "Senior Professor", department: "Computer Science" },
      hod: null,
      student_count: 42, status: "active", created_at: new Date("2024-07-20").toISOString(),
    },
    // B.Sc Mathematics
    {
      id: 8, name: "B.Sc Math 2024-25 Batch", academic_year: "2024-25",
      start_year: "2024", end_year: "2027", max_strength: "60",
      department_id: "math", department_name: "Mathematics", course: "B.Sc Mathematics",
      sections: [{ name: "A", strength: "60" }],
      proctor: { id: 7, first_name: "Kiran", last_name: "Das", designation: "Professor", department: "Mathematics" },
      hod: null,
      student_count: 35, status: "active", created_at: new Date("2024-06-01").toISOString(),
    },
    // B.Sc Physics
    {
      id: 9, name: "B.Sc Physics 2022-23 Batch", academic_year: "2022-23",
      start_year: "2022", end_year: "2026", max_strength: "80",
      department_id: "phys", department_name: "Physics", course: "B.Sc Physics",
      sections: [{ name: "A", strength: "40" }, { name: "B", strength: "40" }],
      proctor: { id: 8, first_name: "Priya", last_name: "Nair", designation: "Professor", department: "Physics" },
      hod: { id: 8, first_name: "Priya", last_name: "Nair", designation: "Professor", department: "Physics" },
      student_count: 75, status: "archived", created_at: new Date("2022-08-01").toISOString(),
    },
  ];
  await saveBatches(dummy);
};

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ batch, onClose, onConfirm }) => {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const isMatch = confirm.trim().toLowerCase() === batch.name.toLowerCase();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: B6_15, backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden"
        style={{ animation: "modalIn 0.28s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 24px 60px rgba(37,99,235,0.22), 0 0 0 1px ${B6_12}` }}>
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
              <AlertTriangle size={22}/>
            </div>
            <div>
              <h2 className="text-xl font-black">Delete Batch</h2>
              <p className="text-white/65 text-sm mt-1">This will permanently remove the batch and all its data.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: B6_05, border: `1px solid ${B6_12}` }}>
            <Layers size={20} color={B6} className="flex-shrink-0"/>
            <div>
              <p className="font-black text-blue-600">{batch.name}</p>
              <p className="text-sm" style={{ color: "rgba(37,99,235,0.5)" }}>{batch.course} · {batch.student_count} students</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wider" style={{ color: "rgba(37,99,235,0.6)" }}>
              Type <span className="font-mono px-1.5 py-0.5 rounded text-blue-600"
                style={{ background: B6_08, border: `1px solid ${B6_15}` }}>{batch.name}</span> to confirm
            </label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={batch.name}
              className="mt-2 w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all text-blue-600 placeholder:text-blue-600/30"
              style={{ border: `1px solid ${confirm.length > 0 ? (isMatch ? B6 : B6_20) : B6_20}`, background: confirm.length > 0 && isMatch ? B6_05 : "white" }}/>
            {isMatch && <p className="text-xs text-blue-600 mt-1 flex items-center gap-1"><CheckCircle size={11}/> Ready to delete</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-600/5 transition-all"
              style={{ border: `1px solid ${B6_20}` }}>Cancel</button>
            <button onClick={() => { if (!isMatch) return; setLoading(true); setTimeout(() => onConfirm(batch.id), 700); }}
              disabled={!isMatch || loading}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: isMatch && !loading ? B6 : B6_10, color: isMatch && !loading ? "white" : "rgba(37,99,235,0.35)", cursor: isMatch && !loading ? "pointer" : "not-allowed", boxShadow: isMatch && !loading ? "0 4px 14px rgba(37,99,235,0.35)" : "none" }}>
              {loading ? <><Loader size={15} className="animate-spin"/> Deleting...</> : <><Trash2 size={15}/> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal = ({ batch, onClose, onEdit, onDelete }) => {
  if (!batch) return null;
  const fillPct = batch.max_strength
    ? Math.min(100, Math.round((batch.student_count / parseInt(batch.max_strength)) * 100))
    : 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: B6_15, backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden"
        style={{ animation: "modalIn 0.28s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 32px 80px rgba(37,99,235,0.22), 0 0 0 1px ${B6_12}` }}>
        <div className="relative px-6 pt-6 pb-10 flex-shrink-0 bg-blue-600">
          <div className="relative flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Layers size={24} color="white"/>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{batch.name}</h2>
                <p className="text-white/65 text-sm mt-0.5">{batch.course} · {batch.department_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-blue-600">{batch.status}</span>
                  <span className="text-white/50 text-xs font-medium">{batch.academic_year}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white rounded-xl p-2 transition-all"
              style={{ background: "rgba(255,255,255,0.1)" }}><X size={20}/></button>
          </div>
        </div>
        <div className="grid grid-cols-4 -mt-4 relative z-10 mx-4 rounded-2xl overflow-hidden flex-shrink-0 bg-white"
          style={{ boxShadow: `0 4px 24px ${B6_15}, 0 0 0 1px ${B6_10}` }}>
          {[
            { label: "Sections", value: batch.sections?.length || 0 },
            { label: "Students", value: batch.student_count || 0 },
            { label: "Capacity", value: `${fillPct}%` },
            { label: "Max",      value: batch.max_strength || "—" },
          ].map((s, i) => (
            <div key={s.label} className="py-4 px-2 text-center"
              style={{ borderRight: i < 3 ? `1px solid ${B6_10}` : "none" }}>
              <p className="text-2xl font-black text-blue-600">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: "rgba(37,99,235,0.45)" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4 mt-2">
          <div className="p-4 rounded-2xl" style={{ background: B6_05, border: `1px solid ${B6_12}` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(37,99,235,0.5)" }}>Batch Capacity</span>
              <span className="text-xs font-bold text-blue-600">{batch.student_count} / {batch.max_strength} students</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: B6_10 }}>
              <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${fillPct}%` }}/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 space-y-3" style={{ border: `1px solid ${B6_12}` }}>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(37,99,235,0.45)" }}>Batch Details</p>
              {[
                { label: "Academic Year", value: batch.academic_year,  icon: Calendar  },
                { label: "Course",        value: batch.course,          icon: BookOpen  },
                { label: "Department",    value: batch.department_name, icon: Building2 },
                { label: "Duration",      value: batch.start_year && batch.end_year ? `${batch.start_year} – ${batch.end_year}` : "—", icon: Calendar },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: B6_08 }}>
                    <row.icon size={13} color={B6}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase" style={{ color: "rgba(37,99,235,0.45)" }}>{row.label}</p>
                    <p className="text-sm font-semibold text-blue-600">{row.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4" style={{ border: `1px solid ${B6_12}` }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(37,99,235,0.45)" }}>Sections</p>
              <div className="space-y-2">
                {(batch.sections || []).map((sec, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: B6_05 }}>
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">{sec.name}</div>
                    <div>
                      <p className="text-sm font-bold text-blue-600">Section {sec.name}</p>
                      <p className="text-xs" style={{ color: "rgba(37,99,235,0.45)" }}>Strength: {sec.strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                    <Icon size={16}/><span className="text-sm font-medium">Not assigned</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${B6_10}` }}>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ border: `1px solid ${B6_20}`, color: "#64748b", background: "white" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}>
            Close
          </button>
          <div className="flex-1"/>
          <button onClick={() => { onClose(); onDelete(batch); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.08)"; e.currentTarget.style.color = "#dc2626"; }}>
            <Trash2 size={15}/> Delete
          </button>
          <button onClick={() => { onClose(); onEdit(batch); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#d97706", color: "white", border: "none", boxShadow: "0 4px 14px rgba(217,119,6,0.35)" }}
            onMouseEnter={e => e.currentTarget.style.background = "#b45309"}
            onMouseLeave={e => e.currentTarget.style.background = "#d97706"}>
            <Pencil size={15}/> Edit Batch
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px" style={{ background: "rgba(37,99,235,0.1)" }}/>
    <span className="text-xs font-black uppercase tracking-widest px-3" style={{ color: "rgba(37,99,235,0.4)" }}>{label}</span>
    <div className="flex-1 h-px" style={{ background: "rgba(37,99,235,0.1)" }}/>
  </div>
);

const AddCard = ({ onClick, label, sub, idx }) => (
  <button type="button" onClick={onClick}
    className="bg-white rounded-2xl transition-all duration-200 hover:-translate-y-0.5 group"
    style={{ animation: `fadeUp 0.35s ease ${idx * 60}ms both`, border: `2px dashed ${B6_20}`, minHeight: 180 }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = B6; e.currentTarget.style.background = B6_05; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = B6_20; e.currentTarget.style.background = "white"; }}>
    <div className="p-6 flex flex-col items-center justify-center h-full gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center transition-all group-hover:scale-110"
        style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
        <Plus size={20} color="white"/>
      </div>
      <div>
        <p className="font-black text-blue-600">{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "rgba(37,99,235,0.45)" }}>{sub}</p>}
      </div>
    </div>
  </button>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN BatchBrowser
// ══════════════════════════════════════════════════════════════════════════════
const BatchBrowser = () => {
  const navigate = useNavigate();

  const [selectedProgram, setSelectedProgram]               = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const [viewBatch, setViewBatch]     = useState(null);
  const [deleteBatch, setDeleteBatch] = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ── load is now async ─────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    await seedBatches();
    const data = await getBatches();
    setBatches(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Level 1: group by program ─────────────────────────────────────────────
  const programGroups = useMemo(() => {
    const map = {};
    batches.forEach(b => {
      const { program } = parseCourse(b.course);
      if (!map[program]) map[program] = { program, icon: PROGRAM_ICONS[program] || "🎓", batches: [] };
      map[program].batches.push(b);
    });
    return Object.values(map).sort((a, b) => a.program.localeCompare(b.program));
  }, [batches]);

  const filteredPrograms = useMemo(() =>
    programGroups.filter(g =>
      g.program.toLowerCase().includes(search.toLowerCase()) ||
      g.batches.some(b =>
        b.course?.toLowerCase().includes(search.toLowerCase()) ||
        b.department_name?.toLowerCase().includes(search.toLowerCase())
      )
    ), [programGroups, search]);

  // ── Level 2: specializations within selected program ──────────────────────
  const specializationGroups = useMemo(() => {
    if (!selectedProgram) return [];
    const pg = programGroups.find(g => g.program === selectedProgram);
    if (!pg) return [];
    const map = {};
    pg.batches.forEach(b => {
      const { specialization } = parseCourse(b.course);
      const dept = DEPARTMENTS.find(d => d.id === b.department_id);
      if (!map[specialization]) {
        map[specialization] = {
          specialization,
          fullCourse: b.course,
          department_name: b.department_name,
          department_id: b.department_id,
          icon: dept?.icon || "📚",
          batches: [],
        };
      }
      map[specialization].batches.push(b);
    });
    return Object.values(map).sort((a, b) => a.specialization.localeCompare(b.specialization));
  }, [batches, selectedProgram, programGroups]);

  // ── Level 3: batches for selected specialization ──────────────────────────
  const batchesForSpec = useMemo(() => {
    if (!selectedSpecialization) return [];
    return batches.filter(b => b.course === selectedSpecialization.fullCourse);
  }, [batches, selectedSpecialization]);

  // ── handleDelete is now async ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    const removed = batches.find(b => b.id === id);
    const updated = batches.filter(b => b.id !== id);
    setBatches(updated);
    await saveBatches(updated);
    setDeleteBatch(null);
    showToast(`"${removed?.name}" deleted`);
  };

  const handleBack = () => {
    if (selectedSpecialization) setSelectedSpecialization(null);
    else if (selectedProgram) { setSelectedProgram(null); setSelectedSpecialization(null); }
  };

  const level = !selectedProgram ? 1 : !selectedSpecialization ? 2 : 3;

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  const Breadcrumb = () => (
    <div className="flex items-center gap-1.5 flex-wrap" style={{ fontSize: 12, fontWeight: 700 }}>
      <button onClick={() => { setSelectedProgram(null); setSelectedSpecialization(null); }}
        className="flex items-center gap-1 transition-colors hover:text-blue-700"
        style={{ color: level === 1 ? B6 : "rgba(37,99,235,0.45)", background: "none", border: "none", cursor: "pointer" }}>
        <Home size={12}/> Programs
      </button>
      {selectedProgram && (
        <>
          <ChevronRight size={12} style={{ color: "rgba(37,99,235,0.3)" }}/>
          <button onClick={() => setSelectedSpecialization(null)}
            className="flex items-center gap-1 transition-colors hover:text-blue-700"
            style={{ color: level === 2 ? B6 : "rgba(37,99,235,0.45)", background: "none", border: "none", cursor: "pointer" }}>
            {selectedProgram}
          </button>
        </>
      )}
      {selectedSpecialization && (
        <>
          <ChevronRight size={12} style={{ color: "rgba(37,99,235,0.3)" }}/>
          <span style={{ color: B6 }}>{selectedSpecialization.specialization}</span>
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]" style={{ animation: "toastIn 0.3s ease" }}>
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-sm"
            style={{ boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}>
            <CheckCircle size={15}/> {toast}
          </div>
        </div>
      )}

      <div className="font-sans w-full text-left pb-12">

        {/* ── Page Header ──────────────────────────────── */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div className="flex items-center gap-3">
            {level > 1 && (
              <button onClick={handleBack}
                className="flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{ width: 40, height: 40, borderRadius: 12, background: "white", border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px ${B6_08}`, color: B6, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = B6_05}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <ChevronLeft size={20}/>
              </button>
            )}
            <div>
              <h1 className="text-3xl font-black text-blue-600 tracking-tight">
                {level === 1 && "Batches"}
                {level === 2 && selectedProgram}
                {level === 3 && selectedSpecialization?.specialization}
              </h1>
              <div className="mt-1.5"><Breadcrumb/></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={load} disabled={loading}
              className="bg-white text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600/5 transition-all flex items-center gap-2"
              style={{ border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px ${B6_08}` }}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""}/>Refresh
            </button>
            <button onClick={() => navigate("/admin/batch/create")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
              style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
              <Plus size={18}/> New Batch
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center gap-3" style={{ color: "rgba(37,99,235,0.45)" }}>
            <Loader size={20} className="animate-spin"/> Loading batches...
          </div>
        ) : (
          <>
            {/* ════════════════════════════════════════════
                LEVEL 1 — Programs (B.Tech, B.Sc, MCA...)
            ════════════════════════════════════════════ */}
            {level === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Programs",       value: programGroups.length },
                    { label: "Total Batches",  value: batches.length },
                    { label: "Total Students", value: batches.reduce((s, b) => s + (b.student_count || 0), 0) },
                    { label: "Departments",    value: [...new Set(batches.map(b => b.department_id).filter(Boolean))].length },
                  ].map((stat, i) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5"
                      style={{ animation: `fadeUp 0.3s ease ${i * 60}ms both`, border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px rgba(37,99,235,0.05)` }}>
                      <p className="text-3xl font-black text-blue-600">{stat.value}</p>
                      <p className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: "rgba(37,99,235,0.45)" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: "rgba(37,99,235,0.4)" }}/>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search programs, courses or departments…"
                    className="w-full bg-white pl-10 pr-10 py-3 rounded-xl text-sm font-semibold outline-none transition-all text-blue-600 placeholder:text-blue-600/30"
                    style={{ border: `1px solid ${B6_20}`, boxShadow: `0 1px 4px rgba(37,99,235,0.06)` }}
                    onFocus={e => e.target.style.borderColor = B6}
                    onBlur={e => e.target.style.borderColor = B6_20}/>
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(37,99,235,0.4)" }}>
                      <X size={14}/>
                    </button>
                  )}
                </div>

                <Divider label="Select a Program"/>

                {filteredPrograms.length === 0 ? (
                  <div className="py-20 text-center">
                    <GraduationCap size={48} className="mx-auto mb-3" style={{ color: B6_20 }}/>
                    <p className="font-bold" style={{ color: "rgba(37,99,235,0.45)" }}>
                      {batches.length === 0 ? "No batches yet" : "No programs match search"}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "rgba(37,99,235,0.3)" }}>
                      {batches.length === 0 ? "Create a batch to get started." : "Try a different search."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPrograms.map((pg, idx) => {
                      const totalStudents = pg.batches.reduce((s, b) => s + (b.student_count || 0), 0);
                      const specs = [...new Set(pg.batches.map(b => parseCourse(b.course).specialization))];
                      return (
                        <button key={pg.program} type="button"
                          onClick={() => { setSelectedProgram(pg.program); setSelectedSpecialization(null); }}
                          className="text-left bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
                          style={{ animation: `fadeUp 0.35s ease ${idx * 50}ms both`, border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px rgba(37,99,235,0.06)` }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,99,235,0.18)"}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.06)"}>
                          <div style={{ height: 4, background: B6 }}/>
                          <div className="p-5">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                style={{ background: B6_08, border: `1px solid ${B6_12}` }}>
                                {pg.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-black text-blue-600 text-xl">{pg.program}</h3>
                                <p className="text-xs font-medium mt-0.5" style={{ color: "rgba(37,99,235,0.5)" }}>
                                  {specs.length} specialization{specs.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 transition-all group-hover:scale-110"
                                style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                                <ArrowRight size={15}/>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {[
                                { label: "Batches",  value: pg.batches.length },
                                { label: "Students", value: totalStudents },
                                { label: "Specs",    value: specs.length },
                              ].map(s => (
                                <div key={s.label} className="rounded-xl py-2.5 text-center"
                                  style={{ background: B6_05, border: `1px solid ${B6_10}` }}>
                                  <p className="text-lg font-black text-blue-600">{s.value}</p>
                                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(37,99,235,0.45)" }}>{s.label}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {specs.slice(0, 5).map(sp => (
                                <span key={sp} className="text-xs font-bold px-2.5 py-1 rounded-full"
                                  style={{ background: B6_08, color: B6 }}>{sp}</span>
                              ))}
                              {specs.length > 5 && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                  style={{ background: B6_08, color: B6 }}>+{specs.length - 5}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════
                LEVEL 2 — Specializations
            ════════════════════════════════════════════ */}
            {level === 2 && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${B6_12}`, boxShadow: `0 4px 24px rgba(37,99,235,0.08)` }}>
                  <div className="bg-blue-600 p-6 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                      {PROGRAM_ICONS[selectedProgram] || "🎓"}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black text-white">{selectedProgram}</h2>
                      <p className="text-white/60 text-sm mt-1">
                        {specializationGroups.length} specialization{specializationGroups.length !== 1 ? "s" : ""} · Pick one to view batches
                      </p>
                    </div>
                    <div className="flex gap-6 text-center">
                      {[
                        { label: "Batches",  value: (programGroups.find(g => g.program === selectedProgram)?.batches || []).length },
                        { label: "Students", value: (programGroups.find(g => g.program === selectedProgram)?.batches || []).reduce((s, b) => s + (b.student_count || 0), 0) },
                      ].map(s => (
                        <div key={s.label}>
                          <p className="text-2xl font-black text-white">{s.value}</p>
                          <p className="text-white/55 text-xs font-bold uppercase tracking-wide">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Divider label={`Choose ${selectedProgram} Specialization`}/>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {specializationGroups.map((sg, idx) => {
                    const totalStudents = sg.batches.reduce((s, b) => s + (b.student_count || 0), 0);
                    const totalSections = sg.batches.reduce((s, b) => s + (b.sections?.length || 0), 0);
                    const years = [...new Set(sg.batches.map(b => b.academic_year).filter(Boolean))].sort((a, b) => b.localeCompare(a));
                    return (
                      <button key={sg.specialization} type="button"
                        onClick={() => setSelectedSpecialization(sg)}
                        className="text-left bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
                        style={{ animation: `fadeUp 0.35s ease ${idx * 60}ms both`, border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px rgba(37,99,235,0.06)` }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,99,235,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.06)"}>
                        <div style={{ height: 4, background: B6 }}/>
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ background: B6_08, border: `1px solid ${B6_12}` }}>
                              {sg.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-blue-600 text-base leading-tight">{sg.specialization}</h3>
                              <p className="text-xs font-medium mt-1 flex items-center gap-1" style={{ color: "rgba(37,99,235,0.5)" }}>
                                <Building2 size={11}/>{sg.department_name}
                              </p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 transition-all group-hover:scale-110"
                              style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                              <ArrowRight size={15}/>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                              { label: "Batches",  value: sg.batches.length },
                              { label: "Students", value: totalStudents },
                              { label: "Sections", value: totalSections },
                            ].map(s => (
                              <div key={s.label} className="rounded-xl py-2.5 text-center"
                                style={{ background: B6_05, border: `1px solid ${B6_10}` }}>
                                <p className="text-lg font-black text-blue-600">{s.value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(37,99,235,0.45)" }}>{s.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: `1px solid ${B6_08}` }}>
                            {years.map(y => (
                              <span key={y} className="text-xs font-bold px-2.5 py-1 rounded-full"
                                style={{ background: B6_08, color: B6 }}>{y}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <AddCard onClick={() => navigate("/admin/batch/create")} label="Add New Batch" sub={selectedProgram} idx={specializationGroups.length}/>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════
                LEVEL 3 — Batches for a Specialization
            ════════════════════════════════════════════ */}
            {level === 3 && selectedSpecialization && (
              <div className="space-y-6">
                <div className="rounded-2xl p-5" style={{ background: "white", border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px rgba(37,99,235,0.06)` }}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: B6_08, border: `1px solid ${B6_12}` }}>
                        {PROGRAM_ICONS[selectedProgram] || "🎓"}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(37,99,235,0.45)" }}>Program</p>
                        <p className="font-black text-blue-600">{selectedProgram}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: "rgba(37,99,235,0.3)" }}/>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: B6_08, border: `1px solid ${B6_12}` }}>
                        {selectedSpecialization.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(37,99,235,0.45)" }}>Specialization</p>
                        <p className="font-black text-blue-600">{selectedSpecialization.specialization}</p>
                        <p className="text-xs font-medium" style={{ color: "rgba(37,99,235,0.45)" }}>{selectedSpecialization.department_name}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex gap-3 flex-wrap">
                      {[
                        { label: "Batches",  value: batchesForSpec.length },
                        { label: "Students", value: batchesForSpec.reduce((s, b) => s + (b.student_count || 0), 0) },
                        { label: "Sections", value: batchesForSpec.reduce((s, b) => s + (b.sections?.length || 0), 0) },
                      ].map(s => (
                        <div key={s.label} className="px-4 py-2 rounded-xl text-center"
                          style={{ background: B6_05, border: `1px solid ${B6_10}` }}>
                          <p className="text-xl font-black text-blue-600">{s.value}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(37,99,235,0.45)" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Divider label={`${batchesForSpec.length} Batch${batchesForSpec.length !== 1 ? "es" : ""} — ${selectedSpecialization.specialization}`}/>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {batchesForSpec.map((batch, idx) => {
                    const fillPct = batch.max_strength
                      ? Math.min(100, Math.round(((batch.student_count || 0) / parseInt(batch.max_strength)) * 100))
                      : 0;
                    const dept = DEPARTMENTS.find(d => d.id === batch.department_id);
                    return (
                      <div key={batch.id}
                        className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                        style={{ animation: `fadeUp 0.35s ease ${idx * 60}ms both`, border: `1px solid ${B6_12}`, boxShadow: `0 2px 12px rgba(37,99,235,0.06)`, cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,99,235,0.16)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.06)"}
                        onClick={() => setViewBatch(batch)}>
                        <div style={{ height: 3, background: B6 }}/>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                style={{ background: B6_08, border: `1px solid ${B6_12}` }}>
                                {dept?.icon || "📚"}
                              </div>
                              <div>
                                <h3 className="font-black text-blue-600 text-sm leading-tight">{batch.name}</h3>
                                <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(37,99,235,0.4)" }}>{batch.academic_year}</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                              style={{ background: batch.status === "active" ? B6 : "rgba(37,99,235,0.1)", color: batch.status === "active" ? "white" : "rgba(37,99,235,0.5)" }}>
                              {batch.status}
                            </span>
                          </div>

                          <div className="rounded-2xl p-4 mb-4 flex items-center gap-4"
                            style={{ background: B6_05, border: `1px solid ${B6_10}` }}>
                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0"
                              style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                              <Users size={20} color="white"/>
                            </div>
                            <div className="flex-1">
                              <p className="text-2xl font-black text-blue-600">{batch.student_count || 0}</p>
                              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "rgba(37,99,235,0.5)" }}>
                                Students Enrolled
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-blue-600">{fillPct}%</p>
                              <p className="text-[10px] font-bold" style={{ color: "rgba(37,99,235,0.45)" }}>of {batch.max_strength}</p>
                            </div>
                          </div>

                          <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: B6_10 }}>
                            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${fillPct}%` }}/>
                          </div>

                          <div className="space-y-1.5 mb-4">
                            <div className="flex items-center gap-2">
                              <Hash size={12} style={{ color: "rgba(37,99,235,0.35)", flexShrink: 0 }}/>
                              <span className="text-xs font-medium text-blue-600">
                                {batch.sections?.length || 0} section(s): {(batch.sections || []).map(s => s.name).join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCheck size={12} style={{ color: "rgba(37,99,235,0.35)", flexShrink: 0 }}/>
                              <span className="text-xs font-medium text-blue-600 truncate">
                                {batch.proctor ? `${batch.proctor.first_name} ${batch.proctor.last_name}` : "No proctor assigned"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${B6_08}` }}
                            onClick={e => e.stopPropagation()}>
                            <button onClick={() => setViewBatch(batch)}
                              className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                              style={{ background: "rgba(37,99,235,0.08)", color: "#2563eb" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "white"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,99,235,0.08)"; e.currentTarget.style.color = "#2563eb"; }}>
                              <Eye size={12}/> View
                            </button>
                            <button onClick={() => navigate(`/admin/batch/create?edit=${batch.id}`)}
                              className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                              style={{ background: "rgba(217,119,6,0.08)", color: "#d97706" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#d97706"; e.currentTarget.style.color = "white"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(217,119,6,0.08)"; e.currentTarget.style.color = "#d97706"; }}>
                              <Pencil size={12}/> Edit
                            </button>
                            <button onClick={() => setDeleteBatch(batch)}
                              className="py-2 px-3 rounded-xl text-xs font-bold transition-all"
                              style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "white"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.08)"; e.currentTarget.style.color = "#dc2626"; }}>
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <AddCard
                    onClick={() => navigate("/admin/batch/create")}
                    label="Add New Batch"
                    sub={`${selectedProgram} ${selectedSpecialization.specialization}`}
                    idx={batchesForSpec.length}/>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {viewBatch && (
        <ViewModal
          batch={viewBatch}
          onClose={() => setViewBatch(null)}
          onEdit={b => navigate(`/admin/batch/create?edit=${b.id}`)}
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

export default BatchBrowser;
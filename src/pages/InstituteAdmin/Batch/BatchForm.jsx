import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Check, X, Plus, Trash2,
  Search, Users, BookOpen, Building2, User, GraduationCap,
  ShieldCheck, UserCheck, AlertCircle, Loader, CheckCircle,
  Layers, Hash, Calendar, ChevronDown, Minus
} from "lucide-react";
import {
  DEPARTMENTS, COURSES_BY_DEPT, ACADEMIC_YEARS, COLOR_MAP,
  getFaculty, getStudents, addBatch, BATCH_KEY
} from "./BatchStorage";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Batch Info",  icon: Layers     },
  { id: 2, label: "Department",  icon: Building2  },
  { id: 3, label: "Course",      icon: BookOpen   },
  { id: 4, label: "Sections",    icon: Hash       },
  { id: 5, label: "Proctor",     icon: UserCheck  },
  { id: 6, label: "HOD",         icon: ShieldCheck},
  { id: 7, label: "Students",    icon: Users      },
];

// ─── Default form state ───────────────────────────────────────────────────────
const defaultForm = {
  name: "", academic_year: "", start_year: "", end_year: "", max_strength: "",
  department_id: "", department_name: "",
  course: "",
  sections: [{ name: "A", strength: "60" }],
  proctor: null,
  hod: null,
  students: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SECTION_NAMES = ["A","B","C","D","E","F","G","H"];

const B6   = "#2563eb";
const B6_05 = "rgba(37,99,235,0.05)";
const B6_08 = "rgba(37,99,235,0.08)";
const B6_10 = "rgba(37,99,235,0.10)";
const B6_12 = "rgba(37,99,235,0.12)";
const B6_15 = "rgba(37,99,235,0.15)";
const B6_20 = "rgba(37,99,235,0.20)";
const B6_30 = "rgba(37,99,235,0.30)";

const ensureMockStudents = () => {
  if (localStorage.getItem("student_list")) return;
  const mock = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    first_name: ["Arjun","Sneha","Rahul","Divya","Karan","Priya","Amit","Neha","Rohit","Sanya","Vikram","Pooja","Aakash","Ritika","Suresh","Kavya","Manish","Deepa","Tarun","Meera"][i],
    last_name:  ["Kumar","Patel","Sharma","Singh","Verma","Nair","Gupta","Joshi","Mehta","Reddy","Rao","Desai","Malhotra","Iyer","Pillai","Agarwal","Mishra","Shah","Saxena","Pandey"][i],
    email: `student${i+1}@example.com`,
    roll_no: `ROLL-${String(i+1).padStart(3,"0")}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length].name,
  }));
  localStorage.setItem("student_list", JSON.stringify(mock));
};

// ─── Shared input ─────────────────────────────────────────────────────────────
const inputBase = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: `1px solid ${B6_20}`,
  background: "white",
  fontSize: "14px",
  fontWeight: 500,
  color: B6,
  outline: "none",
  width: "100%",
  transition: "border-color 0.15s",
};

const Input = ({ label, name, type="text", value, onChange, error, placeholder, required, disabled, children }) => (
  <div className="space-y-1.5">
    <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.5)" }}>
      {label}{required && <span style={{ color: B6, marginLeft: 2 }}>*</span>}
    </label>
    {children || (
      <input type={type} name={name} value={value||""} onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{ ...inputBase, borderColor: error ? B6 : B6_20, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text" }}
        onFocus={e => e.target.style.borderColor = B6}
        onBlur={e => e.target.style.borderColor = error ? B6 : B6_20}
      />
    )}
    {error && (
      <p style={{ fontSize: "12px", color: B6, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
        <AlertCircle size={11}/>{error}
      </p>
    )}
  </div>
);

// ─── STEP 1: Batch Info ───────────────────────────────────────────────────────
const StepBatchInfo = ({ form, setForm, errors }) => {
  const h = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  return (
    <div className="space-y-5">
      <div>
        <h3 style={{ fontSize: "20px", fontWeight: 900, color: B6 }}>Batch Information</h3>
        <p style={{ fontSize: "14px", color: "rgba(37,99,235,0.5)", marginTop: 4 }}>Define the batch name, academic year and strength limits.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input label="Batch Name" name="name" value={form.name} onChange={h} error={errors.name} placeholder="e.g. Batch 2024-25 CSE" required />
        </div>
        <Input label="Academic Year" name="academic_year" error={errors.academic_year} required>
          <select name="academic_year" value={form.academic_year} onChange={h}
            style={{ ...inputBase, borderColor: errors.academic_year ? B6 : B6_20 }}
            onFocus={e => e.target.style.borderColor = B6}
            onBlur={e => e.target.style.borderColor = errors.academic_year ? B6 : B6_20}>
            <option value="">Select Academic Year</option>
            {ACADEMIC_YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </Input>
        <Input label="Max Strength" name="max_strength" type="number" value={form.max_strength} onChange={h} error={errors.max_strength} placeholder="e.g. 120" required />
        <Input label="Start Year" name="start_year" type="number" value={form.start_year} onChange={h} placeholder="2024" />
        <Input label="End Year"   name="end_year"   type="number" value={form.end_year}   onChange={h} placeholder="2028" />
      </div>
      {form.name && form.academic_year && (
        <div style={{ padding: "16px", background: B6_05, border: `1px solid ${B6_12}`, borderRadius: "16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ padding: 8, background: B6, borderRadius: 12 }}><Layers size={16} color="white"/></div>
          <div>
            <p style={{ fontWeight: 900, color: B6, fontSize: 14 }}>{form.name}</p>
            <p style={{ fontSize: 13, color: "rgba(37,99,235,0.6)" }}>{form.academic_year} · Max {form.max_strength || "—"} students</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STEP 2: Department ───────────────────────────────────────────────────────
const StepDepartment = ({ form, setForm, errors }) => (
  <div className="space-y-5">
    <div>
      <h3 style={{ fontSize: "20px", fontWeight: 900, color: B6 }}>Select Department</h3>
      <p style={{ fontSize: "14px", color: "rgba(37,99,235,0.5)", marginTop: 4 }}>Choose the department this batch belongs to.</p>
    </div>
    {errors.department_id && (
      <p style={{ fontSize: 13, color: B6, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
        <AlertCircle size={14}/>Please select a department
      </p>
    )}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {DEPARTMENTS.map(dept => {
        const isActive = form.department_id === dept.id;
        return (
          <button key={dept.id} type="button"
            onClick={() => setForm(p => ({ ...p, department_id: dept.id, department_name: dept.name, course: "" }))}
            style={{
              padding: 16, borderRadius: 16, textAlign: "left", transition: "all 0.2s",
              background: isActive ? B6 : "white",
              border: `2px solid ${isActive ? B6 : B6_20}`,
              boxShadow: isActive ? "0 8px 24px rgba(37,99,235,0.25)" : "none",
              cursor: "pointer",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = B6; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = B6_20; }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{dept.icon}</div>
            <p style={{ fontSize: 13, fontWeight: 900, color: isActive ? "white" : B6, lineHeight: 1.3 }}>{dept.name}</p>
            {isActive && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                <Check size={11}/>Selected
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── STEP 3: Course ───────────────────────────────────────────────────────────
const StepCourse = ({ form, setForm, errors }) => {
  const courses = COURSES_BY_DEPT[form.department_id] || [];
  return (
    <div className="space-y-5">
      <div>
        <h3 style={{ fontSize: "20px", fontWeight: 900, color: B6 }}>Select Course</h3>
        <p style={{ fontSize: "14px", color: "rgba(37,99,235,0.5)", marginTop: 4 }}>
          Courses available under <span style={{ fontWeight: 700, color: B6 }}>{form.department_name}</span>
        </p>
      </div>
      {errors.course && (
        <p style={{ fontSize: 13, color: B6, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
          <AlertCircle size={14}/>Please select a course
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.map((course, i) => {
          const isActive = form.course === course;
          return (
            <button key={course} type="button"
              onClick={() => setForm(p => ({ ...p, course }))}
              style={{
                padding: 16, borderRadius: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 16,
                transition: "all 0.2s", cursor: "pointer",
                background: isActive ? B6 : "white",
                border: `2px solid ${isActive ? B6 : B6_20}`,
                boxShadow: isActive ? "0 8px 24px rgba(37,99,235,0.25)" : "none",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = B6; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = B6_20; }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 14, flexShrink: 0,
                background: isActive ? "rgba(255,255,255,0.2)" : B6_08,
                color: isActive ? "white" : B6,
              }}>
                {String.fromCharCode(65 + i)}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: isActive ? "white" : B6 }}>{course}</p>
                <p style={{ fontSize: 12, marginTop: 2, color: isActive ? "rgba(255,255,255,0.7)" : "rgba(37,99,235,0.5)" }}>{form.department_name}</p>
              </div>
              {isActive && <Check size={16} color="white" style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── STEP 4: Sections ─────────────────────────────────────────────────────────
const StepSections = ({ form, setForm, errors }) => {
  const addSection = () => {
    if (form.sections.length >= 8) return;
    const nextName = SECTION_NAMES[form.sections.length];
    setForm(p => ({ ...p, sections: [...p.sections, { name: nextName, strength: "60" }] }));
  };
  const removeSection = (idx) => {
    if (form.sections.length <= 1) return;
    setForm(p => ({ ...p, sections: p.sections.filter((_, i) => i !== idx) }));
  };
  const updateSection = (idx, field, val) => {
    setForm(p => ({ ...p, sections: p.sections.map((s, i) => i === idx ? { ...s, [field]: val } : s) }));
  };
  const totalStrength = form.sections.reduce((sum, s) => sum + (parseInt(s.strength) || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 style={{ fontSize: "20px", fontWeight: 900, color: B6 }}>Create Sections</h3>
          <p style={{ fontSize: "14px", color: "rgba(37,99,235,0.5)", marginTop: 4 }}>Divide the batch into sections with student capacity.</p>
        </div>
        <button type="button" onClick={addSection} disabled={form.sections.length >= 8}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
            background: B6, color: "white", fontWeight: 700, fontSize: 13,
            borderRadius: 12, border: "none", cursor: "pointer", opacity: form.sections.length >= 8 ? 0.4 : 1,
            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
          }}>
          <Plus size={15}/> Add Section
        </button>
      </div>

      {errors.sections && (
        <p style={{ fontSize: 13, color: B6, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
          <AlertCircle size={14}/>{errors.sections}
        </p>
      )}

      <div className="space-y-3">
        {form.sections.map((section, idx) => (
          <div key={idx}
            style={{
              display: "flex", alignItems: "center", gap: 16, padding: 16,
              background: "white", border: `1px solid ${B6_12}`, borderRadius: 16,
              animation: `fadeIn 0.2s ease ${idx * 60}ms both`,
            }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: B6,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 900, fontSize: 18, flexShrink: 0,
            }}>
              {section.name}
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="space-y-1">
                <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)" }}>Section Name</label>
                <input value={section.name} onChange={e => updateSection(idx, "name", e.target.value)}
                  style={{ ...inputBase }}
                  onFocus={e => e.target.style.borderColor = B6}
                  onBlur={e => e.target.style.borderColor = B6_20}/>
              </div>
              <div className="space-y-1">
                <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)" }}>Strength</label>
                <input type="number" value={section.strength} onChange={e => updateSection(idx, "strength", e.target.value)}
                  style={{ ...inputBase }}
                  onFocus={e => e.target.style.borderColor = B6}
                  onBlur={e => e.target.style.borderColor = B6_20}/>
              </div>
            </div>
            <button type="button" onClick={() => removeSection(idx)} disabled={form.sections.length <= 1}
              style={{
                padding: 8, borderRadius: 10, border: "none", cursor: form.sections.length <= 1 ? "not-allowed" : "pointer",
                background: B6_05, color: "rgba(37,99,235,0.4)", opacity: form.sections.length <= 1 ? 0.3 : 1, transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (form.sections.length > 1) { e.currentTarget.style.background = B6_12; e.currentTarget.style.color = B6; }}}
              onMouseLeave={e => { e.currentTarget.style.background = B6_05; e.currentTarget.style.color = "rgba(37,99,235,0.4)"; }}>
              <Trash2 size={16}/>
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Sections",       value: form.sections.length },
          { label: "Total Capacity", value: totalStrength },
          { label: "Max Strength",   value: form.max_strength || "—" },
        ].map(stat => (
          <div key={stat.label} style={{ padding: 12, borderRadius: 16, textAlign: "center", background: B6_05, border: `1px solid ${B6_12}` }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: B6 }}>{stat.value}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(37,99,235,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {parseInt(form.max_strength) > 0 && totalStrength > parseInt(form.max_strength) && (
        <div style={{ padding: 12, background: B6_05, border: `1px solid ${B6_20}`, borderRadius: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: B6, fontWeight: 600 }}>
          <AlertCircle size={15}/> Total capacity ({totalStrength}) exceeds max strength ({form.max_strength})
        </div>
      )}
    </div>
  );
};

// ─── STEP 5 & 6: Assign Person ────────────────────────────────────────────────
const StepAssignPerson = ({ form, setForm, field, title, subtitle, icon: Icon }) => {
  const [search, setSearch] = useState("");
  const faculty = getFaculty();
  const selected = form[field];

  const filtered = faculty.filter(f => {
    const name = `${f.first_name} ${f.last_name}`.toLowerCase();
    return (name.includes(search.toLowerCase()) || (f.email||"").toLowerCase().includes(search.toLowerCase()) || (f.department||"").toLowerCase().includes(search.toLowerCase()))
      && ["active","approved"].includes(f.status?.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <div>
        <h3 style={{ fontSize: "20px", fontWeight: 900, color: B6 }}>{title}</h3>
        <p style={{ fontSize: "14px", color: "rgba(37,99,235,0.5)", marginTop: 4 }}>{subtitle}</p>
      </div>

      {selected && (
        <div style={{ padding: 16, borderRadius: 16, border: `2px solid ${B6}`, background: "white", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 8px 24px rgba(37,99,235,0.12)" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: B6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 18, textTransform: "uppercase", flexShrink: 0 }}>
            {selected.first_name?.[0]}{selected.last_name?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 900, color: B6 }}>{selected.first_name} {selected.last_name}</p>
            <p style={{ fontSize: 13, color: "rgba(37,99,235,0.55)" }}>{selected.designation} · {selected.department}</p>
            <p style={{ fontSize: 12, color: "rgba(37,99,235,0.4)", marginTop: 2 }}>{selected.email}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: B6, color: "white" }}>Assigned</span>
            <button type="button" onClick={() => setForm(p => ({ ...p, [field]: null }))}
              style={{ fontSize: 12, fontWeight: 700, color: "rgba(37,99,235,0.5)", background: "none", border: "none", cursor: "pointer" }}>
              Change
            </button>
          </div>
        </div>
      )}

      {!selected && (
        <>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(37,99,235,0.4)" }} size={16}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search faculty by name, email, department..."
              style={{ ...inputBase, paddingLeft: 40 }}
              onFocus={e => e.target.style.borderColor = B6}
              onBlur={e => e.target.style.borderColor = B6_20}/>
          </div>

          {faculty.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "rgba(37,99,235,0.4)" }}>
              <Users size={40} style={{ margin: "0 auto 12px", color: B6_20 }}/>
              <p style={{ fontWeight: 700, color: "rgba(37,99,235,0.5)" }}>No active faculty found</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Add faculty members first from the Faculty module.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 288, overflowY: "auto", paddingRight: 4 }}>
              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: 13, color: "rgba(37,99,235,0.4)", padding: "32px 0" }}>No faculty match your search</p>
              ) : filtered.map((f, i) => (
                <button key={f.id} type="button"
                  onClick={() => setForm(p => ({ ...p, [field]: f }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: 14,
                    background: "white", border: `1px solid ${B6_12}`, borderRadius: 16,
                    textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                    animation: `fadeIn 0.2s ease ${i * 40}ms both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = B6; e.currentTarget.style.boxShadow = `0 4px 16px ${B6_12}`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B6_12; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: B6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 13, textTransform: "uppercase", flexShrink: 0 }}>
                    {f.first_name?.[0]}{f.last_name?.[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: B6, fontSize: 14 }}>{f.first_name} {f.last_name}</p>
                    <p style={{ fontSize: 12, color: "rgba(37,99,235,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.designation} · {f.department}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: B6, opacity: 0 }} className="select-arrow">Select →</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── STEP 7: Students ─────────────────────────────────────────────────────────
const StepStudents = ({ form, setForm }) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("existing");
  const [manual, setManual] = useState({ name: "", email: "", roll_no: "" });

  useEffect(() => { ensureMockStudents(); }, []);
  const allStudents = getStudents();

  const available = allStudents.filter(s => {
    const name = `${s.first_name} ${s.last_name}`.toLowerCase();
    const isAdded = form.students.some(fs => fs.id === s.id);
    return !isAdded && (name.includes(search.toLowerCase()) || (s.roll_no||"").toLowerCase().includes(search.toLowerCase()));
  });

  const toggleStudent = (s) => {
    const already = form.students.some(fs => fs.id === s.id);
    setForm(p => ({ ...p, students: already ? p.students.filter(fs => fs.id !== s.id) : [...p.students, s] }));
  };

  const addManual = () => {
    if (!manual.name.trim()) return;
    const newS = { id: Date.now(), first_name: manual.name.split(" ")[0], last_name: manual.name.split(" ").slice(1).join(" ") || "", email: manual.email, roll_no: manual.roll_no };
    setForm(p => ({ ...p, students: [...p.students, newS] }));
    setManual({ name: "", email: "", roll_no: "" });
  };

  return (
    <div className="space-y-5">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "20px", fontWeight: 900, color: B6 }}>Add Students</h3>
          <p style={{ fontSize: "14px", color: "rgba(37,99,235,0.5)", marginTop: 4 }}>Assign students to this batch.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: B6_08, padding: 4, borderRadius: 12 }}>
          {[{id:"existing",label:"From List"},{id:"manual",label:"Manual"}].map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.15s",
                background: tab === t.id ? "white" : "transparent",
                color: tab === t.id ? B6 : "rgba(37,99,235,0.5)",
                boxShadow: tab === t.id ? "0 1px 4px rgba(37,99,235,0.1)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {form.students.length > 0 && (
        <div style={{ padding: 12, background: B6_05, border: `1px solid ${B6_12}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", marginRight: 4 }}>
              {form.students.slice(0,4).map((s,i) => (
                <div key={s.id} style={{ width: 32, height: 32, borderRadius: "50%", background: B6, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 12, textTransform: "uppercase", marginLeft: i > 0 ? -8 : 0 }}>
                  {s.first_name?.[0]}
                </div>
              ))}
              {form.students.length > 4 && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: B6_15, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: B6, fontWeight: 900, fontSize: 11, marginLeft: -8 }}>
                  +{form.students.length - 4}
                </div>
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: B6 }}>{form.students.length} student{form.students.length > 1 ? "s" : ""} added</span>
          </div>
          <button type="button" onClick={() => setForm(p => ({ ...p, students: [] }))}
            style={{ fontSize: 12, fontWeight: 700, color: B6, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear all
          </button>
        </div>
      )}

      {tab === "existing" ? (
        <div className="space-y-3">
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(37,99,235,0.4)" }} size={16}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
              style={{ ...inputBase, paddingLeft: 40 }}
              onFocus={e => e.target.style.borderColor = B6}
              onBlur={e => e.target.style.borderColor = B6_20}/>
          </div>
          <div style={{ maxHeight: 288, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
            {available.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(37,99,235,0.4)" }}>
                <GraduationCap size={36} style={{ margin: "0 auto 8px" }}/>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{search ? "No students match search" : "All students already added"}</p>
              </div>
            ) : available.map((s, i) => (
              <button key={s.id} type="button" onClick={() => toggleStudent(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: 12,
                  background: "white", border: `1px solid ${B6_12}`, borderRadius: 14,
                  textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                  animation: `fadeIn 0.2s ease ${i * 30}ms both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = B6; e.currentTarget.style.background = B6_05; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = B6_12; e.currentTarget.style.background = "white"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: B6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 13, textTransform: "uppercase", flexShrink: 0 }}>
                  {s.first_name?.[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: B6, fontSize: 13 }}>{s.first_name} {s.last_name}</p>
                  <p style={{ fontSize: 12, color: "rgba(37,99,235,0.45)" }}>{s.roll_no} · {s.department}</p>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${B6_30}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={10} color={B6_30}/>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: 16, background: B6_05, borderRadius: 16, border: `1px solid ${B6_12}` }} className="space-y-4">
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)" }}>Add Student Manually</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "Full Name", key: "name", placeholder: "Student name", required: true },
              { label: "Email",     key: "email", placeholder: "email@example.com" },
              { label: "Roll Number", key: "roll_no", placeholder: "ROLL-001" },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <label style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)" }}>{f.label}{f.required && <span style={{ color: B6 }}>*</span>}</label>
                <input value={manual[f.key]} onChange={e => setManual(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder}
                  style={{ ...inputBase }}
                  onFocus={e => e.target.style.borderColor = B6}
                  onBlur={e => e.target.style.borderColor = B6_20}/>
              </div>
            ))}
          </div>
          <button type="button" onClick={addManual} disabled={!manual.name.trim()}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
              background: B6, color: "white", fontWeight: 700, fontSize: 13,
              borderRadius: 12, border: "none", cursor: !manual.name.trim() ? "not-allowed" : "pointer",
              opacity: !manual.name.trim() ? 0.4 : 1,
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}>
            <Plus size={15}/> Add Student
          </button>
        </div>
      )}

      {form.students.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)", marginBottom: 8 }}>Added ({form.students.length})</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {form.students.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 10, paddingRight: 4, paddingTop: 4, paddingBottom: 4, background: B6, borderRadius: 999, color: "white", fontSize: 12, fontWeight: 700 }}>
                <span>{s.first_name} {s.last_name}</span>
                <button type="button" onClick={() => toggleStudent(s)}
                  style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={9} color="white"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ label, value, icon: Icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${B6_08}` }}>
    <div style={{ padding: 6, background: B6_08, borderRadius: 8 }}><Icon size={13} color={B6}/></div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)" }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: B6, marginTop: 2 }}>{value || "—"}</p>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN BatchForm
// ══════════════════════════════════════════════════════════════════════════════
const BatchForm = () => {
  const navigate   = useNavigate();
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(defaultForm);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const bodyRef = useRef(null);

  const scrollTop = () => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.name?.trim())         e.name          = "Batch name is required";
      if (!form.academic_year)        e.academic_year = "Academic year is required";
      if (!form.max_strength?.trim()) e.max_strength  = "Max strength is required";
    }
    if (s === 2 && !form.department_id) e.department_id = "Select a department";
    if (s === 3 && !form.course)        e.course        = "Select a course";
    if (s === 4 && form.sections.some(s => !s.name.trim())) e.sections = "All sections must have a name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (!validateStep(step)) { scrollTop(); return; } setStep(s => Math.min(s+1,7)); setErrors({}); scrollTop(); };
  const prev = () => { setStep(s => Math.max(s-1,1)); setErrors({}); scrollTop(); };

  const handleSubmit = () => {
    if (loading || done) return;
    setLoading(true);
    const batch = { id: Date.now(), ...form, status: "active", created_at: new Date().toISOString(), student_count: form.students.length };
    setTimeout(() => { addBatch(batch); setDone(true); setTimeout(() => navigate("/admin/batch"), 1500); }, 900);
  };

  const currentStep = STEPS[step - 1];

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "white" }}>
      <style>{`
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pop     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Page Header */}
      <div style={{ background: "white", borderBottom: `1px solid ${B6_12}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/admin/batch")}
          style={{ padding: 8, borderRadius: 12, border: "none", background: B6_05, cursor: "pointer", color: B6, display: "flex", alignItems: "center" }}
          onMouseEnter={e => e.currentTarget.style.background = B6_12}
          onMouseLeave={e => e.currentTarget.style.background = B6_05}>
          <ChevronLeft size={20}/>
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: B6 }}>Create New Batch</h1>
          <p style={{ fontSize: 13, color: "rgba(37,99,235,0.5)", marginTop: 2 }}>Step {step} of {STEPS.length} · {currentStep.label}</p>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "rgba(37,99,235,0.5)" }}>
          {Math.round((step / STEPS.length) * 100)}% complete
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: B6_10 }}>
        <div style={{ height: "100%", background: B6, transition: "width 0.5s ease", width: `${(step / STEPS.length) * 100}%`, borderRadius: "0 2px 2px 0" }}/>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px", display: "flex", gap: 32 }}>

        {/* Step sidebar */}
        <div style={{ display: "none", flexDirection: "column", gap: 4, width: 208, flexShrink: 0 }} className="lg-sidebar">
          <style>{`.lg-sidebar { display: none; } @media(min-width:1024px){ .lg-sidebar { display: flex !important; } }`}</style>
          {STEPS.map(s => {
            const Icon = s.icon;
            const isActive    = step === s.id;
            const isCompleted = step > s.id;
            return (
              <button key={s.id} type="button"
                onClick={() => { if (isCompleted) { setStep(s.id); setErrors({}); } }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 16,
                  textAlign: "left", border: "none", cursor: isCompleted ? "pointer" : isActive ? "default" : "not-allowed",
                  background: isActive ? "white" : "transparent",
                  boxShadow: isActive ? `0 4px 16px ${B6_12}, 0 0 0 1px ${B6_12}` : "none",
                  opacity: !isActive && !isCompleted ? 0.4 : 1,
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s",
                }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  background: isCompleted ? B6 : isActive ? B6 : B6_10,
                  color: isCompleted || isActive ? "white" : "rgba(37,99,235,0.5)",
                  boxShadow: isActive ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                  transition: "all 0.2s",
                }}>
                  {isCompleted ? <Check size={14}/> : <Icon size={14}/>}
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 900, color: isActive || isCompleted ? "rgba(37,99,235,0.5)" : "rgba(37,99,235,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Step {s.id}</p>
                  <p style={{ fontSize: 13, fontWeight: 900, color: isActive || isCompleted ? B6 : "rgba(37,99,235,0.35)", lineHeight: 1.3 }}>{s.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main form card */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {done ? (
            <div style={{ background: "white", borderRadius: 24, border: `1px solid ${B6_12}`, padding: "64px 32px", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
              <div style={{ width: 80, height: 80, background: B6_10, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "pop 0.5s ease" }}>
                <CheckCircle size={40} color={B6}/>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: B6 }}>Batch Created!</h2>
              <p style={{ color: "rgba(37,99,235,0.5)", marginTop: 8 }}>Redirecting to batch list...</p>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: B6, animation: `pop 0.6s ease ${i * 200}ms infinite` }}/>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 24, border: `1px solid ${B6_12}`, overflow: "hidden", boxShadow: `0 2px 16px ${B6_08}` }}>

              {/* Step header */}
              <div style={{ background: B6, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                {React.createElement(currentStep.icon, { size: 18, color: "white" })}
                <div>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>Step {step} of {STEPS.length}</p>
                  <h2 style={{ color: "white", fontWeight: 900, fontSize: 18, lineHeight: 1.3 }}>{currentStep.label}</h2>
                </div>
                {/* Mobile dots */}
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }} className="mobile-dots">
                  <style>{`@media(min-width:1024px){ .mobile-dots { display: none !important; } }`}</style>
                  {STEPS.map(s => (
                    <div key={s.id} style={{ width: 8, height: 8, borderRadius: "50%", background: step >= s.id ? "white" : "rgba(255,255,255,0.3)", transition: "all 0.2s" }}/>
                  ))}
                </div>
              </div>

              {/* Step body */}
              <div ref={bodyRef} style={{ padding: "32px", minHeight: 400, animation: "slideIn 0.25s ease" }} key={step}>
                {step === 1 && <StepBatchInfo    form={form} setForm={setForm} errors={errors}/>}
                {step === 2 && <StepDepartment   form={form} setForm={setForm} errors={errors}/>}
                {step === 3 && <StepCourse       form={form} setForm={setForm} errors={errors}/>}
                {step === 4 && <StepSections     form={form} setForm={setForm} errors={errors}/>}
                {step === 5 && <StepAssignPerson form={form} setForm={setForm} field="proctor" title="Assign Proctor" subtitle="The proctor monitors student attendance, conduct and welfare." icon={UserCheck}/>}
                {step === 6 && <StepAssignPerson form={form} setForm={setForm} field="hod"     title="Assign HOD"     subtitle="The Head of Department oversees academic progress and faculty." icon={ShieldCheck}/>}
                {step === 7 && <StepStudents     form={form} setForm={setForm}/>}
              </div>

              {/* Review summary (step 7 only) */}
              {step === 7 && (
                <div style={{ margin: "0 24px 24px", padding: 20, background: B6_05, borderRadius: 16, border: `1px solid ${B6_12}` }}>
                  <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(37,99,235,0.45)", marginBottom: 12 }}>Batch Summary</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <ReviewCard label="Batch Name"    value={form.name}            icon={Layers}     />
                    <ReviewCard label="Academic Year" value={form.academic_year}   icon={Calendar}   />
                    <ReviewCard label="Department"    value={form.department_name} icon={Building2}  />
                    <ReviewCard label="Course"        value={form.course}          icon={BookOpen}   />
                    <ReviewCard label="Sections"      value={`${form.sections.length} section(s): ${form.sections.map(s=>s.name).join(", ")}`} icon={Hash}/>
                    <ReviewCard label="Proctor"       value={form.proctor ? `${form.proctor.first_name} ${form.proctor.last_name}` : "Not assigned"} icon={UserCheck}/>
                    <ReviewCard label="HOD"           value={form.hod ? `${form.hod.first_name} ${form.hod.last_name}` : "Not assigned"} icon={ShieldCheck}/>
                    <ReviewCard label="Students"      value={`${form.students.length} student(s) assigned`} icon={Users}/>
                  </div>
                </div>
              )}

              {/* Navigation footer */}
              <div style={{ borderTop: `1px solid ${B6_08}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: B6_05 }}>
                <button type="button" onClick={prev} disabled={step === 1}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                    borderRadius: 12, border: `1px solid ${B6_20}`, background: "white",
                    color: B6, fontSize: 13, fontWeight: 700, cursor: step === 1 ? "not-allowed" : "pointer",
                    opacity: step === 1 ? 0.3 : 1, transition: "all 0.15s",
                  }}>
                  <ChevronLeft size={16}/> Back
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[5,6,7].includes(step) && (
                    <button type="button" onClick={() => step < 7 ? next() : handleSubmit()}
                      style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "rgba(37,99,235,0.5)", background: "none", border: "none", cursor: "pointer" }}>
                      Skip
                    </button>
                  )}
                  {step < 7 ? (
                    <button type="button" onClick={next}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 24px",
                        background: B6, color: "white", fontSize: 13, fontWeight: 700,
                        borderRadius: 12, border: "none", cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                      onMouseLeave={e => e.currentTarget.style.background = B6}>
                      Continue <ChevronRight size={16}/>
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} disabled={loading}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 24px",
                        background: B6, color: "white", fontSize: 13, fontWeight: 700,
                        borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                        boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                      }}>
                      {loading
                        ? <><Loader size={15} className="spin"/> Creating...</>
                        : <><CheckCircle size={15}/> Create Batch</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchForm;
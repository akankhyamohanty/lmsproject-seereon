import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Eye, Plus, Calendar, Filter, Loader, RefreshCw,
  Pencil, Trash2, X, Save, AlertTriangle, CheckCircle,
  Phone, Mail, Building2, CreditCard, GraduationCap,
  Briefcase, User, ShieldCheck, Hash, Landmark, MapPin,
  Clock, RotateCcw, ArrowLeft, AlertCircle, Lock,
  FileText, ImageIcon, ChevronDown, ChevronUp, Award
} from "lucide-react";

// ─── Storage ──────────────────────────────────────────────────────────────────
const LS_KEY = "faculty_list";
const seedDummyData = () => {
  if (localStorage.getItem(LS_KEY)) return;
  localStorage.setItem(LS_KEY, JSON.stringify([
    {
      id: 1, first_name: "Anjali", last_name: "Sharma",
      email: "anjali.sharma@example.com", phone: "+91 9876543210",
      institute_code: "INST-2024-001", department: "Computer Science",
      designation: "Senior Professor", experience: "8",
      bank_name: "State Bank of India", account_number: "123456789012",
      account_holder_name: "Anjali Sharma", confirm_account_number: "123456789012",
      ifsc_code: "SBIN0001234", branch_name: "MG Road Branch",
      dob: "1985-03-12", gender: "Female",
      aadhar_no: "1234 5678 9012", pan_no: "ABCDE1234F",
      education: {
        tenth:   { board: "CBSE",       marks: "92%",      year: "2001", file: "tenth_cert.pdf"   },
        twelfth: { board: "CBSE",       marks: "88%",      year: "2003", file: "twelfth_cert.pdf" },
        bed:     { university: "DU",    marks: "85%",      year: "2007", file: "bed_cert.pdf"     },
        ug:      { degree: "B.Sc CS",   university: "DU",  marks: "79%", year: "2006", file: "ug_cert.pdf" },
        pg:      { degree: "M.Sc CS",   university: "IIT", marks: "88%", year: "2008", file: "pg_cert.pdf" },
        other:   { degree: "", university: "", marks: "", year: "", file: null },
      },
      status: "active", created_at: new Date("2024-01-15").toISOString(),
    },
    {
      id: 2, first_name: "Rohan", last_name: "Verma",
      email: "rohan.verma@example.com", phone: "+91 9123456780",
      institute_code: "INST-2024-002", department: "Mathematics",
      designation: "Assistant Professor", experience: "3",
      bank_name: "HDFC Bank", account_number: "987654321098",
      account_holder_name: "Rohan Verma", confirm_account_number: "987654321098",
      ifsc_code: "HDFC0001234", branch_name: "Connaught Place",
      dob: "1991-07-22", gender: "Male",
      aadhar_no: "9876 5432 1098", pan_no: "ZYXWV9876G",
      education: {
        tenth:   { board: "ICSE", marks: "87%", year: "2007", file: "tenth.pdf" },
        twelfth: { board: "ICSE", marks: "83%", year: "2009", file: "12th.pdf"  },
        bed:     { university: "", marks: "", year: "", file: null },
        ug:      { degree: "B.Sc Math", university: "BHU", marks: "76%", year: "2012", file: "ug.pdf" },
        pg:      { degree: "", university: "", marks: "", year: "", file: null },
        other:   { degree: "", university: "", marks: "", year: "", file: null },
      },
      status: "pending", created_at: new Date("2024-03-10").toISOString(),
    },
    {
      id: 3, first_name: "Priya", last_name: "Nair",
      email: "priya.nair@example.com", phone: "+91 9988776655",
      institute_code: "INST-2024-003", department: "Physics",
      designation: "Professor", experience: "12",
      bank_name: "ICICI Bank", account_number: "112233445566",
      account_holder_name: "Priya Nair", confirm_account_number: "112233445566",
      ifsc_code: "ICIC0001234", branch_name: "Fort Branch",
      dob: "1979-11-05", gender: "Female",
      aadhar_no: "1122 3344 5566", pan_no: "PQRST5678H",
      education: {
        tenth:   { board: "State Board", marks: "94%", year: "1995", file: "10th.pdf" },
        twelfth: { board: "State Board", marks: "91%", year: "1997", file: "12th.pdf" },
        bed:     { university: "Calicut University", marks: "89%", year: "2001", file: "bed.pdf" },
        ug:      { degree: "B.Sc Physics", university: "Calicut University", marks: "82%", year: "2000", file: "ug.pdf" },
        pg:      { degree: "M.Sc Physics", university: "IIT Madras",          marks: "91%", year: "2002", file: "pg.pdf" },
        other:   { degree: "Ph.D", university: "IIT Madras", marks: "—", year: "2007", file: "phd.pdf" },
      },
      status: "active", created_at: new Date("2023-11-20").toISOString(),
    },
    {
      id: 4, first_name: "Karan", last_name: "Mehta",
      email: "karan.mehta@example.com", phone: "+91 9001122334",
      institute_code: "INST-2024-004", department: "Chemistry",
      designation: "Lecturer", experience: "1",
      bank_name: "Axis Bank", account_number: "556677889900",
      account_holder_name: "Karan Mehta", confirm_account_number: "556677889900",
      ifsc_code: "UTIB0001234", branch_name: "Nariman Point",
      dob: "1997-02-18", gender: "Male",
      aadhar_no: "5566 7788 9900", pan_no: "LMNOP2345I",
      education: {
        tenth:   { board: "CBSE", marks: "78%", year: "2013", file: "10th.pdf" },
        twelfth: { board: "CBSE", marks: "74%", year: "2015", file: "12th.pdf" },
        bed:     { university: "", marks: "", year: "", file: null },
        ug:      { degree: "B.Sc Chemistry", university: "Mumbai University", marks: "71%", year: "2018", file: "ug.pdf" },
        pg:      { degree: "", university: "", marks: "", year: "", file: null },
        other:   { degree: "", university: "", marks: "", year: "", file: null },
      },
      status: "rejected", created_at: new Date("2024-05-05").toISOString(),
    },
  ]));
};

const getFaculty = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; } };
const saveFaculty = (list) => localStorage.setItem(LS_KEY, JSON.stringify(list));

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ✅ FIXED: Status badge colors — Active=green, Pending=orange, Rejected=red
const STATUS = {
  active:   { badge: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500", label: "Active"   },
  approved: { badge: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500", label: "Approved" },
  pending:  { badge: "bg-orange-100 text-orange-700 border-orange-300",    dot: "bg-orange-500",  label: "Pending"  },
  rejected: { badge: "bg-red-100 text-red-700 border-red-300",             dot: "bg-red-500",     label: "Rejected" },
};
const statusStyle = (s) => STATUS[s?.toLowerCase()] || STATUS.pending;

const AVATAR_BG = [
  "from-blue-500 to-blue-700","from-blue-500 to-blue-600",
  "from-blue-500 to-blue-700","from-blue-500 to-blue-600","from-blue-500 to-blue-700",
];
const avatarBg = (id) => AVATAR_BG[(id || 0) % AVATAR_BG.length];

const EDU_LABELS = { tenth:"10th Grade", twelfth:"12th Grade", bed:"B.Ed", ug:"Under Graduate", pg:"Post Graduate", other:"Other Certificate" };
const DEPARTMENTS  = ["Computer Science","Physics","Mathematics","Chemistry","Biology","English","History","Economics","Commerce","Arts"];
const DESIGNATIONS = ["Lecturer","Assistant Professor","Associate Professor","Professor","Senior Professor","HOD","Principal"];

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
const DetailRow = ({ icon: Icon, label, value, mono, accent }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${accent ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
      <Icon size={12}/>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className={`text-md font-semibold break-all ${mono ? "font-mono" : ""} ${accent ? "text-blue-700" : "text-slate-700"}`}>
        {value || <span className="text-slate-300 font-normal italic">Not provided</span>}
      </p>
    </div>
  </div>
);

const SectionBox = ({ title, icon: Icon, color = "#3b82f6", children, collapsible = false }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button type="button"
        onClick={() => collapsible && setOpen(o => !o)}
        className={`w-full px-5 py-3 flex items-center justify-between ${collapsible ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
        style={{ background: color }}>
        <div className="flex items-center gap-2.5">
          <Icon size={14} className="text-white"/>
          <span className="text-md font-black text-white tracking-tight">{title}</span>
        </div>
        {collapsible && (open ? <ChevronUp size={14} className="text-white/70"/> : <ChevronDown size={14} className="text-white/70"/>)}
      </button>
      {(!collapsible || open) && <div className="p-5 bg-white">{children}</div>}
    </div>
  );
};

const EditInput = ({ label, name, type = "text", value, onChange, error, required, disabled, options, hint }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
      {label} {required && <span className="text-blue-300">*</span>}
    </label>
    {options ? (
      <select name={name} value={value || ""} onChange={onChange} disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-xl border text-md font-medium outline-none transition appearance-none
          ${error ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}>
        <option value="">Select</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value || ""} onChange={onChange} disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-xl border text-md font-medium outline-none transition
          ${error ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}
          disabled:opacity-50 disabled:cursor-not-allowed`}/>
    )}
    {hint && !error && <p className="text-[10px] text-slate-400">{hint}</p>}
    {error && <p className="text-md text-blue-300 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// VIEW MODAL
// ══════════════════════════════════════════════════════════════════════════════
const ViewModal = ({ faculty: f, onClose, onEdit, onDelete }) => {
  if (!f) return null;
  const s = statusStyle(f.status);

  const eduEntries = Object.entries(f.education || {}).filter(([, v]) => v && (v.marks || v.file || v.board || v.university || v.degree));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5"
      style={{ background: "rgba(2,6,23,0.65)", backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-50 w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        style={{ animation: "modalIn .25s cubic-bezier(.16,1,.3,1)" }}>

        {/* Profile hero */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-5 flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle at 10% 50%, #60a5fa 0%, transparent 60%), radial-gradient(circle at 90% 10%, #a78bfa 0%, transparent 60%)" }}/>
          <div className="relative flex items-start gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarBg(f.id)} flex items-center justify-center text-2xl font-black text-white shadow-xl uppercase flex-shrink-0`}>
              {f.first_name?.[0]}{f.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white leading-tight">{f.first_name} {f.last_name}</h2>
                  <p className="text-slate-400 text-md mt-1">{f.designation}{f.department ? ` · ${f.department}` : ""}</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl p-2 transition flex-shrink-0">
                  <X size={19}/>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-md font-bold uppercase tracking-wider ${s.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{f.status}
                </span>
                <span className="text-slate-500 text-md font-mono bg-slate-800/60 px-2 py-1 rounded-lg">{f.institute_code || "—"}</span>
                {f.experience && (
                  <span className="text-slate-400 text-md bg-slate-800/40 px-2 py-1 rounded-lg">{f.experience} yrs exp.</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="relative grid grid-cols-4 gap-2 mt-5">
            {[
              { label: "Department", value: f.department || "—" },
              { label: "Joined",     value: f.created_at ? new Date(f.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—" },
              { label: "Gender",     value: f.gender || "—" },
              { label: "DOB",        value: f.dob ? new Date(f.dob).toLocaleDateString("en-IN") : "—" },
            ].map(stat => (
              <div key={stat.label} className="bg-blue/5 rounded-xl px-3 py-2 text-center">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-md font-bold text-white mt-0.5 truncate">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable sections */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          <SectionBox title="Personal & Contact" icon={User} color="#3b82f6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <DetailRow icon={Mail}     label="Email Address"  value={f.email}  accent/>
                <DetailRow icon={Phone}    label="Phone Number"   value={f.phone}/>
                <DetailRow icon={User}     label="Gender"         value={f.gender}/>
              </div>
              <div>
                <DetailRow icon={Calendar} label="Date of Birth"  value={f.dob ? new Date(f.dob).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" }) : null}/>
                <DetailRow icon={Hash}     label="Institute Code" value={f.institute_code} mono/>
                <DetailRow icon={Clock}    label="Experience"     value={f.experience ? `${f.experience} Years` : null}/>
              </div>
            </div>
          </SectionBox>

          <SectionBox title="Legal Documents" icon={ShieldCheck} color="#3b82f6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <DetailRow icon={CreditCard} label="Aadhar Number"
                  value={f.aadhar_no ? f.aadhar_no.replace(/(\d{4})\s?(\d{4})\s?(\d{4})/, "•••• •••• $3") : null} mono/>
              </div>
              <div>
                <DetailRow icon={CreditCard} label="PAN Number" value={f.pan_no} mono accent/>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {["Aadhar", "PAN"].map(doc => (
                <div key={doc} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className="text-violet-300"/>
                  </div>
                  <div>
                    <p className="text-md font-bold text-slate-700">{doc} Card</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Document on file</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Uploaded</span>
                </div>
              ))}
            </div>
          </SectionBox>

          <SectionBox title="Educational Qualifications & Certificates" icon={GraduationCap} color="#3b82f6" collapsible>
            {eduEntries.length === 0 ? (
              <p className="text-md text-slate-400 italic py-2">No education records found.</p>
            ) : (
              <div className="space-y-3">
                {eduEntries.map(([key, edu]) => (
                  <div key={key} className="rounded-xl border border-orange-100 bg-orange-50/40 overflow-hidden">
                    <div className="bg-orange-100/80 px-4 py-2 flex items-center justify-between">
                      <span className="text-md font-black text-orange-300 uppercase tracking-wider">{EDU_LABELS[key] || key}</span>
                      {edu.file && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10}/> Certificate on file
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                      {edu.degree && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Degree</p>
                          <p className="text-md font-semibold text-slate-700 mt-0.5">{edu.degree}</p>
                        </div>
                      )}
                      {(edu.board || edu.university) && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{edu.board ? "Board" : "University"}</p>
                          <p className="text-md font-semibold text-slate-700 mt-0.5">{edu.board || edu.university}</p>
                        </div>
                      )}
                      {edu.marks && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Marks / CGPA</p>
                          <p className="text-md font-bold text-blue-700 mt-0.5">{edu.marks}</p>
                        </div>
                      )}
                      {edu.year && (
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pass Year</p>
                          <p className="text-md font-semibold text-slate-700 mt-0.5">{edu.year}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <Award size={16} className="text-orange-300 flex-shrink-0"/>
              <div>
                <p className="text-md font-bold text-slate-700">
                  {eduEntries.filter(([, v]) => v.file).length} certificate{eduEntries.filter(([, v]) => v.file).length !== 1 ? "s" : ""} uploaded
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">of 6 qualification levels</p>
              </div>
              <div className="ml-auto flex gap-1">
                {Object.entries(f.education || {}).map(([k, v]) => (
                  <div key={k} className={`w-2.5 h-2.5 rounded-sm ${v?.file ? "bg-emerald-500" : "bg-slate-200"}`} title={EDU_LABELS[k]}/>
                ))}
              </div>
            </div>
          </SectionBox>

          <SectionBox title="Bank Information" icon={Landmark} color="#3b82f6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <DetailRow icon={Landmark} label="Bank Name"         value={f.bank_name} accent/>
                <DetailRow icon={User}     label="Account Holder"    value={f.account_holder_name}/>
                <DetailRow icon={Hash}     label="Account Number"    value={f.account_number ? `•••• •••• ${f.account_number.slice(-4)}` : null} mono/>
              </div>
              <div>
                <DetailRow icon={Hash}     label="IFSC Code"   value={f.ifsc_code} mono accent/>
                <DetailRow icon={MapPin}   label="Branch Name" value={f.branch_name}/>
              </div>
            </div>
          </SectionBox>

          <SectionBox title="Professional Information" icon={Briefcase} color="#3b82f6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <DetailRow icon={Building2} label="Department"  value={f.department} accent/>
                <DetailRow icon={Briefcase} label="Designation" value={f.designation}/>
              </div>
              <div>
                <DetailRow icon={Clock}    label="Experience"     value={f.experience ? `${f.experience} Years` : null}/>
                <DetailRow icon={Calendar} label="Registered On"  value={f.created_at ? new Date(f.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" }) : null}/>
              </div>
            </div>
          </SectionBox>

        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-200 bg-white px-5 py-4 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-md font-bold hover:bg-slate-50 transition">
            <ArrowLeft size={15}/> Back
          </button>
          <div className="flex-1"/>
          <button onClick={() => { onClose(); onDelete(f); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-md font-bold hover:bg-red-100 transition">
            <Trash2 size={15}/> Delete
          </button>
          <button onClick={() => { onClose(); onEdit(f); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-md font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
            <Pencil size={15}/> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// EDIT MODAL
// ══════════════════════════════════════════════════════════════════════════════
const EDIT_TABS = [
  { id: "personal",     label: "Personal",    icon: User        },
  { id: "credentials",  label: "Credentials", icon: Lock        },
  { id: "legal",        label: "Legal Docs",  icon: ShieldCheck },
  { id: "education",    label: "Education",   icon: GraduationCap },
  { id: "bank",         label: "Bank Info",   icon: Landmark    },
  { id: "professional", label: "Professional",icon: Briefcase   },
];

const EditModal = ({ faculty, onClose, onSave }) => {
  const [form,     setForm]     = useState({ ...faculty, education: faculty.education || {} });
  const [tab,      setTab]      = useState("personal");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [saved,    setSaved]    = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleEduChange = (level, field, value) => {
    setForm(p => ({ ...p, education: { ...p.education, [level]: { ...(p.education[level] || {}), [field]: value } } }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name?.trim())    e.first_name    = "Required";
    if (!form.last_name?.trim())     e.last_name     = "Required";
    if (!form.email?.trim())         e.email         = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone?.trim())         e.phone         = "Required";
    if (!form.department)            e.department    = "Required";
    if (!form.designation?.trim())   e.designation   = "Required";
    if (!form.institute_code?.trim()) e.institute_code = "Required";
    if (!form.bank_name?.trim())     e.bank_name     = "Required";
    if (!form.ifsc_code?.trim())     e.ifsc_code     = "Required";
    setErrors(e);
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      onSave(form);
      setSaved(true);
      setTimeout(() => { setLoading(false); onClose(); }, 500);
    }, 700);
  };

  const EDU_LEVELS = [
    { key: "tenth",   label: "10th Grade",       hasBoard: true,  hasDegree: false },
    { key: "twelfth", label: "12th Grade",        hasBoard: true,  hasDegree: false },
    { key: "bed",     label: "B.Ed",              hasBoard: false, hasDegree: false },
    { key: "ug",      label: "Under Graduate",    hasBoard: false, hasDegree: true  },
    { key: "pg",      label: "Post Graduate",     hasBoard: false, hasDegree: true  },
    { key: "other",   label: "Other Certificate", hasBoard: false, hasDegree: true  },
  ];

  const hasErrors = Object.keys(errors).length > 0;

  const renderTabContent = () => {
    switch (tab) {
      case "personal": return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required disabled={loading}/>
            <EditInput label="Last Name"  name="last_name"  value={form.last_name}  onChange={handleChange} error={errors.last_name}  required disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditInput label="Email"    name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required disabled={loading}/>
            <EditInput label="Phone"    name="phone" type="tel"   value={form.phone} onChange={handleChange} error={errors.phone} required disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditInput label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} disabled={loading}/>
            <EditInput label="Gender" name="gender" value={form.gender} onChange={handleChange} disabled={loading} options={["Male","Female","Other","Prefer not to say"]}/>
          </div>
        </div>
      );

      case "credentials": return (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
            <Lock size={15} className="text-amber-300 flex-shrink-0 mt-0.5"/>
            <p className="text-md text-amber-400">Leave password fields blank to keep the existing password.</p>
          </div>
          <EditInput label="Institution Code" name="institute_code" value={form.institute_code} onChange={handleChange} error={errors.institute_code} required disabled={loading} hint="Unique login code for this faculty"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditInput label="Status" name="status" value={form.status} onChange={handleChange} disabled={loading} options={["pending","active","rejected"]}/>
          </div>
        </div>
      );

      case "legal": return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-700 px-4 py-2.5 flex items-center gap-2">
              <span>🪪</span><span className="text-md font-black text-white">Aadhar Card</span>
            </div>
            <div className="p-4">
              <EditInput label="Aadhar Number" name="aadhar_no" value={form.aadhar_no} onChange={handleChange} disabled={loading} hint="12-digit Aadhar number"/>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-700 px-4 py-2.5 flex items-center gap-2">
              <span>💳</span><span className="text-md font-black text-white">PAN Card</span>
            </div>
            <div className="p-4">
              <EditInput label="PAN Number" name="pan_no" value={form.pan_no} onChange={handleChange} disabled={loading} hint="10-character PAN"/>
            </div>
          </div>
          <p className="text-md text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-200">
            📎 To update document files (Aadhar/PAN PDFs), please delete and re-register the faculty, or use the document management module.
          </p>
        </div>
      );

      case "education": return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDU_LEVELS.map(({ key, label, hasBoard, hasDegree }) => {
              const edu = form.education?.[key] || {};
              return (
                <div key={key} className="rounded-2xl border border-orange-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-200 to-amber-200 px-4 py-2.5">
                    <span className="text-md font-black text-white">{label}</span>
                  </div>
                  <div className="p-4 space-y-2.5 bg-orange-50/30">
                    {hasDegree && (
                      <input type="text" value={edu.degree || ""} onChange={e => handleEduChange(key, "degree", e.target.value)}
                        placeholder="Degree name" disabled={loading}
                        className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-white text-md outline-none focus:border-orange-200 focus:ring-2 focus:ring-orange-100"/>
                    )}
                    <input type="text" value={hasBoard ? (edu.board || "") : (edu.university || "")}
                      onChange={e => handleEduChange(key, hasBoard ? "board" : "university", e.target.value)}
                      placeholder={hasBoard ? "Board name" : "University / Institute"} disabled={loading}
                      className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-white text-md outline-none focus:border-orange-200 focus:ring-2 focus:ring-orange-100"/>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={edu.marks || ""} onChange={e => handleEduChange(key, "marks", e.target.value)}
                        placeholder="Marks / CGPA" disabled={loading}
                        className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-white text-md outline-none focus:border-orange-200 focus:ring-2 focus:ring-orange-100"/>
                      <input type="text" value={edu.year || ""} onChange={e => handleEduChange(key, "year", e.target.value)}
                        placeholder="Pass Year" disabled={loading}
                        className="w-full px-3 py-2.5 rounded-xl border border-orange-200 bg-white text-md outline-none focus:border-orange-200 focus:ring-2 focus:ring-orange-100"/>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-md font-semibold flex items-center gap-2 ${
                      edu.file ? "bg-emerald-50 border-emerald-200 text-emerald-300" : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}>
                      <FileText size={12}/>
                      {edu.file
                        ? (typeof edu.file === "string" ? `✓ ${edu.file}` : `✓ ${edu.file.name}`)
                        : "No certificate on file"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

      case "bank": return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditInput label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} error={errors.bank_name} required disabled={loading}/>
            <EditInput label="Account Holder Name" name="account_holder_name" value={form.account_holder_name} onChange={handleChange} disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditInput label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} disabled={loading}/>
            <EditInput label="IFSC Code" name="ifsc_code" value={form.ifsc_code} onChange={handleChange} error={errors.ifsc_code} required disabled={loading} hint="11-character code"/>
          </div>
          <EditInput label="Branch Name" name="branch_name" value={form.branch_name} onChange={handleChange} disabled={loading}/>
        </div>
      );

      case "professional": return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditInput label="Department"         name="department"  value={form.department}  onChange={handleChange} error={errors.department}  required disabled={loading} options={DEPARTMENTS}/>
            <EditInput label="Designation"        name="designation" value={form.designation} onChange={handleChange} error={errors.designation} required disabled={loading} options={DESIGNATIONS}/>
            <EditInput label="Experience (Years)" name="experience"  value={form.experience}  onChange={handleChange} disabled={loading}/>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5"
      style={{ background: "rgba(2,6,23,0.65)", backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="bg-slate-50 w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        style={{ animation: "modalIn .25s cubic-bezier(.16,1,.3,1)" }}>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarBg(faculty.id)} flex items-center justify-center font-black text-white uppercase text-md flex-shrink-0`}>
              {faculty.first_name?.[0]}{faculty.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Edit Faculty Profile</h2>
              <p className="text-blue-200 text-md">{faculty.first_name} {faculty.last_name} · {faculty.institute_code}</p>
            </div>
          </div>
          <button onClick={() => !loading && onClose()} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-2 transition">
            <X size={20}/>
          </button>
        </div>

        <div className="bg-white border-b border-slate-200 flex overflow-x-auto flex-shrink-0">
          {EDIT_TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-md font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all
                ${tab === id
                  ? "border-blue-600 text-blue-700 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
              <Icon size={12}/>{label}
            </button>
          ))}
        </div>

        {hasErrors && (
          <div className="mx-5 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2 flex-shrink-0">
            <AlertCircle size={14} className="text-blue-100 mt-0.5 flex-shrink-0"/>
            <div>
              <p className="text-md font-bold text-blue-300">Fix {Object.keys(errors).length} error(s):</p>
              <p className="text-md text-blue-300">{Object.values(errors).join(" · ")}</p>
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-5 py-3 flex items-center gap-2">
              {React.createElement(EDIT_TABS.find(t => t.id === tab)?.icon || User, { size: 14, className: "text-white" })}
              <span className="text-md font-black text-white">{EDIT_TABS.find(t => t.id === tab)?.label}</span>
            </div>
            <div className="p-5">{renderTabContent()}</div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white px-5 py-4 flex gap-3 flex-shrink-0">
          <button onClick={() => !loading && onClose()} disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-md font-bold hover:bg-slate-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => setForm({ ...faculty, education: faculty.education || {} })} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-md font-bold hover:bg-slate-50 transition disabled:opacity-50">
            <RotateCcw size={13}/> Reset
          </button>
          <div className="flex-1"/>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-md font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-60">
            {loading
              ? saved ? <><CheckCircle size={14}/> Saved!</> : <><Loader size={14} className="animate-spin"/> Saving...</>
              : <><Save size={14}/> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// DELETE MODAL — ✅ FIXED: properly calls onConfirm and closes modal
// ══════════════════════════════════════════════════════════════════════════════
const DeleteModal = ({ faculty: f, onClose, onConfirm }) => {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Guard against undefined first_name / last_name
  const firstName = f?.first_name?.trim() || "";
  const lastName  = f?.last_name?.trim()  || "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ");
  // Fall back to email if name is missing
  const expected  = fullName || f?.email || "confirm";
  const match     = text.trim().toLowerCase() === expected.toLowerCase();

  const handleDelete = () => {
    if (!match || loading) return;
    setLoading(true);
    setTimeout(() => {
      onConfirm(f.id);   // parent sets delF=null → unmounts this modal
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        style={{ animation: "modalIn .25s cubic-bezier(.16,1,.3,1)" }}>

        {/* Header */}
        <div className="bg-gradient-to-br from-red-500 to-red-700 px-6 pt-6 pb-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% -10%, #fff 0%, transparent 55%)" }}/>
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl flex-shrink-0">
              <AlertTriangle size={22} className="text-white"/>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Delete Faculty</h2>
              <p className="text-red-100 text-md mt-1">This action is permanent and cannot be undone.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Faculty card */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarBg(f.id)} flex items-center justify-center font-black text-white uppercase flex-shrink-0`}>
              {firstName?.[0] || "?"}{lastName?.[0] || ""}
            </div>
            <div>
              <p className="font-black text-slate-800">{fullName || <span className="italic text-slate-400">No name provided</span>}</p>
              <p className="text-md text-slate-500">{f.designation || "—"} · {f.department || "—"}</p>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">{f.email}</p>
            </div>
          </div>

          {/* Confirmation input */}
          <div>
            <p className="text-md font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Type <span className="font-mono bg-red-50 text-red-600 px-1.5 py-0.5 rounded">{expected}</span> to confirm
            </p>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleDelete()}
              placeholder={expected}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border text-md font-medium outline-none transition
                ${text.length > 0
                  ? match
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    : "border-red-300 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 bg-slate-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"}`}
            />
            {match && (
              <p className="text-md text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle size={11}/> Name confirmed — ready to delete
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => !loading && onClose()}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-md hover:bg-slate-50 transition disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!match || loading}
              className={`flex-1 py-2.5 rounded-xl font-bold text-md flex items-center justify-center gap-2 transition
                ${match && !loading
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25"
                  : "bg-red-100 text-red-300 cursor-not-allowed"}`}>
              {loading
                ? <><Loader size={14} className="animate-spin"/> Deleting...</>
                : <><Trash2 size={14}/> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// FACULTY LIST (main page)
// ══════════════════════════════════════════════════════════════════════════════
export const FacultyList = () => {
  const navigate = useNavigate();
  const [search,  setSearch]  = useState("");
  const [tab,     setTab]     = useState("all");
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewF,   setViewF]   = useState(null);
  const [editF,   setEditF]   = useState(null);
  const [delF,    setDelF]    = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const load = () => {
    setLoading(true);
    seedDummyData();
    setTimeout(() => { setFaculty(getFaculty()); setLoading(false); }, 400);
  };

  useEffect(() => { load(); }, []);

  const handleSave = (updated) => {
    const list = faculty.map(f => f.id === updated.id ? updated : f);
    setFaculty(list); saveFaculty(list);
    showToast(`${updated.first_name} ${updated.last_name} updated`);
  };

  // ✅ FIXED: Properly removes faculty and closes modal
  const handleDelete = (id) => {
    const deleted = faculty.find(f => f.id === id);
    const list    = faculty.filter(f => f.id !== id);
    saveFaculty(list);
    setFaculty(list);
    setDelF(null);
    const name = [deleted?.first_name, deleted?.last_name].filter(Boolean).join(" ") || deleted?.email || "Faculty";
    showToast(`${name} has been removed`, "error");
  };

  const counts = {
    all:      faculty.length,
    pending:  faculty.filter(f => f.status?.toLowerCase() === "pending").length,
    active:   faculty.filter(f => ["active","approved"].includes(f.status?.toLowerCase())).length,
    rejected: faculty.filter(f => f.status?.toLowerCase() === "rejected").length,
  };

  const filtered = faculty.filter(f => {
    const name = `${f.first_name} ${f.last_name}`.toLowerCase();
    const ok   = name.includes(search.toLowerCase()) ||
      (f.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.department || "").toLowerCase().includes(search.toLowerCase());
    const s    = f.status?.toLowerCase();
    const tabOk =
      tab === "all"      ? true :
      tab === "active"   ? (s === "active" || s === "approved") :
      tab === "pending"  ? s === "pending" :
      tab === "rejected" ? s === "rejected" : true;
    return ok && tabOk;
  });

  // ✅ FIXED: Tab colors — All=blue, Pending=orange, Active=green, Rejected=red
  const TAB_STYLES = {
    all:      { active: "text-blue-700 bg-blue-50 border-blue-300",     badge: "bg-blue-100 text-blue-700"     },
    pending:  { active: "text-orange-700 bg-orange-50 border-orange-300", badge: "bg-orange-100 text-orange-700" },
    active:   { active: "text-emerald-700 bg-emerald-50 border-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
    rejected: { active: "text-red-700 bg-red-50 border-red-300",         badge: "bg-red-100 text-red-700"       },
  };

  return (
    <>
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn   { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]" style={{ animation: "toastIn .3s ease" }}>
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-md font-semibold border
            ${toast.type === "error" ? "bg-red-600 text-white border-red-700" : "bg-slate-900 text-white border-slate-800"}`}>
            {toast.type === "error" ? <Trash2 size={14}/> : <CheckCircle size={14}/>}
            {toast.msg}
          </div>
        </div>
      )}

      <div className="font-sans w-full text-left pb-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Faculty Directory</h1>
            <p className="text-md font-medium text-slate-500 mt-1">
              Manage faculty profiles, documents & credentials
              {faculty.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-700 text-md font-bold px-2 py-0.5 rounded-full">{faculty.length} total</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} disabled={loading}
              className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-md font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""}/> Refresh
            </button>
            <button onClick={() => navigate("/admin/faculty/create")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-md font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95">
              <Plus size={17}/> Add Faculty
            </button>
          </div>
        </div>

        {/* Tabs + search */}
        <div className="flex flex-col md:flex-row gap-3 mb-5 justify-between items-end">
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex flex-wrap gap-1 shadow-sm">
            {["all", "pending", "active", "rejected"].map(t => {
              const style = TAB_STYLES[t];
              const isActive = tab === t;
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-md font-black uppercase tracking-wide flex items-center gap-1.5 transition-all border
                    ${isActive ? `${style.active} border` : "text-slate-500 hover:text-slate-700 border-transparent"}`}>
                  {t}
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? style.badge : "bg-slate-100 text-slate-400"}`}>
                    {counts[t]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, department..."
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-md font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-sm text-slate-700 placeholder:text-slate-400"/>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-4 pl-6 pr-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Faculty</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Department</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden lg:table-cell">Joined</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="py-4 pr-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="6" className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader size={19} className="animate-spin"/><span className="font-medium text-md">Loading faculty...</span>
                    </div>
                  </td></tr>
                ) : filtered.length > 0 ? filtered.map((item, i) => {
                  const st = statusStyle(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group"
                      style={{ animation: `rowIn .3s ease ${i * 35}ms both` }}>
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarBg(item.id)} flex items-center justify-center font-black text-white text-md shrink-0 uppercase shadow-sm`}>
                            {item.first_name?.[0] || "?"}{item.last_name?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-md">
                              {[item.first_name, item.last_name].filter(Boolean).join(" ") || <span className="italic text-slate-400">No name</span>}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.institute_code || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-700 text-md truncate max-w-[180px]">{item.email}</p>
                        <p className="text-md text-slate-400 mt-0.5">{item.phone || "—"}</p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="text-md font-semibold text-slate-700">{item.department}</p>
                        <p className="text-md text-slate-400 mt-0.5">{item.designation}</p>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar size={12}/>
                          <span className="text-md font-medium">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-md font-bold uppercase tracking-wider ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>{item.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        <div className="flex justify-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewF(item)} title="View"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Eye size={16}/>
                          </button>
                          <button onClick={() => setEditF(item)} title="Edit"
                            className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                            <Pencil size={16}/>
                          </button>
                          <button onClick={() => setDelF(item)} title="Delete"
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={36} className="text-slate-200"/>
                      <p className="font-bold text-slate-500 text-md">
                        {faculty.length === 0 ? "No faculty registered yet" : "No results match this filter"}
                      </p>
                      {tab !== "all" && faculty.length > 0 && (
                        <button onClick={() => setTab("all")} className="text-md text-blue-600 font-bold hover:underline">
                          Show all {faculty.length} faculty
                        </button>
                      )}
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/50 flex justify-between items-center flex-wrap gap-2">
              <p className="text-md font-semibold text-slate-400">
                Showing <span className="text-slate-600 font-bold">{filtered.length}</span> of <span className="text-slate-600 font-bold">{faculty.length}</span>
              </p>
              {/* ✅ FIXED: legend dot colors match status colors */}
              <div className="flex items-center gap-3 text-md font-semibold text-slate-400">
                {[
                  { dot: "bg-emerald-500", label: "Active",   count: counts.active   },
                  { dot: "bg-orange-500",  label: "Pending",  count: counts.pending  },
                  { dot: "bg-red-500",     label: "Rejected", count: counts.rejected },
                ].map(({ dot, label, count }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dot}`}/>{count} {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {viewF && <ViewModal faculty={viewF} onClose={() => setViewF(null)} onEdit={f => setEditF(f)} onDelete={f => setDelF(f)}/>}
      {editF && <EditModal faculty={editF} onClose={() => setEditF(null)} onSave={updated => { handleSave(updated); setEditF(null); }}/>}
      {delF  && <DeleteModal faculty={delF} onClose={() => setDelF(null)} onConfirm={handleDelete}/>}
    </>
  );
};

export default FacultyList;
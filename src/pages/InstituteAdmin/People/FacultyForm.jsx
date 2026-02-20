import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save, Upload, CheckCircle, AlertCircle, Eye, EyeOff,
  Loader, X, RotateCcw, User, Lock, FileText, GraduationCap,
  Landmark, Briefcase, ChevronRight, ChevronLeft, Check,
  Trash2, File, ImageIcon, Shield
} from "lucide-react";

// ─── Storage helpers ──────────────────────────────────────────────────────────
const LS_DRAFT_KEY   = "faculty_form_draft";
const LS_FACULTY_KEY = "faculty_list";

// ✅ FIX: File objects cannot be serialized by JSON.stringify (they become {}).
// We convert every File to its filename string before storing.
const saveFacultyToList = (formData) => {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_FACULTY_KEY) || "[]");

    // Serialize education: replace File objects with filenames
    const education = {};
    Object.keys(formData.education || {}).forEach((k) => {
      const edu = formData.education[k];
      education[k] = {
        ...edu,
        file: edu.file instanceof File ? edu.file.name : (edu.file || null),
      };
    });

    existing.push({
      id:                     Date.now(),
      first_name:             formData.first_name,
      last_name:              formData.last_name,
      email:                  formData.email,
      phone:                  formData.phone,
      dob:                    formData.dob,
      gender:                 formData.gender,
      institute_code:         formData.institute_code,
      aadhar_no:              formData.aadhar_no,
      // Store filename, not the File object
      aadhar_file:            formData.aadhar_file instanceof File ? formData.aadhar_file.name : null,
      pan_no:                 formData.pan_no,
      pan_file:               formData.pan_file instanceof File ? formData.pan_file.name : null,
      bank_name:              formData.bank_name,
      account_holder_name:    formData.account_holder_name,
      account_number:         formData.account_number,
      confirm_account_number: formData.confirm_account_number,
      branch_name:            formData.branch_name,
      ifsc_code:              formData.ifsc_code,
      department:             formData.department,
      designation:            formData.designation,
      experience:             formData.experience,
      education,
      status:                 "pending",
      created_at:             new Date().toISOString(),
    });

    localStorage.setItem(LS_FACULTY_KEY, JSON.stringify(existing));
    return true;
  } catch (err) {
    console.error("saveFacultyToList failed:", err);
    return false;
  }
};

// ─── Default state ────────────────────────────────────────────────────────────
const defaultForm = {
  // Personal
  first_name: "", last_name: "", email: "", phone: "", dob: "", gender: "",
  // Credentials
  institute_code: "", password: "", confirmPassword: "",
  // Legal
  aadhar_no: "", aadhar_file: null,
  pan_no:    "", pan_file:    null,
  // Education
  education: {
    tenth:   { board: "", marks: "", year: "", file: null },
    twelfth: { board: "", marks: "", year: "", file: null },
    bed:     { university: "", marks: "", year: "", file: null },
    ug:      { degree: "", university: "", marks: "", year: "", file: null },
    pg:      { degree: "", university: "", marks: "", year: "", file: null },
    other:   { degree: "", university: "", marks: "", year: "", file: null },
  },
  // Bank
  bank_name: "", account_holder_name: "", account_number: "",
  confirm_account_number: "", branch_name: "", ifsc_code: "",
  // Professional
  department: "", designation: "", experience: "",
};

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, label: "Personal",     icon: User,          color: "blue"  },
  { id: 1, label: "Credentials",  icon: Lock,          color: "blue"  },
  { id: 2, label: "Legal Docs",   icon: Shield,        color: "blue"  },
  { id: 3, label: "Education",    icon: GraduationCap, color: "blue"  },
  { id: 4, label: "Bank Info",    icon: Landmark,      color: "blue"  },
  { id: 5, label: "Professional", icon: Briefcase,     color: "blue"  },
];

const STEP_COLORS = {
  blue:    { bg: "bg-blue-600",    light: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-600",    ring: "ring-blue-500"   },
  red:     { bg: "bg-rose-600",    light: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-600",    ring: "ring-rose-500"   },
  purple:  { bg: "bg-violet-600",  light: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-600",  ring: "ring-violet-500" },
  orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-600",  ring: "ring-orange-500" },
  emerald: { bg: "bg-emerald-600", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", ring: "ring-emerald-500"},
  indigo:  { bg: "bg-indigo-600",  light: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-600",  ring: "ring-indigo-500" },
};

const EDU_LEVELS = [
  { key: "tenth",   label: "10th Grade",         emoji: "📗", hasBoard: true,  hasDegree: false },
  { key: "twelfth", label: "12th Grade",          emoji: "📘", hasBoard: true,  hasDegree: false },
  { key: "bed",     label: "B.Ed",                emoji: "🎓", hasBoard: false, hasDegree: false },
  { key: "ug",      label: "Under Graduate (UG)", emoji: "🎓", hasBoard: false, hasDegree: true  },
  { key: "pg",      label: "Post Graduate (PG)",  emoji: "👨‍🎓", hasBoard: false, hasDegree: true  },
  { key: "other",   label: "Other Certificate",   emoji: "📄", hasBoard: false, hasDegree: true  },
];

const DEPARTMENTS  = ["Computer Science","Physics","Mathematics","Chemistry","Biology","English","History","Economics","Commerce","Arts"];
const DESIGNATIONS = ["Lecturer","Assistant Professor","Associate Professor","Professor","Senior Professor","HOD","Principal"];

// ─── Sub-components ───────────────────────────────────────────────────────────
const FormInput = ({ label, name, type = "text", value, onChange, error, placeholder, required, disabled, hint }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1 text-md font-bold text-slate-600 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type} name={name} value={value || ""} onChange={onChange}
      placeholder={placeholder} disabled={disabled}
      className={`w-full px-3.5 py-3 rounded-xl border text-md font-medium outline-none transition-all
        ${error
          ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-200 text-red-700"
          : "border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"}
        disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
    />
    {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
    {error && <p className="text-md text-red-600 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
  </div>
);

const PasswordInput = ({ label, name, value, onChange, error, show, onToggle, placeholder, required, disabled, hint }) => (
  <div className="space-y-1.5">
    <label className="text-md font-bold text-slate-600 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"} name={name} value={value || ""}
        onChange={onChange} placeholder={placeholder} disabled={disabled}
        className={`w-full px-3.5 py-3 pr-11 rounded-xl border text-md font-medium outline-none transition-all
          ${error ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-200" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}
          disabled:bg-slate-50 disabled:cursor-not-allowed`}
      />
      <button type="button" onClick={onToggle} disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1">
        {show ? <EyeOff size={15}/> : <Eye size={15}/>}
      </button>
    </div>
    {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
    {error && <p className="text-md text-red-600 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
  </div>
);

const SelectInput = ({ label, name, value, onChange, error, required, disabled, options }) => (
  <div className="space-y-1.5">
    <label className="text-md font-bold text-slate-600 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select name={name} value={value || ""} onChange={onChange} disabled={disabled}
      className={`w-full px-3.5 py-3 rounded-xl border text-md font-medium outline-none transition-all appearance-none cursor-pointer
        ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}
        disabled:bg-slate-50 disabled:cursor-not-allowed`}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    {error && <p className="text-md text-red-600 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
  </div>
);

const FileUpload = ({ label, id, file, storedName, onChange, error, required, disabled, accept = ".pdf,.jpg,.jpeg,.png" }) => {
  const hasFile = !!file;
  const isImage = file?.type?.startsWith("image/");

  return (
    <div className="space-y-1.5">
      <label className="text-md font-bold text-slate-600 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`relative border-2 border-dashed rounded-xl transition-all
        ${hasFile ? "border-emerald-400 bg-emerald-50/50"
          : error  ? "border-red-300 bg-red-50/30"
          : "border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30"}`}>
        <input type="file" id={id} accept={accept} onChange={onChange} disabled={disabled} className="hidden"/>
        {hasFile ? (
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              {isImage ? <ImageIcon size={18} className="text-emerald-600"/> : <File size={18} className="text-emerald-600"/>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-md font-bold text-emerald-700 truncate">{file.name}</p>
              <p className="text-[10px] text-emerald-500">{(file.size / 1024).toFixed(1)} KB · Uploaded</p>
            </div>
            <label htmlFor={id} className="cursor-pointer p-1.5 hover:bg-emerald-100 rounded-lg transition-colors">
              <RotateCcw size={14} className="text-emerald-600"/>
            </label>
          </div>
        ) : (
          <label htmlFor={id} className="flex flex-col items-center gap-2 py-4 px-3 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Upload size={16} className="text-slate-400"/>
            </div>
            {storedName ? (
              <div className="text-center">
                <p className="text-md font-bold text-amber-600">⚠ Re-upload required</p>
                <p className="text-[10px] text-amber-500 truncate max-w-[160px]">{storedName}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-md font-semibold text-slate-600">Click to upload</p>
                <p className="text-[10px] text-slate-400">PDF · JPG · PNG  (max 5 MB)</p>
              </div>
            )}
          </label>
        )}
      </div>
      {error && <p className="text-md text-red-600 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
    </div>
  );
};

// ─── Progress Indicator ───────────────────────────────────────────────────────
const StepIndicator = ({ steps, current, completed }) => (
  <div className="flex items-center justify-center gap-0 w-full overflow-x-auto py-2 px-2">
    {steps.map((step, i) => {
      const Icon  = step.icon;
      const col   = STEP_COLORS[step.color];
      const done  = completed.includes(i);
      const active = current === i;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${done   ? `${col.bg} border-transparent text-white`
              : active ? `bg-white ${col.border} ${col.text} ring-4 ${col.ring}/20`
              :          "bg-white border-slate-200 text-slate-400"}`}>
              {done ? <Check size={15}/> : <Icon size={15}/>}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:block
              ${active ? col.text : done ? "text-slate-500" : "text-slate-300"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 min-w-4 transition-all duration-500 rounded
              ${done ? col.bg : "bg-slate-200"}`}/>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const FacultyForm = ({ onClose }) => {
  const navigate   = useNavigate();
  const scrollRef  = useRef(null);
  const [step,                setStep]                = useState(0);
  const [completed,           setCompleted]           = useState([]);
  const [form,                setForm]                = useState(defaultForm);
  const [errors,              setErrors]              = useState({});
  const [loading,             setLoading]             = useState(false);
  const [submitted,           setSubmitted]           = useState(false);
  const [showPass,            setShowPass]            = useState(false);
  const [showConfPass,        setShowConfPass]        = useState(false);
  const [storedFiles,         setStoredFiles]         = useState({ aadhar_file: null, pan_file: null, education: {} });

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const education = {};
      Object.keys(defaultForm.education).forEach(k => {
        education[k] = { ...defaultForm.education[k], ...(parsed.education?.[k] || {}), file: null };
      });
      setForm(prev => ({ ...prev, ...parsed, aadhar_file: null, pan_file: null, education }));
      const eduNames = {};
      Object.keys(defaultForm.education).forEach(k => { eduNames[k] = parsed.education?.[k]?.file || null; });
      setStoredFiles({ aadhar_file: parsed.aadhar_file || null, pan_file: parsed.pan_file || null, education: eduNames });
    } catch {}
  }, []);

  // ✅ FIX: Auto-save draft — also serialize File objects to filenames
  useEffect(() => {
    try {
      const draft = {
        ...form,
        // Store filename string, not the File object
        aadhar_file: form.aadhar_file instanceof File ? form.aadhar_file.name : null,
        pan_file:    form.pan_file    instanceof File ? form.pan_file.name    : null,
        education: {},
      };
      Object.keys(form.education).forEach(k => {
        const edu = form.education[k];
        draft.education[k] = {
          ...edu,
          file: edu.file instanceof File ? edu.file.name : null,
        };
      });
      localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleFile = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["application/pdf","image/jpeg","image/png","image/jpg"].includes(file.type)) {
      setErrors(p => ({ ...p, [field]: "Only PDF, JPG, PNG allowed" })); return;
    }
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, [field]: "Max 5 MB" })); return; }
    setForm(p => ({ ...p, [field]: file }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const handleEduChange = (level, field, value) => {
    setForm(p => ({ ...p, education: { ...p.education, [level]: { ...p.education[level], [field]: value } } }));
  };

  const handleEduFile = (e, level) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["application/pdf","image/jpeg","image/png","image/jpg"].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setForm(p => ({ ...p, education: { ...p.education, [level]: { ...p.education[level], file } } }));
  };

  const removeEduFile = (level) => {
    setForm(p => ({ ...p, education: { ...p.education, [level]: { ...p.education[level], file: null } } }));
  };

  // ─── Step-level validation ─────────────────────────────────────────────────
  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.first_name?.trim()) e.first_name = "Required";
      if (!form.last_name?.trim())  e.last_name  = "Required";
      if (!form.email?.trim())      e.email      = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.phone?.trim())      e.phone      = "Required";
    }
    if (s === 1) {
      if (!form.institute_code?.trim()) e.institute_code = "Required";
      if (!form.password)               e.password       = "Required";
      else if (form.password.length < 8) e.password      = "Min 8 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    if (s === 2) {
      if (!form.aadhar_no?.trim()) e.aadhar_no   = "Required";
      if (!form.aadhar_file)       e.aadhar_file = "Upload Aadhar document";
      if (!form.pan_no?.trim())    e.pan_no      = "Required";
      if (!form.pan_file)          e.pan_file    = "Upload PAN document";
    }
    if (s === 3) {
      const hasAny = Object.values(form.education).some(e => e.file);
      if (!hasAny) e.education_general = "Upload at least one certificate";
    }
    if (s === 4) {
      if (!form.bank_name?.trim())           e.bank_name           = "Required";
      if (!form.account_holder_name?.trim()) e.account_holder_name = "Required";
      if (!form.account_number?.trim())      e.account_number      = "Required";
      if (form.account_number !== form.confirm_account_number) e.confirm_account_number = "Account numbers don't match";
      if (!form.ifsc_code?.trim())           e.ifsc_code           = "Required";
    }
    if (s === 5) {
      if (!form.department)          e.department  = "Required";
      if (!form.designation?.trim()) e.designation = "Required";
      if (!form.experience?.trim())  e.experience  = "Required";
    }
    return e;
  };

  const goNext = () => {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setCompleted(p => [...new Set([...p, step])]);
    setStep(p => p + 1);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setStep(p => p - 1);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (submitted || loading) return;
    const e = validateStep(5);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true); setSubmitted(true);
    setTimeout(() => {
      const ok = saveFacultyToList(form);
      if (ok) {
        localStorage.removeItem(LS_DRAFT_KEY);
        navigate("/admin/faculty");
      } else {
        setLoading(false); setSubmitted(false);
        setErrors({ _general: "Save failed. Check the browser console for details." });
      }
    }, 800);
  };

  const clearDraft = () => {
    localStorage.removeItem(LS_DRAFT_KEY);
    setForm(defaultForm);
    setErrors({});
    setStep(0);
    setCompleted([]);
    setStoredFiles({ aadhar_file: null, pan_file: null, education: {} });
  };

  const handleClose = () => { if (!loading) { onClose ? onClose() : navigate("/admin/faculty"); } };

  const col = STEP_COLORS[STEPS[step].color];
  const hasDraft = !!localStorage.getItem(LS_DRAFT_KEY);
  const errCount = Object.keys(errors).length;

  // ─── Step panels ───────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // ── 0: Personal ──────────────────────────────────────────────────────
      case 0: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} placeholder="Anjali" required disabled={loading}/>
            <FormInput label="Last Name"  name="last_name"  value={form.last_name}  onChange={handleChange} error={errors.last_name}  placeholder="Sharma" required disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="anjali@institute.edu" required disabled={loading}/>
            <FormInput label="Phone Number"  name="phone" type="tel"   value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 9876543210"       required disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} disabled={loading}/>
            <SelectInput label="Gender" name="gender" value={form.gender} onChange={handleChange} disabled={loading} options={["Male","Female","Other","Prefer not to say"]}/>
          </div>
        </div>
      );

      // ── 1: Credentials ────────────────────────────────────────────────────
      case 1: return (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-blue-100 border border-blue-100 flex gap-3">
            <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-md font-bold text-amber-800">Login Credentials</p>
              <p className="text-md text-amber-600 mt-0.5">These will be used by the faculty to access the portal. Share securely.</p>
            </div>
          </div>
          <FormInput label="Institution Code" name="institute_code" value={form.institute_code} onChange={handleChange} error={errors.institute_code} placeholder="INST-2024-001" required disabled={loading} hint="Unique code assigned by the institution"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput label="Password" name="password" value={form.password} onChange={handleChange} error={errors.password} show={showPass} onToggle={() => setShowPass(v => !v)} placeholder="Min. 8 characters" required disabled={loading} hint="Use letters, numbers & symbols"/>
            <PasswordInput label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} show={showConfPass} onToggle={() => setShowConfPass(v => !v)} placeholder="Re-enter password" required disabled={loading}/>
          </div>
          {form.password && form.password.length >= 8 && (
            <div className="flex gap-2 items-center">
              <div className="flex gap-1 flex-1">
                {[...Array(4)].map((_, i) => {
                  const strength =
                    (form.password.length >= 12 ? 1 : 0) +
                    (/[A-Z]/.test(form.password) ? 1 : 0) +
                    (/[0-9]/.test(form.password) ? 1 : 0) +
                    (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0);
                  return <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < strength
                      ? strength <= 1 ? "bg-red-700" : strength <= 2 ? "bg-amber-400" : strength <= 3 ? "bg-blue-400" : "bg-emerald-500"
                      : "bg-slate-200"
                  }`}/>;
                })}
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {(() => {
                  const s = (form.password.length >= 12 ? 1 : 0) + (/[A-Z]/.test(form.password) ? 1 : 0) + (/[0-9]/.test(form.password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0);
                  return s <= 1 ? "Weak" : s <= 2 ? "Fair" : s <= 3 ? "Good" : "Strong";
                })()}
              </span>
            </div>
          )}
        </div>
      );

      // ── 2: Legal Documents ────────────────────────────────────────────────
      case 2: return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex items-center gap-2.5">
              <span className="text-base">🪪</span>
              <span className="text-md font-black text-white">Aadhar Card</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Aadhar Number" name="aadhar_no" value={form.aadhar_no} onChange={handleChange} error={errors.aadhar_no} placeholder="XXXX XXXX XXXX" required disabled={loading} hint="12-digit Aadhar number"/>
              <FileUpload label="Aadhar Document" id="aadhar-file" file={form.aadhar_file} storedName={storedFiles.aadhar_file} onChange={(e) => handleFile(e, "aadhar_file")} error={errors.aadhar_file} required disabled={loading}/>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex items-center gap-2.5">
              <span className="text-base">💳</span>
              <span className="text-md font-black text-white">PAN Card</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="PAN Number" name="pan_no" value={form.pan_no} onChange={handleChange} error={errors.pan_no} placeholder="ABCDE1234F" required disabled={loading} hint="10-character PAN number"/>
              <FileUpload label="PAN Document" id="pan-file" file={form.pan_file} storedName={storedFiles.pan_file} onChange={(e) => handleFile(e, "pan_file")} error={errors.pan_file} required disabled={loading}/>
            </div>
          </div>
        </div>
      );

      // ── 3: Education ──────────────────────────────────────────────────────
      case 3: return (
        <div className="space-y-4">
          {errors.education_general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-md">
              <AlertCircle size={14}/> {errors.education_general}
            </div>
          )}
          <p className="text-md font-semibold text-slate-500 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            💡 Fill in the details for each qualification you hold. At least one certificate upload is required.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDU_LEVELS.map(({ key, label, emoji, hasBoard, hasDegree }) => {
              const edu = form.education[key];
              const stored = storedFiles.education?.[key];
              return (
                <div key={key} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{emoji}</span>
                      <span className="text-md font-black text-white">{label}</span>
                    </div>
                    {edu.file && (
                      <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">✓ Uploaded</span>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {hasDegree && (
                      <input type="text" value={edu.degree || ""} onChange={e => handleEduChange(key, "degree", e.target.value)}
                        placeholder="Degree name (e.g. B.Sc, B.Com)" disabled={loading}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"/>
                    )}
                    <input type="text" value={edu.board || edu.university || ""} onChange={e => handleEduChange(key, hasBoard ? "board" : "university", e.target.value)}
                      placeholder={hasBoard ? "Board (e.g. CBSE, ICSE)" : "University / Institute name"} disabled={loading}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"/>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={edu.marks || ""} onChange={e => handleEduChange(key, "marks", e.target.value)}
                        placeholder="Marks / CGPA" disabled={loading}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"/>
                      <input type="text" value={edu.year || ""} onChange={e => handleEduChange(key, "year", e.target.value)}
                        placeholder="Pass Year" disabled={loading}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-md font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"/>
                    </div>
                    {edu.file ? (
                      <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-emerald-600"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-md font-bold text-emerald-700 truncate">{edu.file.name}</p>
                          <p className="text-[10px] text-emerald-500">{(edu.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={() => removeEduFile(key)} className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
                          <Trash2 size={13} className="text-emerald-600"/>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-orange-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                        <input type="file" id={`edu-${key}`} accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleEduFile(e, key)} disabled={loading} className="hidden"/>
                        <label htmlFor={`edu-${key}`} className="flex items-center justify-center gap-2 py-3 px-4 cursor-pointer">
                          <Upload size={14} className="text-red-500"/>
                          <span className="text-md font-semibold text-red-500">
                            {stored ? `⚠ Re-upload: ${stored.substring(0, 20)}` : "Upload Certificate"}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

      // ── 4: Bank Info ──────────────────────────────────────────────────────
      case 4: return (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-400 flex gap-3">
            <Landmark size={18} className="text-emerald-400 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-md font-bold text-emerald-400">Bank Account Details</p>
              <p className="text-md text-emerald-400 mt-0.5">Used for salary disbursement. Ensure all details are accurate.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} error={errors.bank_name} placeholder="State Bank of India" required disabled={loading}/>
            <FormInput label="Account Holder Name" name="account_holder_name" value={form.account_holder_name} onChange={handleChange} error={errors.account_holder_name} placeholder="Full name as per bank records" required disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} error={errors.account_number} placeholder="123456789012" required disabled={loading}/>
            <FormInput label="Confirm Account Number" name="confirm_account_number" value={form.confirm_account_number} onChange={handleChange} error={errors.confirm_account_number} placeholder="Re-enter account number" required disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Branch Name" name="branch_name" value={form.branch_name} onChange={handleChange} placeholder="e.g. MG Road Branch" disabled={loading}/>
            <FormInput label="IFSC Code" name="ifsc_code" value={form.ifsc_code} onChange={handleChange} error={errors.ifsc_code} placeholder="SBIN0001234" required disabled={loading} hint="11-character alphanumeric code"/>
          </div>
        </div>
      );

      // ── 5: Professional ───────────────────────────────────────────────────
      case 5: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectInput label="Department" name="department" value={form.department} onChange={handleChange} error={errors.department} required disabled={loading} options={DEPARTMENTS}/>
            <SelectInput label="Designation" name="designation" value={form.designation} onChange={handleChange} error={errors.designation} required disabled={loading} options={DESIGNATIONS}/>
            <FormInput label="Experience (Years)" name="experience" value={form.experience} onChange={handleChange} error={errors.experience} placeholder="e.g. 5" required disabled={loading}/>
          </div>
          {/* Review summary */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 px-5 py-3 flex items-center gap-2">
              <CheckCircle size={15} className="text-emerald-400"/>
              <span className="text-md font-black text-white">Registration Summary</span>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Name",       value: `${form.first_name} ${form.last_name}` },
                { label: "Email",      value: form.email },
                { label: "Phone",      value: form.phone },
                { label: "Inst. Code", value: form.institute_code },
                { label: "Aadhar",     value: form.aadhar_no ? "✓ Provided" : "—" },
                { label: "PAN",        value: form.pan_no    ? "✓ Provided" : "—" },
                { label: "Bank",       value: form.bank_name || "—" },
                { label: "Account",    value: form.account_number ? `••••${form.account_number.slice(-4)}` : "—" },
                { label: "Certs",      value: `${Object.values(form.education).filter(e => e.file).length} / 6 uploaded` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-md font-semibold text-slate-700 truncate mt-0.5">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className={`${col.bg} px-6 py-4 flex justify-between items-center flex-shrink-0`}>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Faculty Registration</h2>
            <p className="text-white/70 text-md mt-0.5">Step {step + 1} of {STEPS.length} · {STEPS[step].label}</p>
          </div>
          <div className="flex items-center gap-2">
            {hasDraft && (
              <button onClick={clearDraft} type="button"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-3 py-1.5 text-md font-bold transition flex items-center gap-1">
                <RotateCcw size={13}/> Clear
              </button>
            )}
            <button onClick={handleClose} type="button"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-2 transition">
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* ── Step indicator ──────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex-shrink-0">
          <StepIndicator steps={STEPS} current={step} completed={completed}/>
        </div>

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {errCount > 0 && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 flex-shrink-0">
            <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0"/>
            <div>
              <p className="text-md font-bold text-red-700">Please fix {errCount} error{errCount > 1 ? "s" : ""} before continuing</p>
              <p className="text-md text-red-600 mt-0.5">{Object.values(errors).join(" · ")}</p>
            </div>
          </div>
        )}

        {/* ── Draft notice ──────────────────────────────────────────────────── */}
        {hasDraft && errCount === 0 && step === 0 && (
          <div className="mx-5 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-2 flex-shrink-0">
            <span className="text-blue-500">💾</span>
            <p className="text-md font-semibold text-blue-700">Draft restored — file uploads need to be re-selected</p>
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div ref={scrollRef} className="overflow-y-auto flex-1 p-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`${col.bg} px-5 py-3 flex items-center gap-2.5`}>
              {React.createElement(STEPS[step].icon, { size: 15, className: "text-white" })}
              <span className="text-md font-black text-white">{STEPS[step].label} Details</span>
            </div>
            <div className="p-5">{renderStep()}</div>
          </div>
        </div>

        {/* ── Footer nav ───────────────────────────────────────────────────── */}
        <div className="border-t border-slate-200 bg-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
          <button onClick={goBack} disabled={step === 0 || loading} type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-blue-600 text-md font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft size={16}/> Back
          </button>

          <div className="flex-1 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300
                ${i === step ? `w-5 ${col.bg}` : completed.includes(i) ? "w-2.5 bg-slate-400" : "w-2.5 bg-slate-200"}`}/>
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button onClick={goNext} disabled={loading} type="button"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-md font-bold transition shadow-lg disabled:opacity-60 ${col.bg} hover:opacity-90`}>
              Next <ChevronRight size={16}/>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading || submitted} type="button"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-md font-bold hover:bg-blue-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-60">
              {loading
                ? <><Loader size={15} className="animate-spin"/> Registering...</>
                : <><Save size={15}/> Register Faculty</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;


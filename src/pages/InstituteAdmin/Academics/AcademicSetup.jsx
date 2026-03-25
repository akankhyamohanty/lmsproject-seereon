import React, { useEffect, useState } from "react";
import {
  Plus, Trash2, BookOpen, Building2, FileText,
  CheckCircle, Save, Upload, X, ChevronDown, ChevronUp,
  GripVertical, BookMarked, Hash, Clock, Paperclip
} from "lucide-react";

export default function AcademicSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    department: null,
    course: null,
    syllabus: null
  });

  const [departments, setDepartments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("departments")) || [
      { id: 1, name: "Computer Science", code: "CSE", head: "Dr. Sarah John" },
      { id: 2, name: "Electronics & Comm.", code: "ECE", head: "Prof. Amit Sharma" },
    ]; } catch { return []; }
  });

  const [courses, setCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("courses")) || [
      { id: 1, name: "B.Tech Computer Science", code: "BT-CSE", duration: "4 Years", type: "UG", deptId: 1 },
      { id: 2, name: "M.Tech Data Science", code: "MT-DS", duration: "2 Years", type: "PG", deptId: 1 },
    ]; } catch { return []; }
  });

  const [syllabi, setSyllabi] = useState(() => {
    try { return JSON.parse(localStorage.getItem("syllabi")) || [
      { id: 1, name: "Syllabus 2024", courseId: 1, semester: 1, subjects: ["DSA", "DBMS", "Web Dev"] },
    ]; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("departments", JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem("courses", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("syllabi", JSON.stringify(syllabi)); }, [syllabi]);

  const handleStepSubmit = (data) => {
    setSetupData(prev => ({ ...prev, ...data }));
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleFinalSubmit = () => {
    if (setupData.department && setupData.department.name) {
      setDepartments(prev => [...prev, { id: Date.now(), ...setupData.department }]);
    }
    if (setupData.course && setupData.course.name) {
      setCourses(prev => [...prev, { id: Date.now(), ...setupData.course }]);
    }
    if (setupData.syllabus && setupData.syllabus.name) {
      setSyllabi(prev => [...prev, { id: Date.now(), ...setupData.syllabus }]);
    }
    setCurrentStep(1);
    setSetupData({ department: null, course: null, syllabus: null });
    alert("✅ Academic Structure Added Successfully!");
  };

  const handleDelete = (type, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      if (type === 'dept') setDepartments(prev => prev.filter(i => i.id !== id));
      if (type === 'course') setCourses(prev => prev.filter(i => i.id !== id));
      if (type === 'syllabus') setSyllabi(prev => prev.filter(i => i.id !== id));
    }
  };

  // Build the "live" department list: saved ones + the pending one from Step 1 (if not yet saved)
  const pendingDeptId = "pending-new";
  const allDepartmentsForCourse = [
    ...departments,
    ...(setupData.department?.name
      ? [{ id: pendingDeptId, name: setupData.department.name, code: setupData.department.code }]
      : [])
  ];

  // Build the "live" course list: saved ones + the pending one from Step 2
  const pendingCourseId = "pending-new";
  const allCoursesForSyllabus = [
    ...courses,
    ...(setupData.course?.name
      ? [{ id: pendingCourseId, name: setupData.course.name, code: setupData.course.code }]
      : [])
  ];

  return (
    <div className="w-full font-sans text-left relative">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Academic Configuration</h1>
        <p className="text-md font-bold text-slate-400 uppercase tracking-widest mt-1">
          Add Department → Course → Syllabus → Submit
        </p>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="mb-12">
        {currentStep === 1 && (
          <StepDepartment onSubmit={handleStepSubmit} />
        )}
        {currentStep === 2 && (
          <StepCourse
            onSubmit={handleStepSubmit}
            departments={allDepartmentsForCourse}
            // Auto-select the just-created department
            defaultDeptId={setupData.department?.name ? pendingDeptId : ""}
            pendingDeptId={pendingDeptId}
            newDeptName={setupData.department?.name}
          />
        )}
        {currentStep === 3 && (
          <StepSyllabus
            onSubmit={handleStepSubmit}
            courses={allCoursesForSyllabus}
            // Auto-select the just-created course
            defaultCourseId={setupData.course?.name ? pendingCourseId : ""}
            pendingCourseId={pendingCourseId}
            newCourseName={setupData.course?.name}
          />
        )}
        {currentStep === 4 && (
          <ReviewAndSubmit
            setupData={setupData}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(3)}
            departments={allDepartmentsForCourse}
            courses={allCoursesForSyllabus}
            pendingDeptId={pendingDeptId}
            pendingCourseId={pendingCourseId}
          />
        )}
      </div>

      <div className="space-y-8">
        <SummaryTable title="Departments" icon={Building2} data={departments} onDelete={(id) => handleDelete('dept', id)} type="dept" />
        <SummaryTable title="Courses" icon={BookOpen} data={courses} onDelete={(id) => handleDelete('course', id)} type="course" departments={departments} />
        <SummaryTable title="Syllabi" icon={FileText} data={syllabi} onDelete={(id) => handleDelete('syllabus', id)} type="syllabus" courses={courses} />
      </div>
    </div>
  );
}

// ============================================================================
// STEP INDICATOR
// ============================================================================
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Department", icon: "🏢" },
    { number: 2, title: "Course", icon: "📚" },
    { number: 3, title: "Syllabus", icon: "📄" },
    { number: 4, title: "Review", icon: "✓" }
  ];

  return (
    <div className="mb-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
              currentStep >= step.number
                ? "bg-[#0F53D5] text-white shadow-lg shadow-blue-200"
                : "bg-slate-100 text-slate-400"
            }`}>
              {step.icon}
            </div>
            <div className="ml-3">
              <p className={`text-[10px] font-black uppercase tracking-wider ${currentStep >= step.number ? "text-[#0F53D5]" : "text-slate-400"}`}>
                Step {step.number}
              </p>
              <p className={`text-md font-bold ${currentStep >= step.number ? "text-slate-900" : "text-slate-500"}`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep > step.number ? "bg-[#0F53D5]" : "bg-slate-200"}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// STEP 1: DEPARTMENT
// ============================================================================
const StepDepartment = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", code: "", head: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.code.trim()) newErrors.code = "Department code is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSubmit({ department: formData });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-[#0F53D5] rounded-lg"><Building2 size={24} /></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 1: Add Department</h2>
          <p className="text-md text-slate-500 font-bold">Create a new academic department</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Department Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="e.g. Computer Science"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.name ? "border-red-500" : "border-slate-200"}`}
            />
            {errors.name && <p className="text-md text-red-600 font-bold">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Department Code *</label>
            <input type="text" name="code" value={formData.code} onChange={handleChange}
              placeholder="e.g. CSE"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.code ? "border-red-500" : "border-slate-200"}`}
            />
            {errors.code && <p className="text-md text-red-600 font-bold">{errors.code}</p>}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Head of Department</label>
          <input type="text" name="head" value={formData.head} onChange={handleChange}
            placeholder="e.g. Dr. Sarah John"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit"
            className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <Plus size={18} /> Add Department & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 2: COURSE  (auto-links to the department just created)
// ============================================================================
const StepCourse = ({ onSubmit, departments, defaultDeptId, pendingDeptId, newDeptName }) => {
  const [formData, setFormData] = useState({
    name: "", code: "", type: "UG", duration: "",
    // Pre-select the department that was just created in Step 1
    deptId: defaultDeptId || ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (!formData.deptId) newErrors.deptId = "Department selection is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSubmit({ course: formData });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><BookOpen size={24} /></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 2: Add Course</h2>
          <p className="text-md text-slate-500 font-bold">Create a new course under a department</p>
        </div>
      </div>

      {/* Smart hint: show which department is auto-selected */}
      {newDeptName && formData.deptId === pendingDeptId && (
        <div className="mb-5 flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3">
          <span className="text-lg">🔗</span>
          <p className="text-md font-bold">
            Auto-linked to <span className="text-[#0F53D5]">"{newDeptName}"</span> — the department you just created.
            You can change it below if needed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Department *</label>
          <select name="deptId" value={formData.deptId} onChange={handleChange}
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.deptId ? "border-red-500" : "border-slate-200"}`}>
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.code}){dept.id === pendingDeptId ? " — just added ✨" : ""}
              </option>
            ))}
          </select>
          {errors.deptId && <p className="text-md text-red-600 font-bold">{errors.deptId}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Course Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.name ? "border-red-500" : "border-slate-200"}`}
            />
            {errors.name && <p className="text-md text-red-600 font-bold">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Course Code *</label>
            <input type="text" name="code" value={formData.code} onChange={handleChange}
              placeholder="e.g. BT-CSE"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.code ? "border-red-500" : "border-slate-200"}`}
            />
            {errors.code && <p className="text-md text-red-600 font-bold">{errors.code}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Type</label>
            <select name="type" value={formData.type} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all">
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Duration</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange}
              placeholder="e.g. 4 Years"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit"
            className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <Plus size={18} /> Add Course & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 3: SYLLABUS — Rich Subject Builder
// ============================================================================

const EMPTY_SUBJECT = () => ({
  id: Date.now() + Math.random(),
  name: "",
  code: "",
  credits: "",
  topics: [""],
  files: [],        // { name, size, type, dataUrl }
  expanded: true,
});

const StepSyllabus = ({ onSubmit, courses, defaultCourseId, pendingCourseId, newCourseName }) => {
  const [meta, setMeta] = useState({
    name: "",
    semester: "1",
    courseId: defaultCourseId || "",
  });
  const [subjects, setSubjects] = useState([EMPTY_SUBJECT()]);
  const [errors, setErrors] = useState({});

  const handleMetaChange = (e) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── Subject field changes ──────────────────────────────────────────────────
  const updateSubject = (id, field, value) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    if (errors[`subj_${id}_${field}`]) setErrors(prev => { const e = {...prev}; delete e[`subj_${id}_${field}`]; return e; });
  };

  const addSubject = () => setSubjects(prev => [...prev, EMPTY_SUBJECT()]);

  const removeSubject = (id) => setSubjects(prev => prev.filter(s => s.id !== id));

  const toggleExpand = (id) => setSubjects(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));

  // ── Topics per subject ─────────────────────────────────────────────────────
  const addTopic = (subjId) =>
    setSubjects(prev => prev.map(s => s.id === subjId ? { ...s, topics: [...s.topics, ""] } : s));

  const updateTopic = (subjId, idx, val) =>
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      const t = [...s.topics]; t[idx] = val; return { ...s, topics: t };
    }));

  const removeTopic = (subjId, idx) =>
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      const t = s.topics.filter((_, i) => i !== idx);
      return { ...s, topics: t.length ? t : [""] };
    }));

  // ── File upload per subject ────────────────────────────────────────────────
  const handleFileChange = (subjId, e) => {
    const incoming = Array.from(e.target.files);
    incoming.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const fileObj = { name: file.name, size: file.size, type: file.type, dataUrl: ev.target.result };
        setSubjects(prev => prev.map(s =>
          s.id === subjId ? { ...s, files: [...s.files, fileObj] } : s
        ));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeFile = (subjId, fileName) =>
    setSubjects(prev => prev.map(s =>
      s.id === subjId ? { ...s, files: s.files.filter(f => f.name !== fileName) } : s
    ));

  // ── Validation & submit ────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!meta.name.trim()) newErrors.name = "Syllabus name is required";
    if (!meta.courseId) newErrors.courseId = "Course selection is required";
    subjects.forEach(s => {
      if (!s.name.trim()) newErrors[`subj_${s.id}_name`] = "Subject name required";
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const cleanSubjects = subjects.map(s => ({
      name: s.name,
      code: s.code,
      credits: s.credits,
      topics: s.topics.filter(t => t.trim()),
      files: s.files,
    }));
    onSubmit({ syllabus: { ...meta, subjects: cleanSubjects } });
  };

  const formatBytes = (bytes) => bytes < 1024 ? `${bytes}B` : bytes < 1048576 ? `${(bytes/1024).toFixed(1)}KB` : `${(bytes/1048576).toFixed(1)}MB`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 text-blue-600 rounded-lg"><FileText size={24} /></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 3: Add Syllabus</h2>
          <p className="text-md text-slate-500 font-bold">Build subjects with topics & document uploads</p>
        </div>
      </div>

      {/* Auto-link hint */}
      {newCourseName && meta.courseId === pendingCourseId && (
        <div className="mb-5 flex items-center gap-2 bg-purple-50 border border-purple-200 text-blue-600 rounded-xl px-4 py-3">
          <span className="text-lg">🔗</span>
          <p className="text-md font-bold">
            Auto-linked to <span className="text-blue-600">"{newCourseName}"</span> — the course you just created.
            You can change it below if needed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Syllabus Meta ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Syllabus Name *</label>
            <input type="text" name="name" value={meta.name} onChange={handleMetaChange}
              placeholder="e.g. Syllabus 2024-25"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.name ? "border-red-500" : "border-slate-200"}`}
            />
            {errors.name && <p className="text-md text-red-600 font-bold">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Semester</label>
            <input type="number" name="semester" value={meta.semester} onChange={handleMetaChange}
              min="1" max="8"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Course *</label>
          <select name="courseId" value={meta.courseId} onChange={handleMetaChange}
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${errors.courseId ? "border-red-500" : "border-slate-200"}`}>
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code}){course.id === pendingCourseId ? " — just added ✨" : ""}
              </option>
            ))}
          </select>
          {errors.courseId && <p className="text-md text-red-600 font-bold">{errors.courseId}</p>}
        </div>

        {/* ── Subject Cards ── */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
              Subjects ({subjects.length})
            </label>
            <button type="button" onClick={addSubject}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 transition-colors">
              <Plus size={14} /> Add Subject
            </button>
          </div>

          <div className="space-y-4 mt-3">
            {subjects.map((subj, idx) => (
              <div key={subj.id}
                className={`border-2 rounded-2xl overflow-hidden transition-all ${errors[`subj_${subj.id}_name`] ? "border-red-300" : "border-slate-200 hover:border-purple-300"}`}>

                {/* Subject Card Header */}
                <div className={`flex items-center gap-3 px-5 py-4 cursor-pointer select-none ${subj.expanded ? "bg-purple-50" : "bg-slate-50"}`}
                  onClick={() => toggleExpand(subj.id)}>
                  <div className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-lg text-[11px] font-black flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 truncate">
                      {subj.name || <span className="text-slate-400 font-bold italic">Untitled Subject</span>}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {[subj.code && `Code: ${subj.code}`, subj.credits && `${subj.credits} Credits`, `${subj.topics.filter(t=>t.trim()).length} topics`, `${subj.files.length} file(s)`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {subjects.length > 1 && (
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); removeSubject(subj.id); }}
                        className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                    {subj.expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Subject Card Body */}
                {subj.expanded && (
                  <div className="px-5 py-5 space-y-5 bg-white">

                    {/* Name + Code + Credits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 md:col-span-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <BookMarked size={10} /> Subject Name *
                        </label>
                        <input type="text" value={subj.name}
                          onChange={(e) => updateSubject(subj.id, "name", e.target.value)}
                          placeholder="e.g. Data Structures"
                          className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all ${errors[`subj_${subj.id}_name`] ? "border-red-400" : "border-slate-200"}`}
                        />
                        {errors[`subj_${subj.id}_name`] && <p className="text-md text-red-600 font-bold">{errors[`subj_${subj.id}_name`]}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Hash size={10} /> Subject Code
                        </label>
                        <input type="text" value={subj.code}
                          onChange={(e) => updateSubject(subj.id, "code", e.target.value)}
                          placeholder="e.g. CS301"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Clock size={10} /> Credit Hours
                        </label>
                        <input type="number" value={subj.credits}
                          onChange={(e) => updateSubject(subj.id, "credits", e.target.value)}
                          placeholder="e.g. 4"
                          min="1" max="10"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Topics / Chapters</label>
                        <button type="button" onClick={() => addTopic(subj.id)}
                          className="text-[10px] font-black text-purple-600 hover:text-purple-800 flex items-center gap-1 uppercase tracking-wider">
                          <Plus size={11} /> Add Topic
                        </button>
                      </div>
                      <div className="space-y-2">
                        {subj.topics.map((topic, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 w-5 text-right flex-shrink-0">{tIdx + 1}.</span>
                            <input type="text" value={topic}
                              onChange={(e) => updateTopic(subj.id, tIdx, e.target.value)}
                              placeholder={`Topic ${tIdx + 1}...`}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-md font-bold text-slate-700 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 transition-all"
                            />
                            {subj.topics.length > 1 && (
                              <button type="button" onClick={() => removeTopic(subj.id, tIdx)}
                                className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors flex-shrink-0">
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Paperclip size={10} /> Document Uploads (PDF, DOC, DOCX)
                      </label>

                      {/* Drop zone */}
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:border-purple-400 hover:bg-purple-50 transition-all group">
                        <Upload size={20} className="text-slate-400 group-hover:text-purple-500 mb-1 transition-colors" />
                        <span className="text-[11px] font-black text-slate-500 group-hover:text-purple-600 uppercase tracking-wider transition-colors">Click to upload or drag & drop</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5">PDF, DOC, DOCX — multiple files allowed</span>
                        <input type="file" multiple accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="hidden" onChange={(e) => handleFileChange(subj.id, e)} />
                      </label>

                      {/* Uploaded files list */}
                      {subj.files.length > 0 && (
                        <div className="space-y-2">
                          {subj.files.map((file, fIdx) => {
                            const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
                            return (
                              <div key={fIdx} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 group">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black flex-shrink-0 ${isPdf ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                  {isPdf ? "PDF" : "DOC"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-md font-bold text-slate-700 truncate">{file.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{formatBytes(file.size)}</p>
                                </div>
                                <button type="button" onClick={() => removeFile(subj.id, file.name)}
                                  className="p-1.5 hover:bg-red-100 text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                  <X size={13} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit"
            className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <Plus size={18} /> Add Syllabus & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 4: REVIEW & SUBMIT
// ============================================================================
const ReviewAndSubmit = ({ setupData, onSubmit, onBack, departments, courses, pendingDeptId, pendingCourseId }) => {
  const getDepartmentName = (deptId) =>
    departments.find(d => String(d.id) === String(deptId))?.name || "Unknown";

  const getCourseName = (courseId) =>
    courses.find(c => String(c.id) === String(courseId))?.name || "Unknown";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><CheckCircle size={24} /></div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 4: Review & Submit</h2>
          <p className="text-md text-slate-500 font-bold">Verify your academic setup before submitting</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Department */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-black text-blue-900 mb-3">🏢 Department Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase">Name</p>
              <p className="text-md font-bold text-blue-900">{setupData.department?.name || "Not Added"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase">Code</p>
              <p className="text-md font-bold text-blue-900">{setupData.department?.code || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] font-black text-blue-600 uppercase">Head</p>
              <p className="text-md font-bold text-blue-900">{setupData.department?.head || "—"}</p>
            </div>
          </div>
        </div>

        {/* Course */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
          <h3 className="text-lg font-black text-emerald-900 mb-3">📚 Course Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase">Department</p>
              <p className="text-md font-bold text-emerald-900">{getDepartmentName(setupData.course?.deptId)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase">Name</p>
              <p className="text-md font-bold text-emerald-900">{setupData.course?.name || "Not Added"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase">Code</p>
              <p className="text-md font-bold text-emerald-900">{setupData.course?.code || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase">Type</p>
              <p className="text-md font-bold text-emerald-900">{setupData.course?.type || "—"}</p>
            </div>
          </div>
        </div>

        {/* Syllabus */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <h3 className="text-lg font-black text-purple-900 mb-4">📄 Syllabus Details</h3>
          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase">Course</p>
                <p className="text-md font-bold text-purple-900">{getCourseName(setupData.syllabus?.courseId)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase">Syllabus Name</p>
                <p className="text-md font-bold text-purple-900">{setupData.syllabus?.name || "Not Added"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase">Semester</p>
                <p className="text-md font-bold text-purple-900">Semester {setupData.syllabus?.semester || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase">Total Subjects</p>
                <p className="text-md font-bold text-purple-900">{setupData.syllabus?.subjects?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Subject breakdown */}
          {setupData.syllabus?.subjects?.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Subject Breakdown</p>
              {setupData.syllabus.subjects.map((subj, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-purple-200 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white rounded-md text-[10px] font-black flex-shrink-0">{idx+1}</span>
                      <div>
                        <p className="font-black text-slate-800">{subj.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {[subj.code, subj.credits && `${subj.credits} credits`].filter(Boolean).join(" · ") || "No code/credits set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {subj.topics?.filter(t=>t).length > 0 && (
                        <span className="bg-purple-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black">{subj.topics.filter(t=>t).length} topics</span>
                      )}
                      {subj.files?.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black">{subj.files.length} file(s)</span>
                      )}
                    </div>
                  </div>
                  {subj.topics?.filter(t=>t).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {subj.topics.filter(t=>t).map((t, ti) => (
                        <span key={ti} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">• {t}</span>
                      ))}
                    </div>
                  )}
                  {subj.files?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {subj.files.map((f, fi) => {
                        const isPdf = f.type === "application/pdf" || f.name.endsWith(".pdf");
                        return (
                          <span key={fi} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${isPdf ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                            📎 {f.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-8 mt-8 border-t border-slate-200">
        <button onClick={onBack}
          className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold text-md uppercase tracking-widest hover:bg-slate-50 transition-colors">
          ← Back
        </button>
        <button onClick={onSubmit}
          className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
          <Save size={18} /> Submit All
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SUMMARY TABLES
// ============================================================================
const SummaryTable = ({ title, icon: Icon, data, onDelete, type, departments, courses }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <Icon className="text-slate-600" size={20} />
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <span className="ml-2 bg-blue-100 text-[#0F53D5] px-3 py-1 rounded-full text-md font-bold">{data.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-md font-bold">
                  No {title.toLowerCase()} added yet
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  {type === 'dept' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                      <td className="px-6 py-4"><span className="bg-slate-100 px-3 py-1 rounded text-[11px] font-black text-slate-700">{item.code}</span></td>
                      <td className="px-6 py-4 text-slate-600 text-md">{item.head || "—"}</td>
                    </>
                  )}
                  {type === 'course' && (
                    <>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.code}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{departments?.find(d => d.id === item.deptId)?.name || "—"}</td>
                      <td className="px-6 py-4"><span className="bg-blue-50 text-[#0F53D5] px-2 py-1 rounded text-[11px] font-bold">{item.type}</span></td>
                      <td className="px-6 py-4 text-slate-600 text-md font-bold">{item.duration}</td>
                    </>
                  )}
                  {type === 'syllabus' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                      <td className="px-6 py-4 text-slate-600">{courses?.find(c => c.id === item.courseId)?.name || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">Sem {item.semester}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.subjects?.slice(0, 2).map((s, i) => {
                            const label = typeof s === "object" ? s.name : s;
                            return <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold">{label}</span>;
                          })}
                          {item.subjects?.length > 2 && (
                            <span className="text-slate-600 text-[10px] font-bold">+{item.subjects.length - 2} more</span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDelete(item.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
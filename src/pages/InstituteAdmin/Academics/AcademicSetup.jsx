// import React, { useState } from 'react';
// import { Plus, Edit, Trash2 } from 'lucide-react';

// export const AcademicSetup = () => {
//   const [activeTab, setActiveTab] = useState('courses');

//   // 1. Mock Data for COURSES Tab
//   const courses = [
//     { id: 1, name: "B.Tech CS", type: "Undergraduate", duration: "4 Years", pattern: "Semester" },
//     { id: 2, name: "B.Tech CS", type: "Undergraduate", duration: "4 Years", pattern: "Semester" },
//     { id: 3, name: "B.Tech CS", type: "Undergraduate", duration: "4 Years", pattern: "Semester" },
//   ];

//   // 2. Mock Data for CLASSES Tab (New Screenshot Data)
//   const classes = [
//     { id: 1, name: "B.Tech CS", year: "2024-25", section: "CSE-A", teacher: "Dr. Sarah Johnson" },
//     { id: 2, name: "B.Tech CS", year: "2024-25", section: "CSE-A", teacher: "Dr. Sarah Johnson" },
//     { id: 3, name: "B.Tech CS", year: "2024-25", section: "CSE-A", teacher: "Dr. Sarah Johnson" },
//   ];

//   return (
//     <div className="font-sans text-left w-full text-gray-900">
      
//       {/* HEADER SECTION */}
//       {/* <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">Hi, Subham</h2>
//         <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
//       </div> */}

//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Academic Setup</h1>
//         <p className="text-sm text-gray-500 mt-1">Manage courses, classes, and academic structure</p>
//       </div>

//       {/* TABS SWITCHER */}
//       <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-6">
//         <button 
//           onClick={() => setActiveTab('courses')}
//           className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
//             activeTab === 'courses' 
//               ? "bg-blue-600 text-white shadow-md" 
//               : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
//           }`}
//         >
//           Courses
//         </button>
//         <button 
//           onClick={() => setActiveTab('classes')}
//           className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
//             activeTab === 'classes' 
//               ? "bg-blue-600 text-white shadow-md" 
//               : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
//           }`}
//         >
//           Classes / Sections
//         </button>
//       </div>

//       {/* DYNAMIC ADD BUTTON */}
//       <div className="flex justify-end mb-6">
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
//           <Plus size={18} />
//           {activeTab === 'courses' ? "Add Course" : "Add Class / Section"}
//         </button>
//       </div>

//       {/* DYNAMIC TABLE CARD */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-100 bg-white">
//                 {activeTab === 'courses' ? (
//                   // Courses Header
//                   <>
//                     <th className="p-5 text-sm font-bold text-gray-900">Course Name</th>
//                     <th className="p-5 text-sm font-bold text-gray-900">Course Type</th>
//                     <th className="p-5 text-sm font-bold text-gray-900">Duration</th>
//                     <th className="p-5 text-sm font-bold text-gray-900">Academic Pattern</th>
//                   </>
//                 ) : (
//                   // Classes Header
//                   <>
//                     <th className="p-5 text-sm font-bold text-gray-900">Course Name</th>
//                     <th className="p-5 text-sm font-bold text-gray-900">Academic Year</th>
//                     <th className="p-5 text-sm font-bold text-gray-900">Section Name</th>
//                     <th className="p-5 text-sm font-bold text-gray-900">Class Teacher</th>
//                   </>
//                 )}
//                 <th className="p-5 text-sm font-bold text-gray-900 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {activeTab === 'courses' ? (
//                 // Courses Rows
//                 courses.map((course) => (
//                   <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                     <td className="p-5 text-sm font-medium text-gray-900">{course.name}</td>
//                     <td className="p-5 text-sm text-gray-500 font-medium">{course.type}</td>
//                     <td className="p-5 text-sm text-gray-900 font-bold">{course.duration}</td>
//                     <td className="p-5 text-sm text-gray-900 font-bold">{course.pattern}</td>
//                     <td className="p-5 text-center">
//                       <div className="flex items-center justify-center gap-3">
//                         <button className="text-gray-900 hover:text-blue-600"><Edit size={18} /></button>
//                         <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 // Classes Rows (New Data)
//                 classes.map((cls) => (
//                   <tr key={cls.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                     <td className="p-5 text-sm font-medium text-gray-900">{cls.name}</td>
//                     <td className="p-5 text-sm text-gray-500 font-medium">{cls.year}</td>
//                     <td className="p-5 text-sm text-gray-900 font-bold">{cls.section}</td>
//                     <td className="p-5 text-sm text-gray-900 font-medium">{cls.teacher}</td>
//                     <td className="p-5 text-center">
//                       <div className="flex items-center justify-center gap-3">
//                         <button className="text-gray-900 hover:text-blue-600"><Edit size={18} /></button>
//                         <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AcademicSetup;

import React, { useEffect, useState } from "react";
import {
  Plus, Trash2, BookOpen, Building2, FileText, ChevronRight, X, Save, Search, Filter,
  CheckCircle, Circle
} from "lucide-react";

export default function AcademicSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    department: null,
    course: null,
    syllabus: null
  });

  // --- DATA STATE ---
  const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem("departments")) || [
    { id: 1, name: "Computer Science", code: "CSE", head: "Dr. Sarah John" },
    { id: 2, name: "Electronics & Comm.", code: "ECE", head: "Prof. Amit Sharma" },
  ]);

  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("courses")) || [
    { id: 1, name: "B.Tech Computer Science", code: "BT-CSE", duration: "4 Years", type: "UG", deptId: 1 },
    { id: 2, name: "M.Tech Data Science", code: "MT-DS", duration: "2 Years", type: "PG", deptId: 1 },
  ]);

  const [syllabi, setSyllabi] = useState(() => JSON.parse(localStorage.getItem("syllabi")) || [
    { id: 1, name: "Syllabus 2024", courseId: 1, semester: 1, subjects: ["DSA", "DBMS", "Web Dev"] },
  ]);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem("departments", JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem("courses", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("syllabi", JSON.stringify(syllabi)); }, [syllabi]);

  // --- STEP HANDLERS ---
  const handleStepSubmit = (data) => {
    setSetupData(prev => ({ ...prev, ...data }));
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinalSubmit = () => {
    if (setupData.department && Object.keys(setupData.department).length > 0) {
      setDepartments([...departments, { id: Date.now(), ...setupData.department }]);
    }
    if (setupData.course && Object.keys(setupData.course).length > 0) {
      setCourses([...courses, { id: Date.now(), ...setupData.course }]);
    }
    if (setupData.syllabus && Object.keys(setupData.syllabus).length > 0) {
      setSyllabi([...syllabi, { id: Date.now(), ...setupData.syllabus }]);
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

  return (
    <div className="w-full font-sans text-left relative">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Academic Configuration</h1>
        <p className="text-md font-bold text-slate-400 uppercase tracking-widest mt-1">Add Department → Course → Syllabus → Submit</p>
      </div>

      {/* STEP INDICATOR */}
      <StepIndicator currentStep={currentStep} />

      {/* STEP CONTENT */}
      <div className="mb-12">
        {currentStep === 1 && <StepDepartment onSubmit={handleStepSubmit} departments={departments} />}
        {currentStep === 2 && <StepCourse onSubmit={handleStepSubmit} courses={courses} departments={departments} />}
        {currentStep === 3 && <StepSyllabus onSubmit={handleStepSubmit} syllabi={syllabi} courses={courses} />}
        {currentStep === 4 && (
          <ReviewAndSubmit
            setupData={setupData}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(3)}
            departments={departments}
            courses={courses}
          />
        )}
      </div>

      {/* SUMMARY TABLES */}
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
const StepDepartment = ({ onSubmit, departments }) => {
  const [formData, setFormData] = useState({ name: "", code: "", head: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.code.trim()) newErrors.code = "Department code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ department: formData });
    setFormData({ name: "", code: "", head: "" });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-[#0F53D5] rounded-lg">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 1: Add Department</h2>
          <p className="text-md text-slate-500 font-bold">Create a new academic department</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Department Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
                errors.name ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.name && <p className="text-md text-red-600 font-bold">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Department Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CSE"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
                errors.code ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.code && <p className="text-md text-red-600 font-bold">{errors.code}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Head of Department</label>
          <input
            type="text"
            name="head"
            value={formData.head}
            onChange={handleChange}
            placeholder="e.g. Dr. Sarah John"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Department & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 2: COURSE
// ============================================================================
const StepCourse = ({ onSubmit, courses, departments }) => {
  const [formData, setFormData] = useState({ name: "", code: "", type: "UG", duration: "", deptId: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (!formData.deptId) newErrors.deptId = "Department selection is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ course: formData });
    setFormData({ name: "", code: "", type: "UG", duration: "", deptId: "" });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 2: Add Course</h2>
          <p className="text-md text-slate-500 font-bold">Create a new course under a department</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Select Department *</label>
          <select
            name="deptId"
            value={formData.deptId}
            onChange={handleChange}
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
              errors.deptId ? "border-red-500" : "border-slate-200"
            }`}
          >
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
            ))}
          </select>
          {errors.deptId && <p className="text-md text-red-600 font-bold">{errors.deptId}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Course Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
                errors.name ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.name && <p className="text-md text-red-600 font-bold">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Course Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. BT-CSE"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
                errors.code ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.code && <p className="text-md text-red-600 font-bold">{errors.code}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 4 Years"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Course & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 3: SYLLABUS
// ============================================================================
const StepSyllabus = ({ onSubmit, syllabi, courses }) => {
  const [formData, setFormData] = useState({ name: "", courseId: "", semester: "1", subjects: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Syllabus name is required";
    if (!formData.courseId) newErrors.courseId = "Course selection is required";
    if (!formData.subjects.trim()) newErrors.subjects = "At least one subject is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const subjectArray = formData.subjects.split(",").map(s => s.trim()).filter(s => s);
    onSubmit({ syllabus: { ...formData, subjects: subjectArray } });
    setFormData({ name: "", courseId: "", semester: "1", subjects: "" });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 3: Add Syllabus</h2>
          <p className="text-md text-slate-500 font-bold">Create syllabus for a course</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Select Course *</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
                errors.courseId ? "border-red-500" : "border-slate-200"
              }`}
            >
              <option value="">-- Select Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
              ))}
            </select>
            {errors.courseId && <p className="text-md text-red-600 font-bold">{errors.courseId}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Semester</label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              min="1"
              max="8"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Syllabus Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Syllabus 2024-25"
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
              errors.name ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.name && <p className="text-md text-red-600 font-bold">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Subjects *</label>
          <textarea
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            placeholder="Enter subjects separated by commas&#10;e.g. Data Structures, Database Management, Web Development"
            rows="4"
            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-md font-bold text-slate-700 outline-none focus:border-[#0F53D5] focus:ring-2 focus:ring-blue-200 transition-all ${
              errors.subjects ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.subjects && <p className="text-md text-red-600 font-bold">{errors.subjects}</p>}
          <p className="text-[10px] text-slate-500 font-bold mt-1">💡 Separate multiple subjects with commas</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
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
const ReviewAndSubmit = ({ setupData, onSubmit, onBack, departments, courses }) => {
  const getDepartmentName = (deptId) => {
    return departments.find(d => d.id === Number(deptId))?.name || "Unknown";
  };

  const getCourseName = (courseId) => {
    return courses.find(c => c.id === Number(courseId))?.name || "Unknown";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
          <CheckCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Step 4: Review & Submit</h2>
          <p className="text-md text-slate-500 font-bold">Verify your academic setup before submitting</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Department */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-black text-blue-900 mb-3">🏢 Department Details</h3>
          <div className="grid grid-cols-2 gap-4 text-md">
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
          <div className="grid grid-cols-2 gap-4 text-md">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase">Department</p>
              <p className="text-md font-bold text-emerald-900">{getDepartmentName(setupData.course?.deptId) || "—"}</p>
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
          <h3 className="text-lg font-black text-purple-900 mb-3">📄 Syllabus Details</h3>
          <div className="space-y-3 text-md">
            <div>
              <p className="text-[10px] font-black text-purple-600 uppercase">Course</p>
              <p className="text-md font-bold text-purple-900">{getCourseName(setupData.syllabus?.courseId) || "—"}</p>
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
              <p className="text-[10px] font-black text-purple-600 uppercase mb-2 block">Subjects</p>
              <div className="flex flex-wrap gap-2">
                {setupData.syllabus?.subjects?.map((subject, idx) => (
                  <span key={idx} className="bg-purple-600 text-white px-3 py-1 rounded-full text-[11px] font-black">
                    {subject}
                  </span>
                )) || <span className="text-slate-600">No subjects added</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-8 mt-8 border-t border-slate-200">
        <button
          onClick={onBack}
          className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold text-md uppercase tracking-widest hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter(item => {
    if (type === 'dept') return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (type === 'course') return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (type === 'syllabus') return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon className="text-slate-600" size={20} />
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <span className="ml-2 bg-blue-100 text-[#0F53D5] px-3 py-1 rounded-full text-md font-bold">{data.length}</span>
        </div>
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
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  {type === 'dept' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 px-3 py-1 rounded text-[11px] font-black text-slate-700">{item.code}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-md">{item.head || "—"}</td>
                    </>
                  )}
                  {type === 'course' && (
                    <>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.code}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{departments.find(d => d.id === item.deptId)?.name || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-[#0F53D5] px-2 py-1 rounded text-[11px] font-bold">{item.type}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-md font-bold">{item.duration}</td>
                    </>
                  )}
                  {type === 'syllabus' && (
                    <>
                      <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                      <td className="px-6 py-4 text-slate-600">{courses.find(c => c.id === item.courseId)?.name || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">Sem {item.semester}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.subjects?.slice(0, 2).map((s, i) => (
                            <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold">{s}</span>
                          ))}
                          {item.subjects?.length > 2 && (
                            <span className="text-slate-600 text-[10px] font-bold">+{item.subjects.length - 2} more</span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
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
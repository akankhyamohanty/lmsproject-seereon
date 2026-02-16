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
  Plus, Edit, Trash2, BookOpen, Layers, Users, Building2, Search, Filter, X, Save 
} from "lucide-react";

export default function AcademicSetup() {
  const [activeTab, setActiveTab] = useState("courses");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DATA STATE ---
  const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem("departments")) || [
    { id: 1, name: "Computer Science", code: "CSE", head: "Dr. Sarah John" },
    { id: 2, name: "Electronics & Comm.", code: "ECE", head: "Prof. Amit Sharma" },
  ]);

  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("courses")) || [
    { id: 1, name: "B.Tech Computer Science", code: "BT-CSE", duration: "4 Years", type: "UG" },
    { id: 2, name: "M.Tech Data Science", code: "MT-DS", duration: "2 Years", type: "PG" },
  ]);

  const [classes, setClasses] = useState(() => JSON.parse(localStorage.getItem("classes")) || [
    { id: 1, name: "CSE - Year 1", section: "A", teacher: "Priya Das", strength: 60 },
    { id: 2, name: "CSE - Year 1", section: "B", teacher: "Rahul Verma", strength: 58 },
  ]);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem("departments", JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem("courses", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("classes", JSON.stringify(classes)); }, [classes]);

  // --- ACTIONS ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      if (activeTab === 'departments') setDepartments(prev => prev.filter(i => i.id !== id));
      if (activeTab === 'courses') setCourses(prev => prev.filter(i => i.id !== id));
      if (activeTab === 'classes') setClasses(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSave = (formData) => {
    const newItem = { id: Date.now(), ...formData };
    
    if (activeTab === 'departments') setDepartments([...departments, newItem]);
    if (activeTab === 'courses') setCourses([...courses, newItem]);
    if (activeTab === 'classes') setClasses([...classes, newItem]);
    
    setIsModalOpen(false);
  };

  return (
    <div className="w-full font-sans text-left relative">
      
      {/* 1. HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Academic Configuration</h1>
          <p className="text-md font-bold text-slate-400 uppercase tracking-widest mt-1">Manage departments, courses & classes</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0F53D5] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-md uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus size={16} /> 
          {activeTab === 'departments' ? "Add Department" : activeTab === 'courses' ? "Add Course" : "Add Class"}
        </button>
      </div>

      {/* 2. TABS */}
      <div className="flex text-lg flex-col md:flex-row gap-6 mb-8 border-b border-slate-200 pb-1">
        {[
            { id: "courses", label: "Courses", icon: BookOpen },
            { id: "departments", label: "Departments", icon: Building2 },
            { id: "classes", label: "Classes & Sections", icon: Users }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 px-2 text-md font-bold transition-all relative ${
              activeTab === tab.id 
                ? "text-[#0F53D5]" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0F53D5] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* 3. TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
           </div>
           <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Filter size={18} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                {activeTab === 'departments' && (
                    <>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Department Name</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Code</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Head of Dept</th>
                    </>
                )}
                {activeTab === 'courses' && (
                    <>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Course Name</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Duration</th>
                    </>
                )}
                {activeTab === 'classes' && (
                    <>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Class Name</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Section</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Class Teacher</th>
                        <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest">Strength</th>
                    </>
                )}
                <th className="px-6 py-4 text-[15px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              
              {/* DEPARTMENTS ROW */}
              {activeTab === 'departments' && departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-700">{dept.name}</td>
                  <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-md font-bold font-mono">{dept.code}</span></td>
                  <td className="px-6 py-4 text-md text-slate-600">{dept.head}</td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons onDelete={() => handleDelete(dept.id)} />
                  </td>
                </tr>
              ))}


              {/* COURSES ROW */}
              {activeTab === 'courses' && courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                        <p className="font-bold text-slate-700">{course.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{course.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-md font-bold">{course.type}</span></td>
                  <td className="px-6 py-4 text-md font-bold text-slate-600">{course.duration}</td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons onDelete={() => handleDelete(course.id)} />
                  </td>
                </tr>
              ))}

              {/* CLASSES ROW */}
              {activeTab === 'classes' && classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-700">{cls.name}</td>
                  <td className="px-6 py-4"><span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-md font-bold">Sec {cls.section}</span></td>
                  <td className="px-6 py-4 text-md text-slate-600">{cls.teacher}</td>
                  <td className="px-6 py-4 text-md font-bold text-slate-600">{cls.strength} Students</td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons onDelete={() => handleDelete(cls.id)} />
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADD MODAL */}
      {isModalOpen && (
        <AddModal 
          type={activeTab} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}

    </div>
  );
}

// --- SUB COMPONENTS ---

const ActionButtons = ({ onDelete }) => (
  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit size={16} /></button>
    <button onClick={onDelete} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
  </div>
);

const AddModal = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getTitle = () => {
    if (type === 'departments') return "Add New Department";
    if (type === 'courses') return "Add New Course";
    return "Add New Class";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-slate-800 text-lg">{getTitle()}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* --- DEPARTMENT FIELDS --- */}
          {type === 'departments' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Department Name</label>
                <input name="name" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" placeholder="e.g. Mechanical Engineering" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Code</label>
                <input name="code" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" placeholder="e.g. ME" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">HOD Name</label>
                <input name="head" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" placeholder="e.g. Dr. Alan Smith" />
              </div>
            </>
          )}

          {/* --- COURSE FIELDS --- */}
          {type === 'courses' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Course Name</label>
                <input name="name" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Code</label>
                    <input name="code" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Type</label>
                    <select name="type" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500">
                        <option>UG</option>
                        <option>PG</option>
                        <option>Diploma</option>
                    </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Duration</label>
                <input name="duration" placeholder="e.g. 4 Years" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
              </div>
            </>
          )}

          {/* --- CLASS FIELDS --- */}
          {type === 'classes' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Class Name</label>
                <input name="name" required onChange={handleChange} placeholder="e.g. CSE - Year 2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Section</label>
                    <input name="section" required onChange={handleChange} placeholder="A" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Strength</label>
                    <input name="strength" type="number" onChange={handleChange} placeholder="60" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Class Teacher</label>
                <input name="teacher" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-md font-bold text-slate-700 outline-none focus:border-blue-500" />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-md uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-md uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex justify-center items-center gap-2">
                <Save size={16} /> Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
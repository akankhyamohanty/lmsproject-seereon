import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; 
import { 
  Search, Eye, Check, X, Plus, Filter, 
  GraduationCap, Calendar, BookOpen, Mail, User, Layers, Hash, AlertTriangle, 
  Lock, RefreshCw, Save, Phone, CreditCard, School, Building2 
} from "lucide-react";

const STORAGE_KEY = "student_management_list_v3";

export const StudentList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  
  // --- MODAL STATES ---
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [confirmAction, setConfirmAction] = useState(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setStudents(JSON.parse(stored));
    } else {
      // ✅ Added 'type' and 'standard' to initial data
      const initialData = [
        { id: "STU-1001", type: "University", name: "John Doe", course: "B.Tech CSE", section: "A", year: "2024-25", status: "Pending", email: "john@edu.in", phone: "9876543210" },
        { id: "SCH-2005", type: "School", name: "Amit Sharma", standard: "Class 10", section: "B", year: "2024-25", status: "Active", email: "parent.amit@mail.com", phone: "9123456780" },
      ];
      setStudents(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);

  const updateStorage = (updatedList) => {
    setStudents(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  // --- HANDLERS ---
  const handleSaveStudent = (newStudentData) => {
    const prefix = newStudentData.type === "School" ? "SCH" : "STU";
    const newStudent = {
      id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Pending",
      ...newStudentData
    };
    updateStorage([...students, newStudent]);
    setIsAddModalOpen(false);
  };

  const initiateAction = (type, student) => {
    setConfirmAction({ type, id: student.id, name: student.name });
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    const newStatus = type === 'approve' ? "Active" : "Rejected";
    const updated = students.map((s) => s.id === id ? { ...s, status: newStatus } : s);
    updateStorage(updated);
    setConfirmAction(null);
    if (selectedStudent?.id === id) setSelectedStudent(null);
  };

  const filteredStudents = students.filter(item => {
    const matchesStatus = activeTab === "all" || item.status.toLowerCase() === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full font-sans text-left relative">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Management</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage School & University Enrollments</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F53D5] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus size={16} /> Enroll Student
        </button>
      </div>

      {/* TABS & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-end">
        <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex shadow-sm">
          {["all", "pending", "active", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                activeTab === tab 
                  ? "bg-slate-800 text-white shadow-md" 
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student..." 
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-5 pl-6 pr-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Level</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Class / Course</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="py-5 pr-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                          item.type === 'School' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {item.name[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700">{item.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID: {item.id}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* ✅ Level Badge */}
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        item.type === 'School' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {item.type === 'School' ? <><School size={10} className="inline mr-1"/> School</> : <><Building2 size={10} className="inline mr-1"/> University</>}
                      </span>
                    </td>

                    {/* ✅ Conditional Course/Standard Display */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          {item.type === 'School' ? item.standard : item.course}
                        </span>
                        <span className="text-xs font-bold text-slate-400 mt-0.5">Section: {item.section}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                        item.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedStudent(item)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Eye size={18} /></button>
                        {item.status === 'Pending' && (
                          <>
                            <button onClick={() => initiateAction('approve', item)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check size={18} strokeWidth={2.5} /></button>
                            <button onClick={() => initiateAction('reject', item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X size={18} strokeWidth={2.5} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="py-12 text-center text-slate-400 font-bold text-sm">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {isAddModalOpen && <StudentFormModal onClose={() => setIsAddModalOpen(false)} onSave={handleSaveStudent} />}
      {selectedStudent && <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} onAction={initiateAction} />}
      {confirmAction && <ConfirmationModal action={confirmAction} onClose={() => setConfirmAction(null)} onConfirm={executeAction} />}

    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ✅ UPDATED STUDENT FORM MODAL (With School/University Toggle)              */
/* -------------------------------------------------------------------------- */
const StudentFormModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    type: "University", // ✅ Default: University
    firstName: "", lastName: "", dob: "", gender: "", phone: "", email: "",
    course: "", standard: "", section: "", rollNo: "", year: "2024-25", // ✅ Added 'standard'
    aadhar: "", pan: "", qual_10th: "", qual_12th: ""
  });
  const [generatedPass, setGeneratedPass] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Toggle Handler
  const handleTypeChange = (type) => {
    setForm({ ...form, type, course: "", standard: "" }); // Reset dependent fields
  };

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-8).toUpperCase() + "@" + Math.floor(10 + Math.random() * 90);
    setGeneratedPass(pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName) return alert("First name is required");
    // Validation based on type
    if (form.type === "University" && !form.course) return alert("Please select a Course");
    if (form.type === "School" && !form.standard) return alert("Please select a Class/Standard");

    onSave({ name: `${form.firstName} ${form.lastName}`, password: generatedPass, ...form });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Enroll New Student</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Complete admission details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={20} /></button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. PERSONAL */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><User size={16}/></div><span className="text-sm font-black text-slate-700 uppercase tracking-wide">Personal Details</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">First Name *</label><input name="firstName" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Last Name *</label><input name="lastName" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date of Birth</label><input name="dob" type="date" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gender</label><select name="gender" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"><option>Select</option><option>Male</option><option>Female</option></select></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email</label><input name="email" type="email" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone</label><input name="phone" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500" placeholder="+91" /></div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* ✅ 2. ACADEMIC INFO WITH TOGGLE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><GraduationCap size={16}/></div>
                    <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Academic Info</span>
                 </div>
                 {/* TYPE TOGGLE */}
                 <div className="bg-slate-100 p-1 rounded-lg flex">
                    <button type="button" onClick={() => handleTypeChange("School")} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${form.type === "School" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>School</button>
                    <button type="button" onClick={() => handleTypeChange("University")} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${form.type === "University" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>University</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* CONDITIONAL DROPDOWN */}
                {form.type === "University" ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Course (University)</label>
                    <select name="course" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500">
                      <option value="">Select Course</option>
                      <option>B.Tech CS</option><option>MBA</option><option>BBA</option><option>M.Sc</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Standard (School)</label>
                    <select name="standard" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500">
                      <option value="">Select Class</option>
                      {[...Array(12)].map((_, i) => <option key={i} value={`Class ${i+1}`}>Class {i+1}</option>)}
                    </select>
                  </div>
                )}

                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Section</label><select name="section" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500"><option>Select</option><option>A</option><option>B</option><option>C</option></select></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Roll Number</label><input name="rollNo" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Academic Year</label><input value="2024-25" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500" /></div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* 3. LOGIN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Lock size={16}/></div><span className="text-sm font-black text-slate-700 uppercase tracking-wide">Login Credentials</span></div>
              <div className="flex flex-col md:flex-row gap-5 items-end">
                <div className="flex-1 space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Temporary Password</label>
                  <div className="flex gap-2">
                    <input value={generatedPass} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 font-mono" placeholder="Generate ->" />
                    <button type="button" onClick={generatePassword} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"><RefreshCw size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs uppercase text-slate-500 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 flex justify-center items-center gap-2"><Save size={16} /> Enroll Student</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* -------------------------------------------------------------------------- */
/* STUDENT PROFILE MODAL & CONFIRMATION MODAL (Simplified)                    */
/* -------------------------------------------------------------------------- */
const StudentProfileModal = ({ student, onClose, onAction }) => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Student Profile</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-black border-4 border-white shadow-lg">{student.name[0]}</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
              <p className="text-sm font-medium text-slate-500">
                {student.type === "School" ? `${student.standard} • Sec ${student.section}` : `${student.course} • Sec ${student.section}`}
              </p>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${student.type === 'School' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{student.type} Student</span>
            </div>
          </div>
          {student.status === "Pending" && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => onAction('approve', student)} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700">Approve</button>
              <button onClick={() => onAction('reject', student)} className="flex-1 bg-white border-2 border-red-100 text-red-600 py-3 rounded-xl text-sm font-bold hover:bg-red-50">Reject</button>
            </div>
          )}
        </div>
      </div>
    </div>, document.body
  );
};

const ConfirmationModal = ({ action, onClose, onConfirm }) => {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
        <h3 className="text-lg font-black text-slate-800 mb-1">Confirm {action.type}</h3>
        <p className="text-sm text-slate-500 mb-6">Are you sure for <strong>{action.name}</strong>?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 text-white rounded-xl text-sm font-bold ${action.type === 'approve' ? 'bg-emerald-600' : 'bg-red-600'}`}>Confirm</button>
        </div>
      </div>
    </div>, document.body
  );
};

// import React, { useEffect, useState } from "react";
// import { Search, Eye, Check, X } from "lucide-react";

// const STORAGE_KEY = "student_management_list";

// export const StudentList = () => {
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");

//   /* ---------------- LOAD DATA ---------------- */
//   useEffect(() => {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (stored) {
//       setStudents(JSON.parse(stored));
//     } else {
//       const initialData = [
//         { id: "STU001", name: "John Doe", course: "B.Tech CSE", section: "CSE-A", year: "2024-25", status: "Pending" },
//         { id: "STU002", name: "Amit Kumar", course: "B.Tech ECE", section: "ECE-A", year: "2024-25", status: "Pending" },
//         { id: "STU003", name: "Priya Sharma", course: "B.Tech CSE", section: "CSE-B", year: "2024-25", status: "Pending" },
//       ];
//       setStudents(initialData);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
//     }
//   }, []);

//   /* ---------------- SAVE ---------------- */
//   const updateStorage = (updatedList) => {
//     setStudents(updatedList);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
//   };

//   /* ---------------- ACTIONS ---------------- */
//   const approveStudent = (id) => {
//     updateStorage(
//       students.map((s) =>
//         s.id === id ? { ...s, status: "Active" } : s
//       )
//     );
//   };

//   const rejectStudent = (id) => {
//     updateStorage(
//       students.map((s) =>
//         s.id === id ? { ...s, status: "Rejected" } : s
//       )
//     );
//   };

//   /* ---------------- ADD STUDENT (DEMO) ---------------- */
//   const addStudent = () => {
//     const newStudent = {
//       id: `STU${Date.now()}`,
//       name: "New Student",
//       course: "B.Tech CSE",
//       section: "CSE-A",
//       year: "2024-25",
//       status: "Pending",
//     };
//     updateStorage([...students, newStudent]);
//   };

//   /* ---------------- FILTER ---------------- */
//   const filteredStudents = students.filter(
//     (s) =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.id.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="font-sans text-left w-full text-gray-900">
//       {/* PAGE TITLE */}
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl text-start font-bold">Student Management</h1>
//           <p className="text-sm text-gray-500">Manage student records and profiles</p>
//         </div>
//         <button
//           onClick={addStudent}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
//         >
//           + Add Student
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         {/* FILTERS */}
//         <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
//           <div className="md:col-span-6 relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by student name or ID..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full bg-gray-100 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-3">Student ID</th>
//                 <th>Full Name</th>
//                 <th>Course</th>
//                 <th>Class / Section</th>
//                 <th>Academic Year</th>
//                 <th>Status</th>
//                 <th className="text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredStudents.map((student) => (
//                 <tr key={student.id} className="border-b hover:bg-gray-50">
//                   <td className="py-3 font-bold">{student.id}</td>
//                   <td className="text-gray-600">{student.name}</td>
//                   <td className="font-bold">{student.course}</td>
//                   <td className="font-bold">{student.section}</td>
//                   <td className="text-gray-500">{student.year}</td>
//                   <td>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-bold
//                         ${
//                           student.status === "Active"
//                             ? "bg-green-100 text-green-700"
//                             : student.status === "Rejected"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                     >
//                       {student.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="flex justify-center gap-2">
//                       <button className="p-2 hover:bg-gray-100 rounded-lg">
//                         <Eye size={18} />
//                       </button>
//                       <button
//                         onClick={() => approveStudent(student.id)}
//                         className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
//                       >
//                         <Check size={16} />
//                       </button>
//                       <button
//                         onClick={() => rejectStudent(student.id)}
//                         className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}

//               {filteredStudents.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center py-6 text-gray-400">
//                     No students found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* FOOTER */}
//         <div className="pt-4 text-sm text-gray-500">
//           Showing {filteredStudents.length} of {students.length} students
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentList;

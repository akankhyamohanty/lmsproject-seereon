// import React, { useState } from 'react';
// import { Search, Eye, Check, X } from 'lucide-react';

// export const FacultyList = () => {
//   const [faculty, setFaculty] = useState([
//     { id: 1, name: "Dr. Sarah John", email: "john@gmail.com", qual: "M.Tech in C.S", exp: "12 years", date: "2026-01-15", status: "Pending" },
//     { id: 2, name: "Prof. Amit Sharma", email: "amit.s@edu.in", qual: "PhD Physics", exp: "8 years", date: "2026-01-16", status: "Pending" },
//     { id: 3, name: "Priya Das", email: "priya.d@gmail.com", qual: "M.Sc Math", exp: "4 years", date: "2026-01-18", status: "Pending" },
//     { id: 4, name: "Rahul Verma", email: "rahul.v@yahoo.com", qual: "B.Ed English", exp: "Fresher", date: "2026-01-20", status: "Pending" },
//     { id: 5, name: "Dr. Kavita Singh", email: "kavita.s@gmail.com", qual: "PhD Chemistry", exp: "10 years", date: "2026-01-22", status: "Pending" },
//   ]);

//   return (
//     // ✅ ADDED 'text-left' to force everything to the left side
//     <div className="font-sans text-left w-full"> 
      
//       {/* 1. WELCOME SECTION (Left Aligned) */}
//       {/* <div className="mb-8 text-left">
//         <h2 className="text-3xl font-bold text-gray-900">Hi, Subham</h2>
//         <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
//       </div> */}

//       {/* 2. PAGE TITLE (Left Aligned) */}
//       <div className="mb-6 text-left">
//         <h1 className="text-2xl font-bold text-gray-900">Faculty Approval Queue</h1>
//         <p className="text-sm text-gray-500 mt-1">Review and approve faculty applications</p>
//       </div>

//       {/* 3. CARD CONTAINER */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
//         {/* Filters */}
//         <div className="mb-6">
//           <h3 className="font-bold text-gray-800 mb-3 text-sm">Filters</h3>
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search by name or email...." 
//               className="w-full bg-gray-50 pl-12 pr-4 py-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900">Faculty Name</th>
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900">Email</th>
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900">Qualification</th>
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900">Experience</th>
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900">Applied Date</th>
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900">Status</th>
//                 <th className="py-4 pr-4 text-sm font-bold text-gray-900 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {faculty.map((item) => (
//                 <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                   <td className="py-4 pr-4 text-sm font-medium text-gray-900">{item.name}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-600">{item.email}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-900 font-semibold">{item.qual}</td>
//                   <td className="py-4 pr-4 text-sm text-gray-900 font-semibold">{item.exp}</td>
                  
//                   {/* ✅ FIXED: Added 'whitespace-nowrap' so date stays on one line */}
//                   <td className="py-4 pr-4 text-sm text-gray-500 whitespace-nowrap">{item.date}</td>
                  
//                   <td className="py-4 pr-4">
//                     <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold block w-fit">
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="py-4 pr-4">
//                     <div className="flex items-center justify-center gap-2">
//                       <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Eye size={18} /></button>
//                       <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"><Check size={16} strokeWidth={3} /></button>
//                       <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><X size={16} strokeWidth={3} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import { 
  Search, Eye, Check, X, Plus, 
  Mail, Phone, Calendar, Briefcase, 
  GraduationCap, AlertTriangle, User, Building2, Save, 
  CreditCard, BookOpen, Filter, Upload, FileText // ✅ Added Upload & FileText
} from "lucide-react";

const STORAGE_KEY = "faculty_list";

export const FacultyList = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [faculty, setFaculty] = useState([]);
  
  // --- MODAL STATES ---
  const [selectedFaculty, setSelectedFaculty] = useState(null); 
  const [confirmAction, setConfirmAction] = useState(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const storedFaculty = localStorage.getItem(STORAGE_KEY);
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty));
    } else {
      const initialData = [
        { id: 1, name: "Dr. Sarah John", email: "john@gmail.com", phone: "+91 98765 43210", qual_grad: "B.Tech CSE", qual_pg: "M.Tech CSE", exp: "12 years", date: "2026-01-15", status: "Pending", dept: "Computer Science" },
        { id: 2, name: "Prof. Amit Sharma", email: "amit.s@edu.in", phone: "+91 98765 12345", qual_grad: "B.Sc Physics", qual_pg: "PhD Physics", exp: "8 years", date: "2026-01-16", status: "Approved", dept: "Physics" },
        { id: 3, name: "Priya Das", email: "priya.d@gmail.com", phone: "+91 88888 99999", qual_grad: "B.Sc Math", qual_pg: "M.Sc Math", exp: "4 years", date: "2026-01-18", status: "Rejected", dept: "Mathematics" },
      ];
      setFaculty(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);

  const updateStorage = (updatedList) => {
    setFaculty(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  /* ---------------- HANDLERS ---------------- */
  const handleSaveFaculty = (newFacultyData) => {
    const newFaculty = {
      id: Date.now(),
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      ...newFacultyData
    };
    updateStorage([...faculty, newFaculty]);
    setIsAddModalOpen(false);
  };

  const initiateAction = (type, item) => {
    setConfirmAction({ type, id: item.id, name: item.name });
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    const newStatus = type === "approve" ? "Approved" : "Rejected";
    const updated = faculty.map((f) => f.id === id ? { ...f, status: newStatus } : f);
    updateStorage(updated);
    setConfirmAction(null);
    if (selectedFaculty?.id === id) setSelectedFaculty(null);
  };

  // --- FILTER LOGIC ---
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.email.toLowerCase().includes(search.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'pending') matchesTab = f.status === 'Pending';
    if (activeTab === 'active') matchesTab = f.status === 'Approved';
    if (activeTab === 'rejected') matchesTab = f.status === 'Rejected';

    return matchesSearch && matchesTab;
  });

  return (
    <div className="font-sans w-full text-left relative">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Approval Queue</h1>
          <p className="text-sm text-gray-500">Review and approve faculty applications</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <Plus size={18} /> Add Faculty
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
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty..." 
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600 placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 pl-6 pr-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Faculty Name</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Qualification</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Applied Date</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="py-4 pr-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{item.qual_pg || item.qual_grad}</span>
                        <span className="text-xs font-bold text-slate-400">{item.exp} Experience</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600 font-mono">{item.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                        item.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                           item.status === 'Pending' ? 'bg-yellow-500' :
                           item.status === 'Approved' ? 'bg-emerald-500' :
                           'bg-red-500'
                        }`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-center">
                      <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedFaculty(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Profile">
                          <Eye size={18} />
                        </button>
                        {item.status === 'Pending' && (
                          <>
                            <button onClick={() => initiateAction('approve', item)} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all" title="Approve">
                              <Check size={18} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => initiateAction('reject', item)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all" title="Reject">
                              <X size={18} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Filter size={48} className="text-slate-200 mb-4" />
                      <p className="text-sm font-bold">No faculty found</p>
                      <p className="text-xs mt-1 font-medium">Try changing the filter or adding a new faculty member.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ ADD FACULTY POPUP MODAL */}
      {isAddModalOpen && (
        <FacultyFormModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleSaveFaculty} 
        />
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Faculty Profile</h2>
              <button onClick={() => setSelectedFaculty(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-black border-4 border-white shadow-lg">
                  {selectedFaculty.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedFaculty.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{selectedFaculty.dept || "General Department"}</p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      selectedFaculty.status === "Approved" ? "bg-green-50 text-green-700 border-green-100" :
                      selectedFaculty.status === "Rejected" ? "bg-red-50 text-red-700 border-red-100" :
                      "bg-yellow-50 text-yellow-700 border-yellow-100"
                    }`}>
                      {selectedFaculty.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label><p className="text-sm font-bold text-slate-700">{selectedFaculty.email}</p></div>
                 <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label><p className="text-sm font-bold text-slate-700">{selectedFaculty.phone}</p></div>
                 <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highest Qual</label><p className="text-sm font-bold text-slate-700">{selectedFaculty.qual_pg || selectedFaculty.qual_grad}</p></div>
                 <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</label><p className="text-sm font-bold text-slate-700">{selectedFaculty.exp}</p></div>
              </div>
              {selectedFaculty.status === "Pending" && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                  <button onClick={() => initiateAction('approve', selectedFaculty)} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all">Approve</button>
                  <button onClick={() => initiateAction('reject', selectedFaculty)} className="flex-1 bg-white border-2 border-red-100 text-red-600 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-all">Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP */}
      {confirmAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-200 text-center">
            <h3 className="text-lg font-black text-slate-800 mb-1">Confirm Action</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to {confirmAction.type} <strong>{confirmAction.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50">Cancel</button>
              <button onClick={executeAction} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ✅ UPDATED FACULTY FORM COMPONENT WITH UPLOAD FIELD
const FacultyFormModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", 
    aadhar: "", pan: "",
    qual_10th: "", qual_12th: "", qual_grad: "", qual_pg: "",
    exp: "", dept: "", designation: "",
    resume: null // New state for file
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, resume: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("Required fields missing");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Onboard New Faculty</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enter personal and academic details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. PERSONAL DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><User size={16} /></div><span className="text-sm font-black text-slate-700 uppercase tracking-wide">Personal Details</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name *</label><input name="name" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" placeholder="e.g. Dr. John Doe" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address *</label><input name="email" type="email" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" placeholder="john@institute.edu" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</label><input name="phone" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" placeholder="+91 98765 43210" /></div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* 2. IDENTITY PROOFS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard size={16} /></div><span className="text-sm font-black text-slate-700 uppercase tracking-wide">Identity Proofs</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aadhar Card No.</label><input name="aadhar" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" placeholder="XXXX XXXX XXXX" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PAN Card No.</label><input name="pan" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" placeholder="ABCDE1234F" /></div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* 3. EDUCATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><BookOpen size={16} /></div><span className="text-sm font-black text-slate-700 uppercase tracking-wide">Education</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">10th Grade</label><input name="qual_10th" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-orange-500" placeholder="Board / %" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">12th Grade</label><input name="qual_12th" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-orange-500" placeholder="Board / %" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Graduation</label><input name="qual_grad" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-orange-500" placeholder="Degree / University" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Post Graduation</label><input name="qual_pg" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-orange-500" placeholder="Degree / University" /></div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* 4. PROFESSIONAL INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Briefcase size={16} /></div><span className="text-sm font-black text-slate-700 uppercase tracking-wide">Professional Info</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Department</label>
                  <select name="dept" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500 transition-all">
                      <option value="">Select Department</option><option>Computer Science</option><option>Physics</option><option>Mathematics</option>
                  </select>
                </div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Designation</label><input name="designation" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500" placeholder="e.g. Senior Professor" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Experience (Years)</label><input name="exp" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-purple-500" placeholder="e.g. 5 Years" /></div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* --- 5. DOCUMENTS UPLOAD (NEW SECTION) --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 bg-pink-50 text-pink-600 rounded-lg"><FileText size={16} /></div>
                 <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Documents</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors group cursor-pointer relative">
                <input 
                  type="file" 
                  name="resume"
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {form.resume ? form.resume.name : "Click to upload Resume / CV"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">PDF, DOCX up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} type="button" className="flex-1 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex justify-center items-center gap-2">
              <Save size={16} /> Save Faculty
          </button>
        </div>

      </div>
    </div>
  );
};
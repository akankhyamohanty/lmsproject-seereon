import React, { useState, useEffect } from "react";
import { Plus, Save, Trash2, DollarSign, Send, X, Banknote } from "lucide-react";

export const FeeStructure = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [publishModalData, setPublishModalData] = useState(null); // 🟢 State for Publish Modal

  // ========================
  // FEES STATE (PERSISTED)
  // ========================
  const [fees, setFees] = useState(() => {
    const stored = localStorage.getItem("fees");
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            name: "B.Tech Tuition 2024",
            course: "B.Tech CS",
            year: "Year 1",
            semester: "Semester 1", // ✅ Default Data
            amount: "50000",
            dueDate: "2024-08-01",
            status: "Draft",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("fees", JSON.stringify(fees));
  }, [fees]);

  // ========================
  // FORM STATE
  // ========================
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    year: "",
    semester: "", // ✅ Semester State
    amount: "",
    dueDate: "",
    status: "Draft",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ========================
  // ACTIONS
  // ========================
  const handleSave = () => {
    if (!formData.name || !formData.course || !formData.year || !formData.amount) {
      alert("Please fill all required fields");
      return;
    }
    const newFee = { id: Date.now(), ...formData };
    setFees((prev) => [...prev, newFee]);
    
    // Reset Form
    setFormData({ 
        name: "", course: "", year: "", semester: "", 
        amount: "", dueDate: "", status: "Draft" 
    });
    setActiveTab("list");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this fee?")) {
      setFees((prev) => prev.filter((fee) => fee.id !== id));
    }
  };

  // 🟢 Publish Logic
  const handlePublishConfirm = (batchDetails) => {
    setFees(prev => prev.map(f => f.id === publishModalData.id ? { ...f, status: "Published" } : f));
    alert(`Success! Fee "${publishModalData.name}" published to ${batchDetails.class} (${batchDetails.year}).`);
    setPublishModalData(null);
  };

  return (
    <div className="w-full relative font-sans text-left">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fee Configuration</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Define tuition & exam fees</p>
        </div>

        {activeTab === "list" && (
          <button
            onClick={() => setActiveTab("create")}
            className="bg-[#0F53D5] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Plus size={16} /> Create Structure
          </button>
        )}
      </div>

      {/* ================= LIST VIEW ================= */}
      {activeTab === "list" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Banknote size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{fee.name}</span>
                    </div>
                  </td>
                  
                  {/* ✅ Course + Semester Display */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{fee.course}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                        {fee.year} • {fee.semester || "All Semesters"}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-black text-slate-700 text-sm">₹{Number(fee.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs font-bold">{fee.dueDate}</td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        fee.status === "Published" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* 🟢 PUBLISH BUTTON */}
                        <button 
                            onClick={() => setPublishModalData(fee)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Publish Fee"
                        >
                            <Send size={16} />
                        </button>
                        <button onClick={() => handleDelete(fee.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {fees.length === 0 && (
            <div className="text-center py-12">
                <p className="text-slate-400 font-bold text-sm">No fee structures found.</p>
            </div>
          )}
        </div>
      )}

      {/* ================= CREATE FORM ================= */}
      {activeTab === "create" && (
        <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
             <h3 className="text-lg font-black text-slate-800">Create Fee Structure</h3>
             <button onClick={() => setActiveTab("list")}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fee Title</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Annual Tuition 2024" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course</label>
                <select name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    <option value="">Select Course</option>
                    <option>B.Tech CS</option>
                    <option>MBA</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    <option value="">Select Year</option>
                    <option>Year 1</option>
                    <option>Year 2</option>
                    <option>Year 3</option>
                    <option>Year 4</option>
                </select>
            </div>

            {/* ✅ SEMESTER INPUT */}
            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    <option value="">Select Semester (Optional)</option>
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6</option>
                    <option>Semester 7</option>
                    <option>Semester 8</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Amount</label>
                <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="50000" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button onClick={() => setActiveTab("list")} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-3 bg-[#0F53D5] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">
              <Save size={16} /> Save as Draft
            </button>
          </div>
        </div>
      )}

      {/* 🟢 PUBLISH MODAL */}
      {publishModalData && (
        <PublishFeeModal 
            structure={publishModalData} 
            onClose={() => setPublishModalData(null)} 
            onPublish={handlePublishConfirm} 
        />
      )}

    </div>
  );
};

// 🟢 SUB-COMPONENT: PUBLISH MODAL
const PublishFeeModal = ({ structure, onClose, onPublish }) => {
    const [batch, setBatch] = useState({ class: "", year: "2024-25" });

    const handlePublish = () => {
        if(!batch.class) return alert("Please select a target class");
        onPublish(batch);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6">
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Send size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-lg">Publish Fee</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Assigning: {structure.name}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                        <select 
                            value={batch.year}
                            onChange={(e) => setBatch({...batch, year: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                        >
                            <option>2024-25</option>
                            <option>2025-26</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Class / Section</label>
                        <select 
                            value={batch.class}
                            onChange={(e) => setBatch({...batch, class: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                        >
                            <option value="">Select Class</option>
                            <option>B.Tech CSE - Year 1</option>
                            <option>B.Tech CSE - Year 2</option>
                            <option>MBA - Year 1</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={handlePublish} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-colors">Publish</button>
                </div>
            </div>
        </div>
    );
};
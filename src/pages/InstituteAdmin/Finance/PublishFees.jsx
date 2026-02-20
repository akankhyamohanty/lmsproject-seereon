// import { useState } from "react";
// import { 
//   ChevronDown, 
//   Send 
// } from "lucide-react";

// export const PublishFees = () => {
//   const [loading, setLoading] = useState(false);

//   const handlePublish = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       alert("Fee Structure Published Successfully!");
//     }, 1500);
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto pb-12">
      
//       {/* 1. PAGE TITLE */}
//       {/* Note: "Hi, Subham" is now handled by the DashboardLayout header, 
//           so we only show the page-specific title here. */}
//       <div className="text-center mb-10 mt-4">
//         <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">Publish Fees</h1>
//         <p className="text-slate-400 text-sm mt-2 font-medium">Create and broadcast fee demands to student batches</p>
//       </div>

//       {/* 2. FORM CARD */}
//       <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden relative border border-slate-100">
        
//         {/* The Distinct Blue Top Border */}
//         <div className="h-2 w-full bg-[#2563eb]"></div>

//         <form onSubmit={handlePublish} className="p-12 space-y-10">
          
//           {/* Row 1: Course & Fee Type */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Course / Class */}
//             <div className="space-y-3">
//               <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Course / Class</label>
//               <div className="relative">
//                 <select className="w-full bg-[#f1f5f9] border-none rounded-xl px-5 py-4 text-slate-500 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer">
//                   <option>Select Course</option>
//                   <option>B.Tech CSE - Year 1</option>
//                   <option>MBA - Year 1</option>
//                 </select>
//                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
//               </div>
//             </div>

//             {/* Fee Type */}
//             <div className="space-y-3">
//               <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Fee Type</label>
//               <div className="relative">
//                 <select className="w-full bg-[#f1f5f9] border-none rounded-xl px-5 py-4 text-slate-500 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer">
//                   <option>Select Fee Type</option>
//                   <option>Annual Tuition</option>
//                   <option>Semester Exam Fee</option>
//                 </select>
//                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
//               </div>
//             </div>
//           </div>

//           {/* Row 2: Dates */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-3">
//               <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Publish Date</label>
//               <input 
//                 type="date" 
//                 className="w-full bg-[#f1f5f9] border-none rounded-xl px-5 py-4 text-slate-500 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer uppercase text-slate-400"
//               />
//             </div>

//             <div className="space-y-3">
//               <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Due Date</label>
//               <input 
//                 type="date" 
//                 className="w-full bg-[#f1f5f9] border-none rounded-xl px-5 py-4 text-slate-500 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer uppercase text-slate-400"
//               />
//             </div>
//           </div>

//           {/* Checkbox */}
//           <div className="flex items-center gap-3 pt-2">
//             <input 
//               type="checkbox" 
//               id="notify"
//               className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" 
//             />
//             <label htmlFor="notify" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
//               Notify Students via Email/SMS
//             </label>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end pt-4">
//             <button 
//               type="submit" 
//               disabled={loading}
//               className="flex items-center gap-2 bg-[#2563eb] text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-70 active:scale-95"
//             >
//               {loading ? "Publishing..." : <> <Send size={16} strokeWidth={2.5} /> Publish Fees </>}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { Send, Search, Filter, Calendar, Trash2 } from "lucide-react";

export const PublishFees = () => {
  const [selectedFees, setSelectedFees] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock fees data from localStorage or fallback
  const draftFees = [
    { id: 1, name: "Annual Tuition 2024", course: "B.Tech CS", amount: "400000", status: "Draft", feeTitle: "Tuition Fee" },
    { id: 2, name: "Lab Fee Year 2-3", course: "B.Tech IT", amount: "40000", status: "Draft", feeTitle: "Lab Fee" },
    { id: 3, name: "Exam Fee All Semesters", course: "MBA", amount: "25000", status: "Draft", feeTitle: "Exam Fee" },
    { id: 4, name: "Infrastructure Fee", course: "BBA", amount: "15000", status: "Draft", feeTitle: "Infrastructure Fee" },
  ];

  const handleFeeToggle = (id) => {
    setSelectedFees(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFees.length === filteredFees.length) {
      setSelectedFees([]);
    } else {
      setSelectedFees(filteredFees.map(f => f.id));
    }
  };

  const handlePublish = () => {
    if (selectedFees.length === 0) {
      alert("Please select at least one fee to publish");
      return;
    }
    if (!selectedClass || !selectedYear) {
      alert("Please select class and academic year");
      return;
    }

    alert(
      `✅ Published ${selectedFees.length} fee(s) to ${selectedClass} (${selectedYear})`
    );
    setSelectedFees([]);
    setSelectedClass("");
    setSelectedYear("");
  };

  const filteredFees = draftFees.filter(fee =>
    fee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.feeTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Publish Fees
        </h1>
        <p className="text-slate-600 mt-2">
          Assign draft fees to classes and academic years
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: FEE SELECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          
          {/* SEARCH & HEADER */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-slate-900 text-lg">
                  Select Fees to Publish
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedFees.length} fee{selectedFees.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by fee name, course, or type..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* SELECT ALL */}
          {filteredFees.length > 0 && (
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedFees.length === filteredFees.length && filteredFees.length > 0}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label className="text-sm font-bold text-slate-700 cursor-pointer">
                Select All ({filteredFees.length})
              </label>
            </div>
          )}

          {/* FEES LIST */}
          <div className="divide-y divide-slate-100">
            {filteredFees.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="text-sm font-bold">No draft fees found</p>
                {searchQuery && <p className="text-xs mt-2">Try a different search term</p>}
              </div>
            ) : (
              filteredFees.map(fee => (
                <div
                  key={fee.id}
                  className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-4 cursor-pointer"
                  onClick={() => handleFeeToggle(fee.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedFees.includes(fee.id)}
                    onChange={() => handleFeeToggle(fee.id)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{fee.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                      <span>📚 Course: {fee.course}</span>
                      <span>💰 Amount: ₹{Number(fee.amount).toLocaleString()}</span>
                      <span>📝 Type: {fee.feeTitle}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold whitespace-nowrap">
                    {fee.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: PUBLISH OPTIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit sticky top-6">
          <h2 className="font-black text-slate-900 text-lg mb-6">
            Publish To
          </h2>

          <div className="space-y-6">
            {/* CLASS SELECTION */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                Class / Section *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Class</option>
                <option>B.Tech CSE - Year 1</option>
                <option>B.Tech CSE - Year 2</option>
                <option>B.Tech CSE - Year 3</option>
                <option>B.Tech CSE - Year 4</option>
                <option>B.Tech IT - Year 1</option>
                <option>B.Tech IT - Year 2</option>
                <option>B.Tech IT - Year 3</option>
                <option>B.Tech IT - Year 4</option>
                <option>B.Tech ECE - Year 1</option>
                <option>B.Tech ECE - Year 2</option>
                <option>BBA - Year 1</option>
                <option>BBA - Year 2</option>
                <option>BBA - Year 3</option>
                <option>MBA - Year 1</option>
                <option>MBA - Year 2</option>
              </select>
            </div>

            {/* YEAR SELECTION */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                Academic Year *
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Year</option>
                <option>2024-25</option>
                <option>2025-26</option>
                <option>2026-27</option>
              </select>
            </div>

            {/* SUMMARY */}
            {selectedFees.length > 0 && selectedClass && selectedYear && (
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-3">
                <p className="text-sm font-black text-blue-900">✓ Ready to Publish</p>
                <div className="space-y-2 text-xs text-blue-700">
                  <p>📋 Fees: {selectedFees.length}</p>
                  <p>🏫 Class: {selectedClass}</p>
                  <p>📅 Year: {selectedYear}</p>
                </div>
              </div>
            )}

            {selectedFees.length === 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <p className="text-xs font-bold text-amber-700">
                  ℹ️ Select at least one fee to enable publishing
                </p>
              </div>
            )}

            {/* PUBLISH BUTTON */}
            <button
              onClick={handlePublish}
              disabled={selectedFees.length === 0 || !selectedClass || !selectedYear}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} /> Publish {selectedFees.length > 0 ? `(${selectedFees.length})` : ""} Fees
            </button>

            {/* INFO BOX */}
            <div className="p-4 bg-slate-100 rounded-lg text-xs text-slate-600 space-y-2">
              <p className="font-bold">ℹ️ Publishing Info:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Fees will be visible to selected class</li>
                <li>Students can view in fee structure</li>
                <li>Cannot be undone - fees become active</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishFees;
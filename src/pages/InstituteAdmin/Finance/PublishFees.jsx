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


import { useEffect, useState } from "react";
import { ChevronDown, Send } from "lucide-react";

const STORAGE_KEY = "published_fees";

export const PublishFees = () => {
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);

  const [form, setForm] = useState({
    course: "",
    feeType: "",
    publishDate: "",
    dueDate: "",
    notify: false,
  });

  /* -------- LOAD EXISTING DATA -------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFees(JSON.parse(stored));
    }
  }, []);

  /* -------- SAVE TO STORAGE -------- */
  const saveFees = (updated) => {
    setFees(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* -------- HANDLE CHANGE -------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* -------- HANDLE SUBMIT -------- */
  const handlePublish = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newFee = {
        id: Date.now(),
        ...form,
        status: "Published",
      };

      saveFees([...fees, newFee]);
      setLoading(false);

      alert("Fee Structure Published Successfully!");

      setForm({
        course: "",
        feeType: "",
        publishDate: "",
        dueDate: "",
        notify: false,
      });
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* PAGE TITLE */}
      <div className="text-center mb-10 mt-4">
        <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">
          Publish Fees
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-medium">
          Create and broadcast fee demands to student batches
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border">
        <div className="h-2 bg-[#2563eb]" />

        <form onSubmit={handlePublish} className="p-12 space-y-10">
          {/* COURSE + FEE TYPE */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Course / Class
              </label>
              <div className="relative">
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f1f5f9] rounded-xl px-5 py-4 font-bold text-sm appearance-none"
                >
                  <option value="">Select Course</option>
                  <option>B.Tech CSE - Year 1</option>
                  <option>MBA - Year 1</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2" size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Fee Type
              </label>
              <div className="relative">
                <select
                  name="feeType"
                  value={form.feeType}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f1f5f9] rounded-xl px-5 py-4 font-bold text-sm appearance-none"
                >
                  <option value="">Select Fee Type</option>
                  <option>Annual Tuition</option>
                  <option>Semester Exam Fee</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2" size={18} />
              </div>
            </div>
          </div>

          {/* DATES */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Publish Date
              </label>
              <input
                type="date"
                name="publishDate"
                value={form.publishDate}
                onChange={handleChange}
                required
                className="w-full bg-[#f1f5f9] rounded-xl px-5 py-4 font-bold text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full bg-[#f1f5f9] rounded-xl px-5 py-4 font-bold text-sm"
              />
            </div>
          </div>

          {/* NOTIFY */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="notify"
              checked={form.notify}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
            <label className="text-sm font-bold text-slate-700">
              Notify Students via Email/SMS
            </label>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#2563eb] text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Publishing..." : <><Send size={16} /> Publish Fees</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishFees;

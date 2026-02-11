// import React, { useState } from 'react';
// import { Plus, Edit, Trash2 } from 'lucide-react';

// export const FeeStructure = () => {
//   // Mock Data matching your design style
//   const [fees] = useState([
//     { id: 1, course: "B.Tech CS", year: "2024-25", type: "Tuition", amount: "₹1,50,000", installments: "2" },
//     { id: 2, course: "B.Tech CS", year: "2024-25", type: "Tuition", amount: "₹1,50,000", installments: "2" },
//     { id: 3, course: "B.Tech CS", year: "2024-25", type: "Tuition", amount: "₹1,50,000", installments: "2" },
//   ]);

//   return (
//     <div className="font-sans text-left w-full text-gray-900">
      
//       {/* 1. WELCOME SECTION */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">Hi, Subham</h2>
//         <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
//       </div>

//       {/* 2. PAGE TITLE */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Fee Structure Setup</h1>
//         <p className="text-sm text-gray-500 mt-1">Configure fee structures for different courses</p>
//       </div>

//       {/* 3. ACTION BUTTON (Right Aligned) */}
//       <div className="flex justify-end mb-6">
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
//           <Plus size={18} />
//           Add Fee Structure
//         </button>
//       </div>

//       {/* 4. TABLE CARD */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-100 bg-white">
//                 <th className="p-5 text-sm font-bold text-gray-900">Course Name</th>
//                 <th className="p-5 text-sm font-bold text-gray-900">Academic Year</th>
//                 <th className="p-5 text-sm font-bold text-gray-900">Fee Type</th>
//                 <th className="p-5 text-sm font-bold text-gray-900">Total Amount</th>
//                 <th className="p-5 text-sm font-bold text-gray-900">Installments</th>
//                 <th className="p-5 text-sm font-bold text-gray-900 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fees.map((fee) => (
//                 <tr key={fee.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                   <td className="p-5 text-sm font-medium text-gray-900">{fee.course}</td>
//                   <td className="p-5 text-sm text-gray-500 font-medium">{fee.year}</td>
//                   <td className="p-5 text-sm text-gray-900 font-bold">{fee.type}</td>
//                   <td className="p-5 text-sm text-gray-900 font-bold">{fee.amount}</td>
//                   <td className="p-5 text-sm text-gray-900 font-medium">{fee.installments}</td>
//                   <td className="p-5 text-center">
//                     <div className="flex items-center justify-center gap-3">
//                       <button className="text-gray-900 hover:text-blue-600 transition-colors">
//                         <Edit size={18} />
//                       </button>
//                       <button className="text-red-500 hover:text-red-700 transition-colors">
//                         <Trash2 size={18} />
//                       </button>
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

// export default FeeStructure;





// import React, { useState } from "react";
// import { Plus, Edit, Trash2, X } from "lucide-react";

// const courses = ["B.Tech CS", "BCA", "MCA", "MBA"];
// const feeTypes = ["Tuition", "Hostel", "Exam", "Library"];

// export default function FeeStructure() {
//   const [fees, setFees] = useState([]);
//   const [open, setOpen] = useState(false);

//   const [form, setForm] = useState({
//     course: "",
//     year: "",
//     type: "",
//     amount: "",
//     installments: "",
//     publishDate: "",
//     dueDate: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFees([...fees, { id: Date.now(), ...form }]);
//     setOpen(false);
//     setForm({
//       course: "",
//       year: "",
//       type: "",
//       amount: "",
//       installments: "",
//       publishDate: "",
//       dueDate: "",
//     });
//   };

//   return (
//     <div className="font-sans text-left w-full text-gray-900">
//       {/* TITLE */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold">Fee Structure Setup</h1>
//         <p className="text-sm text-gray-500">
//           Configure fee structures for different courses
//         </p>
//       </div>

//       {/* ADD BUTTON */}
//       <div className="flex justify-end mb-6">
//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold"
//         >
//           <Plus size={18} /> Add Fee Structure
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow border overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-4">Course</th>
//               <th>Year</th>
//               <th>Fee Type</th>
//               <th>Amount</th>
//               <th>Installments</th>
//               <th>Publish</th>
//               <th>Due</th>
//               <th className="text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fees.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-400">
//                   No fee structures added
//                 </td>
//               </tr>
//             ) : (
//               fees.map((fee) => (
//                 <tr key={fee.id} className="border-t">
//                   <td className="p-4 font-medium">{fee.course}</td>
//                   <td>{fee.year}</td>
//                   <td>{fee.type}</td>
//                   <td>₹{fee.amount}</td>
//                   <td>{fee.installments}</td>
//                   <td>{fee.publishDate}</td>
//                   <td>{fee.dueDate}</td>
//                   <td className="text-center flex justify-center gap-3 py-3">
//                     <Edit size={18} className="cursor-pointer" />
//                     <Trash2 size={18} className="text-red-500 cursor-pointer" />
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-xl rounded-xl shadow-lg">
//             <div className="flex justify-between items-center px-6 py-4 border-b">
//               <h2 className="text-lg font-bold">Add Fee Structure</h2>
//               <X
//                 onClick={() => setOpen(false)}
//                 className="cursor-pointer"
//               />
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               <select
//                 name="course"
//                 value={form.course}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//                 required
//               >
//                 <option value="">Select Course / Class</option>
//                 {courses.map((c) => (
//                   <option key={c}>{c}</option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 name="year"
//                 placeholder="Academic Year (2024-25)"
//                 value={form.year}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//                 required
//               />

//               <select
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//                 required
//               >
//                 <option value="">Select Fee Type</option>
//                 {feeTypes.map((f) => (
//                   <option key={f}>{f}</option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 name="amount"
//                 placeholder="Total Amount"
//                 value={form.amount}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//                 required
//               />

//               <input
//                 type="number"
//                 name="installments"
//                 placeholder="Installments"
//                 value={form.installments}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   type="date"
//                   name="publishDate"
//                   value={form.publishDate}
//                   onChange={handleChange}
//                   className="border rounded-lg px-3 py-2"
//                   required
//                 />
//                 <input
//                   type="date"
//                   name="dueDate"
//                   value={form.dueDate}
//                   onChange={handleChange}
//                   className="border rounded-lg px-3 py-2"
//                   required
//                 />
//               </div>

//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="px-4 py-2 border rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

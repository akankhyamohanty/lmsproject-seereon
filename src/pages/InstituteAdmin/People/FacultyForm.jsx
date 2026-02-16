import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, FileText } from "lucide-react";

export const FacultyForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    qualification: "",
    experience: "",
    specialization: "",
    docs: {
      tenth: null,
      twelfth: null,
      ug: null,
      pg: null,
    }
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDocChange = (e, level) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm(prev => ({
      ...prev,
      docs: {
        ...prev.docs,
        [level]: file
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("FINAL SUBMIT DATA →", form);

    setTimeout(() => {
      setLoading(false);
      navigate("/admin/faculty");
    }, 1500);
  };

  /* ================= UPLOAD UI (FIXED) ================= */
  const UploadBox = ({ label, file, onChange }) => (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center relative cursor-pointer transition
        ${file ? "border-green-400 bg-green-50" : "border-slate-300 hover:bg-slate-50"}
      `}
    >
      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center gap-2">
        <div className={`p-3 rounded-full ${file ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-600"}`}>
          <Upload size={22} />
        </div>

        <p className="text-md font-semibold text-slate-800">
          {label}
        </p>

        {file ? (
          <p className="text-xs font-medium text-green-700">
            ✔ {file.name}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            PDF, JPG, PNG (Max 5MB)
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/faculty")}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Faculty</h1>
          <p className="text-md text-slate-500">Create a profile for a new teacher</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PERSONAL DETAILS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Personal Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <input name="name" required onChange={handleChange} placeholder="Full Name *" className="input" />
            <input name="email" type="email" required onChange={handleChange} placeholder="Email Address *" className="input" />
            <input name="phone" onChange={handleChange} placeholder="Mobile Number" className="input" />
            <input name="dob" type="date" onChange={handleChange} className="input" />
          </div>
        </div>

        {/* PROFESSIONAL DETAILS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Professional Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <input name="qualification" required onChange={handleChange} placeholder="Highest Qualification *" className="input" />
            <input name="experience" type="number" onChange={handleChange} placeholder="Experience (Years)" className="input" />
            <input name="specialization" onChange={handleChange} placeholder="Specialization" className="md:col-span-2 input" />
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
            <FileText size={18} /> Education Documents
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <UploadBox label="10th Certificate" file={form.docs.tenth} onChange={(e) => handleDocChange(e, "tenth")} />
            <UploadBox label="12th Certificate" file={form.docs.twelfth} onChange={(e) => handleDocChange(e, "twelfth")} />
            <UploadBox label="UG Degree" file={form.docs.ug} onChange={(e) => handleDocChange(e, "ug")} />
            <UploadBox label="PG Degree" file={form.docs.pg} onChange={(e) => handleDocChange(e, "pg")} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate("/admin/faculty")} className="px-6 py-2.5 border rounded-lg">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            {loading ? "Creating..." : <><Save size={18} /> Create Faculty</>}
          </button>
        </div>

      </form>
    </div>
  );
};



// import React from "react";

// const FacultyForm = ({ form, setForm, onSubmit }) => {
//   return (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <input
//         required
//         placeholder="Faculty Name"
//         className="w-full border p-2 rounded"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//       />

//       <input
//         required
//         placeholder="Email"
//         className="w-full border p-2 rounded"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       />

//       <input
//         placeholder="Qualification"
//         className="w-full border p-2 rounded"
//         value={form.qual}
//         onChange={(e) => setForm({ ...form, qual: e.target.value })}
//       />

//       <input
//         placeholder="Experience"
//         className="w-full border p-2 rounded"
//         value={form.exp}
//         onChange={(e) => setForm({ ...form, exp: e.target.value })}
//       />

//       <button className="bg-green-600 text-white px-4 py-2 rounded">
//         Save Faculty
//       </button>
//     </form>
//   );
// };

// export default FacultyForm;

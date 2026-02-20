import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Eye, Edit, Trash2, X, Save, Check, FileText, AlertTriangle, MapPin, User, GraduationCap
} from "lucide-react";

const STORAGE_KEY = "student_management_list_v4";

export const StudentForm = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Save to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (newStudentData) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...newStudentData } : s));
      setEditingStudent(null);
    } else {
      const student = {
        id: `STU-${Date.now()}`,
        status: "Pending",
        ...newStudentData
      };
      setStudents(prev => [...prev, student]);
    }
    setShowFormModal(false);
  };

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Student Management</h1>
            <p className="text-slate-600 mt-2">Manage student enrollment and records</p>
          </div>
          <button
            onClick={() => {
              setEditingStudent(null);
              setShowFormModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>

        {/* STUDENTS LIST */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {students.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-bold">No students enrolled yet</p>
              <p className="mt-2">Click "Add Student" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-slate-500">{student.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{student.email}</td>
                      <td className="px-6 py-4 text-slate-700">{student.course || student.standard || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          student.status === 'Active' ? 'bg-green-100 text-green-700' :
                          student.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setShowFormModal(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(student)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showFormModal && (
        <StudentFormModal
          student={editingStudent}
          onClose={() => {
            setShowFormModal(false);
            setEditingStudent(null);
          }}
          onSave={handleAddStudent}
        />
      )}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={() => {
            setEditingStudent(selectedStudent);
            setSelectedStudent(null);
            setShowFormModal(true);
          }}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          student={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm.id)}
        />
      )}
    </div>
  );
};

// ============================================================================
// STUDENT FORM MODAL
// ============================================================================
const StudentFormModal = ({ student, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState(student || {
    type: "University",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    aadhar: "",
    pan: "",
    course: "",
    standard: "",
    section: "",
    rollNo: "",
    year: "",
    documents: {
      aadhar: null,
      pan: null,
      tenth: null,
      twelfth: null,
      graduation: null,
      masters: null
    },
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleDocumentUpload = (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Only PDF and images allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setForm(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploaded: new Date().toLocaleDateString()
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      alert("Please fill required fields (First Name, Email)");
      return;
    }
    if (!form.section || !form.year) {
      alert("Please select section and academic year");
      return;
    }

    onSave({
      name: `${form.firstName} ${form.lastName}`,
      ...form
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-slate-50">
          <div>
            <h3 className="font-black text-slate-800 text-xl">
              {student ? 'Edit Student' : 'Add New Student'}
            </h3>
            <p className="text-slate-600 mt-1">Complete all required information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* TABS */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex gap-2 sticky top-0 z-10">
          {[
            { id: "personal", label: "👤 Personal Details" },
            { id: "academic", label: "🎓 Academic Info" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* TAB 1: PERSONAL */}
            {activeTab === "personal" && (
              <div className="space-y-8">
                {/* PERSONAL INFO */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-5">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First Name *"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email *"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* IDENTITY */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-5">Identity Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      name="aadhar"
                      value={form.aadhar}
                      onChange={handleChange}
                      placeholder="Aadhar Number"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="pan"
                      value={form.pan}
                      onChange={handleChange}
                      placeholder="PAN Number"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-5">Address</h3>
                  <div className="space-y-5">
                    <input
                      type="text"
                      name="street"
                      value={form.address.street}
                      onChange={handleAddressChange}
                      placeholder="Street Address"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input type="text" name="city" value={form.address.city} onChange={handleAddressChange} placeholder="City" className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" name="state" value={form.address.state} onChange={handleAddressChange} placeholder="State" className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" name="pincode" value={form.address.pincode} onChange={handleAddressChange} placeholder="Pincode" className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" name="country" value={form.address.country} onChange={handleAddressChange} placeholder="Country" className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC & DOCUMENTS */}
            {activeTab === "academic" && (
              <div className="space-y-8">
                {/* ACADEMIC INFO */}
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-5">Academic Information</h3>

                  <div className="mb-6 flex gap-3">
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, type: "School", course: "", standard: "" }))} className={`px-6 py-2 rounded-lg font-bold transition ${form.type === "School" ? "bg-orange-100 text-orange-700 border-2 border-orange-300" : "bg-slate-100 text-slate-600 border-2 border-slate-200"}`}>
                      🏫 School
                    </button>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, type: "University", course: "", standard: "" }))} className={`px-6 py-2 rounded-lg font-bold transition ${form.type === "University" ? "bg-blue-100 text-blue-700 border-2 border-blue-300" : "bg-slate-100 text-slate-600 border-2 border-slate-200"}`}>
                      🎓 University
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {form.type === "University" ? (
                      <select name="course" value={form.course} onChange={handleChange} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Course</option>
                        <option>B.Tech CS</option>
                        <option>B.Tech IT</option>
                        <option>MBA</option>
                      </select>
                    ) : (
                      <select name="standard" value={form.standard} onChange={handleChange} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Class</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                        ))}
                      </select>
                    )}

                    <select name="section" value={form.section} onChange={handleChange} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" required>
                      <option value="">Select Section *</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>

                    <input type="text" name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll Number" className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />

                    <select name="year" value={form.year} onChange={handleChange} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" required>
                      <option value="">Select Year *</option>
                      <option>2024-25</option>
                      <option>2025-26</option>
                    </select>
                  </div>
                </div>

                {/* DOCUMENTS */}
                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-5">Documents</h3>
                  <div className="space-y-6">
                    {[
                      { key: 'aadhar', label: 'Aadhar Card', icon: '🪪' },
                      { key: 'pan', label: 'PAN Card', icon: '💳' },
                      { key: 'tenth', label: '10th Certificate', icon: '📚' },
                      { key: 'twelfth', label: '12th Certificate', icon: '📚' },
                      { key: 'graduation', label: 'Graduation', icon: '🎓' },
                      { key: 'masters', label: "Master's Degree", icon: '👨‍🎓' }
                    ].map(doc => (
                      <DocumentField key={doc.key} label={doc.label} icon={doc.icon} docType={doc.key} uploaded={form.documents[doc.key]} onUpload={(e) => handleDocumentUpload(e, doc.key)} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50 px-8 py-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg transition flex items-center justify-center gap-2">
            <Save size={18} /> {student ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Document Field Component
const DocumentField = ({ label, icon, docType, uploaded, onUpload }) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
      <label className="text-sm font-bold text-slate-700 mb-3 block-flex items-center gap-2">
        <span className="text-lg">{icon}</span> {label}
      </label>

      <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
        uploaded ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
      }`}>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onUpload} className="hidden" id={`doc-${docType}`} />
        <label htmlFor={`doc-${docType}`} className="block cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-full ${uploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
              {uploaded ? <Check size={24} /> : <FileText size={24} />}
            </div>
            {uploaded ? (
              <div>
                <p className="text-sm font-bold text-slate-800">✓ {uploaded.name}</p>
                <p className="text-xs text-slate-500">{uploaded.uploaded}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-slate-700">Click to upload</p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG (Max 5MB)</p>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

// Student Details Modal
const StudentDetailsModal = ({ student, onClose, onEdit }) => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-white">Student Profile</h2>
            <p className="text-blue-100 text-sm mt-1">Complete information</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-500 rounded-full text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">

          {/* PROFILE */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl font-black text-blue-700 border-4 border-white shadow-lg">
              {student.firstName?.[0]}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">{student.firstName} {student.lastName}</h3>
              <p className="text-slate-600 text-sm mt-1">{student.id}</p>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* PERSONAL INFO */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">Email</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{student.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">Phone</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{student.phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* ACADEMIC INFO */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4">Academic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">Program</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{student.course || student.standard || '-'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">Section</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{student.section || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50 px-8 py-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition">
            Close
          </button>
          <button onClick={onEdit} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:shadow-lg transition flex items-center justify-center gap-2">
            <Edit size={18} /> Edit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ student, onClose, onConfirm }) => {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center border border-slate-100">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Delete Student?</h3>
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete <strong>{student.firstName} {student.lastName}</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StudentForm;
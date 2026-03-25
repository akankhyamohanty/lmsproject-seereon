import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 👈 ADDED AXIOS
import {
  getExamStatus,     // Keep your helper functions
  STATUS_META,
  SEMESTER_OPTIONS,
  BATCH_OPTIONS,
  YEAR_OPTIONS,
} from "./Examstorage.jsx"; // Assuming these are still in this file

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Select = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const Examlist = () => {
  const navigate = useNavigate();
  const [exams, setExams]       = useState([]);
  const [filters, setFilters]   = useState({ semester: "", batch: "", year: "", status: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading]   = useState(true); // 👈 Added loading state

  // 🚀 DYNAMIC FETCH FROM MYSQL
  const fetchExams = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem('token'); 
      if (!token) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        token = storedUser?.token || storedUser?.data?.token; 
      }
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/admin/exams", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setExams(response.data.exams || []);
      }
    } catch (err) {
      console.error("Fetch Exams Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const setFilter = (field) => (e) =>
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  const confirmDelete = (id) => setDeleteId(id);

  // 🚀 DYNAMIC DELETE TO MYSQL
  const handleDelete = async () => {
    try {
      let token = localStorage.getItem('token'); 
      if (!token) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        token = storedUser?.token || storedUser?.data?.token; 
      }

      await axios.delete(`http://localhost:5000/api/admin/exams/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update UI instantly
      setExams(exams.filter((e) => e.id !== deleteId));
      setDeleteId(null);
      
    } catch (err) {
      console.error("Delete Exam Error:", err);
      alert("Failed to delete exam.");
    }
  };

  // Ensure 'enriched' waits for exams to exist before calculating
  const enriched = exams.map((ex) => ({
    ...ex,
    status: getExamStatus(ex.examDate || ex.exam_date, ex.startTime || ex.start_time, ex.duration),
  }));

  const total     = enriched.length;
  const upcoming  = enriched.filter((e) => e.status === "UPCOMING").length;
  const ongoing   = enriched.filter((e) => e.status === "ONGOING").length;
  const completed = enriched.filter((e) => e.status === "COMPLETED").length;

  const filtered = enriched.filter((ex) => {
    if (filters.semester && String(ex.semester) !== String(filters.semester)) return false;
    if (filters.batch    && String(ex.batch)    !== String(filters.batch))    return false;
    if (filters.year     && String(ex.year)     !== String(filters.year))     return false;
    if (filters.status   && ex.status   !== filters.status)   return false;
    return true;
  });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schedule exams and build question papers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/admin/exams/create")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95"
          >
            + Schedule Exam
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Exams" value={total}     icon="📋" color="bg-indigo-50" />
        <StatCard label="Upcoming"    value={upcoming}  icon="🗓" color="bg-blue-50"   />
        <StatCard label="Ongoing"     value={ongoing}   icon="⏳" color="bg-green-50"  />
        <StatCard label="Completed"   value={completed} icon="✅" color="bg-gray-50"   />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-gray-600">Filter:</span>
        <Select value={filters.semester} onChange={setFilter("semester")} options={SEMESTER_OPTIONS} placeholder="All Semesters" />
        <Select value={filters.batch}    onChange={setFilter("batch")}    options={BATCH_OPTIONS}    placeholder="All Batches"   />
        <Select value={filters.year}     onChange={setFilter("year")}     options={YEAR_OPTIONS}     placeholder="All Years"     />
        <Select
          value={filters.status}
          onChange={setFilter("status")}
          options={[
            { value: "UPCOMING",  label: "Upcoming"  },
            { value: "ONGOING",   label: "Ongoing"   },
            { value: "COMPLETED", label: "Completed" },
          ]}
          placeholder="All Status"
        />
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => setFilters({ semester: "", batch: "", year: "", status: "" })}
            className="text-sm text-red-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Exam Cards ── */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-bold">Loading Exams...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-gray-400 text-left">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold text-gray-600">
            {exams.length === 0 ? "No exams scheduled yet" : "No exams match the filters"}
          </p>
          <p className="text-sm mt-1">
            {exams.length === 0 ? "Click 'Schedule Exam' to get started" : "Try adjusting the filters"}
          </p>
          {exams.length === 0 && (
            <button
              onClick={() => navigate("/admin/exams/create")}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              + Schedule Exam
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ex) => {
            const sm = STATUS_META[ex.status] || { bg: "#f3f4f6", color: "#4b5563", dot: "#9ca3af", label: "Unknown" };
            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-semibold text-gray-800 truncate">{ex.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ex.subject} · {ex.examType?.replace("_", " ")}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    style={{ background: sm.bg, color: sm.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                    {sm.label}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Semester", value: `Sem ${ex.semester}`     },
                    { label: "Batch",    value: `Batch ${ex.batch}`      },
                    { label: "Year",     value: ex.year                  },
                    { label: "Date",     value: formatDate(ex.examDate || ex.exam_date)  },
                    { label: "Time",     value: formatTime(ex.startTime || ex.start_time) },
                    { label: "Duration", value: `${ex.duration} min`     },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Marks row */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <span className="text-gray-500">
                    Total Marks: <strong className="text-gray-700">{ex.totalMarks || ex.total_marks}</strong>
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">
                    Passing: <strong className="text-gray-700">{ex.passingMarks || ex.passing_marks}</strong>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate("/admin/exams/results", { state: { examId: ex.id } })}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    📊 Results
                  </button>
                  <button
                    onClick={() => navigate("/admin/exams/questions", { state: { semester: ex.semester, batch: ex.batch, year: ex.year } })}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
                  >
                    📚 Questions
                  </button>
                  <button
                    onClick={() => navigate("/admin/exams/create", { state: { exam: ex } })}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(ex.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <p className="text-lg font-semibold text-gray-800 mb-2">Delete Exam?</p>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove the exam and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Examlist;
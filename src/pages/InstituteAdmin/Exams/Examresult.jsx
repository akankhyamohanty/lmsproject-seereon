import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  EXAM_LIST_KEY,
  EXAM_RESULTS_KEY,
  loadFromStorage,
  saveToStorage,
  MOCK_STUDENTS,
} from "./Examstorage.jsx";

// ─── Grade Calculator ─────────────────────────────────────────────────────────
const getGrade = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return { grade: "O",  color: "text-purple-600 font-bold" };
  if (pct >= 80) return { grade: "A+", color: "text-blue-600 font-bold"   };
  if (pct >= 70) return { grade: "A",  color: "text-green-600 font-bold"  };
  if (pct >= 60) return { grade: "B+", color: "text-teal-600 font-bold"   };
  if (pct >= 50) return { grade: "B",  color: "text-yellow-600 font-bold" };
  if (pct >= 40) return { grade: "C",  color: "text-orange-600 font-bold" };
  return           { grade: "F",  color: "text-red-600 font-bold"   };
};

// ─── Component ────────────────────────────────────────────────────────────────
const Examresult = () => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const defaultExam = location.state?.examId || "";

  const [exams, setExams]               = useState([]);
  const [selectedExam, setSelectedExam] = useState(defaultExam);
  const [results, setResults]           = useState({});
  const [errors, setErrors]             = useState({});
  const [saved, setSaved]               = useState(false);

  useEffect(() => {
    setExams(loadFromStorage(EXAM_LIST_KEY, []));
    setResults(loadFromStorage(EXAM_RESULTS_KEY, {}));
  }, []);

  const exam        = exams.find((e) => String(e.id) === String(selectedExam));
  const examResults = results[selectedExam] || {};
  const passMark    = exam ? Number(exam.passingMarks) : 0;

  // ── Setters ───────────────────────────────────────────────────────────────
  const setMark = (studentId, value) => {
    setResults((prev) => ({
      ...prev,
      [selectedExam]: {
        ...prev[selectedExam],
        [studentId]: { ...prev[selectedExam]?.[studentId], marks: value, absent: false },
      },
    }));
    setErrors((prev) => { const e = { ...prev }; delete e[studentId]; return e; });
  };

  const toggleAbsent = (studentId) => {
    const isAbsent = examResults[studentId]?.absent;
    setResults((prev) => ({
      ...prev,
      [selectedExam]: {
        ...prev[selectedExam],
        [studentId]: { marks: "", absent: !isAbsent },
      },
    }));
    setErrors((prev) => { const e = { ...prev }; delete e[studentId]; return e; });
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    MOCK_STUDENTS.forEach((s) => {
      const row = examResults[s.id];
      if (row?.absent) return;
      const m = row?.marks;
      if (m === "" || m === undefined)                 { e[s.id] = "Enter marks or mark absent"; return; }
      if (isNaN(m) || Number(m) < 0)                  { e[s.id] = "Invalid marks"; return; }
      if (exam && Number(m) > Number(exam.totalMarks)) { e[s.id] = `Max is ${exam.totalMarks}`; return; }
    });
    return e;
  };

  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    saveToStorage(EXAM_RESULTS_KEY, results);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Summary Stats ─────────────────────────────────────────────────────────
  const appeared = MOCK_STUDENTS.filter((s) => !examResults[s.id]?.absent).length;
  const absent   = MOCK_STUDENTS.length - appeared;
  const passed   = MOCK_STUDENTS.filter((s) => {
    const m = Number(examResults[s.id]?.marks);
    return !examResults[s.id]?.absent && !isNaN(m) && m >= passMark;
  }).length;
  const failed = appeared - passed;

  const allMarks = MOCK_STUDENTS
    .filter((s) => !examResults[s.id]?.absent && examResults[s.id]?.marks !== "" && examResults[s.id]?.marks !== undefined)
    .map((s) => Number(examResults[s.id]?.marks))
    .filter((m) => !isNaN(m));

  const avg     = allMarks.length ? (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(1) : "—";
  const highest = allMarks.length ? Math.max(...allMarks) : "—";
  const lowest  = allMarks.length ? Math.min(...allMarks) : "—";

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/exams")}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-lg"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Exam Results</h1>
          <p className="text-sm text-gray-500">Enter and manage student marks</p>
        </div>
      </div>

      {/* Exam Selector */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-5 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm text-left font-medium text-gray-700 mb-1">
              Select Exam <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedExam}
              onChange={(e) => { setSelectedExam(e.target.value); setErrors({}); setSaved(false); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Choose an exam —</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} | Sem {ex.semester} | Batch {ex.batch} | {ex.year}
                </option>
              ))}
            </select>
          </div>

          {/* Exam meta pills */}
          {exam && (
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "📅", label: formatDate(exam.examDate)   },
                { icon: "⏱",  label: `${exam.duration} min`      },
                { icon: "📊", label: `Total: ${exam.totalMarks}` },
                { icon: "✅", label: `Pass: ${exam.passingMarks}`},
                { icon: "🏢", label: exam.venue || "—"           },
              ].map(({ icon, label }) => (
                <span key={label} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                  {icon} {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        {exam?.instructions && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 text-xs text-amber-700">
            📋 <strong>Instructions:</strong> {exam.instructions}
          </div>
        )}
      </div>

      {/* Empty state */}
      {!selectedExam && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-gray-400">
          <p className="text-5xl mb-3">📝</p>
          <p className="font-semibold text-gray-600 text-lg">Select an exam to enter results</p>
          <p className="text-sm mt-1">Choose from the dropdown above</p>
          {exams.length === 0 && (
            <button
              onClick={() => navigate("/admin/exams/create")}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              Schedule an Exam First
            </button>
          )}
        </div>
      )}

      {selectedExam && exam && (
        <>
          {/* Summary Stats — left-aligned values */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
            {[
              { label: "Total",    value: MOCK_STUDENTS.length, bg: "bg-gray-50",   text: "text-gray-700"   },
              { label: "Appeared", value: appeared,             bg: "bg-blue-50",   text: "text-blue-700"   },
              { label: "Absent",   value: absent,               bg: "bg-orange-50", text: "text-orange-600" },
              { label: "Passed",   value: passed,               bg: "bg-green-50",  text: "text-green-700"  },
              { label: "Failed",   value: failed,               bg: "bg-red-50",    text: "text-red-600"    },
              { label: "Average",  value: avg,                  bg: "bg-purple-50", text: "text-purple-700" },
            ].map(({ label, value, bg, text }) => (
              <div key={label} className={`${bg} rounded-xl p-3 border border-white shadow-sm`}>
                <p className={`text-2xl font-bold ${text}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Range bar */}
          {allMarks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 mb-5 flex flex-wrap gap-6 text-sm">
              <span className="text-gray-500">🏆 Highest: <strong className="text-green-600">{highest}</strong></span>
              <span className="text-gray-500">📉 Lowest:  <strong className="text-red-500">{lowest}</strong></span>
              <span className="text-gray-500">📊 Average: <strong className="text-blue-600">{avg}</strong></span>
              <span className="text-gray-500">
                📈 Pass Rate:{" "}
                <strong className="text-purple-600">
                  {appeared > 0 ? ((passed / appeared) * 100).toFixed(0) : 0}%
                </strong>
              </span>
            </div>
          )}

          {/* Success Toast */}
          {saved && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              ✅ Results saved successfully!
            </div>
          )}

          {/* Marks Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium w-10">#</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Student</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Roll No</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">
                      Marks <span className="text-gray-400 font-normal">/ {exam.totalMarks}</span>
                    </th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">%</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Grade</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Absent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_STUDENTS.map((student, idx) => {
                    const row       = examResults[student.id] || {};
                    const isAbsent  = !!row.absent;
                    const marksVal  = row.marks;
                    const numMarks  = Number(marksVal);
                    const hasMarks  = !isAbsent && marksVal !== "" && marksVal !== undefined && !isNaN(numMarks);
                    const isPassed  = hasMarks && numMarks >= passMark;
                    const isFailed  = hasMarks && numMarks < passMark;
                    const pct       = hasMarks ? ((numMarks / Number(exam.totalMarks)) * 100).toFixed(1) : null;
                    const gradeInfo = hasMarks ? getGrade(numMarks, Number(exam.totalMarks)) : null;

                    return (
                      <tr
                        key={student.id}
                        className={`transition-colors hover:bg-gray-50/60 ${isAbsent ? "opacity-50 bg-orange-50/30" : ""}`}
                      >
                        {/* # */}
                        <td className="px-4 py-3 text-left text-gray-400 text-xs">{idx + 1}</td>

                        {/* Student */}
                        <td className="px-4 py-3 text-left">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{student.name}</span>
                          </div>
                        </td>

                        {/* Roll No */}
                        <td className="px-4 py-3 text-left text-gray-500">{student.rollNo}</td>

                        {/* Marks Input */}
                        <td className="px-4 py-3 text-left">
                          <div className="flex flex-col items-start">
                            <input
                              type="number"
                              value={isAbsent ? "" : (marksVal ?? "")}
                              onChange={(e) => setMark(student.id, e.target.value)}
                              disabled={isAbsent}
                              min="0"
                              max={exam.totalMarks}
                              placeholder={isAbsent ? "—" : "0"}
                              className={`w-20 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
                                ${errors[student.id] ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                            {errors[student.id] && (
                              <p className="text-red-500 text-xs mt-1 leading-tight">
                                {errors[student.id]}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Percentage */}
                        <td className="px-4 py-3 text-left text-gray-500 text-xs">
                          {pct !== null ? `${pct}%` : <span className="text-gray-300">—</span>}
                        </td>

                        {/* Grade */}
                        <td className="px-4 py-3 text-left">
                          {gradeInfo
                            ? <span className={gradeInfo.color}>{gradeInfo.grade}</span>
                            : <span className="text-gray-300">—</span>
                          }
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3 text-left">
                          {isAbsent ? (
                            <span className="px-2.5 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">Absent</span>
                          ) : isPassed ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Pass</span>
                          ) : isFailed ? (
                            <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">Fail</span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Absent Toggle */}
                        <td className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={isAbsent}
                            onChange={() => toggleAbsent(student.id)}
                            className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              * All marks are saved to local storage and persist across sessions
            </p>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
            >
              💾 Save Results
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Examresult;
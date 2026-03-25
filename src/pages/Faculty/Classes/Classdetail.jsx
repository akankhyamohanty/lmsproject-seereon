import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, BookOpen, Users, CheckCircle,
  XCircle, Clock, GraduationCap, ClipboardList, BarChart2,
  FileText, AlertCircle, Eye,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const STUDENTS = [
  { id: 1, name: "Alice Johnson",   studentId: "STU-001", grade: "A",  attendance: "96%" },
  { id: 2, name: "Bob Martinez",    studentId: "STU-002", grade: "B+", attendance: "88%" },
  { id: 3, name: "Clara Smith",     studentId: "STU-003", grade: "A-", attendance: "92%" },
  { id: 4, name: "David Lee",       studentId: "STU-004", grade: "B",  attendance: "79%" },
  { id: 5, name: "Eva Gonzalez",    studentId: "STU-005", grade: "A+", attendance: "98%" },
  { id: 6, name: "Frank Brown",     studentId: "STU-006", grade: "C+", attendance: "74%" },
  { id: 7, name: "Grace Kim",       studentId: "STU-007", grade: "A",  attendance: "95%" },
  { id: 8, name: "Henry Wilson",    studentId: "STU-008", grade: "B-", attendance: "82%" },
];

const ASSIGNMENTS = [
  { id: 1, title: "Chapter 3 Problem Set",   dueDate: "2026-03-05", submitted: 28, total: 32, status: "active" },
  { id: 2, title: "Midterm Exam",            dueDate: "2026-02-20", submitted: 32, total: 32, status: "graded" },
  { id: 3, title: "Integration Worksheet",   dueDate: "2026-02-10", submitted: 30, total: 32, status: "graded" },
  { id: 4, title: "Final Project Proposal",  dueDate: "2026-03-20", submitted: 0,  total: 32, status: "upcoming" },
];

const STATUS = { PRESENT: "present", ABSENT: "absent", LATE: "late" };

const statusConfig = {
  present: { label: "Present", icon: CheckCircle, pill: "bg-green-100 text-green-700 border-green-200", iconCls: "text-green-500", dot: "bg-green-400" },
  absent:  { label: "Absent",  icon: XCircle,      pill: "bg-red-100 text-red-700 border-red-200",     iconCls: "text-red-500",   dot: "bg-red-400"   },
  late:    { label: "Late",    icon: Clock,         pill: "bg-amber-100 text-amber-700 border-amber-200", iconCls: "text-amber-500", dot: "bg-amber-400" },
};

const assignmentStatus = {
  active:   { label: "Active",   cls: "bg-blue-100 text-blue-700"   },
  graded:   { label: "Graded",   cls: "bg-green-100 text-green-700" },
  upcoming: { label: "Upcoming", cls: "bg-gray-100 text-gray-600"   },
};

// ─── Avatar ──────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = "md" }) => {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0`}>
      {name.charAt(0)}
    </div>
  );
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ cls }) => (
  <div className="space-y-5">
    {/* Stat row */}
    <div className="grid  grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {[
        { label: "Course Name",    value: cls.courseName,   icon: BookOpen },
        { label: "Class / Section",value: cls.classSection, icon: GraduationCap },
        { label: "Subject",        value: cls.subject,      icon: ClipboardList },
        { label: "Total Students", value: cls.students,     icon: Users },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      ))}
    </div>

    {/* Schedule + Quick Stats */}
    <div className="grid text-left lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-gray-800">Schedule Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Schedule</p>
              <p className="text-sm font-bold text-gray-900">{cls.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Academic Year</p>
              <p className="text-sm font-bold text-gray-900">{cls.academicYear}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-gray-800">Quick Stats</h3>
        <div className="space-y-3">
          {[
            { label: "Avg. Attendance", value: "88%",  bar: 88  },
            { label: "Assignments Due", value: "1",    bar: 25  },
            { label: "Class Progress",  value: "62%",  bar: 62  },
          ].map(({ label, value, bar }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>{label}</span><span className="font-bold text-gray-900">{value}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Student Detail Modal ─────────────────────────────────────────────────────
const StudentModal = ({ student, onClose }) => {
  if (!student) return null;
  const gradeColor = student.grade.startsWith("A")
    ? "bg-green-100 text-green-700"
    : student.grade.startsWith("B")
    ? "bg-blue-100 text-blue-700"
    : "bg-amber-100 text-amber-700";
  const attNum = parseInt(student.attendance);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal blue header */}
        <div className="bg-blue-600 px-6 pt-6 pb-10 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition text-lg font-bold"
          >
            ×
          </button>
          <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-black mx-auto mb-3">
            {student.name.charAt(0)}
          </div>
          <h2 className="text-xl font-black text-white">{student.name}</h2>
          <p className="text-blue-200 text-xs font-mono mt-1">{student.studentId}</p>
        </div>

        {/* Stats */}
        <div className="px-6 -mt-5 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md grid grid-cols-2 divide-x divide-gray-100 overflow-hidden">
            <div className="p-4 text-center">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Grade</p>
              <span className={`px-3 py-1 rounded-lg text-sm font-black ${gradeColor}`}>{student.grade}</span>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Attendance</p>
              <p className="text-sm font-black text-gray-900">{student.attendance}</p>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Attendance Progress</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${attNum >= 90 ? "bg-green-500" : attNum >= 75 ? "bg-blue-500" : "bg-amber-500"}`}
                style={{ width: student.attendance }}
              />
            </div>
            <p className="text-xs text-gray-400">{attNum >= 90 ? "Excellent" : attNum >= 75 ? "Good" : "Needs Improvement"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Student ID",  value: student.studentId },
              { label: "Current Grade", value: student.grade },
              { label: "Assignments Submitted", value: "12/14" },
              { label: "Last Active", value: "Feb 25, 2026" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-sm font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Students Tab ─────────────────────────────────────────────────────────────
const StudentsTab = () => {
  const [selected, setSelected] = useState(null);

  return (
    <>
      {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Enrolled Students</h3>
          <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{STUDENTS.length} students</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60 text-xs text-gray-400 uppercase tracking-wide font-semibold">
                <th className="text-left px-6 py-3">Student</th>
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3">Grade</th>
                <th className="text-left px-6 py-3">Attendance</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STUDENTS.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <span className="font-semibold text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 font-mono text-xs">{s.studentId}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${s.grade.startsWith("A") ? "bg-green-100 text-green-700" : s.grade.startsWith("B") ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                      {s.grade}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: s.attendance }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{s.attendance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => setSelected(s)}
                      className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// ─── Attendance Tab ───────────────────────────────────────────────────────────
const AttendanceTab = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState(() =>
    Object.fromEntries(STUDENTS.map((s) => [s.id, null]))
  );
  const [saved, setSaved] = useState(false);

  const mark = (id, status) => {
    setSaved(false);
    setAttendance((p) => ({ ...p, [id]: p[id] === status ? null : status }));
  };
  const markAll = (status) => {
    setSaved(false);
    setAttendance(Object.fromEntries(STUDENTS.map((s) => [s.id, status])));
  };

  const counts = Object.values(attendance).reduce(
    (acc, v) => { if (v) acc[v]++; return acc; },
    { present: 0, absent: 0, late: 0 }
  );
  const total = STUDENTS.length;
  const marked = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-4 h-4 text-blue-500" />
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
          <input
            type="date" value={date} max={today}
            onChange={(e) => { setDate(e.target.value); setSaved(false); }}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mark all:</span>
          {Object.values(STATUS).map((s) => (
            <button key={s} onClick={() => markAll(s)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${statusConfig[s].pill}`}>
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.values(STATUS).map((s) => {
          const cfg = statusConfig[s]; const Icon = cfg.icon;
          return (
            <div key={s} className={`flex items-center gap-3 p-4 rounded-2xl border ${cfg.pill} shadow-sm`}>
              <Icon className={`w-5 h-5 ${cfg.iconCls}`} />
              <div>
                <p className="text-xs font-semibold opacity-70">{cfg.label}</p>
                <p className="text-xl font-black">{counts[s]}</p>
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <AlertCircle className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-400">Unmarked</p>
            <p className="text-xl font-black text-gray-700">{total - marked}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">
            {new Date(date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </h3>
          <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{marked}/{total} marked</span>
        </div>
        <div className="divide-y divide-gray-50">
          {STUDENTS.map((student) => {
            const current = attendance[student.id];
            return (
              <div key={student.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{student.studentId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {Object.values(STATUS).map((s) => {
                    const cfg = statusConfig[s]; const Icon = cfg.icon; const isActive = current === s;
                    return (
                      <button key={s} onClick={() => mark(student.id, s)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${isActive ? cfg.pill : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 bg-white"}`}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? cfg.iconCls : ""}`} />
                        <span className="hidden sm:inline">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={() => { console.log("Save", date, attendance); setSaved(true); }}
          disabled={marked === 0}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm">
          Save Attendance
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-semibold">
            <CheckCircle className="w-4 h-4" /> Saved successfully
          </span>
        )}
      </div>
    </div>
  );
};

// ─── New Assignment Modal ─────────────────────────────────────────────────────
const NewAssignmentModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ title: "", dueDate: "", status: "upcoming" });
  const [error, setError] = useState("");

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.dueDate) return setError("Due date is required.");
    setError("");
    onAdd({ id: Date.now(), title: form.title.trim(), dueDate: form.dueDate, status: form.status, submitted: 0, total: 32 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Blue header */}
        <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-black text-white">New Assignment</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition text-lg font-bold">×</button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</label>
            <input
              name="title" value={form.title} onChange={handle}
              placeholder="e.g. Chapter 4 Problem Set"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
            <input
              type="date" name="dueDate" value={form.dueDate} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
            <select
              name="status" value={form.status} onChange={handle}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="graded">Graded</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition">Add Assignment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Assignments Tab ──────────────────────────────────────────────────────────
const AssignmentsTab = () => {
  const [assignments, setAssignments] = useState(ASSIGNMENTS);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (newAssignment) => setAssignments((p) => [newAssignment, ...p]);

  return (
    <>
      {showModal && <NewAssignmentModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Assignments</h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
            >
              + New
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {assignments.map((a) => {
              const st = assignmentStatus[a.status];
              const pct = Math.round((a.submitted / a.total) * 100);
              return (
                <div key={a.id} className="px-6 py-4 hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">{a.title}</p>
                        <p className="text-xs text-gray-400">Due {new Date(a.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="mt-3 ml-12 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                      <span>Submissions</span>
                      <span className="font-bold text-gray-700">{a.submitted}/{a.total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export const ClassDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { state } = useLocation();
  const navigate = useNavigate();

  const cls = state?.cls || {
    courseName: "Advanced Mathematics",
    classSection: "Grade 10 - A",
    subject: "Mathematics",
    academicYear: "2025-2026",
    schedule: "Mon, Wed, Fri - 08:00 AM",
    students: 32,
  };

  const tabs = [
    { key: "overview",     label: "Overview",     icon: BarChart2     },
    { key: "students",     label: "Students",     icon: Users         },
    { key: "attendance",   label: "Attendance",   icon: CheckCircle   },
    { key: "assignments",  label: "Assignments",  icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Blue Hero Header ── */}
      <div className="bg-blue-600 px-6 pt-6 pb-20">
        <button
          onClick={() => navigate("/faculty/classes")}
          className="flex items-center gap-2 text-blue-100 hover:text-white transition text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Classes
        </button>

        <div className="max-w-8xl mx-auto space-y-3">
          <div className="flex flex-col items-start gap-3 w-full">
            <h1 className="text-3xl font-black text-white tracking-tight text-left">{cls.courseName}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/20 text-white border border-white/30 rounded-full px-3 py-0.5 text-xs font-semibold backdrop-blur">
                {cls.classSection}
              </span>
              <span className="bg-white/20 text-white border border-white/30 rounded-full px-3 py-0.5 text-xs font-semibold backdrop-blur">
                {cls.subject}
              </span>
              <span className="bg-white/20 text-white border border-white/30 rounded-full px-3 py-0.5 text-xs font-semibold backdrop-blur">
                {cls.academicYear}
              </span>
              <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-0.5 backdrop-blur">
                <Users className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-semibold">{cls.students} students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Tab Bar ── */}
      <div className="max-w-8xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-1.5 flex gap-1 w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-8xl mx-auto px-6 py-6">
        {activeTab === "overview"    && <OverviewTab cls={cls} />}
        {activeTab === "students"    && <StudentsTab />}
        {activeTab === "attendance"  && <AttendanceTab />}
        {activeTab === "assignments" && <AssignmentsTab />}
      </div>
    </div>
  );
};
import { useState, useRef } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const Clock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const FileCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
  </svg>
);
const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const Upload = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const CalendarDays = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const Award = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const Paperclip = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);
const X = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const FileText = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const mockAssignments = [
  { id: 1, title: "Calculus Problem Set 5",         course: "Advanced Mathematics", dueDate: "Jan 30, 2026", status: "pending",   maximumMarks: 100 },
  { id: 2, title: "Physics Lab Report - Mechanics", course: "Physics",              dueDate: "Feb 2, 2026",  status: "pending",   maximumMarks: 100 },
  { id: 3, title: "Data Structures Implementation", course: "Computer Science",     dueDate: "Jan 28, 2026", status: "submitted", maximumMarks: 100 },
  { id: 4, title: "Linear Algebra Assignment 3",    course: "Advanced Mathematics", dueDate: "Jan 20, 2026", status: "evaluated", maximumMarks: 100 },
];

const MOCK_DETAILS = {
  1: { id: 1, title: "Calculus Problem Set 5", course: "Advanced Mathematics", section: "Calculus Fundamentals", dueDate: "Jan 30, 2026", maximumMarks: 100, status: "pending", instructions: "Solve all problems from Chapter 5. Show all working steps clearly.", description: "This assignment covers integration techniques, partial fractions, and applications of integrals. Please ensure all steps are clearly shown for full credit." },
  2: { id: 2, title: "Physics Lab Report - Mechanics", course: "Physics", section: "Mechanics Fundamentals", dueDate: "Feb 2, 2026", maximumMarks: 100, status: "pending", instructions: "Write a comprehensive lab report on the mechanics experiment.", description: "Include methodology, observations, calculations, and conclusions." },
  3: { id: 3, title: "Data Structures Implementation", course: "Computer Science", section: "Advanced Data Structures", dueDate: "Jan 28, 2026", maximumMarks: 100, status: "submitted", instructions: "Implement the required data structures in your preferred language.", description: "Submit source code and documentation for the implementation." },
  4: { id: 4, title: "Linear Algebra Assignment 3", course: "Advanced Mathematics", section: "Linear Algebra", dueDate: "Jan 20, 2026", maximumMarks: 100, status: "evaluated", instructions: "Solve matrix problems and provide proofs for theorems.", description: "All work must be shown. Partial credit will be given for correct methodology." },
};

const STATUS_STYLES = {
  pending:   "bg-orange-100 text-orange-700 border border-orange-300",
  submitted: "bg-blue-100 text-blue-700 border border-blue-300",
  evaluated: "bg-green-100 text-green-700 border border-green-300",
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
];
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".png", ".jpg", ".jpeg"];
const MAX_SIZE_MB = 10;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["png", "jpg", "jpeg"].includes(ext)) return "🖼️";
  return "📎";
}

const StatusIcon = ({ status, className = "w-4 h-4" }) => {
  if (status === "pending")   return <Clock className={className} />;
  if (status === "submitted") return <FileCheck className={className} />;
  if (status === "evaluated") return <CheckCircle className={className} />;
  return null;
};

// ── File Upload Zone ───────────────────────────────────────────────────────
function FileUploadZone({ files, onChange, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const validate = (file) => {
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.some(e => file.name.toLowerCase().endsWith(e))) {
      return `"${file.name}" is not an allowed file type.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `"${file.name}" exceeds the ${MAX_SIZE_MB} MB limit.`;
    }
    return null;
  };

  const addFiles = (newFiles) => {
    setError("");
    const arr = Array.from(newFiles);
    for (const f of arr) {
      const err = validate(f);
      if (err) { setError(err); return; }
    }
    // Deduplicate by name
    onChange(prev => {
      const existing = new Set(prev.map(f => f.name));
      const unique = arr.filter(f => !existing.has(f.name));
      return [...prev, ...unique];
    });
  };

  const remove = (name) => onChange(prev => prev.filter(f => f.name !== name));

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); if (!disabled) addFiles(e.dataTransfer.files); }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer select-none
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
          : dragOver ? "border-blue-400 bg-blue-50 scale-[1.01]"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 bg-white"}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_EXT.join(",")}
          className="hidden"
          disabled={disabled}
          onChange={e => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors
          ${dragOver ? "bg-blue-100" : "bg-gray-100"}`}>
          <Upload className={`w-6 h-6 ${dragOver ? "text-blue-500" : "text-gray-400"}`} />
        </div>
        <p className="text-md font-semibold text-gray-700 mb-1">
          {dragOver ? "Drop files here" : "Click to upload or drag & drop"}
        </p>
        <p className="text-sm text-gray-400">PDF, DOC, DOCX, XLS, XLSX, TXT, PNG, JPG · Max {MAX_SIZE_MB} MB per file</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <X className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Attached Files ({files.length})
          </p>
          {files.map(file => (
            <div key={file.name} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group">
              <span className="text-xl leading-none">{getFileIcon(file.name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold text-gray-800 truncate">{file.name}</p>
                <p className="text-sm text-gray-400">{formatBytes(file.size)}</p>
              </div>
              {!disabled && (
                <button
                  onClick={e => { e.stopPropagation(); remove(file.name); }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Assignment List ────────────────────────────────────────────────────────
function AssignmentList({ assignments, onView }) {
  const [filterStatus, setFilterStatus] = useState("all");

  const pendingCount   = assignments.filter(a => a.status === "pending").length;
  const submittedCount = assignments.filter(a => a.status === "submitted").length;
  const evaluatedCount = assignments.filter(a => a.status === "evaluated").length;
  const filtered = filterStatus === "all" ? assignments : assignments.filter(a => a.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Assignments</h1>
          <p className="text-md text-gray-500">View and submit your assignments</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending",   count: pendingCount,   icon: Clock,       bg: "bg-orange-100", iconColor: "text-orange-600" },
            { label: "Submitted", count: submittedCount, icon: FileCheck,   bg: "bg-blue-100",   iconColor: "text-blue-600" },
            { label: "Evaluated", count: evaluatedCount, icon: CheckCircle, bg: "bg-green-100",  iconColor: "text-green-600" },
          ].map(({ label, count, icon: Icon, bg, iconColor }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-md text-gray-500 font-medium">{label}</p>
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-base font-semibold text-gray-800">All Assignments</h2>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-md text-gray-700 outline-none bg-white cursor-pointer"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="evaluated">Evaluated</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-md">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Assignment Title</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Course</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Due Date</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-md text-gray-400">No assignments found.</td></tr>
                ) : filtered.map((a, idx) => (
                  <tr key={a.id} className={`hover:bg-gray-50 transition-colors ${idx !== filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{a.title}</span>
                        {a.submittedFiles?.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                            <Paperclip className="w-3 h-3" />{a.submittedFiles.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{a.course}</td>
                    <td className="px-5 py-4 text-gray-600">{a.dueDate}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_STYLES[a.status] ?? "bg-gray-100 text-gray-600"}`}>
                        <StatusIcon status={a.status} />
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => onView(a)} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors text-md">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Assignment Detail ──────────────────────────────────────────────────────
function AssignmentDetails({ assignment: base, onBack, onSubmitted }) {
  const [assignment, setAssignment] = useState({ ...base, ...MOCK_DETAILS[base.id] });
  const [files, setFiles]           = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt]   = useState(null);
  const [submitError, setSubmitError]   = useState("");

  const isSubmitted = assignment.status === "submitted";
  const isEvaluated = assignment.status === "evaluated";
  const canSubmit   = assignment.status === "pending";

  const handleSubmit = async () => {
    if (files.length === 0) { setSubmitError("Please attach at least one file before submitting."); return; }
    setSubmitError("");
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const updated = { ...assignment, status: "submitted", submittedFiles: files.map(f => ({ name: f.name, size: f.size })) };
    setAssignment(updated);
    setSubmittedAt(`${dateStr} at ${timeStr}`);
    setIsSubmitting(false);
    onSubmitted?.(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-md font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-left">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 text-left">
            <div className="flex items-start justify-between gap-4 flex-wrap text-left">
              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-xl font-bold text-gray-900 mb-1 leading-tight text-left">{assignment.title}</h1>
                <p className="text-md text-gray-500">{assignment.course}{assignment.section ? ` • ${assignment.section}` : ""}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-left text-sm font-semibold flex-shrink-0 ${STATUS_STYLES[assignment.status] ?? "bg-gray-100 text-gray-600"}`}>
                <StatusIcon status={assignment.status} />
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Due Date</p>
                <p className="text-md font-bold text-gray-900">{assignment.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium text-left">Maximum Marks</p>
                <p className="text-md font-bold text-gray-900 text-left">{assignment.maximumMarks}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 border-b border-gray-200 space-y-3">
            <h2 className="text-md font-bold text-gray-800 uppercase tracking-wide text-left">Instructions</h2>
            <p className="text-md text-gray-700 leading-relaxed text-left">{assignment.instructions}</p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
              <p className="text-md text-gray-700 leading-relaxed text-left">{assignment.description}</p>
            </div>
          </div>

          {/* Submit / Status */}
          <div className="p-6 space-y-5">

            {/* ── Evaluated ─────────────────────────────────────────────── */}
            {isEvaluated && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-base font-bold text-green-700 mb-1">Assignment Evaluated</p>
                <p className="text-md text-green-600">Your marks have been updated. Check your results page.</p>
              </div>
            )}

            {/* ── Submitted ─────────────────────────────────────────────── */}
            {isSubmitted && !isEvaluated && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <FileCheck className="w-10 h-10 text-blue-500 mb-3" />
                  <p className="text-base font-bold text-blue-700 mb-1">Assignment Submitted!</p>
                  <p className="text-md text-blue-600">Your assignment is awaiting evaluation.</p>
                  {submittedAt && (
                    <p className="text-sm text-blue-500 mt-2 pt-2 border-t border-blue-200 w-full">
                      Submitted on {submittedAt}
                    </p>
                  )}
                </div>
                {/* Show submitted files */}
                {assignment.submittedFiles?.length > 0 && (
                  <div className="mt-2 pt-4 border-t border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5" /> Submitted Files ({assignment.submittedFiles.length})
                    </p>
                    <div className="space-y-2">
                      {assignment.submittedFiles.map(f => (
                        <div key={f.name} className="flex items-center gap-2.5 p-2.5 bg-white border border-blue-100 rounded-lg">
                          <span className="text-lg leading-none">{getFileIcon(f.name)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">{f.name}</p>
                            <p className="text-sm text-gray-400">{formatBytes(f.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Pending — Upload + Submit ─────────────────────────────── */}
            {canSubmit && (
              <div className="space-y-5">
                {/* Upload section */}
                <div>
                  <h3 className="text-md font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-500" /> Attach Files
                  </h3>
                  <FileUploadZone files={files} onChange={setFiles} disabled={isSubmitting} />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Submit error */}
                {submitError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{submitError}</p>
                  </div>
                )}

                <p className="text-md text-gray-500">
                  Upload your completed assignment file(s) above, then click submit. You cannot change your submission after submitting.
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || files.length === 0}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-md text-white flex items-center justify-center gap-2.5 transition-all duration-200
                    ${isSubmitting ? "bg-gray-400 cursor-not-allowed"
                    : files.length === 0 ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"}`}
                >
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Submitting...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Submit Assignment {files.length > 0 && `(${files.length} file${files.length > 1 ? "s" : ""})`}</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-bold text-gray-800 uppercase tracking-wide mb-4 text-left">Submission Guidelines</h3>
          <ul className="space-y-2.5 text-md text-gray-600">
            {[
              "Accepted formats: PDF, DOC, DOCX, XLS, XLSX, TXT, PNG, JPG (max 10 MB per file)",
              "Ensure all your work is legible and clearly labeled",
              "Include your name and ID number on the submission",
              "Late submissions will be subject to a 10% deduction per day",
              "You may attach multiple files — all will be submitted together",
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────
export default function App() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selected, setSelected] = useState(null);

  const handleSubmitted = (updated) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? { ...a, status: "submitted", submittedFiles: updated.submittedFiles } : a));
  };

  return selected
    ? <AssignmentDetails assignment={selected} onBack={() => setSelected(null)} onSubmitted={handleSubmitted} />
    : <AssignmentList assignments={assignments} onView={setSelected} />;
}
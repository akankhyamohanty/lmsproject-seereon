import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import api from "../../../services/api";
import {
  SEMESTER_OPTIONS,
  BATCH_OPTIONS,
  YEAR_OPTIONS,
  SUBJECT_OPTIONS,
  EXAM_TYPE_OPTIONS,
  DURATION_OPTIONS,
} from "./Examstorage.jsx";

// ─── Constants for Question Builder ───────────────────────────────────────────
const QUESTION_TYPE_OPTIONS = [
  { value: "MCQ", label: "Multiple Choice (MCQ)" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "LONG_ANSWER", label: "Long Answer" },
  { value: "TRUE_FALSE", label: "True / False" },
  { value: "FILL_IN_BLANK", label: "Fill in the Blank" },
  { value: "SUBJECTIVE", label: "Subjective / Essay" },
];

const DIFFICULTY_OPTIONS = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, type = "text", min, name }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Select = ({ value, onChange, options, placeholder, disabled, name }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
  >
    <option value="">{placeholder}</option>
    {options?.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

const ErrMsg = ({ msg }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
      {title}
    </h2>
    {children}
  </div>
);

// ─── Question Paper Print Modal ───────────────────────────────────────────────
const QuestionPaperPrint = ({ form, questionsList, onClose }) => {
  const handlePrint = () => window.print();

  const subjLabel = SUBJECT_OPTIONS.find((o) => o.value === form.subject)?.label || form.subject;
  const typeLabel = EXAM_TYPE_OPTIONS.find((o) => o.value === form.examType)?.label || form.examType;

  const totalMarksCalc = questionsList.reduce((s, q) => s + Number(q.marks || 0), 0);

  const difficultyBadgeColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #qp-print-content {
            display: block !important;
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: white;
            padding: 32px 48px;
          }
          .qp-no-print { display: none !important; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

          {/* Modal Header */}
          <div className="qp-no-print flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-lg">🖨️</span>
              <span className="font-bold text-sm uppercase tracking-tight">Question Paper Preview</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md"
              >
                🖨️ Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-xl transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable Paper Area */}
          <div id="qp-print-content" className="overflow-y-auto flex-1">
            <div className="p-10 text-slate-800 bg-white">

              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-slate-900">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  ACADEMIC INSTITUTION
                </h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                  Department of {subjLabel}
                </p>
                <div className="mt-4">
                  <h2 className="text-xl font-black text-blue-700">{form.title}</h2>
                  {typeLabel && (
                    <p className="text-sm font-semibold text-slate-500 mt-1">{typeLabel}</p>
                  )}
                </div>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
                {[
                  { label: "Subject", value: subjLabel },
                  { label: "Date", value: form.examDate || "—" },
                  { label: "Time", value: form.startTime || "—" },
                  { label: "Duration", value: form.duration ? `${form.duration} mins` : "—" },
                  { label: "Total Marks", value: form.totalMarks || totalMarksCalc || "—" },
                  { label: "Passing Marks", value: form.passingMarks || "—" },
                  { label: "Semester", value: form.semester || "—" },
                  { label: "Batch", value: form.batch || "—" },
                  { label: "Venue", value: form.venue || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="font-bold text-slate-800 mt-0.5 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              {form.instructions && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Instructions</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{form.instructions}</p>
                </div>
              )}

              {/* Questions */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
                  <h3 className="font-black text-xs uppercase tracking-widest">Questions</h3>
                  <span className="font-black text-xs uppercase tracking-widest">Marks</span>
                </div>

                {questionsList.length === 0 ? (
                  <p className="text-center text-slate-400 italic py-8 text-sm">No questions added yet.</p>
                ) : (
                  questionsList.map((q, index) => (
                    <div key={index} className="border-b border-slate-100 pb-5 last:border-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          {/* Question number + badges */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-black text-slate-900 text-sm">Q{index + 1}.</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {q.type}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${difficultyBadgeColor[q.difficulty] || "bg-slate-100 text-slate-500"}`}>
                              {q.difficulty}
                            </span>
                          </div>

                          {/* Question Text */}
                          <p className="font-semibold text-slate-800 text-[15px] leading-relaxed">{q.question}</p>

                          {/* MCQ Options */}
                          {q.type === "MCQ" && (
                            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                              {["A", "B", "C", "D"].map((opt) => (
                                q[`option${opt}`] && (
                                  <div key={opt} className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="font-bold text-slate-500 shrink-0">{opt})</span>
                                    <span>{q[`option${opt}`]}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          )}

                          {/* Answer space lines for non-MCQ */}
                          {q.type !== "MCQ" && (
                            <div className="mt-3 space-y-2">
                              {Array.from({ length: q.type === "LONG_ANSWER" || q.type === "SUBJECTIVE" ? 5 : 2 }).map((_, i) => (
                                <div key={i} className="w-full h-px bg-slate-200" />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Marks box */}
                        <div className="shrink-0 text-center border-2 border-slate-900 rounded-lg w-14 py-2">
                          <p className="font-black text-lg text-slate-900 leading-none">{q.marks}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">marks</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Total */}
                {questionsList.length > 0 && (
                  <div className="flex justify-end pt-4 border-t-2 border-slate-900">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Marks</p>
                      <p className="text-3xl font-black text-blue-700">{form.totalMarks || totalMarksCalc}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Signatures */}
              <div className="mt-16 flex justify-between items-end">
                <div className="text-center">
                  <div className="w-32 h-px bg-slate-300 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Examiner Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-px bg-slate-300 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HOD / Controller</p>
                </div>
              </div>

              {/* Footnote */}
              <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                <p className="text-[8px] text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                  This is a digitally generated question paper. · Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Initial State ────────────────────────────────────────────────────────────
const EMPTY = {
  title: "",
  subject: "",
  examType: "",
  semester: "",
  batch: "",
  year: "",
  examDate: "",
  startTime: "",
  duration: "",
  totalMarks: "",
  passingMarks: "",
  venue: "",
  instructions: "",
  attachedPdf: null,
  isAssigned: false,
  assignedFaculty: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const ExamForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editExam = location.state?.exam || null;
  const isEdit = !!editExam;

  const [activeTab, setActiveTab] = useState("details");
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState(isEdit ? { ...editExam, attachedPdf: null } : { ...EMPTY });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false); // ← NEW

  const [questionsList, setQuestionsList] = useState([]);
  const [currentQ, setCurrentQ] = useState({
    question: "",
    marks: "",
    type: "MCQ",
    difficulty: "Medium",
    optionA: "", optionB: "", optionC: "", optionD: "",
  });

  useEffect(() => {
    setFaculties([
      { value: "faculty_1", label: "Dr. Aris" },
      { value: "faculty_2", label: "Prof. Sarah" },
    ]);
  }, []);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQChange = (e) => {
    const { name, value } = e.target;
    setCurrentQ(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!isEdit && form.subject && form.examType && !form.title) {
      const typeLabel = EXAM_TYPE_OPTIONS.find((o) => o.value === form.examType)?.label || "";
      const subjLabel = SUBJECT_OPTIONS.find((o) => o.value === form.subject)?.label || form.subject;
      setForm((prev) => ({ ...prev, title: `${subjLabel} - ${typeLabel}` }));
    }
  }, [form.subject, form.examType]);

  const addQuestion = () => {
    if (!currentQ.question || !currentQ.marks || !currentQ.type || !currentQ.difficulty) {
      return toast.error("Question, Marks, Type, and Difficulty are required!");
    }
    setQuestionsList([...questionsList, currentQ]);
    setCurrentQ({
      question: "", marks: "", type: currentQ.type, difficulty: currentQ.difficulty,
      optionA: "", optionB: "", optionC: "", optionD: "",
    });
    toast.success("Question added!");
  };

  const removeQuestion = (index) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  const generateAndAttachPDF = () => {
    if (questionsList.length === 0) return toast.error("Add some questions first!");
    if (!form.title || !form.subject) return toast.error("Fill out Exam Title and Subject first!");

    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(form.title, 105, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const subjName = SUBJECT_OPTIONS.find(o => o.value === form.subject)?.label || form.subject;
    doc.text(`Subject: ${subjName}   |   Marks: ${form.totalMarks}   |   Time: ${form.duration} mins`, 105, yPos, { align: "center" });
    yPos += 15;

    doc.line(20, yPos, 190, yPos);
    yPos += 15;

    questionsList.forEach((q, index) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      const qText = `${index + 1}. ${q.question}`;
      const splitQuestion = doc.splitTextToSize(qText, 140);
      doc.setFont("helvetica", "bold");
      doc.text(splitQuestion, 20, yPos);
      doc.setFont("helvetica", "normal").setFontSize(9);
      doc.text(`[${q.marks} Marks | ${q.difficulty} | ${q.type}]`, 190, yPos, { align: "right" });
      doc.setFontSize(11);
      yPos += (splitQuestion.length * 6) + 2;

      if (q.type === "MCQ") {
        doc.text(`A) ${q.optionA}`, 25, yPos);
        doc.text(`B) ${q.optionB}`, 105, yPos);
        yPos += 6;
        doc.text(`C) ${q.optionC}`, 25, yPos);
        doc.text(`D) ${q.optionD}`, 105, yPos);
        yPos += 10;
      } else {
        yPos += 15;
      }
    });

    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], `${form.subject.replace(/\s+/g, '_')}_QuestionPaper.pdf`, { type: 'application/pdf' });
    setForm((prev) => ({ ...prev, attachedPdf: pdfFile }));
    toast.success("✅ PDF Generated & Attached Successfully!");
    setActiveTab("details");
  };

  const handleDownloadPDF = () => {
    if (!form.attachedPdf) return;
    const url = URL.createObjectURL(form.attachedPdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = form.attachedPdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.subject) e.subject = "Required";
    if (!form.examDate) e.examDate = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.duration) e.duration = "Required";
    if (!form.totalMarks) e.totalMarks = "Required";
    if (form.isAssigned && !form.assignedFaculty) e.assignedFaculty = "Please select a faculty";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return toast.error("Please fix form errors");

    if (!isEdit && !form.isAssigned && !form.attachedPdf) {
      return toast.error("Please generate the Question Paper PDF or delegate to faculty!");
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== "attachedPdf" && form[key] !== null) {
          submitData.append(key, form[key]);
        }
      });
      if (form.attachedPdf) submitData.append("question_paper", form.attachedPdf);

      const res = isEdit
        ? await api.put(`/exams/${editExam.id}`, submitData)
        : await api.post("/exams", submitData);

      if (res.data.success) {
        toast.success(isEdit ? "Exam Updated!" : "Exam Scheduled!");
        navigate("/admin/exams");
      }
    } catch (error) {
      toast.error("Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-6 max-w-8xl mx-auto">
        <button onClick={() => navigate("/admin/exams")} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500">←</button>
        <div>
          <h1 className="text-xl text-left font-bold text-gray-800">{isEdit ? "Edit Exam" : "Schedule New Exam"}</h1>
          <p className="text-sm text-gray-500">Set exam details and build or assign the question paper</p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto">
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
          <button onClick={() => setActiveTab("details")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "details" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            1. Exam Details
          </button>
          {!isEdit && (
            <button onClick={() => setActiveTab("builder")} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "builder" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
              2. Question Builder ({questionsList.length})
            </button>
          )}
        </div>

        <div className="text-left bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[500px]">
          {activeTab === "details" && (
            <div className="space-y-2">
              <Section title="Exam Identity">
                <div className="grid grid-cols-1 text-left sm:grid-cols-2 gap-4 mb-4">
                  <div><Label required>Subject</Label><Select value={form.subject} onChange={set("subject")} options={SUBJECT_OPTIONS} placeholder="Select Subject" /><ErrMsg msg={errors.subject} /></div>
                  <div><Label required>Exam Type</Label><Select value={form.examType} onChange={set("examType")} options={EXAM_TYPE_OPTIONS} placeholder="Select Type" /><ErrMsg msg={errors.examType} /></div>
                </div>
                <div><Label required>Exam Title</Label><Input value={form.title} onChange={set("title")} placeholder="e.g. Mathematics - Mid-Term Exam" /><ErrMsg msg={errors.title} /></div>
              </Section>

              <Section title="Target & Schedule">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div><Label required>Semester</Label><Select value={form.semester} onChange={set("semester")} options={SEMESTER_OPTIONS} placeholder="Select" /><ErrMsg msg={errors.semester} /></div>
                  <div><Label required>Batch</Label><Select value={form.batch} onChange={set("batch")} options={BATCH_OPTIONS} placeholder="Select" /><ErrMsg msg={errors.batch} /></div>
                  <div><Label required>Year</Label><Select value={form.year} onChange={set("year")} options={YEAR_OPTIONS} placeholder="Select" /><ErrMsg msg={errors.year} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><Label required>Date</Label><Input type="date" value={form.examDate} onChange={set("examDate")} /><ErrMsg msg={errors.examDate} /></div>
                  <div><Label required>Time</Label><Input type="time" value={form.startTime} onChange={set("startTime")} /><ErrMsg msg={errors.startTime} /></div>
                  <div><Label required>Duration</Label><Select value={form.duration} onChange={set("duration")} options={DURATION_OPTIONS} placeholder="Select" /><ErrMsg msg={errors.duration} /></div>
                </div>
              </Section>

              <Section title="Marks & Venue">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><Label required>Total Marks</Label><Input type="number" value={form.totalMarks} onChange={set("totalMarks")} placeholder="100" /><ErrMsg msg={errors.totalMarks} /></div>
                  <div><Label required>Passing Marks</Label><Input type="number" value={form.passingMarks} onChange={set("passingMarks")} placeholder="40" /></div>
                </div>
                <div><Label>Venue / Room</Label><Input value={form.venue} onChange={set("venue")} placeholder="Hall A" /></div>
              </Section>

              <Section title="Faculty Assignment & Permissions">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="delegate"
                      checked={form.isAssigned}
                      onChange={set("isAssigned")}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="delegate" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Delegate Question Paper creation to a specific Faculty?
                    </label>
                  </div>
                  {form.isAssigned && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Label required>Assign Faculty</Label>
                      <Select
                        value={form.assignedFaculty}
                        onChange={set("assignedFaculty")}
                        options={faculties}
                        placeholder="Choose faculty member"
                      />
                      <ErrMsg msg={errors.assignedFaculty} />
                    </div>
                  )}
                </div>
              </Section>

              {!form.isAssigned && !isEdit && (
                <Section title="Question Paper (Self-Build)">
                  <div className={`p-5 rounded-xl border-2 border-dashed flex items-center justify-between ${form.attachedPdf ? "bg-green-50 border-green-300" : "bg-purple-50 border-purple-200"}`}>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Question Paper PDF</p>
                      <p className="text-xs text-gray-500">{form.attachedPdf ? form.attachedPdf.name : "Build questions in Tab 2 to generate paper."}</p>
                    </div>
                    {!form.attachedPdf ? (
                      <button type="button" onClick={() => setActiveTab("builder")} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md">
                        Open Question Builder
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        {/* ── PRINT BUTTON (Details Tab) ── */}
                        <button
                          type="button"
                          onClick={() => setShowPrintModal(true)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-50 transition-all"
                          title="Print Question Paper"
                        >
                          🖨️ Print Paper
                        </button>
                        <button type="button" onClick={handleDownloadPDF} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">
                          Download
                        </button>
                        <span className="text-green-600 bg-green-100 px-3 py-2 rounded-lg font-bold text-xs">✅ Attached</span>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button onClick={() => navigate("/admin/exams")} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-500/30 transition-all">
                  {saving ? "Saving..." : isEdit ? "Update Exam" : "Schedule Exam"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "builder" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Add New Question</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label required>Type</Label><Select name="type" value={currentQ.type} onChange={handleQChange} options={QUESTION_TYPE_OPTIONS} /></div>
                  <div><Label required>Difficulty</Label><Select name="difficulty" value={currentQ.difficulty} onChange={handleQChange} options={DIFFICULTY_OPTIONS} /></div>
                </div>
                <div><Label required>Marks</Label><Input name="marks" type="number" value={currentQ.marks} onChange={handleQChange} /></div>
                <div>
                  <Label required>Question</Label>
                  <textarea name="question" value={currentQ.question} onChange={handleQChange} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                {currentQ.type === "MCQ" && (
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
                    <Input name="optionA" value={currentQ.optionA} onChange={handleQChange} placeholder="Option A" />
                    <Input name="optionB" value={currentQ.optionB} onChange={handleQChange} placeholder="Option B" />
                    <Input name="optionC" value={currentQ.optionC} onChange={handleQChange} placeholder="Option C" />
                    <Input name="optionD" value={currentQ.optionD} onChange={handleQChange} placeholder="Option D" />
                  </div>
                )}
                <button onClick={addQuestion} className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm">+ Add to List</button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col h-full max-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Paper Preview ({questionsList.length})</h3>
                  {/* ── PRINT BUTTON (Builder Tab) ── */}
                  {questionsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPrintModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all"
                      title="Print Question Paper"
                    >
                      🖨️ Print Preview
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {questionsList.map((q, i) => (
                    <div key={i} className="bg-white p-3 border border-gray-100 rounded-lg shadow-sm flex justify-between group">
                      <div className="text-sm">
                        <p className="font-semibold">{i + 1}. {q.question}</p>
                        <p className="text-[10px] text-gray-400">{q.marks} Marks | {q.difficulty}</p>
                      </div>
                      <button onClick={() => removeQuestion(i)} className="text-red-400 opacity-0 group-hover:opacity-100">🗑</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={generateAndAttachPDF} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg text-sm">
                    Generate PDF & Attach
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Print Modal ── */}
      {showPrintModal && (
        <QuestionPaperPrint
          form={form}
          questionsList={questionsList}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default ExamForm;
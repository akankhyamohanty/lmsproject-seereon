import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";

const courseModules = {
  "Advanced Mathematics": [
    "Module 1: Number Theory",
    "Module 2: Algebra",
    "Module 3: Trigonometry",
    "Module 4: Geometry",
    "Module 5: Calculus Intro",
    "Module 6: Statistics",
  ],
  "Statistics & Probability": [
    "Module 1: Descriptive Stats",
    "Module 2: Probability Basics",
    "Module 3: Distributions",
    "Module 4: Hypothesis Testing",
    "Module 5: Regression",
  ],
  "Calculus I": [
    "Module 1: Derivatives",
    "Module 2: Integrals",
    "Module 3: Limits",
    "Module 4: Applications",
  ],
  "Applied Mathematics": [
    "Module 1: Linear Algebra",
    "Module 2: Differential Equations",
    "Module 3: Numerical Methods",
  ],
  "Geometry": [
    "Module 1: Euclidean Geometry",
    "Module 2: Coordinate Geometry",
    "Module 3: Transformations",
  ],
};

export const CreateAssignment = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    course: "",
    module: "",
    title: "",
    instructions: "",
    dueDate: "",
    maxMarks: "",
    attachment: null,
  });

  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("No file chosen");

  const modules = form.course ? courseModules[form.course] || [] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "course") {
      setForm((prev) => ({ ...prev, course: value, module: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, attachment: "File size must be under 10MB." }));
        return;
      }
      setForm((prev) => ({ ...prev, attachment: file }));
      setFileName(file.name);
      setErrors((prev) => ({ ...prev, attachment: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.course)        e.course       = "Course is required.";
    if (!form.module)        e.module       = "Module is required.";
    if (!form.title.trim())  e.title        = "Assignment title is required.";
    if (!form.instructions.trim()) e.instructions = "Instructions are required.";
    if (!form.dueDate)       e.dueDate      = "Due date is required.";
    if (!form.maxMarks)      e.maxMarks     = "Maximum marks is required.";
    return e;
  };

  const handleSubmit = (status) => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Submitting assignment:", { ...form, status });
    navigate("/faculty/assignments");
  };

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto">

      {/* ── Back Button ───────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate("/faculty/assignments")}
        className="flex items-center gap-2 text-md text-gray-600 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </button>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-left text-blue-600">Create Assignment</h1>
        <p className="text-md text-left text-gray-500 mt-1">
          Create a new assignment for your students
        </p>
      </div>

      {/* ── Form Card ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base text-left font-semibold text-gray-800">Assignment Details</h2>

        {/* Course & Module */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Course */}
          <div>
            <label className="block text-left text-md font-medium text-gray-700 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className={`w-full appearance-none border rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black transition bg-gray-50 pr-8 ${
                  errors.course ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              >
                <option value="">Select course</option>
                {Object.keys(courseModules).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </div>
            </div>
            {errors.course && <p className="text-md text-red-500 mt-1">{errors.course}</p>}
          </div>

          {/* Module */}
          <div>
            <label className="block text-left text-md font-medium text-gray-700 mb-1">
              Module <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="module"
                value={form.module}
                onChange={handleChange}
                disabled={!form.course}
                className={`w-full appearance-none border rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black transition bg-gray-50 pr-8 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.module ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              >
                <option value="">Select module</option>
                {modules.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </div>
            </div>
            {errors.module && <p className="text-md text-red-500 mt-1">{errors.module}</p>}
          </div>
        </div>

        {/* Assignment Title */}
        <div>
          <label className="block text-left text-md font-medium text-gray-700 mb-1">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Quadratic Equations Problem Set"
            className={`w-full border rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black transition bg-gray-50 ${
              errors.title ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.title && <p className="text-md text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-left text-md font-medium text-gray-700 mb-1">
            Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={4}
            placeholder="Provide detailed instructions for the assignment..."
            className={`w-full border rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black transition bg-gray-50 resize-none ${
              errors.instructions ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.instructions && (
            <p className="text-md text-red-500 mt-1">{errors.instructions}</p>
          )}
        </div>

        {/* Due Date & Max Marks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Due Date */}
          <div>
            <label className="block text-left text-md font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black transition bg-gray-50 ${
                errors.dueDate ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.dueDate && <p className="text-md text-red-500 mt-1">{errors.dueDate}</p>}
          </div>

          {/* Maximum Marks */}
          <div>
            <label className="block text-left text-md font-medium text-gray-700 mb-1">
              Maximum Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="maxMarks"
              value={form.maxMarks}
              onChange={handleChange}
              min={1}
              placeholder="e.g., 100"
              className={`w-full border rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black transition bg-gray-50 ${
                errors.maxMarks ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.maxMarks && <p className="text-md text-red-500 mt-1">{errors.maxMarks}</p>}
          </div>
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-left text-md font-medium text-gray-700 mb-1">
            Attachment (Optional)
          </label>
          <label className="flex items-center justify-between border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center gap-2 text-md text-gray-600">
              <span className="font-medium text-gray-800">Choose File</span>
              <span className="text-gray-400">{fileName}</span>
            </div>
            <Upload className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {errors.attachment ? (
            <p className="text-md text-red-500 mt-1">{errors.attachment}</p>
          ) : (
            <p className="text-md text-gray-400 mt-1">
              Upload reference materials or question papers (Max 10MB)
            </p>
          )}
        </div>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <button
          type="button"
          onClick={() => handleSubmit("Draft")}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 text-md font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("Published")}
          className="bg-blue-600 text-white text-md font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-600 transition"
        >
          Publish Assignment
        </button>
      </div>
    </div>
  );
};
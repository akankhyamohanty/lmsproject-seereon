import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  User,
  GraduationCap,
  Lock,
  X,
  Save,
} from "lucide-react";

export const StudentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState("");

  // ================= STATE =================
  const [studentType, setStudentType] = useState(""); // school | graduation
  const [schoolLevel, setSchoolLevel] = useState(""); // primary | secondary
  const [selectedClass, setSelectedClass] = useState("");
  const [degree, setDegree] = useState("");
  const [semester, setSemester] = useState("");

  // ================= PASSWORD =================
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(pass);
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      studentType,
      schoolLevel,
      class: selectedClass,
      degree,
      semester,
      password: generatedPass,
    };

    console.log("Student Data:", payload);

    setTimeout(() => {
      setLoading(false);
      navigate("/admin/students");
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-xl font-bold">Enroll New Student</h1>
          <p className="text-md text-slate-400 uppercase mt-1">
            Fill in registration details
          </p>
        </div>
        <button onClick={() => navigate("/admin/students")}>
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        {/* ================= PERSONAL ================= */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <User size={18} />
            <h3 className="font-bold uppercase text-md">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required placeholder="First Name" className="input" />
            <input required placeholder="Last Name" className="input" />
            <input type="date" required className="input" />
            <select className="input">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input type="email" placeholder="Email" className="input" />
            <input type="tel" placeholder="Phone" className="input" />
          </div>
        </section>

        {/* ================= ACADEMIC ================= */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap size={18} />
            <h3 className="font-bold uppercase text-md">Academic Info</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STUDENT TYPE */}
            <select
              value={studentType}
              onChange={(e) => {
                setStudentType(e.target.value);
                setSchoolLevel("");
                setSelectedClass("");
                setDegree("");
                setSemester("");
              }}
              required
              className="input"
            >
              <option value="">Select Student Type</option>
              <option value="school">School Student</option>
              <option value="graduation">Graduation Student</option>
            </select>

            {/* ================= SCHOOL FLOW ================= */}
            {studentType === "school" && (
              <>
                {/* SCHOOL LEVEL */}
                <select
                  value={schoolLevel}
                  onChange={(e) => {
                    setSchoolLevel(e.target.value);
                    setSelectedClass("");
                  }}
                  required
                  className="input"
                >
                  <option value="">Select School Level</option>
                  <option value="primary">Primary (1–5)</option>
                  <option value="secondary">Secondary (6–12)</option>
                </select>

                {/* CLASS */}
                {schoolLevel && (
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    required
                    className="input"
                  >
                    <option value="">Select Class</option>
                    {(schoolLevel === "primary"
                      ? [1, 2, 3, 4, 5]
                      : [6, 7, 8, 9, 10, 11, 12]
                    ).map((cls) => (
                      <option key={cls} value={cls}>
                        Class {cls}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            {/* ================= GRADUATION FLOW ================= */}
            {studentType === "graduation" && (
              <>
                {/* DEGREE */}
                <select
                  value={degree}
                  onChange={(e) => {
                    setDegree(e.target.value);
                    setSemester("");
                  }}
                  required
                  className="input"
                >
                  <option value="">Select Degree</option>
                  <option value="BCA">BCA</option>
                  <option value="BTech">B.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                </select>

                {/* SEMESTER */}
                {degree && (
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    className="input"
                  >
                    <option value="">Select Semester</option>
                    {[...Array(degree === "MBA" ? 4 : 6)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            <input placeholder="Roll Number" className="input" />
            <input value="2024-2025" readOnly className="input bg-slate-100" />
          </div>
        </section>

        {/* ================= LOGIN ================= */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} />
            <h3 className="font-bold uppercase text-md">Login Credentials</h3>
          </div>

          <div className="flex gap-2">
            <input
              value={generatedPass}
              readOnly
              placeholder="Generate password"
              className="input flex-1 font-mono"
            />
            <button
              type="button"
              onClick={generatePassword}
              className="px-4 rounded-xl bg-blue-100 text-blue-700"
            >
              <RefreshCw />
            </button>
          </div>
        </section>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/students")}
            className="px-8 py-3 border rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl flex gap-2"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Enroll Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

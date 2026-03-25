import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Quadratic Equations Problem Set",
    course: "Advanced Mathematics",
    module: "Module 2: Algebra",
    dueDate: "2026-02-20",
    submitted: 28,
    total: 32,
    maxMarks: 100,
  },
  {
    id: 2,
    title: "Probability Distribution Analysis",
    course: "Statistics & Probability",
    module: "Module 3: Distributions",
    dueDate: "2026-02-18",
    submitted: 25,
    total: 28,
    maxMarks: 50,
  },
  {
    id: 3,
    title: "Differentiation Exercises",
    course: "Calculus I",
    module: "Module 1: Derivatives",
    dueDate: "2026-02-15",
    submitted: 30,
    total: 30,
    maxMarks: 75,
  },
];

export const StudentAssignment = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-md text-gray-500 mt-1">
            Manage assignments and evaluate submissions
          </p>
        </div>
        <button
          onClick={() => navigate("/faculty/assignments/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-md font-semibold hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* ── Table Card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-blue-600">
          <h2 className="text-base text-left font-semibold text-gray-200">Assignment List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-md">
            <thead>
              <tr className="border-b border-gray-100 text-blue-600">
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Assignment Title</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Course</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Module</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Due Date</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Submissions</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Max Marks</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, index) => {
                const percent = Math.round((a.submitted / a.total) * 100);
                return (
                  <tr
                    key={a.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index !== assignments.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* Title */}
                    <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      {a.title}
                    </td>

                    {/* Course */}
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {a.course}
                    </td>

                    {/* Module */}
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                      {a.module}
                    </td>

                    {/* Due Date */}
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {a.dueDate}
                    </td>

                    {/* Submissions with progress bar */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-1 min-w-[120px]">
                        <span className="text-md font-medium text-gray-800">
                          {a.submitted}/{a.total}
                        </span>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-900 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Max Marks */}
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      {a.maxMarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
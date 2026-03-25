import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, BookOpen, Plus } from "lucide-react";

const initialCourses = [
  {
    id: 1,
    courseTitle: "Advanced Mathematics",
    class: "Grade 10-A",
    academicYear: "2025-2026",
    modules: 6,
    status: "Published",
  },
  {
    id: 2,
    courseTitle: "Statistics & Probability",
    class: "Grade 12-B",
    academicYear: "2025-2026",
    modules: 5,
    status: "Published",
  },
  {
    id: 3,
    courseTitle: "Calculus I",
    class: "Grade 11-A",
    academicYear: "2025-2026",
    modules: 4,
    status: "Draft",
  },
];

export const FacultyCourses = () => {
  const [courses] = useState(initialCourses);
  const navigate = useNavigate();

  const handleView = (course) => {
    navigate("/faculty/courses/detail", { state: { course } });
  };

  const handleModules = (course) => {
    navigate("/faculty/courses/modules", { state: { course } });
  };

  const handleCreateCourse = () => {
    navigate("/faculty/courses/create");
  };

  return (
    <div className="p-6 space-y-6 text-left">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-md text-gray-500 mt-1">Create and manage course content</p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-md font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* ── Table Card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-blue-600">
          <h2 className="text-base font-semibold text-gray-200">Course List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-md">
            <thead>
              <tr className="border-b border-gray-100 text-blue-600">
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Course Title</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Class</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Academic Year</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Modules</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Status</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index !== courses.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  {/* Course Title */}
                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {course.courseTitle}
                  </td>

                  {/* Class */}
                  <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                    {course.class}
                  </td>

                  {/* Academic Year */}
                  <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                    {course.academicYear}
                  </td>

                  {/* Modules */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1 w-fit text-sm">
                      <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                      {course.modules} modules
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        course.status === "Published"
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(course)}
                        className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-1.5 text-md text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleModules(course)}
                        className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-1.5 text-md text-gray-700 hover:bg-gray-100 transition"
                      >
                        <FileText className="w-4 h-4" />
                        Modules
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
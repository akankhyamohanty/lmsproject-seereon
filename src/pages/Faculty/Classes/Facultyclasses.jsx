import { useNavigate } from "react-router-dom";
import { Eye, Users } from "lucide-react";

const classes = [
  {
    id: 1,
    courseName: "Advanced Mathematics",
    classSection: "Grade 10 - A",
    subject: "Mathematics",
    academicYear: "2025-2026",
    schedule: "Mon, Wed, Fri - 08:00 AM",
    students: 32,
  },
  {
    id: 2,
    courseName: "Statistics & Probability",
    classSection: "Grade 12 - B",
    subject: "Statistics",
    academicYear: "2025-2026",
    schedule: "Tue, Thu - 10:00 AM",
    students: 28,
  },
  {
    id: 3,
    courseName: "Calculus I",
    classSection: "Grade 11 - A",
    subject: "Calculus",
    academicYear: "2025-2026",
    schedule: "Mon, Wed - 01:00 PM",
    students: 30,
  },
  {
    id: 4,
    courseName: "Applied Mathematics",
    classSection: "Grade 11 - B",
    subject: "Mathematics",
    academicYear: "2025-2026",
    schedule: "Tue, Thu - 02:00 PM",
    students: 25,
  },
  {
    id: 5,
    courseName: "Geometry",
    classSection: "Grade 9 - C",
    subject: "Mathematics",
    academicYear: "2025-2026",
    schedule: "Fri - 11:00 AM",
    students: 35,
  },
];

export const FacultyClasses = () => {
  const navigate = useNavigate();

  const handleView = (cls) => {
    navigate("/faculty/classes/detail", { state: { cls } });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-left font-bold text-gray-900">My Classes</h1>
        <p className="text-md text-left text-gray-500 mt-1">
          View and manage all your assigned classes
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white  rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100  bg-blue-600">
          <h2 className="text-base text-left font-semibold text-gray-200">Assigned Classes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-left border-gray-100 text-blue-600">
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Course Name</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Class/Section</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Subject</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Academic Year</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Schedule</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Students</th>
                <th className="text-left font-semibold px-5 py-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr
                  key={cls.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    index === classes.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {cls.courseName}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-block border border-gray-300 rounded-md px-2.5 py-0.5 text-md font-medium text-gray-700 bg-white">
                      {cls.classSection}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-700 whitespace-nowrap">{cls.subject}</td>
                  <td className="px-5 py-4 text-gray-700 whitespace-nowrap">{cls.academicYear}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{cls.schedule}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Users className="w-4 h-4 text-gray-400" />
                      {cls.students}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleView(cls)}
                      className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
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
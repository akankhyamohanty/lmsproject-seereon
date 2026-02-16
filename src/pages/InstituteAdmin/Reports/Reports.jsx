import { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileText,
  ChevronDown,
} from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const STORAGE_KEY = "reportsFilters";

export const Reports = () => {
  const [filters, setFilters] = useState({
    selectedReport: 1,
    dateFrom: "",
    dateTo: "",
    course: "All Courses",
    className: "All Classes",
  });

  // 🔹 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFilters(JSON.parse(saved));
    }
  }, []);

  // 🔹 Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const reports = [
    {
      id: 1,
      title: "Attendance Report",
      description: "Student attendance summary by course and date.",
    },
    {
      id: 2,
      title: "Fees Collection",
      description: "Fees collected within selected period.",
    },
    {
      id: 3,
      title: "Student Performance",
      description: "Academic performance overview.",
    },
    {
      id: 4,
      title: "Faculty Report",
      description: "Faculty workload and activity report.",
    },
  ];

  // 🔹 Generate Report
  const generateReport = () => {
    const report = {
      reportType: reports.find(r => r.id === filters.selectedReport)?.title,
      ...filters,
      generatedAt: new Date().toLocaleString(),
    };

    console.log("Generated Report:", report);
    alert("Report generated successfully. Check console.");
  };

  // 🔹 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Institute Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Report Type: ${reports.find(r => r.id === filters.selectedReport)?.title}`, 14, 35);
    doc.text(`Date From: ${filters.dateFrom || "N/A"}`, 14, 45);
    doc.text(`Date To: ${filters.dateTo || "N/A"}`, 14, 55);
    doc.text(`Course: ${filters.course}`, 14, 65);
    doc.text(`Class: ${filters.className}`, 14, 75);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 95);

    doc.save("report.pdf");
  };

  // 🔹 Export Excel
  const exportExcel = () => {
    const data = [
      {
        Report: reports.find(r => r.id === filters.selectedReport)?.title,
        DateFrom: filters.dateFrom || "N/A",
        DateTo: filters.dateTo || "N/A",
        Course: filters.course,
        Class: filters.className,
        GeneratedOn: new Date().toLocaleString(),
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "report.xlsx");
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">

      {/* HEADER */}
      <div className="mb-8 mt-2">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Reports</h1>
        <p className="text-slate-400 text-md">Send reports to students, faculty, and staff</p>
      </div>

      {/* REPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reports.map((report) => {
          const isSelected = filters.selectedReport === report.id;
          return (
            <div
              key={report.id}
              onClick={() =>
                setFilters(prev => ({ ...prev, selectedReport: report.id }))
              }
              className={`p-6 rounded-xl cursor-pointer border h-48
                ${isSelected ? "bg-blue-50 border-blue-600" : "bg-white border-slate-100"}
              `}
            >
              <BarChart3 className={`${isSelected ? "text-blue-600" : "text-slate-300"}`} size={32} />
              <h3 className="font-bold mt-4">{report.title}</h3>
              <p className="text-md text-slate-400 mt-2">{report.description}</p>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border p-8">
        <h3 className="font-bold mb-6">Report Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <input
            placeholder="Date From"
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="bg-gray-100 p-3 rounded-lg"
          />

          <input
            placeholder="Date To"
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="bg-gray-100 p-3 rounded-lg"
          />

          <select
            value={filters.course}
            onChange={e => setFilters(prev => ({ ...prev, course: e.target.value }))}
            className="bg-gray-100 p-3 rounded-lg"
          >
            <option>All Courses</option>
            <option>B.Tech CSE</option>
            <option>BCA</option>
          </select>

          <select
            value={filters.className}
            onChange={e => setFilters(prev => ({ ...prev, className: e.target.value }))}
            className="bg-gray-100 p-3 rounded-lg"
          >
            <option>All Classes</option>
            <option>Year 1</option>
            <option>Year 2</option>
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-8 flex-wrap">
          <button onClick={generateReport} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Generate Report
          </button>

          <button onClick={exportPDF} className="bg-gray-200 px-6 py-2 rounded-lg flex gap-2">
            <Download size={16} /> Export PDF
          </button>

          <button onClick={exportExcel} className="bg-gray-200 px-6 py-2 rounded-lg flex gap-2">
            <FileText size={16} /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};

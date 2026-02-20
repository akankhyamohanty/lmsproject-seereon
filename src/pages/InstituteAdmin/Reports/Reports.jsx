import { useState, useEffect } from "react";
import {
  BarChart3, Download, FileText, ChevronDown, Users,
  GraduationCap, BookOpen, Building2, Calendar,
} from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const STORAGE_KEY = "reportsFilters";

// ── Shared field components ────────────────────────────────────────────────────
const SelectField = ({ label, icon: Icon, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
      {Icon && <Icon size={11}/>}{label}
    </label>
    <div className="relative">
      <select value={value} onChange={onChange}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none appearance-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
    </div>
  </div>
);

const DateField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
      <Calendar size={11}/>{label}
    </label>
    <input type="date" value={value} onChange={onChange}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"/>
  </div>
);

// ── Static options (replace with real data from localStorage/API as needed) ──
const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "English"];
const COURSES     = ["All Courses", "B.Sc CS", "M.Sc CS", "B.Sc Math", "B.Sc Physics", "B.Com", "B.Ed"];
const STUDENTS    = ["All Students", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];
const FACULTY     = ["All Faculty", "Active Faculty", "Computer Science Dept.", "Mathematics Dept.", "Physics Dept."];

export const Reports = () => {
  const [filters, setFilters] = useState({
    selectedReport: 1,
    dateFrom: "",
    dateTo: "",
    // Attendance
    attDept: "All Departments",
    attCourse: "All Courses",
    attStudent: "All Students",
    attFaculty: "All Faculty",
    // Fees
    feesDept: "All Departments",
    feesCourse: "All Courses",
    feesStudent: "All Students",
    // General
    course: "All Courses",
    className: "All Classes",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFilters(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const set = (field) => (e) => setFilters(p => ({ ...p, [field]: e.target.value }));

  const reports = [
    { id: 1, title: "Attendance Report",   description: "Student attendance summary by course and date.", icon: Users       },
    { id: 2, title: "Fees Collection",     description: "Fees collected within selected period.",         icon: FileText    },
    { id: 3, title: "Student Performance", description: "Academic performance overview.",                 icon: GraduationCap },
    { id: 4, title: "Faculty Report",      description: "Faculty workload and activity report.",          icon: BookOpen    },
  ];

  const selectedTitle = reports.find(r => r.id === filters.selectedReport)?.title;

  const generateReport = () => {
    const report = { reportType: selectedTitle, ...filters, generatedAt: new Date().toLocaleString() };
    console.log("Generated Report:", report);
    alert("Report generated successfully. Check console.");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Institute Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Report Type: ${selectedTitle}`,             14, 35);
    doc.text(`Date From: ${filters.dateFrom || "N/A"}`,   14, 45);
    doc.text(`Date To: ${filters.dateTo || "N/A"}`,       14, 55);
    if (filters.selectedReport === 1) {
      doc.text(`Department: ${filters.attDept}`,   14, 65);
      doc.text(`Course: ${filters.attCourse}`,     14, 75);
      doc.text(`Students: ${filters.attStudent}`,  14, 85);
      doc.text(`Faculty: ${filters.attFaculty}`,   14, 95);
    }
    if (filters.selectedReport === 2) {
      doc.text(`Department: ${filters.feesDept}`,  14, 65);
      doc.text(`Course: ${filters.feesCourse}`,    14, 75);
      doc.text(`Students: ${filters.feesStudent}`, 14, 85);
    }
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 110);
    doc.save("report.pdf");
  };

  const exportExcel = () => {
    const data = [{
      Report: selectedTitle,
      DateFrom: filters.dateFrom || "N/A",
      DateTo:   filters.dateTo   || "N/A",
      ...(filters.selectedReport === 1 && {
        Department: filters.attDept, Course: filters.attCourse,
        Students: filters.attStudent, Faculty: filters.attFaculty,
      }),
      ...(filters.selectedReport === 2 && {
        Department: filters.feesDept, Course: filters.feesCourse,
        Students: filters.feesStudent,
      }),
      GeneratedOn: new Date().toLocaleString(),
    }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  // ── Render filters based on selected report ──────────────────────────────
  const renderFilters = () => {
    // ── Attendance ──
    if (filters.selectedReport === 1) return (
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
          <Users size={11}/> Attendance Filters
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField label="Date From" value={filters.dateFrom} onChange={set("dateFrom")}/>
          <DateField label="Date To"   value={filters.dateTo}   onChange={set("dateTo")}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Department" icon={Building2}    value={filters.attDept}    onChange={set("attDept")}    options={DEPARTMENTS}/>
          <SelectField label="Course"     icon={BookOpen}     value={filters.attCourse}  onChange={set("attCourse")}  options={COURSES}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Students"   icon={GraduationCap} value={filters.attStudent} onChange={set("attStudent")} options={STUDENTS}/>
          <SelectField label="Faculty"    icon={Users}          value={filters.attFaculty} onChange={set("attFaculty")} options={FACULTY}/>
        </div>
      </div>
    );

    // ── Fees ──
    if (filters.selectedReport === 2) return (
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
          <FileText size={11}/> Fees Filters
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField label="Date From" value={filters.dateFrom} onChange={set("dateFrom")}/>
          <DateField label="Date To"   value={filters.dateTo}   onChange={set("dateTo")}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Department" icon={Building2}    value={filters.feesDept}    onChange={set("feesDept")}    options={DEPARTMENTS}/>
          <SelectField label="Course"     icon={BookOpen}     value={filters.feesCourse}  onChange={set("feesCourse")}  options={COURSES}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Students"   icon={GraduationCap} value={filters.feesStudent} onChange={set("feesStudent")} options={STUDENTS}/>
        </div>
      </div>
    );

    // ── Other reports (3 & 4) — basic date range only ──
    return (
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
          <BarChart3 size={11}/> Report Filters
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField label="Date From" value={filters.dateFrom} onChange={set("dateFrom")}/>
          <DateField label="Date To"   value={filters.dateTo}   onChange={set("dateTo")}/>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-8xl mx-auto pb-12">

      {/* Header */}
      <div className="mb-8 mt-2">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Reports</h1>
        <p className="text-slate-400 text-sm">Generate and export reports for students, faculty, and staff</p>
      </div>

      {/* Report type cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {reports.map((report) => {
          const isSelected = filters.selectedReport === report.id;
          const Icon = report.icon;
          return (
            <div key={report.id}
              onClick={() => setFilters(p => ({ ...p, selectedReport: report.id }))}
              className={`p-5 rounded-xl cursor-pointer border transition-all
                ${isSelected
                  ? "bg-blue-50 border-blue-600 shadow-md shadow-blue-100"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3
                ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                <Icon size={18}/>
              </div>
              <h3 className={`font-black text-sm ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                {report.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{report.description}</p>
            </div>
          );
        })}
      </div>

      {/* Filters panel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-600 px-6 py-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-white"/>
          <span className="text-white font-black text-sm">{selectedTitle} — Filters</span>
        </div>
        <div className="p-6">
          {renderFilters()}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={generateReport}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
          <BarChart3 size={15}/> Generate Report
        </button>
        <button onClick={exportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-black text-sm shadow-sm transition-all active:scale-[0.98]">
          <Download size={15}/> Export PDF
        </button>
        <button onClick={exportExcel}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-black text-sm shadow-sm transition-all active:scale-[0.98]">
          <FileText size={15}/> Export Excel
        </button>
      </div>

    </div>
  );
};

export default Reports;
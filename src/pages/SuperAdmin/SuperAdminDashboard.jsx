// import { Building2, Zap, Users, GraduationCap, Wallet,  AlertCircle, Clock } from "lucide-react";

// // --- Card Component (Responsive & Pixel-Perfect) ---
// const DashboardCard = ({ title, value, subtext, icon: Icon, bgType }) => {
//   const styles = {
//     purple: "bg-[#EBEBFF]",
//     beige: "bg-[#FFF2E5]",
//   };

//   return (
//     <div
//       className={`${styles[bgType]} p-5 sm:p-6 rounded-2xl flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]`}
//     >
//       {/* Top Row */}
//       <div className="flex justify-between items-start">
//         <h3 className="text-sm sm:text-base font-semibold text-slate-700">{title}</h3>
//         <Icon size={22} className="text-slate-700 opacity-80" />
//       </div>

//       {/* Value */}
//       <div className="mt-2">
//         <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</h2>
//       </div>

//       {/* Subtext */}
//       <div className="mt-1">
//         <p className="text-[10px] sm:text-sm text-slate-500 font-medium">{subtext}</p>
//       </div>
//     </div>
//   );
// };

// export const SuperAdminDashboard = () => {
//   const stats = [
//     { title: "Total Institutes", value: "150", subtext: "All registered institutes", icon: Building2, bgType: "purple" },
//     { title: "Active Institutes", value: "138", subtext: "Currently active", icon: Zap, bgType: "beige" },
//     { title: "Suspended Institutes", value: "12", subtext: "Temporarily suspended", icon: AlertCircle, bgType: "beige" },
//     { title: "Total Teachers", value: "2,450", subtext: "All faculties", icon: Users, bgType: "purple" },
//     { title: "Total Students", value: "48,320", subtext: "All enrolled students", icon: GraduationCap, bgType: "beige" },
//     { title: "Monthly Revenue", value: "$150,000", subtext: "Subscription revenue", icon: Wallet, bgType: "purple" },
//     { title: "Expiring Subscriptions", value: "23", subtext: "Next 30 days", icon: Clock, bgType: "beige" },
//   ];

//   return (
//     <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      
//       {/* --- Top Header --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
//         {/* Left Greeting */}
//         <div>
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Hi, Admin</h1>
//           <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and monitor all institutes</p>
//         </div>

//         {/* Right: Optional Search/Bell/Profile */}
//         <div className="flex items-center gap-4">
//           {/* Placeholder for future search/bell/avatar */}
//         </div>
//       </div>

//       {/* --- Dashboard Cards Grid --- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => (
//           <DashboardCard
//             key={idx}
//             title={stat.title}
//             value={stat.value}
//             subtext={stat.subtext}
//             icon={stat.icon}
//             bgType={stat.bgType}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };



import { useState } from "react";
import {
  Building2, Zap, Users, GraduationCap, Wallet, AlertCircle, Clock,
  Search, ArrowLeft, Eye, ChevronRight, BookOpen, DollarSign,
  UserCheck, CalendarCheck, TrendingUp, Star, Phone, Mail, MapPin, X
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INSTITUTES = [
  {
    id: 1,
    name: "Greenwood Academy",
    city: "New York",
    status: "Active",
    plan: "Premium",
    students: 1240,
    teachers: 86,
    joined: "Jan 2022",
    email: "admin@greenwood.edu",
    phone: "+1 212-555-0101",
    address: "45 Park Ave, New York, NY 10016",
    revenue: "$8,400/mo",
    subscriptionEnds: "Dec 2025",
    rating: 4.8,
    attendance: 92,
    feeCollected: 94,
    feeStructure: [
      { grade: "Grade 1–5", fee: "$320/mo", collected: 98 },
      { grade: "Grade 6–8", fee: "$420/mo", collected: 95 },
      { grade: "Grade 9–10", fee: "$520/mo", collected: 91 },
      { grade: "Grade 11–12", fee: "$620/mo", collected: 88 },
    ],
    faculty: [
      { name: "Dr. Sarah Mitchell", subject: "Mathematics", experience: "12 yrs", attendance: 97 },
      { name: "Prof. James Okafor", subject: "Physics", experience: "8 yrs", attendance: 94 },
      { name: "Ms. Priya Sharma", subject: "Chemistry", experience: "6 yrs", attendance: 99 },
      { name: "Mr. Tom Williams", subject: "English", experience: "10 yrs", attendance: 91 },
      { name: "Dr. Ana Reyes", subject: "Biology", experience: "14 yrs", attendance: 96 },
    ],
    studentAttendance: [
      { class: "Class 10A", total: 42, present: 39, pct: 93 },
      { class: "Class 10B", total: 40, present: 36, pct: 90 },
      { class: "Class 11A", total: 38, present: 36, pct: 95 },
      { class: "Class 12A", total: 35, present: 31, pct: 89 },
      { class: "Class 9B", total: 44, present: 41, pct: 93 },
    ],
  },
  {
    id: 2,
    name: "Sunrise International",
    city: "Los Angeles",
    status: "Active",
    plan: "Standard",
    students: 870,
    teachers: 54,
    joined: "Mar 2023",
    email: "info@sunrise.edu",
    phone: "+1 310-555-0199",
    address: "200 Sunset Blvd, LA, CA 90028",
    revenue: "$5,200/mo",
    subscriptionEnds: "Feb 2026",
    rating: 4.5,
    attendance: 88,
    feeCollected: 87,
    feeStructure: [
      { grade: "Grade 1–5", fee: "$280/mo", collected: 92 },
      { grade: "Grade 6–8", fee: "$360/mo", collected: 88 },
      { grade: "Grade 9–10", fee: "$440/mo", collected: 84 },
      { grade: "Grade 11–12", fee: "$520/mo", collected: 80 },
    ],
    faculty: [
      { name: "Mr. Kevin Lee", subject: "Mathematics", experience: "5 yrs", attendance: 90 },
      { name: "Ms. Aisha Patel", subject: "Science", experience: "7 yrs", attendance: 88 },
      { name: "Mr. Carlos Ruiz", subject: "History", experience: "9 yrs", attendance: 93 },
    ],
    studentAttendance: [
      { class: "Class 8A", total: 38, present: 33, pct: 87 },
      { class: "Class 9A", total: 40, present: 35, pct: 88 },
      { class: "Class 10A", total: 36, present: 32, pct: 89 },
    ],
  },
  {
    id: 3,
    name: "Horizon School of Science",
    city: "Chicago",
    status: "Suspended",
    plan: "Basic",
    students: 320,
    teachers: 22,
    joined: "Jul 2021",
    email: "contact@horizon.edu",
    phone: "+1 312-555-0144",
    address: "88 Lakeshore Dr, Chicago, IL 60601",
    revenue: "$1,900/mo",
    subscriptionEnds: "Oct 2024",
    rating: 3.9,
    attendance: 74,
    feeCollected: 68,
    feeStructure: [
      { grade: "Grade 1–5", fee: "$200/mo", collected: 72 },
      { grade: "Grade 6–8", fee: "$260/mo", collected: 66 },
      { grade: "Grade 9–10", fee: "$300/mo", collected: 62 },
    ],
    faculty: [
      { name: "Mr. Daniel Park", subject: "Physics", experience: "3 yrs", attendance: 80 },
      { name: "Ms. Lena Vogel", subject: "Math", experience: "5 yrs", attendance: 75 },
    ],
    studentAttendance: [
      { class: "Class 7A", total: 30, present: 22, pct: 73 },
      { class: "Class 8A", total: 28, present: 20, pct: 71 },
    ],
  },
  {
    id: 4,
    name: "Maple Leaf Academy",
    city: "Houston",
    status: "Active",
    plan: "Premium",
    students: 2100,
    teachers: 130,
    joined: "Aug 2020",
    email: "admin@mapleleaf.edu",
    phone: "+1 713-555-0177",
    address: "500 Texas Ave, Houston, TX 77002",
    revenue: "$14,200/mo",
    subscriptionEnds: "Mar 2026",
    rating: 4.9,
    attendance: 96,
    feeCollected: 97,
    feeStructure: [
      { grade: "Grade 1–5", fee: "$400/mo", collected: 99 },
      { grade: "Grade 6–8", fee: "$500/mo", collected: 98 },
      { grade: "Grade 9–10", fee: "$600/mo", collected: 97 },
      { grade: "Grade 11–12", fee: "$700/mo", collected: 94 },
    ],
    faculty: [
      { name: "Dr. Helen Carter", subject: "Chemistry", experience: "18 yrs", attendance: 99 },
      { name: "Prof. Raj Iyer", subject: "Physics", experience: "15 yrs", attendance: 98 },
      { name: "Ms. Sofia Mendez", subject: "Literature", experience: "11 yrs", attendance: 97 },
      { name: "Mr. Ben Thompson", subject: "Mathematics", experience: "9 yrs", attendance: 96 },
    ],
    studentAttendance: [
      { class: "Class 11A", total: 50, present: 48, pct: 96 },
      { class: "Class 12A", total: 48, present: 47, pct: 98 },
      { class: "Class 10A", total: 46, present: 44, pct: 96 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Badge = ({ label, type }) => {
  const base = "text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase";
  const styles = {
    Active: "bg-emerald-100 text-emerald-700",
    Suspended: "bg-rose-100 text-rose-600",
    Premium: "bg-violet-100 text-violet-700",
    Standard: "bg-blue-100 text-blue-700",
    Basic: "bg-slate-100 text-slate-600",
  };
  return <span className={`${base} ${styles[label] || styles[type]}`}>{label}</span>;
};

const Bar = ({ pct, color = "bg-violet-500" }) => (
  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
    <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
  </div>
);

const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded-2xl ${color}`}>
    <div className="p-2 bg-white/60 rounded-xl">
      <Icon size={18} className="text-slate-700" />
    </div>
    <div>
      <p className="text-[11px] text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
    </div>
  </div>
);

// ─── Institute Detail View ────────────────────────────────────────────────────
const InstituteDetail = ({ institute: ins, onBack }) => {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "fee", "faculty", "attendance"];

  return (
    <div className="w-full animate-fadeIn">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-sm font-semibold text-slate-800">{ins.name}</span>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#f0edff] to-[#fff8f0] rounded-3xl p-6 mb-6 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Building2 size={26} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{ins.name}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {ins.address}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge label={ins.status} />
                <Badge label={ins.plan} />
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500 space-y-1 sm:text-right">
            <p className="flex sm:justify-end items-center gap-1.5"><Mail size={12} /> {ins.email}</p>
            <p className="flex sm:justify-end items-center gap-1.5"><Phone size={12} /> {ins.phone}</p>
            <p className="flex sm:justify-end items-center gap-1.5"><Star size={12} className="text-amber-400 fill-amber-400" /> {ins.rating} / 5.0</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <StatPill icon={GraduationCap} label="Students" value={ins.students.toLocaleString()} color="bg-white/70" />
          <StatPill icon={Users} label="Faculty" value={ins.teachers} color="bg-white/70" />
          <StatPill icon={Wallet} label="Revenue" value={ins.revenue} color="bg-white/70" />
          <StatPill icon={CalendarCheck} label="Attendance" value={`${ins.attendance}%`} color="bg-white/70" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-6 w-full sm:w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
          {[
            { label: "Plan", value: ins.plan, icon: TrendingUp },
            { label: "Joined", value: ins.joined, icon: Clock },
            { label: "Subscription Ends", value: ins.subscriptionEnds, icon: Clock },
            { label: "Fee Collected", value: `${ins.feeCollected}%`, icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBEBFF] flex items-center justify-center">
                <Icon size={18} className="text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-base font-bold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Fee Structure */}
      {tab === "fee" && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/60">
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <DollarSign size={16} className="text-violet-500" /> Fee Structure
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {ins.feeStructure.map((row, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">{row.grade}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{row.fee}</p>
                </div>
                <div className="w-32 hidden sm:block">
                  <Bar pct={row.collected} color={row.collected > 90 ? "bg-emerald-400" : row.collected > 75 ? "bg-amber-400" : "bg-rose-400"} />
                </div>
                <span className={`text-sm font-bold min-w-[40px] text-right ${row.collected > 90 ? "text-emerald-600" : row.collected > 75 ? "text-amber-600" : "text-rose-500"}`}>
                  {row.collected}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Faculty */}
      {tab === "faculty" && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/60">
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Users size={16} className="text-violet-500" /> Faculty Members
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {ins.faculty.map((f, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {f.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{f.name}</p>
                  <p className="text-xs text-slate-400">{f.subject} · {f.experience}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Attendance</p>
                  <p className={`text-sm font-bold ${f.attendance > 90 ? "text-emerald-600" : "text-amber-500"}`}>{f.attendance}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Student Attendance */}
      {tab === "attendance" && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/60">
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <UserCheck size={16} className="text-violet-500" /> Student Attendance by Class
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {ins.studentAttendance.map((row, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{row.class}</p>
                    <p className="text-xs text-slate-400">{row.present} / {row.total} present</p>
                  </div>
                  <span className={`text-sm font-bold ${row.pct >= 90 ? "text-emerald-600" : row.pct >= 80 ? "text-amber-500" : "text-rose-500"}`}>
                    {row.pct}%
                  </span>
                </div>
                <Bar pct={row.pct} color={row.pct >= 90 ? "bg-emerald-400" : row.pct >= 80 ? "bg-amber-400" : "bg-rose-400"} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Institute Picker Modal ───────────────────────────────────────────────────
const InstitutePicker = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const filtered = INSTITUTES.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase()) ||
    i.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Select Institute</h3>
            <p className="text-xs text-slate-400 mt-0.5">Choose an institute to view its details</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search by name or city..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-10">No institutes found</p>
          )}
          {filtered.map(ins => (
            <button
              key={ins.id}
              onClick={() => { onSelect(ins); onClose(); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-violet-50/60 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EBEBFF] flex items-center justify-center shrink-0">
                <Building2 size={17} className="text-violet-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{ins.name}</p>
                <p className="text-xs text-slate-400">{ins.city} · {ins.students.toLocaleString()} students</p>
              </div>
              <Badge label={ins.status} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard Cards ──────────────────────────────────────────────────────────
const DashboardCard = ({ title, value, subtext, icon: Icon, bgType }) => {
  const styles = { purple: "bg-[#EBEBFF]", beige: "bg-[#FFF2E5]" };
  return (
    <div className={`${styles[bgType]} p-5 sm:p-6 rounded-2xl flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm sm:text-base font-semibold text-slate-700">{title}</h3>
        <Icon size={22} className="text-slate-700 opacity-80" />
      </div>
      <div className="mt-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</h2>
      </div>
      <div className="mt-1">
        <p className="text-[10px] sm:text-sm text-slate-500 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const SuperAdminDashboard = () => {
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const stats = [
    { title: "Total Institutes", value: "150", subtext: "All registered institutes", icon: Building2, bgType: "purple" },
    { title: "Active Institutes", value: "138", subtext: "Currently active", icon: Zap, bgType: "beige" },
    { title: "Suspended Institutes", value: "12", subtext: "Temporarily suspended", icon: AlertCircle, bgType: "beige" },
    { title: "Total Teachers", value: "2,450", subtext: "All faculties", icon: Users, bgType: "purple" },
    { title: "Total Students", value: "48,320", subtext: "All enrolled students", icon: GraduationCap, bgType: "beige" },
    { title: "Monthly Revenue", value: "$150,000", subtext: "Subscription revenue", icon: Wallet, bgType: "purple" },
    { title: "Expiring Subscriptions", value: "23", subtext: "Next 30 days", icon: Clock, bgType: "beige" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease both; }
      `}</style>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Hi, Admin</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and monitor all institutes</p>
          </div>

          {/* View Institute Button */}
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition-all shadow-md shadow-violet-200"
          >
            <Eye size={16} />
            View Institute
          </button>
        </div>

        {/* Selected Institute Banner */}
        {selectedInstitute && !showPicker && (
          <div className="mb-6 bg-violet-50 border border-violet-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <Building2 size={18} className="text-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-blue-600 truncate">
                Viewing: {selectedInstitute.name}
              </span>
              <Badge label={selectedInstitute.status} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowPicker(true)}
                className="text-xs text-blue-500 font-semibold hover:underline"
              >
                Change
              </button>
              <button
                onClick={() => setSelectedInstitute(null)}
                className="p-1 rounded-lg hover:bg-violet-100 transition-colors"
              >
                <X size={14} className="text-violet-400" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content: Institute Detail or Dashboard */}
        {selectedInstitute ? (
          <InstituteDetail
            institute={selectedInstitute}
            onBack={() => setSelectedInstitute(null)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {stats.map((stat, idx) => (
              <DashboardCard key={idx} {...stat} />
            ))}
          </div>
        )}
      </div>

      {/* Picker Modal */}
      {showPicker && (
        <InstitutePicker
          onSelect={setSelectedInstitute}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
};

export default SuperAdminDashboard;
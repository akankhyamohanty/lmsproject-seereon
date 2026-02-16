import React from 'react';
import { 
  Users, 
  DollarSign, 
  Hourglass,
  GraduationCap,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Card Component ---
const CustomStatCard = ({ title, value, subtext, icon: Icon, color }) => {
  const bgClass = color === 'purple' ? 'bg-[#ECECF9]' : 'bg-[#FFF4E5]'; 

  return (
    <div className={`${bgClass} p-6 rounded-xl flex flex-col justify-between h-40`}>
      <div className="flex justify-between items-start">
        <span className="text-gray-700 font-medium">{title}</span>
        <Icon className="text-gray-700" size={20} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-md text-gray-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
};

// --- Exam Item Component ---
const ExamItem = () => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-3">
    <div className="bg-green-100 p-3 rounded-full text-green-600">
      <Calendar size={20} />
    </div>
    <div>
      <h4 className="font-bold text-gray-800">Data Structures</h4>
      <p className="text-md text-gray-500">B.Tech CSE</p>
      <p className="text-md text-gray-500">2026-01-28 • 10:00 AM</p>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const AdminDashboard = () => {
  // Chart Data
  const data = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 75 },
    { name: 'Apr', value: 70 },
    { name: 'May', value: 90 },
    { name: 'Jun', value: 100 },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* ⚠️ HEADER REMOVED (Handled by Layout) */}

      {/* Dashboard Content */}
      <main>
        
        {/* 6 Stats Cards Grid */}
        <div className="grid grid-cols- text-lg md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <CustomStatCard title="Total Faculties" value="45"  subtext="All registered Faculties" icon={Users} color="purple" />
          <CustomStatCard title="Pending Approvals" value="138" subtext="Currently active" icon={Hourglass} color="beige" />
          <CustomStatCard title="Total Students" value="150" subtext="All registered students" icon={GraduationCap} color="purple" />
          <CustomStatCard title="Fees Collected" value="12.5L" subtext="Total Collected" icon={DollarSign} color="beige" />
          <CustomStatCard title="Fees Due" value="4.5L" subtext="Due collection" icon={DollarSign} color="purple" />
          <CustomStatCard title="Today's Attendance" value="90%" subtext="Attendance" icon={MessageSquare} color="beige" />
        </div>

        {/* Bottom Section: Chart & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity Chart */}
          <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 shadow-sm bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            
            {/* Chart Container */}
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Exams List */}
          <div className="lg:col-span-1 border border-gray-100 rounded-2xl p-6 shadow-sm bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Exams</h3>
            <div className="flex flex-col">
              <ExamItem />
              <ExamItem />
              <ExamItem />
              <ExamItem />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


// import React, { useEffect, useState } from "react";
// import {
//   Users,
//   DollarSign,
//   Hourglass,
//   GraduationCap,
//   MessageSquare,
//   Calendar,
// } from "lucide-react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const STORAGE_KEY = "admin_dashboard_data";

// /* ---------------- STAT CARD ---------------- */
// const CustomStatCard = ({ title, value, subtext, icon: Icon, color }) => {
//   const bgClass = color === "purple" ? "bg-[#ECECF9]" : "bg-[#FFF4E5]";
//   return (
//     <div className={`${bgClass} p-6 rounded-xl h-40 flex flex-col justify-between`}>
//       <div className="flex justify-between">
//         <span className="font-medium text-gray-700">{title}</span>
//         <Icon size={20} />
//       </div>
//       <div>
//         <h3 className="text-3xl font-bold">{value}</h3>
//         <p className="text-xs text-gray-500 mt-1">{subtext}</p>
//       </div>
//     </div>
//   );
// };

// /* ---------------- EXAM ITEM ---------------- */
// const ExamItem = ({ exam }) => (
//   <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-3">
//     <div className="bg-green-100 p-3 rounded-full text-green-600">
//       <Calendar size={20} />
//     </div>
//     <div>
//       <h4 className="font-bold">{exam.subject}</h4>
//       <p className="text-xs text-gray-500">{exam.course}</p>
//       <p className="text-xs text-gray-500">
//         {exam.date} • {exam.time}
//       </p>
//     </div>
//   </div>
// );

// /* ---------------- MAIN DASHBOARD ---------------- */
// const AdminDashboard = () => {
//   const [stats, setStats] = useState({});
//   const [chartData, setChartData] = useState([]);
//   const [exams, setExams] = useState([]);

//   /* -------- LOAD DATA -------- */
//   useEffect(() => {
//     const stored = localStorage.getItem(STORAGE_KEY);

//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setStats(parsed.stats);
//       setChartData(parsed.chartData);
//       setExams(parsed.exams);
//     } else {
//       const defaultData = {
//         stats: {
//           faculties: 45,
//           pending: 138,
//           students: 150,
//           feesCollected: "12.5L",
//           feesDue: "4.5L",
//           attendance: "90%",
//         },
//         chartData: [
//           { name: "Jan", value: 30 },
//           { name: "Feb", value: 45 },
//           { name: "Mar", value: 75 },
//           { name: "Apr", value: 70 },
//           { name: "May", value: 90 },
//           { name: "Jun", value: 100 },
//         ],
//         exams: [
//           { subject: "Data Structures", course: "B.Tech CSE", date: "2026-01-28", time: "10:00 AM" },
//           { subject: "Operating Systems", course: "B.Tech CSE", date: "2026-01-30", time: "11:00 AM" },
//           { subject: "DBMS", course: "B.Tech CSE", date: "2026-02-02", time: "9:00 AM" },
//         ],
//       };

//       setStats(defaultData.stats);
//       setChartData(defaultData.chartData);
//       setExams(defaultData.exams);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
//     }
//   }, []);

//   /* -------- UPDATE STORAGE -------- */
//   const updateDashboard = (newStats) => {
//     const updated = {
//       stats: newStats,
//       chartData,
//       exams,
//     };
//     setStats(newStats);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//   };

//   /* -------- DEMO ACTION -------- */
//   const incrementStudents = () => {
//     updateDashboard({
//       ...stats,
//       students: stats.students + 1,
//     });
//   };

//   return (
//     <div className="bg-white min-h-screen font-sans">
//       <main>
//         {/* STATS GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <CustomStatCard title="Total Faculties" value={stats.faculties} subtext="All registered Faculties" icon={Users} color="purple" />
//           <CustomStatCard title="Pending Approvals" value={stats.pending} subtext="Waiting approval" icon={Hourglass} color="beige" />
//           <CustomStatCard title="Total Students" value={stats.students} subtext="All registered students" icon={GraduationCap} color="purple" />
//           <CustomStatCard title="Fees Collected" value={stats.feesCollected} subtext="Total collected" icon={DollarSign} color="beige" />
//           <CustomStatCard title="Fees Due" value={stats.feesDue} subtext="Due amount" icon={DollarSign} color="purple" />
//           <CustomStatCard title="Today's Attendance" value={stats.attendance} subtext="Overall attendance" icon={MessageSquare} color="beige" />
//         </div>

//         {/* DEMO BUTTON */}
//         <button
//           onClick={incrementStudents}
//           className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
//         >
//           + Add Student (Demo)
//         </button>

//         {/* CHART + EXAMS */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* CHART */}
//           <div className="lg:col-span-2 border rounded-2xl p-6 shadow-sm">
//             <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={chartData}>
//                   <defs>
//                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#2563eb"
//                     fill="url(#colorValue)"
//                     strokeWidth={3}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* EXAMS */}
//           <div className="border rounded-2xl p-6 shadow-sm">
//             <h3 className="text-xl font-bold mb-6">Upcoming Exams</h3>
//             {exams.map((exam, index) => (
//               <ExamItem key={index} exam={exam} />
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

import { 
  BookOpen, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FacultyDashboard = () => {
  const navigate = useNavigate();

  // --- MOCK DATA ---
  const stats = [
    { title: "Today's Classes", value: "4", subtext: "2 Remaining", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
    { title: "Total Students", value: "120", subtext: "Across 3 Batches", icon: Users, color: "bg-purple-50 text-purple-600" },
    { title: "Pending Attendance", value: "1", subtext: "Action Required", icon: AlertCircle, color: "bg-orange-50 text-orange-600" },
  ];

  const schedule = [
    { id: 1, time: "09:00 AM - 10:00 AM", course: "B.Tech CS", subject: "Data Structures", room: "Lab 101", status: "Completed" },
    { id: 2, time: "10:15 AM - 11:15 AM", course: "B.Tech CS", subject: "Algorithms", room: "Room 302", status: "Upcoming" },
    { id: 3, time: "01:00 PM - 02:00 PM", course: "MBA Year 1", subject: "Business Stats", room: "Hall B", status: "Upcoming" },
    { id: 4, time: "03:00 PM - 04:00 PM", course: "B.Tech CS", subject: "Project Review", room: "Lab 102", status: "Upcoming" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Prof. Wilson</p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Today</p>
           <p className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-1">{stat.subtext}</p>
            </div>
            <div className={`p-4 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Today's Schedule */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-slate-500" /> Today's Schedule
            </h3>
            <button 
              onClick={() => navigate("/faculty/classes")}
              className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            {schedule.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="min-w-35">
                  <span className="block text-sm font-bold text-slate-800">{item.time.split(" - ")[0]}</span>
                  <span className="block text-xs text-slate-500">to {item.time.split(" - ")[1]}</span>
                </div>
                
                <div className="flex-1 border-l-0 sm:border-l-2 border-slate-200 pl-0 sm:pl-4">
                  <h4 className="font-bold text-slate-800 text-lg sm:text-base">{item.subject}</h4>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    {item.course} 
                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span> 
                    {item.room}
                  </p>
                </div>

                <div className="mt-2 sm:mt-0">
                   {item.status === "Completed" ? (
                     <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
                       <CheckCircle size={14} /> Done
                     </span>
                   ) : (
                     <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
                       <Clock size={14} /> {item.status}
                     </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Quick Actions & Notices */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Attendance Pending</h3>
              <p className="text-blue-100 text-sm mb-6">
                You haven't marked attendance for <br/>
                <span className="font-bold text-white">Algorithms (10:15 AM)</span> yet.
              </p>
              <button 
                onClick={() => navigate("/faculty/attendance")}
                className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
              >
                Take Attendance Now
              </button>
            </div>
            {/* Decor Icon */}
            <Clock size={120} className="absolute -right-6 -bottom-6 text-white opacity-10" />
          </div>

          {/* Notices Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 tracking-wider">Faculty Notice Board</h3>
             <div className="space-y-4">
               <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                 <p className="text-xs font-bold text-yellow-800 mb-1">⚠️ Exam Papers Due</p>
                 <p className="text-xs text-yellow-700 leading-relaxed">Mid-term question papers must be submitted to the HOD by Friday, 5 PM.</p>
               </div>
               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <p className="text-xs font-bold text-slate-700 mb-1">📅 Staff Meeting</p>
                 <p className="text-xs text-slate-600 leading-relaxed">Monthly staff meeting scheduled for Saturday at 10 AM in the Conference Hall.</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
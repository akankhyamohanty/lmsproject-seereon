import React from 'react';
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Clock, 
  FileText, 
  GraduationCap, 
  CreditCard, 
  Bell, 
  Calendar, 
  HelpCircle,
  Building2,
  Users,
  Settings,
  LogOut
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || "student";

  // --- DEFINING LINKS DIRECTLY TO ENSURE THEY WORK ---
  const studentLinks = [
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", path: "/student/profile", icon: User },
    { label: "My Courses", path: "/student/courses", icon: BookOpen },
    { label: "Attendance", path: "/student/attendance", icon: Clock },
    { label: "Assignments", path: "/student/assignments", icon: FileText },
    { label: "Exams & Results", path: "/student/exams", icon: GraduationCap },
    { label: "Fees", path: "/student/fees", icon: CreditCard },
    { label: "Notifications", path: "/student/notifications", icon: Bell },
    { label: "Calendar", path: "/student/calendar", icon: Calendar },
    { label: "Help & Support", path: "/student/support", icon: HelpCircle },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
     { label: "Institute", path: "/admin/institute", icon: Building2 },
    { label: "Faculty Approvals", path: "/admin/faculty", icon: Users },
    { label:"Student Management", path: "/admin/students", icon: Users },
    { label: "Academic Setup", path: "/admin/academics", icon: Building2 },
    { label: "Fees Structure", path: "/admin/fees/structure", icon: CreditCard },
    // { label: "Publish Fees", path: "/admin/fees/publish", icon: FileText },
    { label: "Notifications", path: "/admin/communication", icon: Bell },
    { label: "Reports", path: "/admin/reports", icon: FileText },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // Select links based on role
  const links = userRole === "student" ? studentLinks : adminLinks;

  return (
    <aside className="w-64 bg-[#0F53D5] text-white flex flex-col h-screen fixed left-0 top-0 font-sans transition-all duration-300 z-50 shadow-xl">
      
      {/* Header Area */}
      <div className="h-10 flex items-center px-10 mb-2">
        <h1 className="text-2xl font-bold tracking-wide">EduERP</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {links.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/student/dashboard" || item.path === "/admin/dashboard"} // Exact match for dashboards
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-white text-[#0F53D5] shadow-lg font-bold translate-x-1" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <IconComponent size={20} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-[#1e60dc] rounded-2xl p-4 border border-white/10 flex items-center gap-3 shadow-lg">
           {/* Avatar */}
           <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white border-2 border-white/30 overflow-hidden shrink-0 shadow-sm">
             <span className="font-bold text-lg">{user?.name?.[0] || "U"}</span>
           </div>
           
           {/* Info */}
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-white truncate">
               {user?.name || "User"}
             </p>
             <p className="text-[10px] text-blue-200 truncate opacity-90 uppercase tracking-wider">
               {userRole.replace("_", " ")}
             </p>
           </div>

           {/* Logout Button */}
           <button 
             onClick={logout}
             className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
             title="Logout"
           >
             <LogOut size={18} />
           </button>
        </div>
      </div>
    </aside>
  );
};
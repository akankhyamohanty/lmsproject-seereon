import React from 'react';
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path if needed
import { 
  LayoutDashboard, User, BookOpen, Clock, FileText, 
  GraduationCap, CreditCard, Bell, Calendar, HelpCircle,
  Building2, Users, Settings, LogOut, ShieldCheck
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || "student";

  const studentLinks = [
    { label: "Dashboard",       path: "/student/dashboard",   icon: LayoutDashboard },
    { label: "Profile",         path: "/student/profile",     icon: User },
    { label: "My Courses",      path: "/student/courses",     icon: BookOpen },
    { label: "Attendance",      path: "/student/attendance",  icon: Clock },
    { label: "Assignments",     path: "/student/assignments", icon: FileText },
    { label: "Exams & Results", path: "/student/exams",       icon: GraduationCap },
    { label: "Fees",            path: "/student/fees",        icon: CreditCard },
    { label: "Notifications",   path: "/student/notification",icon: Bell },
    { label: "Calendar",        path: "/student/calendar",    icon: Calendar },
    { label: "Help & Support",  path: "/student/help",        icon: HelpCircle },
  ];

  const facultyLinks = [
    { label: "Dashboard",       path: "/faculty/dashboard",     icon: LayoutDashboard },
    { label: "Profile",         path: "/faculty/profile",       icon: User },
    { label: "My Classes",      path: "/faculty/classes",       icon: BookOpen },  
    { label: "Attendance",      path: "/faculty/attendance",    icon: Clock },
    { label: "Courses",         path: "/faculty/courses",       icon: FileText },
    { label: "Assignments",     path: "/faculty/assignments",   icon: GraduationCap },
    { label: "Exams",           path: "/faculty/exams",         icon: CreditCard },
    { label: "Salary",          path: "/faculty/salary",        icon: CreditCard },
    { label: "Leaves",          path: "/faculty/leaves",        icon: Bell },
    { label: "Notifications",   path: "/faculty/notifications", icon: Bell },
    { label: "Help & Support",  path: "/faculty/help",          icon: HelpCircle },
  ];

  const adminLinks = [
    { label: "Dashboard",          path: "/admin/dashboard",       icon: LayoutDashboard },
    { label: "Institute",          path: "/admin/institute",       icon: Building2 },
    { label: "Attendance",         path: "/admin/attendance",      icon: Clock },
    { label: "Faculty",            path: "/admin/faculty",         icon: Users },
    { label: "Students",           path: "/admin/students",        icon: Users },
    { label: "Academic Section",   path: "/admin/academics",       icon: Building2 },
    { label: "Exam & Results",     path: "/admin/exams",           icon: GraduationCap },
    { label: "Batch",              path: "/admin/batch",           icon: Users },
    { label: "Expenses",           path: "/admin/expenses",        icon: CreditCard },
    { label: "Fees Structure",     path: "/admin/fees/structure",  icon: CreditCard },
    { label: "Notifications",      path: "/admin/communication",   icon: Bell },
    { label: "Reports",            path: "/admin/reports",         icon: FileText },
    { label: "Settings",           path: "/admin/settings",        icon: Settings },
  ];

  const superAdminLinks = [
    { label: "SA Dashboard",       path: "/super-admin/dashboard",  icon: ShieldCheck },
    { label: "Institutes",         path: "/super-admin/institutes", icon: Building2 },
    { isDivider: true },
    { label: "Dashboard",          path: "/admin/dashboard",        icon: LayoutDashboard },
    { label: "Attendance",         path: "/super-admin/attendance", icon: Clock },
    { label: "Faculty",            path: "/admin/faculty",          icon: Users },
    { label: "Students",           path: "/admin/students",         icon: Users },
    { label: "Academic Setup",     path: "/admin/academics",        icon: Building2 },
    { label: "Exam & Results",     path: "/admin/exams",            icon: GraduationCap },
    { label: "Batch",              path: "/admin/batch",            icon: Users },
    { label: "Expenses",           path: "/admin/expenses",         icon: CreditCard },
    { label: "Fees Structure",     path: "/admin/fees/structure",   icon: CreditCard },
    { label: "Notifications",      path: "/admin/communication",    icon: Bell },
    { label: "Reports",            path: "/admin/reports",          icon: FileText },
    { label: "Settings",           path: "/admin/settings",         icon: Settings },
  ];

  const links =
    userRole === "super_admin"     ? superAdminLinks :
    userRole === "institute_admin" ? adminLinks      :
    userRole === "student"         ? studentLinks    :
    userRole === "faculty"         ? facultyLinks    : 
    adminLinks;

  const exactPaths = ["/admin/dashboard", "/student/dashboard", "/super-admin/dashboard"];

  return (
    <aside className="w-64 bg-[#0F53D5] text-white flex flex-col h-screen fixed left-0 top-0 font-sans z-50 shadow-xl">

      {/* Header */}
      <div className="h-20 flex items-center px-6 mb-1 border-b border-white/10 shrink-0">
        <h1 className="text-2xl font-bold tracking-wide">EduERP</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map((item, idx) => {

          if (item.isDivider) {
            return (
              <div key={`d-${idx}`} className="pt-4 pb-2 px-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5">
                  Institute Management
                </p>
                <div className="h-px bg-white/10" />
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={exactPaths.includes(item.path)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? "bg-white text-[#0F53D5] shadow-lg font-bold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile (DYNAMIC DATA FIX) */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="bg-[#1e60dc] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-400 flex items-center justify-center font-bold text-white shrink-0 uppercase">
            {/* Safely grab the first letter of first_name or name */}
            {user?.first_name?.[0] || user?.name?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-white truncate capitalize">
              {user?.first_name || user?.name || "User"}
            </p>
            <p className="text-[10px] text-blue-200 uppercase tracking-wider truncate">
              {userRole.replace(/_/g, " ")}
            </p>
          </div>
          <button onClick={logout} title="Logout"
            className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
};
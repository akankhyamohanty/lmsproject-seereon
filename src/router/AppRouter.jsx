import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "../components/Auth/LoginForm"; 
import { ForgotPasswordPage } from "../pages/Auth/ForgotPasswordPage";
import { UnauthorizedPage } from "../pages/Auth/UnauthorizedPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { DashboardLayout } from "../components/Layouts/DashboardLayout";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

// Super Admin
import { SuperAdminDashboard } from "../pages/SuperAdmin/SuperAdminDashboard";
import { InstituteProfile } from "../pages/SuperAdmin/InstituteProfile";
import SuperAdminInstituteList from "../pages/SuperAdmin/Institute/Institute";   // has Add button
import SuperAdminInstituteForm from "../pages/SuperAdmin/Institute/InstituteForm";

// Institute Admin
import AdminDashboard from "../pages/InstituteAdmin/AdminDashboard";
import Institute from "../pages/InstituteAdmin/Institute/Institute";             // NO add button
import InstituteForm from "../pages/InstituteAdmin/Institute/InstituteForm";
import AcademicSetup from "../pages/InstituteAdmin/Academics/AcademicSetup";
import { FacultyList } from "../pages/InstituteAdmin/People/FacultyList";
import FacultyForm from "../pages/InstituteAdmin/People/FacultyForm";
import { StudentList } from "../pages/InstituteAdmin/People/StudentList";
import { StudentForm } from "../pages/InstituteAdmin/People/StudentForm";
import { BatchList } from "../pages/InstituteAdmin/Batch/BatchList";
import BatchForm from "../pages/InstituteAdmin/Batch/BatchForm";
import { FeeCollection } from "../pages/InstituteAdmin/Finance/FeeCollection";
import { FeeStructure } from "../pages/InstituteAdmin/Finance/FeeStructure";
import { PublishFees } from "../pages/InstituteAdmin/Finance/PublishFees";
import { ExpensePage } from "../pages/InstituteAdmin/Expenses/ExpensePage";
import { Notifications } from "../pages/InstituteAdmin/Communication/Notifications";
import { Reports } from "../pages/InstituteAdmin/Reports/Reports";
import { Settings } from "../pages/InstituteAdmin/Settings/Settings";

// Faculty
import { FacultyDashboard } from "../pages/Faculty/FacultyDashboard";
import { Attendance } from "../pages/Faculty/Attendance";
import { FacultyExams } from "../pages/Faculty/FacultyExams";

// Student
import { StudentDashboard } from "../pages/Student/StudentDashboard";
import { StudentProfile } from "../pages/Student/Profile/StudentProfile";
import { MyCourses } from "../pages/Student/Courses/MyCourses";
import { CourseDetails } from "../pages/Student/Courses/CourseDetails";
import { ModuleContent } from "../pages/Student/Courses/ModuleContent";
import StudentAttendance from "../pages/Student/Attendance/StudentAttendance";
import Exam from "../pages/Student/Exams/Exam";
import Assignment from "../pages/Student/Assignments/Assignment";
import StudentFees from "../pages/Student/Fees/StudentFees";
import Notification from "../pages/Student/Notification/Notifications";
import Calendar from "../pages/Student/Calendar/Calendar";
import Help from "../pages/Student/Help/Help";

const FacultyClasses = () => <div className="p-10"><h1>My Classes</h1></div>;

export const AppRouter = () => (
  <Routes>

    {/* ── PUBLIC ─────────────────────────────────────────────────────── */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    {/* ── SUPER ADMIN ─────────────────────────────────────────────────
        Super admin has their own dashboard + institute add/manage pages.
        They also access all /admin/* routes below (allowedRoles includes super_admin). */}
    <Route path="/super-admin" element={
      <ProtectedRoute allowedRoles={["super_admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"         element={<SuperAdminDashboard />} />
      <Route path="institutes"        element={<SuperAdminInstituteList />} />  
      <Route path="institutes/view"   element={<InstituteProfile />} />
      <Route path="institutes/create" element={<SuperAdminInstituteForm />} />
    </Route>

    {/* ── INSTITUTE ADMIN + SUPER ADMIN ───────────────────────────────
        ✅ super_admin added so they can VIEW everything under /admin
        ✅ Institute admin has NO add-institute button (handled in Institute.jsx) */}
    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={["institute_admin", "super_admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard"       element={<AdminDashboard />} />
        <Route path="institute"       element={<Institute />} />      
      <Route path="institute/form"  element={<InstituteForm />} />  
      <Route path="academics"       element={<AcademicSetup />} />
      <Route path="faculty"         element={<FacultyList />} />
      <Route path="faculty/create"  element={<FacultyForm />} />
      <Route path="students"        element={<StudentList />} />
      <Route path="students/create" element={<StudentForm />} />
      <Route path="batch"           element={<BatchList />} />
      <Route path="batch/create"    element={<BatchForm />} />
      <Route path="fees"            element={<FeeCollection />} />
      <Route path="fees/structure"  element={<FeeStructure />} />
      <Route path="fees/publish"    element={<PublishFees />} />
      <Route path="expenses"        element={<ExpensePage />} />
      <Route path="communication"   element={<Notifications />} />
      <Route path="reports"         element={<Reports />} />
      <Route path="settings"        element={<Settings />} />
    </Route>

    {/* ── FACULTY ─────────────────────────────────────────────────────── */}
    <Route path="/faculty" element={
      <ProtectedRoute allowedRoles={["faculty"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard"  element={<FacultyDashboard /> } />
      <Route path="classes"    element={<FacultyClasses />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="exams"      element={<FacultyExams />} />
    </Route>

    {/* ── STUDENT ─────────────────────────────────────────────────────── */}
    <Route path="/student" element={
      <ProtectedRoute allowedRoles={["student"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard"      element={<StudentDashboard />} />
      <Route path="profile"        element={<StudentProfile />} />
      <Route path="courses"        element={<MyCourses />} />
      <Route path="courses/view"   element={<CourseDetails />} />
      <Route path="courses/module" element={<ModuleContent />} />
      <Route path="assignments"    element={<Assignment />} />
      <Route path="attendance"     element={<StudentAttendance />} />
      <Route path="exams"          element={<Exam />} />
      <Route path="fees"           element={<StudentFees />} />
      <Route path="notification"   element={<Notification />} />
      <Route path="Calendar"       element={<Calendar />} />
      <Route path="help"           element={<Help />} />
    </Route>

    {/* ── 404 ─────────────────────────────────────────────────────────── */}
    <Route path="*" element={<NotFoundPage />} />

  </Routes>
);
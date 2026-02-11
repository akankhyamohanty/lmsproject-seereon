import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "../components/Auth/LoginForm"; 
import { ForgotPasswordPage } from "../pages/Auth/ForgotPasswordPage";
import { UnauthorizedPage } from "../pages/Auth/UnauthorizedPage";
import { NotFoundPage } from "../pages/NotFoundPage";


import { DashboardLayout } from "../components/Layouts/DashboardLayout";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

import { SuperAdminDashboard } from "../pages/SuperAdmin/SuperAdminDashboard";
import { InstituteProfile } from "../pages/SuperAdmin/InstituteProfile";
import { InstituteList } from "../pages/SuperAdmin/InstituteList";

import AdminDashboard from "../pages/InstituteAdmin/AdminDashboard";
import Institute from "../pages/InstituteAdmin/Institute/Institute";
import InstituteForm from "../pages/InstituteAdmin/Institute/InstituteForm";
import AcademicSetup from "../pages/InstituteAdmin/Academics/AcademicSetup";

import { FacultyList } from "../pages/InstituteAdmin/People/FacultyList.jsx";

 import { FacultyForm } from "../pages/InstituteAdmin/People/FacultyForm.jsx";
import { StudentList } from "../pages/InstituteAdmin/People/StudentList";
import { StudentForm } from "../pages/InstituteAdmin/People/StudentForm";
import { FeeCollection } from "../pages/InstituteAdmin/Finance/FeeCollection";
import { FeeStructure } from "../pages/InstituteAdmin/Finance/FeeStructure";
import { PublishFees } from "../pages/InstituteAdmin/Finance/PublishFees";
import { Notifications } from "../pages/InstituteAdmin/Communication/Notifications";
import { Reports } from "../pages/InstituteAdmin/Reports/Reports";
import { Settings } from "../pages/InstituteAdmin/Settings/Settings";

// 5. Faculty Pages
import { FacultyDashboard } from "../pages/Faculty/FacultyDashboard";
import { Attendance } from "../pages/Faculty/Attendance"; 
import { FacultyExams } from "../pages/Faculty/FacultyExams"; 

// 6. Student Pages
import { StudentDashboard } from "../pages/Student/StudentDashboard"; 
import { StudentProfile } from "../pages/Student/Profile/StudentProfile"; 
import { MyCourses } from "../pages/Student/Courses/MyCourses"; 
import { CourseDetails } from "../pages/Student/Courses/CourseDetails"; 
import { ModuleContent } from "../pages/Student/Courses/ModuleContent";

// 7. Temporary Placeholders (Faculty Classes still pending)
const FacultyClasses = () => <div className="p-10"><h1>My Classes List</h1></div>;

export const AppRouter = () => {

  return (

   
  <Routes>

     

      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* --- SUPER ADMIN ROUTES --- */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="institutes" element={<InstituteList />} />
        <Route path="institutes/view" element={<InstituteProfile />} />
      </Route>

      {/* --- INSTITUTE ADMIN ROUTES --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["institute_admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="institute/form" element={<InstituteForm />} />
        <Route path="institute" element={<Institute />} />
        <Route path="academics" element={<AcademicSetup />} />
        <Route path="faculty" element={<FacultyList />} />
        <Route path="faculty/create" element={<FacultyForm />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/create" element={<StudentForm />} />
        
        {/* Finance Routes */}
        <Route path="fees" element={<FeeCollection />} />
        <Route path="fees/structure" element={<FeeStructure />} />
        <Route path="fees/publish" element={<PublishFees />} />
        
        <Route path="communication" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* --- FACULTY ROUTES --- */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="classes" element={<FacultyClasses />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="exams" element={<FacultyExams />} />
      </Route>

      {/* --- STUDENT ROUTES --- */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="courses" element={<MyCourses />} />
        
        {/* ✅ ADDED COURSE DETAILS & MODULE ROUTES */}
        <Route path="courses/view" element={<CourseDetails />} /> 
        <Route path="courses/module" element={<ModuleContent />} /> 
      </Route>

      {/* --- 404 CATCH ALL --- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};                             
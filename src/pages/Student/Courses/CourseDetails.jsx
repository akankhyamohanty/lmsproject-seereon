import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen,
  ArrowRight
} from "lucide-react";

export const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for Modules
  const modulesList = [
    {
      id: 1, 
      title: "Calculas Fundamentals",
      description: "Introduction to Derivative and Integrations",
      items: 5,
      status: "Completed"
    },
    {
      id: 2,
      title: "Linear Algebra",
      description: "Vector, matrix and transformation",
      items: 5,
      status: "Pending"
    }
  ];

  // Load selected course from localStorage on mount
  useEffect(() => {
    const storedCourse = localStorage.getItem("selected_course");
    if (storedCourse) {
      try {
        setSelectedCourse(JSON.parse(storedCourse));
      } catch (error) {
        console.error("Error parsing stored course:", error);
      }
    }
    setLoading(false);
  }, []);

  // Load active tab from localStorage
  useEffect(() => {
    const storedTab = localStorage.getItem("course_details_tab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  // Save active tab to localStorage
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("course_details_tab", tab);
  };

  // Store module click in localStorage
  const handleModuleClick = (moduleId) => {
    const moduleData = {
      moduleId,
      courseId: selectedCourse?.id,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("selected_module", JSON.stringify(moduleData));
  };

  // Update course progress and save to localStorage
  const updateProgress = (newProgress) => {
    const updatedCourse = { ...selectedCourse, progress: newProgress };
    setSelectedCourse(updatedCourse);
    localStorage.setItem("selected_course", JSON.stringify(updatedCourse));
    
    // Also update in courses list
    const storedCourses = localStorage.getItem("student_courses");
    if (storedCourses) {
      try {
        const courses = JSON.parse(storedCourses);
        const updatedCourses = courses.map(c => 
          c.id === selectedCourse.id ? updatedCourse : c
        );
        localStorage.setItem("student_courses", JSON.stringify(updatedCourses));
      } catch (error) {
        console.error("Error updating courses list:", error);
      }
    }
  };

  if (loading) {
    return <div className="w-full max-w-7xl mx-auto pb-12">Loading...</div>;
  }

  const courseTitle = selectedCourse?.title || "Advanced Mathematics";
  const courseProgress = selectedCourse?.progress || 65;

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      
      {/* 1. BACK NAVIGATION */}
      <div className="mb-6 mt-2">
        <Link 
          to="/student/courses" 
          className="inline-flex items-center gap-2 text-md font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wide"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Back to course
        </Link>
      </div>

      {/* 2. COURSE TITLE */}
      <h1 className="text-3xl font-black text-[#1e293b] tracking-tight mb-8">
        {courseTitle}
      </h1>

      {/* 3. TABS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleTabChange("overview")}
          className={`
            px-8 py-2.5 rounded-lg text-md font-bold transition-all border
            ${activeTab === "overview" 
              ? "bg-[#2563eb] text-white border-blue-600 shadow-lg shadow-blue-500/30" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }
          `}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabChange("modules")}
          className={`
            px-8 py-2.5 rounded-lg text-md font-bold transition-all border
            ${activeTab === "modules" 
              ? "bg-[#2563eb] text-white border-blue-600 shadow-lg shadow-blue-500/30" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }
          `}
        >
          Modules
        </button>
      </div>

      {/* 4. TAB CONTENT */}
      
      {/* --- OVERVIEW TAB --- */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-[1.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <h2 className="text-xl font-bold text-slate-800 mb-2">Course Information</h2>
          
          {/* Description */}
          <div className="mb-10">
            <h3 className="text-md font-bold text-slate-400 uppercase tracking-wide mb-2">Course Description</h3>
            <p className="text-md font-medium text-slate-600 leading-relaxed max-w-3xl">
              Advance topic in calculus, linear algebra and differential equations. 
              This course covers the fundamental concepts required for engineering mathematics.
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            {/* Teacher */}
            <div className="flex flex-col gap-1">
              <span className="text-[15px] text-left font-black text-slate-500 uppercase tracking-widest">Teacher</span>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <User size={25} /> Dr Smith
              </div>
            </div>

            {/* Academic Year */}
            <div className="flex flex-col gap-1">
              <span className="text-[15px] text-left font-black text-slate-500 uppercase tracking-widest">Academic Year</span>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Calendar size={18} /> 2024-2026
              </div>
            </div>

            {/* Total Modules */}
            <div className="flex flex-col gap-1">
              <span className="text-[15px] text-left font-black text-slate-500 uppercase tracking-widest">Total Modules</span>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <BookOpen size={18} /> 8
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="max-w-2xl">
            <h3 className="text-md font-bold text-slate-600 mb-3">Course Complete</h3>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all" 
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            
            <button 
              onClick={() => updateProgress(Math.min(courseProgress + 5, 100))}
              className="text-md font-bold text-blue-500 underline decoration-2 underline-offset-4 hover:text-blue-700"
            >
              {courseProgress}% Complete
            </button>
          </div>

        </div>
      )}

      {/* --- MODULES TAB --- */}
      {activeTab === "modules" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {modulesList.map((module) => (
            <div 
              key={module.id} 
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-800">{module.title}</h3>
                  
                  {/* Status Badge */}
                  {module.status === "Completed" && (
                    <span className="px-2.5 py-0.5 rounded-full border border-green-500 text-green-600 text-[10px] font-bold uppercase tracking-wide">
                      Completed
                    </span>
                  )}
                </div>
                
                {/* Link to Module Content */}
                <Link 
                  to="/student/courses/module" 
                  onClick={() => handleModuleClick(module.id)}
                  className="hidden sm:flex items-center gap-1 text-md font-bold text-slate-800 group-hover:gap-2 transition-all"
                >
                  View <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </div>

              <p className="text-md font-medium text-slate-400 mb-6">
                {module.description}
              </p>

              <div className="text-md font-bold text-slate-400">
                {module.items} content items
              </div>

              {/* Make the whole card clickable */}
              <Link 
                to="/student/courses/module" 
                onClick={() => handleModuleClick(module.id)}
                className="absolute inset-0" 
              />
            </div>
          ))}

        </div>
      )}

    </div>
  );
};
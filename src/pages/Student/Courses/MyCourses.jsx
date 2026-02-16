import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  // Mock data based on the screenshot
  const mockCourses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      instructor: "Dr Smith",
      progress: 60,
      modules: 8,
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      instructor: "Dr Smith",
      progress: 60,
      modules: 8,
    },
    {
      id: 3,
      title: "Advanced Mathematics",
      instructor: "Dr Smith",
      progress: 60,
      modules: 8,
    },
  ];

  // Load courses from localStorage on mount
  useEffect(() => {
    const storedCourses = localStorage.getItem("student_courses");
    if (storedCourses) {
      try {
        setCourses(JSON.parse(storedCourses));
      } catch (error) {
        console.error("Error parsing stored courses:", error);
        // Fallback to mock data if parsing fails
        setCourses(mockCourses);
        localStorage.setItem("student_courses", JSON.stringify(mockCourses));
      }
    } else {
      // First time - store mock data
      setCourses(mockCourses);
      localStorage.setItem("student_courses", JSON.stringify(mockCourses));
    }
  }, []);

  // Handle course click - store selected course in localStorage
  const handleCourseClick = (courseId) => {
    const selectedCourse = courses.find(c => c.id === courseId);
    if (selectedCourse) {
      localStorage.setItem("selected_course", JSON.stringify(selectedCourse));
    }
  };

  // Update course progress in localStorage
  const updateCourseProgress = (courseId, newProgress) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, progress: newProgress } : course
    );
    setCourses(updatedCourses);
    localStorage.setItem("student_courses", JSON.stringify(updatedCourses));
  };

  return (
    <div className="w-full max-w-10xl mx-auto pb-12">
      
      {/* 1. HEADER */}
      <div className="mb-10 mt-2">
        <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">My Courses</h1>
        <p className="text-slate-400 font-medium mt-2">View all your enrolled courses</p>
      </div>

      {/* 2. COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative"
          >
            {/* Top Section: Icon & Title */}
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                <BookOpen size={28} strokeWidth={2} />
              </div>
              <div>
                {/* Linked Title */}
                <Link 
                  to="/student/courses/view" 
                  onClick={() => handleCourseClick(course.id)}
                  className="hover:text-blue-600 transition-colors"
                >
                  <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                </Link>
                <p className="text-slate-400 text-xs font-bold flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span> 
                  {course.instructor}
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-md font-bold text-slate-400 uppercase tracking-wide">Progress</span>
                <span className="text-md font-black text-slate-800">{course.progress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Footer: Modules count & Action Link */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-md font-bold text-slate-500">{course.modules} Modules</span>
              
              {/* ✅ Link to Course Details */}
              <Link 
                to="/student/courses/view" 
                onClick={() => handleCourseClick(course.id)}
                className="text-blue-600 text-md font-black uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all z-10"
              >
                View Course <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>

            {/* Make the whole card clickable via an overlay link */}
            <Link 
              to="/student/courses/view" 
              onClick={() => handleCourseClick(course.id)}
              className="absolute inset-0 z-0" 
              aria-hidden="true" 
            />
          </div>
        ))}
      </div>

    </div>
  );
};
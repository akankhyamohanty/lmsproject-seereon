import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Import Link

export const MyCourses = () => {
  // Mock data based on the screenshot
  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics", // Fixed typo "Mathmatics"
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

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      
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
                <Link to="/student/courses/view" className="hover:text-blue-600 transition-colors">
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Progress</span>
                <span className="text-sm font-black text-slate-800">{course.progress}%</span>
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
              <span className="text-xs font-bold text-slate-500">{course.modules} Modules</span>
              
              {/* ✅ UPDATED: Link to Course Details */}
              <Link 
                to="/student/courses/view" 
                className="text-blue-600 text-xs font-black uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all z-10"
              >
                View Course <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>

            {/* Optional: Make the whole card clickable via an overlay link */}
            <Link to="/student/courses/view" className="absolute inset-0 z-0" aria-hidden="true" />
          </div>
        ))}
      </div>

    </div>
  );
};
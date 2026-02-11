import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  PlayCircle, 
  Download,
  Play
} from "lucide-react";

export const ModuleContent = () => {
  const contentItems = [
    {
      id: 1,
      type: "video",
      title: "Introduction to Derivatives",
      subtitle: "Introduction to Derivatives",
      action: "Play"
    },
    {
      id: 2,
      type: "pdf",
      title: "Derivatives rules PDF",
      subtitle: "PDF Document",
      action: "Download"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      
      {/* 1. BACK NAVIGATION */}
      <div className="mb-8 mt-4">
        <Link 
          to="/student/courses/view" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back to course
        </Link>
      </div>

      {/* 2. HEADER WITH ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#1e293b] tracking-tight mb-2">
            Calculus Fundamentals
          </h1>
          <p className="text-slate-400 font-medium text-lg">Introduction to derivatives and integrals</p>
        </div>

        {/* Right Side Actions (Attendance Button + Placeholder) */}
        <div className="flex items-center gap-4">
          <button className="bg-[#2563eb] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
            Make Attendance
          </button>
          
          {/* Grey Placeholder Box from screenshot */}
          <div className="h-[44px] w-32 bg-slate-200 rounded-lg"></div>
        </div>
      </div>

      {/* 3. CONTENT CARD CONTAINER */}
      <div className="bg-white rounded-[2rem] p-12 border border-slate-100 shadow-sm min-h-[500px]">
        
        <div className="space-y-6">
          {contentItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all bg-white"
            >
              {/* Left Side: Text Only (Cleaner Look) */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-slate-400">
                  {item.subtitle}
                </p>
              </div>

              {/* Right Side: Action Button */}
              <div>
                {item.type === "video" ? (
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all">
                    <PlayCircle size={18} /> Play
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all">
                     Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
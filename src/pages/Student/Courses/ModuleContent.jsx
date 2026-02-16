import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  PlayCircle, 
  Download,
} from "lucide-react";

export const ModuleContent = () => {
  const [contentItems, setContentItems] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [viewedContent, setViewedContent] = useState([]);

  const mockContentItems = [
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

  // Load module data from localStorage on mount
  useEffect(() => {
    const storedModule = localStorage.getItem("selected_module");
    if (storedModule) {
      try {
        setSelectedModule(JSON.parse(storedModule));
      } catch (error) {
        console.error("Error parsing stored module:", error);
      }
    }
    setContentItems(mockContentItems);
  }, []);

  // Load viewed content from localStorage
  useEffect(() => {
    const storedViewedContent = localStorage.getItem("viewed_content");
    if (storedViewedContent) {
      try {
        setViewedContent(JSON.parse(storedViewedContent));
      } catch (error) {
        console.error("Error parsing viewed content:", error);
      }
    }
  }, []);

  // Load attendance status from localStorage
  useEffect(() => {
    const storedAttendance = localStorage.getItem("attendance_marked");
    if (storedAttendance) {
      try {
        const attendanceData = JSON.parse(storedAttendance);
        const today = new Date().toDateString();
        setAttendanceMarked(attendanceData.date === today);
      } catch (error) {
        console.error("Error parsing attendance data:", error);
      }
    }
  }, []);

  // Handle attendance marking
  const handleMarkAttendance = () => {
    const attendanceData = {
      moduleId: selectedModule?.moduleId,
      date: new Date().toDateString(),
      timestamp: new Date().toISOString(),
      status: "present"
    };
    localStorage.setItem("attendance_marked", JSON.stringify(attendanceData));
    setAttendanceMarked(true);
    alert("Attendance marked successfully!");
  };

  // Track when content is played/downloaded
  const handleContentAction = (itemId, itemType) => {
    const contentData = {
      itemId,
      type: itemType,
      moduleId: selectedModule?.moduleId,
      timestamp: new Date().toISOString(),
      action: itemType === "video" ? "played" : "downloaded"
    };

    // Add to viewed content
    const updatedViewedContent = [...viewedContent, contentData];
    setViewedContent(updatedViewedContent);
    localStorage.setItem("viewed_content", JSON.stringify(updatedViewedContent));

    // Show appropriate message
    if (itemType === "video") {
      alert("Video player opened!");
    } else {
      alert("PDF downloaded successfully!");
    }

    // Log the activity
    console.log("Content accessed:", contentData);
  };

  // Get content view statistics
  const getContentStats = () => {
    const moduleLogs = viewedContent.filter(v => v.moduleId === selectedModule?.moduleId);
    const videoViews = moduleLogs.filter(v => v.action === "played").length;
    const downloads = moduleLogs.filter(v => v.action === "downloaded").length;
    return { videoViews, downloads };
  };

  const stats = getContentStats();

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      
      {/* 1. BACK NAVIGATION */}
      <div className="mb-8 mt-4">
        <Link 
          to="/student/courses/view" 
          className="inline-flex items-center gap-2 text-md font-bold text-slate-800 hover:text-blue-600 transition-colors"
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
          
          {/* View Statistics */}
          <div className="mt-3 flex gap-6">
            <span className="text-sm font-bold text-slate-500">
              Videos Viewed: <span className="text-slate-800">{stats.videoViews}</span>
            </span>
            <span className="text-sm font-bold text-slate-500">
              Resources Downloaded: <span className="text-slate-800">{stats.downloads}</span>
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAttendance}
            disabled={attendanceMarked}
            className={`
              px-6 py-3 rounded-lg font-bold text-md transition-all active:scale-95
              ${attendanceMarked 
                ? "bg-green-500 text-white shadow-lg shadow-green-500/30 cursor-not-allowed" 
                : "bg-[#2563eb] text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
              }
            `}
          >
            {attendanceMarked ? "✓ Attendance Marked" : "Mark Attendance"}
          </button>
          
          {/* Grey Placeholder Box */}
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
              {/* Left Side: Text */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-md font-medium text-slate-400">
                  {item.subtitle}
                </p>
              </div>

              {/* Right Side: Action Button */}
              <div>
                {item.type === "video" ? (
                  <button 
                    onClick={() => handleContentAction(item.id, "video")}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-md text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <PlayCircle size={18} /> Play
                  </button>
                ) : (
                  <button 
                    onClick={() => handleContentAction(item.id, "pdf")}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-md text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <Download size={18} /> Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 4. DEBUG INFO (Optional - Remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-slate-100 rounded-lg text-sm font-mono text-slate-700">
          <p>📦 <strong>Selected Module:</strong> {JSON.stringify(selectedModule, null, 2)}</p>
          <p className="mt-2">📊 <strong>Viewed Content:</strong> {viewedContent.length} items</p>
          <p className="mt-2">✅ <strong>Attendance Marked:</strong> {attendanceMarked ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};
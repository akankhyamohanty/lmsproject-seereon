import { 
  CheckCircle, 
  AlertCircle, 
  Banknote, 
  ChevronRight, 
  ScanFace,
  FileText,
  CreditCard,
  BookOpen,
  Clock
} from "lucide-react";

export const StudentDashboard = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      
      {/* 1. WELCOME HEADER (Handled by Layout usually, but adding title here as per screenshot flow) */}
      {/* Note: The screenshot has 'Hi, Subham' in the top bar, but if you want it in the page body: */}
      {/* <div className="mb-8 mt-2"> ... </div> */}

      {/* 2. STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Attendance Card - Light Purple BG */}
        <div className="bg-[#EBEBFF] rounded-[1.5rem] p-6 relative min-h-[160px] flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800">Attendance</h3>
            <ScanFace size={24} className="text-slate-700" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 tracking-tight mb-3">87%</div>
            {/* Custom Progress Bar Style */}
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
               <div className="h-full bg-[#1e293b] w-[87%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Pending Assignments - Light Beige BG */}
        <div className="bg-[#FFF2E5] rounded-[1.5rem] p-6 relative min-h-[160px] flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800">Pending Assignments</h3>
            <AlertCircle size={24} className="text-slate-700" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 tracking-tight mb-1">05</div>
            <p className="text-xs font-bold text-slate-500">task</p>
          </div>
        </div>

        {/* Completed Assignments - Light Beige BG */}
        <div className="bg-[#FFF2E5] rounded-[1.5rem] p-6 relative min-h-[160px] flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800">Completed Assignments</h3>
            <CheckCircle size={24} className="text-slate-700" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 tracking-tight mb-1">23</div>
            <p className="text-xs font-bold text-slate-500">task</p>
          </div>
        </div>

        {/* Fee Due - Light Purple BG */}
        <div className="bg-[#EBEBFF] rounded-[1.5rem] p-6 relative min-h-[160px] flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800">Fee Due</h3>
            <Banknote size={24} className="text-slate-700" strokeWidth={1.5} />
          </div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">$500</div>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2">Due 5th Feb</span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS SECTION */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <QuickActionBtn icon={<ScanFace size={24} />} label="Mark Attendance" />
          <QuickActionBtn icon={<FileText size={24} />} label="Assignments" />
          <QuickActionBtn icon={<CreditCard size={24} />} label="Pay Fees" />
          <QuickActionBtn icon={<BookOpen size={24} />} label="My Course" />
        </div>
      </div>

      {/* 4. BOTTOM LISTS (Today's Classes & Pending Assignments) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Today's Classes */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-slate-400" /> Today's Classes
          </h3>
          
          <div className="space-y-4">
            {/* List Item Placeholder */}
            <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50/50">
               <div>
                  <h4 className="font-bold text-slate-700">Advanced Mathematics</h4>
                  <p className="text-xs text-slate-500 mt-1">09:00 AM - 10:30 AM • Room 301</p>
               </div>
               <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Ongoing</span>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center">
               <div>
                  <h4 className="font-bold text-slate-700">Data Structures</h4>
                  <p className="text-xs text-slate-500 mt-1">11:00 AM - 12:30 PM • Lab 2</p>
               </div>
               <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Pending Assignments List */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-slate-400" /> Pending Assignments
          </h3>
          
           <div className="space-y-4">
            {/* List Item Placeholder */}
            <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center">
               <div>
                  <h4 className="font-bold text-slate-700">Physics Lab Report</h4>
                  <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                    <Clock size={12} /> Deadline: Today, 11:59 PM
                  </p>
               </div>
               <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">Submit</button>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center">
               <div>
                  <h4 className="font-bold text-slate-700">Java Project Proposal</h4>
                  <p className="text-xs text-slate-500 mt-1">Deadline: 12th Feb</p>
               </div>
               <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">Submit</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-component for Quick Actions to reduce clutter ---
const QuickActionBtn = ({ icon, label }) => (
  <button className="bg-white border border-slate-200 rounded-[1.25rem] py-6 flex flex-col items-center gap-3 hover:shadow-lg hover:shadow-slate-200/50 hover:border-blue-200 transition-all active:scale-95 group">
    <div className="text-slate-700 group-hover:text-blue-600 transition-colors">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide group-hover:text-slate-800">
      {label}
    </span>
  </button>
);
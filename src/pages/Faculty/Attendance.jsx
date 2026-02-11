import { useState } from "react";
import { 
  Calendar, 
  Search, 
  CheckCircle, 
  XCircle, 
  Save, 
  Users,
  Filter 
} from "lucide-react";

export const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState("B.Tech CS - Year 2");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // --- MOCK STUDENT DATA ---
  const [students, setStudents] = useState([
    { id: 1, roll: "01", name: "Amit Sharma", status: "Present" },
    { id: 2, roll: "02", name: "Anjali Gupta", status: "Present" },
    { id: 3, roll: "03", name: "Rahul Verma", status: "Absent" },
    { id: 4, roll: "04", name: "Sneha Roy", status: "Present" },
    { id: 5, roll: "05", name: "Vikram Singh", status: "Present" },
    { id: 6, roll: "06", name: "Priya Das", status: "Present" },
  ]);

  // Toggle individual student status
  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: s.status === "Present" ? "Absent" : "Present" } 
        : s
    ));
  };

  // Mark all as Present/Absent
  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  // Calculate stats
  const presentCount = students.filter(s => s.status === "Present").length;
  const absentCount = students.filter(s => s.status === "Absent").length;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mark Attendance</h1>
          <p className="text-sm text-slate-500">Record daily attendance for your classes</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 text-slate-600 px-2 border-r border-slate-200">
             <Calendar size={18} />
             <input 
               type="date" 
               value={date} 
               onChange={(e) => setDate(e.target.value)}
               className="outline-none text-sm bg-transparent"
             />
           </div>
           <div className="flex items-center gap-2 px-2">
             <Filter size={18} className="text-slate-400" />
             <select 
               value={selectedClass}
               onChange={(e) => setSelectedClass(e.target.value)}
               className="outline-none text-sm bg-transparent font-medium text-slate-700"
             >
               <option>B.Tech CS - Year 2</option>
               <option>MBA - Year 1</option>
               <option>B.Tech CS - Year 1</option>
             </select>
           </div>
        </div>
      </div>

      {/* Stats & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Present Card */}
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green-700 uppercase">Present</p>
            <h3 className="text-2xl font-bold text-green-800">{presentCount}</h3>
          </div>
          <CheckCircle className="text-green-500" size={28} />
        </div>
        
        {/* Absent Card */}
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-700 uppercase">Absent</p>
            <h3 className="text-2xl font-bold text-red-800">{absentCount}</h3>
          </div>
          <XCircle className="text-red-500" size={28} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-2">
          <button 
            onClick={() => markAll("Present")}
            className="w-full py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Mark All Present
          </button>
          <button 
            onClick={() => markAll("Absent")}
            className="w-full py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Users size={18} /> Student List
          </h3>
          <span className="text-xs font-medium text-slate-500">Total: {students.length}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {student.roll}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{student.name}</h4>
                  <p className="text-xs text-slate-500">Roll No: {student.roll}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(student.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    student.status === "Present"
                      ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                      : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <CheckCircle size={16} /> Present
                </button>

                <button
                  onClick={() => toggleStatus(student.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    student.status === "Absent"
                      ? "bg-red-100 text-red-700 border border-red-200 shadow-sm"
                      : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <XCircle size={16} /> Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-end gap-4 z-10">
        <button className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center gap-2">
          <Save size={18} /> Save Attendance
        </button>
      </div>
      
      {/* Spacer for bottom bar */}
      <div className="h-24"></div>
    </div>
  );
};
import { useState } from "react";
import { 
  FileText, 
  Search, 
  Save, 
  Calculator, 
  Award,
  Lock
} from "lucide-react";

export const FacultyExams = () => {
  const [selectedExam, setSelectedExam] = useState("Mid-Term 2024");
  const [selectedClass, setSelectedClass] = useState("B.Tech CS - Year 2");
  
  // --- MOCK STUDENT MARKS DATA ---
  const [students, setStudents] = useState([
    { id: 1, roll: "01", name: "Amit Sharma", theory: 45, practical: 18, maxTheory: 60, maxPractical: 20 },
    { id: 2, roll: "02", name: "Anjali Gupta", theory: 55, practical: 19, maxTheory: 60, maxPractical: 20 },
    { id: 3, roll: "03", name: "Rahul Verma", theory: 32, practical: 15, maxTheory: 60, maxPractical: 20 },
    { id: 4, roll: "04", name: "Sneha Roy", theory: 58, practical: 20, maxTheory: 60, maxPractical: 20 },
  ]);

  // Handle Marks Input Change
  const handleMarkChange = (id, field, value) => {
    const val = parseInt(value) || 0;
    
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        // Prevent entering marks higher than max
        const max = field === 'theory' ? s.maxTheory : s.maxPractical;
        const validVal = val > max ? max : val;
        
        return { ...s, [field]: validVal };
      }
      return s;
    }));
  };

  // Helper to calculate Grade
  const getGrade = (total) => {
    if (total >= 75) return { label: 'A', color: 'text-green-600 bg-green-50' };
    if (total >= 60) return { label: 'B', color: 'text-blue-600 bg-blue-50' };
    if (total >= 40) return { label: 'C', color: 'text-orange-600 bg-orange-50' };
    return { label: 'F', color: 'text-red-600 bg-red-50' };
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Marks Entry</h1>
          <p className="text-sm text-slate-500">Manage exam scores and grading</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <select 
             value={selectedExam}
             onChange={(e) => setSelectedExam(e.target.value)}
             className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option>Mid-Term 2024</option>
             <option>Final Sem 2024</option>
             <option>Unit Test 1</option>
           </select>
           
           <select 
             value={selectedClass}
             onChange={(e) => setSelectedClass(e.target.value)}
             className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option>B.Tech CS - Year 2</option>
             <option>MBA - Year 1</option>
           </select>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Calculator size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-800 text-sm">Grading Logic Active</h4>
          <p className="text-xs text-blue-600 mt-1">Total Score = Theory (Max 60) + Practical (Max 20). Grades are auto-calculated based on the total score.</p>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Roll No</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Theory (60)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Practical (20)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Total (80)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const total = student.theory + student.practical;
                const grade = getGrade(total);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{student.roll}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                    
                    {/* Theory Input */}
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        value={student.theory}
                        onChange={(e) => handleMarkChange(student.id, 'theory', e.target.value)}
                        className="w-20 p-2 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    </td>

                    {/* Practical Input */}
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        value={student.practical}
                        onChange={(e) => handleMarkChange(student.id, 'practical', e.target.value)}
                        className="w-20 p-2 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    </td>

                    {/* Total (Auto Calc) */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-slate-800">{total}</span>
                    </td>

                    {/* Grade (Auto Calc) */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${grade.color}`}>
                        {grade.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-white text-sm flex items-center gap-2">
            <Lock size={16} /> Save Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm flex items-center gap-2 shadow-sm">
            <Save size={16} /> Submit Scores
          </button>
        </div>
      </div>
    </div>
  );
};
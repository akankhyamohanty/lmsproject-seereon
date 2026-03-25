import { useState, useEffect } from 'react';
import { Calendar, Award, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

export default function Exam() {
  const [activeTab, setActiveTab] = useState('exams');
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    passed: 0,
    totalMarks: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for upcoming exams
  const mockUpcomingExams = [
    {
      id: 1,
      name: 'Mid-term Examination',
      subject: 'Mathematics',
      type: 'Mid-term',
      date: 'Feb 10, 2026',
      time: '9:00 AM - 12:00 PM',
    },
    {
      id: 2,
      name: 'Mid-term Examination',
      subject: 'Physics',
      type: 'Mid-term',
      date: 'Feb 12, 2026',
      time: '9:00 AM - 12:00 PM',
    },
    {
      id: 3,
      name: 'Mid-term Examination',
      subject: 'Computer Science',
      type: 'Mid-term',
      date: 'Feb 14, 2026',
      time: '2:00 PM - 5:00 PM',
    },
    {
      id: 4,
      name: 'Unit Test',
      subject: 'Chemistry',
      type: 'Unit Test',
      date: 'Feb 5, 2026',
      time: '10:00 AM - 11:00 AM',
    },
  ];

  // Mock data for exam results
  const mockExamResults = [
    {
      id: 1,
      subject: 'Mathematics',
      marksObtained: 85,
      totalMarks: 100,
      percentage: 85.0,
      grade: 'A',
      status: 'Pass',
    },
    {
      id: 2,
      subject: 'Physics',
      marksObtained: 78,
      totalMarks: 100,
      percentage: 78.0,
      grade: 'B+',
      status: 'Pass',
    },
    {
      id: 3,
      subject: 'Computer Science',
      marksObtained: 92,
      totalMarks: 100,
      percentage: 92.0,
      grade: 'A+',
      status: 'Pass',
    },
    {
      id: 4,
      subject: 'Chemistry',
      marksObtained: 72,
      totalMarks: 100,
      percentage: 72.0,
      grade: 'B',
      status: 'Pass',
    },
    {
      id: 5,
      subject: 'English',
      marksObtained: 88,
      totalMarks: 100,
      percentage: 88.0,
      grade: 'A',
      status: 'Pass',
    },
  ];

  // Load from storage on mount
  useEffect(() => {
    try {
      const storedTab = localStorage?.getItem('exam_active_tab') || 'exams';
      setActiveTab(storedTab);

      const storedUpcomingExams = localStorage?.getItem('upcoming_exams');
      setUpcomingExams(storedUpcomingExams ? JSON.parse(storedUpcomingExams) : mockUpcomingExams);

      const storedExamResults = localStorage?.getItem('exam_results');
      const results = storedExamResults ? JSON.parse(storedExamResults) : mockExamResults;
      setExamResults(results);
      calculateStats(results);

      setLoading(false);
    } catch (error) {
      console.error('Error loading exam data:', error);
      setUpcomingExams(mockUpcomingExams);
      setExamResults(mockExamResults);
      calculateStats(mockExamResults);
      setLoading(false);
    }
  }, []);

  // Calculate statistics
  const calculateStats = (results) => {
    if (!results || results.length === 0) {
      setStats({ totalSubjects: 0, passed: 0, totalMarks: 0, percentage: 0 });
      return;
    }

    const totalSubjects = results.length;
    const passed = results.filter(r => r.status === 'Pass').length;
    const totalMarks = results.reduce((sum, r) => sum + r.marksObtained, 0);
    const maxMarks = results.reduce((sum, r) => sum + r.totalMarks, 0);
    const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

    const newStats = { totalSubjects, passed, totalMarks, percentage };
    setStats(newStats);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage?.setItem('exam_active_tab', tab);
  };

  // Get grade color
  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-emerald-600 border-emerald-300 bg-emerald-50',
      'A': 'text-emerald-600 border-emerald-300 bg-emerald-50',
      'B+': 'text-blue-600 border-blue-300 bg-blue-50',
      'B': 'text-blue-600 border-blue-300 bg-blue-50',
      'C': 'text-amber-600 border-amber-300 bg-amber-50',
    };
    return colors[grade] || 'text-gray-600 border-gray-300 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-slate-600">Loading exam data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Exams & Results</h1>
          <p className="text-lg text-slate-600">View your exam schedule and track your performance</p>
        </div>

        {/* ===== MODERN TAB SECTION ===== */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          {/* Tab Navigation Bar */}
          <div className="flex items-center bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            {/* Exams Tab */}
            <button
              onClick={() => handleTabChange('exams')}
              className={`
                flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all duration-300 relative
                ${
                  activeTab === 'exams'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <Calendar className="w-5 h-5" />
              Upcoming Exams
              
              {/* Animated Indicator */}
              {activeTab === 'exams' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-full" />
              )}
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Results Tab */}
            <button
              onClick={() => handleTabChange('results')}
              className={`
                flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all duration-300 relative
                ${
                  activeTab === 'results'
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <Award className="w-5 h-5" />
              Results & Analytics
              
              {/* Animated Indicator */}
              {activeTab === 'results' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="p-8">
            {/* ===== EXAMS TAB CONTENT ===== */}
            {activeTab === 'exams' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Upcoming Exams</h2>
                    <p className="text-slate-600 text-sm mt-1">Schedule and details of your upcoming examinations</p>
                  </div>
                </div>

                {/* Exams Table */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-md font-mediumbold text-slate-900">Exam Name</th>
                          <th className="px-6 py-4 text-left text-md font-mediumbold text-slate-900">Subject</th>
                          <th className="px-6 py-4 text-left text-md font-mediumbold text-slate-900">Type</th>
                          <th className="px-6 py-4 text-left text-md font-mediumbold text-slate-900">Date</th>
                          <th className="px-6 py-4 text-left text-md font-mediumbold text-slate-900">Time</th>
                          <th className="px-6 py-4 text-left text-md font-mediumbold text-slate-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingExams.map((exam, index) => (
                          <tr
                            key={exam.id}
                            className={`${
                              index !== upcomingExams.length - 1 ? 'border-b border-slate-200' : ''
                            } hover:bg-slate-50 transition-colors`}
                          >
                            <td className="px-6 py-4 text-left text-slate-900 font-semibold">{exam.name}</td>
                            <td className="px-6 py-4 text-left text-slate-700">{exam.subject}</td>
                            <td className="px-6 py-4 text-left">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                {exam.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-left text-slate-700">{exam.date}</td>
                            <td className="px-6 py-4 text-left text-slate-700">{exam.time}</td>
                            <td className="px-6 py-4 text-left">
                              <button
                                onClick={() => handleTabChange('results')}
                                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                              >
                                View Results →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== RESULTS TAB CONTENT ===== */}
            {activeTab === 'results' && (
              <div className="animate-in fade-in duration-300">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {/* Total Subjects */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Total Subjects</span>
                    </div>
                    <p className="text-4xl font-bold text-blue-900">{stats.totalSubjects}</p>
                  </div>

                  {/* Passed */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Passed</span>
                    </div>
                    <p className="text-4xl font-bold text-emerald-900">{stats.passed}</p>
                  </div>

                  {/* Total Marks */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Total Marks</span>
                    </div>
                    <p className="text-4xl font-bold text-purple-900">{stats.totalMarks}</p>
                  </div>

                  {/* Percentage */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">Percentage</span>
                    </div>
                    <p className="text-4xl font-bold text-amber-900">{stats.percentage}%</p>
                  </div>
                </div>

                {/* Results Table */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Exam Results</h2>
                      <p className="text-slate-600 text-sm mt-1">Your performance across all subjects</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Subject</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Marks Obtained</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total Marks</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Percentage</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Grade</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examResults.map((result, index) => (
                            <tr
                              key={result.id}
                              className={`${
                                index !== examResults.length - 1 ? 'border-b border-slate-200' : ''
                              } hover:bg-slate-50 transition-colors`}
                            >
                              <td className="px-6 py-4 text-left font-semibold text-slate-900">{result.subject}</td>
                              <td className="px-6 py-4 text-left text-slate-700">{result.marksObtained}</td>
                              <td className="px-6 py-4 text-left text-slate-700">{result.totalMarks}</td>
                              <td className="px-6 py-4 text-left text-slate-700 font-semibold">{result.percentage.toFixed(1)}%</td>
                              <td className="px-6 py-4 text-left">
                                <span
                                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold ${getGradeColor(
                                    result.grade
                                  )}`}
                                >
                                  {result.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-left">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                                  {result.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <p className="text-slate-600 font-medium mb-3">Total Marks Obtained</p>
                    <p className="text-5xl font-bold text-slate-900">{stats.totalMarks}</p>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <p className="text-slate-600 font-medium mb-3">Overall Percentage</p>
                    <p className="text-5xl font-bold text-slate-900">{stats.percentage}%</p>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <p className="text-slate-600 font-medium mb-3">Overall Result</p>
                    <span className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                      <span className="w-3 h-3 bg-emerald-600 rounded-full"></span>
                      Pass
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
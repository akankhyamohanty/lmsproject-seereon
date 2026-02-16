import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function StudentAttendance() {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [activeTab, setActiveTab] = useState('mark');
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    subject: '',
    session: '',
    status: 'present', // NEW: Add status field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [filterSubject, setFilterSubject] = useState('');

  // Mock data
  const mockSubjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Chemistry' },
    { id: 4, name: 'English' },
    { id: 5, name: 'Computer Science' },
  ];

  const mockSessions = [
    { id: 1, name: 'Period 1', time: '8:00 AM - 9:00 AM' },
    { id: 2, name: 'Period 2', time: '9:30 AM - 10:30 AM' },
    { id: 3, name: 'Period 3', time: '10:45 AM - 11:45 AM' },
    { id: 4, name: 'Period 4', time: '12:30 PM - 1:30 PM' },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    // Set subjects and sessions
    setSubjects(mockSubjects);
    setSessions(mockSessions);

    // Load active tab from localStorage
    const storedTab = localStorage.getItem('attendance_active_tab');
    if (storedTab) {
      setActiveTab(storedTab);
    }

    // Load attendance history from localStorage
    const storedHistory = localStorage.getItem('attendance_history');
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        if (Array.isArray(history)) {
          setAttendanceHistory(history);
          calculateStats(history);
        }
      } catch (error) {
        console.error('Error parsing attendance history:', error);
        setAttendanceHistory([]);
      }
    }

    // Mock active session
    setActiveSessions({
      subject: 'Mathematics',
      period: 'Period 1',
      isActive: true,
    });
  }, []);

  // Calculate statistics from history
  const calculateStats = (history) => {
    if (!history || history.length === 0) {
      setStats({
        totalClasses: 0,
        present: 0,
        absent: 0,
        percentage: 0,
      });
      return;
    }

    const totalClasses = history.length;
    const presentCount = history.filter(h => h.status === 'present').length;
    const absentCount = history.filter(h => h.status === 'absent').length;
    const percentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

    const newStats = {
      totalClasses,
      present: presentCount,
      absent: absentCount,
      percentage,
    };

    setStats(newStats);

    // Save stats to localStorage
    localStorage.setItem('attendance_stats', JSON.stringify(newStats));
  };

  // Handle tab change and save to localStorage
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('attendance_active_tab', tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.subject || !formData.session) {
      setError('Please select date, subject, and session');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get subject and session names
      const subjectName = mockSubjects.find(s => s.id === parseInt(formData.subject))?.name || 'Unknown';
      const sessionName = mockSessions.find(s => s.id === parseInt(formData.session))?.name || 'Unknown';

      // Create attendance record
      const attendanceRecord = {
        id: Date.now(),
        date: formData.date, // YYYY-MM-DD format - EDITABLE NOW!
        subject: subjectName,
        session: sessionName,
        status: formData.status, // 'present' or 'absent' - SELECTABLE!
        timestamp: new Date().toISOString(),
      };

      console.log('Creating record:', attendanceRecord);

      // Add to history (new record first)
      const updatedHistory = [attendanceRecord, ...attendanceHistory];
      setAttendanceHistory(updatedHistory);

      // Save to localStorage
      localStorage.setItem('attendance_history', JSON.stringify(updatedHistory));

      // Recalculate stats
      calculateStats(updatedHistory);

      setSuccess(true);
      setError('');

      // Reset form
      setTimeout(() => {
        setFormData({
          date: getTodayDate(),
          subject: '',
          session: '',
          status: 'present',
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to mark attendance. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display (Feb 13, 2024)
  const formatTableDate = (dateString) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.error('Table date formatting error:', error);
      return dateString;
    }
  };

  // Filter attendance history by subject
  const filteredHistory = filterSubject
    ? attendanceHistory.filter(record => {
        const subjectName = mockSubjects.find(s => s.id === parseInt(filterSubject))?.name;
        return record.subject === subjectName;
      })
    : attendanceHistory;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-1">Attendance</h1>
            <p className="text-lg text-gray-600">Mark and view your attendance</p>
          </div>

          {/* Top Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleTabChange('mark')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'mark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              View History
            </button>
          </div>
        </div>

        {activeTab === 'mark' && (
          <>
            {/* Main Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Mark Attendance</h2>
                <p className="text-lg text-gray-600">Mark your attendance for today's class session</p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleMarkAttendance} className="p-6">
                {/* Date Field - NOW EDITABLE */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-2 text-left">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white cursor-pointer"
                  />
                </div>

                {/* Subject/Class Field */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-2 text-left">Class / Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Session/Period Field */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-2 text-left">Session / Period</label>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Select session</option>
                    {sessions.map(session => (
                      <option key={session.id} value={session.id}>
                        {session.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Field - NEW: Select Present or Absent */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-900 mb-2 text-left">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="present"
                        checked={formData.status === 'present'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-lg font-medium text-gray-700">Present</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="absent"
                        checked={formData.status === 'absent'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-lg font-medium text-gray-700">Absent</span>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-lg font-medium">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-lg font-medium">✓ Attendance marked successfully!</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-4 rounded-lg font-semibold text-lg text-white flex items-center justify-center gap-2 transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Marking...
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5" />
                      Mark Attendance
                    </>
                  )}
                </button>
              </form>

              {/* Info Message Below Form */}
              <div className="px-6 pb-6 text-center">
                <p className="text-gray-600 text-lg">
                  Attendance can only be marked during active class sessions
                </p>
              </div>
            </div>

            {/* Active Session Alert - At Bottom */}
            {activeSessions?.isActive && (
              <div className="p-5 bg-blue-100 border border-blue-400 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 text-lg mb-1">Active Session</p>
                    <p className="text-blue-900 text-lg">
                      {activeSessions.subject} - {activeSessions.period} is currently active. Mark your attendance now!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {/* Total Classes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600 text-lg font-medium mb-3">Total Classes</p>
                <p className="text-5xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>

              {/* Present */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600 text-lg font-medium mb-3">Present</p>
                <p className="text-5xl font-bold text-green-600">{stats.present}</p>
              </div>

              {/* Absent */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600 text-lg font-medium mb-3">Absent</p>
                <p className="text-5xl font-bold text-red-600">{stats.absent}</p>
              </div>

              {/* Percentage */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600 text-lg font-medium mb-3">Percentage</p>
                <p className="text-5xl font-bold text-blue-600">{stats.percentage}%</p>
              </div>
            </div>

            {/* Attendance History Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance History</h2>

                {/* Filter by Subject */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">Filter by Subject</label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                {filteredHistory.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Date</th>
                        <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Subject</th>
                        <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Session</th>
                        <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((record) => (
                        <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-lg text-gray-700 text-left">{formatTableDate(record.date)}</td>
                          <td className="px-6 py-4 text-lg font-semibold text-gray-900 text-left">{record.subject}</td>
                          <td className="px-6 py-4 text-lg text-gray-700 text-left">{record.session}</td>
                          <td className="px-6 py-4 text-left">
                            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-lg font-medium ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${record.status === 'present' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-lg text-gray-600">No attendance records found</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
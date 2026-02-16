import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileCheck, CheckCircle } from 'lucide-react';

export default function Assignment() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockAssignments = [
    {
      id: 1,
      title: 'Calculus Problem Set 5',
      course: 'Advanced Mathematics',
      dueDate: 'Jan 30, 2026',
      status: 'pending',
      maximumMarks: 100,
    },
    {
      id: 2,
      title: 'Physics Lab Report - Mechanics',
      course: 'Physics',
      dueDate: 'Feb 2, 2026',
      status: 'pending',
      maximumMarks: 100,
    },
    {
      id: 3,
      title: 'Data Structures Implementation',
      course: 'Computer Science',
      dueDate: 'Jan 28, 2026',
      status: 'submitted',
      maximumMarks: 100,
    },
    {
      id: 4,
      title: 'Linear Algebra Assignment 3',
      course: 'Advanced Mathematics',
      dueDate: 'Jan 20, 2026',
      status: 'evaluated',
      maximumMarks: 100,
    },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    // Load assignments from localStorage
    const storedAssignments = localStorage.getItem('student_assignments');
    if (storedAssignments) {
      try {
        const assignments = JSON.parse(storedAssignments);
        if (Array.isArray(assignments)) {
          setAssignments(assignments);
        } else {
          setAssignments(mockAssignments);
          localStorage.setItem('student_assignments', JSON.stringify(mockAssignments));
        }
      } catch (error) {
        console.error('Error parsing assignments:', error);
        setAssignments(mockAssignments);
        localStorage.setItem('student_assignments', JSON.stringify(mockAssignments));
      }
    } else {
      // First time - store mock data
      setAssignments(mockAssignments);
      localStorage.setItem('student_assignments', JSON.stringify(mockAssignments));
    }

    // Load filter preference from localStorage
    const storedFilter = localStorage.getItem('assignment_filter_status');
    if (storedFilter) {
      setFilterStatus(storedFilter);
    }

    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border border-orange-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'evaluated':
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'submitted':
        return <FileCheck className="w-5 h-5" />;
      case 'evaluated':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const evaluatedCount = assignments.filter(a => a.status === 'evaluated').length;

  const filteredAssignments =
    filterStatus === 'all'
      ? assignments
      : assignments.filter(a => a.status === filterStatus);

  // Handle filter change and save to localStorage
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    localStorage.setItem('assignment_filter_status', status);
  };

  // Handle viewing assignment and save to localStorage
  const handleViewAssignment = (assignmentId) => {
    const selectedAssignment = assignments.find(a => a.id === assignmentId);
    if (selectedAssignment) {
      localStorage.setItem('selected_assignment', JSON.stringify(selectedAssignment));
    }
    navigate(`/student/assignments/${assignmentId}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8 px-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-lg text-gray-600">View and submit your assignments</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Pending Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-lg text-gray-600 font-medium">Pending</p>
                <p className="text-4xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          {/* Submitted Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg text-gray-600 font-medium">Submitted</p>
                <p className="text-4xl font-bold text-gray-900">{submittedCount}</p>
              </div>
            </div>
          </div>

          {/* Evaluated Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg text-gray-600 font-medium">Evaluated</p>
                <p className="text-4xl font-bold text-gray-900">{evaluatedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Assignments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Assignments</h2>
            
            {/* Filter */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="all">All Assignments</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="evaluated">Evaluated</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Assignment Title</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Course</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-lg font-semibold text-gray-900 text-left">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 text-lg text-gray-700 text-left">
                        {assignment.course}
                      </td>
                      <td className="px-6 py-4 text-lg text-gray-700 text-left">
                        {assignment.dueDate}
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium ${getStatusColor(assignment.status)}`}>
                          {getStatusIcon(assignment.status)}
                          {getStatusLabel(assignment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-lg font-semibold text-gray-900 text-left">
                        <button
                          onClick={() => handleViewAssignment(assignment.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <p className="text-lg text-gray-500">No assignments found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
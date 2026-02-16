import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, ArrowLeft, Clock } from 'lucide-react';

export default function AssignmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  // Mock data
  const mockAssignments = {
    1: {
      id: 1,
      title: 'Calculus Problem Set 5',
      course: 'Advanced Mathematics',
      section: 'Calculus Fundamentals',
      dueDate: 'Jan 30, 2026',
      maximumMarks: 100,
      status: 'pending',
      instructions: 'Solve all problems from Chapter 5. Show all working steps clearly.',
      description: 'This assignment covers integration techniques, partial fractions, and applications of integrals. Please ensure all steps are clearly shown for full credit.',
    },
    2: {
      id: 2,
      title: 'Physics Lab Report - Mechanics',
      course: 'Physics',
      section: 'Mechanics Fundamentals',
      dueDate: 'Feb 2, 2026',
      maximumMarks: 100,
      status: 'pending',
      instructions: 'Write a comprehensive lab report on the mechanics experiment.',
      description: 'Include methodology, observations, calculations, and conclusions.',
    },
    3: {
      id: 3,
      title: 'Data Structures Implementation',
      course: 'Computer Science',
      section: 'Advanced Data Structures',
      dueDate: 'Jan 28, 2026',
      maximumMarks: 100,
      status: 'submitted',
      instructions: 'Implement the required data structures in your preferred language.',
      description: 'Submit source code and documentation for the implementation.',
    },
    4: {
      id: 4,
      title: 'Linear Algebra Assignment 3',
      course: 'Advanced Mathematics',
      section: 'Linear Algebra',
      dueDate: 'Jan 20, 2026',
      maximumMarks: 100,
      status: 'evaluated',
      instructions: 'Solve matrix problems and provide proofs for theorems.',
      description: 'All work must be shown. Partial credit will be given for correct methodology.',
    },
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Load selected assignment from localStorage
      const storedAssignment = localStorage.getItem('selected_assignment');
      if (storedAssignment) {
        const parsedAssignment = JSON.parse(storedAssignment);
        setAssignment(parsedAssignment);
      } else if (id && mockAssignments[id]) {
        // Fallback to mock data if not in localStorage
        setAssignment(mockAssignments[id]);
      }

      // Load submission status from localStorage
      const storedSubmissions = localStorage.getItem('assignment_submissions');
      if (storedSubmissions) {
        try {
          const submissions = JSON.parse(storedSubmissions);
          setSubmissions(Array.isArray(submissions) ? submissions : []);
          
          // Check if this assignment was submitted
          const isSubmitted = submissions.some(sub => sub.assignmentId === parseInt(id));
          setSubmitted(isSubmitted);
        } catch (error) {
          console.error('Error parsing submissions:', error);
          setSubmissions([]);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading assignment:', error);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!assignment) return;

    setIsSubmitting(true);

    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create submission record
      const submissionRecord = {
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        course: assignment.course,
        submittedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        submittedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        status: 'submitted',
      };

      // Add to submissions list
      const updatedSubmissions = [submissionRecord, ...submissions];
      setSubmissions(updatedSubmissions);

      // Save to localStorage
      localStorage.setItem('assignment_submissions', JSON.stringify(updatedSubmissions));

      // Update assignment status in localStorage
      const storedAssignments = localStorage.getItem('student_assignments');
      if (storedAssignments) {
        try {
          const assignments = JSON.parse(storedAssignments);
          const updatedAssignments = assignments.map(a =>
            a.id === assignment.id ? { ...a, status: 'submitted' } : a
          );
          localStorage.setItem('student_assignments', JSON.stringify(updatedAssignments));
          
          // Update current assignment
          setAssignment({ ...assignment, status: 'submitted' });
        } catch (error) {
          console.error('Error updating assignments:', error);
        }
      }

      setSubmitted(true);
      setIsSubmitting(false);

      // Log submission for debugging
      console.log('Assignment submitted:', submissionRecord);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setIsSubmitting(false);
    }
  };

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

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/assignments')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 font-medium text-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Assignments
        </button>

        {/* Assignment Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
                <p className="text-lg text-gray-600">
                  {assignment.course} • {assignment.section}
                </p>
              </div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium flex-shrink-0 ${getStatusColor(assignment.status)}`}>
                <Clock className="w-5 h-5" />
                {getStatusLabel(assignment.status)}
              </span>
            </div>
          </div>

          {/* Assignment Info Grid */}
          <div className="grid grid-cols-2 gap-6 p-8 bg-gray-50 border-b border-gray-200">
            {/* Due Date */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Due Date</p>
              <p className="text-2xl font-bold text-gray-900">{assignment.dueDate}</p>
            </div>

            {/* Maximum Marks */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Maximum Marks</p>
              <p className="text-2xl font-bold text-gray-900">{assignment.maximumMarks}</p>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <p className="text-lg text-gray-700 mb-4">{assignment.instructions}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-lg text-gray-700">{assignment.description}</p>
            </div>
          </div>

          {/* Submit Section */}
          <div className="p-8">
            {submitted ? (
              <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
                <div className="text-green-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-green-700 mb-2">Assignment Submitted!</p>
                <p className="text-lg text-green-600">Your assignment has been successfully submitted. You can now view it in your submission history.</p>
                
                {/* Show submission details */}
                {submissions.find(s => s.assignmentId === assignment.id) && (
                  <div className="mt-6 pt-6 border-t border-green-300">
                    <p className="text-sm text-green-600">
                      Submitted on {submissions.find(s => s.assignmentId === assignment.id)?.submittedDate} at {submissions.find(s => s.assignmentId === assignment.id)?.submittedTime}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Click the button below to submit your completed assignment.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg text-white flex items-center justify-center gap-3 transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-900 active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Submission Guidelines</h3>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Ensure all your work is legible and clearly labeled</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Submit only in PDF or document format</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Include your name and ID number on the submission</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Late submissions will be subject to a 10% deduction per day</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
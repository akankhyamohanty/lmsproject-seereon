import { Sidebar } from './Sidebar';

export const StudentLayout = ({ children }) => {
  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: '📊' },
    { label: 'My Courses', path: '/student/courses', icon: '📚' },
    { label: 'Attendance', path: '/student/attendance', icon: '✅' },
    { label: 'Assignments', path: '/student/assignments', icon: '📝' },
    { label: 'Fees', path: '/student/fees', icon: '💰' },
    { label: 'Profile', path: '/student/profile', icon: '👤' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={studentLinks} />
      <div className="ml-64 w-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
// import { useFetch } from '../../hooks/useFetch';

// export const AdminDashboard = () => {
//   const { data, loading, error } = useFetch('/admin/dashboard');

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (error) return <div className="text-red-600 py-12">{error}</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-gray-600 text-sm font-semibold">Total Faculty</h3>
//         <p className="text-3xl font-bold text-blue-600 mt-2">{data?.faculty_count || 0}</p>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-gray-600 text-sm font-semibold">Total Students</h3>
//         <p className="text-3xl font-bold text-green-600 mt-2">{data?.student_count || 0}</p>
//       </div>
//     </div>
//   );
// };

import { Bell, Search, Users, DollarSign, BookOpen, AlertCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, loading } = useFetch('/admin/dashboard');

  const cards = [
    {
      title: 'Total Faculty',
      value: dashboardData?.faculty_count || '0',
      subtitle: 'Active teachers',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Users,
    },
    {
      title: 'Total Students',
      value: dashboardData?.student_count || '0',
      subtitle: 'Enrolled students',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: Users,
    },
    {
      title: 'Active Courses',
      value: '24',
      subtitle: 'Running courses',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: BookOpen,
    },
    {
      title: 'Revenue (Month)',
      value: '₹45,000',
      subtitle: 'Fee collection',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      icon: DollarSign,
    },
    {
      title: 'Pending Approvals',
      value: '8',
      subtitle: 'Faculty & courses',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      icon: AlertCircle,
    },
    {
      title: 'Attendance Today',
      value: '92%',
      subtitle: 'Average attendance',
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-700',
      icon: Users,
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hi, {user?.name}</h2>
          <p className="text-sm text-gray-500">Institute dashboard overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`${card.bgColor} rounded-2xl p-6 shadow-sm hover:shadow-lg transition transform hover:scale-105`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor} mb-2`}>{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
                <div className={`${card.textColor} p-3 bg-white bg-opacity-50 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-4 text-center transition">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Add Student</p>
          </button>
          <button className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-4 text-center transition">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Add Faculty</p>
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg p-4 text-center transition">
            <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">New Course</p>
          </button>
          <button className="bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-lg p-4 text-center transition">
            <DollarSign className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Fee Setup</p>
          </button>
        </div>
      </div>
    </div>
  );
};



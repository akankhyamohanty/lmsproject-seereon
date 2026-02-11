import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';

export const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, loading } = useFetch('/super-admin/dashboard');

  const metrics = [
    {
      title: 'Total Institutes',
      value: dashboardData?.institutes?.total || '156',
      subtitle: '2 registered today',
      color: 'bg-purple-100',
      icon: '🏢',
    },
    {
      title: 'Active Institutes',
      value: dashboardData?.institutes?.active || '138',
      subtitle: 'Currently operating',
      color: 'bg-yellow-100',
      icon: '✨',
    },
    {
      title: 'Suspended Institutes',
      value: dashboardData?.institutes?.suspended || '12',
      subtitle: '7.7% suspended',
      color: 'bg-red-100',
      icon: '⚠️',
    },
    {
      title: 'Total Teachers',
      value: dashboardData?.users?.teachers || '2,450',
      subtitle: 'Across all institutes',
      color: 'bg-blue-100',
      icon: '👨‍🏫',
    },
    {
      title: 'Total Students',
      value: dashboardData?.users?.students || '48,530',
      subtitle: 'Active enrollments',
      color: 'bg-cyan-100',
      icon: '👨‍🎓',
    },
    {
      title: 'Monthly Revenue',
      value: '₹102,000',
      subtitle: 'Subscription revenue',
      color: 'bg-purple-100',
      icon: '💰',
    },
    {
      title: 'Expiring Subscriptions',
      value: '8',
      subtitle: 'Due in next 30 days',
      color: 'bg-yellow-100',
      icon: '⏰',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hi, {user?.name}</h2>
          <p className="text-sm text-gray-500">Welcome to EduERP admin panel</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`${metric.color} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">{metric.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                <p className="text-xs text-gray-500">{metric.subtitle}</p>
              </div>
              <div className="text-3xl opacity-40">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Institute Updates</h3>
          <div className="space-y-0 divide-y divide-gray-200">
            {[
              { icon: '🏢', title: 'New Institute Registered', subtitle: "St. Xavier's College", time: '2 hours ago' },
              { icon: '📊', title: 'Subscription Renewed', subtitle: 'Premium Plan - DPS School', time: '5 hours ago' },
              { icon: '⚠️', title: 'Subscription Expired', subtitle: 'Delhi Public Institute', time: '1 day ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
          <div className="space-y-5">
            {[
              { label: 'API Uptime', value: '99.9%', percentage: 99.9, color: 'bg-green-500' },
              { label: 'Database Load', value: '45%', percentage: 45, color: 'bg-blue-500' },
              { label: 'Storage Used', value: '62%', percentage: 62, color: 'bg-amber-500' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                  <span className="text-sm font-bold text-gray-700">{stat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`${stat.color} h-2.5 rounded-full`} style={{ width: `${stat.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
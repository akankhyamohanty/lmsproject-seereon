import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { adminService } from '../../services/adminService';

export const StudentManagement = () => {
  const { data: students, loading, error } = useFetch('/admin/students');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createStudent(formData);
      setFormData({ firstName: '', lastName: '', email: '', mobile: '' });
      setShowForm(false);
      alert('Student created successfully');
    } catch (err) {
      alert('Failed to create student');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="tel"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Student
            </button>
          </form>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{student.full_name}</td>
                <td className="px-6 py-3">{student.email}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    student.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
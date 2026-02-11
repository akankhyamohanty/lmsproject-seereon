// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// export const Login = () => {
//   const [email, setEmail] = useState('admin@test.com');
//   const [password, setPassword] = useState('password123');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const data = await login(email, password);

//       const roleRoutes = {
//         super_admin: '/super-admin/dashboard',
//         institute_admin: '/admin/dashboard',
//         faculty: '/faculty/dashboard',
//         student: '/student/dashboard',
//       };

//       const route = roleRoutes[data.user.role] || '/';
//       navigate(route);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
//         <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Education ERP</h1>
//         <p className="text-center text-gray-600 mb-8">Login to your account</p>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="admin@test.com"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
//           <p className="font-semibold mb-2">Test Credentials:</p>
//           <p>Super Admin: superadmin@test.com</p>
//           <p>Admin: admin@test.com</p>
//           <p>Faculty: faculty@test.com</p>
//           <p>Student: student@test.com</p>
//           <p>Password: password123</p>
//         </div>
//       </div>
//     </div>
//   );
// };


import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

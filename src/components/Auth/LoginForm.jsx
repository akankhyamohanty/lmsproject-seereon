// import { useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useNavigate, Link } from "react-router-dom";
// import { 
//   Mail, 
//   Lock, 
//   Building2, 
//   Eye, 
//   EyeOff, 
//   Loader2, 
//   GraduationCap,
//   AlertCircle 
// } from "lucide-react";

// export const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // --- STATE ---
//   const [roleType, setRoleType] = useState("student"); // Updated Default to Student
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     instituteCode: "",
//     rememberMe: false
//   });

//   // --- HANDLERS ---
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//     if (error) setError(""); // Clear error when user types
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // 1. Validation: Institute Code is required for everyone except Super Admin
//       if (roleType !== "super_admin" && !formData.instituteCode) {
//         throw new Error("Institute Code is required.");
//       }

//       // 2. Call Login from AuthContext
//       const data = await login(
//         formData.email, 
//         formData.password, 
//         formData.instituteCode, 
//         roleType
//       );

//       // 3. Routing Logic
//       const roleRoutes = {
//         super_admin: "/super-admin/dashboard",
//         institute_admin: "/admin/dashboard",
//         faculty: "/faculty/dashboard",
//         student: "/student/dashboard",
//       };

//       navigate(roleRoutes[data.role] || "/login");
      
//     } catch (err) {
//       setError(err.message || "Invalid credentials. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      
//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 blur-3xl"></div>
//         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/20 blur-3xl"></div>
//       </div>

//       <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 z-10 mx-4">
        
//         {/* Header / Logo */}
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
//             <GraduationCap size={28} />
//           </div>
//           <h1 className="text-4xl font-bold text-slate-800">Welcome Back</h1>
//           <p className="text-slate-500 text-lg mt-1">Sign in to EduERP Portal</p>
//         </div>

//         {/* UPDATED ROLE SELECTION TABS */}
//         <div className="mb-6 bg-slate-100/80 p-2.5 rounded-xl flex gap-1">
//           {["super_admin", "institute_admin", "faculty", "student"].map((role) => (
//             <button
//               key={role}
//               type="button"
//               onClick={() => { setRoleType(role); setError(""); }}
//               className={`
//                 flex-2 py-2 text-[15px] sm:text-md font-bold uppercase tracking-wide rounded-lg  transition-all
//                 ${roleType === role 
//                   ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
//                   : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
//                 }
//               `}
//             >
//               {role.replace("_", " ")}
//             </button>
//           ))}
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
//             <AlertCircle size={16} className="mt-0.5 shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Email Field */}
//           <div className="space-y-1.5">
//             <label className="text-lg font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                 <Mail size={18} />
//               </div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="name@institute.com"
//                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
//                 required
//               />
//             </div>
//           </div>

//           {/* Institute Code (Visible for everyone EXCEPT Super Admin) */}
//           {roleType !== "super_admin" && (
//             <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
//               <label className="text-lg font-bold text-slate-700 uppercase tracking-wide">Institute Code</label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                   <Building2 size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   name="instituteCode"
//                   value={formData.instituteCode}
//                   onChange={handleChange}
//                   placeholder="e.g. INST-2024"
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
//                   required
//                 />
//               </div>
//             </div>
//           )}

//           {/* Password Field */}
//           <div className="space-y-1.5">
//             <div className="flex justify-between items-center">
//               <label className="text-lg font-bold text-slate-700 uppercase tracking-wide">Password</label>
//             </div>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
//                 <Lock size={18} />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between pt-1">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//               />
//               <span className="text-lg text-slate-600">Remember me</span>
//             </label>
//             <Link to="/forgot-password" className="text-lg font-medium text-blue-600 hover:underline">
//               Forgot password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-6 w-6 animate-spin" />
//                 Signing in...
//               </>
//             ) : (
//               "Sign In"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Building2, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  GraduationCap
} from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [roleType, setRoleType] = useState("student"); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    instituteCode: "",
    rememberMe: false
  });

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (roleType !== "super_admin" && !formData.instituteCode) {
        throw new Error("Institute Code is required.");
      }

      const data = await login(
        formData.email, 
        formData.password, 
        formData.instituteCode, 
        roleType
      );

      const roleRoutes = {
        super_admin: "/super-admin/dashboard",
        institute_admin: "/admin/dashboard",
        faculty: "/faculty/dashboard",
        student: "/student/dashboard",
      };

      navigate(roleRoutes[data.role] || "/login");
      
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* 🖼️ LEFT SIDE: HERO OVERLAY (60% Width) */}
      <div className="hidden lg:flex w-[50%] relative bg-slate-900">
        
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2586&auto=format&fit=crop" 
          alt="College Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">EduERP</span>
          </div>

          <div className="max-w-xl mb-12">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Building the <span className="text-blue-400">Future</span> of Education.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Streamline administration, empower faculty, and engage students with a single, unified platform designed for modern institutes.
            </p>
            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
              <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/150?u=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/150?u=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/150?u=3" alt="User" />
              </div>
              <p className="text-lg font-medium text-gray-400">
                Trusted by <span className="text-white font-bold">10,000+</span> educators worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 RIGHT SIDE: LOGIN FORM (40% Width) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 xl:px-20 bg-white relative">
        
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">EduERP</span>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-lg">Please enter your details to sign in.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-lg font-bold text-slate-700 uppercase tracking-wide">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  placeholder="name@institute.com"
                  required
                />
              </div>
            </div>

            {/* Institute Code (Conditional) */}
            {roleType !== "super_admin" && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-lg font-bold text-slate-700 uppercase tracking-wide">Institute Code</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="instituteCode"
                    value={formData.instituteCode}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    placeholder="e.g. INST-8821"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-lg font-bold text-slate-700 uppercase tracking-wide">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="text-lg text-slate-500 group-hover:text-slate-700 font-medium transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-lg font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg tracking-wide shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold tracking-wider">Select Role</span>
            </div>
          </div>

          {/* 🔽 ROLE SELECTOR AT BOTTOM 🔽 */}
          <div className="p-1 bg-slate-100 rounded-xl grid grid-cols-4 gap-1">
            {["super_admin", "institute_admin", "faculty", "student"].map((role) => (
              <button
                key={role}
                onClick={() => { setRoleType(role); setError(""); }}
                className={`
                  py-2 text-[10px] sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-200
                  ${roleType === role 
                    ? "bg-white text-blue-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }
                `}
              >
                {role === 'super_admin' ? 'Super' : role === 'institute_admin' ? 'Admin' : role}
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account? <span className="text-slate-900 font-bold cursor-pointer hover:underline">Contact Admin</span>
          </p>

        </div>
      </div>
    </div>
  );
};
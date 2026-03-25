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
  GraduationCap,
  CheckCircle2
} from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [roleType, setRoleType] = useState("institute_admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Added for UI feedback
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    instituteCode: "",
    rememberMe: false
  });

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

      // 1. Call the login function
      const response = await login(
        formData.email, 
        formData.password, 
        formData.instituteCode, 
        roleType
      );

      // 🎯 THE FIX: Do not require 'response.token' to save user data!
      if (response) {
        // Only save token if it exists (for Admin/SuperAdmin)
        if (response.token || response.accessToken) {
          localStorage.setItem("token", response.token || response.accessToken);
        }

        // ALWAYS save the user data so the router knows you are logged in
        const userData = response.user || response.data || response.admin || {};
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          role: roleType,
          instituteCode: formData.instituteCode
        }));
        
        // Save role explicitly just in case your router uses it
        localStorage.setItem("role", roleType);
      }

    

      setIsSuccess(true);

      const roleRoutes = {
        super_admin: "/super-admin/dashboard",
        institute_admin: "/admin/dashboard",
        faculty: "/faculty/dashboard",
        student: "/student/dashboard",
      };

      // Small delay so the user sees the "Success" state
      setTimeout(() => {
        navigate(roleRoutes[roleType] || "/");
      }, 800);
      
    } catch (err) {
      console.error("Login component error:", err);
      setError(err.response?.data?.message || err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* LEFT SIDE: HERO OVERLAY */}
      <div className="hidden lg:flex w-[50%] relative bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2586&auto=format&fit=crop" 
          alt="College Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
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
              Streamline administration, empower faculty, and engage students with a single platform.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 xl:px-20 bg-white relative">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">EduERP</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-lg">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
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

            {roleType !== "super_admin" && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Institute Code</label>
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
                    placeholder="e.g. KII751030"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Password</label>
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

            <button
              type="submit"
              disabled={loading || isSuccess}
              className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 
                ${isSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'}`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isSuccess ? (
                <><CheckCircle2 size={18} /> Verified</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* ROLE SELECTOR */}
          <div className="space-y-4 pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-400"><span className="bg-white px-2">Select Access Level</span></div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-4 gap-1">
              {["super_admin", "institute_admin", "faculty", "student"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setRoleType(role); setError(""); }}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200
                    ${roleType === role ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {role === 'super_admin' ? 'Super' : role === 'institute_admin' ? 'Admin' : role.split('_')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
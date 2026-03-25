import { useState, useEffect } from "react";
import { User, Mail, Phone, GraduationCap, BookOpen, Award, Loader2 } from "lucide-react";
import axios from "axios";

export const FacultyProfile = () => {
  // --- 1. SET UP STATES ---
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // State to hold the real number of active classes from DB
  const [activeClassesCount, setActiveClassesCount] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    experience: "",
    qualification: "",
    specializations: "", 
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // --- 2. FETCH REAL DATA FROM DB ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Profile Info (🎯 Updated for Cookies)
        const profileResponse = await axios.get("http://localhost:5000/api/faculty/profile/me", {
          withCredentials: true 
        });

        if (profileResponse.data.success) {
          const data = profileResponse.data.data;
          setFaculty(data);
          
          setForm({
            fullName: data.fullName || data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            experience: data.experience || 0,
            qualification: data.qualification || "",
            specializations: Array.isArray(data.specializations) 
              ? data.specializations.join(", ") 
              : (data.specializations || ""),
          });
        }

        // 2. Fetch Classes to get the real active count (🎯 Updated for Cookies)
        try {
          const classesResponse = await axios.get("http://localhost:5000/api/faculty/classes/my-classes", {
            withCredentials: true 
          });

          if (classesResponse.data.success) {
            const classesArray = classesResponse.data.data || [];
            setActiveClassesCount(classesArray.length);
          }
        } catch (classErr) {
          console.error("Could not fetch active classes count:", classErr);
          // Non-blocking error
        }

      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Empty dependency array since we don't need token anymore

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- 3. HANDLE UPDATE ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated string back to an array
      const specsArray = typeof form.specializations === 'string' 
        ? form.specializations.split(",").map((s) => s.trim()).filter((s) => s !== "")
        : form.specializations;

      const updatePayload = {
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        experience: form.experience,
        qualification: form.qualification,
        specializations: specsArray,
      };

      // 🎯 Updated for Cookies
      const response = await axios.put(
        "http://localhost:5000/api/faculty/profile/update",
        updatePayload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setFaculty({ ...faculty, ...updatePayload }); 
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Update failed.");
    }
  };

  // --- 4. HANDLE PASSWORD CHANGE ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      // 🎯 Updated for Cookies
      const response = await axios.put(
        "http://localhost:5000/api/faculty/profile/change-password",
        { current: passwordForm.current, newPass: passwordForm.newPass },
        { withCredentials: true }
      );

      if (response.data.success) {
        setShowPasswordModal(false);
        setPasswordForm({ current: "", newPass: "", confirm: "" });
        setSuccess("Password changed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Error changing password.");
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-500 font-medium">Loading Profile...</span>
    </div>
  );
  
  if (!faculty) return <div className="p-6 text-red-500">No data found.</div>;

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start text-left justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-md text-gray-500 mt-1">Manage your personal and professional information</p>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-md font-medium hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2H9m6 0V7m0 4v4m0 0H9m6 0a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6" />
          </svg>
          Change Password
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-left border border-green-200 text-green-700 text-md px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-left border border-red-200 text-red-700 text-md px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ── Top Row: Photo + Personal Details ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Photo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-4">
          <h2 className="text-base font-semibold text-gray-800 self-start">Profile Photo</h2>
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-14 h-14 text-blue-400" />
            )}
          </div>
          <label className="border border-gray-300 rounded-lg px-4 py-2 text-md font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer">
            Upload Photo
            <input type="file" accept=".jpg,.jpeg,.png,.gif" className="hidden" onChange={handlePhotoUpload} />
          </label>
          <p className="text-xs text-gray-400">JPG, PNG or GIF (Max. 2MB)</p>
        </div>

        {/* Personal Details */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-left text-gray-800">Personal Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-md font-medium text-left text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-md text-left font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-left text-gray-700 mb-1">Mobile Number</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-md text-left font-medium text-gray-700 mb-1">Experience (Years)</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type="number"
                  name="experience"
                  min={0}
                  value={form.experience}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Professional Details ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base text-left font-semibold text-gray-800">Professional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div>
            <label className="block text-md text-left font-medium text-gray-700 mb-1">Qualification</label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. Ph.D. in Physics"
                className="flex-1 bg-transparent outline-none text-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-md text-left font-medium text-gray-700 mb-1">Specialization / Subjects</label>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                name="specializations"
                value={form.specializations}
                onChange={handleChange}
                placeholder="e.g. Math, Science (Comma separated)"
                className="flex-1 bg-transparent outline-none text-md"
              />
            </div>
          </div>

        </div>

        {/* ── UPDATE BUTTON ── */}
        <div className="flex justify-end pt-2">
          <button onClick={handleUpdate} className="bg-black text-white text-md font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md active:scale-95">
            Update Profile
          </button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{faculty.experience || 0}</p>
            <p className="text-md text-gray-500">Years of Experience</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-500">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{Array.isArray(faculty.specializations) ? faculty.specializations.length : 0}</p>
            <p className="text-md text-gray-500">Specializations</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-purple-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{activeClassesCount}</p>
            <p className="text-md text-gray-500">Active Classes</p>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ─────────────────────────────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {["current", "newPass", "confirm"].map((field, i) => (
                <div key={field}>
                  <label className="block text-md font-medium text-gray-700 mb-1 text-left">
                    {["Current Password", "New Password", "Confirm New Password"][i]}
                  </label>
                  <input
                    type="password"
                    value={passwordForm[field]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              {passwordError && <p className="text-xs text-red-500 text-left font-medium">{passwordError}</p>}
              <div className="flex gap-3 pt-1">
                <button type="submit" className="flex-1 bg-black text-white text-md font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition">Update Password</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 border border-gray-300 text-gray-700 text-md font-medium py-2.5 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyProfile;
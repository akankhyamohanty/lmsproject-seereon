import { useState } from "react";
import { User, Mail, Phone, GraduationCap, BookOpen, Award } from "lucide-react";

export const FacultyProfile = () => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    mobile: "+1 234-567-8900",
    experience: "12",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const faculty = {
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.edu",
    qualification: "Ph.D. in Mathematics",
    specializations: ["Mathematics", "Statistics", "Calculus"],
    experience: form.experience,
    activeClasses: 5,
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setSuccess("Profile updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!passwordForm.current) { setPasswordError("Current password is required."); return; }
    if (passwordForm.newPass.length < 6) { setPasswordError("Password must be at least 6 characters."); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordError("Passwords do not match."); return; }
    setShowPasswordModal(false);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setSuccess("Password changed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

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
            <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2H9m6 0V7m0 4v4m0 0H9m6 0a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6" />
          </svg>
          Change Password
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-left border border-green-200 text-green-700 text-md px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* ── Top Row: Photo + Personal Details ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Profile Photo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-4">
          <h2 className="text-base font-semibold text-gray-800 self-start">Profile Photo</h2>
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
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
            {/* Full Name – read only */}
            <div>
              <label className="block text-md font-medium text-left  text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-md text-gray-700">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                {faculty.fullName}
              </div>
              <p className="text-xs text-gray-400 mt-1">Read-only</p>
            </div>

            {/* Email – read only */}
            <div>
              <label className="block text-md text-left font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-md text-gray-700">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                {faculty.email}
              </div>
              <p className="text-sm text-left  text-gray-400 mt-1">Read-only</p>
            </div>

            {/* Mobile – editable */}
            <div>
              <label className="block text-md font-medium text-left  text-gray-700 mb-1">Mobile Number</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-md"
                />
              </div>
            </div>

            {/* Experience – editable */}
            <div>
              <label className="block text-md text-left  font-medium text-gray-700 mb-1">Experience (Years)</label>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black">
                <input
                  type="number"
                  min={0}
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Professional Details ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base text-left  font-semibold text-gray-800">Professional Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Qualification */}
          <div>
            <label className="block text-md text-left  font-medium text-gray-700 mb-1">Qualification</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-md text-gray-700">
              <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
              {faculty.qualification}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-md text-left font-medium text-gray-700 mb-1">Specialization / Subjects</label>
            <div className="flex flex-wrap gap-2">
              {faculty.specializations.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-md text-gray-700 bg-gray-50"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Update Profile Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleUpdate}
            className="bg-black text-white text-md font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{faculty.experience}</p>
            <p className="text-md text-gray-500">Years of Experience</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{faculty.specializations.length}</p>
            <p className="text-md text-gray-500">Subject Specializations</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{faculty.activeClasses}</p>
            <p className="text-md text-gray-500">Active Classes</p>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ─────────────────────────────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {["current", "newPass", "confirm"].map((field, i) => (
                <div key={field}>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    {["Current Password", "New Password", "Confirm New Password"][i]}
                  </label>
                  <input
                    type="password"
                    value={passwordForm[field]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                    placeholder={["Enter current password", "Enter new password", "Confirm new password"][i]}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-md outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              ))}

              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white text-md font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); setPasswordError(""); }}
                  className="flex-1 border border-gray-300 text-gray-700 text-md font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
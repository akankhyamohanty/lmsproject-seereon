import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "studentProfile";

export const StudentProfile = () => {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: "",
    studentId: "", 
    email: "",
    mobile: "",
    course: "",
    section: "",
    photo: "",
  });

  /* ================= LOAD FROM LOCAL STORAGE ================= */
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
      setProfile(JSON.parse(storedData));
    } else {
      const defaultProfile = {
        fullName: "",
        studentId: "",
        email: "",
        mobile: "",
        course: "",
        section: "",
        photo: "",
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      setProfile(defaultProfile);
    }
  }, []);

  /* ================= HANDLE PHOTO UPLOAD ================= */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const updatedProfile = {
        ...profile,
        photo: reader.result,
      };

      setProfile(updatedProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    };

    reader.readAsDataURL(file);
  };

  /* ================= HANDLE TEXT INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE PROFILE ================= */
  const handleUpdate = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    alert("Profile updated successfully!");
  };

  const initials =
    profile.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "SB";

  return (
    <div className="w-full max-w-10xl mx-auto pb-12">

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white rounded-2xl p-8 shadow border mb-8">
        <h3 className="text-lg text-left font-bold mb-6">Quick Actions</h3>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-600">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-6 py-2.5 border rounded-lg text-md font-bold hover:bg-gray-100"
          >
            <Upload size={16} />
            Upload photo
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      {/* ================= PERSONAL DETAILS ================= */}
      <div className="bg-white rounded-2xl p-8 shadow border mb-8">
        <h3 className="text-lg text-left font-bold mb-8">Personal Details</h3>

        <div className="grid text-left grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Input
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />

          <Input
            label="Student ID"
            value={profile.studentId}
            readOnly
          />

          <Input
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />

          <Input
            label="Mobile Number"
            name="mobile"
            value={profile.mobile}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700"
        >
          Update details
        </button>
      </div>

      {/* ================= ACADEMICS DETAILS ================= */}
      <div className="bg-white rounded-2xl p-8 shadow border">
        <h3 className="text-lg text-left font-bold mb-8">Academics Details</h3>

        <div className="grid text-left grid-cols-1 md:grid-cols-2 gap-8">
          <Input label="Course / Program" value={profile.course} readOnly />
          <Input label="Class / Section" value={profile.section} readOnly />
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-md font-bold ml-1">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-200 rounded-lg px-4 py-3.5 font-bold text-md outline-none"
    />
  </div>
);

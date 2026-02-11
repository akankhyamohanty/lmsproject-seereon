import { useState } from "react";
import { 
  Save, 
  Upload, 
  FileText, 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  Award, 
  CreditCard,
  Check
} from "lucide-react";

export const InstituteProfile = () => {
  // 1. Initial State (Simulating an existing institute)
  const [formData, setFormData] = useState({
    // Section 1: Basic Details
    instituteName: "Global Tech University",
    type: "University", // Could be School, College, Coaching
    address: "123 Innovation Drive, Silicon Valley",
    city: "San Francisco",
    state: "California",
    country: "USA",
    pincode: "94105",

    // Section 2: Contact Details
    email: "admin@globaltech.edu",
    phone: "+1 (555) 123-4567",
    website: "https://globaltech.edu",

    // Section 3: Registration
    regNumber: "REG-2023-8892",
    accreditationBody: "WASC Senior College and University Commission",
    certificateFile: "accreditation_cert_2024.pdf",

    // Section 4: Subscription
    planName: "Enterprise Plan",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    activeModules: ["Admission", "LMS", "Finance", "HR", "Examination"],
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      alert("Institute Profile Updated Successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Institute Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage institute details and subscription status</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70"
        >
          {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <form className="space-y-6">
        
        {/* SECTION 1: BASIC DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Section 1: Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Institute Name</label>
              <input type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>University</option>
                <option>College</option>
                <option>School</option>
                <option>Coaching Center</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Phone size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Section 2: Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Official Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3 top-3 text-slate-400" />
                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: REGISTRATION & ACCREDITATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Award size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Section 3: Registration & Accreditation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
              <input type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Accreditation Body</label>
              <input type="text" name="accreditationBody" value={formData.accreditationBody} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            {/* File Upload Section */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Files</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <Upload size={32} className="text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (MAX. 5MB)</p>
              </div>
              
              {/* Preview of Uploaded File */}
              {formData.certificateFile && (
                <div className="mt-3 flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{formData.certificateFile}</span>
                  </div>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Preview</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: SUBSCRIPTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Section 4: Subscription</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
              <select name="planName" value={formData.planName} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Basic Plan</option>
                <option>Standard Plan</option>
                <option>Enterprise Plan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Active Modules Badges */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Active Modules</label>
            <div className="flex flex-wrap gap-2">
              {formData.activeModules.map((module, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  <Check size={12} /> {module}
                </span>
              ))}
              <button type="button" className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200">
                + Add Module
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
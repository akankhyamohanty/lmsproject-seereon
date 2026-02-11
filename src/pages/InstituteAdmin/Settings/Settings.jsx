import { useState } from "react";
import { User, Lock, Building, Save } from "lucide-react";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-125">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "profile" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <User size={18} /> My Profile
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "security" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Lock size={18} /> Security
          </button>
          <button 
            onClick={() => setActiveTab("institute")}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "institute" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Building size={18} /> Institute Rules
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          
          {/* PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-bold text-slate-800">Profile Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Admin Name</label>
                  <input type="text" defaultValue="Institute Admin" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Official Email</label>
                  <input type="email" defaultValue="admin@school.com" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input type="tel" defaultValue="+1 234 567 8900" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-bold text-slate-800">Security & Password</h2>
              <div className="max-w-md space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <input type="password" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">New Password</label>
                  <input type="password" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                  <input type="password" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save size={18} /> Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
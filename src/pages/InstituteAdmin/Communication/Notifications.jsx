import { useEffect, useState } from "react";
import {
  Send,
  ChevronDown,
  Mail,
  Smartphone,
  MailCheck,
  Clock,
  MessageSquareX,
} from "lucide-react";

const STORAGE_KEY = "notifications";

export const Notifications = () => {
  const [loading, setLoading] = useState(false);

  // Form state
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // Toggle state
  const [targetRoles, setTargetRoles] = useState(["Students"]);
  const [channels, setChannels] = useState(["SMS"]);

  // Notifications list
  const [notifications, setNotifications] = useState([]);

  /* ----------------------------------
      Load notifications from localStorage
   ---------------------------------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setNotifications(stored);
  }, []);

  /* ----------------------------------
      Save notifications to localStorage
   ---------------------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  /* ----------------------------------
      Helpers
   ---------------------------------- */
  const toggleRole = (role) => {
    setTargetRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const toggleChannel = (channel) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  /* ----------------------------------
      Submit Handler
   ---------------------------------- */
  const handleSend = (e) => {
    e.preventDefault();

    if (!title || !message || !course) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const newNotification = {
      id: Date.now(),
      course,
      title,
      message,
      targetRoles,
      channels,
      scheduleDate,
      scheduleTime,
      status: scheduleDate || scheduleTime ? "pending" : "delivered",
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setNotifications((prev) => [newNotification, ...prev]);

      // Reset form
      setCourse("");
      setTitle("");
      setMessage("");
      setScheduleDate("");
      setScheduleTime("");
      setTargetRoles(["Students"]);
      setChannels(["SMS"]);

      setLoading(false);
      alert("Notification Broadcasted Successfully!");
    }, 1000);
  };

  /* ----------------------------------
      Stats
   ---------------------------------- */
  const deliveredCount = notifications.filter(
    (n) => n.status === "delivered"
  ).length;

  const pendingCount = notifications.filter(
    (n) => n.status === "pending"
  ).length;

  const failedCount = notifications.filter(
    (n) => n.status === "failed"
  ).length;

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="mb-10 mt-2">
        <h1 className="text-4xl font-black text-[#1e293b] tracking-tight">
          Notifications
        </h1>
        <p className="text-slate-400 font-medium mt-2">
          Send notifications to students, faculty, and staff
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="h-2 bg-[#2563eb]" />

          <form onSubmit={handleSend} className="p-10 space-y-8">
            {/* Course */}
            <div>
              <label className="text-md font-black uppercase tracking-widest text-slate-700">
                Course / Class
              </label>
              <div className="relative mt-2">
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-5 py-4 font-bold text-md appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                >
                  <option value="">Select Target Audience</option>
                  <option>B.Tech CSE - Year 1</option>
                  <option>B.Tech CSE - Year 2</option>
                  <option>All Faculty</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* Title */}
            <div>
                <label className="text-md font-black uppercase tracking-widest text-slate-700">Title</label>
                <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification Title"
                className="w-full mt-2 bg-slate-100 rounded-xl px-5 py-4 font-bold text-md outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                />
            </div>

            {/* Message */}
            <div>
                <label className="text-md font-black uppercase tracking-widest text-slate-700">Message</label>
                <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Notification Message"
                className="w-full mt-2 bg-slate-100 rounded-xl px-5 py-4 font-bold text-md resize-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                />
            </div>

            {/* Target Roles */}
            <div>
              <p className="text-md font-black uppercase tracking-widest mb-3 text-slate-700">
                Target Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {/* ✅ Added "Institute" option here */}
                {["Students", "Faculty", "Staff"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-5 py-2.5 rounded-xl text-md font-bold uppercase tracking-wider transition-all ${
                      targetRoles.includes(role)
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Channels */}
            <div>
              <p className="text-md font-black uppercase tracking-widest mb-3 text-slate-700">
                Delivery Channels
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleChannel("Email")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-md font-bold uppercase tracking-wider transition-all ${
                    channels.includes("Email")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Mail size={16} /> Email
                </button>
                <button
                  type="button"
                  onClick={() => toggleChannel("SMS")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-md font-bold uppercase tracking-wider transition-all ${
                    channels.includes("SMS")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Smartphone size={16} /> SMS
                </button>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="text-md font-black uppercase tracking-widest text-slate-700">Schedule Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full mt-2 bg-slate-100 rounded-xl px-5 py-4 font-bold text-md outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-500 uppercase"
                  />
              </div>
              <div>
                  <label className="text-md font-black uppercase tracking-widest text-slate-700">Schedule Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full mt-2 bg-slate-100 rounded-xl px-5 py-4 font-bold text-md outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-500 uppercase"
                  />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl text-md font-bold uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? "Sending..." : <><Send size={16} strokeWidth={2.5} /> Send Notification</>}
              </button>
            </div>
          </form>
        </div>

        {/* STATS */}
        <div className="space-y-6">
          <StatCard
            label="Delivered"
            count={deliveredCount}
            icon={<MailCheck size={32} strokeWidth={2} />}
            color="blue"
          />
          <StatCard 
            label="Pending" 
            count={pendingCount} 
            icon={<Clock size={32} strokeWidth={2} />} 
            color="orange"
          />
          <StatCard 
            label="Failed" 
            count={failedCount} 
            icon={<MessageSquareX size={32} strokeWidth={2} />} 
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------
   Stats Card Component
---------------------------------- */
const StatCard = ({ label, count, icon, color }) => {
    
  const colorStyles = {
      blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      orange: "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white",
      red: "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:scale-[1.02] transition-all cursor-pointer">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${colorStyles[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <h3 className="text-4xl font-black text-slate-800 tracking-tighter mt-1">{count}</h3>
      </div>
    </div>
  );
};
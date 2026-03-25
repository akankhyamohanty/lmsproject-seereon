import { useState } from "react";
import { FileText, CalendarDays, UserCheck, Bell, CheckCircle2 } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Assignment Submission",
    message: "John Smith has submitted the Differentiation Exercises assignment",
    time: "2026-02-16 10:30 AM",
    read: false,
    type: "assignment",
  },
  {
    id: 2,
    title: "Upcoming Exam",
    message: "Mid-Term Examination for Grade 10-A is scheduled on Feb 25",
    time: "2026-02-16 09:00 AM",
    read: false,
    type: "exam",
  },
  {
    id: 3,
    title: "Leave Approved",
    message: "Your sick leave application has been approved",
    time: "2026-02-15 03:45 PM",
    read: true,
    type: "leave",
  },
  {
    id: 4,
    title: "School Notice",
    message: "Parent-Teacher meeting scheduled for March 1st",
    time: "2026-02-15 11:20 AM",
    read: true,
    type: "notice",
  },
];

const typeIcon = (type) => {
  switch (type) {
    case "assignment": return <FileText className="w-5 h-5 text-blue-500" />;
    case "exam":       return <CalendarDays className="w-5 h-5 text-purple-500" />;
    case "leave":      return <UserCheck className="w-5 h-5 text-green-500" />;
    default:           return <Bell className="w-5 h-5 text-yellow-500" />;
  }
};

export const FacultyNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const filtered =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : activeTab === "read"
      ? notifications.filter((n) => n.read)
      : notifications;

  const tabs = [
    { key: "all",    label: "All Notifications", count: notifications.length, countStyle: "bg-gray-200 text-gray-700" },
    { key: "unread", label: "Unread",             count: unreadCount,          countStyle: "bg-blue-500 text-white" },
    { key: "read",   label: "Read",               count: null },
  ];

  return (
    <div className="p-6  text-left space-y-6 max-w-8xl mx-auto">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Stay updated with your activities</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`text-md font-bold px-1.5 py-0.5 rounded-full ${tab.countStyle}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notification List ─────────────────────────────────────────────── */}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          {tabs.find((t) => t.key === activeTab)?.label}
        </h2>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
            No notifications here.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-4 transition-all ${
                  !n.read
                    ? "bg-blue-50 border-blue-100"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon + Content */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        {!n.read && (
                          <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{n.message}</p>
                      <p className="text-md text-gray-400">{n.time}</p>
                    </div>
                  </div>

                  {/* Mark as read */}
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition whitespace-nowrap shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
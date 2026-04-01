import { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2, Zap, Users, GraduationCap, Wallet, AlertCircle, Clock,
  Search, ArrowLeft, Eye, ChevronRight, DollarSign, UserCheck, 
  CalendarCheck, TrendingUp, Star, Phone, Mail, MapPin, X, Loader2,
  BookOpen, ClipboardList, Receipt, LayoutGrid
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Badge = ({ label, type }) => {
  const base = "text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase";
  const styles = {
    Active: "bg-emerald-100 text-emerald-700",
    active: "bg-emerald-100 text-emerald-700",
    Suspended: "bg-rose-100 text-rose-600",
    suspended: "bg-rose-100 text-rose-600",
    Premium: "bg-violet-100 text-violet-700",
    Standard: "bg-blue-100 text-blue-700",
    Basic: "bg-slate-100 text-slate-600",
  };
  return <span className={`${base} ${styles[label] || styles[type] || styles.Basic}`}>{label || "Unknown"}</span>;
};

const Bar = ({ pct, color = "bg-violet-500" }) => (
  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
    <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
  </div>
);

const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded-2xl ${color}`}>
    <div className="p-2 bg-white/60 rounded-xl">
      <Icon size={18} className="text-slate-700" />
    </div>
    <div>
      <p className="text-[11px] text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
    </div>
  </div>
);

const DashboardCard = ({ title, value, subtext, icon: Icon, bgType }) => {
  const styles = { purple: "bg-[#EBEBFF]", beige: "bg-[#FFF2E5]" };
  return (
    <div className={`${styles[bgType]} p-5 sm:p-6 rounded-2xl flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm sm:text-base font-semibold text-slate-700">{title}</h3>
        <Icon size={22} className="text-slate-700 opacity-80" />
      </div>
      <div className="mt-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</h2>
      </div>
      <div className="mt-1">
        <p className="text-[10px] sm:text-sm text-slate-500 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

// ─── Institute Picker Modal ───────────────────────────────────────────────────
const InstitutePicker = ({ institutes, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  
  const filtered = institutes.filter(i =>
    (i.name || i.organisation?.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (i.city || i.organisation?.city || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Select Institute</h3>
            <p className="text-xs text-slate-400 mt-0.5">Choose an institute to view its details</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              autoFocus type="text" placeholder="Search by name or city..." value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-10">No institutes found</p>
          )}
          {filtered.map(ins => {
            const name = ins.name || ins.organisation?.name || "Unnamed";
            const city = ins.city || ins.organisation?.city || "N/A";
            return (
              <button
                key={ins.id} onClick={() => { onSelect(ins); onClose(); }}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-violet-50/60 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EBEBFF] flex items-center justify-center shrink-0">
                  <Building2 size={17} className="text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                  <p className="text-xs text-slate-400">{city} · {ins.totalStudents || 0} students</p>
                </div>
                <Badge label={ins.status} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Deep Institute Detail View ───────────────────────────────────────────────
const InstituteDetail = ({ institute: initialInst, onBack }) => {
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "faculty", label: "Faculty", icon: Users },
    { id: "batches", label: "Batches", icon: LayoutGrid },
    { id: "exams", label: "Exams", icon: ClipboardList },
    { id: "fee", label: "Fees", icon: DollarSign },
    { id: "expenses", label: "Expenses", icon: Receipt }
  ];

  useEffect(() => {
    const fetchDeepDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("superadmin_token") || localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/superadmin/institutes/${initialInst.id}/full-details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setDetails(res.data.data);
        } else {
          setDetails(initialInst);
        }
      } catch (err) {
        console.error("Failed to fetch deep details", err);
        setDetails(initialInst); 
      } finally {
        setLoading(false);
      }
    };

    fetchDeepDetails();
  }, [initialInst.id, initialInst]);

  if (loading || !details) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center text-slate-400 animate-fadeIn">
        <Loader2 size={36} className="animate-spin text-blue-600 mb-4" />
        <p className="font-semibold text-sm">Fetching complete institute database...</p>
      </div>
    );
  }

  const ins = { ...initialInst, ...details };
  const instName = ins.name || ins.organisation?.name || "Unnamed Institute";
  const instCity = ins.city || ins.organisation?.city || ins.address || "Location unavailable";
  const instEmail = ins.email || ins.organisation?.email || "N/A";
  const instPhone = ins.phone || ins.organisation?.phone || "N/A";

  return (
    <div className="w-full animate-fadeIn">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Back to All Institutes
        </button>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[#f0edff] to-[#fff8f0] rounded-3xl p-6 mb-6 border border-violet-100">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Building2 size={26} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{instName}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {instCity}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge label={ins.status || "Active"} />
                <Badge label={ins.plan || "Premium"} />
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500 space-y-1 sm:text-right">
            <p className="flex sm:justify-end items-center gap-1.5"><Mail size={12} /> {instEmail}</p>
            <p className="flex sm:justify-end items-center gap-1.5"><Phone size={12} /> {instPhone}</p>
            <p className="font-mono text-xs font-bold text-blue-600 mt-2 bg-blue-100 inline-block px-2 py-1 rounded-md">
              Code: {ins.institute_code || ins.id}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <StatPill icon={GraduationCap} label="Total Students" value={ins.totalStudents?.toLocaleString() || 0} color="bg-white/70" />
          <StatPill icon={Users} label="Total Faculty" value={ins.totalFaculty || 0} color="bg-white/70" />
          <StatPill icon={LayoutGrid} label="Active Batches" value={ins.totalBatches || 0} color="bg-white/70" />
          <StatPill icon={Wallet} label="Revenue Collected" value={`₹${ins.revenueCollected?.toLocaleString() || 0}`} color="bg-white/70" />
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl mb-6 overflow-x-auto no-scrollbar border border-slate-100">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                tab === t.id ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ── TAB PANELS ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[400px]">
        
        {/* OVERVIEW PANEL */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {[
              { label: "Current Plan", value: ins.plan || "Premium", icon: TrendingUp },
              { label: "Registration Date", value: ins.created_at ? new Date(ins.created_at).toLocaleDateString() : new Date().toLocaleDateString(), icon: Clock },
              { label: "Data Storage", value: "Normal usage", icon: BookOpen },
              { label: "Database Status", value: "Healthy", icon: AlertCircle },
              { label: "Admin Name", value: ins.admin_name || "N/A", icon: UserCheck },
              { label: "Total Expenses", value: `₹${ins.totalExpenses?.toLocaleString() || 0}`, icon: Receipt },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STUDENTS PANEL */}
        {tab === "students" && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Enrolled Students</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(ins.studentsList || []).length > 0 ? ins.studentsList.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-sm text-slate-700">{s.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">{s.roll || s.roll_no || "N/A"}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-600">{s.batch || "N/A"}</td>
                      <td className="py-3 px-4"><Badge label={s.status || "Active"} /></td>
                    </tr>
                  )) : <tr><td colSpan={4} className="py-10 text-center text-slate-400">No students data found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BATCHES PANEL */}
        {tab === "batches" && (
          <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(ins.batchesList || []).length > 0 ? ins.batchesList.map((b, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-slate-800">{b.name}</h4>
                  <Badge label={b.status || "Active"} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{b.course || "General"}</p>
                <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-blue-500"/> {b.studentCount || 0} Students</span>
                </div>
              </div>
            )) : <p className="col-span-full py-10 text-center text-slate-400">No batches data found.</p>}
          </div>
        )}

        {/* EXAMS PANEL */}
        {tab === "exams" && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Exam Schedules</h3>
            <div className="space-y-3">
              {(ins.examsList || []).length > 0 ? ins.examsList.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg text-center leading-tight">
                      {new Date(e.date).getDate()}<br/><span className="text-[9px] uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{e.title}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{e.batch} · {e.subject}</p>
                    </div>
                  </div>
                  <Badge label={e.status || "Scheduled"} />
                </div>
              )) : <p className="py-10 text-center text-slate-400">No upcoming exams.</p>}
            </div>
          </div>
        )}

        {/* FACULTY PANEL */}
        {tab === "faculty" && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Faculty Members</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(ins.facultyList || []).length > 0 ? ins.facultyList.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-sm text-slate-700">{f.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">{f.designation || "N/A"}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-600">{f.subject || f.department || "N/A"}</td>
                      <td className="py-3 px-4"><Badge label={f.status || "Active"} /></td>
                    </tr>
                  )) : <tr><td colSpan={4} className="py-10 text-center text-slate-400">No faculty data found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FEES & EXPENSES PLACEHOLDERS */}
        {["fee", "expenses"].includes(tab) && (
          <div className="animate-fadeIn py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Financial Data</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Total {tab === "fee" ? "Revenue" : "Expenses"}: <span className="font-bold text-slate-800">₹{(tab === "fee" ? ins.revenueCollected : ins.totalExpenses)?.toLocaleString() || 0}</span>
              <br/><br/>Detailed logs for {tab} are aggregated in the overview.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const SuperAdminDashboard = () => {
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  
  // Dynamic State
  const [institutes, setInstitutes] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚀 RESTORED THE FETCH LOGIC!
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("superadmin_token") || localStorage.getItem("token"); 
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, institutesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/superadmin/dashboard-stats", { headers }),
          axios.get("http://localhost:5000/api/superadmin/institutes", { headers })
        ]);

        if (statsRes.data.success) setStatsData(statsRes.data.data);
        if (institutesRes.data.success) {
          // Check both data.data or data.data.institutes depending on how your backend sends it
          setInstitutes(institutesRes.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching super admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-3">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <p className="font-semibold text-sm">Loading Dashboard Data...</p>
      </div>
    );
  }

  const cardsConfig = [
    { title: "Total Institutes", value: statsData?.totalInstitutes || institutes.length || 0, subtext: "All registered institutes", icon: Building2, bgType: "purple" },
    { title: "Active Institutes", value: statsData?.activeInstitutes || institutes.filter(i=>i.status==='Active').length || 0, subtext: "Currently active", icon: Zap, bgType: "beige" },
    { title: "Suspended Institutes", value: statsData?.suspendedInstitutes || institutes.filter(i=>i.status==='Suspended').length || 0, subtext: "Temporarily suspended", icon: AlertCircle, bgType: "beige" },
    { title: "Total Teachers", value: statsData?.totalTeachers?.toLocaleString() || 0, subtext: "All faculties", icon: Users, bgType: "purple" },
    { title: "Total Students", value: statsData?.totalStudents?.toLocaleString() || 0, subtext: "All enrolled students", icon: GraduationCap, bgType: "beige" },
    { title: "Monthly Revenue", value: `₹${statsData?.monthlyRevenue?.toLocaleString() || 0}`, subtext: "Subscription revenue", icon: Wallet, bgType: "purple" },
    { title: "Expiring Subs", value: statsData?.expiringSubscriptions || 0, subtext: "Next 30 days", icon: Clock, bgType: "beige" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease both; }
      `}</style>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Super Admin Hub</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage and monitor all tenant institutes</p>
          </div>
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-200"
          >
            <Search size={16} /> Locate Institute
          </button>
        </div>

        {/* Selected Institute Banner */}
        {selectedInstitute && !showPicker && (
          <div className="mb-6 bg-violet-50 border border-violet-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <Building2 size={18} className="text-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-blue-600 truncate">
                Viewing Database: {selectedInstitute.name || selectedInstitute.organisation?.name || "Unnamed"}
              </span>
              <Badge label={selectedInstitute.status} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowPicker(true)} className="text-xs text-blue-500 font-semibold hover:underline">
                Change Target
              </button>
              <button onClick={() => setSelectedInstitute(null)} className="p-1 rounded-lg hover:bg-violet-100 transition-colors">
                <X size={14} className="text-violet-400" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedInstitute ? (
          <InstituteDetail
            institute={selectedInstitute}
            onBack={() => setSelectedInstitute(null)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {cardsConfig.map((stat, idx) => (
              <DashboardCard key={idx} {...stat} />
            ))}
          </div>
        )}

        {/* Picker Modal */}
        {showPicker && (
          <InstitutePicker
            institutes={institutes}
            onSelect={setSelectedInstitute}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    </>
  );
};

export default SuperAdminDashboard;
// import { 
//   Building2, Zap, Users, GraduationCap, Wallet, 
//   AlertCircle, Clock, Search, Bell, UserCircle 
// } from "lucide-react";

// // --- Card Component (Pixel-Perfect) ---
// const DashboardCard = ({ title, value, subtext, icon: Icon, bgType }) => {
//   const styles = {
//     purple: "bg-[#EBEBFF]", // Light Lavender
//     beige: "bg-[#FFF2E5]",  // Light Peach
//   };

//   return (
//     <div className={`${styles[bgType]} p-6 rounded-2xl flex flex-col justify-between h-40 relative transition-transform hover:scale-[1.01]`}>
//       {/* Top Row: Title Left, Icon Right */}
//       <div className="flex justify-between items-start">
//         <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
//         {/* Icon: Dark Grey, top right */}
//         <Icon size={22} className="text-slate-700 opacity-80" />
//       </div>

//       {/* Middle: Value */}
//       <div className="mt-2">
//         <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
//       </div>

//       {/* Bottom: Subtext */}
//       <div className="mt-1">
//         <p className="text-[11px] text-slate-500 font-medium">{subtext}</p>
//       </div>
//     </div>
//   );
// };

// export const SuperAdminDashboard = () => {
//   const stats = [
//     { title: "Total Institutes", value: "150", subtext: "All registered institutes", icon: Building2, bgType: "purple" },
//     { title: "Active Institutes", value: "138", subtext: "Currently active", icon: Zap, bgType: "beige" },
//     { title: "Total Institutes", value: "150", subtext: "All registered institutes", icon: Building2, bgType: "purple" },
//     { title: "Suspended Institutes", value: "12", subtext: "Temporarily suspended", icon: AlertCircle, bgType: "beige" },
//     { title: "Total Teachers", value: "2,450", subtext: "All faculties", icon: Users, bgType: "purple" },
//     { title: "Total Students", value: "48,320", subtext: "Subscription revenue", icon: GraduationCap, bgType: "beige" },
//     { title: "Monthly Revenue", value: "$150,000", subtext: "All registered institutes", icon: Wallet, bgType: "purple" },
//     { title: "Expiring Subscriptions", value: "23", subtext: "Next 30 days", icon: Clock, bgType: "beige" },
//   ];

//   return (
//     <div className="w-full">
      
//       {/* --- TOP HEADER SECTION (Inside Dashboard) --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        
//         {/* Left: Greeting */}
//         {/* <div>
//           <h1 className="text-2xl font-bold text-slate-800">Hi,Subham</h1>
//           <p className="text-xs text-slate-500 mt-1">Manage and monitor all institutes</p>
//         </div> */}

//         {/* Right: Search & Profile */}
//         <div className="flex items-center gap-4">
          
//           {/* Search Pill */}
//           {/* <div className="hidden md:flex items-center bg-white border border-slate-300 rounded-full px-4 py-1.5 w-64 shadow-sm">
//             <input 
//               type="text" 
//               placeholder="Search..." 
//               className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
//             />
//             <Search size={18} className="text-slate-400" />
//           </div> */}

//           {/* Bell Icon */}
//           {/* <button className="bg-white p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 relative">
//             <Bell size={20} />
//             <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
//           </button> */}

//           {/* Profile Avatar */}
//           {/* <div className="w-10 h-10 rounded-full bg-[#FF6B6B] overflow-hidden border border-slate-200 flex items-center justify-center text-white shadow-sm cursor-pointer">
//              <UserCircle size={28} />
//           </div> */}
//         </div>
//       </div>

//       {/* --- CARDS GRID --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stats.map((stat, index) => (
//           <DashboardCard
//             key={index}
//             title={stat.title}
//             value={stat.value}
//             subtext={stat.subtext}
//             icon={stat.icon}
//             bgType={stat.bgType}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };



import { 
  Building2, Zap, Users, GraduationCap, Wallet, 
  AlertCircle, Clock 
} from "lucide-react";

// --- Card Component (Responsive & Pixel-Perfect) ---
const DashboardCard = ({ title, value, subtext, icon: Icon, bgType }) => {
  const styles = {
    purple: "bg-[#EBEBFF]",
    beige: "bg-[#FFF2E5]",
  };

  return (
    <div
      className={`${styles[bgType]} p-5 sm:p-6 rounded-2xl flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]`}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <h3 className="text-sm sm:text-base font-semibold text-slate-700">{title}</h3>
        <Icon size={22} className="text-slate-700 opacity-80" />
      </div>

      {/* Value */}
      <div className="mt-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</h2>
      </div>

      {/* Subtext */}
      <div className="mt-1">
        <p className="text-[10px] sm:text-sm text-slate-500 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

export const SuperAdminDashboard = () => {
  const stats = [
    { title: "Total Institutes", value: "150", subtext: "All registered institutes", icon: Building2, bgType: "purple" },
    { title: "Active Institutes", value: "138", subtext: "Currently active", icon: Zap, bgType: "beige" },
    { title: "Suspended Institutes", value: "12", subtext: "Temporarily suspended", icon: AlertCircle, bgType: "beige" },
    { title: "Total Teachers", value: "2,450", subtext: "All faculties", icon: Users, bgType: "purple" },
    { title: "Total Students", value: "48,320", subtext: "All enrolled students", icon: GraduationCap, bgType: "beige" },
    { title: "Monthly Revenue", value: "$150,000", subtext: "Subscription revenue", icon: Wallet, bgType: "purple" },
    { title: "Expiring Subscriptions", value: "23", subtext: "Next 30 days", icon: Clock, bgType: "beige" },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      
      {/* --- Top Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        {/* Left Greeting */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Hi, Admin</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and monitor all institutes</p>
        </div>

        {/* Right: Optional Search/Bell/Profile */}
        <div className="flex items-center gap-4">
          {/* Placeholder for future search/bell/avatar */}
        </div>
      </div>

      {/* --- Dashboard Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <DashboardCard
            key={idx}
            title={stat.title}
            value={stat.value}
            subtext={stat.subtext}
            icon={stat.icon}
            bgType={stat.bgType}
          />
        ))}
      </div>
    </div>
  );
};

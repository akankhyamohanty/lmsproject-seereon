import { Bell, Search, User } from "lucide-react";

// ✅ The "export" keyword here is CRITICAL
export const Header = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace("_", " ") || "Admin"}</p>
          </div>
          <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-200">
             <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
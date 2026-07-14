import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, FileText, LogOut,
  ChevronRight, Menu, X, Users, User, Tags, Star
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/cms", label: "CMS Content", icon: FileText },
  { to: "/admin/users", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userString = localStorage.getItem("aevum_user");
  const user = userString ? JSON.parse(userString) : { fullName: "Aevum Admin", email: "admin@aevum.com" };

  const handleLogout = () => {
    localStorage.removeItem("aevum_token");
    localStorage.removeItem("aevum_user");
    navigate("/auth/login");
  };

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] flex font-inter text-[#2C2A29] overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#13110F]/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Clean Light Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-68 bg-white border-r border-[#E5E2DA] z-50 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* Brand */}
        <div className="px-6 py-7 border-b border-[#E5E2DA] flex items-center justify-between">
          <div>
            <p className="text-[9px] tracking-[0.3em] text-[#C5A880] font-bold uppercase">Maison</p>
            <h1 className="font-cormorant text-2xl font-semibold tracking-wider text-[#13110F] mt-0.5">AEVUM</h1>
            <span className="text-[9px] tracking-[0.15em] text-[#72706F] uppercase font-medium">Boutique Console</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-[#72706F] hover:text-[#13110F] hover:bg-[#FAF9F6] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#13110F] flex items-center justify-center text-white text-xs font-semibold">
            {user.fullName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-[#13110F] truncate">{user.fullName || "Admin"}</p>
            <p className="text-[10px] text-[#72706F] truncate">{user.email || "admin@aevum.com"}</p>
          </div>
        </div>

        {/* Decent Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200
                ${isActive
                  ? "bg-[#13110F] text-white"
                  : "text-[#72706F] hover:text-[#13110F] hover:bg-[#FAF9F6]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={14} className={isActive ? "text-white" : "text-[#72706F]"} />
                  <span>{label}</span>
                  <ChevronRight size={10} className={`ml-auto transition-all ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-[#E5E2DA] bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-xs font-semibold tracking-wider uppercase text-[#72706F] hover:text-[#13110F] hover:bg-[#FAF9F6] rounded-lg transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E5E2DA] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden p-1.5 text-[#13110F] hover:bg-[#FAF9F6] rounded-md transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold">
              PORTAL ACTIVE
            </span>
          </div>

          <span className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold">
            MAISON AEVUM
          </span>
        </header>

        {/* Content Panel */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

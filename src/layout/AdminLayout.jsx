import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package, FileText, LogOut,
  ChevronRight, Menu, X, Users
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/cms", label: "CMS Content", icon: FileText },
  { to: "/admin/users", label: "Customers", icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("aevum_token");
    localStorage.removeItem("aevum_user");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] flex font-inter">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#13110F] text-[#FDFAF4] z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="px-6 py-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#9B9694] uppercase">Maison</p>
            <h1 className="font-cormorant text-2xl font-medium tracking-wider mt-0.5">AEVUM</h1>
            <span className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#72706F] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm text-sm tracking-[0.05em] transition-all duration-200
                ${isActive
                  ? "bg-[#FDFAF4] text-[#13110F] font-semibold"
                  : "text-[#9B9694] hover:text-[#FDFAF4] hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
              <ChevronRight size={12} className="ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm text-[#9B9694] hover:text-red-400 transition-colors rounded-sm hover:bg-white/5"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E5E2DA] px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden text-[#13110F]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="text-[11px] tracking-[0.2em] text-[#72706F] uppercase font-medium ml-auto">
            Admin Dashboard
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

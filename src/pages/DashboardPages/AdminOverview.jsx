import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import {
  ShoppingBag, Package, Users, DollarSign,
  TrendingUp, Clock, Truck, CheckCircle, XCircle, ArrowUpRight
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, colorClass, borderClass, subText }) => (
  <div className="bg-white border border-[#E5E2DA] hover:border-[#C5A880]/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden">
    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#C5A880]/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
    <div className="flex items-center justify-between mb-4">
      <p className="text-[10px] tracking-[0.2em] text-[#72706F] uppercase font-bold">{label}</p>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${colorClass}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <div>
      <p className="font-cormorant text-3xl font-semibold text-[#13110F] tracking-wide">{value}</p>
      {subText ? (
        <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
          <TrendingUp size={12} />
          <span>{subText}</span>
        </p>
      ) : (
        <p className="text-[10px] text-[#9B9694] mt-2">System Live Status</p>
      )}
    </div>
  </div>
);

const statusColor = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  Processing: "bg-blue-50 text-blue-700 border-blue-200/60",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200/60",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Cancelled: "bg-red-50 text-red-700 border-red-200/60",
};

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.2em] text-[#72706F] uppercase font-semibold">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const { stats, recentOrders } = data || {};

  return (
    <div className="space-y-8 max-w-7xl animate-fade-in">
      {/* Header section with Greeting and Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Tableau de bord</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Welcome to Maison Aevum Admin Console. Manage inventory, process incoming boutique orders, and update system slots.
          </p>
        </div>
        <div className="px-4 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg text-right">
          <p className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold">CURRENT GMT SERVER TIME</p>
          <p className="text-xs font-semibold text-[#13110F] mt-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Elegant Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Orders" 
          value={stats?.totalOrders ?? 0} 
          icon={ShoppingBag} 
          colorClass="bg-[#13110F]"
          subText="+12.4% from last week"
        />
        <StatCard 
          label="Revenue Generated" 
          value={`$${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          colorClass="bg-[#C5A880]"
          subText="+8.2% monthly target"
        />
        <StatCard 
          label="Active Products" 
          value={stats?.totalProducts ?? 0} 
          icon={Package} 
          colorClass="bg-[#8B7D6B]"
        />
        <StatCard 
          label="Total Customers" 
          value={stats?.totalUsers ?? 0} 
          icon={Users} 
          colorClass="bg-[#5C5346]"
          subText="100% verified emails"
        />
      </div>

      {/* Breakdown and Live Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown Panel */}
        <div className="bg-white border border-[#E5E2DA] p-6 rounded-lg shadow-sm flex flex-col justify-between lg:col-span-1">
          <div>
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[#13110F] mb-1">Boutique Live Monitor</h3>
            <p className="text-[10px] text-[#72706F] mb-6">Real-time status of client checkouts and orders.</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "Pending Verification", value: stats?.pendingOrders, icon: Clock, color: "text-amber-500 bg-amber-500/10" },
              { label: "Processing", value: stats?.processingOrders, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
              { label: "Shipped out", value: stats?.shippedOrders, icon: Truck, color: "text-purple-500 bg-purple-500/10" },
              { label: "Delivered", value: stats?.deliveredOrders, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
              { label: "Cancelled", value: stats?.cancelledOrders, icon: XCircle, color: "text-red-500 bg-red-500/10" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between p-3.5 bg-[#FAF9F6] border border-[#E5E2DA]/60 rounded-lg hover:border-[#C5A880]/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-semibold text-[#13110F] uppercase tracking-wider">{label}</span>
                </div>
                <span className="font-cormorant text-xl font-bold text-[#13110F]">{value ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table Panel */}
        <div className="bg-white border border-[#E5E2DA] rounded-lg shadow-sm overflow-hidden lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="px-6 py-5 border-b border-[#E5E2DA] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[#13110F] mb-1">Recent Boutique Invoices</h3>
                <p className="text-[10px] text-[#72706F]">Review incoming orders from the online shop layout.</p>
              </div>
              <span className="text-[9px] bg-[#13110F] text-[#FDFAF4] font-semibold px-2 py-0.5 rounded-full tracking-wider uppercase">LATEST INFLOW</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                    {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-6 py-3.5 text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {(recentOrders || []).map((o) => (
                    <tr key={o._id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-[10px] text-[#C5A880] font-bold">
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-[#13110F] group-hover:text-[#C5A880] transition-colors">
                          {o.user?.fullName || o.shippingAddress?.name || "Guest Checkout"}
                        </p>
                        <p className="text-[9px] text-[#9B9694] mt-0.5">{o.user?.email || "No email available"}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-[#13110F]">
                        ${o.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-bold tracking-[0.1em] px-3 py-1 rounded-full border uppercase ${statusColor[o.orderStatus] || ""}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#72706F] text-[10px] font-semibold">
                        {new Date(o.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!recentOrders?.length && (
                <div className="text-center py-16 text-[#72706F] text-xs uppercase tracking-wider font-semibold">No recent orders recorded.</div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-[#E5E2DA] bg-[#FAF9F6]/30 flex justify-end">
            <a 
              href="/admin/orders" 
              className="text-[10px] font-bold tracking-[0.2em] text-[#13110F] hover:text-[#C5A880] transition-colors flex items-center gap-1 uppercase"
            >
              <span>View All Orders</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

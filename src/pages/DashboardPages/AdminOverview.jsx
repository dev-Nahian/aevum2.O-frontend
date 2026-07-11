import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import {
  ShoppingBag, Package, Users, DollarSign,
  TrendingUp, Clock, Truck, CheckCircle, XCircle
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white border border-[#E5E2DA] p-5 rounded-sm flex items-start gap-4">
    <div className={`w-11 h-11 rounded-sm flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-[11px] tracking-[0.15em] text-[#72706F] uppercase font-medium">{label}</p>
      <p className="text-2xl font-semibold text-[#13110F] mt-0.5">{value}</p>
      {sub && <p className="text-[10px] text-[#9B9694] mt-0.5">{sub}</p>}
    </div>
  </div>
);

const statusColor = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#13110F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, recentOrders } = data || {};

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h2 className="font-cormorant text-3xl font-medium text-[#13110F]">Dashboard</h2>
        <p className="text-sm text-[#72706F] mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingBag} color="bg-[#13110F]" />
        <StatCard label="Revenue" value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" />
        <StatCard label="Products" value={stats?.totalProducts ?? 0} icon={Package} color="bg-blue-600" />
        <StatCard label="Customers" value={stats?.totalUsers ?? 0} icon={Users} color="bg-purple-600" />
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white border border-[#E5E2DA] p-6 rounded-sm">
        <h3 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#13110F] mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Pending", value: stats?.pendingOrders, icon: Clock, cls: "text-amber-600" },
            { label: "Processing", value: stats?.processingOrders, icon: TrendingUp, cls: "text-blue-600" },
            { label: "Shipped", value: stats?.shippedOrders, icon: Truck, cls: "text-purple-600" },
            { label: "Delivered", value: stats?.deliveredOrders, icon: CheckCircle, cls: "text-green-600" },
            { label: "Cancelled", value: stats?.cancelledOrders, icon: XCircle, cls: "text-red-500" },
          ].map(({ label, value, icon: Icon, cls }) => (
            <div key={label} className="flex flex-col items-center justify-center bg-[#FAF9F6] border border-[#E5E2DA] py-4 px-2 rounded-sm gap-1.5">
              <Icon size={20} className={cls} />
              <span className="text-xl font-semibold text-[#13110F]">{value ?? 0}</span>
              <span className="text-[9px] tracking-[0.15em] text-[#72706F] uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#E5E2DA] rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E2DA]">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#13110F]">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.15em] text-[#72706F] uppercase font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map((o) => (
                <tr key={o._id} className="border-b border-[#F0EDE8] hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-5 py-3 font-mono text-[11px] text-[#72706F]">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3 text-[#13110F] font-medium">
                    {o.user?.fullName || o.shippingAddress?.name || "Guest"}
                  </td>
                  <td className="px-5 py-3 text-[#13110F]">${o.total?.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase ${statusColor[o.orderStatus] || ""}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#72706F] text-xs">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recentOrders?.length && (
            <div className="text-center py-12 text-[#72706F] text-sm">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

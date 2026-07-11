import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

const statusColor = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Processing: "bg-blue-100 text-blue-700 border-blue-200",
  Shipped: "bg-purple-100 text-purple-700 border-purple-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};
const paymentColor = {
  Pending: "text-amber-600",
  Paid: "text-green-600",
  Failed: "text-red-600",
  Refunded: "text-blue-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const data = await adminAPI.getOrders({ page, status, limit: 15 });
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
      setCurrentPage(data.currentPage);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(1, statusFilter); }, [statusFilter]);

  const handleStatusUpdate = async (orderId, field, value) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrder(orderId, { [field]: value });
      toast.success("Order updated");
      fetchOrders(currentPage);
      setSelectedOrder((prev) => prev ? { ...prev, [field]: value } : prev);
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cormorant text-3xl font-medium text-[#13110F]">Orders</h2>
          <p className="text-sm text-[#72706F] mt-1">{total} total orders</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E2DA] px-3 py-2 rounded-sm">
          <Filter size={13} className="text-[#72706F]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm text-[#13110F] bg-transparent focus:outline-none"
          >
            <option value="all">All Status</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E2DA] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] text-[#72706F] uppercase font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16 text-[#72706F]">
                  <div className="flex justify-center"><div className="w-6 h-6 border-2 border-[#13110F] border-t-transparent rounded-full animate-spin" /></div>
                </td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-[#72706F] text-sm">No orders found.</td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="border-b border-[#F0EDE8] hover:bg-[#FAF9F6] transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#72706F]">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="text-[#13110F] font-medium text-xs">{o.user?.fullName || o.shippingAddress?.name || "Guest"}</p>
                    <p className="text-[10px] text-[#72706F]">{o.user?.email || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-[#13110F] text-xs">{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</td>
                  <td className="px-4 py-3 text-[#13110F] font-semibold text-xs">${o.total?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold ${paymentColor[o.paymentStatus]}`}>{o.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full border uppercase ${statusColor[o.orderStatus] || ""}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#72706F] text-xs whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="flex items-center gap-1 text-[11px] text-[#13110F] border border-[#E5E2DA] px-2 py-1 hover:bg-[#13110F] hover:text-white transition-colors rounded-sm"
                    >
                      <Eye size={11} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E2DA]">
            <p className="text-xs text-[#72706F]">Page {currentPage} of {pages}</p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchOrders(currentPage - 1)}
                className="p-1.5 border border-[#E5E2DA] disabled:opacity-40 hover:bg-[#F4F1EC] rounded-sm"
              ><ChevronLeft size={14} /></button>
              <button
                disabled={currentPage === pages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="p-1.5 border border-[#E5E2DA] disabled:opacity-40 hover:bg-[#F4F1EC] rounded-sm"
              ><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DA]">
              <h3 className="font-semibold text-[#13110F] tracking-wider">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[#72706F] hover:text-[#13110F] text-xl">✕</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Shipping */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold mb-2">Shipping Address</p>
                <div className="bg-[#FAF9F6] border border-[#E5E2DA] p-4 text-sm text-[#13110F] space-y-1">
                  <p className="font-medium">{selectedOrder.shippingAddress?.name}</p>
                  <p>{selectedOrder.shippingAddress?.phone}</p>
                  <p>{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                  <p>{selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center border border-[#E5E2DA] p-3">
                      {item.product?.image && (
                        <img src={item.product.image} alt="" className="w-12 h-12 object-cover bg-[#F4F1EC]" />
                      )}
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-[#13110F]">{item.product?.title || "Product"}</p>
                        <p className="text-[#72706F] text-xs">Qty: {item.quantity} | Size: {item.size} | ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-[#E5E2DA] pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-[#72706F]"><span>Subtotal</span><span>${selectedOrder.subtotal?.toFixed(2)}</span></div>
                {selectedOrder.discountApplied > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${selectedOrder.discountApplied?.toFixed(2)}</span></div>}
                <div className="flex justify-between text-[#72706F]"><span>Shipping</span><span>${selectedOrder.shipping?.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-[#13110F] text-base"><span>Total</span><span>${selectedOrder.total?.toFixed(2)}</span></div>
              </div>

              {/* Status Update */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1.5">Order Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, "orderStatus", e.target.value)}
                    disabled={updating}
                    className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F]"
                  >
                    {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1.5">Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, "paymentStatus", e.target.value)}
                    disabled={updating}
                    className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F]"
                  >
                    {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

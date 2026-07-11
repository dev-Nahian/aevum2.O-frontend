import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

const statusColor = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  Processing: "bg-blue-50 text-blue-700 border-blue-200/60",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200/60",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Cancelled: "bg-red-50 text-red-700 border-red-200/60",
};

const paymentColor = {
  Pending: "text-amber-600 bg-amber-50 border-amber-200/50",
  Paid: "text-emerald-700 bg-emerald-50 border-emerald-200/50",
  Failed: "text-red-600 bg-red-50 border-red-200/50",
  Refunded: "text-blue-600 bg-blue-50 border-blue-200/50",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const data = await adminAPI.getOrders({ page, status, limit: 12 });
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

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId, field, value) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrder(orderId, { [field]: value });
      toast.success("Order updated successfully");
      fetchOrders(currentPage);
      setSelectedOrder((prev) => prev ? { ...prev, [field]: value } : prev);
    } catch {
      toast.error("Failed to update order details");
    } finally {
      setUpdating(false);
    }
  };

  // Filter local orders based on search query
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const orderIdMatches = o._id.toLowerCase().includes(query);
    const customerMatches = (o.user?.fullName || o.shippingAddress?.name || "").toLowerCase().includes(query);
    const emailMatches = (o.user?.email || "").toLowerCase().includes(query);
    return orderIdMatches || customerMatches || emailMatches;
  });

  return (
    <div className="space-y-8 max-w-7xl animate-fade-in">
      {/* Page Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Gestion des Commandes</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Monitor customer checkout transactions, modify fulfillment statuses, and track invoice amounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg">
            <span className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold block">TOTAL VOLUME</span>
            <span className="text-sm font-bold text-[#13110F]">{total} Orders</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96 flex items-center bg-white border border-[#E5E2DA] px-3.5 py-2.5 rounded-lg focus-within:border-[#C5A880]/60 transition-colors shadow-sm">
          <Search size={16} className="text-[#9B9694] mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-[#13110F] bg-transparent focus:outline-none placeholder-[#9B9694] font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-[#9B9694] hover:text-[#13110F] ml-1">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3 bg-white border border-[#E5E2DA] px-4 py-2.5 rounded-lg shadow-sm w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#72706F]" />
            <span className="text-[10px] tracking-[0.15em] text-[#72706F] uppercase font-bold">Fulfillment:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-[#13110F] bg-transparent focus:outline-none pr-4 cursor-pointer"
          >
            <option value="all">ALL STATUSES</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Order Table Container */}
      <div className="bg-white border border-[#E5E2DA] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                {["Order ID", "Customer Details", "Items Count", "Order Total", "Payment Status", "Fulfillment", "Creation Date", "Details"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-[#72706F]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[9px] tracking-wider uppercase font-semibold">Updating Invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-[#72706F] text-xs font-semibold uppercase tracking-wider">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-[#FAF9F6]/45 transition-colors group">
                    <td className="px-6 py-4 font-mono text-[10px] text-[#C5A880] font-bold">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-[#13110F] group-hover:text-[#C5A880] transition-colors">
                        {o.user?.fullName || o.shippingAddress?.name || "Guest Checkout"}
                      </p>
                      <p className="text-[9px] text-[#9B9694] mt-0.5">{o.user?.email || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#13110F] font-medium">
                      {o.items?.length} item{o.items?.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#13110F]">
                      ${o.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded border uppercase ${paymentColor[o.paymentStatus] || "text-gray-500 bg-gray-50 border-gray-200"}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded border uppercase ${statusColor[o.orderStatus] || "text-gray-500 bg-gray-50 border-gray-200"}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#72706F] text-[10px] font-semibold whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#13110F] border border-[#E5E2DA] px-3 py-1.5 hover:bg-[#13110F] hover:text-white hover:border-[#13110F] transition-all rounded-md shadow-sm uppercase"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Panel */}
        {pages > 1 && !loading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E2DA] bg-[#FAF9F6]/20">
            <p className="text-[10px] tracking-[0.05em] text-[#72706F] font-bold uppercase">Showing page {currentPage} of {pages}</p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchOrders(currentPage - 1)}
                className="p-2 border border-[#E5E2DA] hover:bg-[#F4F1EC] disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === pages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="p-2 border border-[#E5E2DA] hover:bg-[#F4F1EC] disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-lg shadow-2xl border border-[#C5A880]/20 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E2DA] bg-[#FAF9F6]">
              <div>
                <h3 className="font-cormorant text-2xl font-semibold text-[#13110F] tracking-wide">
                  Order Details
                </h3>
                <p className="font-mono text-[10px] text-[#C5A880] font-bold mt-0.5 uppercase">
                  INVOICE #{selectedOrder._id.toUpperCase()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-1.5 text-[#72706F] hover:text-[#13110F] hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Shipping Details */}
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#72706F] font-bold mb-3">Shipping & Contact Info</p>
                <div className="bg-[#FAF9F6] border border-[#E5E2DA] p-5 rounded-lg text-xs text-[#2C2A29] space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[#72706F] font-bold uppercase tracking-wider">Recipient:</span>
                    <span className="col-span-2 font-semibold text-[#13110F]">{selectedOrder.shippingAddress?.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[#72706F] font-bold uppercase tracking-wider">Phone number:</span>
                    <span className="col-span-2 font-mono font-bold">{selectedOrder.shippingAddress?.phone}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[#72706F] font-bold uppercase tracking-wider">Street Address:</span>
                    <span className="col-span-2 font-medium">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[#72706F] font-bold uppercase tracking-wider">Location:</span>
                    <span className="col-span-2 font-medium">{selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country?.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#72706F] font-bold mb-3">Ordered items list</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center border border-[#E5E2DA] p-4 rounded-lg bg-white hover:border-[#C5A880]/30 transition-colors">
                      {item.product?.image ? (
                        <img src={item.product.image} alt="" className="w-14 h-14 object-cover bg-[#F4F1EC] rounded-sm border border-[#E5E2DA]" />
                      ) : (
                        <div className="w-14 h-14 bg-[#FAF9F6] border border-[#E5E2DA] flex items-center justify-center text-[10px] text-[#9B9694] uppercase tracking-wider font-semibold">No Image</div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-xs text-[#13110F]">{item.product?.title || "Boutique Item"}</p>
                        <div className="flex gap-4 mt-1.5 text-[10px] text-[#72706F] font-semibold">
                          <span>QTY: <strong className="text-[#13110F] font-bold">{item.quantity}</strong></span>
                          <span>SIZE: <strong className="text-[#13110F] font-bold">{item.size}</strong></span>
                          <span>PRICE: <strong className="text-[#13110F] font-bold">${item.price}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation breakdown */}
              <div className="border-t border-[#E5E2DA] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#72706F] font-semibold uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                {selectedOrder.discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold uppercase tracking-wider">
                    <span>Discount code applied</span>
                    <span>-${selectedOrder.discountApplied?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#72706F] font-semibold uppercase tracking-wider">
                  <span>Shipping Fee</span>
                  <span>${selectedOrder.shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#13110F] text-sm border-t border-[#E5E2DA]/50 pt-2 uppercase tracking-wider">
                  <span>Grand Total</span>
                  <span className="text-base text-[#C5A880]">${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E5E2DA] pt-5">
                <div>
                  <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block mb-2">Modify Fulfillment Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, "orderStatus", e.target.value)}
                    disabled={updating}
                    className="w-full border border-[#E5E2DA] text-xs font-semibold text-[#13110F] bg-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C5A880] transition-colors cursor-pointer"
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block mb-2">Modify Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, "paymentStatus", e.target.value)}
                    disabled={updating}
                    className="w-full border border-[#E5E2DA] text-xs font-semibold text-[#13110F] bg-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C5A880] transition-colors cursor-pointer"
                  >
                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
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

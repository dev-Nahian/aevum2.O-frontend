import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Star, Check, X, ShieldAlert, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    adminAPI.getReviews()
      .then((d) => setReviews(d.reviews || []))
      .catch(() => toast.error("Failed to load customer reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await adminAPI.updateReviewStatus(id, status);
      toast.success(res.message || `Review is now ${status}`);
      // Update local state
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.response?.data?.message || "Failed to update review status");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Customer Reviews</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Moderate product reviews submitted by clients. Approved reviews will display on the boutique catalog.
          </p>
        </div>
        <div className="px-4 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg">
          <span className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold block">TOTAL REVIEWS</span>
          <span className="text-sm font-bold text-[#13110F]">{reviews.length} Submissions</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#E5E2DA] rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] tracking-wider uppercase font-semibold text-[#72706F]">Syncing reviews...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                  {["Product", "Customer", "Rating & Comment", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-[#FAF9F6]/45 transition-colors group">
                    {/* Product */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {r.product?.image ? (
                          <img
                            src={r.product.image}
                            alt={r.product.title}
                            className="w-10 h-14 object-cover bg-[#F2EFE8] rounded border border-[#E5E2DA] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-[#F2EFE8] flex items-center justify-center text-[#72706F]/50 rounded border border-[#E5E2DA]">
                            <Sparkles size={14} />
                          </div>
                        )}
                        <div className="max-w-[150px] overflow-hidden text-ellipsis">
                          <span className="text-xs font-semibold text-[#13110F] block truncate">{r.product?.title || "Deleted Product"}</span>
                          <span className="text-[9px] text-[#72706F] block tracking-wide uppercase font-mono">ID: {r.product?.id || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-xs font-semibold text-[#13110F] block">{r.name}</span>
                        <span className="text-[10px] text-[#72706F] block font-mono">{r.user?.email || "No email"}</span>
                      </div>
                    </td>

                    {/* Rating & Comment */}
                    <td className="px-6 py-4">
                      <div className="max-w-[300px]">
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={12}
                              className={
                                idx < r.rating
                                  ? "fill-[#D4AF37] text-[#D4AF37]"
                                  : "text-[#E5E2DA]"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-xs text-[#72706F] leading-relaxed line-clamp-2 hover:line-clamp-none transition-all duration-200">
                          {r.comment}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full border uppercase ${
                        r.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                          : r.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200/50"
                            : "bg-amber-50 text-amber-700 border-amber-200/50"
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-[#72706F] text-[10px] font-semibold">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {r.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, "approved")}
                            className="flex items-center justify-center p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 rounded-lg transition-all cursor-pointer"
                            title="Approve Review"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, "rejected")}
                            className="flex items-center justify-center p-2 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all cursor-pointer"
                            title="Reject Review"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!reviews.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-[#72706F] text-xs font-semibold uppercase tracking-wider">
                      No customer reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Shield, ShieldAlert, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then((d) => setUsers(d.users))
      .catch(() => toast.error("Failed to load customer profiles"))
      .finally(() => setLoading(false));
  }, []);

  const handleMakeAdmin = async (id, name) => {
    if (!window.confirm(`Are you absolutely sure you want to grant full administrative and database access privileges to "${name}"?`)) return;
    try {
      await adminAPI.makeAdmin(id);
      toast.success(`${name} is now promoted to Admin status`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed to update user security privileges");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Gestion des Clients</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Review registered boutique accounts, verify authentication statuses, and delegate system administrative rights.
          </p>
        </div>
        <div className="px-4 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg">
          <span className="text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold block">REGISTERED USERS</span>
          <span className="text-sm font-bold text-[#13110F]">{users.length} Customers</span>
        </div>
      </div>

      {/* Table Panel Container */}
      <div className="bg-white border border-[#E5E2DA] rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            <span className="text-[9px] tracking-wider uppercase font-semibold text-[#72706F]">Syncing accounts...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                  {["Name / Avatar", "Email Address", "Mobile Number", "Security Status", "Created Date", "Privilege Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF9F6]/45 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#13110F] to-[#2C2A29] text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm">
                          {u.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-xs font-semibold text-[#13110F] group-hover:text-[#C5A880] transition-colors">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[#72706F]">{u.email}</td>
                    <td className="px-6 py-4 font-mono text-xs text-[#72706F]">{u.mobileNumber || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full border uppercase ${u.isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : "bg-amber-50 text-amber-700 border-amber-200/50"}`}>
                        {u.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#72706F] text-[10px] font-semibold">
                      {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleMakeAdmin(u._id, u.fullName)}
                        className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-[#13110F] hover:text-[#C5A880] border border-[#E5E2DA] hover:border-[#C5A880] px-3.5 py-2 rounded-lg transition-all shadow-sm uppercase cursor-pointer"
                      >
                        <Shield size={12} />
                        <span>Promote to Admin</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-[#72706F] text-xs font-semibold uppercase tracking-wider">
                      No user accounts found.
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

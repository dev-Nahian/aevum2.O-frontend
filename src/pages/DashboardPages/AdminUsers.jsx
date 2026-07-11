import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Users, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then((d) => setUsers(d.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleMakeAdmin = async (id) => {
    if (!confirm("Grant admin privileges to this user?")) return;
    try {
      await adminAPI.makeAdmin(id);
      toast.success("User is now an admin");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-cormorant text-3xl font-medium text-[#13110F]">Customers</h2>
        <p className="text-sm text-[#72706F] mt-1">{users.length} registered customers</p>
      </div>

      <div className="bg-white border border-[#E5E2DA] rounded-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#13110F] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                  {["Name", "Email", "Mobile", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.15em] text-[#72706F] uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-[#F0EDE8] hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#13110F] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                          {u.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-[#13110F] font-medium">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#72706F]">{u.email}</td>
                    <td className="px-5 py-3 text-[#72706F]">{u.mobileNumber || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${u.isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {u.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#72706F] text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleMakeAdmin(u._id)}
                        className="flex items-center gap-1.5 text-[11px] border border-[#E5E2DA] px-3 py-1.5 text-[#13110F] hover:bg-[#13110F] hover:text-white transition-colors rounded-sm"
                      >
                        <Shield size={11} /> Make Admin
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr><td colSpan={6} className="text-center py-12 text-[#72706F]">No customers yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

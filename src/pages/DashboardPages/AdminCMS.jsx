import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Plus, Pencil, Trash2, Save, X, Image, Type, Info } from "lucide-react";
import toast from "react-hot-toast";

const TYPE_OPTIONS = ["text", "image", "richtext", "json"];

const DEFAULT_CMS_KEYS = [
  { key: "hero_title", label: "Hero Section Title", type: "text" },
  { key: "hero_subtitle", label: "Hero Section Subtitle", type: "text" },
  { key: "hero_image", label: "Hero Background Image URL", type: "image" },
  { key: "fragrance_title", label: "Fragrance Section Title", type: "text" },
  { key: "fragrance_subtitle", label: "Fragrance Section Subtitle", type: "text" },
  { key: "fragrance_image", label: "Fragrance Section Image URL", type: "image" },
  { key: "showcase_title", label: "Showcase Banner Title", type: "text" },
  { key: "showcase_subtitle", label: "Showcase Banner Subtitle", type: "text" },
  { key: "announcement_bar", label: "Announcement Bar Text", type: "text" },
  { key: "about_text", label: "About Page Main Text", type: "richtext" },
];

export default function AdminCMS() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ key: "", value: "", label: "", type: "text" });

  const fetchEntries = () => {
    setLoading(true);
    adminAPI.getCMS()
      .then((d) => setEntries(d.entries))
      .catch(() => toast.error("Failed to load CMS content slots"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const startEdit = (entry) => { setEditingKey(entry.key); setEditValue(entry.value); };
  const cancelEdit = () => { setEditingKey(null); setEditValue(""); };

  const saveEdit = async (entry) => {
    setSaving(true);
    try {
      await adminAPI.upsertCMS(entry.key, { value: editValue, label: entry.label, type: entry.type });
      toast.success(`"${entry.label || entry.key}" content slot updated`);
      setEditingKey(null);
      fetchEntries();
    } catch { 
      toast.error("Save operation failed"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Are you sure you want to permanently delete the content slot: "${key}"?`)) return;
    try {
      await adminAPI.deleteCMS(key);
      toast.success("Content slot deleted");
      fetchEntries();
    } catch { 
      toast.error("Deletion failed"); 
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.upsertCMS(newEntry.key, { value: newEntry.value, label: newEntry.label, type: newEntry.type });
      toast.success("New content slot registered");
      setShowNewModal(false);
      setNewEntry({ key: "", value: "", label: "", type: "text" });
      fetchEntries();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create new slot");
    } finally { 
      setSaving(false); 
    }
  };

  const existingKeys = new Set(entries.map((e) => e.key));
  const missingDefaults = DEFAULT_CMS_KEYS.filter((d) => !existingKeys.has(d.key));

  const seedDefault = async (def) => {
    try {
      await adminAPI.upsertCMS(def.key, { value: "", label: def.label, type: def.type });
      toast.success(`Content slot "${def.label}" added`);
      fetchEntries();
    } catch {
      toast.error("Failed to add slot");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Gestion du CMS Content</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Modify landing pages banners, brand histories, announcement bars, and home editorial headers.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[#13110F] hover:bg-[#C5A880] text-white text-[10px] tracking-[0.2em] font-bold uppercase px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Content Slot</span>
        </button>
      </div>

      {/* Suggested Slots Alert */}
      {missingDefaults.length > 0 && (
        <div className="bg-[#FAF7F2] border border-[#C5A880]/30 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#8B7D6B]">
            <Info size={16} />
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold">Default Brand Slots Available:</p>
          </div>
          <p className="text-xs text-[#72706F] mb-4 leading-relaxed">
            The following system landing page variables have not been initialized. Click to automatically add them into your catalogue dashboard panel.
          </p>
          <div className="flex flex-wrap gap-2">
            {missingDefaults.map((d) => (
              <button
                key={d.key}
                onClick={() => seedDefault(d)}
                className="text-[9px] font-bold tracking-wider uppercase bg-white border border-[#E5E2DA] hover:border-[#C5A880] text-[#13110F] hover:text-[#C5A880] px-3.5 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                + {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Entries List grid */}
      {loading ? (
        <div className="bg-white border border-[#E5E2DA] p-20 rounded-lg flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <span className="text-[9px] tracking-wider uppercase font-semibold text-[#72706F]">Loading CMS catalog...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-[#72706F] text-xs font-semibold uppercase tracking-wider bg-white border border-[#E5E2DA] rounded-lg">
          No content slots registered yet. Seed using the panel above.
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div 
              key={entry.key} 
              className={`bg-white border rounded-lg p-6 shadow-sm transition-all duration-300 ${
                editingKey === entry.key ? "border-[#C5A880] shadow-md" : "border-[#E5E2DA] hover:border-[#C5A880]/40"
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#FAF9F6] border border-[#E5E2DA] flex items-center justify-center text-[#8B7D6B]">
                      {entry.type === "image" ? <Image size={11} /> : <Type size={11} />}
                    </div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#13110F] font-bold">
                      {entry.label || entry.key}
                    </span>
                    <span className="text-[8px] tracking-wider font-bold bg-[#FAF9F6] border border-[#E5E2DA] text-[#9B9694] px-2 py-0.5 rounded uppercase">
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-[9px] text-[#9B9694] mt-1.5 font-mono font-medium">System KEY: {entry.key}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-1.5 shrink-0">
                  {editingKey === entry.key ? (
                    <>
                      <button 
                        onClick={() => saveEdit(entry)} 
                        disabled={saving} 
                        className="p-2 bg-[#13110F] hover:bg-[#C5A880] text-white rounded-lg transition-colors cursor-pointer"
                        title="Save Changes"
                      >
                        <Save size={12} />
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="p-2 border border-[#E5E2DA] text-[#72706F] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => startEdit(entry)} 
                        className="p-2 border border-[#E5E2DA] text-[#13110F] hover:bg-[#13110F] hover:text-white hover:border-[#13110F] rounded-lg transition-colors cursor-pointer"
                        title="Edit Slot"
                      >
                        <Pencil size={12} />
                      </button>
                      <button 
                        onClick={() => handleDelete(entry.key)} 
                        className="p-2 border border-[#E5E2DA] text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Slot"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Slot Editor Body */}
              {editingKey === entry.key ? (
                <div className="space-y-3">
                  {entry.type === "richtext" ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={6}
                      className="w-full border border-[#E5E2DA] focus:border-[#C5A880] text-xs font-medium text-[#13110F] p-4 rounded-lg resize-none focus:outline-none bg-white transition-colors"
                      placeholder="Enter rich paragraph text..."
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-[#E5E2DA] focus:border-[#C5A880] text-xs font-medium text-[#13110F] px-4 py-2.5 rounded-lg focus:outline-none bg-white transition-colors"
                      placeholder="Enter text value..."
                    />
                  )}
                  {entry.type === "image" && editValue && (
                    <div className="mt-2 p-2 border border-[#E5E2DA] rounded-lg bg-[#FAF9F6]/50 inline-block">
                      <img src={editValue} alt="preview" className="h-20 w-auto object-cover rounded border border-[#E5E2DA]" onError={(e) => e.target.style.display = "none"} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FAF9F6] border border-[#E5E2DA]/65 p-4 rounded-lg">
                  {entry.type === "image" ? (
                    <div className="flex gap-4 items-center">
                      {entry.value ? (
                        <img src={entry.value} alt={entry.key} className="h-16 w-16 object-cover border border-[#E5E2DA] rounded-md bg-white shadow-sm" onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }} />
                      ) : (
                        <div className="h-16 w-16 bg-[#FAF9F6] border border-[#E5E2DA] rounded-md flex items-center justify-center text-[10px] text-[#9B9694] font-bold">No Image</div>
                      )}
                      <p className="text-xs text-[#72706F] font-mono truncate max-w-lg">{entry.value || <em className="text-[#9B9694] font-sans font-normal">Content value not configured</em>}</p>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-[#2C2A29] leading-relaxed whitespace-pre-wrap">
                      {entry.value || <em className="text-[#9B9694] font-normal">Content value not configured</em>}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New CMS Variable Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-[#C5A880]/15 animate-scale-up">
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E2DA] bg-[#FAF9F6]">
              <h3 className="font-cormorant text-2xl font-semibold text-[#13110F] tracking-wide">New Content Variable</h3>
              <button 
                onClick={() => setShowNewModal(false)} 
                className="p-1.5 text-[#72706F] hover:text-[#13110F] hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddNew} className="p-8 space-y-5">
              <div>
                <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block mb-1.5">Slot Unique Key (lowercase, underscores) *</label>
                <input 
                  required 
                  value={newEntry.key} 
                  onChange={(e) => setNewEntry((p) => ({ ...p, key: e.target.value.toLowerCase().replace(/\s+/g, "_") }))} 
                  placeholder="e.g. promo_banner_text" 
                  className="w-full border border-[#E5E2DA] text-xs font-mono font-semibold text-[#13110F] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#C5A880] bg-white transition-colors" 
                />
              </div>
              <div>
                <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block mb-1.5">Friendly Header/Label</label>
                <input 
                  value={newEntry.label} 
                  onChange={(e) => setNewEntry((p) => ({ ...p, label: e.target.value }))} 
                  placeholder="e.g. Promo Announcement text banner" 
                  className="w-full border border-[#E5E2DA] text-xs font-semibold text-[#13110F] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#C5A880] bg-white transition-colors" 
                />
              </div>
              <div>
                <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block mb-1.5">Field Type</label>
                <select 
                  value={newEntry.type} 
                  onChange={(e) => setNewEntry((p) => ({ ...p, type: e.target.value }))} 
                  className="w-full border border-[#E5E2DA] text-xs font-bold text-[#13110F] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#C5A880] bg-white transition-colors cursor-pointer"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block mb-1.5">Initial Value</label>
                {newEntry.type === "richtext" ? (
                  <textarea 
                    value={newEntry.value} 
                    onChange={(e) => setNewEntry((p) => ({ ...p, value: e.target.value }))} 
                    rows={4} 
                    className="w-full border border-[#E5E2DA] text-xs font-medium text-[#13110F] p-4 rounded-lg focus:outline-none focus:border-[#C5A880] bg-white resize-none transition-colors" 
                    placeholder="Enter block text..."
                  />
                ) : (
                  <input 
                    value={newEntry.value} 
                    onChange={(e) => setNewEntry((p) => ({ ...p, value: e.target.value }))} 
                    className="w-full border border-[#E5E2DA] text-xs font-semibold text-[#13110F] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#C5A880] bg-white transition-colors" 
                    placeholder="Enter inline value..."
                  />
                )}
              </div>
              <div className="flex gap-3 justify-end pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowNewModal(false)} 
                  className="px-5 py-2.5 border border-[#E5E2DA] text-xs font-bold tracking-wider uppercase text-[#72706F] hover:bg-[#F4F1EC] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-6 py-2.5 bg-[#13110F] hover:bg-[#C5A880] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {saving ? "Creating..." : "Register Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

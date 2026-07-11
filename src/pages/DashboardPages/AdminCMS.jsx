import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Plus, Pencil, Trash2, Save, X, Image, Type } from "lucide-react";
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
    adminAPI.getCMS().then((d) => setEntries(d.entries)).catch(() => toast.error("Failed to load CMS")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const startEdit = (entry) => { setEditingKey(entry.key); setEditValue(entry.value); };
  const cancelEdit = () => { setEditingKey(null); setEditValue(""); };

  const saveEdit = async (entry) => {
    setSaving(true);
    try {
      await adminAPI.upsertCMS(entry.key, { value: editValue, label: entry.label, type: entry.type });
      toast.success(`"${entry.label || entry.key}" updated`);
      setEditingKey(null);
      fetchEntries();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (key) => {
    if (!confirm(`Delete CMS entry "${key}"?`)) return;
    try {
      await adminAPI.deleteCMS(key);
      toast.success("Entry deleted");
      fetchEntries();
    } catch { toast.error("Delete failed"); }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.upsertCMS(newEntry.key, { value: newEntry.value, label: newEntry.label, type: newEntry.type });
      toast.success("CMS entry created");
      setShowNewModal(false);
      setNewEntry({ key: "", value: "", label: "", type: "text" });
      fetchEntries();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create entry");
    } finally { setSaving(false); }
  };

  // Pre-seed defaults that don't exist yet
  const existingKeys = new Set(entries.map((e) => e.key));
  const missingDefaults = DEFAULT_CMS_KEYS.filter((d) => !existingKeys.has(d.key));

  const seedDefault = async (def) => {
    await adminAPI.upsertCMS(def.key, { value: "", label: def.label, type: def.type });
    fetchEntries();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cormorant text-3xl font-medium text-[#13110F]">CMS Content</h2>
          <p className="text-sm text-[#72706F] mt-1">Manage page text, images, and banners</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[#13110F] text-white text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[#2C2A29] transition-colors"
        >
          <Plus size={14} /> New Entry
        </button>
      </div>

      {/* Suggested Defaults */}
      {missingDefaults.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
          <p className="text-[11px] tracking-[0.15em] uppercase text-amber-700 font-semibold mb-3">Suggested Content Slots (not yet created)</p>
          <div className="flex flex-wrap gap-2">
            {missingDefaults.map((d) => (
              <button
                key={d.key}
                onClick={() => seedDefault(d)}
                className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 hover:bg-amber-200 transition-colors"
              >
                + {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#13110F] border-t-transparent rounded-full animate-spin" /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-[#72706F] text-sm bg-white border border-[#E5E2DA]">
          No CMS entries yet. Create one or add from the suggested slots above.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.key} className="bg-white border border-[#E5E2DA] rounded-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {entry.type === "image" ? <Image size={12} className="text-[#72706F]" /> : <Type size={12} className="text-[#72706F]" />}
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold">{entry.label || entry.key}</span>
                    <span className="text-[9px] bg-[#F4F1EC] text-[#9B9694] px-1.5 py-0.5 rounded">{entry.type}</span>
                  </div>
                  <p className="text-[10px] text-[#9B9694] mt-0.5 font-mono">key: {entry.key}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {editingKey === entry.key ? (
                    <>
                      <button onClick={() => saveEdit(entry)} disabled={saving} className="p-1.5 bg-[#13110F] text-white hover:bg-[#2C2A29] rounded-sm"><Save size={12} /></button>
                      <button onClick={cancelEdit} className="p-1.5 border border-[#E5E2DA] text-[#72706F] hover:bg-[#F4F1EC] rounded-sm"><X size={12} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(entry)} className="p-1.5 border border-[#E5E2DA] text-[#13110F] hover:bg-[#13110F] hover:text-white rounded-sm transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => handleDelete(entry.key)} className="p-1.5 border border-[#E5E2DA] text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-sm transition-colors"><Trash2 size={12} /></button>
                    </>
                  )}
                </div>
              </div>

              {editingKey === entry.key ? (
                <div>
                  {entry.type === "richtext" ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={5}
                      className="w-full border border-[#E5E2DA] focus:border-[#13110F] text-sm text-[#13110F] px-3 py-2 resize-none focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-[#E5E2DA] focus:border-[#13110F] text-sm text-[#13110F] px-3 py-2 focus:outline-none"
                    />
                  )}
                  {entry.type === "image" && editValue && (
                    <img src={editValue} alt="preview" className="mt-2 h-24 w-auto object-cover border border-[#E5E2DA]" onError={(e) => e.target.style.display = "none"} />
                  )}
                </div>
              ) : (
                <div>
                  {entry.type === "image" ? (
                    <div className="flex items-center gap-3">
                      {entry.value ? (
                        <img src={entry.value} alt={entry.key} className="h-16 w-auto object-cover border border-[#E5E2DA]" onError={(e) => e.target.style.display = "none"} />
                      ) : null}
                      <p className="text-sm text-[#72706F] truncate max-w-xs">{entry.value || <em className="text-[#9B9694]">No value set</em>}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-[#13110F] line-clamp-2">{entry.value || <em className="text-[#9B9694]">No value set</em>}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Entry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DA]">
              <h3 className="font-semibold text-[#13110F]">New CMS Entry</h3>
              <button onClick={() => setShowNewModal(false)} className="text-[#72706F] hover:text-[#13110F]"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddNew} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1">Key (unique identifier) *</label>
                <input required value={newEntry.key} onChange={(e) => setNewEntry((p) => ({ ...p, key: e.target.value.toLowerCase().replace(/\s+/g, "_") }))} placeholder="e.g. hero_title" className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F] font-mono" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1">Label</label>
                <input value={newEntry.label} onChange={(e) => setNewEntry((p) => ({ ...p, label: e.target.value }))} placeholder="Friendly label for this field" className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F]" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1">Type</label>
                <select value={newEntry.type} onChange={(e) => setNewEntry((p) => ({ ...p, type: e.target.value }))} className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F]">
                  {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1">Value</label>
                {newEntry.type === "richtext" ? (
                  <textarea value={newEntry.value} onChange={(e) => setNewEntry((p) => ({ ...p, value: e.target.value }))} rows={4} className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F] resize-none" />
                ) : (
                  <input value={newEntry.value} onChange={(e) => setNewEntry((p) => ({ ...p, value: e.target.value }))} className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F]" />
                )}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowNewModal(false)} className="px-5 py-2 border border-[#E5E2DA] text-sm text-[#72706F] hover:bg-[#F4F1EC]">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#13110F] text-white text-sm hover:bg-[#2C2A29] disabled:opacity-50">
                  {saving ? "Creating..." : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

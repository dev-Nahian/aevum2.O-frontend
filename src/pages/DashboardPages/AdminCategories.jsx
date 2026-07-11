import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Plus, Edit2, Trash2, X, Tags, Folder } from "lucide-react";
import toast from "react-hot-toast";

// --- CUSTOM INPUT COMPONENTS ---
const InputField = ({ label, name, value, onChange, type = "text", required, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border border-[#E5E2DA] rounded-lg text-xs font-semibold text-[#13110F] px-4 py-2.5 focus:outline-none focus:border-[#C5A880] transition-colors"
    />
  </div>
);

const EMPTY_CATEGORY = {
  name: "",
  productType: "",
  subCategoriesInput: "",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    adminAPI.getCategories()
      .then((d) => setCategories(d.categories || []))
      .catch(() => toast.error("Failed to load business categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_CATEGORY);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      productType: c.productType,
      subCategoriesInput: c.subCategories ? c.subCategories.join(", ") : "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Auto-fill product type slug from name if not manually modified
      if (name === "name" && !f.productType) {
        next.productType = value.charAt(0).toUpperCase() + value.slice(1);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Process subcategories: split by commas, trim, filter out empty elements
    const subCategories = form.subCategoriesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name: form.name,
      productType: form.productType || form.name,
      subCategories,
    };

    try {
      if (editing) {
        await adminAPI.updateCategory(editing._id, payload);
        toast.success("Category updated successfully");
      } else {
        await adminAPI.createCategory(payload);
        toast.success("Category created successfully");
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${c.name}"? This could affect products under this category.`
      )
    ) {
      return;
    }

    try {
      await adminAPI.deleteCategory(c._id);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // Preview subcategories list live as user types
  const liveSubCategories = form.subCategoriesInput
    ? form.subCategoriesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Business Categories</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Manage department classifications, dynamic product catalogs, and associated subcategory filters.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#13110F] hover:bg-[#C5A880] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <span className="text-[9px] tracking-wider uppercase font-semibold text-[#72706F]">Loading catalog taxonomy...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-[#E5E2DA] rounded-xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#FAF9F6]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#E5E2DA] flex items-center justify-center text-[#13110F] shrink-0">
                      <Folder size={18} />
                    </div>
                    <div>
                      <h4 className="font-cormorant text-xl font-bold text-[#13110F]">{c.name}</h4>
                      <p className="text-[10px] text-[#72706F] font-mono font-medium">Type: {c.productType}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full border bg-[#FAF9F6] border-[#E5E2DA] uppercase text-[#72706F]">
                    {c.subCategories?.length || 0} Sub
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-[9px] tracking-wider uppercase text-[#72706F] font-bold">Sub-Categories:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subCategories && c.subCategories.length > 0 ? (
                      c.subCategories.map((sub, i) => (
                        <span
                          key={i}
                          className="bg-[#FAF9F6] border border-[#E5E2DA] text-[10px] font-semibold text-[#2C2A29] px-2.5 py-1 rounded-md"
                        >
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#9B9694] italic font-medium">None defined</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#FAF9F6] pt-4 mt-6">
                <button
                  onClick={() => openEdit(c)}
                  className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#72706F] hover:text-[#C5A880] transition-colors uppercase cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-rose-600 hover:text-rose-800 transition-colors uppercase cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {!categories.length && (
            <div className="col-span-full bg-white border border-[#E5E2DA] rounded-lg p-16 text-center text-[#72706F] text-xs font-semibold uppercase tracking-wider">
              No custom departments or categories defined yet.
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-[#C5A880]/20 animate-scale-up overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E2DA] bg-[#FAF9F6]">
              <h3 className="font-cormorant text-2xl font-semibold text-[#13110F] tracking-wide">
                {editing ? "Edit Department" : "Add Custom Department"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-[#72706F] hover:text-[#13110F] hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-5">
                <InputField
                  label="Category Name (e.g. Men, Kids)"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Activewear"
                />

                <InputField
                  label="Product Type Slug (e.g. Perfumes, Kids)"
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Activewear"
                />

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block">
                    Sub-Categories (Comma Separated)
                  </label>
                  <textarea
                    name="subCategoriesInput"
                    value={form.subCategoriesInput}
                    onChange={handleChange}
                    rows="3"
                    placeholder="e.g. Joggers, Hoodies, Tees"
                    className="w-full border border-[#E5E2DA] rounded-lg text-xs font-semibold text-[#13110F] px-4 py-2.5 focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                  />
                </div>

                {/* Live tags preview */}
                {liveSubCategories.length > 0 && (
                  <div className="p-4 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg space-y-2">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#72706F] font-bold">
                      Tags Live Preview:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {liveSubCategories.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-[#E5E2DA] text-[9px] font-bold text-[#13110F] px-2.5 py-1 rounded-md shadow-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="flex gap-3 justify-end border-t border-[#E5E2DA] pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-[#E5E2DA] text-xs font-bold tracking-wider uppercase text-[#72706F] hover:bg-[#F4F1EC] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#13110F] hover:bg-[#C5A880] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {saving ? "Saving..." : editing ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_PRODUCT = {
  title: "", price: "", priceVal: "", category: "",
  productType: "Men", subCategory: "", availability: "In Stock",
  image: "", featured: false, bestSelling: false, newest: false,
};

const InputField = ({ label, name, value, onChange, type = "text", required }) => (
  <div>
    <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1">{label}{required && " *"}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F] bg-white"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-[10px] tracking-[0.2em] uppercase text-[#72706F] font-semibold block mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-[#E5E2DA] text-sm text-[#13110F] px-3 py-2 focus:outline-none focus:border-[#13110F] bg-white"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, obj = edit
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = () => {
    setLoading(true);
    adminAPI.getProducts().then((d) => setProducts(d.products)).catch(() => toast.error("Failed to load products")).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title, price: p.price, priceVal: p.priceVal, category: p.category,
      productType: p.productType, subCategory: p.subCategory,
      availability: p.availability, image: p.image,
      featured: p.featured, bestSelling: p.bestSelling, newest: p.newest,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, priceVal: parseFloat(form.priceVal) };
      if (editing) {
        await adminAPI.updateProduct(editing._id, payload);
        toast.success("Product updated");
      } else {
        await adminAPI.createProduct(payload);
        toast.success("Product created");
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteProduct(id);
      toast.success("Product deleted");
      setConfirmDelete(null);
      fetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cormorant text-3xl font-medium text-[#13110F]">Products</h2>
          <p className="text-sm text-[#72706F] mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#13110F] text-white text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[#2C2A29] transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-[#E5E2DA] px-3 py-2 max-w-xs">
        <Search size={13} className="text-[#72706F]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="text-sm text-[#13110F] bg-transparent focus:outline-none flex-1 placeholder-[#9B9694]"
        />
        {search && <button onClick={() => setSearch("")}><X size={12} className="text-[#9B9694]" /></button>}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#13110F] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white border border-[#E5E2DA] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                  {["Image", "Title", "Category", "Type", "Price", "Stock", "Flags", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] text-[#72706F] uppercase font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-[#F0EDE8] hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.title} className="w-12 h-12 object-cover bg-[#F4F1EC] border border-[#E5E2DA]" onError={(e) => { e.target.src = "https://via.placeholder.com/48"; }} />
                    </td>
                    <td className="px-4 py-3 text-[#13110F] font-medium max-w-[180px] truncate">{p.title}</td>
                    <td className="px-4 py-3 text-[#72706F] text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-[#72706F] text-xs">{p.productType}</td>
                    <td className="px-4 py-3 text-[#13110F] font-semibold">{p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.availability === "In Stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.availability}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-[#72706F] space-x-1">
                      {p.featured && <span className="bg-[#13110F] text-white px-1.5 py-0.5 rounded-full">Featured</span>}
                      {p.newest && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">New</span>}
                      {p.bestSelling && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Best</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 border border-[#E5E2DA] hover:bg-[#13110F] hover:text-white hover:border-[#13110F] transition-colors rounded-sm text-[#13110F]"><Pencil size={12} /></button>
                        <button onClick={() => setConfirmDelete(p)} className="p-1.5 border border-[#E5E2DA] hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors rounded-sm text-red-500"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="text-center py-12 text-[#72706F] text-sm">No products found.</div>}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DA]">
              <h3 className="font-semibold text-[#13110F]">{editing ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#72706F] hover:text-[#13110F]"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField label="Product Title" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <InputField label="Display Price (e.g. $290)" name="price" value={form.price} onChange={handleChange} required />
              <InputField label="Numeric Price" name="priceVal" value={form.priceVal} onChange={handleChange} type="number" required />
              <InputField label="Category (e.g. FRAGRANCE)" name="category" value={form.category} onChange={handleChange} required />
              <SelectField label="Product Type" name="productType" value={form.productType} onChange={handleChange} options={["Men", "Women", "Perfumes"]} />
              <InputField label="Sub-Category (e.g. Perfume, T-Shirt)" name="subCategory" value={form.subCategory} onChange={handleChange} required />
              <SelectField label="Availability" name="availability" value={form.availability} onChange={handleChange} options={["In Stock", "Out of Stock", "Limited"]} />
              <div className="sm:col-span-2">
                <InputField label="Image URL" name="image" value={form.image} onChange={handleChange} required />
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 w-auto object-cover border border-[#E5E2DA]" onError={(e) => e.target.style.display = "none"} />}
              </div>
              <div className="sm:col-span-2 flex gap-6">
                {[["featured", "Featured"], ["bestSelling", "Best Selling"], ["newest", "New Arrival"]].map(([name, label]) => (
                  <label key={name} className="flex items-center gap-2 text-sm text-[#13110F] cursor-pointer">
                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 accent-[#13110F]" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end border-t border-[#E5E2DA] pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 border border-[#E5E2DA] text-sm text-[#72706F] hover:bg-[#F4F1EC]">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#13110F] text-white text-sm hover:bg-[#2C2A29] disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl p-6 text-center">
            <Trash2 size={36} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold text-[#13110F] mb-1">Delete Product?</h3>
            <p className="text-sm text-[#72706F] mb-5">"{confirmDelete.title}" will be permanently removed.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 border border-[#E5E2DA] text-sm text-[#72706F] hover:bg-[#F4F1EC]">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete._id)} className="px-5 py-2 bg-red-600 text-white text-sm hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

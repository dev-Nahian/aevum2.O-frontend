import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/adminClient";
import { Plus, Pencil, Trash2, Search, X, Upload } from "lucide-react";
import toast from "react-hot-toast";



// Categories are now loaded dynamically from the backend
let SUBCATEGORIES_BY_CATEGORY = {
  Men: ["T-Shirts", "Drop Shoulder T-Shirts", "Formal Shirts", "Casual Shirts", "Panjabi"],
  Women: ["T-Shirts", "Kamij", "Western Wear", "Deshi Wear"],
  Fragrance: ["Perfumes"],
};

const EMPTY_PRODUCT = {
  title: "", price: "", priceVal: "", category: "Men",
  productType: "Men", subCategory: "T-Shirts", availability: "In Stock",
  image: "", description: "", featured: false, bestSelling: false, newest: false,
};

const InputField = ({ label, name, value, onChange, type = "text", required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block">{label}{required && " *"}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-[#E5E2DA] rounded-lg text-xs font-medium text-[#13110F] px-4 py-2.5 focus:outline-none focus:border-[#C5A880] bg-white transition-colors"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block">{label}{required && " *"}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={3}
      className="w-full border border-[#E5E2DA] rounded-lg text-xs font-medium text-[#13110F] px-4 py-2.5 focus:outline-none focus:border-[#C5A880] bg-white transition-colors resize-none"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] tracking-[0.2em] uppercase text-[#72706F] font-bold block">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-[#E5E2DA] rounded-lg text-xs font-semibold text-[#13110F] px-4 py-2.5 focus:outline-none focus:border-[#C5A880] bg-white transition-colors cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o.toUpperCase()}</option>
      ))}
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
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Dynamically build category configuration maps
  const subCategoriesMap = {};
  categories.forEach((c) => {
    subCategoriesMap[c.name] = c.subCategories || [];
  });

  // Fallbacks for default categories
  if (!subCategoriesMap["Men"]) {
    subCategoriesMap["Men"] = ["T-Shirts", "Drop Shoulder T-Shirts", "Formal Shirts", "Casual Shirts", "Panjabi"];
  }
  if (!subCategoriesMap["Women"]) {
    subCategoriesMap["Women"] = ["T-Shirts", "Kamij", "Western Wear", "Deshi Wear"];
  }
  if (!subCategoriesMap["Fragrance"]) {
    subCategoriesMap["Fragrance"] = ["Perfumes"];
  }

  // Dynamic support for Fragrance category mapped to Perfumes type
  const fragCat = categories.find(c => c.name.toLowerCase() === "fragrance" || c.name.toLowerCase() === "perfumes");
  if (fragCat) {
    subCategoriesMap["Fragrance"] = fragCat.subCategories || ["Perfumes"];
    subCategoriesMap["Perfumes"] = fragCat.subCategories || ["Perfumes"];
  }

  const categoryOptions = categories.length > 0 ? categories.map((c) => c.name) : ["Men", "Women", "Fragrance"];

  const normalizeSubCategory = (subCat, category) => {
    if (!subCat) {
      const catObj = categories.find(c => c.name === category);
      return catObj && catObj.subCategories && catObj.subCategories.length > 0 
        ? catObj.subCategories[0] 
        : (category === "Fragrance" || category === "Perfumes" ? "Perfumes" : "T-Shirts");
    }
    
    const allowed = subCategoriesMap[category] || [];
    const matched = allowed.find(a => a.toLowerCase() === subCat.trim().toLowerCase());
    if (matched) return matched;

    const normalized = subCat.trim().toLowerCase();
    if (normalized.includes("drop")) return "Drop Shoulder T-Shirts";
    if (normalized.includes("t-shirt")) return "T-Shirts";
    if (normalized.includes("formal")) return "Formal Shirts";
    if (normalized.includes("casual")) return "Casual Shirts";
    if (normalized.includes("panjabi")) return "Panjabi";
    if (normalized.includes("kamij")) return "Kamij";
    if (normalized.includes("western")) return "Western Wear";
    if (normalized.includes("deshi") || normalized.includes("saree") || normalized.includes("ethnic") || normalized.includes("dress")) return "Deshi Wear";
    if (normalized.includes("perfume") || normalized.includes("fragrance")) return "Perfumes";
    
    return allowed.length > 0 ? allowed[0] : subCat;
  };

  const fetch = () => {
    setLoading(true);
    adminAPI.getProducts()
      .then((d) => setProducts(d.products))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    adminAPI.getCategories()
      .then((d) => setCategories(d.categories || []))
      .catch((err) => console.error("Failed to load custom categories", err));
  };

  useEffect(() => { 
    fetch(); 
    fetchCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const data = await adminAPI.uploadImage(formData);
      const backendUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace("/api", "") 
        : "http://localhost:5005";
      const fullUrl = `${backendUrl}${data.url}`;
      setForm((f) => ({ ...f, image: fullUrl }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    let catVal = "Men";
    if (p.category) {
      const c = p.category.toLowerCase();
      if (c === "men") catVal = "Men";
      else if (c === "women") catVal = "Women";
      else if (c === "fragrance" || c === "perfumes") catVal = "Fragrance";
    }
    const subCatVal = normalizeSubCategory(p.subCategory, catVal);
    setForm({
      title: p.title, price: p.price, priceVal: p.priceVal, category: catVal,
      productType: p.productType || "Men", subCategory: subCatVal,
      availability: p.availability, image: p.image, description: p.description || "",
      featured: p.featured, bestSelling: p.bestSelling, newest: p.newest,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: type === "checkbox" ? checked : value };
      if (name === "category") {
        const catObj = categories.find((c) => c.name === value);
        if (catObj) {
          next.productType = catObj.productType || catObj.name;
          next.subCategory = catObj.subCategories && catObj.subCategories.length > 0 ? catObj.subCategories[0] : "";
        } else {
          // Fallback legacy categories
          if (value === "Men") {
            next.productType = "Men";
            next.subCategory = "T-Shirts";
          }
          if (value === "Women") {
            next.productType = "Women";
            next.subCategory = "T-Shirts";
          }
          if (value === "Fragrance" || value === "Perfumes") {
            next.productType = "Perfumes";
            next.subCategory = "Perfumes";
          }
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, priceVal: parseFloat(form.priceVal) };
      if (editing) {
        await adminAPI.updateProduct(editing._id, payload);
        toast.success("Product updated successfully");
      } else {
        await adminAPI.createProduct(payload);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteProduct(id);
      toast.success("Product deleted successfully");
      setConfirmDelete(null);
      fetch();
    } catch {
      toast.error("Deletion failed");
    }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DA] pb-6">
        <div>
          <h2 className="font-cormorant text-4xl font-light text-[#13110F] tracking-wide">Gestion du Catalogue</h2>
          <p className="text-xs text-[#72706F] mt-1 font-medium tracking-[0.05em]">
            Add new designs, adjust prices, assign sub-categories, and manage online inventory availability.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#13110F] hover:bg-[#C5A880] text-white text-[10px] tracking-[0.2em] font-bold uppercase px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative w-full md:w-80 flex items-center bg-white border border-[#E5E2DA] px-3.5 py-2.5 rounded-lg focus-within:border-[#C5A880]/60 transition-colors shadow-sm">
        <Search size={16} className="text-[#9B9694] mr-2 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by title or category..."
          className="w-full text-xs text-[#13110F] bg-transparent focus:outline-none placeholder-[#9B9694] font-medium"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-[#9B9694] hover:text-[#13110F]">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Product List Panel */}
      {loading ? (
        <div className="bg-white border border-[#E5E2DA] p-20 rounded-lg flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <span className="text-[9px] tracking-wider uppercase font-semibold text-[#72706F]">Syncing inventory...</span>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E2DA] rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E2DA]">
                  {["Image", "Product Title", "Category", "Target Gender", "Display Price", "Stock Level", "Tags", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[9px] tracking-[0.2em] text-[#72706F] uppercase font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-[#FAF9F6]/45 transition-colors group">
                    <td className="px-5 py-4">
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-12 h-14 object-cover bg-[#F4F1EC] rounded border border-[#E5E2DA] shadow-sm group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/48x56"; }} 
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-[#13110F] group-hover:text-[#C5A880] transition-colors max-w-[220px] truncate">{p.title}</p>
                      <p className="text-[9px] text-[#9B9694] font-medium tracking-wide mt-0.5">{p.subCategory}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#72706F]">{p.category}</td>
                    <td className="px-5 py-4 text-xs font-medium text-[#72706F]">{p.productType}</td>
                    <td className="px-5 py-4 text-xs font-bold text-[#13110F]">{p.price}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] font-bold tracking-[0.05em] px-2.5 py-1 rounded-full border uppercase ${p.availability === "In Stock" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : "bg-red-50 text-red-700 border-red-200/50"}`}>
                        {p.availability}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {p.featured && <span className="bg-[#13110F] text-white text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">Featured</span>}
                        {p.newest && <span className="bg-blue-50 text-blue-700 border border-blue-200/50 text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">New Arrival</span>}
                        {p.bestSelling && <span className="bg-amber-50 text-amber-700 border border-amber-200/50 text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">Best Seller</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEdit(p)} 
                          className="p-2 border border-[#E5E2DA] hover:bg-[#13110F] hover:text-white hover:border-[#13110F] transition-all rounded-lg text-[#13110F] cursor-pointer"
                        >
                          <Pencil size={12} />
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(p)} 
                          className="p-2 border border-[#E5E2DA] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all rounded-lg text-red-500 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="text-center py-16 text-[#72706F] text-xs font-semibold uppercase tracking-wider">No matching products found.</div>}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-lg shadow-2xl border border-[#C5A880]/20 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E2DA] bg-[#FAF9F6]">
              <h3 className="font-cormorant text-2xl font-semibold text-[#13110F] tracking-wide">
                {editing ? "Edit Catalogue Item" : "Create Catalogue Item"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <InputField label="Product Title" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <InputField label="Display Price (e.g. $290)" name="price" value={form.price} onChange={handleChange} required />
                <InputField label="Numeric Value Price" name="priceVal" value={form.priceVal} onChange={handleChange} type="number" required />
                <SelectField label="Category" name="category" value={form.category} onChange={handleChange} options={categoryOptions} />
                <SelectField label="Sub-Category" name="subCategory" value={form.subCategory} onChange={handleChange} options={subCategoriesMap[form.category] || []} />
                <SelectField label="Boutique Availability" name="availability" value={form.availability} onChange={handleChange} options={["In Stock", "Out of Stock", "Limited"]} />
                
                <div className="sm:col-span-2">
                  <TextAreaField label="Product Details / Description" name="description" value={form.description} onChange={handleChange} required />
                </div>

                {/* Image Section */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex flex-col gap-2">
                    <InputField label="Product Image" name="image" value={form.image} onChange={handleChange} required />
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#72706F] font-semibold uppercase tracking-wider">Or upload image:</span>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 border border-[#E5E2DA] hover:border-[#C5A880] text-[10px] font-bold text-[#13110F] hover:text-[#C5A880] tracking-wider uppercase rounded-lg transition-colors bg-white shadow-2xs">
                        <Upload size={12} />
                        <span>{uploading ? "Uploading..." : "Choose Image File"}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          disabled={uploading} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>


                  {form.image && (
                    <div className="flex gap-3 items-center border border-[#E5E2DA] p-3 rounded-lg bg-[#FAF9F6]/50">
                      <img src={form.image} alt="preview" className="h-16 w-14 object-cover border border-[#E5E2DA] rounded-sm bg-white" onError={(e) => e.target.style.display = "none"} />
                      <div>
                        <p className="text-[9px] tracking-wider uppercase text-[#72706F] font-bold">Image Live Preview</p>
                        <p className="text-[10px] text-[#9B9694] truncate max-w-md mt-0.5">{form.image}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkbox settings */}
                <div className="sm:col-span-2 border-t border-[#E5E2DA] pt-4 flex gap-6">
                  {[["featured", "Featured Item"], ["bestSelling", "Best Seller"], ["newest", "New Arrival"]].map(([name, label]) => (
                    <label key={name} className="flex items-center gap-2 text-xs font-semibold text-[#13110F] cursor-pointer">
                      <input 
                        type="checkbox" 
                        name={name} 
                        checked={form[name]} 
                        onChange={handleChange} 
                        className="w-4 h-4 accent-[#13110F] cursor-pointer rounded" 
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
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
                  {saving ? "Saving..." : editing ? "Update Catalogue" : "Create Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl p-6 text-center border border-[#C5A880]/15 animate-scale-up">
            <div className="w-12 h-12 bg-red-50 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4 border border-red-100">
              <Trash2 size={20} />
            </div>
            <h3 className="font-cormorant text-2xl font-semibold text-[#13110F] mb-1">Permanently Delete?</h3>
            <p className="text-xs text-[#72706F] mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#13110F]">"{confirmDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setConfirmDelete(null)} 
                className="px-5 py-2.5 border border-[#E5E2DA] text-xs font-bold tracking-wider uppercase text-[#72706F] hover:bg-[#F4F1EC] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(confirmDelete._id)} 
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-md transition-all cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

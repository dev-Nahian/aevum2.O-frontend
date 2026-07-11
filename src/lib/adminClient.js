import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5005/api";

const adminClient = axios.create({ baseURL: BASE });

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("aevum_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminAPI = {
  // Stats
  getStats: () => adminClient.get("/admin/stats").then((r) => r.data),

  // Orders
  getOrders: (params) => adminClient.get("/admin/orders", { params }).then((r) => r.data),
  getOrder: (id) => adminClient.get(`/admin/orders/${id}`).then((r) => r.data),
  updateOrder: (id, data) => adminClient.put(`/admin/orders/${id}`, data).then((r) => r.data),

  // Products
  getProducts: () => adminClient.get("/admin/products").then((r) => r.data),
  createProduct: (data) => adminClient.post("/admin/products", data).then((r) => r.data),
  updateProduct: (id, data) => adminClient.put(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id) => adminClient.delete(`/admin/products/${id}`).then((r) => r.data),

  // CMS
  getCMS: () => adminClient.get("/admin/cms").then((r) => r.data),
  upsertCMS: (key, data) => adminClient.put(`/admin/cms/${key}`, data).then((r) => r.data),
  deleteCMS: (key) => adminClient.delete(`/admin/cms/${key}`).then((r) => r.data),

  // Users
  getUsers: () => adminClient.get("/admin/users").then((r) => r.data),
  makeAdmin: (id) => adminClient.put(`/admin/users/${id}/make-admin`).then((r) => r.data),
};

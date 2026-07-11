import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject JWT Token if logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("aevum_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (fullName, email, mobileNumber, password, agreeTerms) => {
    const response = await apiClient.post("/auth/register", {
      fullName,
      email,
      mobileNumber,
      password,
      agreeTerms,
    });
    return response.data;
  },
  verifyOTP: async (email, code) => {
    const response = await apiClient.post("/auth/verify-otp", { email, code });
    return response.data;
  },
  resendOTP: async (email) => {
    const response = await apiClient.post("/auth/resend-otp", { email });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (email, password) => {
    const response = await apiClient.post("/auth/reset-password", { email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },
};

export const productAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  getRelated: async (id) => {
    const response = await apiClient.get(`/products/${id}/related`);
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
};

export const orderAPI = {
  create: async (orderData) => {
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  },
  getHistory: async () => {
    const response = await apiClient.get("/orders");
    return response.data;
  },
};

export const cartAPI = {
  get: async () => {
    const response = await apiClient.get("/cart");
    return response.data;
  },
  add: async (productId, quantity, size) => {
    const response = await apiClient.post("/cart", { productId, quantity, size });
    return response.data;
  },
  update: async (productId, quantity, size) => {
    const response = await apiClient.put("/cart", { productId, quantity, size });
    return response.data;
  },
  remove: async (productId, size) => {
    const response = await apiClient.delete("/cart", { data: { productId, size } });
    return response.data;
  },
  clear: async () => {
    const response = await apiClient.post("/cart/clear");
    return response.data;
  },
};

export default apiClient;

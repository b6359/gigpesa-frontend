import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://www.gigpesa.co.ke/api", // ✅ Set via .env
});

// Attach token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("gigpesa_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

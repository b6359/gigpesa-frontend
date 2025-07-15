import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL, // ✅ Set via .env
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

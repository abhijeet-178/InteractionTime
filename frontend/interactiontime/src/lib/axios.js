import axios from "axios";

// ✅ FIXED: Use Vite-specific env syntax
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001/api";

export const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true, // Required for cookies/sessions
});
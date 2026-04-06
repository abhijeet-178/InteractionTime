import axios from "axios";
const backendUrl=process.env.REACT_APP_BACKEND_URL || "http://localhost:5001/api";
export const axiosInstance=axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true,
})
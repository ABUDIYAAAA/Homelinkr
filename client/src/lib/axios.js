import axios from "axios";
const BASE_API = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

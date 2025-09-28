import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://rtbackend-6z7a.onrender.com/api" : "https://rtbackend-6z7a.onrender.com/api",
  withCredentials: true,
});

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"https://rtbackend-6z7a.onrender.com",
  // baseURL:"http://localhost:5001",
  withCredentials: true,
});

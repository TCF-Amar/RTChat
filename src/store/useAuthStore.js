import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =  import.meta.env.VITE_MODE === "development" ? "http://localhost:5001" : "https://rtbackend-6z7a.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check");

      // server should return the user object
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);

      // Expecting { token, user } or { data: { token, user } }
      const token = res.data?.token || res.data?.data?.token || null;
      const user = res.data?.user || res.data?.data || res.data || null;

      if (token) localStorage.setItem("token", token);
      set({ authUser: user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
      console.error("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      // Expecting { token, user } or { token, data: user }
      const token = res.data?.token || res.data?.data?.token || null;
      const user = res.data?.user || res.data?.data || res.data || null;

      if (token) localStorage.setItem("token", token);
      set({ authUser: user });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      console.error("Login error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      // clear token + auth user
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(message);
      console.error("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/api/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

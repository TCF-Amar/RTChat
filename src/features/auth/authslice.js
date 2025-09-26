import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Axios instance (optional) → baseURL set कर सकते हो
export const api = axios.create({
    baseURL: "/api/v1/auth",
    headers: { "Content-Type": "application/json" },
});

// Async Thunks
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (user, { dispatch, rejectWithValue }) => {
        try {
            // 1️⃣ Signup request → backend cookie set करेगा
            await api.post("/signup", user);

            // 2️⃣ Signup ke baad turant authCheck call
            const authResponse = await dispatch(authCheck()).unwrap(); // unwrap se fulfilled data milega
            return authResponse; // ye user data reducer me jayega
        } catch (error) {
            return rejectWithValue(error.response?.data || "Signup failed");
        }
    }
);


export const signinUser = createAsyncThunk(
    "auth/signinUser",
    async (user, { dispatch, rejectWithValue }) => {
        try {
            // 1️⃣ Signin request → backend cookie set karega
            await api.post("/signin", user);

            // 2️⃣ Signin ke turant baad authCheck call
            const authResponse = await dispatch(authCheck()).unwrap();
            return authResponse;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Signin failed");
        }
    }
);


export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Logout failed");
    }
});

export const authCheck = createAsyncThunk(
    "auth/authCheck",
    async (_, { rejectWithValue }) => {
        try {
            
            const response = await api.get("/protected"); // cookie automatically backend ko jayegi
            return response.data; // assume { user: {...} }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Auth check failed");
        }
    }
);

export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
    try {
        const response = await api.post("/signout");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Sign out failed");
    }
});

// Initial State
const initialState = {
    user: null,
    isSignin: false,
    loading: true,
    error: null,
};

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isSignin = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // signupUser
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.isSignin = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // signinUser
            .addCase(signinUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.isSignin = true;
            })
            .addCase(signinUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // logoutUser
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isSignin = false;
            })

            // authCheck

            .addCase(authCheck.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(authCheck.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.isSignin = true;
            })
            .addCase(authCheck.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isSignin = false;
            });
        

    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

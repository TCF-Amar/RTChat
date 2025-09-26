import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllContacts = createAsyncThunk("contact/getAllContacts", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/user/all`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch contacts");
    }
});



const initialState = {
    contacts: [],
    loading: false,
    error: null,
    unreadMessages: {}, // { userId: number }
}

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addUnreadMessage: (state, action) => {
            const { userId } = action.payload;
            state.unreadMessages[userId] = (state.unreadMessages[userId] || 0) + 1;
        },
        clearUnreadMessages: (state, action) => {
            const { userId } = action.payload;
            state.unreadMessages[userId] = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(getAllContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setLoading, setError, addUnreadMessage, clearUnreadMessages } = contactSlice.actions;
export default contactSlice.reducer;

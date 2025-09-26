import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch chat history with a user
export const getChats = createAsyncThunk(
  "chat/getChats",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/chat/${receiverId}`);
      if (response.data.statusCode === 200) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to fetch chats");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch chats");
    }
  }
);

// Send a new chat message
export const sendChat = createAsyncThunk(
  "chat/sendChat",
  async ({ receiverId, messageData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/chat/${receiverId}`, messageData);
      if (response.data.statusCode === 200) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to send chat");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send chat");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], // array of messages
    contactUser: null,
    loading: false,
    error: null,
    typingUsers: {}, // { userId: boolean }
    onlineUsers: [], // array of online user IDs
    messageStatuses: {}, // { messageId: { sent: boolean, delivered: boolean, read: boolean } }
  },
  reducers: {
    setContactUser: (state, action) => {
      state.contactUser = action.payload;
      state.messages = []; // reset messages on new contact
    },
    addMessage: (state, action) => {
      // Handle socket received message
      // action.payload is the chat object from the backend
      const exists = state.messages.some(msg => msg._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
        // Initialize message status
        state.messageStatuses[action.payload._id] = {
          sent: true,
          delivered: false,
          read: false
        };
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      if (state.messageStatuses[messageId]) {
        if (status === 'delivered') {
          state.messageStatuses[messageId].delivered = true;
        } else if (status === 'read') {
          state.messageStatuses[messageId].delivered = true;
          state.messageStatuses[messageId].read = true;
        }
      }
    },
    setTypingStatus: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingUsers[userId] = isTyping;
    },
    setOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      if (isOnline) {
        if (!state.onlineUsers.includes(userId)) {
          state.onlineUsers.push(userId);
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Chats
      .addCase(getChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Chat
      .addCase(sendChat.pending, (state) => {
        state.error = null;
      })
      .addCase(sendChat.fulfilled, (state, action) => {
        // Only add if not already in messages (avoid duplicates with socket)
        const exists = state.messages.some(msg => msg._id === action.payload._id);
        if (!exists) {
          state.messages.push(action.payload);
        }
        state.error = null;
      })
      .addCase(sendChat.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
    setContactUser, 
    addMessage, 
    setMessages, 
    setTypingStatus, 
    setOnlineStatus,
  setOnlineUsers
    ,updateMessageStatus
} = chatSlice.actions;
export default chatSlice.reducer;

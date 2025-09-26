import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    socket: null,
    onlineUsers: [],
    isTyping: {},
    isConnected: false,
    error: null
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
            state.isConnected = true;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setTypingStatus: (state, action) => {
            const { userId, isTyping } = action.payload;
            state.isTyping[userId] = isTyping;
        },
        setConnectionError: (state, action) => {
            state.error = action.payload;
            state.isConnected = false;
        },
        clearSocket: (state) => {
            state.socket = null;
            state.isConnected = false;
            state.onlineUsers = [];
            state.isTyping = {};
        }
    }
});

export const {
    setSocket,
    setOnlineUsers,
    setTypingStatus,
    setConnectionError,
    clearSocket
} = socketSlice.actions;

export default socketSlice.reducer;
import { io } from "socket.io-client";
import { store } from './store';
import { 
  addMessage, 
  setTypingStatus, 
  setOnlineStatus,
  setOnlineUsers,
  updateMessageStatus 
} from '../features/chats/chatSlice';

const URL = "http://localhost:5000";
let socket;

export const connectSocket = (userId) => {
    if (socket) return socket;

    socket = io(URL, {
        query: { userId },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    // Handle connection
    socket.on("connect", () => {
        console.log("✅ Connected to backend:", socket.id);
        store.dispatch(setOnlineStatus({ userId, isOnline: true }));
    });

    // Handle chat messages
    socket.on("chat", ({ chat, sender, receiver }) => {
        store.dispatch(addMessage(chat));
        // Acknowledge message receipt
        socket.emit("message_received", { messageId: chat._id, sender });
    });

    // Handle message status updates
    socket.on("message_delivered", ({ messageId }) => {
        store.dispatch(updateMessageStatus({ messageId, status: 'delivered' }));
    });

    socket.on("message_read", ({ messageId }) => {
        store.dispatch(updateMessageStatus({ messageId, status: 'read' }));
    });

    // Handle online users
    socket.on("getOnlineUsers", (onlineUsers) => {
        store.dispatch(setOnlineUsers(onlineUsers));
    });

    // Handle typing indicators
    socket.on("typing", ({ senderId }) => {
        store.dispatch(setTypingStatus({ userId: senderId, isTyping: true }));
    });

    socket.on("stopTyping", ({ senderId }) => {
        store.dispatch(setTypingStatus({ userId: senderId, isTyping: false }));
    });

    // Error handling
    socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        store.dispatch(setOnlineStatus({ userId, isOnline: false }));
    });

    socket.on("error", (errorMessage) => {
        console.error("Socket error:", errorMessage);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("❌ Disconnected from server");
        store.dispatch(setOnlineStatus({ userId, isOnline: false }));
    });

    return socket;
}; 

// Helper functions for emitting events
export const emitTyping = (receiverId) => {
    if (socket) {
        socket.emit("typing", { receiverId });
    }
};

export const emitStopTyping = (receiverId) => {
    if (socket) {
        socket.emit("stopTyping", { receiverId });
    }
};

export const sendMessage = (messageData) => {
    if (socket) {
        socket.emit("chat", messageData);
    }
};

export const getSocket = () => socket;

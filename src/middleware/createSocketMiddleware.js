import { io } from 'socket.io-client';
import {
    setSocket,
    setOnlineUsers,
    setTypingStatus,
    setConnectionError
} from '../features/socket/socketSlice.js';

const createSocketMiddleware = () => {
    return (store) => {
        let socket = null;

        return (next) => (action) => {
            const { dispatch } = store;

            if (action.type === 'socket/connect') {
                const { userId } = action.payload;

                socket = io('http://localhost:5000', {
                    withCredentials: true,
                    transports: ['websocket', 'polling'],
                    query: { userId }
                });

                socket.on('connect', () => {
                    dispatch(setSocket(socket));
                });

                socket.on('getOnlineUsers', (users) => {
                    dispatch(setOnlineUsers(users));
                });

                socket.on('typing', ({ senderId }) => {
                    dispatch(setTypingStatus({ userId: senderId, isTyping: true }));
                });

                socket.on('stopTyping', ({ senderId }) => {
                    dispatch(setTypingStatus({ userId: senderId, isTyping: false }));
                });

                socket.on('connect_error', (error) => {
                    dispatch(setConnectionError(error.message));
                });
            }

            return next(action);
        };
    };
};

export default createSocketMiddleware;
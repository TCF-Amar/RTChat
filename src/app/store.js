import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authslice.js'
import chatReducer from '../features/chats/chatSlice.js'
import socketReducer from '../features/socket/socketSlice.js'
import contactsReducer from '../features/contact/contactSlice.js'
// import createSocketMiddleware from '../middleware/createSocketMiddleware.js'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        socket: socketReducer,
        contacts: contactsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
        // .concat(createSocketMiddleware())
})
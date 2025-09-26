import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendChat, addMessage } from "../features/chats/chatSlice";
import { emitTyping, emitStopTyping, sendMessage } from "../app/socket";

function SendChat({ contactUser }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { socket, isConnected } = useSelector((state) => state.socket);
  const { typingUsers } = useSelector((state) => state.chat);

  const handleTyping = () => {
    if (contactUser?._id) {
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      console.log(message)

      // Emit typing start
      emitTyping(contactUser._id);

      // Set timeout to stop typing indicator after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(contactUser._id);
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected || !contactUser) return;

    const messageData = {
      message,
      messageType: "text",
      image: null,
      video: null
    };

    // Save to backend first to get the proper message object
    dispatch(sendChat({ 
      receiverId: contactUser._id,
      messageData
    })).unwrap()
      .then((savedMessage) => {
        // Send through socket after successful save
        sendMessage({
          chat: savedMessage,
          sender: user._id,
          receiver: contactUser._id
        });
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
      });

    // Clear typing indicator
    emitTyping(contactUser._id, false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        if (contactUser?._id) {
          emitTyping(contactUser._id, false);
        }
      }
    };
  }, [contactUser]);

  return (
    <div className="flex items-center gap-2 p-2 absolute bottom-0 w-full bg-gray-500">
      <div className="w-full relative">
        {/* {typingUsers[contactUser?._id] && (
          <div className="absolute -top-6 left-4 text-sm text-gray-400">
            {contactUser.email} is typing...
          </div>
        )} */}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type your message"
          className="w-full p-2 px-4 rounded-xl border border-white/20"
        />
      </div>
      <button
        onClick={handleSendMessage}
        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        disabled={!isConnected || !message.trim()}
      >
        <SendHorizontal />
      </button>
    </div>
  );
}

export default SendChat;

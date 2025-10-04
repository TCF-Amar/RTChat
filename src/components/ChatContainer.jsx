import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length]);

  // Guard against no selected user
  if (!selectedUser) {
    return null;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, idx) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            // Only add ref to the last message
            ref={idx === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="object-cover"
                />
              </div>
            </div>
           
            <div 
              className={`chat-bubble flex flex-col text-wrap relative ${
                message.senderId === authUser._id
                  ? "bg-primary text-primary-content" // Sender message
                  : "bg-base-200 text-base-content"  // Receiver message
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                  loading="lazy"
                />
              )}
              {message.text && <p className="text text-wrap break-words">{message.text}</p>}
              <div className={`chat-footer text-xs mt-1 ${
                message.senderId === authUser._id
                  ? "opacity-70"  // Sender timestamp
                  : "opacity-60"  // Receiver timestamp
              }`}>
                <time>
                  {formatMessageTime(message.createdAt)} • {" "}
                  <span>{new Date(message.createdAt).toLocaleDateString()}</span> • {" "}
                  <span>{new Date(message.createdAt).toLocaleString("en-US", { weekday: "long" })}</span>
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;

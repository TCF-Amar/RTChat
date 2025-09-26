import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { MessageCircleIcon, SendHorizontal } from "lucide-react";
import ChatContainerHeader from "./ChatContainerHeader";
import SendChat from "./SendChat";
import { addMessage, getChats, updateMessageStatus } from "../features/chats/chatSlice";
import { HiChevronDown } from "react-icons/hi";
import {MessageStatus} from "./MessageStatus";

function formatDateLabel(date) {
  const msgDate = new Date(date);
  const today = new Date();

  const isToday =
    msgDate.getDate() === today.getDate() &&
    msgDate.getMonth() === today.getMonth() &&
    msgDate.getFullYear() === today.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday =
    msgDate.getDate() === yesterday.getDate() &&
    msgDate.getMonth() === yesterday.getMonth() &&
    msgDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}


function ChatContainer() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { messages, contactUser,messageStatuses } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.socket);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (contactUser) {
      dispatch(getChats(contactUser._id));
    }
  }, [contactUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!socket || !contactUser) return;
  
    const handleIncomingChat = ({ chat, sender, receiver }) => {
      // only update if message is from/to current contact
      if (sender === contactUser._id || receiver === contactUser._id) {
        dispatch(addMessage(chat));
      }
    }
  
    socket.on("chat", handleIncomingChat);
  
    return () => socket.off("chat", handleIncomingChat);
  }, [socket, contactUser]);
  

  console.log(messages)
  return (
    <>
      {contactUser ? (
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`absolute md:top-[40px] top-0  right-0 bottom-0 left-0 md:left-[60px] md:static h-full w-full overflow-hidden bg-white/10 backdrop-blur-sm `}
        >
          <div
            className="absolute inset-0 bg-cover bg-center -z-10 "
            style={{
              backgroundImage: `url(${contactUser?.bgImg})`,
              opacity: 1,
            }}
          />
          <div className="absolute inset-0 -z-10" />

          <ChatContainerHeader contactUser={contactUser} />
          <div className="relative p-4 flex flex-col gap-2 overflow-y-auto h-[calc(90vh-120px)] scroll-smooth">
            {messages?.length > 0 ? (
              <>
                {messages.map((c, idx) => {
                  const currentDateLabel = formatDateLabel(c.createdAt);
                  const prevDateLabel =
                    idx > 0 ? formatDateLabel(messages[idx - 1].createdAt) : null;

                  const showDateLabel = currentDateLabel !== prevDateLabel;

                  return (
                    <div key={c._id}>
                      {showDateLabel && (
                        <div className="flex justify-center my-2">
                          <span className="  text-xs px-3 py-1 rounded-full">
                            {currentDateLabel}
                          </span>
                        </div>
                      )}

                      {c.sender !== user._id ? (
                        <div className="flex items-center gap-2 w-[80%] md:w-[60%] xl:w-[50%] self-end ">
                          <div className="bg-white/20 p-2 rounded w-fit pr-20 relative">
                            <p>{c.message}</p>
                            <div className="flex items-center gap-1.5 absolute bottom-1 right-1">
                              <p className="text-xs text-gray-400">
                                {new Date(c.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <MessageStatus status={messageStatuses[c._id]} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 ">
                          <div className="w-[80%] md:w-[60%] xl:w-[50%] flex justify-end">
                            <div className="bg-blue-500 text-white p-2 rounded w-fit pr-20 relative group">
                              <div className="absolute  top-1/2 left-[-2rem] -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <HiChevronDown
                                  size={24}
                                  className="cursor-pointer"
                                  onClick={() => console.log("clicked")}
                                />
                              </div>
                              <p>{c.message}</p>
                              <div className="flex items-center gap-1 absolute bottom-1 right-1">
                                <p className="text-xs text-gray-400">
                                  {new Date(c.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <MessageStatus status={messageStatuses[c._id]} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No messages yet</p>
              </div>
            )}

          </div>
          <SendChat contactUser={contactUser} />
        </motion.div>
      ) : (
        <div className="hidden  md:left-[60px]  w-full h-screen overflow-hidden overflow-y-auto bg-white/11 backdrop-blur-sm p-2  md:flex items-center justify-center flex-col gap-4  ">
          <MessageCircleIcon size={44} opacity={0.5} />
          <h2 className="text-xl font-semibold">No Contact Selected</h2>
          <p className="text-sm text-gray-500">
            Select a contact to start a conversation
          </p>
        </div>
      )}
    </>
  );
}

export default ChatContainer;

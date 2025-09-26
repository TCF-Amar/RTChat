import React from "react";
import { setContactUser } from "../features/chats/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaUser } from "react-icons/fa";


function ChatContainerHeader({contactUser}) {
  const dispatch = useDispatch();
  const { typingUsers } = useSelector((state) => state.chat);

    return (
       <div className="flex items-center gap-2 p-2 bg-white/10  ">
                  
                  <div
                    className="p-2 bg-white/10 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-110"
                    onClick={() => dispatch(setContactUser(null))}
                  >
                    <FaArrowLeft size={24} />{" "}
                  </div>
                  <div className="flex items-center p-2  gap-4">
                    {contactUser?.photoURL ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={contactUser?.photoURL}
                          alt={contactUser?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-xl" size={24} />
                      </div>
                    )}
                    <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{contactUser?.name}</h2>
            {
              typingUsers[contactUser?._id] ? (
              "Typing..."
              ): <p className = "text-sm text-gray-500">{contactUser?.email}</p>
            }
                    </div>
                  </div>
                </div>
    )
}

export default ChatContainerHeader
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setContactUser } from "../features/chats/chatSlice";
import { getAllContacts, addUnreadMessage, clearUnreadMessages } from "../features/contact/contactSlice";
import { setOnlineUsers } from "../features/socket/socketSlice";

function Contracts() {
  const dispatch = useDispatch();
  const { contacts, unreadMessages } = useSelector((state) => state.contacts);
  const { socket } = useSelector((state) => state.socket);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { contactUser } = useSelector((state) => state.chat);
  const [allContacts, setAllContacts] = useState([]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleIncomingChat = ({ chat, sender }) => {
      // Only add unread message if we're not currently chatting with this user
      if (sender !== contactUser?._id) {
        dispatch(addUnreadMessage({ userId: sender }));
      }
    };

    socket.on("chat", handleIncomingChat);

    return () => {
      socket.off("chat", handleIncomingChat);
    };
  }, [socket, contactUser, dispatch]);


  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);
  
  useEffect(() => {
    if (contacts?.data?.users) {
      setAllContacts(contacts.data.users);
    }
  }, [contacts]);
  

  useEffect(() => {
    if (!socket) return; // अगर socket नहीं है तो कुछ मत करो
  
    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users)); // अब redux में भी save कर सकते हो
      console.log("Online users:", users);
    };
  
    socket.on("getOnlineUsers", handleOnlineUsers);
  
    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers); // cleanup
    };
  }, [socket, dispatch]);
  

  const handleContactClick = (contact) => {
    dispatch(setContactUser(contact));
    // Clear unread messages when selecting the contact
    dispatch(clearUnreadMessages({ userId: contact._id }));
  };

  return (
    <div className=" border-r md:w-[500px] w-full lg:w-[500px] xl:w-[600px] transition-all duration-300 bg-white/10">
      <div className="flex flex-col gap-6 overflow-y-auto h-full p-6">
        {
        allContacts?.length >0  &&
        allContacts.map((contact) => (
          <div
            onClick={() => handleContactClick(contact)}
            key={contact?._id}
            className={`rounded p-2 hover:bg-white/10 cursor-pointer transition-all duration-300 
              ${unreadMessages[contact?._id] > 0 ? 'animate-glow bg-white/20 shadow-lg shadow-blue-500/50' : ''}`}
          >
            <div className="flex  items-center ">
              <div className="bg-blue-100 p-3 rounded-full mr-4 relative">
                <FaUser className="text-blue-600 text-xl" />
                {
                  onlineUsers?.includes(contact?._id) && (
                    <span className="absolute bg-green-500 text-white text-xs rounded-full px-2 py-2 top-0 right-0  duration-500"></span>
                  )
                }
              </div>
              <div>
                <h2 className="text-xl font-semibold">{contact?.name}</h2>
                <p className="text-xs text-gray-400">{contact?.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contracts;

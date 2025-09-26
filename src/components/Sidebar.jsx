import React, { use } from "react";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const {user} = useSelector((state) => state.auth);

  return (
    <div className="fixed top-0 left-0">
      {
        user && (
          <div className="px-4 py-2 flex ">
            <div className="border w-10 h-10 rounded-full"><img src={user.photoURL} alt="d" /></div>
            <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
          </div>
        )
      }
    </div>
  );
};

export default Sidebar;

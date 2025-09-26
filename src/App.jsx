import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { authCheck } from "./features/auth/authslice";
import { BlinkBlur } from "react-loading-indicators";
import Sidebar from "./components/Sidebar";
import Contracts from "./components/Contracts";
import ChatContainer from "./components/ChatContainer";
import { connectSocket } from "./app/socket";
import { setSocket } from "./features/socket/socketSlice";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
  

function App() {
  const dispatch = useDispatch();
  const { user, loading,isSignin } = useSelector((state) => state.auth);

  // Auth check on mount
  useEffect(() => {
    // dispatch(signOut())
    dispatch(authCheck());
    // dispatch(signinUser({email:"amarjeetmistri43@gmail.com",password:"amarjeet"}))

  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const socket = connectSocket(user._id);
      dispatch(setSocket(socket));

    }
  }, [user]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BlinkBlur color="#6f31cc" size="medium" text="" textColor="#6f31cc" />
      </div>
    );
  }
  if (!isSignin && !loading) {
    return (
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="h-full w-screen md:p-[60px_0px_0px_0px] p-[60px_0px_0px_0px] overflow-hidden transition-all duration-300 fixed">
      <Sidebar />
      <main className="flex h-full w-full overflow-hidden rounded-tl-lg">
        <Contracts />
        <ChatContainer />
      </main>
    </div>
  );
}

export default App;

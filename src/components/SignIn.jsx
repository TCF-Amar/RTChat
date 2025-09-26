import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authCheck, signinUser } from "../features/auth/authslice";
import { Link } from "react-router-dom";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password });
        dispatch(signinUser({ email, password }));
        dispatch(authCheck());
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Sign In
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;

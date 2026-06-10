import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import SocialLogins from "../components/SocialLogins";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.services";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [authMethod, setAuthMethod] = useState("email");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { getUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginUser({ email, password });
            setEmail("");
            setPassword("");
            getUser();
            navigate("/");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-2.5 xs:p-4 sm:p-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-slate-200 p-4 xs:p-6 sm:p-8 transition-all duration-300">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Login to your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                required
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                placeholder="Email or Phone"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700">Password</label>

                            <button
                                type="button"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none">
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 mt-6 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Sign In
                    </button>
                    <div>
                        <span className="text-red-500">{error}</span>
                    </div>
                </form>

                <SocialLogins />
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account?
                        <button
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none"
                            onClick={() => navigate("/register")}>
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

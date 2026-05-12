import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import React from "react";
import { useState } from "react";
import SocialLogins from "../components/SocialLogins";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { registerUser } from "../services/auth.services";

const Registration = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name) {
            setError("Name cannot be empty");
            return;
        }
        if (!email.includes("@")) {
            setError("Enter a valid Email");
            return;
        }
        // if (phoneNumber.length != 10) {
        //     setError("Enter a valid Phone number");
        //     return;
        // }

        if (password !== confirmPassword) {
            setError("Password doesn't match");
            return;
        }

        try {
            const res = await registerUser({ name, password, phoneNumber, email });
            console.log("registered successfully : ", res);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPhoneNumber("");
            navigate("/verify-email");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8 transition-all duration-300">
                <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create an account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">Create Password</label>

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
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 mt-6 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            Create Account
                        </button>
                        <div>
                            <span className="text-red-500">{error}</span>
                        </div>
                    </form>
                    <SocialLogins />
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?
                            <button
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none"
                                onClick={() => navigate("/login")}>
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;

import React, { useState } from "react";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { Route, Routes } from "react-router-dom";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/EmailVerification";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return (
        <>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
        </>
    );
}

import React from "react";
import ChatPage from "./pages/ChatPage";
import { Route, Routes, Navigate } from "react-router-dom";
import Registration from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/EmailVerification";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading your profile...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading your profile...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Registration />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/verify-email"
                element={
                    <PublicRoute>
                        <VerifyEmail />
                    </PublicRoute>
                }
            />
        </Routes>
    );
}

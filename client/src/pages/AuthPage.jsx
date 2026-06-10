import { Eye, EyeOff, Lock, Mail, Phone, X } from "lucide-react";
import { useState } from "react";
import Registration from "./Register";

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [authMethod, setAuthMethod] = useState("phone");
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0);

    const [fullName, setFullName] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleToggleLogin = () => {
        setIsLogin(!isLogin);
        setOtpStep(false);
        setOtp("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setForgotPasswordStep(0);
        setError("");
        setIdentifier("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8 transition-all duration-300">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                        {forgotPasswordStep === 1
                            ? "Reset your password"
                            : forgotPasswordStep === 2
                              ? "Create new password"
                              : otpStep
                                ? "Verify your account"
                                : isLogin
                                  ? "Sign in to your account"
                                  : "Create an account"}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {forgotPasswordStep === 1
                            ? "Enter your details to receive a reset code."
                            : forgotPasswordStep === 2
                              ? `We've sent a code to your ${authMethod === "phone" ? "phone" : "email"}.`
                              : otpStep
                                ? `We've sent a 6-digit code to your ${authMethod === "phone" ? "phone number" : "email address"}.`
                                : isLogin
                                  ? "Enter your details to access your account."
                                  : "Join the conversation today."}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2 animate-in fade-in">
                        <X className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {forgotPasswordStep > 0 ? (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
                        {forgotPasswordStep === 1 ? (
                            <>
                                <div className="flex p-1 mb-6 bg-slate-100 rounded-md border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthMethod("phone");
                                            setError("");
                                        }}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${authMethod === "phone" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                                        Phone
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthMethod("email");
                                            setError("");
                                        }}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${authMethod === "email" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                                        Email
                                    </button>
                                </div>
                                {authMethod === "phone" ? (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={identifier}
                                                onChange={(e) => {
                                                    setIdentifier(e.target.value);
                                                    setError("");
                                                }}
                                                className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={identifier}
                                                onChange={(e) => {
                                                    setIdentifier(e.target.value);
                                                    setError("");
                                                }}
                                                className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 px-4 mt-4 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                    Send Reset Code
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 text-center">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value.replace(/[^0-9]/g, ""));
                                            setError("");
                                        }}
                                        className={`block w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-white border ${error && otp !== "123456" ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"} rounded-md focus:ring-2 transition-colors outline-none text-slate-900 placeholder-slate-300`}
                                        placeholder="123456"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError("");
                                            }}
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
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setError("");
                                            }}
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
                                    disabled={otp.length !== 6 || !password}
                                    className="w-full flex justify-center py-2.5 px-4 mt-4 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                    Reset Password & Sign In
                                </button>
                            </>
                        )}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setForgotPasswordStep(0);
                                    setError("");
                                    setOtp("");
                                    setPassword("");
                                    setConfirmPassword("");
                                }}
                                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors focus:outline-none">
                                Back to sign in
                            </button>
                        </div>
                    </form>
                ) : otpStep ? (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 text-center">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value.replace(/[^0-9]/g, ""));
                                    setError("");
                                }}
                                className={`block w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-white border ${error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"} rounded-md focus:ring-2 transition-colors outline-none text-slate-900 placeholder-slate-300`}
                                placeholder="123456"
                                autoFocus
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={otp.length !== 6}
                            className="w-full flex justify-center py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            Verify & Continue
                        </button>
                        <div className="flex flex-col items-center gap-3 mt-4">
                            <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Resend code
                            </button>
                            <button
                                type="button"
                                onClick={() => setOtpStep(false)}
                                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                                Back to registration
                            </button>
                        </div>
                    </form>
                ) : (
                    <Registration />
                )}
            </div>
        </div>
    );
};

export default AuthPage;

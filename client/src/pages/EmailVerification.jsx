import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
    const [email] = useState("rahul@example.com"); // pass dynamically later
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSkip = () => {
        navigate("/");
    };

    const handleResend = async () => {
        try {
            setLoading(true);
            setMessage("");

            // Call your API here
            // await resendVerificationEmail(email);

            setMessage("Verification email sent again!");
        } catch (err) {
            setMessage("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 text-center">
                <div
                    className="flex gap-2 justify-end items-center text-sm text-gray-400 cursor-pointer hover:text-gray-600 transition"
                    onClick={handleSkip}>
                    Skip <ArrowRight />
                </div>
                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">Verify your email</h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4">We’ve sent a verification link to</p>

                {/* Email */}
                <p className="font-medium text-gray-800 mb-6">{email}</p>

                {/* Button */}
                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full bg-linear-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition">
                    {loading ? "Sending..." : "Resend Email"}
                </button>

                {/* Message */}
                {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-2 text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Change email */}
                <button className="text-sm text-indigo-600 hover:underline">Change email address</button>

                {/* Footer */}
                <p className="text-xs text-gray-400 mt-6">Didn’t receive the email? Check your spam folder.</p>
            </div>
        </div>
    );
}

export default VerifyEmail;

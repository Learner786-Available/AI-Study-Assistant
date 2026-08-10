import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {

        e.preventDefault();

        if (!code || code.length !== 6) {
            toast.error("Please enter the 6-digit verification code");
            return;
        }

        if (!email) {
            toast.error("Email not found. Please register again.");
            navigate("/register");
            return;
        }

        setLoading(true);

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        code
                    })
                }
            );

            const data = await res.json();
            if (data.success) {

                localStorage.setItem("token", data.token);

                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                toast.success("Email verified successfully!");

                navigate("/dashboard");

            } else {

                toast.error(
                    data.message || "Invalid verification code"
                );

            }

        } catch (err) {

            console.error(err);

            toast.error("Verification failed");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

            <form
                onSubmit={handleVerify}
                className="w-full max-w-md bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
            >

                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-3">
                    Verify Email
                </h1>

                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                    We sent a 6-digit verification code to
                </p>

                <p className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-2 break-all">
                    {email}
                </p>

                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
                    If the email address exists, a verification code has been sent to it.
                </p>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full text-center tracking-[0.5em] text-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white py-3 rounded-xl font-medium"
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="w-full mt-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
                >
                    Back to Register
                </button>

            </form>

        </div>

    );
}
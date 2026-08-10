import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function GooglePasswordPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const getPasswordStrength = () => {

        if (password.length < 6) {
            return "Weak";
        }

        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])/;

        if (regex.test(password)) {
            return "Strong";
        }

        return "Medium";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email) {

            toast.error(
                "Google email not found. Please try again."
            );

            navigate("/");

            return;
        }

        if (!password || !confirmPassword) {

            toast.error("Please fill all fields");

            return;
        }

        if (password !== confirmPassword) {

            toast.error("Passwords do not match");

            return;
        }

        setLoading(true);

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/google/set-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password,
                        confirmPassword
                    })
                }
            );

            const data = await res.json();

            if (data.success) {

                toast.success(
                    "Password saved. Verification code sent to your email."
                );

                navigate("/verify-email", {
                    state: {
                        email: data.email || email
                    }
                });

            } else {

                toast.error(
                    data.message ||
                    "Unable to save password"
                );

            }

        }

        catch (err) {

            console.error(
                "Google password error:",
                err
            );

            toast.error(
                "Something went wrong. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">

            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md transition-all"
            >

                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-gray-900 dark:text-white">

                    Create Password

                </h1>

                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">

                    Create a password for your Google account.

                </p>

                <p className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-6 break-all">

                    {email}

                </p>

                {/* Password */}

                <div className="relative mb-2">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }

                        placeholder="Password"

                        value={password}

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button
                        type="button"

                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition"
                    >

                        {showPassword
                            ? <FiEyeOff size={20} />
                            : <FiEye size={20} />
                        }

                    </button>

                </div>

                {password.length > 0 && (

                    <p
                        className={`text-sm mb-3 ${
                            getPasswordStrength() === "Strong"
                                ? "text-green-600"
                                : getPasswordStrength() === "Medium"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                        }`}
                    >

                        {getPasswordStrength()}

                    </p>

                )}

                {/* Confirm Password */}

                <div className="relative mb-5">

                    <input
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }

                        placeholder="Confirm Password"

                        value={confirmPassword}

                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }

                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button
                        type="button"

                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition"
                    >

                        {showConfirmPassword
                            ? <FiEyeOff size={20} />
                            : <FiEye size={20} />
                        }

                    </button>

                </div>

                <button
                    type="submit"

                    disabled={loading}

                    className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white py-3 rounded-xl disabled:opacity-60"
                >

                    {loading
                        ? "Saving Password..."
                        : "Continue"
                    }

                </button>

            </form>

        </div>

    );
}
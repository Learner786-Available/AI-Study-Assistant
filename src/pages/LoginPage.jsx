import { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/auth/login`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email,

                        password

                    })

                }

            );

            const data = await res.json();

            if (data.success) {

                login(

                    data.user,

                    data.token

                );

                navigate("/dashboard");

            }

            else {

                alert(data.message);

            }

        }

        catch (err) {

            alert("Login Failed");

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">

            <form

                onSubmit={handleLogin}

                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md transition-all"

            >

                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">

                    Login

                </h1>

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"

                />

                <div className="relative mb-4">

                    <input

                        type={showPassword ? "text" : "password"}

                        placeholder="Password"

                        value={password}

                        onChange={(e) => setPassword(e.target.value)}

                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 outline-none"

                    />

                    <button

                        type="button"

                        onClick={() => setShowPassword(!showPassword)}

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition"

                    >

                        {

                            showPassword

                                ?

                                <FiEyeOff size={20} />

                                :

                                <FiEye size={20} />

                        }

                    </button>

                </div>

                <button

                    disabled={loading}

                    className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white py-3 rounded-xl"

                >

                    {

                        loading

                            ?

                            "Logging In..."

                            :

                            "Login"

                    }

                </button>

                <p className="mt-5 text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">

                    Don't have an account?

                    <Link

                        to="/register"

                        className="text-blue-600 ml-2 hover:underline"
                    >

                        Register

                    </Link>

                </p>

            </form>

        </div>

    );

}
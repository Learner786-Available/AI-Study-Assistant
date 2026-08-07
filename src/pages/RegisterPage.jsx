import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const getPasswordStrength = () => {

        if (password.length < 6) return "Weak";

        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])/;

        if (regex.test(password)) return "Strong";

        return "Medium";

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            toast.error("Passwords do not match");

            return;

        }

        setLoading(true);

        try {

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/auth/register`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        name,

                        email,

                        password

                    })

                }

            );

            const data = await res.json();

            if (data.success) {

                toast.success("Registration Successful");

                navigate("/");

            }

            else {

                toast.error(data.message);

            }

        }

        catch (err) {

            toast.error("Registration Failed");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">

            <form

                onSubmit={handleRegister}

                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md transition-all"

            >

                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">

                    Register

                </h1>

                <input

                    type="text"

                    placeholder="Name"

                    value={name}

                    onChange={(e) => setName(e.target.value)}

                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"

                />

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"

                />

                <div className="relative mb-2">

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

                {
                    password.length > 0 && (

                        <p

                            className={`text-sm ${getPasswordStrength() === "Strong"

                                    ?

                                    "text-green-600"

                                    :

                                    getPasswordStrength() === "Medium"

                                        ?

                                        "text-yellow-600"

                                        :

                                        "text-red-600"

                                }`}

                        >

                            {getPasswordStrength()}

                        </p>

                    )

                }

                <div className="relative mb-4">

                    <input

                        type={

                            showConfirmPassword

                                ?

                                "text"

                                :

                                "password"

                        }

                        placeholder="Confirm Password"

                        value={confirmPassword}

                        onChange={(e) =>

                            setConfirmPassword(e.target.value)

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

                        {

                            showConfirmPassword

                                ?

                                <FiEyeOff size={20} />

                                :

                                <FiEye size={20} />

                        }

                    </button>

                </div>

                <button

                    disabled={loading}

                    className="w-full bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white py-3 rounded-xl"

                >

                    {

                        loading

                            ?

                            "Registering..."

                            :

                            "Register"

                    }

                </button>

                <p className="mt-5 text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">

                    Already have an account?

                    <Link

                        to="/"

                        className="text-blue-600 ml-2 hover:underline"
                    >

                        Login

                    </Link>

                </p>

            </form>

        </div>

    );

}
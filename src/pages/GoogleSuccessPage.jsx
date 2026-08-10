import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function GoogleSuccessPage() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const hasRun = useRef(false);

    useEffect(() => {

        if (hasRun.current) return;

        hasRun.current = true;

        const token = searchParams.get("token");

        if (!token) {

            toast.error("Google login failed");

            navigate("/");

            return;
        }

        localStorage.setItem("token", token);

        toast.success("Google login successful");

        navigate("/dashboard");

    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

            <p className="text-gray-800 dark:text-gray-100">
                Signing you in...
            </p>

        </div>
    );
}
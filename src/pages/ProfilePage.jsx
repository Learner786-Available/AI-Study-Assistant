import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageCropper from "../components/ImageCropper";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ProfilePage() {

    const navigate = useNavigate();

    const { user, logout, updateUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [crop, setCrop] = useState({
        x: 0,
        y: 0

    });
    const [zoom, setZoom] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);


    const token = localStorage.getItem("token");

    const getPasswordStrength = () => {

        if (newPassword.length < 6)

            return "Weak";

        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])/;

        if (regex.test(newPassword))

            return "Strong";

        return "Medium";

    };

    const updateProfile = async () => {

        try {

            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name
                    })
                }
            );

            const data = await res.json();

            if (data.success) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                toast.success("Profile Updated Successfully");

            }

            else {

                toast.error(data.message);

            }

        }

        catch (err) {

            console.error(err);

            toast.error("Failed to update profile");

        }

        finally {

            setLoading(false);

        }

    };

    const changePassword = async () => {

        if (!currentPassword) {

            toast.error("Enter current password");

            return;

        }

        if (!newPassword) {

            toast.error("Enter new password");

            return;

        }

        if (newPassword !== confirmPassword) {

            toast.error("Passwords do not match");

            return;

        }

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/auth/change-password`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        currentPassword,

                        newPassword,

                        confirmPassword

                    })

                }

            );

            const data = await res.json();

            if (data.success) {

                toast.success("Password Updated");

                setCurrentPassword("");

                setNewPassword("");

                setConfirmPassword("");

            }

            else {

                toast.error(data.message);

            }

        }

        catch {

            toast.error("Password Update Failed");

        }

    };

    const handleLogout = () => {

        logout();

        toast.success("Logged Out");

        navigate("/");

    };
    const uploadImage = async () => {

    if (!image) return;

    try {

        setUploadingImage(true);

        const formData = new FormData();

        formData.append("image", image);

        const token = localStorage.getItem("token");

        const res = await fetch(

            `${import.meta.env.VITE_API_URL}/api/auth/upload-profile`,

            {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${token}`

                },

                body: formData

            }

        );

        const data = await res.json();

        if (data.success) {

            updateUser(data.user);

            toast.success("Profile picture updated");

        }

    } catch (err) {

        console.error(err);

        toast.error("Upload Failed");

    } finally {

        setUploadingImage(false);

    }

};

    return (

        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center py-6 sm:py-10 px-4 transition-all duration-300">

            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300">
                <div className="flex flex-col items-center mb-8">

                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">

                        {

                            user?.profileImage ?

                                <img

                                    src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}

                                    className="w-full h-full object-cover"

                                />

                                :

                                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">

                                    {name.charAt(0).toUpperCase()}

                                </div>

                        }

                    </div>

                    <div className="mt-4">

                        <input

                            type="file"

                            accept="image/*"

                            onChange={(e) => {

                                const file = e.target.files[0];

                                setImage(file);

                                setImagePreview(

                                    URL.createObjectURL(file)

                                );

                            }}
                            className="block w-full text-center text-sm text-gray-700 dark:text-gray-200
               file:mr-4 file:px-4 file:py-2
               file:rounded-lg file:border-0
               file:bg-blue-600 file:text-white
               file:cursor-pointer
               hover:file:bg-blue-700"

                        />
                        {

                            imagePreview &&

                            <ImageCropper

                                image={imagePreview}

                                crop={crop}

                                zoom={zoom}

                                setCrop={setCrop}

                                setZoom={setZoom}

                            />

                        }
                        <button
                            onClick={uploadImage}
                            disabled={uploadingImage}
                            className="mt-5 w-full bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white rounded-xl py-3 font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {uploadingImage ? "Uploading..." : "Upload Picture"}
                        </button>

                    </div>

                    <h1 className="text-2xl sm:text-4xl font-bold mt-5 text-gray-800 dark:text-white text-center">

                        My Profile

                    </h1>

                </div>

                <div className="space-y-6 mt-8">

                    <div>

                        <label className="font-semibold text-gray-700 dark:text-gray-200">

                            Name

                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 mt-2"
                        />

                    </div>

                    <div>

                        <label className="font-semibold text-gray-700 dark:text-gray-200">

                            Email

                        </label>

                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 mt-2"
                        />

                    </div>


                    <button
                        onClick={() =>
                            setShowPasswordSection(!showPasswordSection)
                        }
                        className="w-full bg-yellow-500 hover:bg-yellow-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white rounded-xl py-3 font-semibold shadow-lg"
                    >

                        {
                            showPasswordSection
                                ?
                                "Cancel Password Change"
                                :
                                "Change Password"
                        }

                    </button>

                    {
                        showPasswordSection &&

                        <div className="space-y-4 mt-5">

                            <hr className="border-gray-300 dark:border-gray-600" />

                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">

                                Change Password

                            </h2>

                            {/* Current Password */}

                            <div className="relative">

                                <input

                                    type={showCurrent ? "text" : "password"}

                                    placeholder="Current Password"

                                    value={currentPassword}

                                    onChange={(e) =>

                                        setCurrentPassword(e.target.value)

                                    }

                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3"

                                />

                                <button

                                    type="button"

                                    onClick={() =>

                                        setShowCurrent(!showCurrent)

                                    }

                                    className="absolute right-3 top-1/2 -translate-y-1/2"

                                >

                                    {

                                        showCurrent

                                            ?

                                            <FiEyeOff />

                                            :

                                            <FiEye />

                                    }

                                </button>

                            </div>

                            {/* New Password */}

                            <div className="relative">

                                <input

                                    type={showNew ? "text" : "password"}

                                    placeholder="New Password"

                                    value={newPassword}

                                    onChange={(e) =>

                                        setNewPassword(e.target.value)

                                    }

                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3"

                                />

                                <button

                                    type="button"

                                    onClick={() =>

                                        setShowNew(!showNew)

                                    }

                                    className="absolute right-3 top-1/2 -translate-y-1/2"

                                >

                                    {

                                        showNew

                                            ?

                                            <FiEyeOff />

                                            :

                                            <FiEye />

                                    }

                                </button>

                            </div>

                            {
                                newPassword.length > 0 && (

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

                            {/* Confirm Password */}

                            <div className="relative">

                                <input

                                    type={

                                        showConfirm

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

                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3"

                                />

                                <button

                                    type="button"

                                    onClick={() =>

                                        setShowConfirm(!showConfirm)

                                    }

                                    className="absolute right-3 top-1/2 -translate-y-1/2"

                                >

                                    {

                                        showConfirm

                                            ?

                                            <FiEyeOff />

                                            :

                                            <FiEye />

                                    }

                                </button>

                            </div>

                            <button

                                onClick={changePassword}

                                className="w-full bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white rounded-xl py-3 font-semibold shadow-lg"

                            >

                                Update Password

                            </button>

                        </div>

                    }


                    <button
                        onClick={updateProfile}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white rounded-xl py-3 font-semibold shadow-lg"
                    >

                        {
                            loading
                                ? "Updating..."
                                : "Save Changes"
                        }

                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-white rounded-xl py-3 font-semibold shadow-lg"
                    >

                        Logout

                    </button>

                </div>

            </div>

        </div>

    );

}
import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { StudyContext } from "../context/StudyContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMoon, FiSearch, FiBell, FiX, FiMenu } from "react-icons/fi";

export default function TopNavbar({ openSidebar }) {

    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const { globalSearch, setGlobalSearch, notifications, setNotifications } = useContext(StudyContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const mobileDropdownRef = useRef(null);
    const desktopDropdownRef = useRef(null);
    const mobileNotificationRef = useRef(null);
    const desktopNotificationRef = useRef(null);

    useEffect(() => {

    const handleClick = (e) => {

        const mobileClick =
            mobileDropdownRef.current?.contains(e.target);

        const desktopClick =
            desktopDropdownRef.current?.contains(e.target);

        const mobileNotificationClick =
            mobileNotificationRef.current?.contains(e.target);

        const desktopNotificationClick =
            desktopNotificationRef.current?.contains(e.target);

        if (
            mobileClick ||
            desktopClick ||
            mobileNotificationClick ||
            desktopNotificationClick
        ) {
            return;
        }

        setOpen(false);
        setShowNotifications(false);

    };

    document.addEventListener("mousedown", handleClick);

    return () => {
        document.removeEventListener("mousedown", handleClick);
    };

}, []);
    const removeNotification = (id) => {

        setNotifications(prev => {

            const updated = prev.filter(item => item.id !== id);
            return updated;

        });

    };
    const placeholders = {
        "/dashboard": "Search Notes...",
        "/upload": "Search Uploaded Files...",
        "/summary": "Search Topic in Summary...",
        "/chat": "Search Conversation...",
        "/quiz": "Search Quiz Questions...",
        "/guide": "Search Guide...",
        "/profile": "Search Profile..."
    };

    return (

        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
            {/* Mobile Top Row */}

            <div className="flex lg:hidden items-center justify-between mb-4 relative">


                <button
                    onClick={openSidebar}
                    className="text-3xl text-gray-700 dark:text-white"
                >
                    <FiMenu />
                </button>

                <div className="flex items-center gap-4">

                    <button
                        onClick={toggleTheme}
                        className="text-2xl"
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    <div className="relative">

                        {/* Notification Button */}

                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="text-2xl text-gray-700 dark:text-white"
                        >
                            <FiBell />

                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Notification Popup */}

                        {showNotifications && (

                            <div
                               ref={mobileNotificationRef}
                                className="fixed left-1/2 -translate-x-1/2 top-20 w-[92%] max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[999]"
                            >

                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold dark:text-white">
                                    Notifications
                                </div>

                                {notifications.length === 0 ? (

                                    <p className="p-4 text-gray-500">
                                        No Notifications
                                    </p>

                                ) : (

                                    notifications.map(item => (

                                        <div
                                            key={item.id}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex justify-between p-4 border-b dark:border-gray-700"
                                        >
                                            <div>
                                                <p className="text-sm dark:text-white">
                                                    {item.text}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {item.time}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeNotification(item.id);
                                                }}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                <FiX />
                                            </button>
                                        </div>

                                    ))

                                )}

                            </div>

                        )}

                    </div>

                    {/* Profile */}

                    <div
                        className="relative"
                        ref={mobileDropdownRef}
                    >

                        <button
                            onClick={() => setOpen(!open)}
                        >

                            {user?.profileImage ? (

                                <img
                                    src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                                    className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                                />

                            ) : (

                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-blue-500">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>

                            )}

                        </button>

                        {open && (

                            <div className="fixed right-4 top-20 w-56 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden z-[9999]">

                                <Link
                                    to="/profile"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                    className="block px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                    👤 My Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        logout();
                                        navigate("/");
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200"
                                >
                                    🚪 Logout
                                </button>

                            </div>

                        )}

                    </div>
                </div>
            </div>
            <div className="lg:hidden mt-3">

                <div className="relative">

                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        placeholder={placeholders[location.pathname] || "Search..."}
                        className="w-full py-2.5 pl-11 pr-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    />

                </div>

            </div>
            <div className="hidden lg:flex items-center justify-between gap-6">
                {/* Search */}
                <div className="relative w-full lg:max-w-md">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        placeholder={placeholders[location.pathname] || "Search..."}
                        className="w-full py-2.5 text-sm sm:text-base pl-11 pr-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                {/* Right */}
                <div className="hidden lg:flex items-center gap-3 sm:gap-4 ml-auto">
                    <button
                        onClick={toggleTheme}
                        className="text-2xl hover:text-blue-600 transition"
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>
                    <div className="relative shrink-0">
                        <button
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            className="text-2xl text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                            <FiBell className="text-gray-700 dark:text-gray-200" />
                            {
                                notifications.length > 0 &&
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            }
                        </button>
                        {
                            showNotifications &&
                            <div
                                ref={desktopNotificationRef}
                                className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-700 z-[9999] pointer-events-auto"
                            >
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white">
                                    Notifications
                                </div>
                                {
                                    notifications.length === 0 ?
                                        <p className="p-4 text-gray-500">
                                            No Notifications
                                        </p>
                                        :
                                        notifications.map(item => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-start p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <div>
                                                    <p className="text-sm dark:text-white">
                                                        {item.text}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.time}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeNotification(item.id);
                                                    }}
                                                    className="relative z-[10000] p-1 text-red-500 hover:text-red-700"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))
                                }
                            </div>
                        }
                    </div>
                    <div
                        className="relative"
                        ref={desktopDropdownRef}
                    >
                        <button
                            onClick={() => setOpen(!open)}
                            className="rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            {
                                user?.profileImage ?
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                                        alt="Profile"
                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                                    />
                                    :
                                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer border-2 border-blue-500">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                            }
                        </button>
                        {
                            open &&
                            <div className="absolute right-0 mt-3 w-52 sm:w-56 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden z-50 animate-fadeIn">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                    👤 My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 hover:pl-6 transition-all duration-200"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );

}
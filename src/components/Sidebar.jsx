import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ closeSidebar }) {


    const { user } = useContext(AuthContext);

    return (

        <div className="w-72 max-w-[85vw] h-screen bg-blue-600 dark:bg-slate-950 text-white p-5 flex flex-col justify-between border-r border-blue-700 dark:border-slate-800 transition-all duration-300 overflow-y-auto">
            <div>

                <h2 className="text-2xl font-bold mb-8">

                    AI Study Assistant 📚

                </h2>


                <ul className="space-y-3">

                    <li>

                        <Link
                            to="/dashboard"
                            onClick={closeSidebar}
                           className="block w-full px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200"
                        >

                            📊 Dashboard

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/upload"
                            onClick={closeSidebar}
                            className="block px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200"
                        >

                            📄 Upload Notes

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/summary"
                            onClick={closeSidebar}
                            className="block px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200"
                        >

                            📝 Summary

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/chat"
                            onClick={closeSidebar}
                            className="block px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200"
                        >

                            🤖 AI Chat

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/quiz"
                            onClick={closeSidebar}
                            className="block px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200"
                        >

                            🎯 Quiz

                        </Link>

                    </li>

                    <li>

                        <Link
                            to="/guide"
                            onClick={closeSidebar}
                            className="block px-4 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200"
                        >

                            📖 Project Guide

                        </Link>

                    </li>

                </ul>

            </div>

        </div>

    );

}
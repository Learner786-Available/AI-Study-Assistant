import { useContext } from "react";
import { StudyContext } from "../context/StudyContext";

export default function GuidePage() {

    const { globalSearch } = useContext(StudyContext);

    const features = [

        "Upload PDF Notes",
        "Generate AI Summary",
        "Ask Questions from Notes",
        "Generate AI Quiz",
        "Save Notes & Chat History",
        "Download Summary PDF"

    ];

    const steps = [

        "Login into your account.",
        "Upload your PDF notes.",
        "Generate AI Summary.",
        "Ask questions related to uploaded notes.",
        "Generate Quiz for practice.",
        "Track your progress on Dashboard."

    ];

    const filteredFeatures = features.filter(item =>
        item.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const filteredSteps = steps.filter(item =>
        item.toLowerCase().includes(globalSearch.toLowerCase())
    );

    return (

    <div className="max-w-7xl mx-auto">

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300">

            <div className="text-center mb-12">

                <div className="text-6xl mb-4">

                    📖

                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">

                    AI Study Assistant Guide

                </h1>

                <p className="mt-5 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-8">

                    AI Study Assistant is a Final Year Project designed to help students learn smarter using Artificial Intelligence. Upload notes, generate summaries, chat with AI and practice quizzes in one place.

                </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Features */}

                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 shadow-md">

                    <h2 className="text-2xl font-bold text-blue-600 mb-6">

                        🚀 Main Features

                    </h2>

                    {

                        filteredFeatures.length > 0 ?

                        (

                            <ul className="space-y-4">

                                {

                                    filteredFeatures.map((feature,index)=>(

                                        <li

                                            key={index}

                                            className="flex items-start gap-3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200"

                                        >

                                            <span className="text-green-600 text-xl">

                                                ✅

                                            </span>

                                            <span className="text-gray-800 dark:text-white break-words">

                                                {feature}

                                            </span>

                                        </li>

                                    ))

                                }

                            </ul>

                        )

                        :

                        (

                            <div className="text-center py-10 text-red-500">

                                No feature found.

                            </div>

                        )

                    }

                </div>

                {/* Guide */}

                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 shadow-md">

                    <h2 className="text-2xl font-bold text-green-600 mb-6">

                        ⚙️ How It Works

                    </h2>

                    {

                        filteredSteps.length > 0 ?

                        (

                            <ol className="space-y-4">

                                {

                                    filteredSteps.map((step,index)=>(

                                        <li

                                            key={index}

                                            className="flex items-start gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200"

                                        >

                                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white font-bold shrink-0">

                                                {index+1}

                                            </div>

                                            <p className="text-gray-800 dark:text-white leading-7 break-words">

                                                {step}

                                            </p>

                                        </li>

                                    ))

                                }

                            </ol>

                        )

                        :

                        (

                            <div className="text-center py-10 text-red-500">

                                No guide found.

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    </div>

);

}
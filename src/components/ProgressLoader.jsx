import { useContext, useEffect, useState } from "react";
import { StudyContext } from "../context/StudyContext";

export default function ProgressLoader() {

    const { uploadProgress, cancelUpload } = useContext(StudyContext);

    const [progress, setProgress] = useState(0);
    const [stageText, setStageText] = useState("");
    const [targetProgress, setTargetProgress] = useState(0);

    useEffect(() => {

        if (!uploadProgress.visible) {

            setTargetProgress(0);
            setStageText("");
            return;

        }

        setStageText(uploadProgress.stage);

        if (uploadProgress.stage === "Uploading PDF...") {

            setTargetProgress(10);

        }

        else if (uploadProgress.stage === "Reading PDF...") {

            setTargetProgress(25);

        }

        else if (uploadProgress.stage === "Running OCR...") {

            if (uploadProgress.totalPages > 0) {

                const percent =
                    (uploadProgress.currentPage /
                        uploadProgress.totalPages) * 60;

                setTargetProgress(25 + percent);

            }

        }

        else if (uploadProgress.stage === "Saving Note...") {

            setProgress(95);

        }

        else if (uploadProgress.stage === "Completed") {

            setProgress(100);

        }

    }, [uploadProgress]);

    useEffect(() => {

        if (progress === targetProgress) return;

        const interval = setInterval(() => {

            setProgress(prev => {

                if (prev < targetProgress)

                    return Math.min(prev + 1, targetProgress);

                if (prev > targetProgress)

                    return Math.max(prev - 1, targetProgress);

                return prev;

            });

        }, 20);

        return () => clearInterval(interval);

    }, [targetProgress]);

    useEffect(() => {

    if (uploadProgress.stage === "Completed") {

        const timer = setTimeout(() => {

            cancelUpload();

        }, 1200);

        return () => clearTimeout(timer);

    }

}, [uploadProgress.stage]);

    if (!uploadProgress.visible) return null;

    // Stage Icon
    const stageIcon =

        uploadProgress.stage === "Uploading PDF..."
            ? "📤"

            : uploadProgress.stage === "Reading PDF..."
                ? "📖"

                : uploadProgress.stage === "Running OCR..."
                    ? "🔍"

                    : uploadProgress.stage === "Saving Note..."
                        ? "💾"

                        : uploadProgress.stage === "Completed"
                            ? "✅"

                            : "⏳";

    // Estimated Time
    const estimatedTime =

        uploadProgress.stage === "Uploading PDF..."
            ? "~2 sec"

            : uploadProgress.stage === "Reading PDF..."
                ? "~2 sec"

                : uploadProgress.stage === "Running OCR..."
                    ? `~${Math.max(
                        (uploadProgress.totalPages -
                            uploadProgress.currentPage) * 2,
                        1
                    )} sec remaining`

                    : uploadProgress.stage === "Saving Note..."
                        ? "~1 sec"

                        : "";

    return (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-7 transition-all duration-300">

                <div className="flex flex-col items-center">


                    {
                        uploadProgress.stage === "Completed" ?

                            <div className="text-6xl mb-5 animate-bounce">

                                ✅

                            </div>

                            :

                            <div className="w-14 h-14 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 animate-spin mb-5"></div>

                    }

                    < h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">

                        Processing PDF

                    </h2>

                    <p className="mt-3 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300">

                        {stageIcon} {stageText}

                    </p>

                    <p className="mt-2 text-xl font-bold text-blue-600 dark:text-blue-400">

                        {Math.round(progress)}%

                    </p>

                </div>

                {

                    uploadProgress.totalPages > 0 && (

                        <div className="mt-8">

                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">

                                <span>

                                    OCR Progress

                                </span>

                                <span>

                                    {uploadProgress.currentPage} / {uploadProgress.totalPages}

                                </span>

                            </div>

                            <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">

                                <div

                                    className={`

                                    h-full rounded-full transition-all duration-500

                                    ${progress < 30

                                            ? "bg-yellow-500"

                                            : progress < 80

                                                ? "bg-blue-600"

                                                : "bg-green-600"

                                        }

                                    `}

                                    style={{

                                        width: `${progress}%`

                                    }}

                                />

                            </div>

                            <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">

                                Status:
                                {
                                    uploadProgress.stage === "Completed"
                                        ? " Finished Successfully"
                                        : " Processing..."
                                }
                            </p>

                            <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">

                                Please don't close this window while processing.

                            </p>

                        </div>

                    )

                }

                {

                    uploadProgress.stage !== "Completed" && (

                        <button

                            onClick={cancelUpload}

                            className="mt-6 w-full rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all duration-200 py-3 font-semibold text-white"

                        >

                            Cancel Processing

                        </button>

                    )

                }

            </div>

        </div >

    );

} 
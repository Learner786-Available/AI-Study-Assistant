import { useState, useContext, useMemo } from "react";
import { StudyContext } from "../context/StudyContext";
import toast from "react-hot-toast";
import { FiUploadCloud, FiFileText } from "react-icons/fi";

export default function FileUpload() {

    const {

        setUploadedFile,
        setNoteId,
        setTitle,
        setSummary,
        globalSearch,
        setNotifications,
        uploadProgress,
        setUploadProgress,
        setUploadController,


    } = useContext(StudyContext);

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [showLargePdfModal, setShowLargePdfModal] = useState(false);
    const [pendingUpload, setPendingUpload] = useState(null);

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);

        setUploadedFile(selectedFile);

    };
    const handleUpload = async () => {

        if (!file) {

            toast.error("Please select a PDF");

            return;

        }

        setLoading(true);
        const controller = new AbortController();

        setUploadController(controller);
        setUploadProgress({

            visible: true,

            stage: "Uploading PDF...",

            currentPage: 0,

            totalPages: 0

        });

        setUploadSuccess(false);
        const token = localStorage.getItem("token");

        const eventSource = new EventSource(

            `${import.meta.env.VITE_API_URL}/api/progress?token=${token}`

        );

        eventSource.onmessage = (event) => {

            const data = JSON.parse(event.data);

            setUploadProgress({

                visible: true,

                ...data

            });

            if (data.stage === "Completed" || data.error) {

                setTimeout(() => {

                    eventSource.close();

                    setUploadProgress(prev => ({

                        ...prev,

                        visible: false

                    }));

                }, 1000);

            }

        };


        try {

            const formData = new FormData();

            formData.append("file", file);

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/upload`,

                {

                    method: "POST",

                    headers: {

                        Authorization: `Bearer ${token}`

                    },

                    body: formData,

                    signal: controller.signal

                }

            );

            const data = await res.json();

            if (data.success) {
                setUploadProgress({

                    visible: true,

                    stage: "Reading PDF...",

                    currentPage: 0,

                    totalPages: data.totalPages || 0

                });

                // Large scanned PDF
                if (data.isScanned && data.totalPages > 5) {
                    setUploadProgress({

                        visible: true,

                        stage: "Scanned PDF detected",

                        currentPage: 0,

                        totalPages: Math.min(data.totalPages, 5)

                    });

                    setPendingUpload(data);

                    setShowLargePdfModal(true);

                    return;

                }

                setNoteId(data.note._id);

                setTitle(data.note.title);

                setSummary("");

                setUploadSuccess(true);

                setNotifications(prev => [

                    {
                        id: Date.now(),
                        text: `Uploaded: ${data.note.title} 📄`,
                        time: new Date().toLocaleTimeString()
                    },

                    ...prev

                ]);

                toast.success("PDF Uploaded Successfully");

            }
            else {

                toast.error(data.message || data.error);

            }

        }

        catch (err) {
            if (err.name === "AbortError") {

                toast("Upload cancelled.");

                eventSource.close();

                setUploadProgress({

                    visible: false,

                    stage: "",

                    currentPage: 0,

                    totalPages: 0

                });

                return;

            }
            eventSource.close();
            console.error(err);

            toast.error("Upload Failed");

        }

        finally {

            setLoading(false);
            setTimeout(() => {

                setUploadProgress({

                    visible: false,

                    stage: "",

                    currentPage: 0,

                    totalPages: 0

                });

            }, 1200);

        }

    };
    const continueLargePdf = () => {

        const data = pendingUpload;

        setShowLargePdfModal(false);

        setPendingUpload(null);

        setNoteId(data.note._id);

        setTitle(data.note.title);

        setSummary("");

        setUploadSuccess(true);

        setNotifications(prev => [

            {
                id: Date.now(),
                text: `Uploaded: ${data.note.title} 📄`,
                time: new Date().toLocaleTimeString()
            },

            {
                id: Date.now() + 1,
                text: `Scanned PDF (${data.totalPages} pages)`,
                time: new Date().toLocaleTimeString()
            },

            ...prev

        ]);

        toast.success("PDF Uploaded Successfully");

        toast(
            `Large scanned PDF detected (${data.totalPages} pages).\nOnly the first 5 pages will be processed when generating the summary.`,
            {
                icon: "⚠️"
            }
        );

    };


    const fileMatched = useMemo(() => {

        if (!file) return true;

        if (!globalSearch.trim()) return true;

        return file.name
            .toLowerCase()
            .includes(globalSearch.toLowerCase());

    }, [file, globalSearch]);

    return (

        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-8 transition-all duration-300">

            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">

                📄 Upload Your Notes

            </h2>

            <label className="border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-2xl p-5 sm:p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02]">

                <FiUploadCloud className="text-5xl sm:text-6xl text-blue-600 mb-3" />

                <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-white text-center">

                    Click to Select PDF

                </p>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">

                    Only PDF files are supported

                </p>

                <input

                    type="file"

                    accept=".pdf"

                    onChange={handleFileChange}

                    className="hidden"

                />

            </label>

            {

                file && fileMatched &&

                <div className="mt-5 flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl p-4 transition-colors">
                    <FiFileText className="text-4xl text-red-600 shrink-0" />

                    <div className="flex-1">

                        <h3 className="font-semibold text-gray-800 dark:text-white break-words">

                            {file.name}

                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-300">

                            {(file.size / 1024).toFixed(2)} KB

                        </p>

                    </div>

                </div>

            }

            {

                file && !fileMatched && (

                    <p className="text-red-500 text-center mt-3">

                        No matching file found.

                    </p>

                )

            }

            <button

                onClick={handleUpload}

                disabled={loading}

                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"

            >

                {

                    loading

                        ?

                        "⏳ Uploading..."

                        :

                        "🚀 Upload PDF"

                }

            </button>

            {

                uploadSuccess &&

                <p className="text-center text-green-600 font-semibold mt-5">

                    ✅ File Uploaded Successfully

                </p>

            }

            {
                showLargePdfModal && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">

                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-md p-6">

                            <h2 className="text-2xl font-bold mb-4 dark:text-white">

                                ⚠ Large Scanned PDF

                            </h2>

                            <p className="dark:text-gray-300">

                                This scanned PDF contains

                                <b> {pendingUpload?.totalPages} pages </b>

                                <br /><br />

                                To save AI quota, only the

                                <b> first 5 pages </b>

                                will be processed when you generate the summary.

                            </p>

                            <div className="flex justify-end gap-3 mt-8">

                                <button

                                    onClick={() => {

                                        setShowLargePdfModal(false);

                                        setPendingUpload(null);

                                    }}

                                    className="px-5 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 dark:text-white"

                                >

                                    Cancel

                                </button>

                                <button

                                    onClick={continueLargePdf}

                                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"

                                >

                                    Continue

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}
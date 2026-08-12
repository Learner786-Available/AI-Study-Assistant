import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { StudyContext } from "../context/StudyContext";


export default function SummaryHistoryPage() {

const {
    setNoteId,
    setTitle,
    setSummary
} = useContext(StudyContext);


    const navigate = useNavigate();

    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadSummaries = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/dashboard/summaries`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                console.log("SUMMARY HISTORY:", data);

                if (data.success) {

                    setSummaries(data.summaries || []);

                } else {

                    toast.error(
                        data.message ||
                        "Unable to load summaries"
                    );

                }

            } catch (err) {

                console.error(
                    "SUMMARY HISTORY ERROR:",
                    err
                );

                toast.error(
                    "Unable to load summaries"
                );

            } finally {

                setLoading(false);

            }

        };

        loadSummaries();

    }, []);


    const openSummary = (note) => {

    setNoteId(note._id);
    setTitle(note.title);
    setSummary(note.summary);

    navigate("/summary");

};;


    if (loading) {

        return (

            <div className="
                min-h-[400px]
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-gray-600
                    dark:text-gray-300
                ">
                    Loading summaries...
                </p>

            </div>

        );

    }


    return (

        <div className="
            w-full
            max-w-5xl
            mx-auto
        ">

            <div className="mb-6 sm:mb-8">

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-bold
                    text-gray-800
                    dark:text-white
                ">
                    📝 Summary History
                </h1>

                <p className="
                    mt-2
                    text-sm
                    sm:text-base
                    text-gray-500
                    dark:text-gray-400
                ">
                    All your saved summaries
                </p>

            </div>


            {summaries.length === 0 ? (

                <div className="
                    bg-white
                    dark:bg-gray-800
                    rounded-2xl
                    shadow-lg
                    p-8
                    sm:p-12
                    text-center
                ">

                    <div className="text-5xl mb-4">
                        📝
                    </div>

                    <h2 className="
                        text-lg
                        sm:text-xl
                        font-semibold
                        text-gray-800
                        dark:text-white
                    ">
                        No summaries found
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        sm:text-base
                        text-gray-500
                        dark:text-gray-400
                    ">
                        Your generated summaries will appear here.
                    </p>

                </div>

            ) : (

                <div className="space-y-4">

                    {summaries.map((note) => (

                        <div
                            key={note._id}
                            onClick={() =>
                                openSummary(note)
                            }
                            className="
                                bg-white
                                dark:bg-gray-800
                                rounded-2xl
                                shadow-lg
                                p-4
                                sm:p-6
                                cursor-pointer
                                border
                                border-transparent
                                dark:border-gray-700
                                hover:shadow-2xl
                                hover:-translate-y-1
                                transition-all
                                duration-300
                            "
                        >

                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-4
                            ">

                                <div className="
                                    flex
                                    items-start
                                    gap-3
                                    min-w-0
                                ">

                                    <span className="
                                        text-3xl
                                        sm:text-4xl
                                    ">
                                        📄
                                    </span>

                                    <div className="min-w-0">

                                        <h2 className="
                                            text-base
                                            sm:text-xl
                                            font-bold
                                            text-gray-800
                                            dark:text-white
                                            break-words
                                        ">
                                            {note.title}
                                        </h2>

                                        <p className="
                                            text-xs
                                            sm:text-sm
                                            text-gray-500
                                            dark:text-gray-400
                                            mt-1
                                        ">
                                            {new Date(
                                                note.createdAt
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    sm:justify-end
                                    gap-3
                                ">

                                    <span className="
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        sm:text-sm
                                        bg-green-100
                                        dark:bg-green-900/40
                                        text-green-700
                                        dark:text-green-300
                                    ">
                                        Saved
                                    </span>

                                    <span className="
                                        text-xl
                                        sm:text-2xl
                                        text-blue-600
                                        dark:text-blue-400
                                    ">
                                        →
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { StudyContext } from "../context/StudyContext";

export default function QuizHistoryPage() {

    const {
    setNoteId,
    setTitle,
    setQuiz
} = useContext(StudyContext);

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/history/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (data.success) {

                    setHistory(data.history);

                } else {

                    toast.error(
                        data.message || "Unable to load quiz history"
                    );

                }

            }

            catch (err) {

                console.error(err);

                toast.error(
                    "Unable to load quiz history"
                );

            }

            finally {

                setLoading(false);

            }

        };

        loadHistory();

    }, []);


    const openQuiz = async (item) => {

    try {

        const token = localStorage.getItem("token");

        const noteId = item.noteId?._id;

        if (!noteId) {

            toast.error("Note not found");

            return;

        }

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/notes/${noteId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (!data.success) {

            toast.error(
                data.message || "Unable to open quiz"
            );

            return;

        }

        const savedQuizzes = data.note.quiz || [];

        if (savedQuizzes.length === 0) {

            toast.error(
                "No saved quiz found for this note."
            );

            return;

        }

        const latestQuiz =
            savedQuizzes[savedQuizzes.length - 1];

        // StudyContext update
        setNoteId(data.note._id);

        setTitle(data.note.title);

        setQuiz(
            latestQuiz.questions || []
        );

        // Open existing QuizPage
        navigate("/quiz");

    }

    catch (err) {

        console.error(err);

        toast.error(
            "Something went wrong"
        );

    }

};


    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-[400px]">

                <p className="text-gray-600 dark:text-gray-300">
                    Loading quiz history...
                </p>

            </div>
        );

    }


    return (

        <div className="max-w-5xl mx-auto">

            <div className="mb-8">

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                    ❓ Quiz History
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    View all your previous quiz attempts.
                </p>

            </div>


            {history.length === 0 ? (

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">

                    <p className="text-gray-500 dark:text-gray-400">
                        No quiz attempts found.
                    </p>

                </div>

            ) : (

                <div className="space-y-4">

                    {history.map((item) => (

                        <div
                            key={item._id}
                            onClick={() => openQuiz(item)}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>

                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">

                                        {item.noteId?.title ||
                                            "Unknown Note"}

                                    </h2>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">

                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString()}

                                    </p>

                                </div>


                                <div className="flex items-center gap-4">

                                    <div className="text-right">

                                        <p className="text-2xl font-bold text-purple-600">

                                            {item.score}/
                                            {item.totalQuestions}

                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">

                                            {item.percentage}%

                                        </p>

                                    </div>

                                    <span className="text-purple-600 text-xl">
                                        →
                                    </span>

                                </div>

                            </div>


                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">

                                <p className="text-sm text-gray-500 dark:text-gray-400">

                                    ⏱️ Time Taken:{" "}

                                    {Math.floor(
                                        item.timeTaken / 60
                                    )}m{" "}

                                    {item.timeTaken % 60}s

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}
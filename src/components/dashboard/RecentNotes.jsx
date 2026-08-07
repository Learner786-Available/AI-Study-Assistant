import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StudyContext } from "../../context/StudyContext";
import toast from "react-hot-toast";

export default function RecentNotes({

    notes = [],
    refreshDashboard

}) {

    const navigate = useNavigate();

    const {
        setNoteId,
        setTitle,
        setSummary,
        setQuiz,
        setChatHistory
    } = useContext(StudyContext);

    const token = localStorage.getItem("token");

    const deleteNote = async (id) => {

        if (!window.confirm("Delete this note?")) return;

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (data.success) {

                toast.success("Note Deleted Successfully");
                refreshDashboard();

            } else {

                toast.error(data.message || data.error);

            }

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 transition-all duration-300">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-5 sm:mb-6">
                📄 Recent Notes

            </h2>

            {

                notes.length === 0 ?

                    <p className="text-gray-500 dark:text-gray-400">

                        No Notes Found

                    </p>

                    :

                    notes.map(note => (

                        <div
                            key={note._id}
                            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 py-5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300"
                        >

                           <div className="flex-1 min-w-0">

                                <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white break-words">
                                    {note.title}

                                </h3>

                                <p className="text-gray-500 dark:text-gray-400 text-sm">

                                    {new Date(note.createdAt).toLocaleDateString()}

                                </p>

                            </div>

                            <div className="grid grid-cols-2 sm:flex gap-2 w-full lg:w-auto">

                                <button
                                    onClick={() => {
                                        setNoteId(note._id);
                                        setTitle(note.title);
                                        setSummary(note.summary);
                                        navigate("/summary");
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 text-white w-full sm:w-auto px-4 py-2 rounded-lg"
                                >

                                    Summary

                                </button>

                                <button
                                    onClick={async () => {

                                        try {

                                            const res = await fetch(
                                                `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                }
                                            );

                                            const data = await res.json();

                                            if (!data.success) {

                                                toast.error(data.message);
                                                return;

                                            }

                                            setNoteId(data.note._id);
                                            setQuiz(data.note.quiz || []);
                                            setTitle(data.note.title);

                                            navigate("/quiz");

                                        } catch (err) {

                                            console.error(err);

                                        }

                                    }}
                                    className="bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-200 text-white w-full sm:w-auto px-4 py-2 rounded-lg transition-all"
                                >

                                    Quiz

                                </button>

                                <button
                                    onClick={async () => {

                                        try {

                                            const res = await fetch(
                                                `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                }
                                            );

                                            const data = await res.json();

                                            if (!data.success) {

                                                toast.error(data.message);
                                                return;

                                            }

                                            setNoteId(data.note._id);
                                            setTitle(data.note.title);
                                            setChatHistory(data.note.chatHistory || []);
                                            navigate("/chat");

                                        } catch (err) {

                                            console.error(err);

                                        }

                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all duration-200 text-white w-full sm:w-auto px-4 py-2 rounded-lg transition-all"
                                >

                                    Chat

                                </button>

                                <button
                                    onClick={() => deleteNote(note._id)}
                                    className="bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 text-white w-full sm:w-auto px-4 py-2 rounded-lg transition-all"
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    ))

            }

        </div>

    );

}
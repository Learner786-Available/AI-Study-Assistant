import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatsHeader from "../components/dashboard/StatsHeader";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import RecentNotes from "../components/dashboard/RecentNotes";
import { StudyContext } from "../context/StudyContext";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import RecentNotesSkeleton from "../components/skeletons/RecentNotesSkeleton";

export default function DashboardPage() {

    const [stats, setStats] = useState({
        totalNotes: 0,
        totalSummaries: 0,
        totalQuizzes: 0,
        highestScore: "0/10",
        highestScoreAttempt: null,
        averageScore: "0%",
        lastUpload: "No Notes"
    });

    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const { globalSearch } = useContext(StudyContext);
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const notesPerPage = 5;

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {

        let temp = [...notes];

        temp = temp.filter(note =>
            note.title.toLowerCase().includes(globalSearch.toLowerCase())
        );

        switch (sortBy) {

            case "newest":
                temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;

            case "oldest":
                temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;

            case "az":
                temp.sort((a, b) => a.title.localeCompare(b.title));
                break;

            case "za":
                temp.sort((a, b) => b.title.localeCompare(a.title));
                break;

            default:
                break;

        }

        setFilteredNotes(temp);
        setCurrentPage(1);

    }, [notes, globalSearch, sortBy]);

    const loadDashboard = async () => {

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (data.success) {

                setStats(data.stats);
                setNotes(data.notes);

            } else {

                toast.error(data.message || data.error);

            }

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (

            <div className="p-8">

                <DashboardSkeleton />

            </div>

        );

    }


    return (

        <div className="p-4 sm:p-6 lg:p-8 min-h-screen overflow-x-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 p-4 sm:p-6 lg:p-8">
            <StatsHeader />


            {globalSearch.trim() ? (

                <div className="mt-8">

                    <h2 className="text-2xl font-bold mb-5">
                        🔍 Search Results ({filteredNotes.length})
                    </h2>

                    {loading ? (

                        <RecentNotesSkeleton />

                    ) : (

                        <RecentNotes
                            notes={filteredNotes}
                            refreshDashboard={loadDashboard}
                        />

                    )}

                </div>


            ) : (

                <>

                    <DashboardGrid
                        totalNotes={stats.totalNotes}
                        totalSummaries={stats.totalSummaries}
                        totalQuizzes={stats.totalQuizzes}
                        highestScore={stats.highestScore}
                        highestScoreAttempt={stats.highestScoreAttempt}
                        averageScore={stats.averageScore}
                        lastUpload={stats.lastUpload}
                    />

                    <>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 mt-8 mb-6 transition-all">

                            <div className="flex justify-between items-center">

                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">

                                    📄 Recent Notes ({filteredNotes.length})

                                </h2>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-2"
                                >

                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="az">A → Z</option>
                                    <option value="za">Z → A</option>

                                </select>

                            </div>

                        </div>

                        <RecentNotes
                            notes={filteredNotes.slice(
                                (currentPage - 1) * notesPerPage,
                                currentPage * notesPerPage
                            )}
                            refreshDashboard={loadDashboard}
                        />

                        {filteredNotes.length > 5 && (

                            <div className="flex justify-center mt-6">

                                <div className="flex justify-center items-center gap-3 mt-8">

                                    <button

                                        disabled={currentPage === 1}

                                        onClick={() => setCurrentPage(currentPage - 1)}

                                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-slate-800 text-white dark:bg-slate-600 dark:hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition"

                                    >

                                        Previous

                                    </button>

                                    <span className="font-semibold">

                                        Page {currentPage} of {Math.ceil(filteredNotes.length / notesPerPage)}

                                    </span>

                                    <button

                                        disabled={currentPage === Math.ceil(filteredNotes.length / notesPerPage)}

                                        onClick={() => setCurrentPage(currentPage + 1)}

                                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >

                                        Next

                                    </button>

                                </div>

                            </div>

                        )}
                    </>

                </>

            )}
        </div>

    );

}
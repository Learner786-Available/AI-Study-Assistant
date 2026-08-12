import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RecentNotes from "../components/dashboard/RecentNotes";

export default function NotesPage() {

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotes = async () => {

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

                setNotes(data.notes || []);

            } else {

                toast.error(data.message || data.error);

            }

        } catch (err) {

            console.error(err);
            toast.error("Failed to load notes");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        loadNotes();
    }, []);

    return (

        <div className="min-h-screen">

            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                📚 All Notes
            </h1>

            {loading ? (

                <div className="text-center py-10 text-gray-500">
                    Loading Notes...
                </div>

            ) : (

                <RecentNotes
                    notes={notes}
                    refreshDashboard={loadNotes}
                />

            )}

        </div>

    );

}
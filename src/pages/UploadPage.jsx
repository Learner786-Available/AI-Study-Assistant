import { useContext, useState } from "react";
import { StudyContext } from "../context/StudyContext";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import toast from "react-hot-toast";

export default function UploadPage() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    setSummary,
    setTitle,
    noteId,
    setNotifications
  } = useContext(StudyContext);
  

  const generateSummary = async () => {

    if (!noteId) {

      toast.error("Please upload a PDF first.");
      return;

    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            noteId
          })
        }
      );

      const data = await res.json();

      if (data.success) {

        // Existing Success Toast
        toast.success(
          data.cached
            ? "Summary loaded from MongoDB"
            : "Summary generated successfully"
        );

        // Large scanned PDF warning
        if (data.ocrLimited) {

          toast.success(
            "⚠️ Large scanned PDF detected. Only the first 5 pages were processed.",
            
          );

        }

        setSummary(data.summary);
        setTitle("AI Generated Summary");

        setNotifications(prev => [

          {
            id: Date.now(),
            text: "Summary Generated 📝",
            time: new Date().toLocaleTimeString()
          },

          ...(data.ocrLimited
            ? [{
              id: Date.now() + 1,
              text: "Large scanned PDF: Only first 5 pages processed ⚠️",
              time: new Date().toLocaleTimeString()
            }]
            : []),

          ...prev

        ]);
        navigate("/summary")

      }

      else {

        toast.error(data.message || data.error);

      }

    }

    catch (err) {

      console.error(err);
      toast.error("Summary generation failed.");

    }

    finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 overflow-x-hidden">

      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-10 transition-all duration-300">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-3">

          📚 AI Study Assistant

        </h1>

        <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-8 sm:mb-10">

          Upload your study notes and generate AI-powered summaries, quizzes and chat instantly.

        </p>

        <div className="flex flex-col items-center gap-6">

          <FileUpload />

          <button
            onClick={generateSummary}
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-8 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {
              loading
                ? "⏳ Generating Summary..."
                : "✨ Generate Summary"
            }

          </button>

        </div>

      </div>
     
    </div>

  );

}
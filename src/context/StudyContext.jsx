import { createContext, useState } from "react";

export const StudyContext = createContext();

export function StudyProvider({ children }) {

  const [uploadedFile, setUploadedFile] = useState(null);

  const [summary, setSummary] = useState("");
  const [uploadProgress, setUploadProgress] = useState({
    visible: false,
    stage: "",
    currentPage: 0,
    totalPages: 0
  });
  const [title, setTitle] = useState("");
  const [noteId, setNoteId] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [uploadController, setUploadController] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Welcome to AI Study Assistant 🎉",
      time: "Now"
    }
  ]);

  const cancelUpload = async () => {

    try {

      const token = localStorage.getItem("token");

      await fetch(

        `${import.meta.env.VITE_API_URL}/api/progress/cancel`,

        {

          method: "POST",

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      if (uploadController) {

        uploadController.abort();

      }

      setUploadProgress({

        visible: false,

        stage: "",

        currentPage: 0,

        totalPages: 0

      });
      setUploadController(null);

    }

    catch (err) {

      console.error(err);

    }

  };

  return (

    <StudyContext.Provider
      value={{

        uploadedFile,
        setUploadedFile,

        summary,
        setSummary,

        title,
        setTitle,

        noteId,
        setNoteId,

        quiz,
        setQuiz,

        chatHistory,
        setChatHistory,

        globalSearch,
        setGlobalSearch,

        notifications,
        setNotifications,

        uploadProgress,
        setUploadProgress,

        uploadController,
        setUploadController,

        cancelUpload,

      }}
    >

      {children}

    </StudyContext.Provider>

  );

}
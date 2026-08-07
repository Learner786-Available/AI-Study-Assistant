import { useContext, useState, useEffect, useRef } from "react";
import { StudyContext } from "../context/StudyContext";
import toast from "react-hot-toast";
import ChatMessage from "../components/ChatMessage";


export default function ChatPage() {

  const { noteId, globalSearch, title } = useContext(StudyContext);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth"

    });

  }, [messages]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!noteId) return;

    loadChatHistory();

  }, [noteId]);



  const sendMessage = async () => {

    if (loading) return;

    if (!noteId) {

      toast.error("Please upload a PDF first.");

      return;

    }

    if (!message.trim()) return;

    const question = message;

    setMessages(prev => [

      ...prev,

      {

        sender: "user",

        text: question

      }

    ]);

    setMessage("");

    setLoading(true);

    try {

      setTyping(true);

      const res = await fetch(

        `${import.meta.env.VITE_API_URL}/api/chat`,

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify({

            noteId,

            message: question

          })

        }

      );

      const data = await res.json();

      if (data.success) {

        await new Promise(resolve => setTimeout(resolve, 1200));

        setTyping(false);

        await loadChatHistory();

        inputRef.current?.focus();


      }

      else {

        toast.error(data.message || data.error);

      }

    }

    catch (err) {
      setTyping(false);

      console.error(err);

      toast.error("Chat failed.");

    }

    finally {

      setLoading(false);
      setTyping(false);

    }

  };

  const clearChat = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(

        `${import.meta.env.VITE_API_URL}/api/chat/${noteId}`,

        {

          method: "DELETE",

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      const data = await res.json();

      if (data.success) {

        setMessages([
          {
            sender: "ai",
            text: "Hello! Upload your notes and ask me anything."
          }
        ]);

        toast.success("Chat Cleared");

      }

      else {

        toast.error(data.message);

      }

    }

    catch (err) {

      console.error(err);

      toast.error("Failed to clear chat");

    }

  };

  const loadChatHistory = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(

        `${import.meta.env.VITE_API_URL}/api/chat/${noteId}`,

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      const data = await res.json();

      if (data.success) {

        if (data.chatHistory.length === 0) {

          setMessages([
            {
              sender: "ai",
              text: "Hello! Upload your notes and ask me anything."
            }
          ]);

          return;

        }

        const history = [];

        data.chatHistory.forEach(chat => {

          history.push({

            sender: chat.role === "user"
              ? "user"
              : "ai",

            text: chat.content

          });

        });

        setMessages(history);

      }

    }

    catch (err) {

      console.error(err);

    }

  };

return (

  <div className="flex flex-col h-full overflow-hidden">

    {/* Header */}

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

      <div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">

          🤖 AI Chat

        </h1>

        <div className="flex items-center gap-2 mt-2">

          <span className="text-sm text-gray-500 dark:text-gray-400">

            Current Note:

          </span>

          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">

            {title || "No Note Selected"}

          </span>

        </div>

      </div>

      <button

        onClick={clearChat}

        disabled={!noteId}

        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed"

      >

        🗑 Clear Chat

      </button>

    </div>

    {/* Messages */}

    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-inner transition-all duration-300">

      {

        messages.length === 0 && (

          <div className="flex flex-col justify-center items-center text-center h-full text-gray-400 dark:text-gray-500 px-4">

            <div className="text-6xl sm:text-7xl mb-5">

              🤖

            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">

              AI Study Assistant

            </h2>

            <p className="mt-3 text-sm sm:text-base max-w-md">

              Upload your notes and ask anything.

              AI will answer only from your uploaded PDF.

            </p>

          </div>

        )

      }

      {

        messages.map((msg, index) => (

          <ChatMessage

            key={index}

            role={msg.sender}

            message={msg.text}

            search={globalSearch}

          />

        ))

      }

      {

        typing && (

          <div className="flex justify-start mb-5">

            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl px-5 py-4 shadow-md">

              <div className="flex gap-1">

                <span className="w-2 h-2 bg-gray-500 dark:bg-white rounded-full animate-bounce"></span>

                <span

                  className="w-2 h-2 bg-gray-500 dark:bg-white rounded-full animate-bounce"

                  style={{ animationDelay: "0.2s" }}

                ></span>

                <span

                  className="w-2 h-2 bg-gray-500 dark:bg-white rounded-full animate-bounce"

                  style={{ animationDelay: "0.4s" }}

                ></span>

              </div>

            </div>

          </div>

        )

      }

      <div ref={bottomRef}></div>

    </div>

    {/* Input */}

    <div className="mt-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-3">

      <div className="flex items-end gap-3">

        <textarea

          ref={inputRef}

          rows={1}

          value={message}

          onChange={(e) => setMessage(e.target.value)}

          onKeyDown={(e) => {

            if (e.key === "Enter" && !e.shiftKey) {

              e.preventDefault();

              sendMessage();

            }

          }}

          placeholder="Ask AI anything about your uploaded notes..."

          className="flex-1 bg-transparent resize-none outline-none text-gray-800 dark:text-white placeholder:text-gray-400 p-2 max-h-40"

        />

        <button

          onClick={sendMessage}

          disabled={loading}

          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 active:scale-95 transition-all duration-300 text-white rounded-xl px-5 sm:px-6 py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"

        >

          {

            loading

              ? "..."

              : "➤"

          }

        </button>

      </div>

    </div>

  </div>

);

}
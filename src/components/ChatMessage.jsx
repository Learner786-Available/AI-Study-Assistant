import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";


export default function ChatMessage({
    role,
    message,
    search

}) {

    const isUser = role === "user";
    const highlightText = (text) => {

        if (!search?.trim()) return text;

        const regex = new RegExp(`(${search})`, "gi");

        return text.split(regex).map((part, index) =>

            part.toLowerCase() === search.toLowerCase()

                ?

                <mark
                    key={index}
                    className="bg-yellow-300 text-black px-1 rounded"
                >
                    {part}
                </mark>

                :

                part

        );

    };
    const copyMessage = () => {

        navigator.clipboard.writeText(message);

        toast.success("Copied");

    };

    return (

        <div

            className={`flex mb-5 ${isUser

                ?

                "justify-end"

                :

                "justify-start"

                }`}

        >

            <div

                className={`

                max-w-[75%]

                px-5

                py-3

                rounded-2xl

                shadow

                whitespace-pre-wrap

                transition-colors

                duration-300

                ${isUser

                        ?

                        "bg-blue-600 text-white rounded-br-sm"

                        :

                        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"

                    }

            `}

            >

                <>

                    {

                        !isUser &&

                        <div className="flex justify-end mb-2">

                            <button

                                onClick={copyMessage}

                                className="hover:text-blue-600 dark:hover:text-blue-400 transition"

                            >

                                <FiCopy />

                            </button>

                        </div>

                    }
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({
                                    inline,
                                    className,
                                    children,
                                    ...props
                                }) {

                                    const match = /language-(\w+)/.exec(className || "");

                                    return !inline && match ? (

                                        <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>

                                    ) : (

                                        <code
                                            className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-red-600 dark:text-red-300"
                                            {...props}
                                        >
                                            {children}
                                        </code>

                                    );

                                }
                            }}
                        >
                            {message}
                        </ReactMarkdown>
                    </div>

                </>

            </div>

        </div>

    );
}
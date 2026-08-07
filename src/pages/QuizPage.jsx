import { useContext, useState, useCallback, useEffect, useRef } from "react";
import { StudyContext } from "../context/StudyContext";
import toast from "react-hot-toast";
import QuizHeader from "../components/quiz/QuizHeader";
import ProgressBar from "../components/quiz/ProgressBar";
import QuizTimer from "../components/quiz/QuizTimer";
import QuestionCard from "../components/quiz/QuestionCard";
import ResultCard from "../components/quiz/ResultCard";
import HistoryTable from "../components/quiz/HistoryTable";
import QuizSkeleton from "../components/skeletons/QuizSkeleton";

export default function QuizPage() {

    const {
        noteId,
        quiz: savedQuiz,
        setQuiz: setContextQuiz,
        notifications,
        setNotifications
    } = useContext(StudyContext);
    const [quiz, setQuiz] = useState([]);
    const [cached, setCached] = useState(null);
    const [loading, setLoading] = useState(false);
    const [autoNext, setAutoNext] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [history, setHistory] = useState([]);
    const [difficulty, setDifficulty] = useState("Medium");
    const [questionCount, setQuestionCount] = useState(10);
    const [showSettings, setShowSettings] = useState(true);
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [timerDuration, setTimerDuration] = useState(30);
    const startTime = useRef(Date.now());
    const quizRef = useRef(null);


    const generateQuiz = async () => {

        if (!noteId) {

            toast.error("Please upload a PDF first.");

            return;

        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/quiz`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        noteId,

                        difficulty,

                        count: questionCount

                    })

                }

            );

            const data = await res.json();

            // console.log("Quiz Response:", data);
            // console.log("Cached:", data.cached);
            // console.log("Questions:", data.quiz?.length);

            if (data.success) {
                // console.log(data.quiz);
                setQuiz(data.quiz);
                setShowSettings(false);
                setTimeout(() => {

                    quizRef.current?.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }, 200);
                setContextQuiz(data.quiz);
                setCached(data.cached);
                setCurrentQuestion(0);
                setSelectedAnswer("");
                setChecked(false);
                setScore(0);
                setQuizFinished(false);
            }

            else {

                toast.error(data.message || data.error);

            }

        }

        catch (err) {

            console.error(err);

            toast.error("Quiz generation failed.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (savedQuiz && savedQuiz.length > 0) {

            setQuiz(savedQuiz);
            setCurrentQuestion(0);
            setSelectedAnswer("");
            setChecked(false);
            setScore(0);
            setQuizFinished(false);
        }

    }, [savedQuiz]);

    const checkAnswer = () => {

        if (!selectedAnswer) {

            toast.error("Please select an option.");
            return;

        }

        const correctLetter = quiz[currentQuestion]

            .answer

            .trim()

            .toUpperCase();

        const selectedIndex = quiz[currentQuestion]

            .options

            .indexOf(selectedAnswer);

        const selectedLetter = String.fromCharCode(

            65 + selectedIndex

        );

        const result = selectedLetter === correctLetter;

        setIsCorrect(result);

        if (result) {

            setScore(prev => prev + 1);

        }

        setChecked(true);

    };

    const nextQuestion = () => {

        if (currentQuestion === quiz.length - 1) {
            setNotifications(prev => [

                {
                    id: Date.now(),
                    text: `Quiz Completed (${score}/${quiz.length}) 🎯`,
                    time: new Date().toLocaleTimeString()
                },

                ...prev

            ]);

            setQuizFinished(true);

            return;

        }

        setCurrentQuestion(prev => prev + 1);

        setSelectedAnswer("");

        setChecked(false);

    };

    const saveQuizHistory = async () => {

        try {

            const percentage = Math.round(

                (score / quiz.length) * 100

            );

            const timeTaken = Math.floor(

                (Date.now() - startTime.current) / 1000

            );

            const token = localStorage.getItem("token");

            await fetch(

                `${import.meta.env.VITE_API_URL}/api/history`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        noteId,

                        score,

                        totalQuestions: quiz.length,

                        percentage,

                        timeTaken

                    })

                }

            );

        }

        catch (err) {

            console.error(err);

        }

    };
    const loadHistory = async () => {

        if (!noteId) return;

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/history/${noteId}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const data = await res.json();

            if (data.success) {

                setHistory(data.history);

            }

        }

        catch (err) {

            console.error(err);

        }

    };

    const retryQuiz = () => {
        setShowSettings(true);

        setCurrentQuestion(0);

        setSelectedAnswer("");

        setChecked(false);

        setScore(0);

        setQuizFinished(false);

        startTime.current = Date.now();

    };

    const handleTimeUp = useCallback(() => {

        if (checked) return;

        setChecked(true);

        setIsCorrect(false);

        setSelectedAnswer("");

        setTimeout(() => {

            setCurrentQuestion(prev => {

                if (prev >= quiz.length - 1) {

                    setQuizFinished(true);

                    return prev;

                }

                return prev + 1;

            });

            setSelectedAnswer("");

            setChecked(false);

            setIsCorrect(false);

        }, 1000);

    }, [checked, quiz.length]);

    useEffect(() => {

        if (!autoNext) return;

        const timer = setTimeout(() => {

            if (currentQuestion >= quiz.length - 1) {

                setQuizFinished(true);

            }

            else {

                setCurrentQuestion(prev => prev + 1);

                setSelectedAnswer("");

                setChecked(false);

                setIsCorrect(false);

            }

            setAutoNext(false);

        }, 1000);

        return () => clearTimeout(timer);

    }, [autoNext, currentQuestion, quiz.length]);

    useEffect(() => {

        loadHistory();

    }, [noteId]);

    useEffect(() => {

        if (!quizFinished) return;

        const finishQuiz = async () => {

            await saveQuizHistory();

            await loadHistory();

        };

        finishQuiz();

    }, [quizFinished]);

    if (loading) {

        return (

            <div className="p-8">

                <QuizSkeleton />

            </div>

        );

    }

    return (

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 sm:p-8 transition-all duration-300 overflow-hidden">

            <QuizHeader cached={cached} />

            {/* Quiz Settings */}

            {

                showSettings && (

                    <div className="mt-6">

                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-6 transition-all duration-300">

                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5">

                                Quiz Settings

                            </h2>

                            {/* Difficulty */}

                            <div className="mb-6">

                                <p className="font-medium mb-3 text-gray-700 dark:text-gray-300">

                                    Difficulty

                                </p>

                                <div className="flex flex-wrap gap-3">

                                    {

                                        ["Easy", "Medium", "Hard"].map(level => (

                                            <button

                                                key={level}

                                                onClick={() => setDifficulty(level)}

                                                className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95
                                            ${difficulty === level
                                                        ? "bg-blue-600 text-white shadow-lg"
                                                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                                    }`}

                                            >

                                                {level}

                                            </button>

                                        ))

                                    }

                                </div>

                            </div>

                            {/* Question Count */}

                            <div className="mb-6">

                                <p className="font-medium mb-3 text-gray-700 dark:text-gray-300">

                                    Number of Questions

                                </p>

                                <div className="flex flex-wrap gap-3">

                                    {

                                        [5, 10, 20].map(num => (

                                            <button

                                                key={num}

                                                onClick={() => setQuestionCount(num)}

                                                className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95
                                            ${questionCount === num
                                                        ? "bg-green-600 text-white shadow-lg"
                                                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                                    }`}

                                            >

                                                {num}

                                            </button>

                                        ))

                                    }

                                </div>

                            </div>

                            {/* Timer */}

                            <div className="mb-6">

                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input

                                        type="checkbox"

                                        checked={timerEnabled}

                                        onChange={(e) =>
                                            setTimerEnabled(e.target.checked)
                                        }

                                    />

                                    <span className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">

                                        Enable Timer

                                    </span>

                                </label>

                            </div>

                            {

                                timerEnabled && (

                                    <div className="mb-6">

                                        <p className="font-medium mb-3 text-gray-700 dark:text-gray-300">

                                            Timer Duration

                                        </p>

                                        <div className="flex flex-wrap gap-3">

                                            {

                                                [30, 60, 120].map(sec => (

                                                    <button

                                                        key={sec}

                                                        onClick={() => setTimerDuration(sec)}

                                                        className={`px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95
                                                            ${timerDuration === sec
                                                                ? "bg-purple-600 text-white shadow-lg"
                                                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                                            }`}

                                                    >

                                                        {sec}s

                                                    </button>

                                                ))

                                            }

                                        </div>

                                    </div>

                                )

                            }

                            <button

                                onClick={generateQuiz}

                                disabled={loading || savedQuiz.length > 0}

                                className="w-full sm:w-auto mt-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-6 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"

                            >

                                {

                                    loading

                                        ? "⏳ Generating..."

                                        : savedQuiz.length > 0

                                            ? "✅ Quiz Loaded"

                                            : "🎯 Generate Quiz"

                                }

                            </button>

                        </div>

                    </div>

                )

            }

            {

                !showSettings && (

                    <div className="mt-5">

                        <button

                            onClick={() => setShowSettings(true)}

                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 active:scale-95"

                        >

                            ⚙️ Change Quiz Settings

                        </button>

                    </div>

                )

            }

            <div ref={quizRef}>

                {

                    quiz.length > 0 && !quizFinished && (

                        <div className="mt-8 space-y-6">

                            <ProgressBar

                                currentQuestion={currentQuestion}

                                totalQuestions={quiz.length}

                                score={score}

                            />

                            {

                                timerEnabled && (

                                    <QuizTimer

                                        duration={timerDuration}

                                        currentQuestion={currentQuestion}

                                        onTimeUp={handleTimeUp}

                                    />

                                )

                            }

                            <QuestionCard

                                question={quiz[currentQuestion]}

                                currentQuestion={currentQuestion}

                                totalQuestions={quiz.length}

                                selectedAnswer={selectedAnswer}

                                setSelectedAnswer={setSelectedAnswer}

                                checked={checked}

                                isCorrect={isCorrect}

                                checkAnswer={checkAnswer}

                                nextQuestion={nextQuestion}

                            />

                        </div>

                    )

                }

                {

                    quizFinished && (

                        <div className="mt-8">

                            <ResultCard

                                score={score}

                                totalQuestions={quiz.length}

                                retryQuiz={retryQuiz}

                            />

                        </div>

                    )

                }

            </div>

            <div className="mt-10 overflow-x-auto">

                <HistoryTable

                    history={history}

                />

            </div>

        </div>

    );
}
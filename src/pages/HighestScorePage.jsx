import { useLocation, useNavigate } from "react-router-dom";

export default function HighestScorePage() {

    const location = useLocation();
    const navigate = useNavigate();

    const attempt = location.state?.attempt;

    if (!attempt) {

        return (

            <div className="
                min-h-[400px]
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
            ">

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-gray-800
                    dark:text-white
                ">
                    Highest Score Not Found
                </h1>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="
                        mt-5
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-2
                        rounded-lg
                    "
                >
                    Back to Dashboard
                </button>

            </div>

        );

    }

    const minutes = Math.floor(
        (attempt.timeTaken || 0) / 60
    );

    const seconds = (attempt.timeTaken || 0) % 60;

    return (

        <div className="
            w-full
            max-w-4xl
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
                    🏆 Highest Score
                </h1>

                <p className="
                    mt-2
                    text-sm
                    sm:text-base
                    text-gray-500
                    dark:text-gray-400
                ">
                    Your best quiz performance
                </p>

            </div>


            <div className="
                bg-white
                dark:bg-gray-800
                rounded-2xl
                shadow-xl
                p-5
                sm:p-8
                border
                border-gray-200
                dark:border-gray-700
            ">

                <div className="text-center">

                    <div className="text-5xl sm:text-6xl mb-4">
                        🏆
                    </div>

                    <h2 className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-gray-800
                        dark:text-white
                        break-words
                    ">
                        {attempt.noteTitle}
                    </h2>

                    <div className="
                        mt-6
                        text-4xl
                        sm:text-5xl
                        font-bold
                        text-yellow-500
                    ">
                        {attempt.score}/{attempt.totalQuestions}
                    </div>

                    <p className="
                        mt-2
                        text-lg
                        sm:text-xl
                        font-semibold
                        text-gray-600
                        dark:text-gray-300
                    ">
                        {attempt.percentage}%
                    </p>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-3
                    gap-4
                    mt-8
                ">

                    <div className="
                        bg-gray-100
                        dark:bg-gray-700
                        rounded-xl
                        p-4
                        text-center
                    ">

                        <p className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                        ">
                            Score
                        </p>

                        <p className="
                            text-xl
                            font-bold
                            text-gray-800
                            dark:text-white
                            mt-1
                        ">
                            {attempt.score}/{attempt.totalQuestions}
                        </p>

                    </div>


                    <div className="
                        bg-gray-100
                        dark:bg-gray-700
                        rounded-xl
                        p-4
                        text-center
                    ">

                        <p className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                        ">
                            Time Taken
                        </p>

                        <p className="
                            text-xl
                            font-bold
                            text-gray-800
                            dark:text-white
                            mt-1
                        ">
                            {minutes}m {seconds}s
                        </p>

                    </div>


                    <div className="
                        bg-gray-100
                        dark:bg-gray-700
                        rounded-xl
                        p-4
                        text-center
                    ">

                        <p className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                        ">
                            Date
                        </p>

                        <p className="
                            text-sm
                            sm:text-base
                            font-bold
                            text-gray-800
                            dark:text-white
                            mt-1
                        ">
                            {attempt.createdAt
                                ? new Date(
                                    attempt.createdAt
                                ).toLocaleDateString()
                                : "Unknown"}
                        </p>

                    </div>

                </div>


                <div className="
                    flex
                    justify-center
                    mt-8
                ">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="
                            w-full
                            sm:w-auto
                            bg-blue-600
                            hover:bg-blue-700
                            active:scale-95
                            transition
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                        "
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        </div>

    );
}
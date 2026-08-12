import { useNavigate } from "react-router-dom";

export default function DashboardCard({
    title,
    value,
    icon,
    color,
    highestScoreAttempt
}) {

    const navigate = useNavigate();

    const handleClick = () => {

        if (title === "Highest Score") {

            if (!highestScoreAttempt) {
                return;
            }

            navigate("/highest-score", {
                state: {
                    attempt: highestScoreAttempt
                }
            });

            return;
        }

        if (title === "Total Notes") {
            navigate("/notes");
            return;
        }

        if (title === "Total Summaries") {
            navigate("/summary-history");
            return;
        }

        if (title === "Total Quizzes") {
            navigate("/quiz-history");
            return;
        }

    };

    return (

        <div
            onClick={handleClick}
            className={`
                ${color}
                rounded-2xl
                p-4 sm:p-6
                text-white
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-2
                hover:scale-[1.02]
                active:scale-95
                transition-all
                duration-300
                cursor-pointer
            `}
        >

            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                {icon}
            </div>

            <h3 className="text-base sm:text-lg font-semibold opacity-90">
                {title}
            </h3>

            <p className="text-2xl sm:text-3xl font-bold mt-2 sm:mt-3 break-words">
                {value}
            </p>

        </div>

    );
}
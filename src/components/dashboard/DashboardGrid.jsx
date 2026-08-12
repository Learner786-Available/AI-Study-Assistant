import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

export default function DashboardGrid({

  totalNotes,
  totalSummaries,
  totalQuizzes,
  highestScore,
  highestScoreAttempt,
  averageScore,
  lastUpload

}) {

  const navigate = useNavigate();

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">

      <DashboardCard
        title="Total Notes"
        value={totalNotes}
        icon="📚"
        color="bg-blue-600"
        onClick={() => navigate("/notes")}
      />
      <DashboardCard
        title="Total Summaries"
        value={totalSummaries}
        icon="📝"
        color="bg-green-600"
        onClick={() => navigate("/summary-history")}
      />

      <DashboardCard
        title="Total Quizzes"
        value={totalQuizzes}
        icon="❓"
        color="bg-purple-600"
        onClick={() => navigate("/quiz-history")}
      />

      <DashboardCard
    title="Highest Score"
    value={highestScore}
    icon="🏆"
    color="bg-yellow-500"
    highestScoreAttempt={highestScoreAttempt}
    
/>

      <DashboardCard
        title="Average Score"
        value={averageScore}
        icon="📈"
        color="bg-pink-600"
        // onClick={() => navigate("/quiz")}
      />

      <DashboardCard
        title="Last Upload"
        value={lastUpload}
        icon="📄"
        color="bg-gray-700"
      />

    </div>

  );

}
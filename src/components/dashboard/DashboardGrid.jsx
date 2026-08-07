import DashboardCard from "./DashboardCard";

export default function DashboardGrid({

  totalNotes,

  totalSummaries,

  totalQuizzes,

  highestScore,

  averageScore,

  lastUpload

}) {

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">

      <DashboardCard
        title="Total Notes"
        value={totalNotes}
        icon="📚"
        color="bg-blue-600"
      />

      <DashboardCard
        title="Total Summaries"
        value={totalSummaries}
        icon="📝"
        color="bg-green-600"
      />

      <DashboardCard
        title="Total Quizzes"
        value={totalQuizzes}
        icon="❓"
        color="bg-purple-600"
      />

      <DashboardCard
        title="Highest Score"
        value={highestScore}
        icon="🏆"
        color="bg-yellow-500"
      />

      <DashboardCard
        title="Average Score"
        value={averageScore}
        icon="📈"
        color="bg-pink-600"
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
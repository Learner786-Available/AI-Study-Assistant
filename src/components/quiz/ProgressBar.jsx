export default function ProgressBar({

  currentQuestion,

  totalQuestions,

  score

}) {

  const progress =

    totalQuestions > 0

      ? ((currentQuestion + 1) / totalQuestions) * 100

      : 0;

  return (

<div className="mb-8">

    <div className="flex justify-between items-center mb-3">

        <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">

            Question {currentQuestion + 1} / {totalQuestions}

        </span>

        <span className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">

            Score : {score}

        </span>

    </div>

    <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">

        <div

            className="h-full bg-green-500 rounded-full transition-all duration-500"

            style={{ width: `${progress}%` }}

        ></div>

    </div>

</div>

);

}
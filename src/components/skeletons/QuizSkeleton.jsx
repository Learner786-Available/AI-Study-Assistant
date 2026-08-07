export default function QuizSkeleton() {

    return (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">

            <div className="h-8 w-52 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

            <div className="space-y-4">

                <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

                <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

                <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

                <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

                <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

            </div>

            <div className="mt-8 h-12 w-40 bg-blue-300 dark:bg-blue-700 rounded-lg"></div>

        </div>

    );

}
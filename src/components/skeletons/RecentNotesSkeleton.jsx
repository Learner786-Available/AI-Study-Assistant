export default function RecentNotesSkeleton() {

    return (

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-pulse">

            <div className="h-7 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

            {[...Array(5)].map((_, index) => (

                <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-5"
                >

                    <div>

                        <div className="h-5 w-56 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>

                        <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>

                    </div>

                    <div className="flex gap-2">

                        <div className="h-10 w-20 rounded-lg bg-gray-300 dark:bg-gray-700"></div>

                        <div className="h-10 w-20 rounded-lg bg-gray-300 dark:bg-gray-700"></div>

                        <div className="h-10 w-20 rounded-lg bg-gray-300 dark:bg-gray-700"></div>

                        <div className="h-10 w-20 rounded-lg bg-gray-300 dark:bg-gray-700"></div>

                    </div>

                </div>

            ))}

        </div>

    );

}
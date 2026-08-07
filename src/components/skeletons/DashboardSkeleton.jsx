export default function DashboardSkeleton() {

    return (

        <div className="animate-pulse">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {[...Array(6)].map((_, i) => (

                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                    >

                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>

                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>

                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>

                    </div>

                ))}

            </div>

        </div>

    );

}
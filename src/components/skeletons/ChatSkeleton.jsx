export default function ChatSkeleton() {

    return (

        <div className="space-y-5 animate-pulse">

            {/* AI */}

            <div className="flex justify-start">

                <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl w-72 h-16"></div>

            </div>

            {/* User */}

            <div className="flex justify-end">

                <div className="bg-blue-300 dark:bg-blue-800 rounded-2xl w-56 h-14"></div>

            </div>

            {/* AI */}

            <div className="flex justify-start">

                <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl w-80 h-20"></div>

            </div>

        </div>

    );

}
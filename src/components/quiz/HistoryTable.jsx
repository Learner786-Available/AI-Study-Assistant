export default function HistoryTable({

  history

}) {

  if (!history || history.length === 0)

    return null;

  return (

<div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 sm:p-6 transition-all duration-300">

    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">

        📜 Previous Attempts

    </h2>

    {

        history.length === 0 ?

        (

            <div className="text-center py-10 text-gray-500 dark:text-gray-400">

                No Quiz History Found

            </div>

        )

        :

        (

            <div className="overflow-x-auto rounded-xl">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-gray-200 dark:border-gray-700">

                            <th className="text-left py-3 px-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">

                                Attempt

                            </th>

                            <th className="text-left py-3 px-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">

                                Score

                            </th>

                            <th className="text-left py-3 px-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">

                                Date

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            history.map((item,index)=>(

                                <tr

                                    key={index}

                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"

                                >

                                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">

                                        {index+1}

                                    </td>

                                    <td className="py-3 px-2 font-semibold text-blue-600 dark:text-blue-400">

                                        {item.score} / {item.totalQuestions}

                                    </td>

                                    <td className="py-3 px-2 whitespace-nowrap text-gray-600 dark:text-gray-400">

                                        {new Date(item.date).toLocaleString()}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        )

    }

</div>

);

}
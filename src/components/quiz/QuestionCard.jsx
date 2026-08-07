export default function QuestionCard({

  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  setSelectedAnswer,
  checked,
  isCorrect,
  checkAnswer,
  nextQuestion

}) {

  if (!question) return null;

  // Gemini returns A/B/C/D
 const correctLetter = (question.answer || "")
    .trim()
    .toUpperCase();
  return (

    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 sm:p-8 transition-all duration-300">

      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">

        Question {currentQuestion + 1} of {totalQuestions}

      </h2>

      <p className="text-gray-800 dark:text-gray-200 text-lg leading-8 mb-8 break-words">

        {question.question}

      </p>

      <div className="space-y-4">

        {

          (question.options || []).map((option, index) => {

            const optionLetter = String.fromCharCode(65 + index);

            const bg =
              checked
                ? optionLetter === correctLetter
                  ? "bg-green-100 dark:bg-green-900 border-green-500"
                  : selectedAnswer === option
                    ? "bg-red-100 dark:bg-red-900 border-red-500"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-500";

            return (

              <label

                key={index}

                className={`block border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${bg}`}

              >

                <div className="flex items-start">

                  <input

                    type="radio"

                    disabled={checked}

                    checked={selectedAnswer === option}

                    onChange={() => setSelectedAnswer(option)}

                    className="mt-1 mr-4"

                  />

                  <div className="break-words text-gray-800 dark:text-white">

                    <strong className="text-gray-900 dark:text-white">

                      {optionLetter}.

                    </strong>{" "}

                    {

                      option.replace(/^[A-D]\s*[.)]\s*/i, "").trim()

                    }

                  </div>

                </div>

              </label>

            );

          })

        }

      </div>

      {

        !checked ?

          (

            <button

              onClick={checkAnswer}

              className="mt-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-7 py-3 rounded-xl shadow-lg"

            >

              ✅ Check Answer

            </button>

          )

          :

          (

            <>

              {

                isCorrect ?

                  (

                    <div className="mt-8">

                      <p className="text-xl font-bold text-green-600">

                        ✅ Correct!

                      </p>

                    </div>

                  )

                  :

                  (

                    <div className="mt-8">

                      <p className="text-xl font-bold text-red-600">

                        ❌ Wrong Answer

                      </p>

                      <p className="mt-3 font-semibold text-green-600">

                        Correct Answer : {correctLetter}

                      </p>

                      <p className="mt-2 break-words text-gray-700 dark:text-gray-300">

                        {

                          question.options[

                          correctLetter.charCodeAt(0) - 65

                          ]

                        }

                      </p>

                    </div>

                  )

              }

              <button

                onClick={nextQuestion}

                className="mt-8 w-full sm:w-auto bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-7 py-3 rounded-xl shadow-lg"

              >

                {

                  currentQuestion === totalQuestions - 1

                    ?

                    "🎉 View Result"

                    :

                    "➡ Next Question"

                }

              </button>

            </>

          )

      }

    </div>

  );
}
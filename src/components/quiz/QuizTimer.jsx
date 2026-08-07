import { useEffect, useRef, useState } from "react";

export default function QuizTimer({

  duration = 30,

  onTimeUp,

  currentQuestion

}) {

  const [timeLeft, setTimeLeft] = useState(duration);

  // Prevent multiple calls
  const fired = useRef(false);

  // Reset timer on new question
  useEffect(() => {

    setTimeLeft(duration);

    fired.current = false;

  }, [currentQuestion, duration]);

  // Countdown
  useEffect(() => {

    if (timeLeft <= 0) {

      if (!fired.current) {

        fired.current = true;

        onTimeUp();

      }

      return;

    }

    const timer = setTimeout(() => {

      setTimeLeft(prev => prev - 1);

    }, 1000);

    return () => clearTimeout(timer);

  }, [timeLeft]);

  const percentage = (timeLeft / duration) * 100;

  let color = "bg-green-500";

  if (timeLeft <= 20)

    color = "bg-yellow-500";

  if (timeLeft <= 10)

    color = "bg-red-500";
return (

    <div className="mb-6">

      <div className="flex justify-between mb-2">

        <span className="font-semibold text-gray-800 dark:text-white">

          ⏱ Time Left

        </span>

        <span className="font-bold text-gray-800 dark:text-white">

          {timeLeft}s

        </span>

      </div>

      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">

        <div

          className={`${color} h-3 rounded-full transition-all duration-1000`}

          style={{

            width: `${percentage}%`

          }}

        ></div>

      </div>

    </div>

);

}
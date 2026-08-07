import jsPDF from "jspdf";

export default function ResultCard({

  score,

  totalQuestions,

  retryQuiz

}) {

  const percentage = Math.round(

    (score / totalQuestions) * 100

  );

  let grade = "F";
  let remark = "Practice More";

  if (percentage >= 90) {

    grade = "A+";
    remark = "Outstanding";

  }

  else if (percentage >= 80) {

    grade = "A";
    remark = "Excellent";

  }

  else if (percentage >= 70) {

    grade = "B";
    remark = "Very Good";

  }

  else if (percentage >= 60) {

    grade = "C";
    remark = "Good";

  }

  else if (percentage >= 50) {

    grade = "D";
    remark = "Pass";

  }

  const downloadCertificate = () => {

    const doc = new jsPDF();

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Border

    doc.setDrawColor(30, 64, 175);

    doc.setLineWidth(2);

    doc.rect(8, 8, width - 16, height - 16);

    // Header

    doc.setFillColor(37, 99, 235);

    doc.rect(0, 0, width, 30, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(24);

    doc.text(

      "AI Study Assistant",

      width / 2,

      20,

      {

        align: "center"

      }

    );

    doc.setTextColor(0);

    doc.setFontSize(26);

    doc.text(

      "Quiz Completion Certificate",

      width / 2,

      50,

      {

        align: "center"

      }

    );

    doc.setFontSize(14);

    doc.text(

      "This certificate is awarded for successfully completing the AI Quiz.",

      width / 2,

      65,

      {

        align: "center"

      }

    );

    doc.setFontSize(18);

    doc.setFont("helvetica", "bold");

    doc.text(

      `Score: ${score} / ${totalQuestions}`,

      width / 2,

      90,

      {

        align: "center"

      }

    );

    doc.text(

      `Percentage: ${percentage}%`,

      width / 2,

      105,

      {

        align: "center"

      }

    );

    doc.text(

      `Grade: ${grade}`,

      width / 2,

      120,

      {

        align: "center"

      }

    );

    doc.text(

      `Remark: ${remark}`,

      width / 2,

      135,

      {

        align: "center"

      }

    );

    doc.setFont("helvetica", "normal");

    doc.setFontSize(12);

    doc.text(

      `Date: ${new Date().toLocaleString()}`,

      width / 2,

      165,

      {

        align: "center"

      }

    );

    doc.line(60, 220, 150, 220);

    doc.text(

      "AI Study Assistant",

      width / 2,

      228,

      {

        align: "center"

      }

    );

    doc.save("Quiz-Certificate.pdf");

  };

 return (

<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 mt-8 text-center transition-all duration-300">

    <div className="text-6xl mb-4">

        🎉

    </div>

    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">

        Quiz Finished

    </h2>

    <p className="mt-6 text-lg sm:text-2xl text-gray-600 dark:text-gray-300">

        Final Score

    </p>

    <p className="text-5xl sm:text-7xl font-bold text-blue-600 mt-4">

        {score}

        <span className="text-gray-400 text-3xl sm:text-5xl">

            {" "}/ {totalQuestions}

        </span>

    </p>

    <div className="mt-6">

        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-xl font-bold">

            {percentage}%

        </span>

    </div>

    <p className="mt-6 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">

        Grade :

        <span className="ml-2 text-blue-600">

            {grade}

        </span>

    </p>

    {

        percentage >= 50 ?

        (

            <div className="mt-6 text-green-600 dark:text-green-400 text-2xl sm:text-3xl font-bold">

                ✅ {remark}

            </div>

        )

        :

        (

            <div className="mt-6 text-red-600 dark:text-red-400 text-2xl sm:text-3xl font-bold">

                ❌ {remark}

            </div>

        )

    }

    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

        <button

            onClick={retryQuiz}

            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-8 py-3 rounded-xl shadow-lg"

        >

            🔄 Retry Quiz

        </button>

        <button

            onClick={downloadCertificate}

            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-300 text-white px-8 py-3 rounded-xl shadow-lg"

        >

            📄 Download Certificate

        </button>

    </div>

</div>

);

}
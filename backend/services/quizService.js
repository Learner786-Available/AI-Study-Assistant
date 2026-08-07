const { getImportantText } = require("./tfidfService");
const { chatWithGemini } = require("./geminiService");

async function generateQuiz(

    text,

    difficulty = "Medium",

    count = 10

) {

    const importantText = getImportantText(text, 25);

    const prompt = `

You are an expert teacher.

Generate EXACTLY ${count} multiple choice questions.

Difficulty Level:

${difficulty}

Rules:

• Use ONLY the given notes.
• Never use outside knowledge.
• Questions should match the selected difficulty.
• Every question must have exactly 4 options.
• Return ONLY valid JSON.
• No markdown.
• No extra explanation.

Return format:

[
  {
    "question":"...",
    "options":[
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer":"A",
    "explanation":"..."
  }
]

IMPORTANT

• answer must ALWAYS be ONLY

A
B
C
D

• Never return answer text.
• Never return option text.

TEXT:

${importantText}

`;
    console.log(prompt);
    const response = await chatWithGemini(prompt);

    const clean = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let quiz = JSON.parse(clean);
    // console.log(JSON.stringify(quiz, null, 2));

    quiz = quiz.map((q) => {

        let answer = (q.answer || "").toString().trim();

        if (["A", "B", "C", "D"].includes(answer.toUpperCase())) {

            q.answer = answer.toUpperCase();

            return q;

        }

        if (/^[A-D][.)]/i.test(answer)) {

            q.answer = answer[0].toUpperCase();

            return q;

        }

        const index = q.options.findIndex(option =>

            option.toLowerCase().includes(answer.toLowerCase())

        );

        if (index !== -1) {

            q.answer = String.fromCharCode(65 + index);

        }

        return q;

    });

    return quiz;

}

module.exports = {

    generateQuiz

};
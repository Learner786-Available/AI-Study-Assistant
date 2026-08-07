const Note = require("../models/Note");

const { generateQuiz } = require("../services/quizService");


exports.generateQuiz = async (req, res) => {

    try {

        const { noteId, difficulty, count } = req.body;

        if (!noteId) {

            return res.status(400).json({

                success: false,

                message: "noteId missing"

            });

        }

        const note = await Note.findOne({

            _id: noteId,

            userId: req.user.id

        });

        if (!note) {

            return res.status(404).json({

                success: false,

                message: "Note not found"

            });

        }

        const existingQuiz = note.quiz.find(

            q =>

                q.difficulty === difficulty &&

                q.count === count

        );

        if (existingQuiz) {

            console.log("📦 Loaded from MongoDB");

            return res.json({

                success: true,

                quiz: existingQuiz.questions,

                cached: true

            });

        }

        const quiz = await generateQuiz(

            note.text,

            difficulty,

            count

        );

        note.quiz.push({

            difficulty,

            count,

            questions: quiz

        });

        await note.save();

        // console.log("✅ Quiz saved to MongoDB");

        res.json({

            success: true,

            quiz,

            cached: false

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};
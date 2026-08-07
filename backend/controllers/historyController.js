const QuizHistory = require("../models/QuizHistory");

// Save Quiz Result
exports.saveHistory = async (req, res) => {

    try {

        const {
            noteId,
            score,
            totalQuestions,
            percentage,
            timeTaken
        } = req.body;

        const history = await QuizHistory.create({

            userId: req.user.id,

            noteId,

            score,

            totalQuestions,

            percentage,

            timeTaken

        });

        res.json({

            success: true,

            history

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};


// Get Previous Attempts
exports.getHistory = async (req, res) => {

    try {

        const { noteId } = req.params;

        const history = await QuizHistory.find({

            userId: req.user.id,

            noteId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            history

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};


// Get High Score
exports.getHighScore = async (req, res) => {

    try {

        const { noteId } = req.params;

        const highScore = await QuizHistory.findOne({

            userId: req.user.id,

            noteId

        }).sort({

            score: -1

        });

        res.json({

            success: true,

            highScore

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};
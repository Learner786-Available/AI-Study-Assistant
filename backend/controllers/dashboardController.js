const Note = require("../models/Note");
const QuizHistory = require("../models/QuizHistory");

exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const totalNotes = await Note.countDocuments({

            userId

        });

        const totalSummaries = await Note.countDocuments({

            userId,

            summary: {

                $ne: ""

            }

        });

        const userNotes = await Note.find({

            userId

        }).select("_id");

        const noteIds = userNotes.map(note => note._id);

        const totalQuizzes = await QuizHistory.countDocuments({

            noteId: {

                $in: noteIds

            }

        });

        const highest = await QuizHistory.findOne({

            noteId: {

                $in: noteIds

            }

        }).sort({

            score: -1

        });

        const average = await QuizHistory.aggregate([

            {

                $match: {

                    noteId: {

                        $in: noteIds

                    }

                }

            },

            {

                $group: {

                    _id: null,

                    avgScore: {

                        $avg: "$percentage"

                    }

                }

            }

        ]);

        const lastNote = await Note.findOne({

            userId

        }).sort({

            createdAt: -1

        });

        const recentNotes = await Note.find({

            userId

        })

            .sort({

                createdAt: -1

            })

        res.json({

            success: true,

            stats: {

                totalNotes,

                totalSummaries,

                totalQuizzes,

                highestScore: highest

                    ? `${highest.score}/${highest.totalQuestions}`

                    : "0/10",

                averageScore: average.length

                    ? `${Math.round(average[0].avgScore)}%`

                    : "0%",

                lastUpload: lastNote

                    ? lastNote.title

                    : "No Notes"

            },

            notes: recentNotes

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
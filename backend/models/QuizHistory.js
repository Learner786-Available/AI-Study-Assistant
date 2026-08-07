const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema(

    {

        noteId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Note",

            required: true

        },

        score: {

            type: Number,

            required: true

        },

        totalQuestions: {

            type: Number,

            required: true

        },

        percentage: {

            type: Number,

            required: true

        },

        timeTaken: {

            type: Number,

            default: 0

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(

    "QuizHistory",

    quizHistorySchema

);
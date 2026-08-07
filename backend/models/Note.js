const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(

    {

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        title: {

            type: String,

            required: true

        },

        filename: {

            type: String,

            required: true

        },

        filepath: {

            type: String,

            required: true

        },

        text: {

            type: String,

            default: ""

        },

        pages: [
            {
                page: Number,
                text: String
            }
        ],

        isScanned: {

            type: Boolean,

            default: false

        },

        summary: {

            type: String,

            default: ""

        },

        quiz: {

            type: [

                {

                    difficulty: String,

                    count: Number,

                    questions: Array

                }

            ],

            default: []

        },

        chatHistory: {

            type: Array,

            default: []

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(

    "Note",

    noteSchema

);
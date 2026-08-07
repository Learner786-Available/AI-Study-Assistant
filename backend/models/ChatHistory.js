const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(

    {

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        noteId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Note",

            required: true

        },

        userMessage: {

            type: String,

            required: true

        },

        aiReply: {

            type: String,

            required: true

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(

    "ChatHistory",

    chatHistorySchema

);
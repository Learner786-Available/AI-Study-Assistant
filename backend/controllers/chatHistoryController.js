const ChatHistory = require("../models/ChatHistory");

// Save Chat
exports.saveChat = async (req, res) => {

    try {

        const {
            noteId,
            userMessage,
            aiReply
        } = req.body;

        const chat = await ChatHistory.create({

            userId: req.user.id,

            noteId,

            userMessage,

            aiReply

        });

        res.json({

            success: true,

            chat

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

};


// Get Chat History

exports.getChatHistory = async (req, res) => {

    try {

        const history = await ChatHistory.find({

            userId: req.user.id,

            noteId: req.params.noteId

        }).sort({

            createdAt: 1

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
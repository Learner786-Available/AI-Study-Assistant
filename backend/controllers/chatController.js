const Note = require("../models/Note");

const { getImportantText } = require("../services/tfidfService");
const { chatWithGemini } = require("../services/geminiService");

exports.chat = async (req, res) => {

    try {

        const { noteId, message } = req.body;

        if (!noteId || !message) {

            return res.status(400).json({
                success: false,
                message: "noteId or message missing"
            });

        }

        // User ki apni note hi milni chahiye
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

        const importantText = getImportantText(note.text, 25);

        const recentHistory = note.chatHistory.slice(-10);

        const historyText = recentHistory
            .map(chat => `${chat.role.toUpperCase()}: ${chat.content}`)
            .join("\n");

        const prompt = `
You are an AI Study Assistant.

Rules:

• Answer ONLY from the uploaded notes.
• Never use outside knowledge.
• Use previous conversation if it helps answer the current question.
• If the answer is not available in the notes say:
"I couldn't find this information in your uploaded notes."

NOTES:

${importantText}

PREVIOUS CONVERSATION:

${historyText || "No previous conversation."}

CURRENT QUESTION:

${message}
`;

        const reply = await chatWithGemini(prompt);

        // Chat History Save
        note.chatHistory.push({

            role: "user",

            content: message

        });

        note.chatHistory.push({

            role: "assistant",

            content: reply

        });

        // Keep only latest 100 messages
        if (note.chatHistory.length > 100) {

            note.chatHistory = note.chatHistory.slice(-100);

        }

        await note.save();

        res.json({

            success: true,

            reply

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

exports.getChatHistory = async (req, res) => {

    try {

        const { noteId } = req.params;

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

        res.json({

            success: true,

            chatHistory: note.chatHistory

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

exports.clearChat = async (req, res) => {

    try {

        const { noteId } = req.params;

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

        note.chatHistory = [];

        await note.save();

        res.json({

            success: true,

            message: "Chat cleared successfully"

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
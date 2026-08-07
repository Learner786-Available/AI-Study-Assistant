const Note = require("../models/Note");

// ==========================
// Delete Note
// ==========================

exports.deleteNote = async (req, res) => {

    try {

        const note = await Note.findOne({

            _id: req.params.id,

            userId: req.user.id

        });

        if (!note) {

            return res.status(404).json({

                success: false,

                message: "Note not found"

            });

        }

        await Note.findOneAndDelete({

            _id: req.params.id,

            userId: req.user.id

        });

        res.json({

            success: true,

            message: "Note deleted successfully"

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

// ==========================
// Get Single Note
// ==========================

exports.getSingleNote = async (req, res) => {

    try {

        const note = await Note.findOne({

            _id: req.params.id,

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

            note

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
const Note = require("../models/Note");

const { getImportantText } = require("../services/tfidfService");

const { chatWithGemini, extractTextFromImage } = require("../services/geminiService");
const { pdfToImages } = require("../services/ocrService");



exports.summary = async (req, res) => {

    try {

        const { noteId } = req.body;

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

        if (note.summary && note.summary.trim() !== "") {

            return res.json({

                success: true,

                summary: note.summary,

                cached: true

            });

        }

        let fullText = note.text;

        let ocrLimited = false;

        if (note.isScanned) {

            console.log("⚠️ Scanned PDF detected. Starting OCR...");

            const { images, totalPages } = await pdfToImages(note.filepath);

            const MAX_OCR_PAGES = 5;

            const limitedImages = images.slice(0, MAX_OCR_PAGES);

            fullText = "";

            for (const image of limitedImages) {


                const pageText = await extractTextFromImage(image);

                fullText += pageText + "\n";

            }

            ocrLimited = totalPages > MAX_OCR_PAGES;

        }

        let importantText = getImportantText(fullText, 25);
        if (!importantText || importantText.trim().length < 100) {
            importantText = fullText;
        }
        const MAX_CHARS = 12000;

        if (importantText.length > MAX_CHARS) {
            importantText = importantText.substring(0, MAX_CHARS);
        }

        const prompt = `

You are an expert academic assistant.

Create a summary.

Rules:

• Use ONLY the given text.
• No hallucination.
• Bullet points.
• Simple language.

TEXT:

${importantText}

`;

        const summary = await chatWithGemini(prompt);

        note.summary = summary;

        await note.save();

        res.json({

            success: true,

            summary,

            cached: false,

            ocrLimited

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            error:

                err.message.includes("quota")

                    ? "Gemini AI quota exhausted. Please try again later."

                    : err.message

        });

    }

};
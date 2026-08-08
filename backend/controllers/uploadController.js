const { extractText, cleanText } = require("../services/pdfService");
const { pdfToImages } = require("../services/ocrService");
const { extractTextFromImage } = require("../services/geminiService");
const Note = require("../models/Note");
const { sendProgress } = require("../utils/progressManager");
const fs = require("fs");
const {

    startJob,
    cancelJob,
    isCancelled,
    finishJob

} = require("../utils/cancelManager");
const path = require("path");
// const { extractPages } = require("../services/pageExtractor");

const MAX_OCR_PAGES = 5;

exports.uploadFile = async (req, res) => {

    try {

        console.log("========== Upload Started ==========");

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No file uploaded"

            });

        }

        startJob(req.user.id);

        sendProgress(

            req.user.id,

            {

                stage: "Uploading PDF...",

                currentPage: 0,

                totalPages: 0

            }

        );

        const absoluteFilePath = path.resolve(req.file.path);


        console.log("FILE PATH:", req.file.path);
        console.log("ABSOLUTE FILE PATH:", absoluteFilePath);

        const result = await extractText(absoluteFilePath);

        sendProgress(

            req.user.id,

            {

                stage: "Reading PDF...",

                currentPage: 0,

                totalPages: result.totalPages

            }

        );

        let text = cleanText(result.text);

        const totalPages = result.totalPages;
        // const pages = await extractPages(req.file.path);

        const isScanned = text.length < 500;

        if (isScanned) {

            console.log("⚠️ Scanned PDF detected.");

            const { images } = await pdfToImages(req.file.path);

            let ocrText = "";

            for (let i = 0; i < Math.min(images.length, MAX_OCR_PAGES); i++) {

                if (isCancelled(req.user.id)) {

                    console.log("Upload Cancelled");

                    finishJob(req.user.id);

                    return res.status(499).json({

                        success: false,

                        message: "Upload Cancelled"

                    });

                }

                sendProgress(

                    req.user.id,

                    {

                        stage: "Running OCR...",

                        currentPage: i + 1,

                        totalPages: Math.min(images.length, MAX_OCR_PAGES)

                    }

                );

                ocrText += await extractTextFromImage(images[i]);

                ocrText += "\n";

            }

            text = cleanText(ocrText);

        }

        sendProgress(
            req.user.id,
            {
                stage: "Saving Note...",
                currentPage: isScanned
                    ? Math.min(totalPages, 5)
                    : totalPages,
                totalPages: isScanned
                    ? Math.min(totalPages, 5)
                    : totalPages
            }
        );

        console.log("Saving Note...");

        const note = await Note.create({

            userId: req.user.id,

            title: req.file.originalname.replace(".pdf", ""),

            filename: req.file.filename,

            filepath: absoluteFilePath,

            text,

            // pages,

            isScanned,

            summary: "",

            quiz: [],

            chatHistory: []

        });

        console.log("Note Saved");

        finishJob(req.user.id);

        sendProgress(

            req.user.id,

            {

                stage: "Completed",

                currentPage: isScanned
                    ? Math.min(totalPages, MAX_OCR_PAGES)
                    : totalPages,

                totalPages: isScanned
                    ? Math.min(totalPages, MAX_OCR_PAGES)
                    : totalPages

            }

        );

        return res.status(200).json({

            success: true,

            message: "File Uploaded Successfully",

            note,

            totalPages,

            isScanned,

            ocrLimited: isScanned && totalPages > 5

        });

    }

    catch (error) {
        finishJob(req.user.id);
        sendProgress(
            req.user.id,
            {
                stage: "Failed",
                currentPage: 0,
                totalPages: 0,
                error: true
            }
        );

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message.includes("quota")
                    ? "AI OCR quota exhausted. Please try again later."
                    : error.message

        });

    }

};
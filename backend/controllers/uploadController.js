const { extractText, cleanText } = require("../services/pdfService");
const { pdfToImages } = require("../services/ocrService");
const { extractTextFromImage } = require("../services/geminiService");
const Note = require("../models/Note");
const { sendProgress } = require("../utils/progressManager");
const {
    startJob,
    isCancelled,
    finishJob
} = require("../utils/cancelManager");

const fs = require("fs");
const path = require("path");

const MAX_OCR_PAGES = 5;

exports.uploadFile = async (req, res) => {

    try {

        console.log("========== Upload Started ==========");

        // --------------------------------
        // 1. Check uploaded file
        // --------------------------------

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });

        }

        console.log("FILE NAME:", req.file.originalname);
        console.log("FILE PATH:", req.file.path);

        // --------------------------------
        // 2. Get absolute file path
        // --------------------------------

        const absoluteFilePath = path.resolve(req.file.path);

        console.log("ABSOLUTE FILE PATH:", absoluteFilePath);

        // --------------------------------
        // 3. Check if file actually exists
        // --------------------------------

        const fileExists = fs.existsSync(absoluteFilePath);

        console.log("FILE EXISTS:", fileExists);

        if (!fileExists) {

            return res.status(500).json({

                success: false,

                message: "Uploaded file was not found on server",

                path: absoluteFilePath

            });

        }

        // --------------------------------
        // 4. Start progress job
        // --------------------------------

        startJob(req.user.id);

        sendProgress(
            req.user.id,
            {
                stage: "Uploading PDF...",
                currentPage: 0,
                totalPages: 0
            }
        );

        // --------------------------------
        // 5. Extract PDF text
        // --------------------------------

        console.log("Reading PDF from:", absoluteFilePath);

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

        console.log("PDF TOTAL PAGES:", totalPages);
        console.log("EXTRACTED TEXT LENGTH:", text.length);

        // --------------------------------
        // 6. Check scanned PDF
        // --------------------------------

        const isScanned = text.length < 500;

        if (isScanned) {

            console.log("⚠️ Scanned PDF detected.");

            // IMPORTANT:
            // Use absolute path here as well
            const { images } = await pdfToImages(
                absoluteFilePath
            );

            let ocrText = "";

            for (
                let i = 0;
                i < Math.min(images.length, MAX_OCR_PAGES);
                i++
            ) {

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
                        totalPages: Math.min(
                            images.length,
                            MAX_OCR_PAGES
                        )
                    }
                );

                ocrText += await extractTextFromImage(
                    images[i]
                );

                ocrText += "\n";

            }

            text = cleanText(ocrText);

            console.log(
                "OCR TEXT LENGTH:",
                text.length
            );

        }

        // --------------------------------
        // 7. Saving note
        // --------------------------------

        sendProgress(
            req.user.id,
            {
                stage: "Saving Note...",

                currentPage: isScanned
                    ? Math.min(totalPages, MAX_OCR_PAGES)
                    : totalPages,

                totalPages: isScanned
                    ? Math.min(totalPages, MAX_OCR_PAGES)
                    : totalPages
            }
        );

        console.log("Saving Note...");

        // --------------------------------
        // 8. Create MongoDB note
        // --------------------------------

        const note = await Note.create({

            userId: req.user.id,

            title: req.file.originalname.replace(
                /\.pdf$/i,
                ""
            ),

            filename: req.file.filename,

            filepath: absoluteFilePath,

            text,

            isScanned,

            summary: "",

            quiz: [],

            chatHistory: []

        });

        console.log("Note Saved");

        // --------------------------------
        // 9. Finish job
        // --------------------------------

        finishJob(req.user.id);

        sendProgress(
            req.user.id,
            {
                stage: "Completed",

                currentPage: isScanned
                    ? Math.min(
                        totalPages,
                        MAX_OCR_PAGES
                    )
                    : totalPages,

                totalPages: isScanned
                    ? Math.min(
                        totalPages,
                        MAX_OCR_PAGES
                    )
                    : totalPages
            }
        );

        // --------------------------------
        // 10. Send response
        // --------------------------------

        return res.status(200).json({

            success: true,

            message: "File Uploaded Successfully",

            note,

            totalPages,

            isScanned,

            ocrLimited:
                isScanned &&
                totalPages > MAX_OCR_PAGES

        });

    }

    catch (error) {

        console.error(
            "========== UPLOAD ERROR =========="
        );

        console.error(error);

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

        return res.status(500).json({

            success: false,

            message:
                error.message &&
                error.message.includes("quota")

                    ? "AI OCR quota exhausted. Please try again later."

                    : error.message

        });

    }

};
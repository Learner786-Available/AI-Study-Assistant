const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

async function extractText(filePath) {

    const absolutePath = path.resolve(filePath);

    const buffer = fs.readFileSync(absolutePath);

    const result = await pdfParse(buffer);

    return {
        text: result.text || "",
        totalPages: result.numpages || 0
    };
}

function cleanText(text) {

    return text
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

module.exports = {

    extractText,
    cleanText

};
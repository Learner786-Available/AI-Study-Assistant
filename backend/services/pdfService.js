const fs = require("fs");
const pdfParse = require("pdf-parse");

async function extractText(filePath) {

    const buffer = fs.readFileSync(filePath);

    const result = await pdfParse(buffer);

    return {

        text: result.text || "",

        totalPages: result.numpages || 0,

        //  pages

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
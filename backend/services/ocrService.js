const { pdf } = require("pdf-to-img");

async function pdfToImages(pdfPath) {

    const images = [];

    const document = await pdf(pdfPath);

    for await (const image of document) {
        images.push(image);
    }

    return {
        images,
        totalPages: images.length
    };

}

module.exports = {
    pdfToImages
};
const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

async function extractTextFromImage(imagePath) {

    const [result] = await client.textDetection(imagePath);

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
        return "";
    }

    return detections[0].description;
}

module.exports = {
    extractTextFromImage
};
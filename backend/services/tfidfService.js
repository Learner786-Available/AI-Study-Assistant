const natural = require("natural");
const sw = require("stopword");

function splitIntoSentences(text) {

    let sentences = text
        .replace(/\n+/g, ". ")
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20);

    if (sentences.length === 0) {

        sentences = text
            .split("\n")
            .map(s => s.trim())
            .filter(s => s.length > 20);

    }

    return sentences;
}

function getImportantText(text, topN = 25) {

    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) {
        return text.substring(0, 12000);
    }

    const tfidf = new natural.TfIdf();

    sentences.forEach(sentence => {

        const cleaned = sw.removeStopwords(
            sentence.toLowerCase().split(/\s+/)
        ).join(" ");

        tfidf.addDocument(cleaned);

    });

    let scores = [];

    sentences.forEach((sentence, index) => {

        let score = 0;

        tfidf.listTerms(index).slice(0, 10).forEach(term => {

            score += term.tfidf;

        });

        scores.push({
            sentence,
            score
        });

    });

    scores.sort((a, b) => b.score - a.score);

    return scores
        .slice(0, topN)
        .map(x => x.sentence)
        .join("\n");
}

module.exports = {
    getImportantText
};
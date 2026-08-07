const { GEMINI_API_KEY } = require("../config/gemini");

// const MODEL = "gemini-2.5-flash";
const MODEL = "gemini-3.1-flash-lite";

async function chatWithGemini(prompt) {

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        try {

            const response = await fetch(

                `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        contents: [

                            {

                                parts: [

                                    {

                                        text: prompt

                                    }

                                ]

                            }

                        ]

                    })

                }

            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.error?.message || "Gemini Chat Error");

            }

            return data.candidates[0].content.parts[0].text;

        }

        catch (err) {

            const message = err.message || "";


            // ❌ Quota
            if (

                message.toLowerCase().includes("quota") ||

                message.includes("RESOURCE_EXHAUSTED") ||

                message.includes("429")

            ) {

                throw new Error(
                    "Gemini free quota has been exhausted. Please try again later."
                );

            }

            // ❌ Invalid API Key
            if (

                message.includes("API key") ||

                message.includes("API_KEY_INVALID")

            ) {

                throw err;

            }

            // ✅ Retry only for temporary errors
            const retryable =

                message.includes("high demand") ||

                message.includes("currently experiencing") ||

                message.includes("fetch failed") ||

                message.includes("ENOTFOUND") ||

                message.includes("ECONNRESET") ||

                message.includes("ETIMEDOUT");

            if (!retryable || attempt === MAX_RETRIES) {

                throw err;

            }


            await sleep(3000);

        }

    }

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractTextFromImage(imageBuffer) {

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        try {

            const response = await fetch(

                `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        contents: [

                            {

                                parts: [

                                    {

                                        inlineData: {

                                            mimeType: "image/png",

                                            data: imageBuffer.toString("base64")

                                        }

                                    },

                                    {

                                        text: "Extract ALL text exactly as written. Do NOT summarize."

                                    }

                                ]

                            }

                        ]

                    })

                }

            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.error?.message || "Gemini OCR Error");

            }

            return data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        }

        catch (err) {

            const message = err.message || "";

            // ❌ Quota exhausted → retry mat karo
            if (

                message.toLowerCase().includes("quota") ||

                message.includes("RESOURCE_EXHAUSTED") ||

                message.includes("429")

            ) {

                throw new Error(
                    "Gemini free quota has been exhausted. Please try again later."
                );

            }

            // ❌ Invalid API Key → retry mat karo
            if (
                message.includes("API key") ||
                message.includes("API_KEY_INVALID")
            ) {

                throw err;

            }

            // ✅ Sirf temporary errors par retry
            const retryable =

                message.includes("high demand") ||
                message.includes("currently experiencing") ||
                message.includes("fetch failed") ||
                message.includes("ENOTFOUND") ||
                message.includes("ECONNRESET") ||
                message.includes("ETIMEDOUT");

            if (!retryable || attempt === MAX_RETRIES) {

                throw err;

            }

            console.log(`Retrying in 3 seconds... (${attempt}/${MAX_RETRIES})`);

            await sleep(3000);

        }

    }

}

module.exports = {

    chatWithGemini,
    extractTextFromImage

};
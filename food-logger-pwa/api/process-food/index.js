const axios = require('axios');

// This is the main function that Azure will run
module.exports = async function (context, req) {
    // --- NEW: Top-level error catching to see any crash ---
    try {
        // --- GEMINI API INTEGRATION ---
        const parseWithGemini = async (text) => {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                // This specific error is a common cause of failure
                throw new Error("CRITICAL: GEMINI_API_KEY environment variable is not set in Azure Configuration.");
            }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const prompt = `Parse the following user input to identify food items and their quantities. Return the result as a valid JSON array of objects, where each object has an "item" and a "quantity" key. User input: "${text}"`;
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: { item: { type: "STRING" }, quantity: { type: "STRING" } },
                            required: ["item", "quantity"]
                        }
                    }
                }
            };
            try {
                const response = await axios.post(url, payload);
                const jsonText = response.data.candidates[0].content.parts[0].text;
                return JSON.parse(jsonText);
            } catch (error) {
                context.log.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
                throw new Error("Failed to parse food items with AI.");
            }
        };

        // --- MOCK NUTRITION DATABASE ---
        const getNutritionalInfo = (item) => {
            const db = {
                'aloo paratha': { calories: 180, protein: 4, carbs: 28, fat: 6 },
                'green chutney': { calories: 15, protein: 1, carbs: 3, fat: 0 },
                'oats': { calories: 150, protein: 5, carbs: 27, fat: 3 },
                'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
                'unknown food': { calories: 100, protein: 5, carbs: 10, fat: 4 },
            };
            const lowerCaseItem = item.toLowerCase();
            for (const key in db) {
                if (lowerCaseItem.includes(key)) {
                    return db[key];
                }
            }
            return db['unknown food'];
        };

        // --- Function Logic ---
        const { text } = req.body;
        if (!text) {
            context.res = { status: 400, body: "Please pass the 'text' in the request body" };
            return;
        }

        const parsedItems = await parseWithGemini(text);
        const enrichedItems = parsedItems.map(foodItem => {
            const nutrition = getNutritionalInfo(foodItem.item);
            return {
                id: `${Date.now()}-${Math.random()}`,
                name: foodItem.item,
                quantity: foodItem.quantity,
                ...nutrition,
            };
        });
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: enrichedItems
        };

    } catch (error) {
        // --- NEW: If anything fails, send back the detailed error message ---
        context.log.error("Function failed:", error);
        context.res = {
            status: 500,
            body: { 
                error: "The API function crashed.",
                message: error.message, // The specific error
                stack: error.stack // The line number of the error
            }
        };
    }
}
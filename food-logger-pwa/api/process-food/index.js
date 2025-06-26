const axios = require('axios');

// This is the main function that Azure will run
module.exports = async function (context, req) {
    // --- NEW: Top-level error catching to see any crash ---
    try {
        // --- GEMINI API INTEGRATION ---
        const parseWithGemini = async (text) => {
            const apiKey = process.env.GEMINI_API_KEY; // must be set in Azure
            if (!apiKey) {
                throw new Error("CRITICAL: GEMINI_API_KEY environment variable is not set in Azure Configuration.");
            }

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            // Updated prompt: ask Gemini to return full nutritional info
            const prompt =
                `Parse the following user input to identify food items and their quantities. ` +
                `For each item, also provide its nutritional information: Calorie (kcal per item), ` +
                `Carbs (grams per item), Fat (grams per item), Protein (grams per item), and Fibre (grams per item). ` +
                `Return the result as a valid JSON array of objects, where each object has 'item', 'quantity', ` +
                `'Calorie', 'Carbs', 'Fat', 'Protein', and 'Fibre' keys. User input: "${text}"`;

            const payload = { contents: [{ parts: [{ text: prompt }] }] };

            try {
                const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
                let jsonText = response.data.candidates[0].content.parts[0].text;
                const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
                if (match && match[1]) jsonText = match[1];

                try {
                    return JSON.parse(jsonText);
                } catch (parseErr) {
                    // Return raw text and error for debugging
                    throw {
                        message: "Gemini API returned invalid JSON.",
                        raw: jsonText,
                        parseError: parseErr.message
                    };
                }
            } catch (error) {
                // Return full error details for debugging
                throw {
                    message: "Failed to call Gemini API or parse its response.",
                    axiosError: error.response ? error.response.data : error.message,
                    stack: error.stack
                };
            }
        };

        // --- Function Logic ---

        const { text, meal } = req.body;
        if (!text || !meal) {
            context.res = { status: 400, body: { error: 'Text and meal are required' } };
            return;
        }

        context.log(`Processing with Gemini for ${meal}: "${text}"`);


        // 1. Parse text with Gemini to get individual items and their nutritional info
        let parsedItems;
        try {
            parsedItems = await parseWithGemini(text);
        } catch (err) {
            // Return all error details to the browser
            context.res = {
                status: 500,
                body: {
                    error: "Gemini API error",
                    details: err
                }
            };
            return;
        }

        // 2. Map Gemini response to the desired output structure
        const enrichedItems = parsedItems.map(foodItem => {
            // Ensure all expected nutritional fields are present, provide defaults if necessary
            return {
                id: `${Date.now()}-${Math.random()}`,
                name: foodItem.item,
                quantity: foodItem.quantity,
                calories: foodItem.Calorie !== undefined ? foodItem.Calorie : 0,
                protein: foodItem.Protein !== undefined ? foodItem.Protein : 0,
                carbs: foodItem.Carbs !== undefined ? foodItem.Carbs : 0,
                fat: foodItem.Fat !== undefined ? foodItem.Fat : 0,
                fibre: foodItem.Fibre !== undefined ? foodItem.Fibre : 0,
            };
        });

        context.log('Processed Items:', enrichedItems);
        context.res = { body: enrichedItems };

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
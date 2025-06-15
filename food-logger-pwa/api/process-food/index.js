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
                const response = await axios.post(url, payload);

                // Gemini sometimes wraps JSON in ```json fences – strip them if present
                let jsonText = response.data.candidates[0].content.parts[0].text;
                const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
                if (match && match[1]) jsonText = match[1];

                return JSON.parse(jsonText);
            } catch (error) {
                context.log.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
                throw new Error("Failed to parse food items with AI.");
            }
        };

        // --- Function Logic ---
        const { text, meal } = req.body; // 'meal' kept for API parity, currently unused

        if (!text) {
            context.res = { status: 400, body: "Please pass the 'text' in the request body" };
            return;
        }

        const parsedItems = await parseWithGemini(text);

        const enrichedItems = parsedItems.map(foodItem => ({
            id: `${Date.now()}-${Math.random()}`,   // unique id
            name: foodItem.item,
            quantity: foodItem.quantity,
            calories: foodItem.Calorie  ?? 0,
            protein:  foodItem.Protein  ?? 0,
            carbs:    foodItem.Carbs    ?? 0,
            fat:      foodItem.Fat      ?? 0,
            fibre:    foodItem.Fibre    ?? 0,
        }));

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
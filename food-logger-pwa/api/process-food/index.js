const { parseFoodWithAzureAI } = require('../../src/ai/azure');

// This is the main function that Azure will run
module.exports = async function (context, req) {
    // --- NEW: Top-level error catching to see any crash ---
    try {


        // --- AZURE OPENAI INTEGRATION (from shared ai/azure.js) ---
        const apiKey = process.env.AZURE_OPENAI_API_KEY || "<your-api-key>";
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://codemigration-resource.cognitiveservices.azure.com/";
        const modelName = process.env.AZURE_OPENAI_MODEL || "o3-mini";
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "o3-mini";


        // --- Function Logic ---

        const { text, meal } = req.body;
        if (!text || !meal) {
            context.res = { status: 400, body: { error: 'Text and meal are required' } };
            return;
        }

        context.log(`Processing with Azure OpenAI for ${meal}: "${text}"`);


        // 1. Parse text with Azure OpenAI to get individual items and their nutritional info
        let parsedItems;
        try {
            parsedItems = await parseFoodWithAzureAI(text, { endpoint, apiKey, deployment, apiVersion, modelName });
        } catch (err) {
            // Return all error details to the browser
            context.res = {
                status: 500,
                body: {
                    error: "Azure OpenAI error",
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
// server/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Use dotenv to load environment variables

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- MOCK NUTRITION DATABASE ---
// This acts as our local database for nutritional information.
const getNutritionalInfo = (item) => {
    console.log(`Fetching nutrition for: ${item}`);
    const db = {
        'aloo paratha': { calories: 180, protein: 4, carbs: 28, fat: 6 },
        'green chutney': { calories: 15, protein: 1, carbs: 3, fat: 0 },
        'oats': { calories: 150, protein: 5, carbs: 27, fat: 3 },
        'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
        'unknown food': { calories: 100, protein: 5, carbs: 10, fat: 4 },
    };
    // A more robust lookup to find partial matches
    const lowerCaseItem = item.toLowerCase();
    for (const key in db) {
        if (lowerCaseItem.includes(key)) {
            return db[key];
        }
    }
    return db['unknown food'];
};


// --- GEMINI API INTEGRATION ---
const parseWithGemini = async (text) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // The prompt instructs the model to return a structured JSON object.
    const prompt = `Parse the following user input to identify food items and their quantities. Return the result as a valid JSON array of objects, where each object has an "item" and a "quantity" key. User input: "${text}"`;

    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            // Define the JSON schema for the expected response
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        item: {
                            type: "STRING"
                        },
                        quantity: {
                            type: "STRING"
                        },
                    },
                    required: ["item", "quantity"]
                }
            }
        }
    };

    try {
        const response = await axios.post(url, payload);
        // The response from Gemini with a defined schema is directly in response.data.candidates[0].content.parts[0].text as a JSON string
        const jsonText = response.data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        throw new Error("Failed to parse food items with AI.");
    }
};


app.post('/api/process-food', async (req, res) => {
    const { text, meal } = req.body;

    if (!text || !meal) {
        return res.status(400).send({ error: 'Text and meal are required' });
    }

    console.log(`Processing with Gemini for ${meal}: "${text}"`);

    try {
        // 1. Parse text with Gemini to get individual items
        const parsedItems = await parseWithGemini(text);

        // 2. Enrich with nutritional data (from our mock DB)
        const enrichedItems = parsedItems.map(foodItem => {
            const nutrition = getNutritionalInfo(foodItem.item);
            return {
                id: `${Date.now()}-${Math.random()}`, // unique id
                name: foodItem.item,
                quantity: foodItem.quantity,
                ...nutrition,
            };
        });

        console.log('Processed Items:', enrichedItems);
        res.json(enrichedItems);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

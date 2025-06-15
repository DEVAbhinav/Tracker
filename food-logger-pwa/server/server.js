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
// This function will no longer be used as nutritional info is fetched from Gemini.
/*
const getNutritionalInfo = (item) => {
    console.log(`Fetching nutrition for: ${item}`);
    const db = {
        'aloo paratha': { calories: 180, protein: 4, carbs: 28, fat: 6, fibre: 4 }, // Added fibre for completeness
        'green chutney': { calories: 15, protein: 1, carbs: 3, fat: 0, fibre: 1 },
        'oats': { calories: 150, protein: 5, carbs: 27, fat: 3, fibre: 4 },
        'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fibre: 3.1 },
        'unknown food': { calories: 100, protein: 5, carbs: 10, fat: 4, fibre: 2 },
    };
    const lowerCaseItem = item.toLowerCase();
    for (const key in db) {
        if (lowerCaseItem.includes(key)) {
            return db[key];
        }
    }
    return db['unknown food'];
};
*/

// --- GEMINI API INTEGRATION ---
const parseWithGemini = async (text) => {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBXrX1YV3fncj0_YoRbtwRRIKFkMmFROW0"; // Default for local testing, remove in production
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Updated prompt to ask for detailed nutritional information
    const prompt = `Parse the following user input to identify food items and their quantities. For each item, also provide its nutritional information: Calorie (kcal per item), Carbs (grams per item), Fat (grams per item), Protein (grams per item), and Fibre (grams per item). Return the result as a valid JSON array of objects, where each object has 'item', 'quantity', 'Calorie', 'Carbs', 'Fat', 'Protein', and 'Fibre' keys. User input: "${text}"`;

    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await axios.post(url, payload);
        let jsonText = response.data.candidates[0].content.parts[0].text;

        const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            jsonText = match[1];
        }

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        if (error.response && error.response.data && error.response.data.error) {
            console.error("Gemini API Error Details:", JSON.stringify(error.response.data.error, null, 2));
        }
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
        // 1. Parse text with Gemini to get individual items and their nutritional info
        const parsedItems = await parseWithGemini(text);

        // 2. Map Gemini response to the desired output structure
        const enrichedItems = parsedItems.map(foodItem => {
            // Ensure all expected nutritional fields are present, provide defaults if necessary
            return {
                id: `${Date.now()}-${Math.random()}`, // unique id
                name: foodItem.item,
                quantity: foodItem.quantity,
                calories: foodItem.Calorie !== undefined ? foodItem.Calorie : 0,
                protein: foodItem.Protein !== undefined ? foodItem.Protein : 0,
                carbs: foodItem.Carbs !== undefined ? foodItem.Carbs : 0,
                fat: foodItem.Fat !== undefined ? foodItem.Fat : 0,
                fibre: foodItem.Fibre !== undefined ? foodItem.Fibre : 0,
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
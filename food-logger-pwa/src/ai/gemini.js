import axios from 'axios';

/**
 * Calls Gemini API to parse food text and return nutrition info.
 * @param {string} text - User input describing food.
 * @param {string} apiKey - Gemini API key.
 * @returns {Promise<Array>} Array of food items with nutrition info.
 */
export async function parseFoodWithGemini(text, apiKey) {
  if (!apiKey) throw new Error('GEMINI_API_KEY is required');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const prompt =
    `Parse the following user input to identify food items and their quantities. ` +
    `For each item, also provide its nutritional information: Calorie (kcal per item), ` +
    `Carbs (grams per item), Fat (grams per item), Protein (grams per item), and Fibre (grams per item). ` +
    `Return the result as a valid JSON array of objects, where each object has 'item', 'quantity', ` +
    `'Calorie', 'Carbs', 'Fat', 'Protein', and 'Fibre' keys. User input: "${text}"`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
  let jsonText = response.data.candidates[0].content.parts[0].text;
  const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) jsonText = match[1];
  return JSON.parse(jsonText);
}

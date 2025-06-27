import { AzureOpenAI } from "openai";

/**
 * Calls Azure OpenAI to parse food text and return nutrition info.
 * @param {string} text - User input describing food.
 * @param {object} options - Azure OpenAI config: { endpoint, apiKey, deployment, apiVersion, modelName }
 * @returns {Promise<Array>} Array of food items with nutrition info.
 */
export async function parseFoodWithAzureAI(text, options) {
  const { endpoint, apiKey, deployment, apiVersion, modelName } = options;
  if (!endpoint || !apiKey || !deployment || !apiVersion || !modelName) {
    throw new Error("All Azure OpenAI options are required");
  }
  const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });

  const prompt =
    `Parse the following user input to identify food items and their quantities. ` +
    `For each item, also provide its nutritional information: Calorie (kcal per item), ` +
    `Carbs (grams per item), Fat (grams per item), Protein (grams per item), and Fibre (grams per item). ` +
    `Return the result as a valid JSON array of objects, where each object has 'item', 'quantity', ` +
    `'Calorie', 'Carbs', 'Fat', 'Protein', and 'Fibre' keys. User input: "${text}"`;

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2048,
      model: modelName
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }
    // Try to extract JSON from the response
    const content = response.choices[0].message.content;
    const match = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonText = match && match[1] ? match[1] : content;
    return JSON.parse(jsonText);
  } catch (error) {
    // Return detailed error info for logging/debugging
    return Promise.reject({
      message: error.message,
      stack: error.stack,
      response: error.response || undefined,
      rawError: error
    });
  }
}

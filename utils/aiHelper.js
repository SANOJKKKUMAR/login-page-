

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function suggestCategory(description) {
    console.log("calling ai funciotn  --------------ssssssssssssssss-s-s----------------s");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Suggest the best expense category for this description: "${description}". 
    Choose from: Food, Travel, Shopping, Entertainment, Health, Bills, Education, Others.
    Return only the category name.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log("AI suggested category:", text);
    return text;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Others"; // default fallback
  }
}

module.exports = { suggestCategory };

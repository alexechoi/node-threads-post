const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateThread = async (prompt) => {
  try {
    console.log(`Generating Threads post for theme: ${prompt}`);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a social media expert who writes engaging Threads posts." },
        { role: "user", content: `Create an engaging Threads post about: ${prompt}` },
      ],
      max_tokens: 280,
    });

    const generatedText = response.choices[0]?.message?.content?.trim() || "Default post content";
    
    return generatedText.length > 280 ? generatedText.slice(0, 277) + "..." : generatedText;
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
};

// Export using CommonJS
module.exports = { generateThread };

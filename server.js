const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // ✅ Allow frontend requests
app.use(express.json()); // ✅ Parse JSON requests

app.post('/generate', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ API key not found!");
        return res.status(500).json({ error: "API key not found" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = req.body.prompt;
    if (!prompt) {
        console.error("❌ No prompt provided!");
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        console.log("🚀 Generating response for:", prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ Response:", text);
        res.json({ result: text });
    } catch (error) {
        console.error("❌ Error generating content:", error);
        res.status(500).json({ error: "Error generating content" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
});

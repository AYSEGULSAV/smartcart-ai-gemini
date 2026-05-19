const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Hata: .env dosyasında GEMINI_API_KEY tanımlanmamış!");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = ai;
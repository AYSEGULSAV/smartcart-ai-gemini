const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Sen bir e-ticaret sitesinin akıllı yemek ve alışveriş asistanısın.
Kullanıcının verdiği malzemelere göre yaratıcı bir tarif üretmeli, kullanıcının elinde olmayan ama tarife lezzet katacak 2-3 eksik malzemeyi belirlemelisin.
Sitenin deposunda "Kampanyalı/Stok Fazlası" olan malzemeleri de tarife dahil etmeye çalışarak stok eritmeye destek olmalısın.`;

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingIngredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          genericName: { type: Type.STRING },
          reason: { type: Type.STRING },
          isStokEritme: { type: Type.BOOLEAN }
        },
        required: ["genericName", "reason", "isStokEritme"]
      }
    }
  },
  required: ["recipeName", "instructions", "missingIngredients"]
};

async function generateSmartRecipe(userIngredients, stockDiscountsContext) {
  try {
    const userMessage = `Elimdeki malzemeler: ${userIngredients.join(', ')}. Stok eritme ürün listesi: ${JSON.stringify(stockDiscountsContext)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Hatası:", error);
    throw error;
  }
}

module.exports = { generateSmartRecipe };
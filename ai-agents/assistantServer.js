const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ajanları içeri aktar
const { processEventAgent } = require('./src/agents/eventAgent');
const { processRecipeAgent } = require('./src/agents/recipeAgent');
const { processPortionAgent } = require('./src/agents/portionAgent');

const app = express();
app.use(cors());
app.use(express.json());

// Yeni ve kararlı SDK kurulumu
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORT = process.env.PORT || 5001;

// Basitleştirilmiş, kararlı AI fonksiyonu
async function getAIResponse(systemInstruction, userMessages) {
    // Listeden doğruladığımız en yeni ve uygun modeli kullanıyoruz
    const model = genAI.getGenerativeModel({ 
        model: "models/gemini-3.5-flash", 
        systemInstruction: systemInstruction 
    });

    try {
        const result = await model.generateContent({
            contents: userMessages,
            generationConfig: { responseMimeType: "application/json" }
        });
        
        return result.response.text();
    } catch (error) {
        console.error("❌ Model çağrısı başarısız:", error);
        throw error;
    }
}
app.post('/api/assistant/chat', async (req, res) => {
    try {
        const { messages, currentInventory, dbSample } = req.body;

        // 1. Ajan talimatlarını al
        const eventInstruction = await processEventAgent(messages);
        const recipeInstruction = await processRecipeAgent(currentInventory, dbSample);
        const portionInstruction = await processPortionAgent();

        // 2. Ana talimatı oluştur
        const masterSystemInstruction = `
        Sen SmartCart orkestrasyon merkezisin. Aşağıdaki 3 ajanın talimatlarını sırayla işle:
        ${eventInstruction}
        ${recipeInstruction}
        ${portionInstruction}
        
        [KATI ÇIKTI KURALI]
        Sadece geçerli bir JSON döndür. Başka hiçbir açıklama, Markdown veya yorum satırı ekleme.
        {
            "assistantReply": "Sıcak şef yanıtı.",
            "activeConcept": "Konsept ve kişi sayısı",
            "proposedMenu": "Yemek adı",
            "evEnvanteri": ["Malzeme 1"],
            "missingItems": [
                { "name": "Ürün", "price": 0.0, "category": "Kategori", "quantity": 1, "reason": "Açıklama" }
            ]
        }`;

        // 3. Mesajları hazırla
        const formattedMessages = [
            { role: "user", parts: [{ text: "Analiz et ve JSON yanıt üret." }] },
            ...messages
        ];

        // 4. AI'ı çağır
        const rawResponse = await getAIResponse(masterSystemInstruction, formattedMessages);
        
const cleanedJson = rawResponse.trim().replace(/```json|```/g, '');
        res.json({ success: true, data: JSON.parse(cleanedJson) });

    } catch (error) {
        console.error("Orkestrasyon hatası:", error);
        res.status(500).json({ success: false, error: "AI servis hatası." });
    }
});

// Sadece bir kez çalışacak model listeleme fonksiyonu
async function checkAvailableModels() {
    try {
        console.log("🔍 API'den gelen mevcut modeller sorgulanıyor...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("✅ API'nizin erişebildiği modeller:");
            data.models.forEach(m => console.log("- " + m.name));
        } else {
            console.log("❌ Modeller listelenemedi. Yanıt:", data);
        }
    } catch (err) {
        console.error("❌ Listeleme hatası:", err);
    }
}

// Sunucu başlarken listeyi konsola döksün
checkAvailableModels();
app.listen(PORT, () => {
    console.log(`🧠 [SmartCart AI Hub] Sunucu ${PORT} üzerinde aktif!`);
});


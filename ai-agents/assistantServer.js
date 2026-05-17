const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Modüler Ajanlarımızın fonksiyonlarını içeri aktarıyoruz
const { processEventAgent } = require('./src/agents/eventAgent');
const { processRecipeAgent } = require('./src/agents/recipeAgent');
const { processPortionAgent } = require('./src/agents/portionAgent');

const app = express();
app.use(cors());
app.use(express.json());

// Gemini SDK'sını başlatıyoruz
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const PORT = process.env.PORT || 5001;

app.post('/api/assistant/chat', async (req, res) => {
    try {
        const { messages, currentInventory, dbSample } = req.body;

        // 1. Ajan fonksiyonlarını çağırarak alt alta prompt talimatlarını hazırlıyoruz
        const eventInstruction = await processEventAgent(messages);
        const recipeInstruction = await processRecipeAgent(currentInventory, dbSample);
        const portionInstruction = await processPortionAgent();

        // 2. Ajanların kişiliklerini ve katı çıktı kurallarını tek bir ana orkestrasyon talimatında birleştiriyoruz
        const masterSystemInstruction = `
        Sen SmartCart orkestrasyon merkezisin. Aşağıdaki 3 ajanın talimatlarını sırayla işle:
        ${eventInstruction}
        ${recipeInstruction}
        ${portionInstruction}
        
        [KATI ÇIKTI KURALI]
        Sadece ve sadece aşağıdaki JSON şablonunu döndür. Markdown etiketleri (\`\`\`json gibi), açıklama veya yorum satırı asla ekleme. Doğrudan süslü parantez ile başla ve bitir. Cevap dilin tamamen Türkçe olmalı.

        {
            "assistantReply": "Kullanıcıya hitap eden sıcak şef yanıtı.",
            "activeConcept": "Konsept ve kişi sayısı",
            "proposedMenu": "Yemek adı",
            "evEnvanteri": ["Güncel evdeki malzemeler listesi"],
            "missingItems": [
                { "name": "Ürün adı", "price": 0.0, "category": "Kategori", "quantity": 1, "reason": "Porsiyon açıklaması" }
            ]
        }
        `;

        // 3. Modeli çağırıyoruz. KONTROL: 'contents' kısmına artık chat geçmişini de ekledik!
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: "Lütfen aşağıdaki konuşma geçmişini ve envanteri analiz et, ardından sadece belirtilen JSON formatında yanıt üret." }] },
                ...messages
            ],
            config: { 
                systemInstruction: masterSystemInstruction, 
                responseMimeType: "application/json" 
            }
        });

        res.json({ success: true, data: JSON.parse(response.text.trim()) });
    } catch (error) {
        console.error("Orkestrasyon sunucu hatası:", error);
        res.status(500).json({ success: false, error: "Ajanlar arasında bir iletişim hatası oluştu." });
    }
});

// 4. EKSİK OLAN LİSTEN FONKSİYONU: Sunucunun ayağa kalkmasını sağlar
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🧠 [SmartCart AI Hub] Modüler Multi-Agent Sunucusu Port:${PORT} üzerinde aktif!`);
    console.log(`================================================================`);
});
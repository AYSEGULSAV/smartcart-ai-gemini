const express = require('express');
const cors = require('cors');
const path = require('path');
// Eğer routes klasörün direkt kök dizindeyse './routes/api' yapabilirsin. 
// src altındaysa './src/routes/api' olarak bırak.
const apiRoutes = require('./src/routes/api'); 
require('dotenv').config();

const app = express();

// 1. Güvenlik ve Veri İşleme Politikaları
app.use(cors());
app.use(express.json());

// 2. API Rotalarını Bağlama (Ürünler buradan akacak)
app.use('/api', apiRoutes);

// 3. FRONTEND DOSYALARINI DIŞARI AÇMA (Canlı Yayın)
// Backend klasörünün bir üstündeki veya yanındaki 'frontend' klasörünü otomatik okur
app.use(express.static(path.join(__dirname, '../frontend')));

// Sağlık kontrolü testi (Tarayıcıdan http://localhost:5000 yazınca çalışır)
app.get('/status', (req, res) => {
    res.json({ status: "online", system: "SmartCart AI Backend", database: "SQLite3 (150+ Products Loaded)" });
});

// 4. Herhangi bir API rotası eşleşmezse doğrudan Frontend Arayüzünü yükle (SPA Dostu)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Port Ayarı: .env içinde PORT varsa onu alır, yoksa 5000 portuna yerleşir
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`⚡ Q-Commerce Ana Backend Sunucusu Port ${PORT}'de aktif!`);
    console.log(`🌐 Arayüz Adresi: http://localhost:${PORT}`);
    console.log(`🔗 API Test Adresi: http://localhost:${PORT}/api/products`);
    console.log(`====================================================`);
});
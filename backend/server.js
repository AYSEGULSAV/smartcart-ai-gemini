const express = require('express');
const path = require('path');
const apiRoutes = require('./src/routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// JSON veri işleme ara yazılımları
app.use(express.json());

// FRONTEND DOSYALARINI VS CODE İÇİN DIŞARI AÇMA
// Kök dizindeki frontend klasörünü statik olarak sunar
app.use(express.static(path.join(__dirname, '../frontend')));

// API Rotaları
app.use('/api', apiRoutes);

// Herhangi bir route eşleşmezse ana sayfayı yükle
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 SmartCart AI Sunucusu Başarıyla Başlatıldı!`);
    console.log(`🌐 Adres: http://localhost:${PORT}`);
    console.log(`📝 VS Code üzerinden geliştirme yapmaya hazırsınız.\n`);
});
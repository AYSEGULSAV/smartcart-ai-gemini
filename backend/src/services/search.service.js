const pool = require('../../config/db');

// Eğer veritabanı yoksa uygulamanın çalışmaya devam etmesi için sahte e-ticaret kataloğu
const MOCK_PRODUCTS = [
    { id: 101, name: "Sütaş Süzme Yoğurt 500g", price: 65.00 },
    { id: 102, name: "Barilla Penne Makarna 500g", price: 28.50 },
    { id: 103, name: "Komili Sızma Zeytinyağı 1L", price: 290.00 },
    { id: 104, name: "Pınar Kaşar Peyniri 400g", price: 145.00 },
    { id: 105, name: "Banvit Piliç Göğsü 1kg", price: 180.00 }
];

async function matchGenericIngredientToProduct(genericName, isStokEritme) {
    try {
        // 1. Gerçek veritabanı sorgusu denenir
        const result = await pool.query(
            "SELECT id, name, price FROM products WHERE name ILIKE $1 AND stock > 0 LIMIT 1",
            [`%${genericName}%`]
        );
        if (result.rows.length > 0) return result.rows[0];
    } catch (e) {
        // 2. Veritabanı bağlı değilse terminalde uyarı verip simülasyon yapar
        console.log(`⚠️ DB Bağlantısı yok, "${genericName}" için Mock veri atanıyor.`);
    }

    // Mock veriden akıllıca eşleme simülasyonu
    const found = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(genericName.toLowerCase()));
    return found || { id: Math.floor(Math.random() * 1000), name: `${genericName} (Standart Paket)`, price: 45.00 };
}

module.exports = { matchGenericIngredientToProduct };
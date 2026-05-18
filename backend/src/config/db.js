const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Klasör Kontrolleri
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {

    // ==========================================
    // EKLEME: Kullanıcılar Tablosunu Oluştur (Mevcut yapıya dokunulmadı)
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // 1. Ürünler Tablosunu Oluştur
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price REAL,
        stock INTEGER,
        brand TEXT,
        sku TEXT
    )`);

    // 2. Tablo Boşsa JSON'dan Verileri Çek ve Ekle (Seeding)
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row && row.count === 0) {
            console.log("🎲 Veri tabanı boş. seedData.json dosyasından ürünler yükleniyor...");
            
            const seedFilePath = path.join(dataDir, 'seedData.json');
            
            // JSON Dosyasının varlığını kontrol et
            if (!fs.existsSync(seedFilePath)) {
                console.error("❌ Hata: data/seedData.json dosyası bulunamadı!");
                return;
            }

            // Dosyayı oku ve parse et
            try {
                const rawData = fs.readFileSync(seedFilePath, 'utf8');
                const productsList = JSON.parse(rawData);

                // SQL Hazırlık (Prepare statement optimize çalışması için)
                const insertStmt = db.prepare(`
                    INSERT INTO products (name, category, price, stock, brand, sku) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `);

                productsList.forEach((item) => {
                    insertStmt.run(item.name, item.category, item.price, item.stock, item.brand, item.sku);
                });

                insertStmt.finalize();
                console.log(`🚀 Harika! ${productsList.length} adet ürün JSON dosyasından başarıyla SQLite'a gömüldü.`);
            } catch (jsonErr) {
                console.error("❌ JSON okunurken veya parse edilirken hata oluştu:", jsonErr.message);
            }
        } else {
            console.log(`ℹ️ Veri tabanı hazır. İçeride hali hazırda ${row.count} adet ticari ürün var.`);
        }
    });
});

module.exports = db;
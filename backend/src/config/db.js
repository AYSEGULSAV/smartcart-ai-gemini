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

// SQLite Foreign Key (Yabancı Anahtar) desteğini açıyoruz
db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {

    // ==========================================
    // 1. Kullanıcılar Tablosunu Oluştur
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ==========================================
    // 2. Ürünler Tablosunu Oluştur
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price REAL,
        stock INTEGER,
        brand TEXT,
        sku TEXT
    )`);

    // ==========================================
    // 🚨 YENİ EKLEME: 3. Ana Menüler Tablosunu Oluştur
    // ==========================================
    db.run(`CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        recipe TEXT,
        likes INTEGER DEFAULT 0
    )`);

    // 🚨 YENİ EKLEME: 4. Menü Malzemeleri Tablosunu Oluştur (İlişkili)
    db.run(`CREATE TABLE IF NOT EXISTS menu_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
    )`);

    // 🚨 YENİ EKLEME: 5. Menü Yorumları Tablosunu Oluştur (İlişkili)
    db.run(`CREATE TABLE IF NOT EXISTS menu_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER,
        user TEXT NOT NULL,
        text TEXT NOT NULL,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
    )`);

    // 👥 Kullanıcı - Menü Beğeni İlişki Tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS user_menu_likes (
            user_id INTEGER,
            menu_id INTEGER,
            PRIMARY KEY (user_id, menu_id)
        )
    `);
    // ==========================================
    // Ticari Ürünler Seeding İşlemi (Mevcut Yapın)
    // ==========================================
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row && row.count === 0) {
            console.log("🎲 Ticari ürün tablosu boş. seedData.json dosyasından yükleniyor...");
            const seedFilePath = path.join(dataDir, 'seedData.json');
            if (fs.existsSync(seedFilePath)) {
                try {
                    const rawData = fs.readFileSync(seedFilePath, 'utf8');
                    const productsList = JSON.parse(rawData);
                    const insertStmt = db.prepare(`
                        INSERT INTO products (name, category, price, stock, brand, sku) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    `);
                    productsList.forEach((item) => {
                        insertStmt.run(item.name, item.category, item.price, item.stock, item.brand, item.sku);
                    });
                    insertStmt.finalize();
                    console.log(`🚀 ${productsList.length} adet ürün başarıyla yüklendi.`);
                } catch (jsonErr) {
                    console.error("❌ Ürün JSON hatası:", jsonErr.message);
                }
            }
        } else {
            console.log(`ℹ️ Ürün tablosu hazır. İçeride ${row.count} adet ürün var.`);
        }
    });

    // ==========================================
    // 🚨 YENİ EKLEME: Menü Kataloğu Seeding İşlemi (İlişkili Kayıt Atma)
    // ==========================================
    db.get("SELECT COUNT(*) as count FROM menus", (err, row) => {
        if (row && row.count === 0) {
            console.log("🎲 Menü tablosu boş. menusSeedData.json dosyasından ilişkili veriler yükleniyor...");
            
            const menuSeedPath = path.join(dataDir, 'menusSeedData.json');
            if (!fs.existsSync(menuSeedPath)) {
                console.error("❌ Hata: data/menusSeedData.json dosyası bulunamadı!");
                return;
            }

            try {
                const rawMenuData = fs.readFileSync(menuSeedPath, 'utf8');
                const menusList = JSON.parse(rawMenuData);

                menusList.forEach((menuItem) => {
                    // Önce ana menüyü ekliyoruz
                    db.run(
                        `INSERT INTO menus (title, description, recipe, likes) VALUES (?, ?, ?, ?)`,
                        [menuItem.title, menuItem.description, menuItem.recipe, menuItem.likes],
                        function (menuErr) {
                            if (menuErr) {
                                console.error("❌ Menü eklenirken hata:", menuErr.message);
                                return;
                            }

                            // sqlite3 modülünde `this.lastID` eklenen satırın PRIMARY KEY (id) değerini verir.
                            const generatedMenuId = this.lastID;

                            // Alt malzemeleri ilişkili şekilde ekliyoruz
                            if (menuItem.ingredients && menuItem.ingredients.length > 0) {
                                const ingStmt = db.prepare(`
                                    INSERT INTO menu_ingredients (menu_id, name, price, quantity, reason)
                                    VALUES (?, ?, ?, ?, ?)
                                `);
                                menuItem.ingredients.forEach(ing => {
                                    ingStmt.run(generatedMenuId, ing.name, ing.price, ing.quantity, ing.reason);
                                });
                                ingStmt.finalize();
                            }

                            // Alt yorumları ilişkili şekilde ekliyoruz
                            if (menuItem.comments && menuItem.comments.length > 0) {
                                const commStmt = db.prepare(`
                                    INSERT INTO menu_comments (menu_id, user, text)
                                    VALUES (?, ?, ?)
                                `);
                                menuItem.comments.forEach(comm => {
                                    commStmt.run(generatedMenuId, comm.user, comm.text);
                                });
                                commStmt.finalize();
                            }
                        }
                    );
                });
                console.log(`🚀 Başarılı: 20 adet ilişkili kampanya menüsü veritabanına işlendi.`);
            } catch (parseErr) {
                console.error("❌ Menü JSON okuma hatası:", parseErr.message);
            }
        } else {
            console.log(`ℹ️ Menü tablosu hazır. İçeride ${row.count} adet kampanya menüsü var.`);
        }
    });

});
// db.all("SELECT id, title, recipe FROM menus", [], (err, rows) => {
//    console.log(rows);
// });
module.exports = db;
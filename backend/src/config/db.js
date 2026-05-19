const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price REAL,
        stock INTEGER,
        brand TEXT,
        sku TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        recipe TEXT,
        likes INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS menu_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS menu_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER,
        user TEXT NOT NULL,
        text TEXT NOT NULL,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_menu_likes (
            user_id INTEGER,
            menu_id INTEGER,
            PRIMARY KEY (user_id, menu_id)
        )
    `);

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
                    db.run(
                        `INSERT INTO menus (title, description, recipe, likes) VALUES (?, ?, ?, ?)`,
                        [menuItem.title, menuItem.description, menuItem.recipe, menuItem.likes],
                        function (menuErr) {
                            if (menuErr) {
                                console.error("❌ Menü eklenirken hata:", menuErr.message);
                                return;
                            }

                            const generatedMenuId = this.lastID;

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

module.exports = db;
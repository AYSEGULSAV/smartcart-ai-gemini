const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { processCheckout } = require('../controllers/cart');

router.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, count: rows.length, data: rows });
    });
});

router.get('/products/category/:categoryName', (req, res) => {
    const category = req.params.categoryName;
    db.all("SELECT * FROM products WHERE category = ?", [category], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, category: category, data: rows });
    });
});


router.get('/menus', (req, res) => {
    const userId = parseInt(req.query.userId, 10) || 0; 

    const query = `
        SELECT m.*, 
               (SELECT COUNT(*) FROM user_menu_likes WHERE user_id = ? AND menu_id = m.id) as is_liked
        FROM menus m
    `;

    db.all(query, [userId], async (err, menus) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        try {
            const fullMenus = [];

            for (const menu of menus) {
                const ingredients = await new Promise((resolve, reject) => {
                    db.all("SELECT name, price, quantity, reason FROM menu_ingredients WHERE menu_id = ?", [menu.id], (ingErr, rows) => {
                        if (ingErr) reject(ingErr);
                        else resolve(rows || []);
                    });
                });

                const comments = await new Promise((resolve, reject) => {
                    db.all("SELECT user, text FROM menu_comments WHERE menu_id = ?", [menu.id], (commErr, rows) => {
                        if (commErr) reject(commErr);
                        else resolve(rows || []);
                    });
                });

                fullMenus.push({
                    id: menu.id,
                    title: menu.title,
                    description: menu.description,
                    recipe: menu.recipe || 'Bu menü için henüz bir hazırlık tarifi eklenmemiş.',
                    likes: menu.likes || 0,
                    
                    isLiked: menu.is_liked > 0, 
                    
                    ingredients: ingredients,
                    comments: comments
                });
            }

            res.json(fullMenus);

        } catch (loopErr) {
            res.status(500).json({ success: false, error: loopErr.message });
        }
    });
});

router.post('/menus/:id/comments', (req, res) => {
    const menuId = req.params.id;
    const { user, text } = req.body;

    if (!user || !text) {
        return res.status(400).json({ success: false, error: 'Kullanıcı adı ve yorum boş bırakılamaz.' });
    }

    const query = `INSERT INTO menu_comments (menu_id, user, text) VALUES (?, ?, ?)`;
    
    db.run(query, [menuId, user, text], function (err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        
        res.status(201).json({
            success: true,
            comment: { id: this.lastID, user, text }
        });
    });
});

router.post('/menus/:id/like', (req, res) => {
    const menuId = req.params.id;
    const userId = req.body.userId;

    if (!userId) return res.status(401).json({ success: false, error: "Beğenmek için oturum açmalısınız." });

    db.run(`
        CREATE TABLE IF NOT EXISTS user_menu_likes (
            user_id INTEGER,
            menu_id INTEGER,
            PRIMARY KEY (user_id, menu_id)
        )
    `, (tableErr) => {
        if (tableErr) return res.status(500).json({ success: false, error: "Tablo hatası: " + tableErr.message });

        db.get(`SELECT 1 FROM user_menu_likes WHERE user_id = ? AND menu_id = ?`, [userId, menuId], (checkErr, alreadyLiked) => {
            if (checkErr) return res.status(500).json({ success: false, error: checkErr.message });

            if (alreadyLiked) {
                return db.get(`SELECT likes FROM menus WHERE id = ?`, [menuId], (err, row) => {
                    res.json({ success: true, likes: row.likes || 0, isLiked: true });
                });
            }

            db.run(`INSERT INTO user_menu_likes (user_id, menu_id) VALUES (?, ?)`, [userId, menuId], function(insertErr) {
                if (insertErr) return res.status(500).json({ success: false, error: insertErr.message });

                db.run(`UPDATE menus SET likes = likes + 1 WHERE id = ?`, [menuId], function(updateErr) {
                    if (updateErr) return res.status(500).json({ success: false, error: updateErr.message });

                    db.get(`SELECT likes FROM menus WHERE id = ?`, [menuId], (selectErr, row) => {
                        if (selectErr) return res.status(500).json({ success: false, error: selectErr.message });
                        res.json({ success: true, likes: row.likes, isLiked: true });
                    });
                });
            });
        });
    });
});

router.post('/menus/:id/unlike', (req, res) => {
    const menuId = req.params.id;
    const userId = req.body.userId;

    if (!userId) return res.status(401).json({ success: false, error: "Oturum açmanız gerekiyor." });

    db.run(`
        CREATE TABLE IF NOT EXISTS user_menu_likes (
            user_id INTEGER,
            menu_id INTEGER,
            PRIMARY KEY (user_id, menu_id)
        )
    `, (tableErr) => {
        if (tableErr) return res.status(500).json({ success: false, error: "Tablo hatası: " + tableErr.message });

        db.run(`DELETE FROM user_menu_likes WHERE user_id = ? AND menu_id = ?`, [userId, menuId], function(deleteErr) {
            if (deleteErr) return res.status(500).json({ success: false, error: deleteErr.message });

            db.run(`UPDATE menus SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?`, [menuId], function(updateErr) {
                if (updateErr) return res.status(500).json({ success: false, error: updateErr.message });

                db.get(`SELECT likes FROM menus WHERE id = ?`, [menuId], (selectErr, row) => {
                    if (selectErr) return res.status(500).json({ success: false, error: selectErr.message });
                    res.json({ success: true, likes: row.likes, isLiked: false });
                });
            });
        });
    });
});
router.post('/checkout', processCheckout);

module.exports = router;
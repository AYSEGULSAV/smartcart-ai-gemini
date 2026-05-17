const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { processCheckout } = require('../controllers/cart');

// 1. Tüm ürünleri kategori bazlı listeleme uç noktası
router.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, count: rows.length, data: rows });
    });
});

// 2. Kategori bazlı filtreleme filtreleme uç noktası (Örn: /api/products/Manav)
router.get('/products/category/:categoryName', (req, res) => {
    const category = req.params.categoryName;
    db.all("SELECT * FROM products WHERE category = ?", [category], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, category: category, data: rows });
    });
});

// 3. Güvenli Ödeme (Checkout) Uç Noktası
router.post('/checkout', processCheckout);

module.exports = router;
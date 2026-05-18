const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = 'smartcart_gizli_anahtar_123'; // Gerçek projede bunu .env dosyasında saklamalısın

// 1. KAYIT OLMA (REGISTER)
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Lütfen tüm alanları doldurun." });
    }

    // E-posta adresi önceden alınmış mı kontrol et
    db.get("SELECT id FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (user) return res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kullanımda." });

        // Şifreyi güvenli bir şekilde hashle
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Kullanıcıyı veritabanına ekle
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.run(sql, [name, email, hashedPassword], function(err) {
            if (err) return res.status(500).json({ success: false, error: err.message });

            res.status(201).json({ success: true, message: "Kayıt başarıyla tamamlandı. Giriş yapabilirsiniz." });
        });
    });
});

// 2. GİRİŞ YAPMA (LOGIN)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "E-posta ve şifre zorunludur." });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });

        // Şifre eşleşmesini kontrol et
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Hatalı şifre girdiniz." });

        // Kullanıcıya özel JWT Token üret
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            message: `Hoş geldiniz, ${user.name}`,
            token: token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

module.exports = router;
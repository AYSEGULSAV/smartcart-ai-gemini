const db = require('../config/db');

// Kullanıcının sepet onaylama (Checkout) aşaması
const processCheckout = (req, res) => {
    const { items, total, address, discountApplied } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Sepetiniz boş, sipariş oluşturulamaz." });
    }

    // Sipariş başarılı simülasyonu
    const orderNumber = "ORD-" + Math.floor(Math.random() * 900000 + 100000);
    
    // Gerçek sistem MVP'sinde stok güncelleme tetiklenebilir
    res.status(200).json({
        success: true,
        message: "Siparişiniz başarıyla alındı! Kuryemiz 15 dakika içinde kapınızda olacak.",
        orderId: orderNumber,
        summary: {
            deliveryAddress: address,
            finalTotal: total,
            discountApplied: discountApplied || false
        }
    });
};

module.exports = {
    processCheckout
};
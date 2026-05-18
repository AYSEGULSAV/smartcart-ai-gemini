// 🧭 SPA Sayfa Geçişleri
function switchPage(pageId) {
    const token = localStorage.getItem('token');
    
    if (!token && pageId !== 'welcome') {
        if (typeof showToast === 'function') showToast("🔒 Lütfen önce giriş yapın.");
        else alert("Bu sayfayı görüntülemek için lütfen önce giriş yapın.");
        openAuthModal('login');
        return;
    }

    // Tüm sayfaları gizle
    document.querySelectorAll('.page-section').forEach(section => section.classList.add('hidden'));
    
    // İstenen sayfayı görünür yap
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    // 🌟 YENİ: Kullanıcı Siparişlerim sayfasına geçtiyse listeyi dinamik olarak hesapla ve yenile
    if (pageId === 'orders' && typeof renderOrders === 'function') {
        renderOrders();
    }
}


// 🛒 Eksikleri Gerçek Alışveriş Sepetine Yükleme (MANUEL GÜNCELLEME UYUMLU)
function addHubMissingToCart() {
    if (currentHubMissingItems.length === 0) {
        alert("Ekleme yapılacak eksik ürün bulunamadı!");
        return;
    }

    currentHubMissingItems.forEach(missingItem => {
        // Mağazadaki gerçek ürünü ismiyle eşleştirmeyi dene
        const realProduct = allProducts.find(p => p.name.toLowerCase().includes(missingItem.name.toLowerCase()));
        
        // 🌟 Kullanıcının ekranda + - ile belirlediği en son adeti alıyoruz!
        const finalQuantity = missingItem.quantity || 1; 

        if (realProduct) {
            for (let i = 0; i < finalQuantity; i++) {
                addToCart(realProduct.id);
            }
        } else {
            // Sanal ürün eşleşmesi (Market veritabanında tam ismi bulunamayan alternatif ürünler için)
            const virtualId = Math.floor(20000 + Math.random() * 80000);
            
            // Sepette zaten bu sanal ürün var mı kontrol et
            const existingCartItem = cart.find(c => c.name === missingItem.name);
            if (existingCartItem) {
                existingCartItem.quantity += finalQuantity;
            } else {
                cart.push({
                    id: virtualId,
                    name: missingItem.name,
                    category: missingItem.category || "Diğer",
                    price: missingItem.price,
                    stock: 50,
                    quantity: finalQuantity // Kullanıcının seçtiği nihai adet basılıyor
                });
            }
        }
    });

    // Ana sepeti güncelle ve render et
    saveAndRefreshCart();
    
    alert("🎉 Ajanların hazırladığı ve sizin güncellediğiniz tüm eksik ürünler sepetinize başarıyla fırlatıldı!");
    switchPage('cart'); // Kullanıcıyı gerçek sepet sayfasına uçurur
}

// Global kapsam tanımlamaları
window.switchPage = switchPage;
window.addHubMissingToCart = addHubMissingToCart;
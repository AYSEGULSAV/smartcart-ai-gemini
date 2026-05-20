function switchPage(pageId) {
    const token = localStorage.getItem('token');
    
    if (!token && pageId !== 'welcome') {
        if (typeof showToast === 'function') showToast("🔒 Lütfen önce giriş yapın.");
        else alert("Bu sayfayı görüntülemek için lütfen önce giriş yapın.");
        openAuthModal('login');
        return;
    }
    if (pageId === 'promotions') {
        loadCatalogMenus(); 
    }

    document.querySelectorAll('.page-section').forEach(section => section.classList.add('hidden'));
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

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
    showToast(`🎉 Ajanların hazırladığı ve sizin güncellediğiniz tüm eksik ürünler sepetinize başarıyla fırlatıldı!`);
    switchPage('cart'); // Kullanıcıyı gerçek sepet sayfasına uçurur
}

// Global kapsam tanımlamaları
window.switchPage = switchPage;
window.addHubMissingToCart = addHubMissingToCart;

(function() {
    const originalSwitchPage = window.switchPage;

    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(pageId) {
            // 1. Orijinal fonksiyonunu bozmadan çalıştır
            originalSwitchPage(pageId);

            // 2. 🌟 SEKMELERİN İÇİNİ DOLDUR VE YAZIYI BEYAZ YAP
            document.querySelectorAll('.nav-link').forEach(btn => {
                const isCurrent = btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${pageId}'`);
                
                if (isCurrent) {
                    // Aktif Sekme: İçini yeşille doldur, yazıyı beyaz yap, çerçeveyi belirginleştir
                    btn.classList.remove('text-slate-500', 'font-semibold', 'bg-transparent', 'border-transparent');
                    btn.classList.add('text-white', 'font-bold', 'bg-emerald-600', 'border-emerald-600');
                } else {
                    // Pasif Sekmeler: İçini boşalt, yazıyı gri yap, çerçeveyi gizle
                    btn.classList.remove('text-white', 'font-bold', 'bg-emerald-600', 'border-emerald-600');
                    btn.classList.add('text-slate-500', 'font-semibold', 'bg-transparent', 'border-transparent');
                }
            });
        };
    }
})();
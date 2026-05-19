// 📦 Kampanyalar ve Menü Kataloğu Durum Yönetimi
window.allCatalogMenus = []; 
window.activeMenuId = null;        // Aşağı doğru açık olan menünün ID'si
window.selectedCatalogMenu = null;  // İşlem yapılan aktif kopyanın nesnesi

/**
 * 🔄 SQLITE / JSON DB VERİ ÇEKME NOKTASI
 * config.js içindeki BACKEND_API değişkenini kullanır.
 */
async function loadCatalogMenus() {
    try {
        // 💡 1. Oturum açmış kullanıcının ID'sini esnek bir şekilde buluyoruz
        // 1. Önce token'ı alıyoruz
        const token = localStorage.getItem('token');
        let activeUserId = 0;

        if (token) {
            try {
                // 2. JWT'nin ortasındaki şifresiz payload kısmını base64 ile çözüyoruz
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                
                const decoded = JSON.parse(jsonPayload);
                // 3. Token içindeki ID'yi yakalıyoruz
                activeUserId = decoded.id || decoded.userId || decoded.user?.id || decoded.sub || 0;
            } catch (e) {
                console.error("Token deşifre edilemedi:", e);
            }
        }

        // 4. Eğer üstteki token çözme işleminden ID gelmediyse, senin yazdığın akıllı fallback yapısı devreye girsin:
        if (!activeUserId) {
            const userObj = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('currentUser')) || {};
            activeUserId = userObj.id || userObj.userId || localStorage.getItem('userId') || localStorage.getItem('user_id') || 0;
        }
        // 🎯 2. config.js'den gelen BACKEND_API adresinin sonuna query string olarak userId ekliyoruz
        const response = await fetch(`${BACKEND_API}/menus?userId=${activeUserId}`); 
        
        if (!response.ok) throw new Error("Veritabanından menü verileri çekilemedi.");
        
        window.allCatalogMenus = await response.json();
        renderMenusCatalogList();
    } catch (error) {
        console.error("Kampanya menüleri yüklenirken hata:", error);
        const container = document.getElementById('hub-menus-catalog-list');
        if (container) {
            container.innerHTML = '<p class="text-rose-500 text-sm text-center py-4">Menü kampanyaları şu an yüklenemedi.</p>';
        }
    }
}

/**
 * 📜 MENÜLERİ KART OLARAK LİSTELEYEN MOTOR
 */
function renderMenusCatalogList() {
    const catalogContainer = document.getElementById('hub-menus-catalog-list');
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';

    if (window.allCatalogMenus.length === 0) {
        catalogContainer.innerHTML = '<p class="text-slate-500 text-sm text-center py-8">Aktif menü kampanyası bulunamadı.</p>';
        return;
    }

    window.allCatalogMenus.forEach(menu => {
        console.log(`🧠 [JÜRİ KONTROLÜ] Menü: ${menu.title} | isLiked Değeri:`, menu.isLiked, `| Tipi:`, typeof menu.isLiked);
        const isOpen = window.activeMenuId === menu.id;
        const menuCard = document.createElement('div');
        
        menuCard.className = `bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
            isOpen ? 'border-teal-500 shadow-xl ring-1 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300 shadow-sm'
        }`;
        
        // Menünün içerik başlangıç toplam fiyatını hesapla
        let initialTotal = menu.ingredients.reduce((acc, curr) => acc + (parseFloat(curr.price) * (parseInt(curr.quantity) || 1)), 0);

    // Önce bu menünün daha önce beğenilip beğenilmediğini localStorage'dan kontrol ediyoruz
    const isMenuLikedBefore = menu.isLiked === true || menu.isLiked === 1 || menu.isLiked === 'true';
    // ❤️ RENK VE SİMGE DÜZELTMESİ:
    // Beğenildiyse: Dolu kalp (fa-solid) ve canlı kırmızı (text-rose-500)
    // Beğenilmediyse: Çizgisel kalp (fa-regular) ve belirgin gri-rose efekti (text-slate-500)
    const outerHeartClass = isMenuLikedBefore 
        ? 'fa-solid fa-heart text-rose-500' 
        : 'fa-regular fa-heart text-slate-300 group-hover:text-rose-400';    // Butonun dış çerçeve ve arka plan renkleri (Açık arka plana uygun hale getirildi)
    const outerBtnClass = isMenuLikedBefore 
        ? 'text-rose-600 border-rose-200 bg-rose-50/80 shadow-sm' 
        : 'text-slate-600 bg-white hover:bg-rose-50 hover:border-rose-200 border-slate-200 shadow-sm';
    menuCard.innerHTML = `
        <div onclick="toggleMenuDetail(${menu.id})" class="p-5 flex justify-between items-center cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition">
            <div class="space-y-1">
                <div class="flex items-center gap-3">
                    <h3 class="text-lg font-bold text-slate-800">${menu.title}</h3>
                    
                    <button 
                        type="button"
                        onclick="event.stopPropagation(); toggleCatalogMenuLike(${menu.id})"
                        id="outer-like-btn-${menu.id}"
                        class="flex items-center gap-1.5 border px-2.5 py-1 rounded-full transition-all duration-200 text-xs font-bold cursor-pointer group ${outerBtnClass}"
                    >

                        <i class="${outerHeartClass} outer-target-heart transition-all duration-200 group-hover:scale-110"></i>

                        <span id="outer-like-count-${menu.id}">
                            ${menu.likes || 0}
                        </span>

                    </button>
                </div>
                <p class="text-slate-500 text-sm max-w-xl">${menu.description}</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <span class="text-xs text-slate-400 block">Paket Fiyatı</span>
                    <span class="text-base font-black text-teal-600">${initialTotal.toFixed(2)} TL</span>
                </div>
                <i class="fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-slate-400 transition-transform"></i>
            </div>
        </div>

        ${isOpen ? renderMenuDetailSection(menu) : ''}
    `;
        catalogContainer.appendChild(menuCard);
    });
}

/**
 * 🎛️ DETAY PANELİNİ AÇMA / KAPAMA
 */
window.toggleMenuDetail = function(menuId) {
    if (window.activeMenuId === menuId) {
        window.activeMenuId = null; 
    } else {
        const originalMenu = window.allCatalogMenus.find(m => m.id === menuId);
        window.selectedCatalogMenu = JSON.parse(JSON.stringify(originalMenu)); // Deep copy
        window.activeMenuId = menuId;
    }
    renderMenusCatalogList();
};

/**
 * 🛠️ DETAY PANELİ TASARIMI VE ARTI-EKSİ BUTONLARI
 */
function renderMenuDetailSection(menu) {
    let currentTotal = 0;
    let ingredientsHTML = '';
    
    // 1. MALZEME DÖNGÜSÜ: Güvenli 'menu' parametresi üzerinden dönüyoruz
    if (menu.ingredients && menu.ingredients.length > 0) {
        menu.ingredients.forEach((item, index) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.quantity) || 0;
            const rowTotal = price * qty;
            currentTotal += rowTotal;

            ingredientsHTML += `
                <div class="py-3 border-b border-slate-800/50 flex justify-between items-center text-sm">
                    <div class="flex-1 pr-4">
                        <h5 class="font-bold text-slate-200">${item.name}</h5>
                        <p class="text-xs text-slate-400 mt-0.5">${item.reason || 'Tarif için gerekli miktar.'}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                            
                            <button type="button" 
                                    onclick="event.stopPropagation(); updateCatalogItemQty(${menu.id}, ${index}, -1)" 
                                    class="text-slate-400 hover:text-white w-4 h-4 flex items-center justify-center font-black text-sm cursor-pointer select-none">-</button>
                            
                            <span class="font-mono font-bold text-teal-400 w-4 text-center text-xs">${qty}</span>
                            
                            <button type="button" 
                                    onclick="event.stopPropagation(); updateCatalogItemQty(${menu.id}, ${index}, 1)" 
                                    class="text-slate-400 hover:text-white w-4 h-4 flex items-center justify-center font-black text-sm cursor-pointer select-none">+</button>
                        </div>
                        <div class="text-right min-w-[80px]">
                            <span class="font-bold text-teal-400 block">${rowTotal.toFixed(2)} TL</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // 2. YORUM DÖNGÜSÜ: Yine güvenli 'menu' parametresini okuyoruz
    let commentsHTML = '';
    (menu.comments || []).forEach(c => {
        commentsHTML += `
            <div class="bg-slate-800/40 p-2 rounded border border-slate-800 text-xs">
                <strong class="text-teal-400">${c.user}:</strong> <span class="text-slate-300">${c.text}</span>
            </div>
        `;
    });

    // 3. ŞEF TARİFİ MOTORU: Metni noktalardan bölüp numaralı liste haline getiriyoruz
    const rawRecipe = menu.recipe || 'Tarif adımları yakında eklenecektir.';
    const recipeSteps = rawRecipe
        .split('.')
        .map(step => step.trim())
        .filter(step => step.length > 0);

    const recipeStepsHTML = recipeSteps.map((step, index) => `
        <li class="flex items-start gap-3 bg-slate-800/20 p-2.5 rounded-lg border border-slate-800 hover:border-teal-500/10 transition">
            <span class="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-bold font-mono">
                ${index + 1}
            </span>
            <p class="text-slate-300 text-xs leading-relaxed pt-0.5">
                ${step}.
            </p>
        </li>
    `).join('');

    // 4. TEK PARÇA TEMİZ HTML ÇIKTISI
    return `
        <div class="bg-slate-900 text-white p-6 border-t border-slate-800 space-y-6">
            
            <div class="space-y-3">
                <span class="text-xs font-bold text-teal-400 uppercase tracking-wider block flex items-center gap-2">
                    <i class="fa-solid fa-kitchen-set text-teal-500"></i> Şefin Adım Adım Hazırlık Tarifi:
                </span>
                <ul class="space-y-2 max-h-64 overflow-y-auto pr-1">
                    ${recipeStepsHTML}
                </ul>
            </div>

            <div class="space-y-3">
                <span class="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    <i class="fa-solid fa-basket-shopping mr-1"></i> Sepete Eklenecek Malzemeler:
                </span>
                <div class="divide-y divide-slate-800 max-h-60 overflow-y-auto pr-1">
                    ${ingredientsHTML}
                </div>
            </div>

            <div class="pt-4 pb-4 border-t border-b border-slate-800 flex items-center justify-between">
                <div>
                    <span class="text-xs text-slate-400 block">Seçilen Malzemelerin Toplamı</span>
                    <span class="text-xl font-black text-teal-400">${currentTotal.toFixed(2)} TL</span>
                </div>
                <button type="button" onclick="event.stopPropagation(); addCatalogMenuToCart()" 
                        class="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition shadow-lg text-sm cursor-pointer">
                    Seçilenleri Sepete At
                </button>
            </div>

            <div class="space-y-2">
                <span class="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    <i class="fa-solid fa-comments mr-1"></i> Kullanıcı Yorumları ve Beğeniler:
                </span>
                <div id="menu-comments-list" class="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    ${commentsHTML || '<p class="text-slate-500 italic text-xs no-comments-yet">Henüz yorum yapılmamış.</p>'}
                </div>
            </div>

            <div class="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Yorum Yap</span>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input type="text" id="comment-user" placeholder="Adınız" class="md:col-span-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition">
                    <input type="text" id="comment-text" placeholder="Menü hakkındaki düşünceleriniz..." class="md:col-span-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition">
                    <button type="button" onclick="event.stopPropagation(); submitCatalogComment(${menu.id})" class="md:col-span-1 bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-950 border border-teal-500/20 text-xs font-bold py-2 px-4 rounded-lg transition cursor-pointer">Gönder</button>
                </div>
            </div>

        </div>
    `;
}

/**
 * 🎛️ BUTON BASILDIĞINDA MİKTAR GÜNCELLEME
 */
// ⚡ MİKTAR GÜNCELLEME VE OTOMATİK EKRAN TAZELEME MOTORU
window.updateCatalogItemQty = function(menuId, index, change) {
    // 1. İşlem yapılan menü nesnesini bul (Hafızadaki güncel state'i yakala)
    let targetMenu = null;
    
    if (window.allCatalogMenus) {
        targetMenu = window.allCatalogMenus.find(m => m.id === menuId);
    } else if (window.selectedCatalogMenu && window.selectedCatalogMenu.id === menuId) {
        targetMenu = window.selectedCatalogMenu;
    }

    // Güvenlik Kontrolü: Menü veya malzeme listesi yoksa çökmesini engelle
    if (!targetMenu || !targetMenu.ingredients || !targetMenu.ingredients[index]) {
        console.error("Hata: Değiştirilmek istenen menü veya malzeme datası bulunamadı!");
        return;
    }

    // 2. Mevcut miktarı tam sayıya çevir ve gelen değişimi (+1 / -1) üzerine ekle
    let currentQty = parseInt(targetMenu.ingredients[index].quantity) || 0;
    currentQty += change;

    // Negatif miktar olamayacağı için sıfırın altına düşmesini engelle
    if (currentQty < 0) currentQty = 0; 

    // 3. Arka plandaki ana JavaScript nesnesinde değeri güncelle
    targetMenu.ingredients[index].quantity = currentQty;
    
    // 4. 🚀 EKRANI GÜNCELLE: Sayfayı çizen ana fonksiyonu çağırarak yeni fiyatları bas!
    if (typeof renderMenusCatalogList === 'function') {
        renderMenusCatalogList(); 
    }
};

/**
 * 🛒 SEPETE GÖNDERME (cart.js & products.js entegrasyonu)
 */
window.addCatalogMenuToCart = function() {
    if (!window.selectedCatalogMenu) return;

    const validIngredients = window.selectedCatalogMenu.ingredients.filter(i => i.quantity > 0);

    if (validIngredients.length === 0) {
        alert("Lütfen sepet için en az bir ürünün miktarını artırın!");
        return;
    }

    validIngredients.forEach(item => {
        // products.js dosyasındaki global allProducts dizisinden gerçek ürünü arar
        const realProduct = (typeof allProducts !== 'undefined' && allProducts.length > 0)
            ? allProducts.find(p => p.name.toLowerCase().includes(item.name.toLowerCase()))
            : null;
        
        const finalQuantity = item.quantity;

        if (realProduct) {
            // cart.js içindeki addToCart fonksiyonunu adet kadar döndürür
            for (let i = 0; i < finalQuantity; i++) {
                if (typeof addToCart === "function") addToCart(realProduct.id);
            }
        } else {
            // Sanal ürün mantığı
            const virtualId = Math.floor(30000 + Math.random() * 60000);
            const existingCartItem = cart.find(c => c.name.toLowerCase() === item.name.toLowerCase());
            
            if (existingCartItem) {
                existingCartItem.quantity += finalQuantity;
            } else {
                cart.push({
                    id: virtualId,
                    name: item.name,
                    category: "Kampanya Paketi",
                    price: Number(item.price) || 0,
                    stock: 100,
                    quantity: finalQuantity 
                });
            }
        }
    });

    // cart.js içerisindeki yerel depolama tetikleyicileri
    if (typeof saveAndRefreshCart === "function") saveAndRefreshCart();
    else if (typeof saveCartToStorage === "function") saveCartToStorage();

    alert(`🎉 "${window.selectedCatalogMenu.title}" sepetinize başarıyla fırlatıldı!`);
    
    // navigation.js üzerinden sepet sayfasına geçiş fırlatılır
    if (typeof switchPage === "function") switchPage('cart');
};

// 🚀 Frontend'den Backend API'sine yorum gönderen fonksiyon
async function submitCatalogComment(menuId) {
    const userInput = document.getElementById('comment-user');
    const textInput = document.getElementById('comment-text');

    const user = userInput.value.trim();
    const text = textInput.value.trim();

    // Validasyon kontrolü
    if (!user || !text) {
        alert('Lütfen adınızı ve yorumunuzu doldurun!');
        return;
    }

    try {
        // Backend API rotamıza istek atıyoruz (Genelde BACKEND_API değişkeni projenizde tanımlıdır, yoksa url yazılabilir)
        const response = await fetch(`http://localhost:5000/api/menus/${menuId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, text })
        });

        const data = await response.json();

        if (data.success) {
            const commentsListDiv = document.getElementById('menu-comments-list');
            
            // Eğer ilk defa yorum yapılıyorsa "Henüz yorum yapılmamış" yazısını temizle
            const noCommentsYet = commentsListDiv.querySelector('.no-comments-yet');
            if (noCommentsYet) {
                noCommentsYet.remove();
            }

            // Yeni yorum kutusunu oluşturup listeye anında ekliyoruz (Arayüz yenilenmeden)
            const newCommentHTML = `
                <div class="bg-slate-800/40 p-2 rounded border border-slate-800 text-xs animation-fade-in">
                    <strong class="text-teal-400">${data.comment.user}:</strong> <span class="text-slate-300">${data.comment.text}</span>
                </div>
            `;
            
            commentsListDiv.insertAdjacentHTML('beforeend', newCommentHTML);
            
            // Form alanlarını temizle
            textInput.value = '';
            
            // Eğer istersen ana bellek nesnesini de güncel tutabilirsin:
            if(window.selectedCatalogMenu && window.selectedCatalogMenu.id === menuId) {
                if(!window.selectedCatalogMenu.comments) window.selectedCatalogMenu.comments = [];
                window.selectedCatalogMenu.comments.push({ user, text });
            }

        } else {
            alert('Yorum gönderilirken bir hata oluştu: ' + data.error);
        }

    } catch (error) {
        console.error('Yorum gönderme hatası:', error);
        alert('Sunucuya bağlanılamadı.');
    }
}

window.toggleCatalogMenuLike = async function(menuId) {
    // 1. Tarayıcıdan token'ı alıyoruz (Sen hangi key ile kaydettiysen 'token' yerine onu yaz)
    const token = localStorage.getItem('token'); 

    if (!token) {
        alert('Menüleri beğenebilmek için lütfen önce giriş yapınız.');
        return;
    }

    let activeUserId = null;
    try {
        // 2. JWT Token'ın ortasındaki payload kısmını base64 ile çözüyoruz
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        
        // 3. Token'ı üreten backend'in içine koyduğu id alanı (Genelde decoded.id veya decoded.userId olur)
        activeUserId = decoded.id || decoded.userId || decoded.sub; 
    } catch (e) {
        console.error("Token çözülemedi:", e);
    }

    if (!activeUserId) {
        alert('Oturum bilginiz doğrulanamadı. Lütfen tekrar giriş yapınız.');
        return;
    }

    // Hafızadaki menüyü bulup o anki beğeni durumuna (isLiked) bakıyoruz
    const foundMenu = window.allCatalogMenus?.find(m => Number(m.id) === Number(menuId));
    const isAlreadyLiked = foundMenu && (foundMenu.isLiked === 1 || foundMenu.isLiked === true);
    
    const endpoint = isAlreadyLiked ? 'unlike' : 'like';

    try {
        const response = await fetch(
            `http://localhost:5000/api/menus/${menuId}/${endpoint}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: activeUserId }) // Backend'e kullanıcının ID'sini geçiyoruz
            }
        );

        const data = await response.json();

        if (!data.success) {
            console.error("Beğeni işlemi başarısız:", data.error);
            return;
        }

        // Global hafızayı backend'den gelen yeni sayılarla tazeleyin
        if (window.allCatalogMenus) {
            const m = window.allCatalogMenus.find(m => Number(m.id) === Number(menuId));
            if (m) {
                m.likes = data.likes;
                m.isLiked = data.isLiked; // true veya false
            }
        }

        if (window.selectedCatalogMenu && Number(window.selectedCatalogMenu.id) === Number(menuId)) {
            window.selectedCatalogMenu.likes = data.likes;
            window.selectedCatalogMenu.isLiked = data.isLiked;
        }

        // 🚀 Ekranı yeniden çizdirerek kalbi doldur veya boşalt
        if (typeof renderMenusCatalogList === 'function') {
            renderMenusCatalogList();
        }

    } catch (error) {
        console.error('Like sistemi hatası:', error);
    }
};
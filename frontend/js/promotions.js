window.allCatalogMenus = []; 
window.activeMenuId = null;
window.selectedCatalogMenu = null; 

async function loadCatalogMenus() {
    try {
        const token = localStorage.getItem('token');
        let activeUserId = 0;

        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                
                const decoded = JSON.parse(jsonPayload);
                activeUserId = decoded.id || decoded.userId || decoded.user?.id || decoded.sub || 0;
            } catch (e) {
                console.error("Token deşifre edilemedi:", e);
            }
        }

        if (!activeUserId) {
            const userObj = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('currentUser')) || {};
            activeUserId = userObj.id || userObj.userId || localStorage.getItem('userId') || localStorage.getItem('user_id') || 0;
        }
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
        
        let initialTotal = menu.ingredients.reduce((acc, curr) => acc + (parseFloat(curr.price) * (parseInt(curr.quantity) || 1)), 0);

    const isMenuLikedBefore = menu.isLiked === true || menu.isLiked === 1 || menu.isLiked === 'true';

    const outerHeartClass = isMenuLikedBefore 
        ? 'fa-solid fa-heart text-rose-500' 
        : 'fa-regular fa-heart text-slate-300 group-hover:text-rose-400';  
    const outerBtnClass = isMenuLikedBefore 
        ? 'text-rose-600 border-rose-200 bg-rose-50/80 shadow-sm' 
        : 'text-slate-600 bg-white hover:bg-rose-50 hover:border-rose-200 border-slate-200 shadow-sm';
    menuCard.innerHTML = `
        <div onclick="toggleMenuDetail(${menu.id})" class="p-5 flex justify-between items-center cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition">
            <div class="w-32 h-32 flex-shrink-0 overflow-hidden border-r border-slate-100">
                <img src="${menu.image_url}" alt="${menu.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
            </div>

            <div class="space-y-1 flex-1 pl-4 pr-5 py-3">
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

function renderMenuDetailSection(menu) {
    let currentTotal = 0;
    let ingredientsHTML = '';
    
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

    let commentsHTML = '';
    (menu.comments || []).forEach(c => {
        commentsHTML += `
            <div class="bg-slate-800/40 p-2 rounded border border-slate-800 text-xs">
                <strong class="text-teal-400">${c.user}:</strong> <span class="text-slate-300">${c.text}</span>
            </div>
        `;
    });

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

window.updateCatalogItemQty = function(menuId, index, change) {
    let targetMenu = null;
    
    if (window.allCatalogMenus) {
        targetMenu = window.allCatalogMenus.find(m => m.id === menuId);
    } else if (window.selectedCatalogMenu && window.selectedCatalogMenu.id === menuId) {
        targetMenu = window.selectedCatalogMenu;
    }

    if (!targetMenu || !targetMenu.ingredients || !targetMenu.ingredients[index]) {
        console.error("Hata: Değiştirilmek istenen menü veya malzeme datası bulunamadı!");
        return;
    }

    let currentQty = parseInt(targetMenu.ingredients[index].quantity) || 0;
    currentQty += change;

    if (currentQty < 0) currentQty = 0; 

    targetMenu.ingredients[index].quantity = currentQty;
    
    if (typeof renderMenusCatalogList === 'function') {
        renderMenusCatalogList(); 
    }
};

window.addCatalogMenuToCart = function() {
    let activeMenu = null;
    
    if (window.selectedCatalogMenu) {
        if (window.allCatalogMenus) {
            activeMenu = window.allCatalogMenus.find(m => m.id === window.selectedCatalogMenu.id);
        }
        
        if (!activeMenu) {
            activeMenu = window.selectedCatalogMenu;
        }
    }

    if (!activeMenu) {
        console.error("Hata: Sepete atılacak aktif menü referansı bulunamadı!");
        return;
    }
window.activeMenuId = null; // Aktif menüyü bellekten sil
    renderMenusCatalogList();   // Listeyi yeniden çiz (her şey kapalı gelecektir)
    // --------------------------

    if (typeof switchPage === "function") switchPage('cart');
    const validIngredients = activeMenu.ingredients.filter(i => i.quantity > 0);

    if (validIngredients.length === 0) {
        alert("Lütfen sepet için en az bir ürünün miktarını artırın!");
        return;
    }

    validIngredients.forEach(item => {
        const realProduct = (typeof allProducts !== 'undefined' && allProducts.length > 0)
            ? allProducts.find(p => p.name.toLowerCase().includes(item.name.toLowerCase()))
            : null;
        
        const finalQuantity = item.quantity;

        if (realProduct) {
            for (let i = 0; i < finalQuantity; i++) {
                if (typeof addToCart === "function") addToCart(realProduct.id);
            }
        } else {
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

    if (typeof saveAndRefreshCart === "function") saveAndRefreshCart();
    else if (typeof saveCartToStorage === "function") saveCartToStorage();

    if (typeof showToast === "function") {
        showToast(`🎉 "${activeMenu.title}" malzemeleri sepetinize eklendi!`);
    } else {
        alert(`🎉 "${activeMenu.title}" içerisinden seçtiğiniz taze malzemeler sepetinize başarıyla fırlatıldı!`);
    }
    if (typeof switchPage === "function") switchPage('cart');
};

async function submitCatalogComment(menuId) {
    const userInput = document.getElementById('comment-user');
    const textInput = document.getElementById('comment-text');

    const user = userInput.value.trim();
    const text = textInput.value.trim();

    if (!user || !text) {
        alert('Lütfen adınızı ve yorumunuzu doldurun!');
        return;
    }

    try {
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
            
            const noCommentsYet = commentsListDiv.querySelector('.no-comments-yet');
            if (noCommentsYet) {
                noCommentsYet.remove();
            }

            const newCommentHTML = `
                <div class="bg-slate-800/40 p-2 rounded border border-slate-800 text-xs animation-fade-in">
                    <strong class="text-teal-400">${data.comment.user}:</strong> <span class="text-slate-300">${data.comment.text}</span>
                </div>
            `;
            
            commentsListDiv.insertAdjacentHTML('beforeend', newCommentHTML);
            
            textInput.value = '';
            
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
    const token = localStorage.getItem('token'); 

    if (!token) {
        alert('Menüleri beğenebilmek için lütfen önce giriş yapınız.');
        return;
    }

    let activeUserId = null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        
        activeUserId = decoded.id || decoded.userId || decoded.sub; 
    } catch (e) {
        console.error("Token çözülemedi:", e);
    }

    if (!activeUserId) {
        alert('Oturum bilginiz doğrulanamadı. Lütfen tekrar giriş yapınız.');
        return;
    }

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
                body: JSON.stringify({ userId: activeUserId })
            }
        );

        const data = await response.json();

        if (!data.success) {
            console.error("Beğeni işlemi başarısız:", data.error);
            return;
        }

        if (window.allCatalogMenus) {
            const m = window.allCatalogMenus.find(m => Number(m.id) === Number(menuId));
            if (m) {
                m.likes = data.likes;
                m.isLiked = data.isLiked;
            }
        }

        if (window.selectedCatalogMenu && Number(window.selectedCatalogMenu.id) === Number(menuId)) {
            window.selectedCatalogMenu.likes = data.likes;
            window.selectedCatalogMenu.isLiked = data.isLiked;
        }

        if (typeof renderMenusCatalogList === 'function') {
            renderMenusCatalogList();
        }

    } catch (error) {
        console.error('Like sistemi hatası:', error);
    }
};
// 3. Aktivite ve Sepet Güncellemeleri
function addToCart(productId) {
    const item = allProducts.find(p => p.id === productId);
    if (!item) return;
    const existing = cart.find(c => c.id === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    saveAndRefreshCart();
}

function updateQuantity(productId, amount) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) cart = cart.filter(c => c.id !== productId);
    saveAndRefreshCart();
}

function saveAndRefreshCart() {
    localStorage.setItem('smartcart_cart', JSON.stringify(cart));
    updateCartUI();
    // 🧠 ENTEGRASYON NOKTASI: Sepet her değiştiğinde ajanları otomatik uyar!
    //askAiAssistant();
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('smartcart_cart');
    if (stored) cart = JSON.parse(stored);
    updateCartUI();
    //if(cart.length > 0) askAiAssistant();
}

function updateCartUI() {
    const totalCount = cart.reduce((acc, obj) => acc + obj.quantity, 0);
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) cartBadge.innerText = totalCount;
    
    const listContainer = document.getElementById('cart-items-list');
    if (!listContainer) return;
    
    let totalPrice = 0;

    if (cart.length === 0) {
        listContainer.innerHTML = '<p class="text-slate-400 py-12 text-center">Sepetiniz boş.</p>';
        document.getElementById('cart-total').innerText = '0.00 TL';
        document.getElementById('ai-agent-panel')?.classList.add('hidden'); // Sepet boşsa paneli gizle
        return;
    }

    listContainer.innerHTML = '';
    cart.forEach(item => {
        const itemCost = item.price * item.quantity;
        totalPrice += itemCost;
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between py-4';
        row.innerHTML = `
            <div><h4 class="font-bold text-slate-900">${item.name}</h4><p class="text-xs text-slate-400">${item.price.toFixed(2)} TL</p></div>
            <div class="flex items-center gap-4">
                <div class="flex items-center bg-slate-100 rounded-lg p-1">
                    <button onclick="updateQuantity(${item.id}, -1)" class="px-2 font-bold">-</button>
                    <span class="px-3 font-semibold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="px-2 font-bold">+</button>
                </div>
                <span class="font-bold text-slate-900">${itemCost.toFixed(2)} TL</span>
            </div>
        `;
        listContainer.appendChild(row);
    });
    document.getElementById('cart-total').innerText = `${totalPrice.toFixed(2)} TL`;
}
// 🛒 Siparişi Kesin Olarak Tamamlama ve Tabloya Anlık Gönderme Fonksiyonu
function checkout() {
    if (!cart || cart.length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    // 🌟 orders.js'deki mantıkla birebir aynı kullanıcı adını buluyoruz
    let userName = 'default_user';
    let userStorage = localStorage.getItem('userName') || localStorage.getItem('username') || localStorage.getItem('user');
    if (userStorage) {
        if (userStorage.startsWith('{')) {
            try {
                const parsed = JSON.parse(userStorage);
                userName = parsed.name || parsed.username || 'default_user';
            } catch(e) { userName = 'default_user'; }
        } else {
            userName = userStorage;
        }
    }

    const userOrdersKey = `orders_${userName}`;
    let userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

    const newOrder = {
        id: '#SC-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        timestamp: Date.now(),
        items: [...cart],
        total: cart.reduce((acc, obj) => acc + (obj.price * obj.quantity), 0),
        status: 'Hazırlanıyor'
    };

    userOrders.unshift(newOrder);
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));

    // Sepeti temizle
    cart = [];
    if (typeof saveAndRefreshCart === 'function') saveAndRefreshCart();

    // Sayfayı değiştir
    if (typeof switchPage === 'function') {
        switchPage('orders');
    } else {
        document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
        document.getElementById('page-orders').classList.remove('hidden');
    }

    // Tabloyu zorunlu güncelle
    if (typeof renderOrders === 'function') {
        renderOrders();
    }
}



// Global kapsama açmayı unutmayalım
window.checkout = checkout;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.saveAndRefreshCart = saveAndRefreshCart;
window.loadCartFromStorage = loadCartFromStorage;
window.updateCartUI = updateCartUI;
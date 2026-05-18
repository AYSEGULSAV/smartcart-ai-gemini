const BACKEND = 'http://localhost:5000';
const BACKEND_API = `${BACKEND}/api`;
const AUTH_API = `${BACKEND}/auth`;
const AI_ASSISTANT_API = 'http://localhost:5001/api/assistant/chat';

let allProducts = [];
let cart = [];
let currentCategory = 'Tümü';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCartFromStorage();
});

async function fetchProducts() {
    try {
        const response = await fetch(`${BACKEND_API}/products`);

        if (!response.ok) throw new Error("Products API error");

        const data = await response.json();

        allProducts = Array.isArray(data)
            ? data
            : (data.products || data.data || []);

        renderProducts();

    } catch (error) {
        console.error("Products error:", error);

        allProducts = [
            { id: 1, name: "Dana Kıyma 500g", category: "Kasap", price: 195, stock: 40 },
            { id: 2, name: "Domates", category: "Manav", price: 35, stock: 120 }
        ];

        renderProducts();
    }
}
// 2. Ürünleri Reyonlara Göre Ekrana Basma
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    const filtered = currentCategory === 'Tümü' ? allProducts : allProducts.filter(p => p.category === currentCategory);
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition';
        card.innerHTML = `
            <div>
                <span class="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">${product.category}</span>
                <h3 class="font-bold text-slate-900 mt-2 line-clamp-2 h-12">${product.name}</h3>
                <p class="text-xs text-slate-400 mt-1">Stok: ${product.stock} adet</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <span class="text-lg font-extrabold text-emerald-600">${product.price.toFixed(2)} TL</span>
                <button onclick="addToCart(${product.id})" class="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-sm font-medium transition"><i class="fa-solid fa-plus"></i> Ekle</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

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
    document.getElementById('cart-badge').innerText = totalCount;
    const listContainer = document.getElementById('cart-items-list');
    let totalPrice = 0;

    if (cart.length === 0) {
        listContainer.innerHTML = '<p class="text-slate-400 py-12 text-center">Sepetiniz boş.</p>';
        document.getElementById('cart-total').innerText = '0.00 TL';
        document.getElementById('ai-agent-panel').classList.add('hidden'); // Sepet boşsa paneli gizle
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

// 4. 🧭 SPA Sayfa Geçişleri
function switchPage(pageId) {
    const token = localStorage.getItem('token');
    
    // Eğer kullanıcı giriş yapmadıysa ve market/sepet/orders/ai-hub'a gitmeye çalışıyorsa engelle
    if (!token && pageId !== 'welcome') {
        alert("Bu sayfayı görüntülemek için lütfen önce giriş yapın.");
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
}

function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('#category-filters button').forEach(btn => {
        btn.className = 'cat-btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition';
    });
    event.target.className = 'cat-btn active bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm';
    renderProducts();
}

// app.js dosyasının en altına eklenecek yeni global değişkenler ve fonksiyonlar:

let chatHistory = [];       // Tüm konuşma geçmişini tutar
let hubSavedInventory = []; // RecipeAgent'ın aklında tuttuğu ev envanteri hafızası
let currentHubMissingItems = []; // En son hesaplanan eksik ürün listesi

async function sendHubMessage() {
    const inputEl = document.getElementById('chat-user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    // 1. Kullanıcı mesajını ekrana bas ve geçmişe ekle
    appendMessageHTML('User', userText);
    chatHistory.push({ role: 'user', parts: [{ text: userText }] });
    inputEl.value = '';

    // Ekranda yükleniyor simülasyonu göster
    const messagesBox = document.getElementById('chat-messages-box');
    const loadingId = 'ai-loading-bubble';
    messagesBox.innerHTML += `
        <div id="${loadingId}" class="flex gap-3 max-w-[85%]">
            <div class="bg-slate-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 animate-spin">AI</div>
            <div class="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-slate-400 italic">Ajanlar aralarında tartışıyor...</div>
        </div>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
        // 2. Çoklu Ajan Merkezine (Port 5001) İstek Atılıyor
        const response = await fetch('http://localhost:5001/api/assistant/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                currentInventory: hubSavedInventory,
                dbSample: allProducts.slice(0, 20) // Gramaj ve fiyat şeması eşleşmesi için ilk 20 ürünü gönderiyoruz
            })
        });

        const resData = await response.json();
        
        // Yükleniyor balonunu kaldır
        document.getElementById(loadingId)?.remove();

        if (resData.success && resData.data) {
            const agentOutput = resData.data;

            // 3. Hafızayı Güncelle (RecipeAgent'ın yeni state'i)
            hubSavedInventory = agentOutput.evEnvanteri || [];
            currentHubMissingItems = agentOutput.missingItems || [];

            // 4. Arayüz Güncellemeleri
            // Chatbot cevabını ekrana bas
            appendMessageHTML('AI', agentOutput.assistantReply);
            chatHistory.push({ role: 'model', parts: [{ text: agentOutput.assistantReply }] });

            // Sağ Kontrol Odasını Güncelle (EventAgent & RecipeAgent UI)
            document.getElementById('hub-active-concept').innerText = agentOutput.activeConcept || "Belirlenmedi";
            document.getElementById('hub-proposed-menu').innerText = agentOutput.proposedMenu || "Önerilen Paket";
            
            // Ev Envanteri Rozetlerini Bas
            const invContainer = document.getElementById('hub-home-inventory');
            invContainer.innerHTML = '';
            if (hubSavedInventory.length === 0) {
                invContainer.innerHTML = '<span class="text-xs text-slate-400 italic">Ev envanteri boş.</span>';
            } else {
                hubSavedInventory.forEach(item => {
                    invContainer.innerHTML += `<span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md border border-amber-200"><i class="fa-solid fa-circle-check"></i> ${item}</span>`;
                });
            }

            // Eksik Malzemeleri ve Porsiyon Notlarını Sağ Panele Diz (PortionAgent UI)
            const missingContainer = document.getElementById('hub-missing-items-list');
            missingContainer.innerHTML = '';
            let totalCost = 0;

            if (currentHubMissingItems.length === 0) {
                missingContainer.innerHTML = '<p class="text-slate-400 text-sm py-4 text-center">Tebrikler! Mağazadan alınacak eksik kalmadı.</p>';
            } else {
                currentHubMissingItems.forEach(item => {
                    const itemTotal = item.price * (item.quantity || 1);
                    totalCost += itemTotal;
                    
                    const row = document.createElement('div');
                    row.className = 'py-3 border-b border-slate-800/50 text-sm';
                    row.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div>
                                <h5 class="font-bold text-slate-200">${item.name}</h5>
                                <p class="text-xs text-teal-500 mt-0.5"><i class="fa-solid fa-calculator"></i> ${item.reason}</p>
                            </div>
                            <div class="text-right">
                                <span class="font-extrabold text-teal-400 block">${itemTotal.toFixed(2)} TL</span>
                                <span class="text-xs text-slate-400">${item.quantity} Adet x ${item.price.toFixed(2)} TL</span>
                            </div>
                        </div>
                    `;
                    missingContainer.appendChild(row);
                });
            }

            document.getElementById('hub-missing-total').innerText = `${totalCost.toFixed(2)} TL`;

        } else {
            throw new Error("Ajanlar geçersiz format döndü.");
        }
    } catch (error) {
        document.getElementById(loadingId)?.remove();
        console.error("Chat hub hatası:", error);
        appendMessageHTML('AI', "⚠️ Ajan hub sunucusuyla bağlantı kurulamadı. Lütfen Port 5001 sunucunuzun açık olduğundan emin olun.");
    }
}

// Mesaj Baloncuğu Yaratma Yardımcısı
function appendMessageHTML(sender, text) {
    const messagesBox = document.getElementById('chat-messages-box');
    const isAi = sender === 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = `flex gap-3 max-w-[85%] ${isAi ? '' : 'ml-auto justify-end'}`;
    bubble.innerHTML = `
        ${isAi ? '<div class="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">AI</div>' : ''}
        <div class="${isAi ? 'bg-white border border-slate-200 text-slate-700' : 'bg-emerald-600 text-white'} p-3 rounded-2xl shadow-sm">
            ${text}
        </div>
        ${isAi ? '' : '<div class="bg-slate-300 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">SEN</div>'}
    `;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

// 🛒 Eksikleri Gerçek Alışveriş Sepetine Yükleme
// 🛒 Eksikleri Gerçek Alışveriş Sepetine Yükleme (MANUEL GÜNCELLEME UYUMLU)
function addHubMissingToCart() {
    if (currentHubMissingItems.length === 0) {
        alert("Ekleme yapılacak eksik ürün bulunamadı!");
        return;
    }

    currentHubMissingItems.forEach(missingItem => {
        // Mağazadaki gerçek ürünü ismiyle eşleştirmeyi dene
        const realProduct = allProducts.find(p => p.name.toLowerCase().includes(missingItem.name.toLowerCase()));
        
        // 🌟 Burası güncellendi: Artık kullanıcının ekranda + - ile belirlediği en son adeti alıyoruz!
        const finalQuantity = missingItem.quantity || 1; 

        if (realProduct) {
            // Eğer senin ana `addToCart` fonksiyonun adet parametresi alıyorsa doğrudan gönderiyoruz:
            // Örn: addToCart(realProduct.id, finalQuantity);
            // Eğer sadece 1'er adet ekliyorsa, döngüyü kullanıcının güncellediği sayı kadar döndürüyoruz:
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

// Auth pencerelerini açıp kapatma fonksiyonları
function openAuthModal(type = 'login') {
    document.getElementById('auth-modal').classList.remove('hidden');
    toggleAuthForm(type);
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    // 🌟 ÇÖZÜM 2: Modal kapatıldığında formların içindeki tüm yazıları temizle
    clearAuthForms();
}

function toggleAuthForm(type) {
    // 🌟 ÇÖZÜM 2: Formlar arasında geçiş yaparken de eski yazılanları temizle
    clearAuthForms();

    if (type === 'login') {
        document.getElementById('login-form-container').classList.remove('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
    } else {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    }
}

// 🌟 YENİ YARDIMCI FONKSİYON: Tüm input alanlarını sıfırlar
function clearAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
}

// Kayıt ve Giriş İsteklerini Yöneten Fonksiyon
async function handleAuth(event, type) {
    event.preventDefault();
    
    const url = type === 'login'
        ? 'http://localhost:5000/auth/login'
        : 'http://localhost:5000/auth/register';
    let bodyData = {};

    if (type === 'login') {
        bodyData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };
    } else {
        bodyData = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value
        };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            if (type === 'login') {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userName', result.user.name);
                
                // 🌟 ÇÖZÜM 2: Başarılı giriş sonrasında form alanlarını temizle ve kapat
                clearAuthForms(); 
                checkAuthStatus();
                closeAuthModal();
            } else {
                // 🌟 ÇÖZÜM 2: Başarılı kayıt sonrası form temizlenip login formuna geçiş yapar
                clearAuthForms();
                toggleAuthForm('login'); 
            }
        } else {
            alert(result.message || "Bir hata oluştu.");
        }
    } catch (error) {
        console.error("Auth Hatası:", error);
        alert("Sunucuya bağlanılamadı.");
    }
}

// Kullanıcı Giriş Durumunu Kontrol Eden ve Arayüzü Güncelleyen Fonksiyon
// Kullanıcı Giriş Durumunu Kontrol Eden ve Arayüzü Güncelleyen Fonksiyon
function checkAuthStatus() {
    const authContainer = document.getElementById('auth-status-container');
    if (!authContainer) return;

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (token && userName) {
        // GİRİŞ YAPILDIYSA: İsmini göster ve Şık bir Çıkış Yap butonu ekle
        authContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-slate-700 hidden sm:inline"><i class="fa-solid fa-circle-user text-emerald-500 mr-1"></i> ${userName}</span>
                <button onclick="handleLogout()" class="bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2 border border-rose-200">
                    <i class="fa-solid fa-right-from-bracket"></i> <span>Çıkış Yap</span>
                </button>
            </div>
        `;
        
        // Kullanıcı giriş yaptıysa hoş geldiniz ekranından çıkartıp markete yönlendir
        const welcomeSection = document.getElementById('page-welcome');
        if (welcomeSection && !welcomeSection.classList.contains('hidden')) {
            switchPage('market');
        }
    } else {
        // GİRİŞ YAPILMDIYSA: Standart Giriş Yap Butonunu Geri Getir
        authContainer.innerHTML = `
            <button onclick="openAuthModal('login')" id="nav-auth-btn" class="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2">
                <i class="fa-solid fa-user"></i> <span id="nav-auth-text">Giriş Yap</span>
            </button>
        `;
        
        // Oturum yoksa zorunlu olarak hoş geldiniz ekranını göster
        switchPage('welcome');
    }
}
// Oturumu Tamamen Sonlandıran ve Ana Sayfaya Yönlendiren Fonksiyon
function handleLogout() {
    // 1. Tarayıcı hafızasındaki token ve kullanıcı verilerini tamamen temizle
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // 🌟 ÇÖZÜM 1: Çıkış yapıldığında sepeti hem hafızadan hem de ekrandan tamamen temizle
    localStorage.removeItem('smartcart_cart'); 
    cart = [];
    updateCartUI();

    // Chat hub geçmişini ve ajan envanterini de sonraki kullanıcı için temizliyoruz
    chatHistory = [];
    hubSavedInventory = [];
    currentHubMissingItems = [];

    alert("Oturumunuz güvenli bir şekilde sonlandırıldı.");
    
    // 2. Arayüzü güncelle (Bu fonksiyon otomatik olarak kullanıcıyı 'welcome' sayfasına fırlatacak)
    checkAuthStatus();
}
// Sayfa ilk yüklendiğinde oturum durumunu kontrol etmesi için tetikliyoruz
document.addEventListener('DOMContentLoaded', checkAuthStatus);




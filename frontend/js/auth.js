// 🔐 Auth pencerelerini açıp kapatma fonksiyonları
function openAuthModal(type = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        toggleAuthForm(type);
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
    // 🌟 Modal kapatıldığında formların içindeki tüm yazıları temizle
    clearAuthForms();
}

function toggleAuthForm(type) {
    // 🌟 Formlar arasında geçiş yaparken de eski yazılanları temizle
    clearAuthForms();

    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');

    if (type === 'login') {
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
    } else {
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    }
}

// 🌟 YARDIMCI FONKSİYON: Tüm input alanlarını sıfırlar
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
            if (type === 'login') {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userName', result.user.name);
                
                clearAuthForms(); 
                checkAuthStatus();
                closeAuthModal();
                
                // 🌟 Giriş yapıldığı an sipariş tablosunu anlık olarak güncelle/tetikle
                if (typeof renderOrders === 'function') {
                    renderOrders();
                }
                
                // 🌟 ALERT YERİNE: Sol altta şık bir hoş geldin bildirimi göster
                showToast(`👋 Hoş geldiniz, ${result.user.name}!`);
            } else {
                // 🌟 ALERT YERİNE: Giriş yapabilirsiniz mesajı ver ve login formuna at
                clearAuthForms();
                toggleAuthForm('login'); 
                
                // Yeni gradyan tasarımdaki h3 etiketine göre seçiciyi güncelledik
                const loginTitle = document.querySelector('#login-form-container h3');
                if (loginTitle) {
                    loginTitle.innerHTML = 'SmartCart AI\'a Giriş Yap <br><span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl block mt-2 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">🎉 Kayıt başarılı! Giriş yapabilirsiniz.</span>';
                }
            }
        } else {
            alert(result.message || "Bir hata oluştu."); 
        }
    } catch (error) {
        console.error("Auth Hatası:", error);
        alert("Sunucuya bağlanılamadı.");
    }
}

// 🌟 Modern bildirim penceresi (Toast) gösterme fonksiyonu
function showToast(message) {
    // Varsa eski toast'ı temizle
    document.getElementById('custom-toast')?.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    // Gradyan temaya uyumlu siber-koyu arka plan tasarımı
    toast.className = 'fixed bottom-5 left-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl shadow-indigo-500/10 z-50 flex items-center gap-3 border border-slate-800 transition-all duration-300 transform translate-y-10 opacity-0';
    toast.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shadow-lg shadow-emerald-400"></span> <span>${message}</span>`;
    
    document.body.appendChild(toast);

    // Animasyonla yukarı kaydırarak göster
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // 3 saniye sonra otomatik kaldır
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => { toast.remove(); }, 300);
    }, 3000);
}

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
                <span class="text-sm font-semibold text-slate-700 hidden sm:inline">
                    <i class="fa-solid fa-circle-user text-emerald-500 mr-1"></i> ${userName}
                </span>
                <button onclick="handleLogout()" class="bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2 border border-rose-200">
                    <i class="fa-solid fa-right-from-bracket"></i> <span>Çıkış Yap</span>
                </button>
            </div>
        `;
        
        // Kullanıcı giriş yaptıysa hoş geldiniz ekranından çıkartıp markete yönlendir
        if (typeof switchPage === 'function') {
            const welcomeSection = document.getElementById('page-welcome');
            if (welcomeSection && !welcomeSection.classList.contains('hidden')) {
                switchPage('market');
            }
        }
    } else {
        // GİRİŞ YAPILMDIYSA: Standart Giriş Yap Butonunu Geri Getir
        authContainer.innerHTML = `
            <button onclick="openAuthModal('login')" id="nav-auth-btn" class="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2">
                <i class="fa-solid fa-user"></i> <span id="nav-auth-text">Giriş Yap</span>
            </button>
        `;
        
        // Oturum yoksa zorunlu olarak hoş geldiniz ekranını göster
        if (typeof switchPage === 'function') {
            switchPage('welcome');
        }
    }
}

// Oturumu Tamamen Sonlandıran ve Ana Sayfaya Yönlendiren Fonksiyon
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // Çıkış yapıldığında sepeti hem hafızadan hem de ekrandan tamamen temizle
    localStorage.removeItem('smartcart_cart'); 
    if (typeof cart !== 'undefined') cart = [];
    if (typeof updateCartUI === 'function') updateCartUI();

    // Chat hub geçmişini ve ajan envanterini de sonraki kullanıcı için temizliyoruz
    if (typeof chatHistory !== 'undefined') chatHistory = [];
    if (typeof hubSavedInventory !== 'undefined') hubSavedInventory = [];
    if (typeof currentHubMissingItems !== 'undefined') currentHubMissingItems = [];

    // 🌟 ALERT YERİNE: Modern bildirim göster
    showToast("🚪 Oturumunuz sonlandırıldı. Ana sayfaya yönlendiriliyorsunuz...");
    
    // Arayüzü güncelle ve kullanıcıyı ana sayfaya (welcome) fırlat
    checkAuthStatus();
}

// Global kapsam tanımlamaları
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthForm = toggleAuthForm;
window.handleAuth = handleAuth;
window.checkAuthStatus = checkAuthStatus;
window.handleLogout = handleLogout;
window.showToast = showToast;
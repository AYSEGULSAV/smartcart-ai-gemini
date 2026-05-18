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

// Global kapsam tanımlamaları
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthForm = toggleAuthForm;
window.handleAuth = handleAuth;
window.checkAuthStatus = checkAuthStatus;
window.handleLogout = handleLogout;
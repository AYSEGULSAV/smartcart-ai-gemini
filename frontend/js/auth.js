// Auth pencerelerini açıp kapatma fonksiyonları
function openAuthModal(type = 'login') {
    document.getElementById('auth-modal').classList.remove('hidden');
    toggleAuthForm(type);
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    clearAuthForms();
}

function toggleAuthForm(type) {
    clearAuthForms();

    if (type === 'login') {
        document.getElementById('login-form-container').classList.remove('hidden');
        document.getElementById('register-form-container').classList.add('hidden');
    } else {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    }
}

function clearAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
}

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
                
                showToast(`👋 Hoş geldiniz, ${result.user.name}!`);
            } else {
                clearAuthForms();
                toggleAuthForm('login'); 
                showToast("🎉 Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
                
                const loginTitle = document.querySelector('#login-form-container h2');
                if (loginTitle) {
                    loginTitle.innerHTML = 'Giriş Yap <br><span class="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md block mt-1 border border-emerald-200">🎉 Kayıt başarılı! Giriş yapabilirsiniz.</span>';
                }
            }
        } else {
           showToast(`⚠️ ${result.message || "Bir hata oluştu."}`);
        }
    } catch (error) {
        console.error("Auth Hatası:", error);
        alert("Sunucuya bağlanılamadı.");
    }
}

function showToast(message) {
    document.getElementById('custom-toast')?.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    
    toast.className = `fixed bottom-5 left-5 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl z-[9999] flex items-center gap-2 border border-slate-700 transition-all duration-300 transform translate-y-10 opacity-0`;
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> <span>${message}</span>`;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => { toast.remove(); }, 300);
    }, 3000);
}


function checkAuthStatus() {
    const authContainer = document.getElementById('auth-status-container');
    if (!authContainer) return;

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (token && userName) {
        authContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-slate-700 hidden sm:inline"><i class="fa-solid fa-circle-user text-emerald-500 mr-1"></i> ${userName}</span>
                <button onclick="handleLogout()" class="bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2 border border-rose-200">
                    <i class="fa-solid fa-right-from-bracket"></i> <span>Çıkış Yap</span>
                </button>
            </div>
        `;
        
        const welcomeSection = document.getElementById('page-welcome');
        if (welcomeSection && !welcomeSection.classList.contains('hidden')) {
            switchPage('market');
        }
    } else {
        authContainer.innerHTML = `
            <button onclick="openAuthModal('login')" id="nav-auth-btn" class="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition flex items-center gap-2">
                <i class="fa-solid fa-user"></i> <span id="nav-auth-text">Giriş Yap</span>
            </button>
        `;    
        switchPage('welcome');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    localStorage.removeItem('smartcart_cart'); 
    cart = [];
    updateCartUI();

    chatHistory = [];
    hubSavedInventory = [];
    currentHubMissingItems = [];

    showToast("🚪 Oturumunuz sonlandırıldı. Ana sayfaya yönlendiriliyorsunuz...");
    
    checkAuthStatus();
}
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthForm = toggleAuthForm;
window.handleAuth = handleAuth;
window.checkAuthStatus = checkAuthStatus;
window.handleLogout = handleLogout;
window.showToast = showToast;

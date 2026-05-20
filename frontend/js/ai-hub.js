async function sendHubMessage() {
    const inputEl = document.getElementById('chat-user-input');
    if (!inputEl) return;
    const userText = inputEl.value.trim();
    if (!userText) return;

    // 1. Kullanıcı mesajını ekrana bas ve hafızaya ekle
    appendMessageHTML('User', userText);
    chatHistory.push({ role: 'user', parts: [{ text: userText }] });
    inputEl.value = '';

    const messagesBox = document.getElementById('chat-messages-box');
    if (!messagesBox) return;
    const loadingId = 'ai-loading-bubble';
    
    messagesBox.insertAdjacentHTML('beforeend', `
        <div id="${loadingId}" class="flex gap-3 max-w-[85%]">
            <div class="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 animate-spin">AI</div>
            <div class="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-slate-400 italic">Ajanlar aralarında tartışıyor...</div>
        </div>
    `);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:5001/api/assistant/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                currentInventory: hubSavedInventory,
                dbSample: allProducts.slice(0, 20)
            })
        });

        const resData = await response.json();
        
        document.getElementById(loadingId)?.remove();

        if (resData.success && resData.data) {
            const agentOutput = resData.data;

            hubSavedInventory = agentOutput.evEnvanteri || [];
            currentHubMissingItems = agentOutput.missingItems || [];

            appendMessageHTML('AI', agentOutput.assistantReply);
            chatHistory.push({ role: 'model', parts: [{ text: agentOutput.assistantReply }] });

            const conceptEl = document.getElementById('hub-active-concept-text');
            if (conceptEl) {
                conceptEl.innerText = agentOutput.activeConcept || "Belirlenmedi";
            }
            
            // Menü başlığını güncelle
            const menuEl = document.getElementById('hub-proposed-menu');
            if (menuEl) {
                menuEl.innerText = agentOutput.proposedMenu || "Önerilen Paket";
            }
            
            const recipeBox = document.getElementById('hub-menu-recipe-box');
            const allIngredientsEl = document.getElementById('hub-menu-all-ingredients');
            if (recipeBox && allIngredientsEl && agentOutput.missingItems) {
                recipeBox.classList.remove('hidden');
                const ingredientNames = agentOutput.missingItems.map(i => i.name).join(', ');
                allIngredientsEl.innerText = ingredientNames || "Gerekli malzeme bulunamadı.";
            }

            const invContainer = document.getElementById('hub-home-inventory');
            if (invContainer) {
                invContainer.innerHTML = '';
                if (hubSavedInventory.length === 0) {
                    invContainer.innerHTML = '<span class="text-xs text-slate-400 italic">Ev envanteri boş.</span>';
                } else {
                    hubSavedInventory.forEach(item => {
                        invContainer.insertAdjacentHTML('beforeend', `
                            <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md border border-amber-200">
                                <i class="fa-solid fa-circle-check"></i> ${item}
                            </span>
                        `);
                    });
                }
            }

            const missingContainer = document.getElementById('hub-missing-items-list');
            if (missingContainer) {
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

                // Toplam fiyatı güncelle
                const totalEl = document.getElementById('hub-missing-total');
                if (totalEl) {
                    totalEl.innerText = `${totalCost.toFixed(2)} TL`;
                }
            }

        } else {
            throw new Error("Ajanlar geçersiz veya boş bir format döndü.");
        }
    } catch (error) {
        document.getElementById(loadingId)?.remove();
        console.error("Chat hub hatası:", error);
        appendMessageHTML('AI', "⚠️ Ajan hub sunucusuyla bağlantı kurulamadı. Lütfen Port 5001 sunucunuzun açık olduğundan ve API anahtarınızın doğruluğundan emin olun.");
    }
}

function appendMessageHTML(sender, text) {
    const messagesBox = document.getElementById('chat-messages-box');
    if (!messagesBox) return;
    const isAi = sender === 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = `flex gap-3 max-w-[85%] ${isAi ? '' : 'ml-auto justify-end'}`;
    bubble.innerHTML = `
        ${isAi ? '<div class="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">AI</div>' : ''}
        <div class="${isAi ? 'bg-white border border-slate-200 text-slate-700' : 'bg-emerald-600 text-white'} p-3 rounded-2xl shadow-sm leading-relaxed">
            ${text}
        </div>
        ${isAi ? '' : '<div class="bg-slate-300 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">SEN</div>'}
    `;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}
function resetHubSession() {
    console.log("🛠️ Sıfırlama fonksiyonu tetiklendi!");

    // 1. Global hafıza değişkenlerini temizle
    chatHistory = [];
    hubSavedInventory = [];
    currentHubMissingItems = [];
    
    // Test: Gerçekten elemana erişebiliyor muyuz?
    const testEl = document.getElementById('chat-messages-box');
    if (!testEl) {
        console.error("❌ 'chat-messages-box' ID'li eleman bulunamadı!");
        return; 
    }
    
    // 2. Mesaj kutusunu temizle ve ilk hoş geldin mesajını yerleştir
    testEl.innerHTML = `
        <div class="flex gap-3 max-w-[85%]">
            <div class="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">AI</div>
            <div class="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-slate-700">
                Merhaba! Bu akşam nasıl bir organizasyon planlıyorsunuz? Kaç kişi geleceğini ve evdeki malzemelerinizi yazın, eksikleri porsiyonlayıp sepetinizi hazırlayayım!
            </div>
        </div>
    `;

    // 3. Giriş input alanını temizle
    const inputEl = document.getElementById('chat-user-input');
    if (inputEl) inputEl.value = '';

    // 4. Ajan Hafıza Durumu panelini sıfırla
    const conceptEl = document.getElementById('hub-active-concept-text');
    if (conceptEl) conceptEl.innerText = "Konsept Bekleniyor...";

    const invContainer = document.getElementById('hub-home-inventory');
    if (invContainer) invContainer.innerHTML = '<span class="text-xs text-slate-400 italic">Henüz malzeme kaydedilmedi.</span>';

    // 5. Önerilen Menü ve Tarif alanını sıfırla
    const menuEl = document.getElementById('hub-proposed-menu');
    if (menuEl) menuEl.innerText = "Önerilen Menü";

    const recipeBox = document.getElementById('hub-menu-recipe-box');
    if (recipeBox) recipeBox.classList.add('hidden');

    const allIngredientsEl = document.getElementById('hub-menu-all-ingredients');
    if (allIngredientsEl) allIngredientsEl.innerText = "Menü içeriği bekleniyor...";

    // 6. Eksik Malzemeler Listesini ve Toplam Tutarı sıfırla
    const missingContainer = document.getElementById('hub-missing-items-list');
    if (missingContainer) missingContainer.innerHTML = '<p class="text-slate-500 text-sm py-4 text-center">Eksik listesi çıkartılmadı.</p>';

    const totalEl = document.getElementById('hub-missing-total');
    if (totalEl) totalEl.innerText = "0.00 TL";

    console.log("🧹 [Sepetle Ai] Tüm oturum verileri ve arayüz başarıyla sıfırlandı.");
}

// Global scope'a bağlama (En altta bir kere tanımlayın)
window.resetHubSession = resetHubSession;
window.sendHubMessage = sendHubMessage;
window.appendMessageHTML = appendMessageHTML;

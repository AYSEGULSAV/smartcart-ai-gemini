async function sendHubMessage() {
    const inputEl = document.getElementById('chat-user-input');
    if (!inputEl) return;
    const userText = inputEl.value.trim();
    if (!userText) return;

    // 1. Kullanıcı mesajını ekrana bas ve geçmişe ekle
    appendMessageHTML('User', userText);
    chatHistory.push({ role: 'user', parts: [{ text: userText }] });
    inputEl.value = '';

    // Ekranda yükleniyor simülasyonu göster
    const messagesBox = document.getElementById('chat-messages-box');
    if (!messagesBox) return;
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
            if (invContainer) {
                invContainer.innerHTML = '';
                if (hubSavedInventory.length === 0) {
                    invContainer.innerHTML = '<span class="text-xs text-slate-400 italic">Ev envanteri boş.</span>';
                } else {
                    hubSavedInventory.forEach(item => {
                        invContainer.innerHTML += `<span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md border border-amber-200"><i class="fa-solid fa-circle-check"></i> ${item}</span>`;
                    });
                }
            }

            // Eksik Malzemeleri ve Porsiyon Notlarını Sağ Panele Diz (PortionAgent UI)
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

                document.getElementById('hub-missing-total').innerText = `${totalCost.toFixed(2)} TL`;
            }

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
    if (!messagesBox) return;
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

// Global kapsam tanımlamaları
window.sendHubMessage = sendHubMessage;
window.appendMessageHTML = appendMessageHTML;
// 📦 Sipariş Yönetim Modülü
function renderOrders() {
    const tableBody = document.getElementById('orders-history-rows');
    if (!tableBody) return;

    // Kullanıcı adını güvenli al
    let userName = localStorage.getItem('userName') || localStorage.getItem('username') || localStorage.getItem('user') || 'default_user';
    if (userName.startsWith('{')) {
        try { userName = JSON.parse(userName).name || 'default_user'; } catch(e) { userName = 'default_user'; }
    }

    const userOrdersKey = `orders_${userName}`;
    const userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];

    if (userOrders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="p-8 text-center text-slate-400 font-medium">
                    <i class="fa-solid fa-basket-shopping text-xl mr-2"></i> Henüz verilmiş bir siparişiniz bulunmuyor.
                </td>
            </tr>`;
        return;
    }

    const FIFTEEN_MINUTES = 15 * 60 * 1000; 
    const now = Date.now();
    let stateChanged = false;

    const updatedOrders = userOrders.map(order => {
        if (order.status === 'Hazırlanıyor' && (now - order.timestamp >= FIFTEEN_MINUTES)) {
            order.status = 'Teslim Edildi';
            stateChanged = true;
        }
        return order;
    });

    if (stateChanged) {
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
    }
// ... (renderOrders fonksiyonunun üst kısmı aynen kalıyor) ...

    tableBody.innerHTML = '';
    updatedOrders.forEach(order => {
        const isDelivered = order.status === 'Teslim Edildi';
        const row = document.createElement('tr');
        row.className = 'divide-y divide-slate-100 text-sm text-slate-600 hover:bg-indigo-50/20 transition-all duration-200';
        
        row.innerHTML = `
            <td class="p-5 font-bold text-slate-900 tracking-wide">${order.id}</td>
            <td class="p-5 font-medium text-slate-500">${order.date}</td>
            <td class="p-5">
                <span class="text-base font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ${order.total.toFixed(2)} TL
                </span>
            </td>
            <td class="p-5 text-right pr-8">
                <span class="px-3 py-1.5 rounded-2xl text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm border ${
                    isDelivered 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-emerald-500/10' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-300 shadow-amber-500/10 animate-pulse'
                }">
                    <i class="${isDelivered ? 'fa-solid fa-circle-check text-xs' : 'fa-solid fa-circle-notch animate-spin text-xs'}"></i>
                    ${order.status}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}



// Canlı izleme döngüsü
setInterval(() => {
    const ordersPage = document.getElementById('page-orders');
    if (ordersPage && !ordersPage.classList.contains('hidden')) {
        renderOrders();
    }
}, 5000);

window.renderOrders = renderOrders;
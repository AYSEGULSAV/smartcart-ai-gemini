function renderOrders() {
    const tableBody = document.getElementById('orders-history-rows');
    if (!tableBody) return;

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

    tableBody.innerHTML = '';
    updatedOrders.forEach(order => {
        const isDelivered = order.status === 'Teslim Edildi';
        const row = document.createElement('tr');
        row.className = 'divide-y divide-slate-100 text-sm text-slate-600 hover:bg-slate-50 transition';
        row.innerHTML = `
            <td class="p-4 font-bold text-slate-900">${order.id}</td>
            <td class="p-4">${order.date}</td>
            <td class="p-4 font-extrabold text-emerald-600">${order.total.toFixed(2)} TL</td>
            <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 border ${
                    isDelivered ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse'
                }">
                    <i class="${isDelivered ? 'fa-solid fa-circle-check' : 'fa-solid fa-truck-ramp-box'}"></i>
                    ${order.status}
                </span>
            </td>`;
        tableBody.appendChild(row);
    });
}

setInterval(() => {
    const ordersPage = document.getElementById('page-orders');
    if (ordersPage && !ordersPage.classList.contains('hidden')) {
        renderOrders();
    }
}, 5000);

window.renderOrders = renderOrders;
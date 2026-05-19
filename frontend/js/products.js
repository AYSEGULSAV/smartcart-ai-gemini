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

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
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
                <button onclick="addToCart(${product.id})" class="bg-gradient-to-r from-emerald-600 to-teal-500 hover:bg-emerald-700 text-white p-2 rounded-xl text-sm font-medium transition"><i class="fa-solid fa-plus"></i> Ekle</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('#category-filters button').forEach(btn => {
        btn.className = 'cat-btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition';
    });
    if (event && event.target) {
        event.target.className = 'cat-btn active bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm';
    }
    renderProducts();
}

window.fetchProducts = fetchProducts;
window.renderProducts = renderProducts;
window.filterCategory = filterCategory;
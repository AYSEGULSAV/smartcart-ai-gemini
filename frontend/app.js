async function generateRecipe() {
    const input = document.getElementById('ingredientsInput').value;
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('resultContainer');
    
    if (!input.trim()) return alert('Malzeme yazmalısınız!');
    const ingredientsArray = input.split(',').map(i => i.trim());

    submitBtn.innerText = 'Gemini Canlı Analiz Yapıyor...';
    submitBtn.disabled = true;

    try {
        // Express statik servis ettiği için doğrudan kendi portuna istek atıyoruz
        const response = await fetch('/api/recipe/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: ingredientsArray })
        });
        
        const data = await response.json();
        if(data.error) throw new Error(data.error);

        document.getElementById('recipeTitle').innerText = data.recipeName;
        const instructionsList = document.getElementById('recipeInstructions');
        instructionsList.innerHTML = '';
        data.instructions.forEach(step => {
            const li = document.createElement('li');
            li.innerText = step;
            instructionsList.appendChild(li);
        });

        const productsList = document.getElementById('recommendedProductsList');
        productsList.innerHTML = '';
        
        if (data.upsellCartPackage.products.length === 0) {
            document.getElementById('upsellPanel').classList.add('hidden');
        } else {
            document.getElementById('upsellPanel').classList.remove('hidden');
            data.upsellCartPackage.products.forEach(prod => {
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center bg-slate-900 p-3 rounded-lg text-xs border border-slate-800';
                li.innerHTML = `
                    <span><strong class="text-white">${prod.productName}</strong> <span class="text-slate-400">(${prod.reason})</span></span>
                    <span class="font-bold text-blue-400">${prod.price.toFixed(2)} TL</span>
                `;
                productsList.appendChild(li);
            });
            document.getElementById('addToCartBtn').innerText = data.upsellCartPackage.buttonText;
        }

        resultContainer.classList.remove('hidden');
    } catch (err) {
        alert("Hata: " + err.message + "\nLütfen backend/.env dosyasındaki GEMINI_API_KEY bilgisini kontrol edin.");
    } {
        submitBtn.innerText = 'Tarif ve Eksikleri Analiz Et';
        submitBtn.disabled = false;
    }
}
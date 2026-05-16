const { generateSmartRecipe } = require('../services/gemini.service');
const { matchGenericIngredientToProduct } = require('../services/search.service');
const pool = require('../../config/db');

async function handleRecipeGeneration(req, res) {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Malzemeler geçersiz." });
    }

    let stockContext = ["Zeytinyağı", "Kaşar Peyniri", "Makarna"];
    try {
        const discountResult = await pool.query("SELECT name FROM products WHERE is_campaign = true LIMIT 3");
        if(discountResult.rows.length > 0) stockContext = discountResult.rows.map(r => r.name);
    } catch(e) {
        // DB hatası durumunda sessizce mock context kullan
    }

    const aiResponse = await generateSmartRecipe(ingredients, stockContext);
    const recommendedProducts = [];
    let totalPackagePrice = 0;

    for (const item of aiResponse.missingIngredients) {
      const matchedProduct = await matchGenericIngredientToProduct(item.genericName, item.isStokEritme);
      if (matchedProduct) {
        recommendedProducts.push({
          productId: matchedProduct.id,
          productName: matchedProduct.name,
          price: parseFloat(matchedProduct.price),
          reason: item.reason,
          badge: item.isStokEritme ? "Fırsat Ürünü" : "Önerilen"
        });
        totalPackagePrice += parseFloat(matchedProduct.price);
      }
    }

    return res.status(200).json({
      recipeName: aiResponse.recipeName,
      instructions: aiResponse.instructions,
      upsellCartPackage: {
        totalPrice: totalPackagePrice,
        buttonText: `Eksikleri Tamamla (${totalPackagePrice.toFixed(2)} TL)`,
        products: recommendedProducts
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { handleRecipeGeneration };
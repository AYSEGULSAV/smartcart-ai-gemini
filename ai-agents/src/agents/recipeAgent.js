async function processRecipeAgent(currentInventory, dbSample) {
    return `
    [Agent: RecipeAgent]
    Kullanıcının ev envanteri hafızasını al: ${JSON.stringify(currentInventory)}.
    Eğer chat geçmişinde yeni malzemeler ("dolapta şu var" gibi) geçtiyse ev envanterine ekle.
    Önerilen menü için market envanterindeki gerçek ürünlerden hangilerinin eksik olduğunu bul ve detaylı tarif ver kullanıcın yemek hakkındaki diğer cevapları da özenle ver: ${JSON.stringify(dbSample)}.
    `;
}
module.exports = { processRecipeAgent };
async function processRecipeAgent(currentInventory, dbSample) {
    // Sadece hafıza ve envanter eşleştirme talimatını döner
    return `
    [Agent: RecipeAgent]
    Kullanıcının ev envanteri hafızasını al: ${JSON.stringify(currentInventory)}.
    Eğer chat geçmişinde yeni malzemeler ("dolapta şu var" gibi) geçtiyse ev envanterine ekle.
    Önerilen menü için market envanterindeki gerçek ürünlerden hangilerinin eksik olduğunu bul: ${JSON.stringify(dbSample)}.
    `;
}
module.exports = { processRecipeAgent };
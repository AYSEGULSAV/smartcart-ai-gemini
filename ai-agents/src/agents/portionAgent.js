async function processPortionAgent() {
    return `
    [Agent: PortionAgent]
    Tespit edilen kişi sayısına göre, RecipeAgent'ın çıkardığı eksik ürünlerin market paket gramajlarını incele.
    Kullanıcının sepete KAÇ ADET (quantity) eklemesi gerektiğini matematiksel olarak hesapla ve nedenini açıkla.
    `;
}
module.exports = { processPortionAgent };
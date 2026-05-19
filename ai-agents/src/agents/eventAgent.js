async function processEventAgent(messages) {
    return `
    [Agent: EventAgent]
    Kullanıcının şu ana kadarki chat geçmişini incele: ${JSON.stringify(messages)}.
    Kullanıcının sosyal konseptini (maç gecesi, kahvaltı vb.) ve kişi sayısını tespit et. 
    Bu konsepte uygun yaratıcı bir ana yemek/menü ismi belirle.
    `;
}
module.exports = { processEventAgent };
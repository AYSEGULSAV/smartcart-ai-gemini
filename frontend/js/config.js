// 🌐 API Tanımlamaları
const BACKEND = 'http://localhost:5000';
const BACKEND_API = `${BACKEND}/api`;
const AUTH_API = `${BACKEND}/auth`;
const AI_ASSISTANT_API = 'http://localhost:5001/api/assistant/chat';

// 📦 Global Durum Değişkenleri
let allProducts = [];
let cart = [];
let currentCategory = 'Tümü';

let chatHistory = [];       // Tüm konuşma geçmişini tutar
let hubSavedInventory = []; // RecipeAgent'ın aklında tuttuğu ev envanteri hafızası
let currentHubMissingItems = []; // En son hesaplanan eksik ürün listesi

// 🚀 Sayfa İlk Yüklendiğinde Tetiklenen Başlatıcılar
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCartFromStorage();
    checkAuthStatus();
});
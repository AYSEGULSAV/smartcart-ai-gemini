const BACKEND = 'http://localhost:5000';
const BACKEND_API = `${BACKEND}/api`;
const AUTH_API = `${BACKEND}/auth`;
const AI_ASSISTANT_API = 'http://localhost:5001/api/assistant/chat';

let allProducts = [];
let cart = [];
let currentCategory = 'Tümü';

let chatHistory = [];
let hubSavedInventory = [];
let currentHubMissingItems = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCartFromStorage();
    checkAuthStatus();
});
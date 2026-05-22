# 🛒 Sepetle AI (Formerly SmartCart AI)

Yapay zeka destekli, otonom ajan entegrasyonlu yeni nesil akıllı e-ticaret ve hızlı teslimat platformu. 

Sepetle AI, geleneksel market alışverişi süreçlerini modern LLM (Large Language Model) orkestrasyonuyla birleştirerek kullanıcılara sıradan bir sepet deneyiminden fazlasını sunar: Tamamen otonom bir mutfak ve alışveriş asistanı.

---
## 📺 Proje Sunum Videosu

<video src="GITHUB_DAN_ALDIGIN_VIDEO_LINKI_BURAYA.mp4" controls width="100%" poster="https://raw.githubusercontent.com/placehold-co/placehold/800x450/2c2c2c/ffffff?text=Sepetle+AI+Sunum+Videosu">
  Tarayıcınız video etiketini desteklemiyor.
</video>

## 🚀 Öne Çıkan Özellikler

*   **Sepetle AI Hub (Multi-Agent Mimarisi):** Arka planda birbiriyle entegre çalışan 3 farklı otonom yapay zeka ajanı:
    1.  *Menü ve Öneri Ajanı:* Kullanıcı taleplerine göre akıllı tarifler ve menüler geliştirir.
    2.  *Envanter Ajanı:* Kullanıcının evindeki mevcut malzemeleri hafızasında tutarak mükerrer ve gereksiz harcamaları önler.
    3.  *Porsiyon & Optimizasyon Ajanı:* Menü için gerekli eksik malzemelerin net miktarlarını hesaplar ve mutfak tüyoları verir.
*   **Sosyal Ticaret & Kampanyalar:** Kullanıcıların özel menüleri beğenebildiği, yorumlayabildiği ve tarif malzemelerini tek tıkla dinamik miktarlarda sepete ekleyebildiği interaktif akış.
*   **Hızlı ve Güvenli Market Deneyimi:** Anlık reyon filtreleme, sepet optimizasyonu ve toast bildirimleri içeren pürüzsüz arayüz.
*   **Canlı Sipariş Takibi:** Sipariş tamamlandığı andan teslimata kadar olan tüm sürecin durum kontrol ekranı.

---

## 🛠️ Teknik Yığın (Tech Stack)

*   **Backend:** Node.js, Express.js
*   **Database:** SQLite (Hızlı, taşınabilir ve ilişkisel veri yönetimi)
*   **AI SDK:** `@google/generative-ai` (Gemini Pro / Flash entegrasyonu)
*   **Güvenlik & Yetkilendirme:** JSON Web Tokens (JWT) & Güvenli `.env` mimarisi
---

## 📦 Kurulum ve Çalıştırma

### Gereksinimler
*   Node.js (v18+ önerilir)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/AYSEGULSAV/smartcart-ai-gemini.git
cd sepetle-ai-gemini
```
Projenin mikroservis yapısı gereği, ilgili servislerin klasörleri altında ortam değişkenlerinin ayrı ayrı tanımlanması gerekmektedir:

### 1. AI Agents Servisi Ayarları (`./ai-agents/.env`)
`ai-agents` klasörü içerisinde bir `.env` dosyası oluşturun:
```bash
PORT=5001
GEMINI_API_KEY=your_google_gemini_api_key_here
```
### 2. Backend Servisi Ayarları (`./ai-agents/.env`)
`ai-agents` klasörü içerisinde bir `.env` dosyası oluşturun:
```bash
PORT=5000
JWT_SECRET=your_super_secure_cryptographic_jwt_secret_key_here
```
### 3. Geliştirici Modu (Lokal)
Her iki servisi de kendi dizinlerinde bağımlılıkları yükleyerek ayağa kaldırabilirsiniz:
```bash
npm run dev
```

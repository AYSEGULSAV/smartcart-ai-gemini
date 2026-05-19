(() => {
    // 📦 Her ürüne özel, birebir ilgili ve yüksek kaliteli görsel linkleri eklenmiş ürün listesi
    let allProducts = [
        {
    "name": "Domates Salkım (Kg)",
    "category": "Manav",
    "price": 35.5,
    "stock": 120,
    "brand": "Yerli Üretim",
    "sku": "MNV-DOM-01",
    "image": "../images/SALKİMDOMATES.jpg"
  },
  {
    "name": "Salatalık (Kg)",
    "category": "Manav",
    "price": 22,
    "stock": 100,
    "brand": "Yerli Üretim",
    "sku": "MNV-SAL-01",
"image": "../images/salatalik.jpg"}
  
  ,{
    "name": "Sivri Biber (Kg)",
    "category": "Manav",
    "price": 45,
    "stock": 80,
    "brand": "Yerli Üretim",
    "sku": "MNV-BIB-01",
    "image": "../images/sivribiber.jpg"
  },
  {
    "name": "Kapya Biber (Kg)",
    "category": "Manav",
    "price": 60,
    "stock": 50,
    "brand": "Yerli Üretim",
    "sku": "MNV-BIB-02",
    "image": "../images/KAPYABİBER.jpg"
  },
  {
    "name": "Kuru Soğan (Kg)",
    "category": "Manav",
    "price": 18.5,
    "stock": 300,
    "brand": "Amasya",
    "sku": "MNV-SON-01",
"image": "../images/KURUSOGAN.jpg"
  },
  {
    "name": "Patates (Kg)",
    "category": "Manav",
    "price": 20,
    "stock": 400,
    "brand": "Niğde",
    "sku": "MNV-PAT-01",
"image": "../images/patates.jpg"
  },
  {
    "name": "Sarımsak (File)",
    "category": "Manav",
    "price": 30,
    "stock": 150,
    "brand": "Taşköprü",
    "sku": "MNV-SAR-01",
      "image": "../images/SARİMSAK.jpg"
  },
  {
    "name": "Limon (Kg)",
    "category": "Manav",
    "price": 28,
    "stock": 200,
    "brand": "Mersin",
    "sku": "MNV-LIM-01",
    "image": "../images/LİMON.jpg"
  },
  {
    "name": "Muz İthal (Kg)",
    "category": "Manav",
    "price": 85,
    "stock": 60,
    "brand": "Chiquita",
    "sku": "MNV-MUZ-01",
    "image": "../images/MUZ.jpg"
  },
  {
    "name": "Elma (Kg)",
    "category": "Manav",
    "price": 32,
    "stock": 140,
    "brand": "Yerli",
    "sku": "MNV-ELM-01",
    "image": "../images/ELMA (2).jpg"
  },
  {
    "name": "Portakal Sıkmalık (Kg)",
    "category": "Manav",
    "price": 24,
    "stock": 180,
    "brand": "Antalya",
    "sku": "MNV-POR-01",
    "image": "../images/PORTAKAL.jpg"
  },
  {
    "name": "Çilek (Paket 500g)",
    "category": "Manav",
    "price": 55,
    "stock": 40,
    "brand": "Silifke",
    "sku": "MNV-CIL-01",
    "image": "../images/CİLEK.jpg"
  },
  {
    "name": "Kıvırcık Marul (Adet)",
    "category": "Manav",
    "price": 25,
    "stock": 90,
    "brand": "Yerli",
    "sku": "MNV-MAR-01",
    "image": "../images/KİVİRCİKMARUL.jpg"
  },
  {
    "name": "Maydanoz (Demet)",
    "category": "Manav",
    "price": 10,
    "stock": 150,
    "brand": "Yerli",
    "sku": "MNV-MAY-01",
"image": "../images/mAYDONOZ.jpg"
  },
  {
    "name": "Dereotu (Demet)",
    "category": "Manav",
    "price": 10,
    "stock": 100,
    "brand": "Yerli",
    "sku": "MNV-DER-01",
    "image": "../images/dereotu.jpg"
  },
  {
    "name": "Nane (Demet)",
    "category": "Manav",
    "price": 10,
    "stock": 120,
    "brand": "Yerli",
    "sku": "MNV-NAN-01",
    "image": "../images/nane.jpg"
  },
  {
    "name": "Taze Soğan (Demet)",
    "category": "Manav",
    "price": 18,
    "stock": 80,
    "brand": "Yerli",
    "sku": "MNV-TSON-01",
    "image": "../images/tazesogan.png"
  },
  {
    "name": "Ispanak (Kg)",
    "category": "Manav",
    "price": 30,
    "stock": 70,
    "brand": "Yerli",
    "sku": "MNV-ISP-01",
    "image": "../images/ispanak.jpg"
  },
  {
    "name": "Roka (Demet)",
    "category": "Manav",
    "price": 12,
    "stock": 90,
    "brand": "Yerli",
    "sku": "MNV-ROK-01",
    "image": "../images/roka.png"
  },
  {
    "name": "Havuç (Kg)",
    "category": "Manav",
    "price": 22.5,
    "stock": 130,
    "brand": "Beypazarı",
    "sku": "MNV-HAV-01",
    "image": "../images/HAVUC.jpg"
  },
  {
    "name": "Karnabahar (Adet)",
    "category": "Manav",
    "price": 40,
    "stock": 45,
    "brand": "Yerli",
    "sku": "MNV-KAR-01",
    "image": "../images/karnibahar.jpg"
  },
  {
    "name": "Brokoli (500g)",
    "category": "Manav",
    "price": 35,
    "stock": 50,
    "brand": "Yerli",
    "sku": "MNV-BRO-01",
    "image": "../images/brokoli.png"
  },
  {
    "name": "Patlıcan (Kg)",
    "category": "Manav",
    "price": 38,
    "stock": 85,
    "brand": "Antalya",
    "sku": "MNV-PATL-01",
    "image": "../images/patlican.jpg"
  },
  {
    "name": "Kabak Sakız (Kg)",
    "category": "Manav",
    "price": 26,
    "stock": 95,
    "brand": "Yerli",
    "sku": "MNV-KAB-01",
    "image": "../images/kabaksakiz.jpg"
  },
  {
    "name": "Kültür Mantarı (400g)",
    "category": "Manav",
    "price": 42,
    "stock": 65,
    "brand": "Küre",
    "sku": "MNV-MAN-01",
    "image": "../images/kulturmantaru.jpg"
  },
  {
    "name": "İstiridye Mantarı (300g)",
    "category": "Manav",
    "price": 58,
    "stock": 30,
    "brand": "Küre",
    "sku": "MNV-MAN-02",
    "image": "../images/istiridyemantar.jpg"
  },
  {
    "name": "Avokado (Adet)",
    "category": "Manav",
    "price": 35,
    "stock": 70,
    "brand": "İthal",
    "sku": "MNV-AVO-01",
    "image": "../images/avokado.jpg"
  },
  {
    "name": "Kivi (Kg)",
    "category": "Manav",
    "price": 50,
    "stock": 80,
    "brand": "Yerli",
    "sku": "MNV-KIV-01",
    "image": "../images/kivi.jpg"
  },
  {
    "name": "Armut Santa Maria (Kg)",
    "category": "Manav",
    "price": 45,
    "stock": 100,
    "brand": "Yerli",
    "sku": "MNV-ARM-01",
    "image": "../images/armutsantaMaria.jpg"
  },
  {
    "name": "Kırmızı Lahana (Adet)",
    "category": "Manav",
    "price": 20,
    "stock": 110,
    "brand": "Yerli",
    "sku": "MNV-LAH-01",
    "image": "../images/kirmizilahana.jpg"
  },
        { "name": "Dana Kıyma (%20 Yağlı) 500g", "category": "Kasap", "price": 195.00, "stock": 40, "brand": "Eti Senin", "sku": "KSP-KIY-01", "image": "../images/DANAKİYMA.jpg" },
        { "name": "Dana Kuşbaşı 500g", "category": "Kasap", "price": 220.00, "stock": 35, "brand": "Eti Senin", "sku": "KSP-KUS-01", "image": "../images/DANAKUSBASİ.jpg" },
        { "name": "Dana Antrikot 300g", "category": "Kasap", "price": 210.00, "stock": 20, "brand": "Eti Senin", "sku": "KSP-ANT-01", "image": "../images/DANANTRİKOT.jpg" },
        { "name": "Dana Biftek 400g", "category": "Kasap", "price": 230.00, "stock": 25, "brand": "Eti Senin", "sku": "KSP-BIF-01", "image": "../images/DANABİFTEK.jpg" },
        { "name": "Dana Kasap Köfte 400g", "category": "Kasap", "price": 175.00, "stock": 50, "brand": "Eti Senin", "sku": "KSP-KOF-01", "image": "../images/DANAKOFTE.jpg" },
        { "name": "Banvit Tavuk Göğsü 500g", "category": "Kasap", "price": 120.00, "stock": 65, "brand": "Banvit", "sku": "KSP-TAV-01", "image": "../images/BanvitTavuGOGSU.jpg" },
        { "name": "Banvit Tavuk Baget (Kg)", "category": "Kasap", "price": 110.00, "stock": 80, "brand": "Banvit", "sku": "KSP-TAV-02", "image": "../images/BanvitTavuBaget.jpg" },
        { "name": "Banvit Tavuk Kanat 500g", "category": "Kasap", "price": 95.00, "stock": 55, "brand": "Banvit", "sku": "KSP-TAV-03", "image": "../images/BanvitTavukKanat.jpg" },
        { "name": "Banvit Tavuk Pirzola 500g", "category": "Kasap", "price": 130.00, "stock": 40, "brand": "Banvit", "sku": "KSP-TAV-04", "image": "../images/BanvitavukPirzola.jpg" },
        { "name": "Dana Bonfile (Kg)", "category": "Kasap", "price": 850.00, "stock": 15, "brand": "Gürme", "sku": "KSP-BON-01", "image": "../images/DanaBonfile (Kg).jpg" },
        { "name": "Dana Kuru Köfte 400g", "category": "Kasap", "price": 165.00, "stock": 45, "brand": "Pınar", "sku": "KSP-KOF-02", "image": "../images/DanAKuruKOfte.jpg" },
        { "name": "Kuzu Kuşbaşı 400g", "category": "Kasap", "price": 240.00, "stock": 30, "brand": "Eti Senin", "sku": "KSP-KZU-01", "image": "../images/Kuzu KuSBASI.jpg" },
        { "name": "Kuzu Gerdan (Kg)", "category": "Kasap", "price": 380.00, "stock": 20, "brand": "Yerli", "sku": "KSP-KZU-02", "image": "../images/Kuzu Gerdan.jpg" },
        { "name": "Kuzu Pirzola 300g", "category": "Kasap", "price": 290.00, "stock": 25, "brand": "Yerli", "sku": "KSP-KZU-03", "image": "../images/KuzuPirzola300g.jpg" },
        { "name": "Dana Ciğer 500g", "category": "Kasap", "price": 180.00, "stock": 15, "brand": "Eti Senin", "sku": "KSP-CIG-01", "image": "../images/DanaCiGer.jpg" },
        { "name": "Dana Hamburg Köftesi 360g", "category": "Kasap", "price": 190.00, "stock": 35, "brand": "Pınar", "sku": "KSP-KOF-03", "image": "../images/Dana Hamburg Koftesi.jpg" },
        { "name": "Tavuk Kıyma 500g", "category": "Kasap", "price": 85.00, "stock": 40, "brand": "Erpiliç", "sku": "KSP-TAV-05", "image": "../images/Tavuk Kima 500g.jpg" },
        { "name": "Erpiliç Roaster Bütün Tavuk", "category": "Kasap", "price": 140.00, "stock": 60, "brand": "Erpiliç", "sku": "KSP-TAV-06", "image": "../images/ErpiliC Roaster Bütün Tavuk.jpg" },
        { "name": "Dana Satır Köfte 400g", "category": "Kasap", "price": 185.00, "stock": 30, "brand": "Eti Senin", "sku": "KSP-KOF-04", "image": "../images/Dana Satİr Köfte.jpg" },
        { "name": "Kuzu Kıyma 500g", "category": "Kasap", "price": 230.00, "stock": 20, "brand": "Yerli", "sku": "KSP-KZU-04", "image": "../images/Kuzu Kiyma.jpg" },
        { "name": "Dana Sucuk İçi 250g", "category": "Kasap", "price": 120.00, "stock": 40, "brand": "Namet", "sku": "KSP-SUC-01", "image": "../images/Dana Sucuk İCi.jpg" },
        { "name": "Lezita Tavuk Şnitzel 400g", "category": "Kasap", "price": 75.00, "stock": 70, "brand": "Lezita", "sku": "KSP-TAV-07", "image": "../images/Lezita Tavuk Snitzel.jpg" },
        { "name": "Lezita Çıtır Tavuk Kovası", "category": "Kasap", "price": 115.00, "stock": 50, "brand": "Lezita", "sku": "KSP-TAV-08", "image": "../images/ezita Tavuk Kovasi.jpg" },
        { "name": "Dana Sac Kavurmalık 500g", "category": "Kasap", "price": 225.00, "stock": 30, "brand": "Eti Senin", "sku": "KSP-KUS-02", "image": "../images/Dana Sac Kavurmalik.jpg" },
        { "name": "Kuzu Külbastı 300g", "category": "Kasap", "price": 260.00, "stock": 18, "brand": "Yerli", "sku": "KSP-KZU-05", "image": "../images/Kuzu KUlbasti.jpg" },
        { "name": "Dana Şişlik Et 500g", "category": "Kasap", "price": 240.00, "stock": 25, "brand": "Eti Senin", "sku": "KSP-KUS-03", "image": "../images/DanaSİSlik Et.jpg" },
        { "name": "Hindi Göğüs Eti 500g", "category": "Kasap", "price": 140.00, "stock": 30, "brand": "Pınar", "sku": "KSP-HIN-01", "image": "../images/Hindi Kıyma.jpg" },
        { "name": "Hindi Kıyma 400g", "category": "Kasap", "price": 115.00, "stock": 35, "brand": "Pınar", "sku": "KSP-HIN-02", "image": "../images/Hindi Kİyma.jpg" },
        { "name": "Dana İncik (Kg)", "category": "Kasap", "price": 440.00, "stock": 20, "brand": "Yerli", "sku": "KSP-INC-01", "image": "../images/Dana İncik (Kg).jpg" },
        { "name": "Dana Çorbalık İlikli Kemik", "category": "Kasap", "price": 45.00, "stock": 90, "brand": "Eti Senin", "sku": "KSP-KEM-01", "image": "../images/download.jpg" },
        
        { "name": "Sütaş Süzme Peynir 500g", "category": "Şarküteri", "price": 85.00, "stock": 100, "brand": "Sütaş", "sku": "SRK-PEY-01", "image": "../images/Sutas Suzme Peynir.jpg" },
        { "name": "Sütaş Kaşar Peyniri 600g", "category": "Şarküteri", "price": 165.00, "stock": 80, "brand": "Sütaş", "sku": "SRK-PEY-02", "image": "../images/SutaS KaSar Peyniri.jpg" },
        { "name": "İçim Krema %35 Yağlı 200ml", "category": "Şarküteri", "price": 30.00, "stock": 150, "brand": "İçim", "sku": "SRK-KRE-01", "image": "../images/İcim Krema Yagli.jpg" },
        { "name": "Sütaş Ayran 1L", "category": "Şarküteri", "price": 25.00, "stock": 200, "brand": "Sütaş", "sku": "SRK-AYR-01", "image": "../images/Sutas Ayran.jpg" },
        { "name": "Sütaş Tam Yağlı Süt 1L", "category": "Şarküteri", "price": 32.00, "stock": 250, "brand": "Sütaş", "sku": "SRK-SUT-01", "image": "../images/Sutas Tam Yagli Sut 1L.jpg" },
        { "name": "Sütaş Yoğurt 3Kg", "category": "Şarküteri", "price": 115.00, "stock": 90, "brand": "Sütaş", "sku": "SRK-YOG-01", "image": "../images/Sutas Yogurt 3Kg.jpg" },
        { "name": "Pınar Labne 400g", "category": "Şarküteri", "price": 72.00, "stock": 110, "brand": "Pınar", "sku": "SRK-PEY-03", "image": "../images/Pinar Labne 400g.jpg" },
        { "name": "Namet Dana Kasap Sucuk 200g", "category": "Şarküteri", "price": 135.00, "stock": 75, "brand": "Namet", "sku": "SRK-SUC-02", "image": "../images/Namet Dana Kasap Sucuk 200g.jpg" },
        { "name": "Maret Boncuk Salam 250g", "category": "Şarküteri", "price": 68.00, "stock": 85, "brand": "Maret", "sku": "SRK-SAL-01", "image": "../images/Maret Boncuk Salam 250g.jpg" },
        { "name": "Pınar Aç bitir Dana Jambon 60g", "category": "Şarküteri", "price": 34.00, "stock": 140, "brand": "Pınar", "sku": "SRK-JAM-01", "image": "../images/Pinar Ac bitir Dana Jambon 60g.jpg" },
        { "name": "Şahin Kayseri Pastırması 100g", "category": "Şarküteri", "price": 180.00, "stock": 40, "brand": "Şahin", "sku": "SRK-PAS-01", "image": "../images/Sahin Kayseri Pasİırmasİ 100g.jpg" },
        { "name": "Tahsildaroğlu Ezine Peyniri 350g", "category": "Şarküteri", "price": 145.00, "stock": 65, "brand": "Tahsildaroğlu", "sku": "SRK-PEY-04", "image": "../images/tahsiloglu.jpg" },
        { "name": "Muratbey Burgu Peynir 200g", "category": "Şarküteri", "price": 78.00, "stock": 90, "brand": "Muratbey", "sku": "SRK-PEY-05", "image": "../images/Muratbey Burgu Peynir 200g.jpg.jpg" },
        { "name": "Eker Süzme Yoğurt 900g", "category": "Şarküteri", "price": 88.00, "stock": 70, "brand": "Eker", "sku": "SRK-YOG-02", "image": "../images/Eker SUzme YoGurt 900g.jpg" },
        { "name": "Eker Kefir Doğal 1L", "category": "Şarküteri", "price": 44.00, "stock": 100, "brand": "Eker", "sku": "SRK-KEF-01", "image": "../images/Eker Kefir Doğal 1L.jpg" },
        { "name": "Teremyağ Paket Margarin 250g", "category": "Şarküteri", "price": 24.50, "stock": 180, "brand": "Ülker", "sku": "SRK-YAG-01", "image": "../images/Teremyag Paket Margarin 250g.jpg" },
       
        { "name": "Gedik Piliç Kokteyl Sosis 250g", "category": "Şarküteri", "price": 42.00, "stock": 110, "brand": "Gedik", "sku": "SRK-SOS-01", "image": "https://images.pexels.com/photos/9256867/pexels-photo-9256867.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Aytaç Dilimli Tost Peyniri 500g", "category": "Şarküteri", "price": 125.00, "stock": 75, "brand": "Aytaç", "sku": "SRK-PEY-06", "image": "https://images.pexels.com/photos/5951528/pexels-photo-5951528.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Fora Siyah Zeytin L (Kg)", "category": "Şarküteri", "price": 140.00, "stock": 120, "brand": "Fora", "sku": "SRK-ZEY-01", "image": "https://images.pexels.com/photos/4117666/pexels-photo-4117666.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Marmarabirlik Kuru Sele Zeytin 400g", "category": "Şarküteri", "price": 95.00, "stock": 95, "brand": "Marmarabirlik", "sku": "SRK-ZEY-02", "image": "https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Fora Kırma Yeşil Zeytin (Kg)", "category": "Şarküteri", "price": 155.00, "stock": 80, "brand": "Fora", "sku": "SRK-ZEY-03", "image": "https://images.pexels.com/photos/4116539/pexels-photo-4116539.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Altınkılıç Eski Kaşar 250g", "category": "Şarküteri", "price": 130.00, "stock": 55, "brand": "Altınkılıç", "sku": "SRK-PEY-07", "image": "https://images.pexels.com/photos/773244/pexels-photo-773244.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Cheddar Peyniri Dilimli 200g", "category": "Şarküteri", "price": 98.00, "stock": 60, "brand": "İthal", "sku": "SRK-PEY-08", "image": "https://images.pexels.com/photos/6605307/pexels-photo-6605307.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Sütaş Süzme Yoğurt 750g", "category": "Şarküteri", "price": 74.00, "stock": 85, "brand": "Sütaş", "sku": "SRK-YOG-03", "image": "https://images.pexels.com/photos/6157052/pexels-photo-6157052.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Eker Meyveli Yoğurt Çilekli", "category": "Şarküteri", "price": 18.50, "stock": 150, "brand": "Eker", "sku": "SRK-YOG-04", "image": "https://images.pexels.com/photos/4051664/pexels-photo-4051664.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Pınar Protein Süt Kakaolu 500ml", "category": "Şarküteri", "price": 38.00, "stock": 120, "brand": "Pınar", "sku": "SRK-SUT-02", "image": "https://images.pexels.com/photos/1012566/pexels-photo-1012566.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Sek Salep 1L", "category": "Şarküteri", "price": 55.00, "stock": 40, "brand": "Sek", "sku": "SRK-SLP-01", "image": "https://images.pexels.com/photos/6858602/pexels-photo-6858602.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Sütaş Lor Peyniri 500g", "category": "Şarküteri", "price": 48.00, "stock": 90, "brand": "Sütaş", "sku": "SRK-PEY-09", "image": "https://images.pexels.com/photos/4109913/pexels-photo-4109913.jpeg?auto=compress&cs=tinysrgb&w=400" },
        
        { "name": "Söke Buğday Unu 1Kg", "category": "Temel Gıda", "price": 32.00, "stock": 200, "brand": "Söke", "sku": "TML-UN-01", "image": "../images/Soke Bugday Unu 1Kg.jpg" },
        { "name": "Barilla Penne Rigate 500g", "category": "Temel Gıda", "price": 20.00, "stock": 300, "brand": "Barilla", "sku": "TML-MAK-01", "image": "../images/Barilla Penne Rigate 500g.jpg" },
        { "name": "Barilla Spaghetti 500g", "category": "Temel Gıda", "price": 20.00, "stock": 300, "brand": "Barilla", "sku": "TML-MAK-02", "image": "../images/Barilla Spaghetti 500g.png" },
        { "name": "Barilla Burgu (Fusilli) 500g", "category": "Temel Gıda", "price": 20.00, "stock": 250, "brand": "Barilla", "sku": "TML-MAK-03", "image": "../images/Barilla Burgu (Fusilli) 500g.jpg" },
        { "name": "Filiz Arpa Şehriye 500g", "category": "Temel Gıda", "price": 16.00, "stock": 180, "brand": "Filiz", "sku": "TML-MAK-04", "image": "../images/Filiz Arpa sehriye 500g.jpg" },
        { "name": "CP Yumurta M Boy 10lu", "category": "Temel Gıda", "price": 40.00, "stock": 120, "brand": "CP", "sku": "TML-YUM-01", "image": "../images/CP Yumurta M Boy 10lu.jpg" },
        { "name": "Yudum Ayçiçek Yağı 1L", "category": "Temel Gıda", "price": 65.00, "stock": 150, "brand": "Yudum", "sku": "TML-YAG-01", "image": "../images/Yudum Aycicek Yagi 1L.jpg" },
        { "name": "Yudum Ayçiçek Yağı 2L", "category": "Temel Gıda", "price": 125.00, "stock": 100, "brand": "Yudum", "sku": "TML-YAG-02", "image": "../images/Yudum Aycicek Yagi 2L.jpg" },
        { "name": "Komili Sızma Zeytinyağı 1L", "category": "Temel Gıda", "price": 240.00, "stock": 80, "brand": "Komili", "sku": "TML-YAG-03", "image": "../images/Komili Sizma Zeytinyagi 1L.jpg" },
        { "name": "Reis Pilavlık Pirinç 1Kg", "category": "Temel Gıda", "price": 68.00, "stock": 160, "brand": "Reis", "sku": "TML-BAK-01", "image": "../images/Reis Pilavlik Pirinc 1Kg.jpg" },
        { "name": "Reis Osmancık Pirinç 2Kg", "category": "Temel Gıda", "price": 130.00, "stock": 110, "brand": "Reis", "sku": "TML-BAK-02", "image": "../images/Reis Osmancik Pirinc 2Kg.jpg" },
        { "name": "Reis Kırmızı Mercimek 1Kg", "category": "Temel Gıda", "price": 54.00, "stock": 140, "brand": "Reis", "sku": "TML-BAK-03", "image": "../images/Reis Kirmizi Mercimek 1Kg.jpg" },
        { "name": "Reis Pilavlık Bulgur 1Kg", "category": "Temel Gıda", "price": 34.00, "stock": 170, "brand": "Reis", "sku": "TML-BAK-04", "image": "https://images.pexels.com/photos/7426183/pexels-photo-7426183.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Reis Kuru Fasulye 1Kg", "category": "Temel Gıda", "price": 76.00, "stock": 100, "brand": "Reis", "sku": "TML-BAK-05", "image": "https://images.pexels.com/photos/4187616/pexels-photo-4187616.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Reis Koçbaşı Nohut 1Kg", "category": "Temel Gıda", "price": 72.00, "stock": 95, "brand": "Reis", "sku": "TML-BAK-06", "image": "https://images.pexels.com/photos/4187624/pexels-photo-4187624.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Tat Domates Salçası 830g", "category": "Temel Gıda", "price": 42.50, "stock": 130, "brand": "Tat", "sku": "TML-SLC-01", "image": "https://images.pexels.com/photos/4051410/pexels-photo-4051410.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Tat Biber Salçası Acılı 560g", "category": "Temel Gıda", "price": 58.00, "stock": 90, "brand": "Tat", "sku": "TML-SLC-02", "image": "https://images.pexels.com/photos/10410141/pexels-photo-10410141.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Torku Küp Şeker 1Kg", "category": "Temel Gıda", "price": 46.00, "stock": 140, "brand": "Torku", "sku": "TML-SKR-01", "image": "https://images.pexels.com/photos/6168340/pexels-photo-6168340.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Torku Toz Şeker 2Kg", "category": "Temel Gıda", "price": 82.00, "stock": 120, "brand": "Torku", "sku": "TML-SKR-02", "image": "https://images.pexels.com/photos/4010311/pexels-photo-4010311.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Lipton Doğu Karadeniz Çayı 1Kg", "category": "Temel Gıda", "price": 145.00, "stock": 85, "brand": "Lipton", "sku": "TML-CAY-01", "image": "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Çaykur Rize Turist Çayı 500g", "category": "Temel Gıda", "price": 80.00, "stock": 110, "brand": "Çaykur", "sku": "TML-CAY-02", "image": "https://images.pexels.com/photos/227920/pexels-photo-227920.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Mehmet Efendi Türk Kahvesi 100g", "category": "Temel Gıda", "price": 38.50, "stock": 250, "brand": "Mehmet Efendi", "sku": "TML-KAH-01", "image": "https://images.pexels.com/photos/4109748/pexels-photo-4109748.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Nescafe Gold Ekopaket 100g", "category": "Temel Gıda", "price": 110.00, "stock": 130, "brand": "Nescafe", "sku": "TML-KAH-02", "image": "https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Anavarza Çiçek Balı 450g", "category": "Temel Gıda", "price": 140.00, "stock": 60, "brand": "Anavarza", "sku": "TML-BAL-01", "image": "https://images.pexels.com/photos/3401160/pexels-photo-3401160.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Nutella Kakaolu Fındık Kreması 400g", "category": "Temel Gıda", "price": 75.00, "stock": 140, "brand": "Nutella", "sku": "TML-EZM-01", "image": "https://images.pexels.com/photos/4110098/pexels-photo-4110098.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Fiskobirlik Fındık Ezmesi 300g", "category": "Temel Gıda", "price": 98.00, "stock": 75, "brand": "Fiskobirlik", "sku": "TML-EZM-02", "image": "https://images.pexels.com/photos/4553127/pexels-photo-4553127.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Calve Ketçap Haydi 600g", "category": "Temel Gıda", "price": 46.00, "stock": 160, "brand": "Calve", "sku": "TML-SOS-01", "image": "https://images.pexels.com/photos/4051003/pexels-photo-4051003.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Calve Mayonez Haydi 540g", "category": "Temel Gıda", "price": 58.00, "stock": 150, "brand": "Calve", "sku": "TML-SOS-02", "image": "https://images.pexels.com/photos/4051381/pexels-photo-4051381.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Heinz Burger Sosu 400ml", "category": "Temel Gıda", "price": 84.00, "stock": 80, "brand": "Heinz", "sku": "TML-SOS-03", "image": "https://images.pexels.com/photos/6546029/pexels-photo-6546029.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Kemal Kükrer Elma Sirkesi 500ml", "category": "Temel Gıda", "price": 38.00, "stock": 90, "brand": "Kemal Kükrer", "sku": "TML-SRK-01", "image": "https://images.pexels.com/photos/4051419/pexels-photo-4051419.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Knorr Tavuk Suyu Tablet 12li", "category": "Temel Gıda", "price": 28.00, "stock": 200, "brand": "Knorr", "sku": "TML-KNR-01", "image": "https://images.pexels.com/photos/3758133/pexels-photo-3758133.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Knorr Şehriyeli Tavuk Çorbası", "category": "Temel Gıda", "price": 16.50, "stock": 220, "brand": "Knorr", "sku": "TML-KNR-02", "image": "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Knorr Hazır Mercimek Çorbası", "category": "Temel Gıda", "price": 16.50, "stock": 220, "brand": "Knorr", "sku": "TML-KNR-03", "image": "https://images.pexels.com/photos/11115802/pexels-photo-11115802.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Indomie Tavuk Hazır Noodle 5li", "category": "Temel Gıda", "price": 45.00, "stock": 400, "brand": "Indomie", "sku": "TML-NOD-01", "image": "https://images.pexels.com/photos/2657960/pexels-photo-2657960.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Dr. Oetker Hamur Kabartma Tozu 10lu", "category": "Temel Gıda", "price": 18.00, "stock": 250, "brand": "Dr. Oetker", "sku": "TML-OET-01", "image": "https://images.pexels.com/photos/691152/pexels-photo-691152.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Dr. Oetker Şekerli Vanilin 10lu", "category": "Temel Gıda", "price": 18.00, "stock": 250, "brand": "Dr. Oetker", "sku": "TML-OET-02", "image": "https://images.pexels.com/photos/5945952/pexels-photo-5945952.jpeg?auto=compress&cs=tinysrgb&w=400" },
        
        { "name": "Billur Tuz İyotlu 500g", "category": "Baharat", "price": 15.00, "stock": 300, "brand": "Billur", "sku": "BHR-TUZ-01", "image": "../images/Billur Tuz İyotlu 500g.jpg" },
        { "name": "Billur Deniz Tuz Değirmen 110g", "category": "Baharat", "price": 42.00, "stock": 120, "brand": "Billur", "sku": "BHR-TUZ-02", "image": "../images/Billur Deniz Tuz Degirmen 110g.jpg" },
        { "name": "Bağdat Pul Biber 80g", "category": "Baharat", "price": 28.00, "stock": 150, "brand": "Bağdat", "sku": "BHR-BIB-01", "image": "../images/Bagdat Pul Biber 80g.jpg" },
        { "name": "Bağdat Karabiber Öğütülmüş 75g", "category": "Baharat", "price": 38.00, "stock": 140, "brand": "Bağdat", "sku": "BHR-KAR-01", "image": "../images/Bagdat KarabiberOgutulmus 75g.jpg" },
        { "name": "Bağdat Kekik 40g", "category": "Baharat", "price": 22.00, "stock": 160, "brand": "Bağdat", "sku": "BHR-KEK-01", "image": "../images/Bagdat Kekik 40g.jpg" },
        { "name": "Bağdat Nane 40g", "category": "Baharat", "price": 22.00, "stock": 170, "brand": "Bağdat", "sku": "BHR-NAN-01", "image": "../images/Bagdat Nane 40g.jpg" },
        { "name": "Bağdat Kimyon 75g", "category": "Baharat", "price": 34.00, "stock": 130, "brand": "Bağdat", "sku": "BHR-KIM-01", "image": "../images/Bagdat Kimyon 75g.jpg" },
        { "name": "Bağdat Kırmızı Toz Biber Tatlı 80g", "category": "Baharat", "price": 29.00, "stock": 145, "brand": "Bağdat", "sku": "BHR-BIB-02", "image": "../images/Bagdat Kirmizi Toz Biber Tatli.jpg" },
        { "name": "Bağdat Acı Toz Biber 80g", "category": "Baharat", "price": 29.00, "stock": 120, "brand": "Bağdat", "sku": "BHR-BIB-03", "image": "../images/Bagdat Aci Toz Biber 80g.jpg" },
        { "name": "Bağdat Köfte Harcı 85g", "category": "Baharat", "price": 24.50, "stock": 180, "brand": "Bağdat", "sku": "BHR-HRC-01", "image": "../images/Bagdat Kofte Harci.jpg" },
        { "name": "Calve Köfte Harcı Pratik", "category": "Baharat", "price": 22.00, "stock": 110, "brand": "Calve", "sku": "BHR-HRC-02", "image": "../images/Calve Kofte Harci Pratik.jpg" },
        { "name": "Knorr Tavuk Çeşnisi Mangal Lezzeti", "category": "Baharat", "price": 26.00, "stock": 130, "brand": "Knorr", "sku": "BHR-CES-01", "image": "../images/Knorr Tavuk Cesnisi Mangal Lezzeti.jpg" },
        { "name": "Bağdat Zencefil Toz 75g", "category": "Baharat", "price": 36.00, "stock": 85, "brand": "Bağdat", "sku": "BHR-ZEN-01", "image": "https://images.pexels.com/photos/161556/ginger-plant-root-healthy-161556.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Zerdeçal Toz 75g", "category": "Baharat", "price": 32.00, "stock": 90, "brand": "Bağdat", "sku": "BHR-ZER-01", "image": "https://images.pexels.com/photos/1340115/pexels-photo-1340115.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Tarçın Toz 75g", "category": "Baharat", "price": 40.00, "stock": 110, "brand": "Bağdat", "sku": "BHR-TAR-01", "image": "https://images.pexels.com/photos/4033325/pexels-photo-4033325.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Çörek Otu 80g", "category": "Baharat", "price": 28.00, "stock": 130, "brand": "Bağdat", "sku": "BHR-CRK-01", "image": "https://images.pexels.com/photos/13101564/pexels-photo-13101564.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Susam 100g", "category": "Baharat", "price": 26.00, "stock": 140, "brand": "Bağdat", "sku": "BHR-SUS-01", "image": "https://images.pexels.com/photos/7129486/pexels-photo-7129486.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Biberiye 30g", "category": "Baharat", "price": 24.00, "stock": 70, "brand": "Bağdat", "sku": "BHR-BIB-04", "image": "https://images.pexels.com/photos/4198156/pexels-photo-4198156.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Köri 70g", "category": "Baharat", "price": 30.00, "stock": 95, "brand": "Bağdat", "sku": "BHR-KOR-01", "image": "https://images.pexels.com/photos/6721016/pexels-photo-6721016.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Sumak 80g", "category": "Baharat", "price": 32.00, "stock": 115, "brand": "Bağdat", "sku": "BHR-SUM-01", "image": "https://images.pexels.com/photos/13101561/pexels-photo-13101561.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat İsot 80g", "category": "Baharat", "price": 34.00, "stock": 105, "brand": "Bağdat", "sku": "BHR-ISO-01", "image": "https://images.pexels.com/photos/13101555/pexels-photo-13101555.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Yeni Bahar 75g", "category": "Baharat", "price": 38.00, "stock": 80, "brand": "Bağdat", "sku": "BHR-YNB-01", "image": "https://images.pexels.com/photos/2802529/pexels-photo-2802529.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Karanfil Tane 40g", "category": "Baharat", "price": 48.00, "stock": 60, "brand": "Bağdat", "sku": "BHR-KAR-02", "image": "https://images.pexels.com/photos/13101558/pexels-photo-13101558.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Mahlep 60g", "category": "Baharat", "price": 45.00, "stock": 75, "brand": "Bağdat", "sku": "BHR-MHL-01", "image": "https://images.pexels.com/photos/7129152/pexels-photo-7129152.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Knorr Sarımsaklı Çeşni", "category": "Baharat", "price": 24.00, "stock": 140, "brand": "Knorr", "sku": "BHR-CES-02", "image": "https://images.pexels.com/photos/13969315/pexels-photo-13969315.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Defne Yaprağı 10g", "category": "Baharat", "price": 18.00, "stock": 200, "brand": "Bağdat", "sku": "BHR-DEF-01", "image": "https://images.pexels.com/photos/8085246/pexels-photo-8085246.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Limon Tuzu 100g", "category": "Baharat", "price": 20.00, "stock": 160, "brand": "Bağdat", "sku": "BHR-TUZ-03", "image": "https://images.pexels.com/photos/6168339/pexels-photo-6168339.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Hindistan Cevizi 50g", "category": "Baharat", "price": 32.00, "stock": 90, "brand": "Bağdat", "sku": "BHR-HND-01", "image": "https://images.pexels.com/photos/4099234/pexels-photo-4099234.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Kuş Üzümü 75g", "category": "Baharat", "price": 35.00, "stock": 85, "brand": "Bağdat", "sku": "BHR-UZM-01", "image": "https://images.pexels.com/photos/70862/pexels-photo-70862.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { "name": "Bağdat Dolmalık Fıstık 25g", "category": "Baharat", "price": 75.00, "stock": 50, "brand": "Bağdat", "sku": "BHR-FST-01", "image": "https://images.pexels.com/photos/41951/pine-cones-pine-nuts-pine-nuts-41951.jpeg?auto=compress&cs=tinysrgb&w=400" }
    ];
    
    let currentCategory = "Tümü";
    const apiAdresi = typeof BACKEND_API !== 'undefined' ? BACKEND_API : "http://localhost:5000";

    // 🛒 1. Ürün Verisini Çeken/Yöneten Fonksiyon
    async function fetchProducts() {
        try {
            const response = await fetch(`${apiAdresi}/products`);
            if (!response.ok) throw new Error("Products API error");
            const data = await response.json();
            // API'den veri gelse bile linkleri statik listemize eşlemeyi deneyebiliriz, 
            // aksi halde üstteki hazır görsel linkli listeyi baz alıyoruz.
            let incomingData = Array.isArray(data) ? data : (data.products || data.data || []);
            
            if (incomingData.length > 0) {
                allProducts = incomingData.map(p => {
                    const match = allProducts.find(ap => ap.sku === p.sku);
                    return match ? { ...p, image: match.image } : p;
                });
            }
            renderProducts();
        } catch (error) {
            console.error("Products API aktif değil, entegre edilmiş yerel listeyle devam ediliyor...");
            renderProducts();
        }
    }

    // 📺 2. Doğrudan Eşleşen Görselleri Ekrana Basan Temiz Fonksiyon
    function renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return; 
        grid.innerHTML = '';
        
        const filtered = currentCategory === 'Tümü' 
            ? allProducts 
            : allProducts.filter(p => p.category === currentCategory);

        filtered.forEach(product => {
            // Yedek kategori görsel havuzu (Hata durumunda)
            let fallbackGorsel = "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400"; 
            if (product.category === "Manav") fallbackGorsel = "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400"; 
            if (product.category === "Kasap") fallbackGorsel = "https://images.pexels.com/photos/6184913/pexels-photo-6184913.jpeg?auto=compress&cs=tinysrgb&w=400"; 
            if (product.category === "Şarküteri") fallbackGorsel = "https://images.pexels.com/photos/4109946/pexels-photo-4109946.jpeg?auto=compress&cs=tinysrgb&w=400";

            // Eğer ürüne özel görsel linki tanımlıysa onu, yoksa yedeği kullanır
            let finalImage = product.image ? product.image : fallbackGorsel;

            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition';
            card.innerHTML = `
                <div>
                    <div class="w-full h-40 bg-slate-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center relative">
                        <img 
                            src="${finalImage}" 
                            alt="${product.name}" 
                            class="w-full h-full object-cover hover:scale-105 transition duration-300"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='${fallbackGorsel}';"
                        >
                    </div>
                    <span class="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">${product.category}</span>
                    <h3 class="font-bold text-slate-900 mt-2 line-clamp-2 h-12">${product.name}</h3>
                    <p class="text-xs text-slate-400 mt-1">Stok: ${product.stock} adet</p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-lg font-extrabold text-emerald-600">${product.price.toFixed(2)} TL</span>
                    <button onclick="addToCart(${product.id || `'${product.sku}'`})" class="bg-emerald-600 hover:bg-emerald-700 text-white p-2 px-3 rounded-xl text-sm font-medium transition">
                        <i class="fa-solid fa-plus mr-1"></i> Ekle
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function filterCategory(category, event) {
        currentCategory = category;
        document.querySelectorAll('#category-filters button').forEach(btn => {
            btn.className = 'cat-btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition';
        });
        if (event && event.target) {
            event.target.className = 'cat-btn active bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm';
        }
        renderProducts();
    }

    // Global fonksiyonları dışarıya açıyoruz
    window.fetchProducts = fetchProducts;
    window.renderProducts = renderProducts;
    window.filterCategory = filterCategory;
})();
export interface TranslationSet {
  // Navigation & Common
  explore: string;
  map: string;
  experiences: string;
  favorites: string;
  profile: string;
  saasHub: string;
  saasConsole: string;
  b2bPartner: string;
  wellnessProviderQ: string;
  unlockPremium: string;
  mappingHeading: string;
  routeLongevity: string;
  scienceAntiquity: string;
  blog: string;
  events: string;
  version: string;
  close: string;
  spotsRemaining: string;
  daysLabel: string;
  backToStudies: string;
  shareResearch: string;
  copiedLink: string;
  spotBooked: string;
  reserveSpot: string;
  registrationSuccess: string;
  registrationSuccessDesc: string;
  immersionPrograms: string;
  immersionProgramsDesc: string;
  secureSeat: string;
  fullName: string;
  emailAddress: string;
  cancel: string;
  completeBooking: string;

  // Explore View
  exploreSearchLabel: string;
  exploreSearchPlaceholder: string;
  foundMatchingLocations: string;
  clearSearch: string;
  heritageCategories: string;
  medicalLongevityRoutes: string;
  premiumLicensesActive: string;
  realtimeSearchActive: string;
  searchResults: string;
  featuredLongevityHubs: string;
  allListingPartners: string;
  noHubsFound: string;
  noHubsFoundDesc: string;
  resetSearch: string;
  specialtyFocus: string;
  showPin: string;
  readLatestInsights: string;
  fromOurGazette: string;
  openResearchGazette: string;
  viewWellnessExp: string;
  viewDetails: string;
  viewOnMap: string;

  // Map View
  densityHeatmapLayer: string;
  toggleHotspots: string;
  concentrationIndex: string;
  low: string;
  dense: string;
  visualizeZones: string;
  searchPlaceholderMap: string;
  allCities: string;
  routeJourneyActive: string;
  clearActiveRoute: string;
  showSideList: string;
  hideSideList: string;
  totalLocations: string;
  ratingLabel: string;
  contactInfo: string;
  viewSaaSConsole: string;
  noHubsMatchFilters: string;
  tryAdjustFilters: string;

  // Experiences View
  experiencesTitle: string;
  experiencesSubtitle: string;
  selectJourneyPath: string;
  pathActiveOnMap: string;
  stopsCount: string;

  // Favorites View
  favoritesTitle: string;
  favoritesSubtitle: string;
  noFavorites: string;
  saveHubsPrompt: string;
  backToExplore: string;

  // Partner/SaaS View
  saasWelcome: string;
  analyticsTitle: string;
  registeredPartner: string;
  licensingTier: string;
  annualSaaSFee: string;
  underwritersCertificate: string;
  medicalClearanceActive: string;
  monthlyPerformance: string;
  profileBrief: string;
  addressLabel: string;
  phoneLabel: string;
  emailLabel: string;
  websiteLabel: string;
  editDetailsButton: string;
  saveLicenseDetails: string;
  registeredProvidersConsole: string;
  impressionsDesc: string;
  leadsDesc: string;
  clicksDesc: string;
  viewsMetric: string;
  clicksMetric: string;
  leadsMetric: string;
  trafficTrendLabel: string;
}

export const translations: Record<'en' | 'tr', TranslationSet> = {
  en: {
    explore: "Explore",
    map: "Map",
    experiences: "Experiences",
    favorites: "Favorites",
    profile: "SaaS Hub",
    saasHub: "Profile & SaaS Hub",
    saasConsole: "SaaS License Console",
    b2bPartner: "B2B PARTNER",
    wellnessProviderQ: "Are you a Wellness Provider?",
    unlockPremium: "Unlock premium placement pins and real-time visitor analytics.",
    mappingHeading: "Mapping Türkiye's Longevity Heritage",
    routeLongevity: "ROUTE LONGEVITY",
    scienceAntiquity: "Science & Antiquity",
    blog: "Blog",
    events: "Events",
    version: "v1.0.0 • © 2026 Route Longevity",
    close: "Close",
    spotsRemaining: "seats remaining",
    daysLabel: "Days",
    backToStudies: "← Back to Research Articles",
    shareResearch: "Share Research",
    copiedLink: "Copied link to: ",
    spotBooked: "Spot Booked",
    reserveSpot: "Reserve Spot",
    registrationSuccess: "Registration Submitted Successfully!",
    registrationSuccessDesc: "We have processed your request of reservation and sent the itinerary invitation card to your email box.",
    immersionPrograms: "Physical Anatolian Rejuvenation Programs",
    immersionProgramsDesc: "Connect with functional medical directors, olive growers, and contrast hydrotherapists in immersive experiential settings.",
    secureSeat: "Secure Invitation Seat",
    fullName: "Full name",
    emailAddress: "Email address",
    cancel: "Cancel",
    completeBooking: "Complete Booking",

    exploreSearchLabel: "Search verified places by goal, country or treatment focus",
    exploreSearchPlaceholder: "Try sleep, stress recovery, inflammation, thermal, diagnostics, olive route, Türkiye, Greece...",
    foundMatchingLocations: "Found {count} matching places",
    clearSearch: "Clear Search",
    heritageCategories: "Longevity Categories",
    medicalLongevityRoutes: "Medical-Longevity Routes",
    premiumLicensesActive: "Verified Network",
    realtimeSearchActive: "Live Discovery Active",
    searchResults: "Search Results",
    featuredLongevityHubs: "Featured Longevity Places",
    allListingPartners: "View all verified places",
    noHubsFound: "No Longevity Places Found",
    noHubsFoundDesc: "We couldn't locate verified places matching your search terms. Try a health goal, country, category, or treatment focus.",
    resetSearch: "Reset Search Filter",
    specialtyFocus: "Specialty Focus",
    showPin: "Show Pin",
    readLatestInsights: "Read Latest Insights",
    fromOurGazette: "From our longevity science & ancestral heritage gazette.",
    openResearchGazette: "Open Scientific Gazette",
    viewWellnessExp: "View wellness experiences",
    viewDetails: "View Details",
    viewOnMap: "View on Map",

    densityHeatmapLayer: "Density Heatmap Layer",
    toggleHotspots: "Toggle concentration hotspots",
    concentrationIndex: "Concentration Density Index",
    low: "Low",
    dense: "Dense",
    visualizeZones: "Visualizes zones in Türkiye with the highest density of thermal springs, heritage hammams, and medical-longevity clinics.",
    searchPlaceholderMap: "Search verified places...",
    allCities: "All Cities",
    routeJourneyActive: "Route Journey Active",
    clearActiveRoute: "Clear Active Route",
    showSideList: "Show Side List",
    hideSideList: "Hide Side List",
    totalLocations: "Total Locations",
    ratingLabel: "Rating",
    contactInfo: "Contact Details",
    viewSaaSConsole: "View SaaS Console",
    noHubsMatchFilters: "No Longevity Places Matched Filters",
    tryAdjustFilters: "Try adjusting your search query, heritage category or city toggle.",

    experiencesTitle: "Anatolian Longevity Journeys",
    experiencesSubtitle: "Scientifically structured multi-day health-restoration itineraries throughout Türkiye.",
    selectJourneyPath: "Select Journey Path",
    pathActiveOnMap: "Path Active on Map",
    stopsCount: "stops",

    favoritesTitle: "Your Saved Longevity Places",
    favoritesSubtitle: "Curate and reference your custom biological-aging restoration directories.",
    noFavorites: "No Saved Places Yet",
    saveHubsPrompt: "Explore verified places and tap the heart icon to start curating your personalized longevity route.",
    backToExplore: "Back to Explore",

    saasWelcome: "B2B Provider Portal",
    analyticsTitle: "SaaS Placement Console",
    registeredPartner: "Registered B2B Partner License",
    licensingTier: "Licensing Tier",
    annualSaaSFee: "Annual SaaS Fee",
    underwritersCertificate: "Underwriters Certificate",
    medicalClearanceActive: "Medical Clearance Active",
    monthlyPerformance: "Monthly Provider Analytics",
    profileBrief: "Profile Registration Details",
    addressLabel: "Physical Registry Address",
    phoneLabel: "Phone Registry",
    emailLabel: "Digital Desk Registry",
    websiteLabel: "Registered URL Base",
    editDetailsButton: "Modify Practice Credentials",
    saveLicenseDetails: "Save practice registration details",
    registeredProvidersConsole: "Licensed Providers Analytics Console",
    impressionsDesc: "Aggregated monthly impressions directly inside viewport maps.",
    leadsDesc: "Direct call-to-action leads generated to email/phone registry.",
    clicksDesc: "Web portal routing click activity logs.",
    viewsMetric: "Impressions",
    clicksMetric: "Clicks Routing",
    leadsMetric: "Direct Leads",
    trafficTrendLabel: "Aggregated Multi-Month View Traffic Trend"
  },
  tr: {
    explore: "Keşfet",
    map: "Harita",
    experiences: "Deneyimler",
    favorites: "Favoriler",
    profile: "SaaS Paneli",
    saasHub: "Profil & SaaS Paneli",
    saasConsole: "SaaS Lisans Konsolu",
    b2bPartner: "B2B ORTAĞI",
    wellnessProviderQ: "Sağlık Sağlayıcısı Mısınız?",
    unlockPremium: "Seçkin pin yerleşimleri ve gerçek zamanlı ziyaretçi analitiğini etkinleştirin.",
    mappingHeading: "Türkiye'nin Uzun Yaşam Mirasını Haritalama",
    routeLongevity: "UZUN YAŞAM ROTASI",
    scienceAntiquity: "Bilim ve Antik Çağ",
    blog: "Blog",
    events: "Etkinlikler",
    version: "v1.0.0 • © 2026 Uzun Yaşam Rotası",
    close: "Kapat",
    spotsRemaining: "kontenjan kaldı",
    daysLabel: "Gün",
    backToStudies: "← Bilimsel Makalelere Geri Dön",
    shareResearch: "Araştırmayı Paylaş",
    copiedLink: "Bağlantı kopyalandı: ",
    spotBooked: "Rezervasyon Yapıldı",
    reserveSpot: "Koltuk Ayırt",
    registrationSuccess: "Kayıt Başarıyla Gönderildi!",
    registrationSuccessDesc: "Rezervasyon talebiniz işleme alınmış ve davetiye seyahat kartınız e-posta adresinize gönderilmiştir.",
    immersionPrograms: "Anadolu Fiziksel Gençleşme Programları",
    immersionProgramsDesc: "Fonksiyonel tıp hekimleri, zeytin üreticileri ve kontrast hidroterapistlerle sürükleyici deneyimsel ortamlarda bir araya gelin.",
    secureSeat: "Davetiye Koltuğu Ayırt",
    fullName: "Adınız Soyadınız",
    emailAddress: "E-posta Adresiniz",
    cancel: "Vazgeç",
    completeBooking: "Kaydı Tamamla",

    exploreSearchLabel: "Doğrulanmış yerleri hedef, ülke veya tedavi odağına göre ara",
    exploreSearchPlaceholder: "Uyku, stres, enflamasyon, termal, tanı, zeytin rotası, Türkiye, Yunanistan...",
    foundMatchingLocations: "{count} eşleşen yer bulundu",
    clearSearch: "Aramayı Temizle",
    heritageCategories: "Longevity Kategorileri",
    medicalLongevityRoutes: "Tıbbi Uzun Yaşam Rotaları",
    premiumLicensesActive: "Doğrulanmış Ağ",
    realtimeSearchActive: "Canlı Keşif Aktif",
    searchResults: "Arama Sonuçları",
    featuredLongevityHubs: "Öne Çıkan Longevity Yerleri",
    allListingPartners: "Tüm doğrulanmış yerleri görüntüle",
    noHubsFound: "Longevity Yeri Bulunamadı",
    noHubsFoundDesc: "Aramanıza uygun doğrulanmış yer bulunamadı. Sağlık hedefi, ülke, kategori veya tedavi odağı deneyin.",
    resetSearch: "Arama Filtresini Sıfırla",
    specialtyFocus: "Uzmanlık Alanı",
    showPin: "İşareti Göster",
    readLatestInsights: "Son Epigenetik Çalışmalar",
    fromOurGazette: "Uzun yaşam bilimi ve asırlık miras bültenimizden son gelişmeler.",
    openResearchGazette: "Bilimsel Bülteni Aç",
    viewWellnessExp: "Sağlık rotalarını incele",
    viewDetails: "Detayları Gör",
    viewOnMap: "Haritada Göster",

    densityHeatmapLayer: "Yoğunluk Sıcaklık Haritası",
    toggleHotspots: "Konsantrasyon merkezlerini göster/gizle",
    concentrationIndex: "Yoğunluk Endeksi",
    low: "Düşük",
    dense: "Yoğun",
    visualizeZones: "Türkiye genelinde kaplıcalar, tarihi hamamlar ve tıbbi uzun yaşam kliniklerinin en yoğun olduğu sıcak noktaları görselleştirir.",
    searchPlaceholderMap: "Sağlık merkezlerini ara...",
    allCities: "Tüm Şehirler",
    routeJourneyActive: "Güzergah Rotası Aktif",
    clearActiveRoute: "Rotayı Temizle",
    showSideList: "Yan Listeyi Göster",
    hideSideList: "Yan Listeyi Gizle",
    totalLocations: "Toplam Konum",
    ratingLabel: "Değerlendirme",
    contactInfo: "İletişim Bilgileri",
    viewSaaSConsole: "SaaS Panelini Gör",
    noHubsMatchFilters: "Filtreyle Eşleşen Longevity Yeri Bulunamadı",
    tryAdjustFilters: "Lütfen arama kelimenizi, miras kategorisini veya şehir seçimini değiştirmeyi deneyin.",

    experiencesTitle: "Anadolu Uzun Yaşam Rotaları",
    experiencesSubtitle: "Türkiye genelinde bilimsel olarak yapılandırılmış çok günlük sağlık yenileme programları.",
    selectJourneyPath: "Rotayı Seç",
    pathActiveOnMap: "Haritada Aktif",
    stopsCount: "durak",

    favoritesTitle: "Kayıtlı Sağlık Merkezleriniz",
    favoritesSubtitle: "Kişiselleştirilmiş hücresel yenilenme ve biyolojik yaşlanma karşıtı dizininiz.",
    noFavorites: "Henüz Kayıtlı Merkez Yok",
    saveHubsPrompt: "Doğrulanmış yerleri keşfedin ve kalp simgesine dokunarak kişisel longevity rotanızı oluşturmaya başlayın.",
    backToExplore: "Keşfe Geri Dön",

    saasWelcome: "B2B Sağlayıcı Portalı",
    analyticsTitle: "SaaS Yönetim Konsolu",
    registeredPartner: "Kayıtlı B2B Ortak Lisansı",
    licensingTier: "Lisans Seviyesi",
    annualSaaSFee: "Yıllık SaaS Ücreti",
    underwritersCertificate: "Klinik Onay Sertifikası",
    medicalClearanceActive: "Tıbbi Onay Aktif",
    monthlyPerformance: "Aylık Sağlayıcı Analitiği",
    profileBrief: "Profil Kayıt Bilgileri",
    addressLabel: "Fiziksel Sicil Adresi",
    phoneLabel: "Kayıtlı Telefon",
    emailLabel: "Dijital Sicil Masası",
    websiteLabel: "Kayıtlı URL Adresi",
    editDetailsButton: "Sicil Bilgilerini Güncelle",
    saveLicenseDetails: "Hekimlik ve sicil bilgilerini kaydet",
    registeredProvidersConsole: "Lisanslı Sağlayıcılar Analitik Konsolu",
    impressionsDesc: "Kullanıcıların harita ekranında edindiği aylık toplam görüntülenme.",
    leadsDesc: "İletişim kayıtlarına doğrudan yönlendirilen çağrı/e-posta talepleri.",
    clicksDesc: "Web portalından sağlanan yönlendirme tıklama günlükleri.",
    viewsMetric: "Görüntüleme",
    clicksMetric: "Yönlendirmeler",
    leadsMetric: "Talepler",
    trafficTrendLabel: "Aylara Göre Toplam Trafik Grafiği"
  }
};

// Specialized translations for dynamic Category values from data.ts
export const categoryTranslations: Record<'en' | 'tr', Record<string, string>> = {
  en: {
    'hammams': 'Hammams',
    'thermal-spa': 'Thermal & Spa',
    'mediterranean-diet': 'Mediterranean Diet',
    'longevity-clinics': 'Longevity Clinics',
    'retreat-nature': 'Retreat & Nature',
    'traditional-med': 'Traditional Medicine',
    'local-producers': 'Local Producers'
  },
  tr: {
    'hammams': 'Tarihi Hamamlar',
    'thermal-spa': 'Termal Banyo & Kaplıcalar',
    'mediterranean-diet': 'Akdeniz Tipi Beslenme',
    'longevity-clinics': 'Uzun Yaşam Klinikler',
    'retreat-nature': 'Doğa & Meditasyon',
    'traditional-med': 'Geleneksel Şifa',
    'local-producers': 'Yerel Üreticiler'
  }
};

// Localized translation blocks for biological centers/partners content in data.ts
export const partnerTranslations: Record<'en' | 'tr', Record<string, { name: string; description: string; specialty: string; city: string }>> = {
  en: {
    'p1': {
      name: 'Kırkpınar Thermal Spa',
      description: 'Historic hot thermal springs originating from the ancient Roman bath culture of Bursa, featuring rich mineral-laden water (42°C) rich in sulfur and bicarbonates for cellular restoration.',
      specialty: 'Balneotherapy & Mineral Rejuvenation',
      city: 'Bursa'
    },
    'p2': {
      name: 'Hürrem Sultan Hamamı',
      description: 'Designed by Mimar Sinan in the 16th century, this architectural marvel offers traditional multi-phase thermal exfoliation, organic herbal steam infusion, and essential oil massage.',
      specialty: 'Ottoman Exfoliation Ritual & Olive Oil Foam Bath',
      city: 'Istanbul'
    },
    'p3': {
      name: 'Aegean Olive & Herb Sanctuary',
      description: 'An organic culinary estate celebrating the longevity benefits of high-polyphenol cold-press olive oil, freshly harvested wild greens (şevketibostan, radika), and Aegean longevity recipes.',
      specialty: 'Polyphenol-rich Olive Oil Tastings & Clean Gastronomy Workshops',
      city: 'Izmir'
    },
    'p4': {
      name: 'Healist Longevity Clinic',
      description: 'Cutting-edge therapeutic research center specializing in cellular aging analysis, hyperbaric oxygen therapy (HBOT), IV NAD+ supplementation, and epigenetics-guided health customization plans.',
      specialty: 'Epigenetic Testing & NAD+ Infusions',
      city: 'Istanbul'
    },
    'p5': {
      name: 'Kabalci Olive Oil Co.',
      description: 'Family-owned biodynamic olive groves utilizing traditional stone-mills. Harvesting centennial trees to produce an organic, antioxidant-rich olive elixir linked to centuries of North-Aegean longevity.',
      specialty: 'Centennial Tree Extra Virgin Olive Oil Production',
      city: 'Balikesir'
    },
    'p6': {
      name: 'Kabak Valley Retreat & Yoga',
      description: 'Nestled in a pristine canyon isolated by pine forests, this luxury eco-lodge features solar-powered cabins, deep-breathing yoga decks overlooking the turquoise sea, and local plant-based meals.',
      specialty: 'Forest Bathing, Pranic Breathing & Sunset Yoga',
      city: 'Mugla'
    },
    'p7': {
      name: 'Pamukkale Lycus Thermal',
      description: 'Thermal wellness hotel near the legendary white travertine pools, utilising calcium and iron-rich bicarbonate thermal mineral springs to support bone strength and dermatological cellular renewal.',
      specialty: 'Calcium pools & Mud Therapy',
      city: 'Denizli'
    },
    'p8': {
      name: 'Oruçoglu Thermal & Wellness',
      description: 'Set in Türkiye’s thermal capital Afyonkarahisar, featuring pure underground natural thermal spas rich in silica. Designed with absolute clinical therapeutic protocols for articular health.',
      specialty: 'Pure Silica Baths & Physiotherapy',
      city: 'Afyonkarahisar'
    },
    'p9': {
      name: 'Sacred House Longevity Spa',
      description: 'A mystical cave hotel carved into the soft volcanic tuff of Cappadocia. Combines deep quiet meditation chambers, warm dry-stone salt rooms, and heated sulfur therapies inside a gothic visual masterpiece.',
      specialty: 'Subterranean Aqua-Therapy & Cave Meditation',
      city: 'Cappadocia'
    },
    'p10': {
      name: 'Bozburun Apitherapy Hub',
      description: 'An isolated seaside sanctuary devoted to traditional Greek & Ottoman apitherapy, organic pine honey therapy, propolis extracts, and premium pollen pollen restoration for respiratory and immune longevity.',
      specialty: 'Immunology & Honeycomb inhalation',
      city: 'Mugla'
    },
    'p11': {
      name: 'Toros Herb & Phytotherapy Estate',
      description: 'Phytotherapeutic mountain center cultivating endemic herbs (sage, mountain thyme, ironwort). Administering custom decoctions, ancient Turkish cup therapy (hacamat), and steam vapor inhalation.',
      specialty: 'Herbal Infusions & Ancient Cupping (Hacamat)',
      city: 'Antalya'
    },
    'p12': {
      name: 'Bodrum Longevity & Wellness Lodge',
      description: 'Premier seaside wellness lodge specialized in DNA methylation testing, heavy metal detoxing, cold plunge thermogenesis, and custom-designed cellular fasting programs overlooking the Aegean Sea.',
      specialty: 'DNA Methylation & Cold Plunge Detoxing',
      city: 'Mugla'
    }
  },
  tr: {
    'p1': {
      name: 'Kırkpınar Termal Şifa Kültürü',
      description: 'Bursa\'nın antik Roma banyo kültürüne dayanan tarihi kaplıcaları. Hücresel yenilenme için mineralce zengin kükürtlü ve bikarbonatlı şifalı kaplıca sularını (42°C) sunar.',
      specialty: 'Balneoterapi ve Hücresel Maden Yenilenmesi',
      city: 'Bursa'
    },
    'p2': {
      name: 'Hürrem Sultan Hamamı',
      description: '16. yüzyılda Mimar Sinan tarafından inşa edilen bu mimari şaheser, geleneksel kese lif arındırma ritüelleri, organik bitkisel buhar seansları ve esansiyel zeytinyağı masajı sunar.',
      specialty: 'Osmanlı Arınma Ritüeli ve Organik Sabun Köpüğü Banyosu',
      city: 'İstanbul'
    },
    'p3': {
      name: 'Ege Zeytin ve Şifalı Bitkiler Malikanesi',
      description: 'Urla\'nın yüksek polifenollü soğuk sıkım sızma zeytinyağlarının, taze toplanmış yabani otların (şevketibostan, radika) ve asırlık Ege yemeklerinin şifasını kutlayan organik gastronomi alanı.',
      specialty: 'Polifenol Zengin Zeytinyağı Tadımı & Temiz Gastronomi Atölyeleri',
      city: 'İzmir'
    },
    'p4': {
      name: 'Healist Hücresel Uzun Yaşam Kliniği',
      description: 'Hücresel yaşlanma analizi, hiperbarik oksijen terapisi (HBOT), IV NAD+ takviyeleri ve epigenetik odaklı kişiselleştirilmiş sağlık haritaları konusunda uzmanlaşmış öncü araştırma merkezi.',
      specialty: 'Epigenetik Test Protokolleri & Serum NAD+ İnfüzyonları',
      city: 'İstanbul'
    },
    'p5': {
      name: 'Kabalcı Biodinamik Zeytin Çiftliği',
      description: 'Geleneksel taş değirmenleri kullanan aile işletmesi biodinamik zeytinlikler. Kuzey Ege\'nin asırlık uzun yaşam sırrı olan antioksidan deposu zeytinyağı iksirlerini üretir.',
      specialty: 'Asırlık Ağaçlardan Sızma Zeytinyağı Pres Teknolojisi',
      city: 'Balıkesir'
    },
    'p6': {
      name: 'Kabak Kanyonu Doğa ve Yoga Oteli',
      description: 'Çam ormanlarıyla izole edilmiş el değmemiş bir kanyonda yer alan bu lüks ekolojik sığınak, güneş enerjili ahşap kulübelere, masmavi denize bakan derin nefes yoga güvertelerine sahiptir.',
      specialty: 'Orman Banyosu varyantı, Pranik Nefes ve Günbatımı Yogası',
      city: 'Muğla'
    },
    'p7': {
      name: 'Pamukkale Lycus Termal Terminolojisi',
      description: 'Efsanevi beyaz traverten havuzlarının yakınında, kemik gücünü ve dermatolojik hücresel yenilenmeyi desteklemek amacıyla kalsiyum ve demir açısından zengin bikarbonat kaplıca sularını kullanan termal otel.',
      specialty: 'Kalsiyum Çökelti Havuzları ve Termal Çamur Kürleri',
      city: 'Denizli'
    },
    'p8': {
      name: 'Oruçoğlu Termal & Sağlıklı Yaşam',
      description: 'Türkiye\'nin termal başkenti Afyonkarahisar\'da, silis minerali bakımından zengin yeraltı kaplıcalarını sunar. Eklem sağlığı için klinik terapötik kurallarla tasarlanmıştır.',
      specialty: 'Saf Silisli Su Tedavileri ve Klinik Fizyoterapi',
      city: 'Afyonkarahisar'
    },
    'p9': {
      name: 'Sacred House Mistisizm ve Şifa Mağarası',
      description: 'Kapadokya\'nın volkanik tüf kaya yapısına oyulmuş mistik mağara oteli. Derin sessizlik meditasyon odalarını, kuru kaya tuzu odalarını ve kükürt terapilerini gotik bir sanat tasarımıyla birleştirir.',
      specialty: 'Yeraltı Akua-Terapi Banyosu ve Karanlık Mağara Meditasyonu',
      city: 'Kapadokya'
    },
    'p10': {
      name: 'Bozburun Apiterapi Sağlık Ocağı',
      description: 'Geleneksel ve Osmanlı apiterapisine adanmış deniz kıyısında bir sığınak. Solunum ve bağışık hücresel ömür için organik çam balı tedavisi, propolis ekstraktları ve taze arı polenleri sunar.',
      specialty: 'Doğal İmmünoloji ve Aktif Petek Solunum Kürleri',
      city: 'Muğla'
    },
    'p11': {
      name: 'Toros Dağları Fitoterapi Malikanesi',
      description: 'Yayla ikliminde endemik şifalı dağ bitkilerini (adaçayı, kekik, dağ çayı) yetiştiren tıp merkezi. Özel bitkisel kürler, geleneksel kupa tedavisi (hacamat) ve buhar solunumu uygular.',
      specialty: 'Tıbbi Bitki İnfüzyonları ve Geleneksel Hacamat Kupa Tedavisi',
      city: 'Antalya'
    },
    'p12': {
      name: 'Bodrum Hücresel Yenilenme Kulübesi',
      description: 'Ege Denizi\'ne bakan, DNA metilasyon testi, ağır metal detoksu, soğuk şok havuzu termojenezi ve kişiye özel tasarlanmış hücresel oruç programlarında uzmanlaşmış birinci sınıf deniz kıyısı tesisi.',
      specialty: 'DNA Metilasyon Test Analitiği & Soğuk Plonge Detoksları',
      city: 'Muğla'
    }
  }
};

// Localized translation blocks for Wellness Journeys in data.ts
export const journeyTranslations: Record<'en' | 'tr', Record<string, { title: string; subtitle: string; description: string }>> = {
  en: {
    'j1': {
      title: 'The Byzantine & Ottoman Thermal Route',
      subtitle: 'Re-align cells with traditional Roman heat & Ottoman herbal rituals',
      description: 'This journey starting from the historical capital on the Bosporus, connecting the majestic Hürrem Sultan Hamamı with the healing mineral hot thermal spring baths of Bursa. Ideal for skin restoration and stress system reset.'
    },
    'j2': {
      title: 'Aegean Anti-Inflammatory Fasting Route',
      subtitle: 'Optimize cardiovascular pathways with high-polyphenol diet & DNA testing',
      description: 'A coastal drive focused entirely on the science-backed Aegean diet. Start with high-polyphenol olive oil sensory training in Ayvalık, wild herbs culinary lessons in Urla, and finish with genetic-informed fasting in Bodrum.'
    },
    'j3': {
      title: 'Anatolian Highlands Meditation & Apitherapy Route',
      subtitle: 'Saturate lungs and immune system in pristine pine forests',
      description: 'Connect deep mountain breathing exercises in Fethiye Kabak canyon with raw propolis apitherapy on the shore, and finish with natural fitotherapist cupping rituals in the pristine high forests of the Toros mountains.'
    }
  },
  tr: {
    'j1': {
      title: 'Bizans & Osmanlı Termal Kür Güzergahı',
      subtitle: 'Geleneksel Roma banyosu sıcaklığı ve Osmanlı bitki banyolarıyla hücresel dengelenme',
      description: 'Tarihi yarımadadan başlayan bu kıymetli yolculuk, ihtişamlı Hürrem Sultan Hamamı ile Bursa\'nın kaplıca sularını birleştirir. Cilt metabolizmasının hızlanması ve kortizol seviyesinin dengelenmesi için mükemmeldir.'
    },
    'j2': {
      title: 'Ege Anti-Enflamatuar Hücresel Oruç Rotası',
      subtitle: 'Yüksek polifenollü beslenme ve DNA epigenetik testlerle damar sağlığını optimize edin',
      description: 'Tamamen bilim destekli Kuzey Ege beslenmesini barındıran sahil rotası. Ayvalık\'ta antik zeytin polifol tadımlarıyla başlayıp, Urla\'da yabani şifalı ot mutfağıyla devam eder ve Bodrum\'da DNA tabanlı arınmayla tamamlanır.'
    },
    'j3': {
      title: 'Anadolu Dağları Meditasyon & Apiterapi Şifa Hattı',
      subtitle: 'Tertemiz çam ormanlarında akciğerlerinizi temizleyin ve bağışıklığı coşturun',
      description: 'Fethiye Kabak Vadisi\'ndeki derin pranik nefes egzersizlerini kıyıdaki propolis apiterapisiyle birleştiren, Toros Dağları yaylalarında ise bitki bilimciler gözetiminde hacamat ve buhar kürleriyle biten canlandırıcı seyahat.'
    }
  }
};

// Localized translation blocks for Blog Articles
export const blogTranslations: Record<'en' | 'tr', Record<string, { title: string; subtitle: string; category: string; content: string }>> = {
  en: {
    'b1': {
      title: 'Unlocking Cellular Longevity in the Mineral Pools of Bursa',
      subtitle: 'Ancient Roman Thermals meets Modern Hydrotherapy Research on Heat Shock Proteins.',
      category: 'Thermals & Spa',
      content: `For over two millennia, the warm sulfurous waters of Bursa have been coveted for restorative rejuvenation. Modern epigenetic research is finally unlocking why. Thermal springs in the Bursa region contain precise concentrations of dissolved sulfur, lithium, calcium bicarbonate, and silicic acid.

When submerged in warm thermal waters (38°C to 40°C), the body activates Heat Shock Protein 70 (HSP70). This chaperone protein is a vital cell protector; it assists in the correct folding of newly formed cellular enzymes and targets dysfunctional, senescent proteins for autophagy and disposal. 

Additionally, trace sulfur absorption supports mitochondrial antioxidant pathways via glutathione upregulation, helping counter system-wide oxidative stress. Integrating Bursa thermal hydrotherapy into quarterly wellness cycles mirrors modern stress-induction techniques designed to slow down biological aging.`
    },
    'b2': {
      title: 'The Phenolic Profile of Aegean Wild Olives',
      subtitle: 'Why cold-pressed oils from Mount Ida (Kaz Dağları) activate Sirtuins.',
      category: 'Aegean Diet',
      content: `The Mediterranean diet has long been associated with lower cardiovascular age. However, not all olive oil is created equal. Our laboratory assays of wild olive varietals nestled in the microclimate of Mt. Ida, Turkey, reveal extraordinary densities of oleocanthal, oleuropein, and hydroxytyrosol. More than 700 mg/kg of total polyphenols are measured.

Highly bioavailable polyphenols trigger AMPK and SIRT1 pathways—the same sirtuin enzymes unlocked during caloric restriction or intermittent fasting. SIRT1 coordinates DNA repair, deacetylates histones, and triggers mitochondrial biogenesis. 

To maximize these compound concentrations for daily biological support, functional doctors recommend consuming cold-pressed wild olive oils harvested in the early green phase (September), completely uncooked, to retain fragile raw phenolic compounds.`
    },
    'b3': {
      title: 'Roman Thermal Baths, Contrast Therapy & Microvascular Autophagy',
      subtitle: 'The cardiovascular simulation hidden in Turkish Bath culture (Hammam).',
      category: 'Traditional Hammams',
      content: `The traditional Ottoman hammam consists of warm relaxation stones, deep steam scaling, and structural cold marble contrast flushes. This alternating thermal stress mimics intense aerobic interval workouts.

When you transition from the intense steam ambient heating (45°C) to active lymphatic scrubbing and cooling marble plunges, your microvascular system experiences profound vasodilation followed by rapid vasoconstriction. This "vascular pumping" flushes extracellular metabolic debris, stimulates lymph drainage, and induces localized cellular clearing. 

Furthermore, clinical trials demonstrate that 20 minutes of thermal sauna exposure twice a week results in significant resting heart rate optimization and endothelial elasticity expansion over a 12-week horizon.`
    }
  },
  tr: {
    'b1': {
      title: 'Bursa Mineral Havuzlarında Hücresel Uzun Ömrün Kilidini Açmak',
      subtitle: 'Antik Roma Kaplıcaları, Isı Şoku Proteinleri Üzerine Modern Hidroterapi Araştırmalarıyla Buluşuyor.',
      category: 'Kaplıca & Termal Şifa',
      content: `İki bin yılı aşkın bir süredir Bursa\'nın kükürtlü ılık suları, hücresel yenilenme için rağbet görmüştür. Modern epigenetik araştırmalar nihayet bunun nedenini ortaya koyuyor. Bursa bölgesindeki termal kaynaklar; çözünmüş kükürt, lityum, kalsiyum bikarbonat ve silisik asidin hassas konsantrasyonlarını barındırır.

Ilık termal sulara (38°C - 40°C) batırıldığında, vücut Hücre Koruyucu Isı Şoku Proteini 70\'i (HSP70) aktive eder. Bu protein, yeni sentezlenen hücresel enzimlerin doğru katlanmasına yardımcı olur ve işlevini yitirmiş yaşlı hücre proteinlerini temizlenmesi (otofaji) için hedefler.

Ayrıca, eser miktarda kükürt emilimi, glutatyon artışı yoluyla mitokondriyal antioksidan yolakları destekler ve sistem genelindeki oksidatif stresle savaşır. Bursa kaplıca kürlerini üç ayda bir yaşam döngünüze dahil etmek, biyolojik yaşlanmayı yavaşlatmak için tasarlanmış modern hormetik stres teknikleriyle birebir uyumludur.`
    },
    'b2': {
      title: 'Ege Yabani Zeytinlerinin Fenolik Profili',
      subtitle: 'Kaz Dağları\'ndan elde edilen soğuk sıkım yağlar neden Sirtuin enzimlerini aktive eder?',
      category: 'Ege Diyeti',
      content: `Akdeniz tipi beslenme, düşük kardiyovasküler yaşla yakından ilişkilendirilmiştir. Ancak tüm zeytinyağlarının şifası aynı değildir. Kaz Dağları\'nın özel mikroklimasında yetişen yabani zeytin çeşitlerindeki laboratuvar ölçümlerimiz; olağanüstü düzeyde oleokantal, oleuropein ve hidroksitirozol deşifre etti. Toplam polifenol oranı 700 mg/kg\'ın üzerindedir.

Biyolojik olarak son derece yararlı olan bu polifenoller, kalori kısıtlaması veya aralıklı oruç sırasında açığa çıkan "zincir koruyucu" SIRT1 ve AMPK enzim yolaklarını tetikler. SIRT1 hücresel düzeyde DNA onarımını yönetir ve yeni mitokondri oluşumunu uyarır.

Günlük biyolojik destek için bu bileşik konsantrasyonunu en yüksek düzeyde tutabilmek amacıyla, uzmanlar erken yeşil hasat döneminde (Eylül) toplanan ve hassas fenolik moleküllerin korunması için tamamen çiğ olarak tüketilen soğuk sıkım zeytinyağlarını önermektedir.`
    },
    'b3': {
      title: 'Roma Hamamları, Kontrast Kürleri & Mikrovasküler Otofaji',
      subtitle: 'Geleneksel Türk Hamamı kültürünün ardında yatan kardiyovasküler simülasyon.',
      category: 'Geleneksel Hamamlar',
      content: `Geleneksel Osmanlı hamamı; sıcak göbek taşları, yoğun buharlı terleme bölmeleri ve soğuk mermer kontrast durulamalarını barındırır. Bu ardışık termal stres, yoğun aerobik interval antrenmanlarını taklit eder.

Yoğun buhar ortamındaki ısınmadan (45°C), aktif liflemeye ve ardından gelen soğuk şok mermer banyosuna geçtiğinizde, kılcal damar sisteminiz yoğun bir genişleme ve ardından büzülme yaşar. Bu "kan damarı pompalaması", hücreler arası metabolik atıkları temizler, lenf drenajını uyarır ve bölgesel hücresel temizliği tetikler.

Ayrıca, klinik çalışmalar haftada iki kez yapılan 20 dakikalık termal sauna kürlerinin, 12 haftalık bir periyotta dinlenik nabız seviyesini belirgin şekilde düşürdüğünü ve damar esnekliğini artırdığını ispatlamaktadır.`
    }
  }
};

// Localized translation blocks for Events
export const eventTranslations: Record<'en' | 'tr', Record<string, { title: string; location: string; description: string }>> = {
  en: {
    'e1': {
      title: 'Anatolian Epigenetic & Longevity Summit 2026',
      location: 'Cave Meditation Chamber, Cappadocia',
      description: 'A global gathering of medical researchers, longevity clinicians, and holistic practitioners connecting ancient Anatolian hot therapies and volcanic nutrient soil chemistry with clinical senolytic therapy and sirtuin nutrition.'
    },
    'e2': {
      title: 'Bursa Hydrothermal Epigenetics Workshop',
      location: 'Kırkpınar Springs, Bursa',
      description: 'Learn and execute precise contrast hydrotherapy routines guided by sports medicine scientists. Learn the exact thermal heat-shock biogenesis protocol, mineral bio-absorption dynamics, and daily breathing controls.'
    },
    'e3': {
      title: 'Aegean Polyphenol & Sirtuin Diet Week',
      location: 'Urla Organic Olive Farms, Izmir',
      description: 'A physical immersion experience: Participate in harvesting high-density, green wild olives on the cliffs of Urla. Features functional nutrition training on lipid biochemistry, sirtuin activation cooking lessons, and cellular fasting strategies.'
    }
  },
  tr: {
    'e1': {
      title: 'Anadolu Epigenetik ve Sağlıklı Ömür Zirvesi 2026',
      location: 'Yeraltı Sükunet Mağarası, Kapadokya',
      description: 'Anadolu\'nun asırlık termal şifa bilgeliğini ve volkanik toprak zenginliğini, klinik yaşlılık karşıtı tedaviler ile sirtuin beslenmesiyle birleştiren tıp araştırmacıları ve klinisyenlerin küresel buluşması.'
    },
    'e2': {
      title: 'Bursa Hidrotermal Epigenetik Atölyesi',
      location: 'Kırkpınar Kaplıcaları, Bursa',
      description: 'Spor hekimliği uzmanları eşliğinde hassas hidrokür rutinlerini öğrenin ve bizzat uygulayın. Isı şoku etkisiyle mitokondriyal biyojenez protokolünü, mineral emilim dinamiklerini ve solunum egzersizlerini deşifre edin.'
    },
    'e3': {
      title: 'Ege Polifenolleri & Sirtuin Diyeti Kampı',
      location: 'Urla Organik Zeytin Ormanları, İzmir',
      description: 'Fiziksel hasat deneyimi: Urla falezlerindeki yüksek polifenollü yeşil yabani zeytin hasadına bizzat katılın. Yağ biyokimyası, sirtuin salkım yemek tarifleri ve dönemsel hücresel fasting eğitimlerini içerir.'
    }
  }
};

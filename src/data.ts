import { Partner, Category, RouteJourney } from './types';
import routeLongevityPinsJson from './data/route-longevity-pins.json';

export const CATEGORIES: Category[] = [
  {
    key: 'hammams',
    label: 'Hammams',
    iconName: 'Droplets',
    color: '#122328', // Deep Longevity Navy
    borderColor: 'border-brand-deep-slate',
  },
  {
    key: 'thermal-spa',
    label: 'Thermal & Spa',
    iconName: 'Waves',
    color: '#64D2A2', // Vital Mint
    borderColor: 'border-brand-turquoise',
  },
  {
    key: 'mediterranean-diet',
    label: 'Mediterranean Diet',
    iconName: 'Utensils',
    color: '#5A9D62', // Herbal Green
    borderColor: 'border-brand-med-teal',
  },
  {
    key: 'longevity-clinics',
    label: 'Longevity Clinics',
    iconName: 'HeartPulse',
    color: '#FF6B4A', // Warm Coral Accent
    borderColor: 'border-brand-copper',
  },
  {
    key: 'retreat-nature',
    label: 'Retreat & Nature',
    iconName: 'Trees',
    color: '#5A9D62', // Herbal Green
    borderColor: 'border-brand-olive-sage',
  },
  {
    key: 'traditional-med',
    label: 'Traditional Medicine',
    iconName: 'Leaf',
    color: '#8041F5', // Support Purple
    borderColor: 'border-brand-support-purple',
  },
  {
    key: 'local-producers',
    label: 'Local Producers',
    iconName: 'Store',
    color: '#D3F874', // Bright Highlight Lime
    borderColor: 'border-brand-highlight-lime',
  }
];

const FEATURED_PARTNERS_DATA: Partner[] = [
  {
    id: 'p1',
    name: 'Kırkpınar Thermal Spa',
    category: 'thermal-spa',
    categoryLabel: 'THERMAL & SPA',
    location: 'Bursa, Türkiye',
    city: 'Bursa',
    rating: 4.8,
    reviewCount: 128,
    latitude: 40.1885,
    longitude: 29.0610,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Historic hot thermal springs originating from the ancient Roman bath culture of Bursa, featuring rich mineral-laden water (42°C) rich in sulfur and bicarbonates for cellular restoration.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'Balneotherapy & Mineral Rejuvenation',
    phone: '+90 224 444 1616',
    email: 'info@kirkpinarthermal.com',
    address: 'Çekirge Mh., Selvi Sk. No:5, Osmangazi, Bursa',
    website: 'https://kirkpinarthermal.com',
    featured: true,
    analytics: {
      views: 12450,
      clicks: 3420,
      leadsGenerated: 580,
      monthlyTrafficTrend: [1200, 1800, 2100, 2400, 2600, 2350]
    }
  },
  {
    id: 'p2',
    name: 'Hürrem Sultan Hamamı',
    category: 'hammams',
    categoryLabel: 'HAMMAMS',
    location: 'Sultanahmet, İstanbul',
    city: 'Istanbul',
    rating: 4.9,
    reviewCount: 342,
    latitude: 41.0065,
    longitude: 28.9790,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    description: 'Designed by Mimar Sinan in the 16th century, this architectural marvel offers traditional multi-phase thermal exfoliation, organic herbal steam infusion, and essential oil massage.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'Ottoman Exfoliation Ritual & Olive Oil Foam Bath',
    phone: '+90 212 517 3535',
    email: 'contact@hurremsultanhamami.com',
    address: 'Cankurtaran Mh., Ayasofya Meydanı No:2, Fatih, İstanbul',
    website: 'https://hurremsultanhamami.com',
    featured: true,
    analytics: {
      views: 18900,
      clicks: 5100,
      leadsGenerated: 1120,
      monthlyTrafficTrend: [2500, 2800, 3100, 3300, 3600, 3600]
    }
  },
  {
    id: 'p3',
    name: 'Aegean Olive & Herb Sanctuary',
    category: 'mediterranean-diet',
    categoryLabel: 'MEDITERRANEAN DIET',
    location: 'Urla, İzmir',
    city: 'Izmir',
    rating: 4.7,
    reviewCount: 94,
    latitude: 38.3188,
    longitude: 26.7640,
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    description: 'An organic culinary estate celebrating the longevity benefits of high-polyphenol cold-press olive oil, freshly harvested wild greens (şevketibostan, radika), and Aegean longevity recipes.',
    licenseType: 'Standard',
    annualFee: 1200,
    specialty: 'Polyphenol-rich Olive Oil Tastings & Clean Gastronomy Workshops',
    phone: '+90 232 754 8090',
    email: 'hello@urlasanctuary.com',
    address: 'Kuşçular Köyü, 8012 Sk. No:24, Urla, İzmir',
    website: 'https://urlasanctuary.com',
    featured: false,
    analytics: {
      views: 6400,
      clicks: 1450,
      leadsGenerated: 290,
      monthlyTrafficTrend: [800, 950, 1100, 1200, 1150, 1200]
    }
  },
  {
    id: 'p4',
    name: 'Healist Longevity Clinic',
    category: 'longevity-clinics',
    categoryLabel: 'LONGEVITY CLINICS',
    location: 'Levent, İstanbul',
    city: 'Istanbul',
    rating: 4.9,
    reviewCount: 86,
    latitude: 41.0782,
    longitude: 29.0114,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Cutting-edge therapeutic research center specializing in cellular aging analysis, hyperbaric oxygen therapy (HBOT), IV NAD+ supplementation, and epigenetics-guided health customization plans.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'Epigenetic Testing & NAD+ Infusions',
    phone: '+90 212 324 0099',
    email: 'levent@healistlongevity.com',
    address: 'Büyükdere Cd., Maya Park Tower Kat:12, Levent, İstanbul',
    website: 'https://healistlongevity.com',
    featured: true,
    analytics: {
      views: 14200,
      clicks: 4120,
      leadsGenerated: 880,
      monthlyTrafficTrend: [1600, 2000, 2200, 2500, 2900, 3000]
    }
  },
  {
    id: 'p5',
    name: 'Kabalci Olive Oil Co.',
    category: 'local-producers',
    categoryLabel: 'LOCAL PRODUCERS',
    location: 'Ayvalık, Balıkesir',
    city: 'Balikesir',
    rating: 4.8,
    reviewCount: 74,
    latitude: 39.3193,
    longitude: 26.6961,
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80',
    description: 'Family-owned biodynamic olive groves utilizing traditional stone-mills. Harvesting centennial trees to produce an organic, antioxidant-rich olive elixir linked to centuries of North-Aegean longevity.',
    licenseType: 'Standard',
    annualFee: 1200,
    specialty: 'Centennial Tree Extra Virgin Olive Oil Production',
    phone: '+90 266 312 4050',
    email: 'order@kabalcioliveoil.com',
    address: 'Mithatpaşa Mh., Atatürk Bulvarı No:142, Ayvalık, Balıkesir',
    website: 'https://kabalcioliveoil.com',
    featured: false,
    analytics: {
      views: 5120,
      clicks: 980,
      leadsGenerated: 140,
      monthlyTrafficTrend: [600, 750, 800, 920, 1010, 1040]
    }
  },
  {
    id: 'p6',
    name: 'Kabak Valley Retreat & Yoga',
    category: 'retreat-nature',
    categoryLabel: 'RETREAT & NATURE',
    location: 'Fethiye, Muğla',
    city: 'Mugla',
    rating: 4.9,
    reviewCount: 154,
    latitude: 36.4612,
    longitude: 29.1245,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    description: 'Nestled in a pristine canyon isolated by pine forests, this luxury eco-lodge features solar-powered cabins, deep-breathing yoga decks overlooking the turquoise sea, and local plant-based meals.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'Forest Bathing, Pranic Breathing & Sunset Yoga',
    phone: '+90 252 614 7788',
    email: 'booking@kabakvalleyretreat.com',
    address: 'Faralya Mh., Kabak Koyu Sk. No:11, Fethiye, Muğla',
    website: 'https://kabakvalleyretreat.com',
    featured: true,
    analytics: {
      views: 15900,
      clicks: 4480,
      leadsGenerated: 750,
      monthlyTrafficTrend: [1800, 2400, 2700, 3100, 3300, 2600]
    }
  },
  {
    id: 'p7',
    name: 'Pamukkale Lycus Thermal',
    category: 'thermal-spa',
    categoryLabel: 'THERMAL & SPA',
    location: 'Pamukkale, Denizli',
    city: 'Denizli',
    rating: 4.6,
    reviewCount: 112,
    latitude: 37.9137,
    longitude: 29.1187,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    description: 'Thermal wellness hotel near the legendary white travertine pools, utilising calcium and iron-rich bicarbonate thermal mineral springs to support bone strength and dermatological cellular renewal.',
    licenseType: 'Standard',
    annualFee: 1200,
    specialty: 'Calcium pools & Mud Therapy',
    phone: '+90 258 271 4343',
    email: 'contact@pamukkalelycusthermal.com',
    address: 'Karahayıt Mh., 120 Sokak No:4, Pamukkale, Denizli',
    featured: false,
    website: 'https://pamukkalelycusthermal.com',
    analytics: {
      views: 7200,
      clicks: 1800,
      leadsGenerated: 320,
      monthlyTrafficTrend: [900, 1100, 1200, 1300, 1400, 1300]
    }
  },
  {
    id: 'p8',
    name: 'Oruçoglu Thermal & Wellness',
    category: 'thermal-spa',
    categoryLabel: 'THERMAL & SPA',
    location: 'Afyonkarahisar',
    city: 'Afyonkarahisar',
    rating: 4.7,
    reviewCount: 204,
    latitude: 38.7569,
    longitude: 30.5433,
    imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=800&q=80',
    description: 'Set in Türkiye’s thermal capital Afyonkarahisar, featuring pure underground natural thermal spas rich in silica. Designed with absolute clinical therapeutic protocols for articular health.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'Pure Silica Baths & Physiotherapy',
    phone: '+90 272 251 5050',
    email: 'info@orucoglu.com.tr',
    address: 'Afyonkarahisar-İzmir Karayolu 14. km, Afyonkarahisar',
    featured: true,
    website: 'https://orucoglu.com.tr',
    analytics: {
      views: 11300,
      clicks: 2950,
      leadsGenerated: 620,
      monthlyTrafficTrend: [1400, 1700, 1900, 2000, 2200, 2100]
    }
  },
  {
    id: 'p9',
    name: 'Sacred House Longevity Spa',
    category: 'retreat-nature',
    categoryLabel: 'RETREAT & NATURE',
    location: 'Ürgüp, Kapadokya',
    city: 'Cappadocia',
    rating: 4.9,
    reviewCount: 98,
    latitude: 38.6306,
    longitude: 34.9125,
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    description: 'A mystical cave hotel carved into the soft volcanic tuff of Cappadocia. Combines deep quiet meditation chambers, warm dry-stone salt rooms, and heated sulfur therapies inside a gothic visual masterpiece.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'Subterranean Aqua-Therapy & Cave Meditation',
    phone: '+90 384 341 7100',
    email: 'concierge@sacredhouse.com',
    address: 'Dutlu Cami Mh., Barbaros Sk. No:25, Ürgüp, Kapadokya',
    featured: true,
    website: 'https://sacredhouse.com',
    analytics: {
      views: 13950,
      clicks: 3870,
      leadsGenerated: 610,
      monthlyTrafficTrend: [1500, 1900, 2200, 2400, 3100, 2850]
    }
  },
  {
    id: 'p10',
    name: 'Bozburun Apitherapy Hub',
    category: 'traditional-med',
    categoryLabel: 'TRADITIONAL MEDICINE',
    location: 'Bozburun, Muğla',
    city: 'Mugla',
    rating: 4.8,
    reviewCount: 61,
    latitude: 36.6908,
    longitude: 28.0435,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'An isolated seaside sanctuary devoted to traditional Greek & Ottoman apitherapy, organic pine honey therapy, propolis extracts, and premium pollen pollen restoration for respiratory and immune longevity.',
    licenseType: 'Standard',
    annualFee: 1200,
    specialty: 'Immunology & Honeycomb inhalation',
    phone: '+90 252 486 9080',
    email: 'api@bozburunlongevity.com',
    address: 'Bozburun Mh., Liman Sk. No:54, Marmaris, Muğla',
    featured: false,
    website: 'https://bozburunlongevity.com',
    analytics: {
      views: 4800,
      clicks: 910,
      leadsGenerated: 190,
      monthlyTrafficTrend: [500, 650, 750, 850, 1020, 1030]
    }
  },
  {
    id: 'p11',
    name: 'Toros Herb & Phytotherapy Estate',
    category: 'traditional-med',
    categoryLabel: 'TRADITIONAL MEDICINE',
    location: 'Antalya Highlands',
    city: 'Antalya',
    rating: 4.7,
    reviewCount: 42,
    latitude: 36.9010,
    longitude: 30.7100,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    description: 'Phytotherapeutic mountain center cultivating endemic herbs (sage, mountain thyme, ironwort). Administering custom decoctions, ancient Turkish cup therapy (hacamat), and steam vapor inhalation.',
    licenseType: 'Standard',
    annualFee: 1200,
    specialty: 'Herbal Infusions & Ancient Cupping (Hacamat)',
    phone: '+90 242 321 4455',
    email: 'highland@torosherbs.org',
    address: 'Toros Dağları Yayla Sk. No:82, Akseki, Antalya',
    featured: false,
    website: 'https://torosherbs.org',
    analytics: {
      views: 3900,
      clicks: 810,
      leadsGenerated: 120,
      monthlyTrafficTrend: [450, 520, 610, 720, 820, 780]
    }
  },
  {
    id: 'p12',
    name: 'Bodrum Longevity & Wellness Lodge',
    category: 'longevity-clinics',
    categoryLabel: 'LONGEVITY CLINICS',
    location: 'Bodrum, Muğla',
    city: 'Mugla',
    rating: 4.9,
    reviewCount: 110,
    latitude: 37.0344,
    longitude: 27.4305,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'Premier seaside wellness lodge specialized in DNA methylation testing, heavy metal detoxing, cold plunge thermogenesis, and custom-designed cellular fasting programs overlooking the Aegean Sea.',
    licenseType: 'Premium',
    annualFee: 4500,
    specialty: 'DNA Methylation & Cold Plunge Detoxing',
    phone: '+90 252 319 8899',
    email: 'bodrum@bodrumlongevity.com',
    address: 'Yalıkavak Mh., Küdür Cd. No:41, Yalıkavak, Bodrum, Muğla',
    featured: true,
    website: 'https://bodrumlongevity.com',
    analytics: {
      views: 16100,
      clicks: 4890,
      leadsGenerated: 920,
      monthlyTrafficTrend: [2100, 2500, 2800, 3100, 3100, 2500]
    }
  }
];

interface ImportedRoutePin {
  id: number;
  name: string;
  city: string;
  region: string;
  category: 'hammam' | 'thermal' | 'longevity' | 'food' | 'retreat' | 'traditional';
  year_built?: number;
  lat: number;
  lng: number;
  description: string;
  website: string | null;
  featured: boolean;
}

interface ImportedPinsFile {
  pins: ImportedRoutePin[];
}

const importedPinsFile = routeLongevityPinsJson as ImportedPinsFile;

const importedCategoryMap: Record<ImportedRoutePin['category'], Pick<Category, 'key' | 'label'>> = {
  hammam: { key: 'hammams', label: 'HAMMAMS' },
  thermal: { key: 'thermal-spa', label: 'THERMAL & SPA' },
  longevity: { key: 'longevity-clinics', label: 'LONGEVITY CLINICS' },
  food: { key: 'mediterranean-diet', label: 'MEDITERRANEAN DIET' },
  retreat: { key: 'retreat-nature', label: 'RETREAT & NATURE' },
  traditional: { key: 'traditional-med', label: 'TRADITIONAL MEDICINE' },
};

const importedCategoryImages: Record<ImportedRoutePin['category'], string> = {
  hammam: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  thermal: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=85',
  longevity: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=85',
  food: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80',
  retreat: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85',
  traditional: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=800&q=85',
};

const importedCategorySpecialties: Record<ImportedRoutePin['category'], string> = {
  hammam: 'Historic Hammam Ritual & Steam Therapy',
  thermal: 'Mineral Bathing & Thermal Recovery',
  longevity: 'Preventive Longevity Screening',
  food: 'Mediterranean Diet & Polyphenol Nutrition',
  retreat: 'Nature Retreat, Breathwork & Recovery',
  traditional: 'Traditional Medicine Heritage',
};

const normalizePartnerName = (name: string) =>
  name
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '');

const currentPartnerNames = new Set(FEATURED_PARTNERS_DATA.map((partner) => normalizePartnerName(partner.name)));

const importedPinPartners: Partner[] = importedPinsFile.pins
  .filter((pin) => !currentPartnerNames.has(normalizePartnerName(pin.name)))
  .map((pin) => {
    const category = importedCategoryMap[pin.category];
    const rating = Number((4.35 + (pin.id % 11) * 0.04).toFixed(1));
    const reviewCount = 24 + ((pin.id * 17) % 260);
    const baseline = 360 + pin.id * 18;

    return {
      id: `pin-${pin.id}`,
      name: pin.name,
      category: category.key,
      categoryLabel: category.label,
      location: `${pin.city}, Türkiye`,
      city: pin.city,
      rating: Math.min(rating, 4.9),
      reviewCount,
      latitude: pin.lat,
      longitude: pin.lng,
      imageUrl: importedCategoryImages[pin.category],
      description: pin.year_built
        ? `${pin.description} Established heritage marker: ${pin.year_built}.`
        : pin.description,
      licenseType: 'Standard',
      annualFee: 1200,
      specialty: importedCategorySpecialties[pin.category],
      phone: '+90 000 000 0000',
      email: `listing-${pin.id}@routelongevity.com`,
      address: `${pin.name}, ${pin.city}, ${pin.region}, Türkiye`,
      website: pin.website || '#',
      featured: false,
      analytics: {
        views: baseline,
        clicks: Math.round(baseline * 0.22),
        leadsGenerated: Math.round(baseline * 0.035),
        monthlyTrafficTrend: [
          baseline - 150,
          baseline - 90,
          baseline - 30,
          baseline + 20,
          baseline + 70,
          baseline + 45,
        ],
      },
    };
  });

export const PARTNERS_DATA: Partner[] = [
  ...FEATURED_PARTNERS_DATA,
  ...importedPinPartners,
];

export const WELLNESS_JOURNEYS: RouteJourney[] = [
  {
    id: 'j1',
    title: 'The Byzantine & Ottoman Thermal Route',
    subtitle: 'Re-align cells with traditional Roman heat & Ottoman herbal rituals',
    duration: '5 Days',
    cities: ['Istanbul', 'Bursa'],
    description: 'This journey starting from the historical capital on the Bosporus, connecting the majestic Hürrem Sultan Hamamı with the healing mineral hot thermal spring baths of Bursa. Ideal for skin restoration and stress system reset.',
    partnerIds: ['p2', 'p1'],
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    tags: ['Skin Reborn', 'Balneology', 'Heat Therapy']
  },
  {
    id: 'j2',
    title: 'Aegean Anti-Inflammatory Fasting Route',
    subtitle: 'Optimize cardiovascular pathways with high-polyphenol diet & DNA testing',
    duration: '7 Days',
    cities: ['Ayvalık', 'Izmir', 'Bodrum'],
    description: 'A coastal drive focused entirely on the science-backed Aegean diet. Start with high-polyphenol olive oil sensory training in Ayvalık, wild herbs culinary lessons in Urla, and finish with genetic-informed fasting in Bodrum.',
    partnerIds: ['p5', 'p3', 'p12'],
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    tags: ['Atherosclerosis prevention', 'Epigenetics', 'Sirtfoods']
  },
  {
    id: 'j3',
    title: 'Anatolian Highlands Meditation & Apitherapy Route',
    subtitle: 'Saturate lungs and immune system in pristine pine forests',
    duration: '6 Days',
    cities: ['Muğla', 'Antalya'],
    description: 'Connect deep mountain breathing exercises in Fethiye Kabak canyon with raw propolis apitherapy on the shore, and and finish with natural fitotherapist cupping rituals in the pristine high forests of the Toros mountains.',
    partnerIds: ['p6', 'p10', 'p11'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    tags: ['Immune Fortification', 'Vagal Tone', 'Forest Bathing']
  }
];

export interface TurkishCity {
  id: string;
  nameEn: string;
  nameTr: string;
  latitude: number;
  longitude: number;
}

export const TURKISH_CITIES: TurkishCity[] = [
  { id: 'Adana', nameEn: 'Adana', nameTr: 'Adana', latitude: 37.0016, longitude: 35.3289 },
  { id: 'Adiyaman', nameEn: 'Adıyaman', nameTr: 'Adıyaman', latitude: 37.7648, longitude: 38.2786 },
  { id: 'Afyonkarahisar', nameEn: 'Afyonkarahisar', nameTr: 'Afyonkarahisar', latitude: 38.7507, longitude: 30.5567 },
  { id: 'Agri', nameEn: 'Ağrı', nameTr: 'Ağrı', latitude: 39.7191, longitude: 43.0503 },
  { id: 'Aksaray', nameEn: 'Aksaray', nameTr: 'Aksaray', latitude: 38.3687, longitude: 34.0370 },
  { id: 'Amasya', nameEn: 'Amasya', nameTr: 'Amasya', latitude: 40.6499, longitude: 35.8353 },
  { id: 'Ankara', nameEn: 'Ankara', nameTr: 'Ankara', latitude: 39.9334, longitude: 32.8597 },
  { id: 'Antalya', nameEn: 'Antalya', nameTr: 'Antalya', latitude: 36.8969, longitude: 30.7133 },
  { id: 'Ardahan', nameEn: 'Ardahan', nameTr: 'Ardahan', latitude: 41.1105, longitude: 42.7022 },
  { id: 'Artvin', nameEn: 'Artvin', nameTr: 'Artvin', latitude: 41.1828, longitude: 41.8103 },
  { id: 'Aydin', nameEn: 'Aydın', nameTr: 'Aydın', latitude: 37.8380, longitude: 27.8500 },
  { id: 'Balikesir', nameEn: 'Balıkesir', nameTr: 'Balıkesir', latitude: 39.6484, longitude: 27.8826 },
  { id: 'Bartin', nameEn: 'Bartın', nameTr: 'Bartın', latitude: 41.6344, longitude: 32.3375 },
  { id: 'Batman', nameEn: 'Batman', nameTr: 'Batman', latitude: 37.8812, longitude: 41.1351 },
  { id: 'Bayburt', nameEn: 'Bayburt', nameTr: 'Bayburt', latitude: 40.2552, longitude: 40.2249 },
  { id: 'Bilecik', nameEn: 'Bilecik', nameTr: 'Bilecik', latitude: 40.1426, longitude: 29.9795 },
  { id: 'Bingol', nameEn: 'Bingöl', nameTr: 'Bingöl', latitude: 38.8856, longitude: 40.4966 },
  { id: 'Bitlis', nameEn: 'Bitlis', nameTr: 'Bitlis', latitude: 38.4006, longitude: 42.1095 },
  { id: 'Bolu', nameEn: 'Bolu', nameTr: 'Bolu', latitude: 40.7350, longitude: 31.6061 },
  { id: 'Burdur', nameEn: 'Burdur', nameTr: 'Burdur', latitude: 37.7203, longitude: 30.2908 },
  { id: 'Bursa', nameEn: 'Bursa', nameTr: 'Bursa', latitude: 40.1885, longitude: 29.0610 },
  { id: 'Canakkale', nameEn: 'Çanakkale', nameTr: 'Çanakkale', latitude: 40.1553, longitude: 26.4142 },
  { id: 'Cankiri', nameEn: 'Çankırı', nameTr: 'Çankırı', latitude: 40.6013, longitude: 33.6134 },
  { id: 'Corum', nameEn: 'Çorum', nameTr: 'Çorum', latitude: 40.5506, longitude: 34.9556 },
  { id: 'Denizli', nameEn: 'Denizli', nameTr: 'Denizli', latitude: 37.7765, longitude: 29.0864 },
  { id: 'Diyarbakir', nameEn: 'Diyarbakır', nameTr: 'Diyarbakır', latitude: 37.9144, longitude: 40.2106 },
  { id: 'Duzce', nameEn: 'Düzce', nameTr: 'Düzce', latitude: 40.8438, longitude: 31.1565 },
  { id: 'Edirne', nameEn: 'Edirne', nameTr: 'Edirne', latitude: 41.6764, longitude: 26.5511 },
  { id: 'Elazig', nameEn: 'Elazığ', nameTr: 'Elazığ', latitude: 38.6810, longitude: 39.2264 },
  { id: 'Erzincan', nameEn: 'Erzincan', nameTr: 'Erzincan', latitude: 39.7392, longitude: 39.4902 },
  { id: 'Erzurum', nameEn: 'Erzurum', nameTr: 'Erzurum', latitude: 39.9043, longitude: 41.2679 },
  { id: 'Eskisehir', nameEn: 'Eskişehir', nameTr: 'Eskişehir', latitude: 39.7767, longitude: 30.5206 },
  { id: 'Gaziantep', nameEn: 'Gaziantep', nameTr: 'Gaziantep', latitude: 37.0662, longitude: 37.3833 },
  { id: 'Giresun', nameEn: 'Giresun', nameTr: 'Giresun', latitude: 40.9128, longitude: 38.3895 },
  { id: 'Gumushane', nameEn: 'Gümüşhane', nameTr: 'Gümüşhane', latitude: 40.4608, longitude: 39.4814 },
  { id: 'Hakkari', nameEn: 'Hakkari', nameTr: 'Hakkari', latitude: 37.5744, longitude: 43.7408 },
  { id: 'Hatay', nameEn: 'Hatay', nameTr: 'Hatay', latitude: 36.2023, longitude: 36.1613 },
  { id: 'Igdir', nameEn: 'Iğdır', nameTr: 'Iğdır', latitude: 39.9201, longitude: 44.0436 },
  { id: 'Isparta', nameEn: 'Isparta', nameTr: 'Isparta', latitude: 37.7648, longitude: 30.5566 },
  { id: 'Istanbul', nameEn: 'Istanbul', nameTr: 'İstanbul', latitude: 41.0082, longitude: 28.9784 },
  { id: 'Izmir', nameEn: 'Izmir', nameTr: 'İzmir', latitude: 38.4192, longitude: 27.1287 },
  { id: 'Kahramanmaras', nameEn: 'Kahramanmaraş', nameTr: 'Kahramanmaraş', latitude: 37.5858, longitude: 36.9371 },
  { id: 'Karabuk', nameEn: 'Karabük', nameTr: 'Karabük', latitude: 41.1992, longitude: 32.6264 },
  { id: 'Karaman', nameEn: 'Karaman', nameTr: 'Karaman', latitude: 37.1759, longitude: 33.2287 },
  { id: 'Kars', nameEn: 'Kars', nameTr: 'Kars', latitude: 40.6019, longitude: 43.0949 },
  { id: 'Kastamonu', nameEn: 'Kastamonu', nameTr: 'Kastamonu', latitude: 41.3787, longitude: 33.7753 },
  { id: 'Kayseri', nameEn: 'Kayseri', nameTr: 'Kayseri', latitude: 38.7312, longitude: 35.4787 },
  { id: 'Kilis', nameEn: 'Kilis', nameTr: 'Kilis', latitude: 36.7184, longitude: 37.1212 },
  { id: 'Kirikkale', nameEn: 'Kırıkkale', nameTr: 'Kırıkkale', latitude: 39.8453, longitude: 33.5153 },
  { id: 'Kirklareli', nameEn: 'Kırklareli', nameTr: 'Kırklareli', latitude: 41.7347, longitude: 27.2252 },
  { id: 'Kirsehir', nameEn: 'Kırşehir', nameTr: 'Kırşehir', latitude: 39.1425, longitude: 34.1709 },
  { id: 'Kocaeli', nameEn: 'Kocaeli', nameTr: 'Kocaeli', latitude: 40.8533, longitude: 29.8815 },
  { id: 'Konya', nameEn: 'Konya', nameTr: 'Konya', latitude: 37.8714, longitude: 32.4846 },
  { id: 'Kutahya', nameEn: 'Kütahya', nameTr: 'Kütahya', latitude: 39.4242, longitude: 29.9833 },
  { id: 'Malatya', nameEn: 'Malatya', nameTr: 'Malatya', latitude: 38.3552, longitude: 38.3095 },
  { id: 'Manisa', nameEn: 'Manisa', nameTr: 'Manisa', latitude: 38.6191, longitude: 27.4289 },
  { id: 'Mardin', nameEn: 'Mardin', nameTr: 'Mardin', latitude: 37.3122, longitude: 40.7350 },
  { id: 'Mersin', nameEn: 'Mersin', nameTr: 'Mersin', latitude: 36.8121, longitude: 34.6415 },
  { id: 'Mugla', nameEn: 'Muğla', nameTr: 'Muğla', latitude: 37.2153, longitude: 28.3636 },
  { id: 'Mus', nameEn: 'Muş', nameTr: 'Muş', latitude: 38.7432, longitude: 41.5064 },
  { id: 'Nevsehir', nameEn: 'Nevşehir', nameTr: 'Nevşehir', latitude: 38.6244, longitude: 34.7144 },
  { id: 'Nigde', nameEn: 'Niğde', nameTr: 'Niğde', latitude: 37.9697, longitude: 34.6857 },
  { id: 'Ordu', nameEn: 'Ordu', nameTr: 'Ordu', latitude: 40.9839, longitude: 37.8764 },
  { id: 'Osmaniye', nameEn: 'Osmaniye', nameTr: 'Osmaniye', latitude: 37.0742, longitude: 36.2467 },
  { id: 'Rize', nameEn: 'Rize', nameTr: 'Rize', latitude: 41.0201, longitude: 40.5234 },
  { id: 'Sakarya', nameEn: 'Sakarya', nameTr: 'Sakarya', latitude: 40.7569, longitude: 30.3789 },
  { id: 'Samsun', nameEn: 'Samsun', nameTr: 'Samsun', latitude: 41.2928, longitude: 36.3313 },
  { id: 'Sanliurfa', nameEn: 'Şanlıurfa', nameTr: 'Şanlıurfa', latitude: 37.1591, longitude: 38.7969 },
  { id: 'Siirt', nameEn: 'Siirt', nameTr: 'Siirt', latitude: 37.9333, longitude: 41.9500 },
  { id: 'Sinop', nameEn: 'Sinop', nameTr: 'Sinop', latitude: 42.0264, longitude: 35.1624 },
  { id: 'Sirnak', nameEn: 'Şırnak', nameTr: 'Şırnak', latitude: 37.5164, longitude: 42.4611 },
  { id: 'Sivas', nameEn: 'Sivas', nameTr: 'Sivas', latitude: 39.7505, longitude: 37.0150 },
  { id: 'Tekirdag', nameEn: 'Tekirdağ', nameTr: 'Tekirdağ', latitude: 40.9781, longitude: 27.5110 },
  { id: 'Tokat', nameEn: 'Tokat', nameTr: 'Tokat', latitude: 40.3160, longitude: 36.5500 },
  { id: 'Trabzon', nameEn: 'Trabzon', nameTr: 'Trabzon', latitude: 41.0027, longitude: 39.7168 },
  { id: 'Tunceli', nameEn: 'Tunceli', nameTr: 'Tunceli', latitude: 39.1079, longitude: 39.5401 },
  { id: 'Usak', nameEn: 'Uşak', nameTr: 'Uşak', latitude: 38.6823, longitude: 29.4082 },
  { id: 'Van', nameEn: 'Van', nameTr: 'Van', latitude: 38.4891, longitude: 43.4011 },
  { id: 'Yalova', nameEn: 'Yalova', nameTr: 'Yalova', latitude: 40.6551, longitude: 29.2769 },
  { id: 'Yozgat', nameEn: 'Yozgat', nameTr: 'Yozgat', latitude: 39.8181, longitude: 34.8147 },
  { id: 'Zonguldak', nameEn: 'Zonguldak', nameTr: 'Zonguldak', latitude: 41.4564, longitude: 31.7987 }
];

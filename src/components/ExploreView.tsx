import React, { useEffect, useState } from 'react';
import { CATEGORIES, PARTNERS_DATA } from '../data';
import { Partner } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, Star, ArrowRight, ShieldCheck, Heart, X, Building2, ClipboardCheck, Leaf, Flower2, Gem, UsersRound, BookOpen, Clock } from 'lucide-react';
import Footer from './Footer';
import { AuthMode, AuthRole, AuthSession } from './AuthModal';
import { getBlogPosts } from '../api';
import type { BlogPost } from './BlogEventsModal';
import AgentSearchBar from './AgentSearchBar';

interface ExploreViewProps {
  onTabChange: (tab: any) => void;
  onCategorySelect: (catKey: string) => void;
  onFocusPartner: (partnerId: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onOpenBlog: () => void;
  onOpenEvents: () => void;
  onOpenAuth: (role: AuthRole, mode: AuthMode) => void;
  authSession: AuthSession | null;
}

function CategoryIcon({ categoryKey }: { categoryKey: string }) {
  const commonProps = {
    className: 'w-5 h-5',
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (categoryKey) {
    case 'hammams':
      return (
        <svg {...commonProps}>
          <path d="M7.8 18.6h16.4" />
          <path d="M9.4 18.6c.5 4.2 3 6.3 6.6 6.3s6.1-2.1 6.6-6.3" />
          <path d="M11.7 21.4h8.6" />
          <path d="M12 14.7c0-1.4 1.2-1.7 1.2-3.1S12 9.9 12 8.5" />
          <path d="M16 14.7c0-1.4 1.2-1.7 1.2-3.1S16 9.9 16 8.5" />
          <path d="M20 14.7c0-1.4 1.2-1.7 1.2-3.1S20 9.9 20 8.5" />
          <path d="M10.4 17.1c1.1-1.1 2.9-1.8 5.6-1.8s4.5.7 5.6 1.8" />
        </svg>
      );
    case 'thermal-spa':
      return (
        <svg {...commonProps}>
          <path d="M6 20.2c2.2 0 2.2-1.6 4.4-1.6s2.2 1.6 4.4 1.6 2.2-1.6 4.4-1.6 2.2 1.6 4.4 1.6" />
          <path d="M8.2 24.2c1.6 0 1.6-1.1 3.2-1.1s1.6 1.1 3.2 1.1 1.6-1.1 3.2-1.1 1.6 1.1 3.2 1.1" />
          <path d="M12.2 14.6c0-1.9 1.7-2.1 1.7-4s-1.7-2.1-1.7-4" />
          <path d="M18.2 14.6c0-1.9 1.7-2.1 1.7-4s-1.7-2.1-1.7-4" />
        </svg>
      );
    case 'mediterranean-diet':
      return (
        <svg {...commonProps}>
          <path d="M16 24.8c-3.7-3.3-5.6-6.7-5.6-10.1 0-3.7 2.4-6.6 5.6-8.2 3.2 1.6 5.6 4.5 5.6 8.2 0 3.4-1.9 6.8-5.6 10.1Z" />
          <path d="M16 24.8V10" />
          <path d="M16 15.5c-2.5-.2-4.2-1.3-5.2-3.2" />
          <path d="M16 18.8c2.7-.3 4.5-1.6 5.4-3.8" />
        </svg>
      );
    case 'longevity-clinics':
      return (
        <svg {...commonProps}>
          <path d="M16 25.5c5.5-3.2 8.5-7.2 8.5-11.6a5.2 5.2 0 0 0-8.5-4 5.2 5.2 0 0 0-8.5 4c0 4.4 3 8.4 8.5 11.6Z" />
          <path d="M10.2 16h3.5l1.6-3.6 2.4 7.1 1.5-3.5h2.6" />
        </svg>
      );
    case 'retreat-nature':
      return (
        <svg {...commonProps}>
          <path d="M16 24.8V12.2" />
          <path d="M16 12.2c-3.7-.2-6.6 1.8-8.5 5.9 4 .8 6.8-.4 8.5-3.7" />
          <path d="M16 12.2c3.7-.2 6.6 1.8 8.5 5.9-4 .8-6.8-.4-8.5-3.7" />
          <path d="M12.2 25.2h7.6" />
          <path d="M16 12c.2-2.1 1.5-3.9 3.8-5.2" />
        </svg>
      );
    case 'traditional-med':
      return (
        <svg {...commonProps}>
          <path d="M12 8h8" />
          <path d="M13.4 8v5.1l-5.1 8.2a2.8 2.8 0 0 0 2.4 4.3h10.6a2.8 2.8 0 0 0 2.4-4.3l-5.1-8.2V8" />
          <path d="M10.4 20.7h11.2" />
          <path d="M14.4 17.5c1.3-1 2.4-1 3.7 0" />
        </svg>
      );
    case 'local-producers':
      return (
        <svg {...commonProps}>
          <path d="M8.5 14.2h15l-1.2 11.3H9.7L8.5 14.2Z" />
          <path d="M11.2 14.2V11a4.8 4.8 0 0 1 9.6 0v3.2" />
          <path d="M7.2 14.2l1.4-4h14.8l1.4 4" />
          <path d="M12.3 19.4h7.4" />
          <path d="M14.2 22.4h3.6" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M16 6.5 24 11v10l-8 4.5L8 21V11l8-4.5Z" />
          <path d="M16 15.8v9.7" />
          <path d="m8 11 8 4.8 8-4.8" />
        </svg>
      );
  }
}

export default function ExploreView({
  onTabChange,
  onCategorySelect,
  onFocusPartner,
  favorites,
  toggleFavorite,
  onOpenBlog,
  onOpenEvents,
  onOpenAuth,
  authSession
}: ExploreViewProps) {
  const { language, t, translateCategory, translatePartner } = useLanguage();

  // Only display partners with 'Premium' status as premium featured in explore
  const premiumPartners = PARTNERS_DATA.filter((p) => p.licenseType === 'Premium');

  const [searchQuery, setSearchQuery] = useState('');
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getBlogPosts(language)
      .then(({ posts }) => setLatestPosts(posts.slice(0, 4)))
      .catch((error) => console.warn('Latest articles could not be loaded.', error));
  }, [language]);

  const leadArticle = latestPosts[0];

  const getPartnerCountry = (partner: Partner) => partner.country || 'Türkiye';
  const formatPartnerLocation = (partner: Partner) => {
    const city = translatePartner(partner.id, 'city', partner.city);
    const country = getPartnerCountry(partner);
    return city && city !== country ? `${city}, ${country}` : country;
  };

  // Live filter logic. Matches by name, city, country, specialty, description, categoryLabel.
  const matchedPartners = PARTNERS_DATA.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;

    const nameEN = p.name.toLowerCase();
    const nameTR = translatePartner(p.id, 'name', p.name).toLowerCase();
    const cityEN = p.city.toLowerCase();
    const cityTR = translatePartner(p.id, 'city', p.city).toLowerCase();
    const country = getPartnerCountry(p).toLowerCase();
    const specialtyEN = p.specialty.toLowerCase();
    const specialtyTR = translatePartner(p.id, 'specialty', p.specialty).toLowerCase();
    const descEN = p.description.toLowerCase();
    const descTR = translatePartner(p.id, 'description', p.description).toLowerCase();
    const catLabelEN = p.categoryLabel.toLowerCase();
    const catLabelTR = translateCategory(p.category, p.categoryLabel).toLowerCase();

    return (
      nameEN.includes(q) || nameTR.includes(q) ||
      cityEN.includes(q) || cityTR.includes(q) ||
      country.includes(q) ||
      specialtyEN.includes(q) || specialtyTR.includes(q) ||
      descEN.includes(q) || descTR.includes(q) ||
      catLabelEN.includes(q) || catLabelTR.includes(q)
    );
  });

  const displayPartners = searchQuery ? matchedPartners : premiumPartners;
  const categoryContent: Record<string, { en: { title: string; desc: string }; tr: { title: string; desc: string } }> = {
    'thermal-spa': {
      en: { title: 'Thermal & Mineral Waters', desc: 'Mineral bathing, hydrotherapy and recovery destinations.' },
      tr: { title: 'Termal ve Mineral Sular', desc: 'Mineral banyo, hidroterapi ve toparlanma destinasyonları.' },
    },
    hammams: {
      en: { title: 'Hammams & Ritual Bathing', desc: 'Heritage bathing rituals for circulation, stress and renewal.' },
      tr: { title: 'Hamamlar ve Ritüel Banyo', desc: 'Dolaşım, stres ve yenilenme için miras ritüelleri.' },
    },
    'longevity-clinics': {
      en: { title: 'Longevity Clinics', desc: 'Diagnostics, preventive programs and physician-led protocols.' },
      tr: { title: 'Longevity Klinikleri', desc: 'Tanı, önleyici programlar ve hekim liderliğinde protokoller.' },
    },
    'retreat-nature': {
      en: { title: 'Retreats & Nature Recovery', desc: 'Forest, mountain and coastal resets for nervous-system balance.' },
      tr: { title: 'İnzivalar ve Doğada Toparlanma', desc: 'Sinir sistemi dengesi için orman, dağ ve kıyı kaçışları.' },
    },
    'mediterranean-diet': {
      en: { title: 'Mediterranean Nutrition', desc: 'Olive oil, fermented foods and evidence-informed food routes.' },
      tr: { title: 'Akdeniz Beslenmesi', desc: 'Zeytinyağı, fermente gıdalar ve bilimsel beslenme rotaları.' },
    },
    'traditional-med': {
      en: { title: 'Traditional Healing', desc: 'Time-tested practices presented with modern safety context.' },
      tr: { title: 'Geleneksel Şifa', desc: 'Modern güvenlik bağlamıyla sunulan kadim pratikler.' },
    },
    'local-producers': {
      en: { title: 'Olive Routes & Local Producers', desc: 'Terroir, harvest quality and producer-led longevity experiences.' },
      tr: { title: 'Zeytin Rotaları ve Üreticiler', desc: 'Terroir, hasat kalitesi ve üretici deneyimleri.' },
    },
  };

  const uiDirectionCards = [
    {
      tag: language === 'tr' ? 'Kıyı Ritüelleri' : 'Coastal Rituals',
      title: language === 'tr' ? 'Ege Yenilenmesi' : 'Aegean Renewal',
      desc: language === 'tr' ? 'Deniz kıyısı ritüelleri ve termal gelenekler.' : 'Seaside rituals and thermal traditions.',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=85',
      color: 'text-brand-med-teal',
      tagTone: 'bg-brand-turquoise/20 text-brand-med-teal',
    },
    {
      tag: language === 'tr' ? 'Doğa ve Denge' : 'Nature & Balance',
      title: language === 'tr' ? 'Anadolu Harmonia' : 'Anatolian Harmonia',
      desc: language === 'tr' ? 'Orman inzivaları ve bilinçli kaçışlar.' : 'Forest retreats and mindful escapes.',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=85',
      color: 'text-brand-med-teal',
      tagTone: 'bg-brand-olive-sage/20 text-brand-med-teal',
    },
    {
      tag: language === 'tr' ? 'Kültürel Miras' : 'Cultural Heritage',
      title: language === 'tr' ? 'Zamansız Miras' : 'Timeless Heritage',
      desc: language === 'tr' ? 'Tarihi şehirler ve yaşayan gelenekler.' : 'Historic cities and living traditions.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=85',
      color: 'text-brand-support-purple',
      tagTone: 'bg-brand-support-purple/12 text-brand-support-purple',
    },
  ];

  const handleCategoryClick = (key: string) => {
    onCategorySelect(key);
    onTabChange('map');
  };

  const handleViewOnMap = (partnerId: string) => {
    onFocusPartner(partnerId);
    onTabChange('map');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 md:p-8 max-w-7xl mx-auto w-full space-y-8 md:space-y-10">
      {/* Hero Welcome banner */}
      <div className="relative rounded-[32px] overflow-hidden glass-dark text-brand-soft-ivory p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 items-stretch">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(217,110,95,0.22),transparent_24%)]" />
        <div className="space-y-6 max-w-3xl z-10 self-center">
          <span className="text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-full uppercase tracking-wide border border-white/10">
            {language === 'tr' ? 'Global longevity rota zekası' : 'Global longevity route intelligence'}
          </span>
          <h1 className="text-3xl md:text-5xl xl:text-[3.45rem] font-extrabold font-display leading-[1.06] tracking-normal max-w-4xl">
            {language === 'tr'
              ? 'Sağlık hedefini anlat. AI longevity rotanı oluştursun.'
              : 'Describe Your Health Goal. AI Builds Your Longevity Route.'}
          </h1>
          <p className="text-sm md:text-base text-brand-soft-ivory/82 leading-7 max-w-2xl pb-2">
            {language === 'tr'
              ? 'Uyku, stres, toparlanma, bağışıklık, metabolizma veya sağlıklı yaşlanma hedefini yaz. Route Longevity verified klinikler, inzivalar, termal kaynaklar, hamamlar, beslenme deneyimleri ve wellness destinasyonları arasında kişiselleştirilmiş bir rota oluşturur.'
              : 'Tell us what you want to improve — sleep, stress, recovery, immunity, metabolism or healthy aging. Route Longevity creates a personalized route across verified clinics, retreats, thermal springs, hammams, nutrition experiences and wellness destinations.'}
          </p>
          <div className="pt-3">
            <AgentSearchBar authSession={authSession} onOpenAuth={onOpenAuth} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            {[
              [PARTNERS_DATA.length, language === 'tr' ? 'doğrulanmış yer' : 'verified places'],
              [CATEGORIES.length + 1, language === 'tr' ? 'longevity kategorisi' : 'longevity categories'],
              ['4.8', language === 'tr' ? 'misafir puanı' : 'guest rating'],
              ['25+', language === 'tr' ? 'ülke planlandı' : 'countries planned']
            ].map(([value, label]) => (
              <div key={`${value}-${label}`} className="border border-white/14 bg-white/10 rounded-2xl p-3 backdrop-blur-md">
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-[10px] text-white/55 font-semibold leading-tight mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onTabChange('map')}
              className="px-5 py-3 bg-brand-med-teal hover:bg-white text-white hover:text-brand-deep-slate font-bold text-sm rounded-[16px] transition-all shadow-md shadow-brand-turquoise/15 flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'tr' ? 'Haritayı Keşfet' : 'Explore the Map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTabChange('experiences')}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-[16px] transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              {language === 'tr' ? 'Deneyim Rotaları' : 'Explore Experiences'}
            </button>
          </div>
        </div>

        <div className="w-full min-h-[260px] rounded-3xl overflow-hidden relative border border-white/16 shadow-lg bg-white/10 backdrop-blur-md">
          <img
            src={leadArticle?.imageUrl || 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1000&q=85'}
            alt={leadArticle?.title || (language === 'tr' ? 'Bursa termal spa havuzu' : 'Bursa thermal spa pool')}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-slate/92 via-brand-deep-slate/20 to-transparent flex flex-col justify-end p-5">
            <p className="text-[10px] font-bold text-brand-highlight-lime uppercase tracking-wide">
              {leadArticle ? (language === 'tr' ? 'Longevity Journal' : 'Longevity Journal') : (language === 'tr' ? 'Öne çıkan rota' : 'Featured route')}
            </p>
            <p className="text-xl font-black text-white leading-tight mt-1">
              {leadArticle?.title || (language === 'tr' ? '16. Yüzyıl Termal Kaynakları' : '16th Century Thermal Springs')}
            </p>
            <p className="text-xs text-white/70 mt-2 max-w-xs leading-relaxed">
              {leadArticle?.subtitle || (language === 'tr' ? 'Mineral su, buhar ritüeli ve modern hidroterapi protokolü tek rotada.' : 'Mineral water, steam ritual, and modern hydrotherapy protocol in one route.')}
            </p>
            {leadArticle && (
              <button
                onClick={() => onTabChange('blog')}
                className="mt-4 w-fit rounded-xl bg-brand-turquoise px-4 py-2 text-xs font-black text-brand-deep-slate hover:bg-brand-highlight-lime transition-colors"
              >
                {language === 'tr' ? 'Makaleyi oku' : 'Read review'}
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="glass-surface-strong rounded-[28px] overflow-hidden">
        <div className="px-5 md:px-8 pt-6 pb-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-brand-med-teal">
                {language === 'tr' ? 'AI rota akışı' : 'AI route workflow'}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-deep-slate">
                {language === 'tr' ? 'AI Longevity Rotanız Nasıl Oluşur?' : 'How Your AI Longevity Route Works'}
              </h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-brand-deep-slate/55">
              {language === 'tr'
                ? 'Route Longevity tıbbi tanı sunmaz. Belirttiğiniz hedeflere göre doğrulanmış wellness ve longevity deneyimlerini keşfetmenize yardımcı olur.'
                : 'Route Longevity does not provide medical diagnosis. It helps users discover verified wellness and longevity experiences based on their stated goals.'}
            </p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            {[
              [language === 'tr' ? 'Hedefini yaz' : 'Describe your goal', language === 'tr' ? 'Uyku, stres, toparlanma veya metabolizma gibi ihtiyacını anlat.' : 'Tell us about sleep, stress, recovery, metabolism or another need.'],
              [language === 'tr' ? 'AI eşleştirir' : 'AI matches needs', language === 'tr' ? 'Sistem gerçek yerleri kategori, konum ve sağlık odağıyla eşleştirir.' : 'The system matches real places by category, location and health focus.'],
              [language === 'tr' ? 'Rotanı incele' : 'Review your route', language === 'tr' ? 'Önerilen klinik, termal, inziva ve deneyimleri karşılaştır.' : 'Compare recommended clinics, thermal places, retreats and experiences.'],
              [language === 'tr' ? 'Kaydet ve geliştir' : 'Save and refine', language === 'tr' ? 'Favorilere ekle, haritada gör ve partnerlerden detay iste.' : 'Save favorites, view on map and request partner details.'],
            ].map(([title, desc], index) => (
              <div key={title} className="relative rounded-3xl border border-brand-warm-sand/55 bg-white/78 p-4 shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-olive-sage/70 text-sm font-black text-brand-deep-slate">
                  {index + 1}
                </div>
                <h3 className="text-sm font-black text-brand-deep-slate">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-brand-deep-slate/58">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 md:px-8 py-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-brand-turquoise/35" />
            <h2 className="text-lg md:text-xl font-extrabold text-brand-deep-slate tracking-normal">
              {language === 'tr' ? 'Öne Çıkan Rota Hikayeleri' : 'Curated Route Stories'}
            </h2>
            <div className="h-px flex-1 bg-brand-turquoise/35" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.62fr_1.45fr] gap-5 items-stretch">
            <article className="relative min-h-[190px] rounded-3xl glass-dark text-white overflow-hidden p-6 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.08)_55%,rgba(43,192,166,0.18))]" />
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-normal max-w-xs">
                  {language === 'tr' ? 'Longevity bir yolculuktur. Miras yolun kendisidir.' : 'Longevity is a journey. Heritage is the path.'}
                </h3>
                <p className="text-xs text-white/70 leading-5 mt-4 max-w-xs">
                  {language === 'tr'
                    ? 'Türkiye’de doğal iyi yaşam ve zamansız yaşam deneyimleri için kürasyon.'
                    : 'Curated experiences in Türkiye for natural well-being and timeless living.'}
                </p>
              </div>
              <button
                onClick={() => onTabChange('map')}
                className="relative z-10 w-fit px-5 py-3 rounded-xl bg-brand-turquoise text-brand-deep-slate text-xs font-black hover:bg-brand-highlight-lime transition-colors flex items-center gap-3 cursor-pointer"
              >
                <span>{language === 'tr' ? 'Rotayı Keşfet' : 'Explore Route'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            <div className="flex flex-col justify-center gap-4">
              <button
                onClick={() => onTabChange('experiences')}
                className="w-full px-5 py-3.5 rounded-xl bg-brand-med-teal text-white text-xs font-black shadow-sm hover:bg-brand-deep-slate transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{language === 'tr' ? 'Deneyimleri Gör' : 'View Experiences'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (authSession) {
                    onTabChange('profile');
                  } else {
                    onOpenAuth('partner', 'signup');
                  }
                }}
                className="w-full px-5 py-3.5 rounded-xl bg-brand-turquoise text-brand-deep-slate text-xs font-black shadow-sm hover:bg-brand-turquoise/85 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{language === 'tr' ? 'Partner Ol' : 'Become a Partner'}</span>
                <UsersRound className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-3 gap-2 rounded-xl glass-surface px-3 py-3">
                {[
                  [language === 'tr' ? 'Doğal' : 'Natural', Leaf],
                  [language === 'tr' ? 'Holistik' : 'Holistic', Flower2],
                  [language === 'tr' ? 'Premium' : 'Premium', Gem],
                ].map(([label, Icon]) => {
                  const KeywordIcon = Icon as typeof Leaf;
                  return (
                    <div key={label as string} className="flex flex-col items-center gap-1 text-brand-deep-slate">
                      <KeywordIcon className="w-4 h-4 text-brand-med-teal" />
                      <span className="text-[9px] font-bold">{label as string}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {uiDirectionCards.map((card) => (
                <article key={card.title} className="rounded-3xl glass-surface overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  <div className="h-28 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[9px] font-black ${card.tagTone}`}>
                      {card.tag}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-brand-deep-slate leading-tight tracking-normal">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-5 text-brand-deep-slate/62">
                      {card.desc}
                    </p>
                    <button
                      onClick={() => onTabChange('experiences')}
                      className={`mt-3 flex items-center gap-2 text-[11px] font-black ${card.color} cursor-pointer`}
                    >
                      <span>{language === 'tr' ? 'Keşfet' : 'Explore'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5">
        <section className="glass-surface-strong rounded-3xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-med-teal flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {language === 'tr' ? 'Longevity Journal' : 'Longevity Journal'}
              </p>
              <h2 className="text-xl font-extrabold text-brand-deep-slate tracking-normal mt-1">
                {language === 'tr' ? 'Kanıt odaklı rehberler ve rota fikirleri' : 'Evidence-informed guides and route ideas'}
              </h2>
            </div>
            <button
              onClick={() => onTabChange('blog')}
              className="text-xs font-black text-brand-med-teal hover:text-brand-deep-slate flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'tr' ? 'Tüm makaleler' : 'All articles'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {latestPosts.slice(0, 4).map((post) => (
              <button
                key={post.id}
                onClick={() => onTabChange('blog')}
                className="rounded-2xl glass-surface p-3 text-left hover:border-brand-med-teal transition-colors"
              >
                <div className="flex gap-3">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="h-20 w-24 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-wider text-brand-med-teal truncate">{post.category}</div>
                    <h3 className="mt-1 text-sm font-black leading-snug text-brand-deep-slate line-clamp-2">{post.title}</h3>
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-brand-deep-slate/45">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                      <span className="ml-1 rounded-full bg-brand-highlight-lime/18 px-2 py-0.5 text-brand-deep-slate/65">
                        {language === 'tr' ? 'Editoryal' : 'Editorial'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="glass-dark text-white rounded-3xl p-5 flex flex-col justify-between gap-5">
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-turquoise/15 text-brand-turquoise flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold tracking-normal">
              {language === 'tr' ? 'Kliniğinizi, inzivanızı veya longevity deneyiminizi listeleyin' : 'List Your Clinic, Retreat or Longevity Experience'}
            </h2>
            <p className="text-sm text-white/68 leading-6 mt-2">
              {language === 'tr'
                ? 'Route Longevity’nin doğrulanmış partner ağına katılın ve kişiselleştirilmiş AI rotalarında keşfedilebilir olun.'
                : 'Join Route Longevity’s verified partner network and become discoverable inside personalized AI-generated routes.'}
            </p>
          </div>
          <button
            onClick={() => {
              if (authSession) {
                onTabChange('profile');
              } else {
                onOpenAuth('partner', 'signup');
              }
            }}
            className="w-full py-3 rounded-xl bg-brand-copper text-white text-sm font-black hover:bg-white hover:text-brand-deep-slate transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>{language === 'tr' ? 'Partner Başvurusu Yap' : 'Apply as Partner'}</span>
          </button>
        </section>
      </div>

      {/* Real-time Search Box */}
      <div className="glass-surface-strong rounded-3xl p-5 md:p-6 space-y-3 relative overflow-hidden">
        
        <div className="relative">
          <label htmlFor="explore-search" className="block text-xs font-bold text-[#042f2c] uppercase tracking-wider mb-2 font-sans select-none">
            {t('exploreSearchLabel')}
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-brand-deep-slate/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="explore-search"
              type="text"
              placeholder={t('exploreSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white/58 text-sm text-brand-deep-slate rounded-2xl border border-white/80 focus:outline-none focus:border-brand-med-teal/70 focus:ring-1 focus:ring-brand-med-teal/50 transition-all placeholder:text-brand-deep-slate/30 backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label={language === 'tr' ? 'Aramayı temizle' : 'Clear search'}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-brand-deep-slate/45 hover:text-brand-deep-slate transition-colors hover:bg-brand-warm-sand/25 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-brand-deep-slate/60 font-mono animate-in fade-in duration-200">
            <span>
              {t('foundMatchingLocations').replace('{count}', matchedPartners.length.toString())}
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-brand-med-teal font-bold hover:underline cursor-pointer"
            >
              {t('clearSearch')}
            </button>
          </div>
        )}
      </div>

      {/* Longevity Categories Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-deep-slate tracking-tight">
              {language === 'tr' ? 'Longevity Kategorileri' : 'Longevity Categories'}
            </h2>
            <p className="text-sm text-brand-deep-slate/58 max-w-2xl mt-1">
              {language === 'tr'
                ? 'Kişiselleştirilmiş longevity rotalarının arkasındaki bilimi, ritüelleri ve destinasyonları keşfedin.'
                : 'Explore the science, rituals and destinations behind personalized longevity routes.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className="glass-surface hover:border-brand-med-teal/45 hover:shadow-lg p-4 rounded-[22px] flex flex-col items-center justify-between text-center min-h-[142px] transition-all cursor-pointer group"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105 bg-brand-olive-sage/70 text-brand-med-teal"
              >
                <CategoryIcon categoryKey={cat.key} />
              </div>
              <span className="font-sans font-extrabold text-xs text-brand-deep-slate leading-tight flex min-h-[34px] items-center justify-center">
                {categoryContent[cat.key]?.[language].title || translateCategory(cat.key, cat.label)}
              </span>
              <span className="text-[10px] text-brand-med-teal mt-3 font-black flex items-center gap-1.5 uppercase tracking-wide">
                {language === 'tr' ? 'Keşfet' : 'Explore'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured B2B Licensed Partners Grid / Real-time Search Results */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-2">
          <div>
            <div className="flex items-center gap-1.5 bg-brand-turquoise/14 text-brand-med-teal px-2.5 py-1 rounded w-fit text-[10px] font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{searchQuery ? (language === 'tr' ? 'Canlı keşif' : 'Live Discovery') : (language === 'tr' ? 'Doğrulanmış' : 'Verified Network')}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-brand-deep-slate tracking-tight font-sans">
              {searchQuery ? t('searchResults') : (language === 'tr' ? 'Öne Çıkan Longevity Yerleri' : 'Featured Longevity Places')}
            </h2>
            <p className="text-xs text-brand-deep-slate/50 font-serif">
              {searchQuery
                ? (language === 'tr' ? `"${searchQuery}" ile eşleşen ${displayPartners.length} yer listeleniyor.` : `Displaying ${displayPartners.length} places matching "${searchQuery}".`)
                : (language === 'tr' ? 'Sağlık hedefleriyle eşleşen doğrulanmış klinikler, inzivalar, termal destinasyonlar ve şifa deneyimleri.' : 'Verified clinics, retreats, thermal destinations and healing experiences matched to health goals.')}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => {
                onCategorySelect('all');
                onTabChange('map');
              }}
              className="text-xs font-bold text-brand-med-teal hover:text-brand-deep-slate flex items-center gap-1 cursor-pointer self-start"
            >
              <span>{language === 'tr' ? 'Tüm yerleri haritada gör' : 'View all places on map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {displayPartners.length === 0 ? (
          <div className="glass-surface-strong rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 bg-brand-turquoise/12 rounded-full flex items-center justify-center mx-auto text-brand-deep-slate">
              <Search className="w-6 h-6 text-brand-med-teal" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-brand-deep-slate text-base">{t('noHubsFound')}</h3>
              <p className="text-xs text-brand-deep-slate/60 font-serif leading-relaxed">
                {t('noHubsFoundDesc')}
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4.5 py-2.5 bg-brand-deep-slate hover:bg-brand-med-teal text-brand-soft-ivory font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {t('resetSearch')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPartners.map((p) => {
              const isFav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="glass-surface rounded-3xl hover:border-brand-med-teal/45 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Photo Header */}
                  <div className="relative h-48 bg-brand-warm-sand overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={translatePartner(p.id, 'name', p.name)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute top-3 left-3 bg-brand-deep-slate text-brand-soft-ivory text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm bg-opacity-90">
                      {formatPartnerLocation(p)}
                    </div>
                    
                    {/* Favorite Toggle button */}
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      aria-label={
                        isFav
                          ? language === 'tr' ? 'Favorilerden çıkar' : 'Remove from favorites'
                          : language === 'tr' ? 'Favorilere ekle' : 'Add to favorites'
                      }
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/85 hover:bg-white text-brand-deep-slate transition-colors shadow-sm cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Content body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-brand-med-teal bg-brand-turquoise/12 px-2 py-0.5 rounded">
                          {translateCategory(p.category, p.categoryLabel)}
                        </span>
                        <div className="flex items-center gap-1 bg-brand-warm-sand/25 px-2 py-0.5 rounded-lg border border-brand-warm-sand/40">
                          <Star className="w-3 h-3 text-brand-highlight-lime fill-brand-highlight-lime" />
                          <span className="text-xs font-bold text-brand-deep-slate">{p.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-brand-deep-slate tracking-tight leading-normal font-sans group-hover:text-brand-med-teal transition-colors">
                        {translatePartner(p.id, 'name', p.name)}
                      </h3>

                      <p className="text-xs text-brand-deep-slate/75 line-clamp-3 leading-relaxed font-serif">
                        {translatePartner(p.id, 'description', p.description)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {translatePartner(p.id, 'specialty', p.specialty)
                          .split(/[,&]/)
                          .slice(0, 3)
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span key={`${p.id}-${tag}`} className="rounded-full bg-brand-olive-sage/55 px-2 py-1 text-[9px] font-bold text-brand-deep-slate/75">
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Pricing action footer */}
                    <div className="border-t border-brand-warm-sand/20 mt-4 pt-4 flex items-center justify-between gap-2">
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-brand-deep-slate/40 uppercase block font-semibold">
                          {language === 'tr' ? 'Sağlık odağı' : 'Health focus'}
                        </span>
                        <span className="text-xs font-bold text-[#042f2c] font-mono block truncate">
                          {translatePartner(p.id, 'specialty', p.specialty)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewOnMap(p.id)}
                        className="px-4 py-2 font-semibold text-xs rounded-xl bg-brand-copper text-white hover:bg-brand-med-teal transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>{language === 'tr' ? 'Rota Ekle' : 'Add to Route'}</span>
                        <MapPin className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive Brand Footer with Blog and Events */}
      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />

    </div>
  );
}

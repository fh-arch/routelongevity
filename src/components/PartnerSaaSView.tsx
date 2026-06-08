import React, { useState } from 'react';
import { PARTNERS_DATA } from '../data';
import { Partner, LicenseType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building, ShieldCheck, DollarSign, TrendingUp, Eye, 
  MousePointerClick, PhoneCall, CheckCircle2, Award, LogIn, UserPlus, ClipboardCheck, Mail, Lock, BriefcaseBusiness
} from 'lucide-react';
import Footer from './Footer';
import { AuthMode, AuthRole, AuthSession } from './AuthModal';
import { submitListingApplication } from '../api';

interface PartnerSaaSViewProps {
  onOpenBlog: () => void;
  onOpenEvents: () => void;
  onOpenAuth: (role: AuthRole, mode: AuthMode) => void;
  authSession: AuthSession | null;
}

export default function PartnerSaaSView({ onOpenBlog, onOpenEvents, onOpenAuth, authSession }: PartnerSaaSViewProps) {
  const { language, t, translatePartner } = useLanguage();
  
  // B2B state
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('p1'); // Default: Kirkpinar Thermal Spa (Premium)
  const currentPartner = PARTNERS_DATA.find(p => p.id === selectedPartnerId) || PARTNERS_DATA[0];
  const [tier, setTier] = useState<LicenseType>(currentPartner.licenseType);
  const [isChangingTier, setIsChangingTier] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [accessMode, setAccessMode] = useState<'user' | 'partner' | 'listing'>('listing');
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [listingError, setListingError] = useState('');
  const [isListingSubmitting, setIsListingSubmitting] = useState(false);
  const [listingForm, setListingForm] = useState({
    venueName: '',
    email: '',
    categoryId: '',
  });

  const handleTierChange = (newTier: LicenseType) => {
    setIsChangingTier(true);
    setTimeout(() => {
      setTier(newTier);
      setIsChangingTier(false);
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 3000);
    }, 1200);
  };

  // Helper to draw modern SVG chart paths dynamically based on dataset
  const generateChartPath = (data: number[]) => {
    if (data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const height = 120;
    const width = 500;
    const stepX = width / (data.length - 1);
    
    const points = data.map((val, idx) => {
      const x = idx * stepX;
      // normalize y
      const y = height - ((val - min) / (max - min)) * (height - 20) - 10;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const trendMonths = language === 'tr' 
    ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'] 
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const handleListingApplication = async () => {
    setListingError('');
    if (!listingForm.venueName.trim() || !listingForm.email.trim() || !listingForm.categoryId) {
      setListingError(language === 'tr' ? 'Lütfen tesis adı, e-posta ve kategori girin.' : 'Please enter venue name, email, and category.');
      return;
    }

    try {
      setIsListingSubmitting(true);
      await submitListingApplication({
        venueName: listingForm.venueName,
        email: listingForm.email,
        categoryId: listingForm.categoryId,
        message: authSession ? `Submitted from signed-in account: ${authSession.email}` : 'Submitted from public B2B portal.',
      });
      setListingSubmitted(true);
      setListingForm({ venueName: '', email: '', categoryId: '' });
    } catch (error) {
      setListingError(error instanceof Error ? error.message : 'Application could not be saved.');
    } finally {
      setIsListingSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF8] p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Upper Mode Details */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-brand-warm-sand/50 shadow-sm gap-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-[#122328]" />
          <span className="font-bold text-xs text-brand-deep-slate uppercase tracking-wider">
            {language === 'tr' ? 'B2B Ortak Yönetim Portalı' : 'B2B Provider Management Portal'}
          </span>
        </div>

        <div className="text-right text-[11px] text-brand-deep-slate/40 font-semibold font-mono hidden md:block">
          {language === 'tr' ? 'GÜVENLİ ŞİFRELİ SAĞLIK ARAYÜZÜ • SEKTÖREL VERİ SETİ' : 'SECURE ENCRYPTED INTERFACE • TÜRKIYE TOURISM REVENUE CORE'}
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6">
          <section className="bg-brand-deep-slate text-white rounded-3xl p-6 shadow-sm">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-turquoise bg-brand-turquoise/10 px-2.5 py-1 rounded">
              {language === 'tr' ? 'Hesap ve Listeleme' : 'Access & Listing'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-normal mt-3">
              {language === 'tr' ? 'Rotanıza katılacak doğru kitleye ulaşın' : 'Reach the right audience for your longevity destination'}
            </h2>
            <p className="text-sm text-white/70 leading-6 mt-3 max-w-2xl">
              {language === 'tr'
                ? 'Gezginler favori rotalarını kaydeder. İş ortakları profil, analiz ve başvuru süreçlerini yönetir. Yeni tesisler için doğrulama başvurusu buradan başlar.'
                : 'Travelers save routes. Partners manage profiles, analytics, and verification. New venues can start a listing application from the same portal.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[
                { key: 'user' as const, icon: UserPlus, title: language === 'tr' ? 'Gezgin Hesabı' : 'Traveler Account', desc: language === 'tr' ? 'Favoriler ve kayıtlı rotalar' : 'Favorites and saved routes' },
                { key: 'partner' as const, icon: LogIn, title: language === 'tr' ? 'Ortak Girişi' : 'Partner Login', desc: language === 'tr' ? 'Profil ve performans paneli' : 'Profile and performance panel' },
                { key: 'listing' as const, icon: ClipboardCheck, title: language === 'tr' ? 'Listelenmek İstiyorum' : 'Apply to Be Listed', desc: language === 'tr' ? 'Doğrulama başvurusu' : 'Verification application' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setAccessMode(item.key)}
                    className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                      accessMode === item.key
                        ? 'bg-white text-brand-deep-slate border-white'
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-3 ${accessMode === item.key ? 'text-brand-med-teal' : 'text-brand-turquoise'}`} />
                    <div className="text-sm font-extrabold">{item.title}</div>
                    <div className={`text-[11px] leading-4 mt-1 ${accessMode === item.key ? 'text-brand-deep-slate/60' : 'text-white/55'}`}>{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-brand-warm-sand/45 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              {accessMode === 'listing' ? <BriefcaseBusiness className="w-5 h-5 text-brand-copper" /> : <Lock className="w-5 h-5 text-brand-med-teal" />}
              <h3 className="text-base font-extrabold text-brand-deep-slate">
                {accessMode === 'user'
                  ? (language === 'tr' ? 'Gezgin girişi' : 'Traveler login')
                  : accessMode === 'partner'
                    ? (language === 'tr' ? 'İş ortağı girişi' : 'Partner login')
                    : (language === 'tr' ? 'Listeleme başvurusu' : 'Listing application')}
              </h3>
            </div>
            <div className="space-y-3">
              {accessMode === 'listing' && (
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'Tesis veya marka adı' : 'Venue or brand name'}
                  value={listingForm.venueName}
                  onChange={(event) => setListingForm((prev) => ({ ...prev, venueName: event.target.value }))}
                  className="w-full text-sm p-3 bg-[#FAFAF8] border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                />
              )}
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-deep-slate/35 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder={language === 'tr' ? 'E-posta adresi' : 'Email address'}
                  value={accessMode === 'listing' ? listingForm.email : undefined}
                  onChange={accessMode === 'listing' ? ((event) => setListingForm((prev) => ({ ...prev, email: event.target.value }))) : undefined}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-[#FAFAF8] border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                />
              </div>
              {accessMode !== 'listing' ? (
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-deep-slate/35 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder={language === 'tr' ? 'Şifre' : 'Password'}
                    className="w-full text-sm pl-10 pr-3 py-3 bg-[#FAFAF8] border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                  />
                </div>
              ) : (
                <select
                  value={listingForm.categoryId}
                  onChange={(event) => setListingForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                  className="w-full text-sm p-3 bg-[#FAFAF8] border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                >
                  <option value="">{language === 'tr' ? 'Kategori seçin' : 'Select category'}</option>
                  <option value="thermal-spa">{language === 'tr' ? 'Kaplıca ve spa' : 'Thermal & spa'}</option>
                  <option value="longevity-clinics">{language === 'tr' ? 'Uzun ömür kliniği' : 'Longevity clinic'}</option>
                  <option value="local-producers">{language === 'tr' ? 'Yerel üretici' : 'Local producer'}</option>
                  <option value="retreat-nature">{language === 'tr' ? 'İnziva ve doğa' : 'Retreat & nature'}</option>
                  <option value="hammams">{language === 'tr' ? 'Hamam' : 'Hammam'}</option>
                  <option value="traditional-med">{language === 'tr' ? 'Geleneksel tıp' : 'Traditional medicine'}</option>
                </select>
              )}
              {listingError && accessMode === 'listing' && (
                <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {listingError}
                </div>
              )}
              <button
                onClick={() => {
                  if (accessMode === 'user') {
                    onOpenAuth('user', 'signin');
                  } else if (accessMode === 'partner') {
                    onOpenAuth('partner', 'signin');
                  } else {
                    handleListingApplication();
                  }
                }}
                disabled={isListingSubmitting}
                className={`w-full py-3 rounded-xl text-white font-extrabold text-sm transition-colors cursor-pointer ${
                  listingSubmitted && accessMode === 'listing'
                    ? 'bg-[#A6D26A]'
                    : 'bg-brand-deep-slate hover:bg-brand-med-teal'
                }`}
              >
                {listingSubmitted && accessMode === 'listing'
                  ? (language === 'tr' ? 'Başvuru alındı' : 'Application Started')
                  : accessMode === 'listing'
                  ? isListingSubmitting
                    ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                    : (language === 'tr' ? 'Başvuruyu Başlat' : 'Start Application')
                  : (language === 'tr' ? 'Giriş Yap' : 'Login')}
              </button>
              {accessMode !== 'listing' && (
                <button
                  onClick={() => onOpenAuth(accessMode === 'user' ? 'user' : 'partner', 'signup')}
                  className="w-full py-2.5 rounded-xl border border-brand-warm-sand hover:border-brand-med-teal text-brand-deep-slate font-bold text-xs transition-colors cursor-pointer"
                >
                  {accessMode === 'user'
                    ? (language === 'tr' ? 'Yeni gezgin hesabı oluştur' : 'Create new traveler account')
                    : (language === 'tr' ? 'Yeni iş ortağı hesabı oluştur' : 'Create new partner account')}
                </button>
              )}
              {authSession && (
                <div className="rounded-xl bg-[#A6D26A]/10 border border-[#A6D26A]/25 px-3 py-2 text-xs">
                  <span className="text-brand-deep-slate/55 font-semibold">
                    {language === 'tr' ? 'Aktif demo oturum:' : 'Active demo session:'}
                  </span>
                  <span className="text-brand-deep-slate font-black ml-1">
                    {authSession.email}
                  </span>
                </div>
              )}
              <p className="text-[11px] text-brand-deep-slate/50 leading-5">
                {accessMode === 'listing'
                  ? (language === 'tr' ? 'Başvuru sonrası doğrulama ekibi lisans, konum, kategori ve bilimsel uygunluk bilgilerini kontrol eder.' : 'After submission, the verification team reviews license, location, category, and evidence-fit details.')
                  : (language === 'tr' ? 'Gerçek kimlik doğrulama API ve veritabanına bağlıdır.' : 'Authentication is connected to the API and database.')}
              </p>
            </div>
          </section>
        </div>

        {/* Top Panel Banner */}
        <div className="bg-white rounded-3xl border border-brand-warm-sand/40 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-copper bg-brand-copper/10 px-2.5 py-1 rounded">
              {language === 'tr' ? 'B2B LİSANS SİSTEMİ' : 'B2B LICENSING MODEL'}
            </span>
            <h2 className="text-2xl font-black text-brand-deep-slate tracking-tight font-sans">
              {t('saasConsole')}
            </h2>
            <p className="text-xs text-brand-deep-slate/60 max-w-xl font-serif">
              {language === 'tr' 
                ? 'Ziyaretçilerin haritada edindiği görüntülenmeleri, doğrudan web yönlendirmelerini ve telefon çağrı istatistiklerini analiz etmek için tescilli şifa ortağınızı seçip SaaS abonelik seviyelerini dinamik olarak yönetin.' 
                : 'Select from listing partners to analyze impressions, direct web actions, and lead generation analytics. Manage license subscriptions dynamically.'}
            </p>
          </div>

          {/* Selector of Turkey Listing Businesses */}
          <div className="shrink-0 space-y-1.5 min-w-[240px]">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-deep-slate/40 block">
              {language === 'tr' ? 'Sağlık Markasını Seçin' : 'Select Wellness Brand'}
            </span>
            <select
              value={selectedPartnerId}
              onChange={(e) => {
                setSelectedPartnerId(e.target.value);
                const partner = PARTNERS_DATA.find(p => p.id === e.target.value);
                if (partner) setTier(partner.licenseType);
              }}
              className="w-full text-xs font-bold bg-[#FAFAF8] border border-brand-warm-sand rounded-xl px-3 py-2.5 text-brand-deep-slate focus:outline-none cursor-pointer"
            >
              {PARTNERS_DATA.map(p => (
                <option key={p.id} value={p.id}>
                  {translatePartner(p.id, 'name', p.name)} ({translatePartner(p.id, 'city', p.city)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live Analytics Statistics (Impressions, Clicks, Leads) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Three Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Impressions (Views) */}
              <div className="bg-white border border-brand-warm-sand/40 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-deep-slate/50 uppercase">{t('viewsMetric')}</span>
                  <div className="p-2 bg-brand-turquoise/10 text-brand-med-teal rounded-lg">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2.5xl font-black text-brand-deep-slate tracking-tight">
                    {tier === 'Premium' ? Math.round(currentPartner.analytics.views * 1.5).toLocaleString() : currentPartner.analytics.views.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +18.4% MoM
                    </span>
                    <span className="text-[10px] text-brand-deep-slate/40 font-mono">{language === 'tr' ? 'Organik' : 'Organic'}</span>
                  </div>
                </div>
              </div>

              {/* Map Clicks */}
              <div className="bg-white border border-[#E5EDE1]/50 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-deep-slate/50 uppercase">{t('clicksMetric')}</span>
                  <div className="p-2 bg-brand-copper/10 text-brand-copper rounded-lg">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2.5xl font-black text-brand-deep-slate tracking-tight">
                    {tier === 'Premium' ? Math.round(currentPartner.analytics.clicks * 1.5).toLocaleString() : currentPartner.analytics.clicks.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +14.2% MoM
                    </span>
                    <span className="text-[10px] text-brand-deep-slate/40 font-mono">2.8% CTR</span>
                  </div>
                </div>
              </div>

              {/* Direct Leads Generated */}
              <div className="bg-white border border-[#E5EDE1]/50 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-deep-slate/50 uppercase">{t('leadsMetric')}</span>
                  <div className="p-2 bg-[#A6D26A]/15 text-[#A6D26A] rounded-lg">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2.5xl font-black text-brand-deep-slate tracking-tight">
                    {tier === 'Premium' ? Math.round(currentPartner.analytics.leadsGenerated * 1.5).toLocaleString() : currentPartner.analytics.leadsGenerated.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +22.9% MoM
                    </span>
                    <span className="text-[10px] text-brand-deep-slate/40 font-mono">{language === 'tr' ? 'Çağrı/E-posta' : 'Phone/Email'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Traffic Trends SVG Chart (fully responsive) */}
            <div className="bg-white border border-[#E5EDE1]/45 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h3 className="text-sm font-bold text-brand-deep-slate uppercase tracking-wider">
                    {language === 'tr' ? 'Kullanıcı Erişim Büyüme Grafiği' : 'Discovery Traffic Growth Trend'}
                  </h3>
                  <p className="text-xs text-brand-deep-slate/50 font-serif">
                    {language === 'tr' ? 'Son 6 aya ait harita üzeri toplam görüntülenme istatistiği' : 'Historical map display views across past 6 months'}
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-deep-slate bg-[#FAFAF8] border border-brand-warm-sand px-3 py-1 rounded-lg flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-turquoise" />
                  <span>{language === 'tr' ? '6 Aylık Özet' : '6-Month Summary'}</span>
                </span>
              </div>

              {/* SVG Graph rendering */}
              <div className="relative pt-4 pl-4 pr-4">
                <svg className="w-full h-32 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="500" y2="10" stroke="#FAFAF8" strokeWidth="1" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#FAFAF8" strokeWidth="1" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#FAFAF8" strokeWidth="1" />

                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#64D2A2" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#64D2A2" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Polygon path representation */}
                  <path
                    d={`${generateChartPath(currentPartner.analytics.monthlyTrafficTrend)} L 500,120 L 0,120 Z`}
                    fill="url(#chartGrad)"
                  />

                  {/* Line Path */}
                  <path
                    d={generateChartPath(currentPartner.analytics.monthlyTrafficTrend)}
                    fill="none"
                    stroke="#64D2A2"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Dots on points */}
                  {currentPartner.analytics.monthlyTrafficTrend.map((val, idx) => {
                    const max = Math.max(...currentPartner.analytics.monthlyTrafficTrend);
                    const min = Math.min(...currentPartner.analytics.monthlyTrafficTrend);
                    const x = idx * (500 / 5);
                    const y = 120 - ((val - min) / (max - min)) * (120 - 20) - 10;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="5" fill="#122328" stroke="#FAFAF8" strokeWidth="1.5" />
                        <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#122328" fontFamily="monospace">
                          {tier === 'Premium' ? Math.round(val * 1.5) : val}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Chart X axis text */}
                <div className="flex justify-between items-center text-[10px] text-brand-deep-slate/40 font-mono mt-3.5 pt-1 border-t border-[#FAFAF8]">
                  {trendMonths.map(month => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* License Level Configuration Sidebar */}
          <div className="space-y-6">
            
            <div className="bg-white border-2 border-brand-warm-sand/60 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
              
              {paymentSuccess && (
                <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-base font-bold text-brand-deep-slate">
                    {language === 'tr' ? 'SaaS Lisansı Güncellendi!' : 'SaaS License Updated!'}
                  </h3>
                  <p className="text-xs text-brand-deep-slate/60 leading-relaxed mt-1 font-serif">
                    {language === 'tr' 
                      ? 'Sağlık lisans seviyesi güncellemesi başarıyla simüle edildi. Harita görünümü şifa odağınızı öne çıkardı.' 
                      : 'Your business license tier upgrade was simulated successfully. The global map has prioritized your search weight.'}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-1.5 pb-2 border-b border-[#FAFAF8]">
                  <Award className="w-5 h-5 text-brand-copper" />
                  <span className="text-xs font-extrabold text-brand-deep-slate uppercase tracking-wider">
                    {language === 'tr' ? 'Dinamik Lisans Portalı' : 'Dynamic License Portal'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-brand-deep-slate/40 font-bold uppercase block">{language === 'tr' ? 'Mevcut Seviye' : 'Current Tier Level'}</span>
                  {tier === 'Premium' ? (
                    <div className="p-3 bg-brand-copper/10 text-brand-copper border border-brand-copper/30 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs uppercase">{language === 'tr' ? 'PREMIUM LİSANS' : 'PREMIUM FEATURED PLACEMENT'}</span>
                        <span className="text-[9px] font-mono bg-white text-brand-copper px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                          {language === 'tr' ? 'Aktif' : 'Active'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#FF6B4A]/80 mt-1.5 leading-relaxed font-serif">
                        {language === 'tr' 
                          ? 'Markanız, harita üzerinde yayılan dalga animasyonlu özel pin yerleşimi ve aramalarda üstün öncelik ile öne çıkar.'
                          : 'Your business stands out globally with a custom glowing map pin, top search rating priority, and direct phone link.'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs uppercase">{language === 'tr' ? 'STANDART LİSANS' : 'STANDARD PIN LEVEL'}</span>
                        <span className="text-[9px] font-mono bg-white text-zinc-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                          {language === 'tr' ? 'Aktif' : 'Active'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed font-serif">
                        {language === 'tr' 
                          ? 'Standart harita pini. Karşılık gelen kategori aramalarında harita üzerinde listelenir.' 
                          : 'Standard map pin. Listed dynamically under its corresponding category selection.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-brand-deep-slate/40 font-bold uppercase block">{language === 'tr' ? 'Yıllık Lisanslama Ücreti' : 'Annual Licensing Fee'}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-brand-deep-slate tracking-tight font-sans">
                      ${tier === 'Premium' ? '4,500' : '1,200'}
                    </span>
                    <span className="text-xs font-semibold text-brand-deep-slate/45">{language === 'tr' ? '/ yıl USD' : '/ yr USD'}</span>
                  </div>
                  <p className="text-[10px] text-brand-deep-slate/40 italic font-serif">
                    {language === 'tr' ? 'KDV dahildir. Türkiye turizm kalkınma fonuna yıllık otomatik faturalandırılır.' : 'Tax included. Billed annually into Türkiye tourism co-op account.'}
                  </p>
                </div>

                {/* Toggle controls to choose billing tier */}
                <div className="space-y-2 border-t border-brand-warm-sand/30 pt-4">
                  <span className="text-[10px] text-brand-deep-slate/40 font-bold uppercase block">
                    {language === 'tr' ? 'Konumlandırma seviyesini değiştir' : 'Change placement license tier'}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTierChange('Standard')}
                      disabled={isChangingTier || tier === 'Standard'}
                      className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                        tier === 'Standard'
                          ? 'bg-zinc-100 border-zinc-200 text-zinc-400'
                          : 'bg-white border-brand-warm-sand hover:bg-[#FAFAF8] text-brand-deep-slate'
                      }`}
                    >
                      {language === 'tr' ? 'Standart ($1.200)' : 'Standard ($1,200)'}
                    </button>
                    
                    <button
                      onClick={() => handleTierChange('Premium')}
                      disabled={isChangingTier || tier === 'Premium'}
                      className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                        tier === 'Premium'
                          ? 'bg-brand-copper/15 border-brand-copper/25 text-brand-copper'
                          : 'bg-brand-copper text-brand-soft-ivory border-brand-copper hover:bg-brand-deep-slate'
                      }`}
                    >
                      {language === 'tr' ? 'Seçkin ($4.500)' : 'Premium ($4,500)'}
                    </button>
                  </div>

                  <p className="text-[9px] text-brand-deep-slate/50 leading-relaxed font-serif italic mt-1.5 block">
                    {language === 'tr' 
                      ? 'Premium rütbesine geçmek, Avrupa arama kümelerinde görünürlüğünüzü %110 oranında artırır ve şifalı kaplıcanızı doğrudan bölgesel rotalara entegre eder!' 
                      : 'Upgrading to Premium Featured instantly unlocks 110% higher visibility across European search clusters and lists your thermal pool directly onto curated regional experiences!'}
                  </p>
                </div>

              </div>

              <div className="mt-8 border-t border-brand-warm-sand/20 pt-4 text-[10px] text-brand-deep-slate/45 space-y-1">
                <div className="flex justify-between font-mono">
                  <span>SaaS License ID:</span>
                  <span>LIC-TR-B2B-1094</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Renewal Date:</span>
                  <span>March 14, 2027</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Responsive Brand Footer with Blog and Events */}
      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />

    </div>
  );
}

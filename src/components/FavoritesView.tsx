import React, { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Partner, RouteJourney } from '../types';
import { PARTNERS_DATA, WELLNESS_JOURNEYS } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Star, MapPin, MessageSquarePlus, ArrowRight, Map, Clock } from 'lucide-react';
import Footer from './Footer';
import { getExperiences } from '../api';
import OutcomeForm from './AgentChat/OutcomeForm';

interface FavoritesViewProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  savedRouteIds: string[];
  toggleSavedRoute: (id: string) => void;
  onTabChange: (tab: any) => void;
  onFocusPartner: (partnerId: string) => void;
  onSelectRoute: (partnerIds: string[], title: string) => void;
  onOpenBlog: () => void;
  onOpenEvents: () => void;
}

export default function FavoritesView({
  favorites,
  toggleFavorite,
  savedRouteIds,
  toggleSavedRoute,
  onTabChange,
  onFocusPartner,
  onSelectRoute,
  onOpenBlog,
  onOpenEvents
}: FavoritesViewProps) {
  const { language, t, translateCategory, translatePartner, translateJourney } = useLanguage();
  const [databaseJourneys, setDatabaseJourneys] = useState<RouteJourney[] | null>(null);
  const [outcomeTarget, setOutcomeTarget] = useState<{ id?: string; externalId?: string; name: string } | null>(null);
  const journeys = databaseJourneys?.length ? databaseJourneys : WELLNESS_JOURNEYS;

  React.useEffect(() => {
    getExperiences()
      .then(({ journeys: loadedJourneys }) => setDatabaseJourneys(loadedJourneys))
      .catch((error) => {
        console.warn('Could not load database experiences for favorites.', error);
        setDatabaseJourneys(null);
      });
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites.map(String).filter(Boolean)), [favorites]);
  const savedRouteSet = useMemo(() => new Set(savedRouteIds.map(String).filter(Boolean)), [savedRouteIds]);
  const savedPartners = PARTNERS_DATA.filter((partner) => favoriteSet.has(partner.id));
  const unresolvedFavoriteIds = favorites
    .map(String)
    .filter(Boolean)
    .filter((id) => !PARTNERS_DATA.some((partner) => partner.id === id));
  const savedJourneys = journeys.filter((journey) => savedRouteSet.has(journey.id));
  const savedItemCount = favorites.length + savedRouteIds.length;
  const hasSavedPlaces = savedPartners.length > 0 || unresolvedFavoriteIds.length > 0;
  const hasSavedRoutes = savedJourneys.length > 0;

  const handleShowOnMap = (partnerId: string) => {
    onFocusPartner(partnerId);
    onTabChange('map');
  };

  const handleStartRoute = (journey: RouteJourney) => {
    const localizedTitle = translateJourney(journey.id, journey.title);
    onSelectRoute(journey.partnerIds, localizedTitle);
    onTabChange('map');
  };

  const renderEmptyState = () => (
    <div className="bg-white border border-brand-warm-sand/40 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-5 shadow-sm">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <Heart className="w-8 h-8 text-red-500 fill-red-50/20" strokeWidth={1} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-brand-deep-slate">
          {language === 'tr' ? 'Henüz Kayıtlı Öğe Yok' : 'No Saved Items Yet'}
        </h3>
        <p className="text-sm text-brand-deep-slate/60 leading-relaxed font-serif">
          {language === 'tr'
            ? 'Doğrulanmış yerleri veya rotaları kaydederek kişisel longevity listenizi oluşturmaya başlayın.'
            : 'Save verified places or routes to build your personal longevity list.'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={() => onTabChange('map')}
          className="px-6 py-2.5 bg-brand-deep-slate text-brand-soft-ivory hover:bg-[#086058] font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm shadow-brand-deep-slate/10 select-none"
        >
          <span>{language === 'tr' ? 'Haritayı Keşfet' : 'Explore Map'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onTabChange('experiences')}
          className="px-6 py-2.5 border border-brand-warm-sand/60 bg-white text-brand-deep-slate hover:bg-brand-turquoise/10 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 select-none"
        >
          <span>{language === 'tr' ? 'Rotaları Gör' : 'View Routes'}</span>
          <Map className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  const renderPartnerCard = (partner: Partner) => (
    <div
      key={partner.id}
      className="bg-white rounded-2xl border border-brand-warm-sand/40 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group animate-in fade-in duration-300"
    >
      <div>
        <div className="relative h-44 bg-brand-warm-sand leading-none">
          <img
            src={partner.imageUrl}
            alt={translatePartner(partner.id, 'name', partner.name)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-500"
          />
          <button
            onClick={() => toggleFavorite(partner.id)}
            aria-label={language === 'tr' ? 'Favorilerden çıkar' : 'Remove from favorites'}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm cursor-pointer"
          >
            <Heart className="w-4.5 h-4.5 fill-red-500 text-red-500" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[10px] uppercase font-bold text-brand-med-teal bg-brand-turquoise/10 px-2 py-0.5 rounded-full mt-0.5">
              {translateCategory(partner.category, partner.categoryLabel)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-brand-copper fill-brand-copper" />
              <span className="font-bold text-brand-deep-slate">{partner.rating}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-brand-deep-slate font-sans leading-tight">
            {translatePartner(partner.id, 'name', partner.name)}
          </h3>
          <p className="text-xs text-brand-deep-slate/50 pl-1 border-l border-brand-warm-sand">
            {translatePartner(partner.id, 'city', partner.city)}
          </p>
          <p className="text-xs text-brand-deep-slate/75 line-clamp-2 leading-relaxed font-serif">
            {translatePartner(partner.id, 'description', partner.description)}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 flex flex-col gap-2">
        <button
          onClick={() => handleShowOnMap(partner.id)}
          className="w-full py-2 bg-brand-deep-slate hover:bg-brand-turquoise hover:text-brand-deep-slate font-bold text-xs rounded-xl text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
        >
          <span>{t('viewOnMap')}</span>
          <MapPin className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setOutcomeTarget({ id: partner.id, name: translatePartner(partner.id, 'name', partner.name) })}
          className="w-full py-2 border border-brand-warm-sand/60 bg-white/70 hover:bg-brand-turquoise/10 hover:border-brand-med-teal/40 font-bold text-xs rounded-xl text-brand-deep-slate/70 hover:text-brand-deep-slate transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>{language === 'tr' ? 'Nasıldı?' : 'How was it?'}</span>
        </button>
      </div>
    </div>
  );

  const renderUnresolvedFavorite = (id: string) => (
    <div
      key={id}
      className="bg-white rounded-2xl border border-amber-200 overflow-hidden flex flex-col justify-between shadow-sm animate-in fade-in duration-300"
    >
      <div className="p-5 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h3 className="text-base font-bold text-brand-deep-slate font-sans leading-tight">
            {language === 'tr' ? 'Kayıtlı yer senkronize ediliyor' : 'Saved place is syncing'}
          </h3>
          <p className="mt-2 text-xs text-brand-deep-slate/60 leading-relaxed font-serif">
            {language === 'tr'
              ? 'Bu favori veritabanında kayıtlı ancak mevcut katalogda eşleşen kart bulunamadı. İsterseniz kaldırıp yeniden kaydedebilirsiniz.'
              : 'This favorite exists in the database, but its listing card is not in the current catalog. You can remove it and save it again.'}
          </p>
          <p className="mt-3 rounded-lg bg-[#f6fbf9] px-3 py-2 text-[10px] font-mono text-brand-deep-slate/55 break-all">
            {id}
          </p>
        </div>
      </div>
      <div className="p-5 pt-0">
        <button
          onClick={() => toggleFavorite(id)}
          className="w-full py-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 font-bold text-xs rounded-xl text-amber-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>{language === 'tr' ? 'Bu kaydı kaldır' : 'Remove this saved record'}</span>
        </button>
      </div>
    </div>
  );

  const renderJourneyCard = (journey: RouteJourney) => {
    const participants = journey.partnerIds
      .map((id) => PARTNERS_DATA.find((partner) => partner.id === id))
      .filter(Boolean);
    const localizedDuration = journey.duration.replace('Days', t('daysLabel') || 'Days');
    const localizedCities = journey.cities.map((city) => {
      const partner = PARTNERS_DATA.find((item) => item.city === city);
      return partner ? translatePartner(partner.id, 'city', city) : city;
    }).join(' -> ');

    return (
      <div
        key={journey.id}
        className="bg-white rounded-3xl border border-brand-warm-sand/40 p-6 md:p-8 flex flex-col lg:flex-row gap-8 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in"
      >
        <div className="w-full lg:w-80 h-48 lg:h-56 rounded-2xl overflow-hidden shrink-0 relative bg-brand-warm-sand">
          <img
            src={journey.imageUrl}
            alt={translateJourney(journey.id, journey.title)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-brand-deep-slate text-brand-soft-ivory text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{localizedDuration}</span>
          </div>
          <button
            onClick={() => toggleSavedRoute(journey.id)}
            aria-label={language === 'tr' ? 'Rotayı favorilerden çıkar' : 'Remove route from favorites'}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white text-red-500 shadow-sm cursor-pointer z-10 transition-transform duration-300 active:scale-95"
            title={language === 'tr' ? 'Listeden Kaldır' : 'Remove Route'}
          >
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {journey.tags.map((tag) => (
                <span key={tag} className="text-[9px] uppercase font-bold text-brand-copper bg-[#f6fbf9] border border-brand-warm-sand/30 px-2 py-0.5 rounded-full">
                  {language === 'tr'
                    ? (tag === 'Medical Cellular' ? 'Tıbbi Hücresel' : tag === 'Circadian Reset' ? 'Sirkadiyen Ayar' : tag === 'Epigenetic Diet' ? 'Epigenetik Beslenme' : tag === 'Hydrotherapy' ? 'Hidroterapi' : tag === 'Thermal Detox' ? 'Termal Toksin Arınma' : tag)
                    : tag}
                </span>
              ))}
            </div>

            <h3 className="text-lg md:text-xl font-bold text-brand-deep-slate leading-tight tracking-tight font-sans">
              {translateJourney(journey.id, journey.title)}
            </h3>
            <p className="text-[10px] text-brand-deep-slate/50 font-bold uppercase tracking-wider pl-1.5 border-l-2 border-brand-turquoise">
              {language === 'tr' ? 'ROTA:' : 'ROUTE:'} {localizedCities}
            </p>
            <p className="text-xs text-brand-deep-slate/75 leading-relaxed font-serif">
              {translateJourney(journey.id, journey.description)}
            </p>
          </div>

          <div className="border-t border-brand-warm-sand/20 pt-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <span className="text-[9px] font-mono text-brand-deep-slate/40 uppercase tracking-widest bg-zinc-50 border border-zinc-100 rounded-md px-2 py-0.5">
              {participants.length} {language === 'tr' ? 'Durak' : 'Stops'}
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => toggleSavedRoute(journey.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100/50 cursor-pointer transition-colors"
              >
                {language === 'tr' ? 'Kaldır' : 'Remove'}
              </button>
              <button
                onClick={() => handleStartRoute(journey)}
                className="px-5 py-2 rounded-xl bg-brand-deep-slate text-brand-soft-ivory hover:bg-brand-turquoise hover:text-brand-deep-slate font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
              >
                <span>{t('selectJourneyPath')}</span>
                <Map className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6fbf9] p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-warm-sand/20 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#042f2c] tracking-tight font-sans">
            {t('favoritesTitle')}
          </h1>
          <p className="text-sm text-brand-deep-slate/60 font-serif mt-1">
            {language === 'tr'
              ? 'Kaydettiğiniz merkezler ve rotalar tek kişisel listenizde görünür.'
              : 'Saved places and routes appear together in one personal list.'}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-warm-sand/40 bg-white/80 px-4 py-2 text-xs font-black text-brand-deep-slate shadow-sm">
          {language === 'tr' ? `${savedItemCount} kayıtlı öğe` : `${savedItemCount} saved items`}
        </div>
      </div>

      {!hasSavedPlaces && !hasSavedRoutes ? (
        renderEmptyState()
      ) : (
        <>
          {hasSavedPlaces && (
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-brand-deep-slate">
                  {language === 'tr' ? 'Kayıtlı Merkezler' : 'Saved Places'}
                </h2>
                <p className="mt-1 text-xs text-brand-deep-slate/55">
                  {language === 'tr'
                    ? 'Haritada veya keşif sayfasında kalp simgesiyle kaydettiğiniz yerler.'
                    : 'Places saved with the heart icon from Explore or Map.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPartners.map(renderPartnerCard)}
                {unresolvedFavoriteIds.map(renderUnresolvedFavorite)}
              </div>
            </section>
          )}

          {hasSavedRoutes && (
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-brand-deep-slate">
                  {language === 'tr' ? 'Kayıtlı Rotalar' : 'Saved Routes'}
                </h2>
                <p className="mt-1 text-xs text-brand-deep-slate/55">
                  {language === 'tr'
                    ? 'Deneyimler bölümünden kaydettiğiniz çok duraklı rotalar.'
                    : 'Multi-stop routes saved from the Experiences section.'}
                </p>
              </div>
              <div className="space-y-6">
                {savedJourneys.map(renderJourneyCard)}
              </div>
            </section>
          )}
        </>
      )}

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />

      <AnimatePresence>
        {outcomeTarget && (
          <OutcomeForm
            listing={outcomeTarget}
            onClose={() => setOutcomeTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

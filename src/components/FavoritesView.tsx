import React, { useState } from 'react';
import { Partner, RouteJourney } from '../types';
import { PARTNERS_DATA, WELLNESS_JOURNEYS } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Star, MapPin, Search, ArrowRight, Map, Clock, Activity } from 'lucide-react';
import Footer from './Footer';

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
  const [activeSubTab, setActiveSubTab] = useState<'hubs' | 'routes'>('hubs');

  // Find matching saved partners & wellness routes
  const savedPartners = PARTNERS_DATA.filter((p) => favorites.includes(p.id));
  const savedJourneys = WELLNESS_JOURNEYS.filter((j) => savedRouteIds.includes(j.id));

  const handleShowOnMap = (partnerId: string) => {
    onFocusPartner(partnerId);
    onTabChange('map');
  };

  const handleStartRoute = (journey: RouteJourney) => {
    const localizedTitle = translateJourney(journey.id, journey.title);
    onSelectRoute(journey.partnerIds, localizedTitle);
    onTabChange('map');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-warm-sand/20 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F2B2D] tracking-tight font-sans">
            {t('favoritesTitle')}
          </h1>
          <p className="text-sm text-brand-deep-slate/60 font-serif mt-1">
            {language === 'tr' 
              ? 'Tescil ettiğiniz kaplıca klinikleri ve kayıtlı bütünsel şifa rotalarınızı buradan yönetin' 
              : 'Review and manage your bookmarked ancient thermal centers and holistic wellness routes.'}
          </p>
        </div>

        {/* Tab Selection Filter */}
        <div className="flex bg-white/80 border border-brand-warm-sand/40 p-1 rounded-2xl shadow-sm self-stretch md:self-auto">
          <button
            onClick={() => setActiveSubTab('hubs')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'hubs'
                ? 'bg-brand-deep-slate text-brand-soft-ivory shadow-sm'
                : 'text-brand-deep-slate/60 hover:text-brand-deep-slate hover:bg-brand-warm-sand/20'
            }`}
          >
            {language === 'tr' ? `Şifa Merkezleri (${savedPartners.length})` : `Healing Hubs (${savedPartners.length})`}
          </button>
          
          <button
            onClick={() => setActiveSubTab('routes')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'routes'
                ? 'bg-brand-deep-slate text-brand-soft-ivory shadow-sm'
                : 'text-brand-deep-slate/60 hover:text-brand-deep-slate hover:bg-brand-warm-sand/20'
            }`}
          >
            {language === 'tr' ? `Wellness Rotaları (${savedJourneys.length})` : `Wellness Routes (${savedJourneys.length})`}
          </button>
        </div>
      </div>

      {activeSubTab === 'hubs' ? (
        /* Saved Healing Hubs Grid Section */
        savedPartners.length === 0 ? (
          <div className="bg-white border border-brand-warm-sand/40 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8 text-red-500 fill-red-50/20" strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-brand-deep-slate">
                {t('noFavorites') || 'No Saved Hubs Yet'}
              </h3>
              <p className="text-sm text-brand-deep-slate/60 leading-relaxed font-serif">
                {t('saveHubsPrompt') || 'Save hubs from the map and list to see them here.'}
              </p>
            </div>
            <button
              onClick={() => onTabChange('map')}
              className="px-6 py-2.5 bg-brand-deep-slate text-brand-soft-ivory hover:bg-[#0E6F6D] font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm shadow-brand-deep-slate/10 select-none"
            >
              <span>{language === 'tr' ? 'Keşif Haritasını Başlat' : 'Launch Discovery Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPartners.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-brand-warm-sand/40 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group animate-in fade-in duration-300"
              >
                <div>
                  <div className="relative h-44 bg-brand-warm-sand leading-none">
                    <img
                      src={p.imageUrl}
                      alt={translatePartner(p.id, 'name', p.name)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-500"
                    />
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-sm cursor-pointer"
                    >
                      <Heart className="w-4.5 h-4.5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase font-bold text-brand-med-teal bg-brand-turquoise/10 px-2 py-0.5 rounded-full mt-0.5">
                        {translateCategory(p.category, p.categoryLabel)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-copper fill-brand-copper" />
                        <span className="font-bold text-brand-deep-slate">{p.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-brand-deep-slate font-sans leading-tight">
                      {translatePartner(p.id, 'name', p.name)}
                    </h3>
                    <p className="text-xs text-brand-deep-slate/50 pl-1 border-l border-brand-warm-sand">
                      {translatePartner(p.id, 'city', p.city)}
                    </p>
                    <p className="text-xs text-brand-deep-slate/75 line-clamp-2 leading-relaxed font-serif">
                      {translatePartner(p.id, 'description', p.description)}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleShowOnMap(p.id)}
                    className="w-full py-2 bg-brand-deep-slate hover:bg-brand-turquoise hover:text-brand-deep-slate font-bold text-xs rounded-xl text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
                  >
                    <span>{t('viewOnMap')}</span>
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Saved Multi-Stop Journeys Section */
        savedJourneys.length === 0 ? (
          <div className="bg-white border border-brand-warm-sand/40 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8 text-red-500 fill-red-50/20" strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-brand-deep-slate">
                {language === 'tr' ? 'Henüz Kayıtlı Rota Yok' : 'No Saved Routes Yet'}
              </h3>
              <p className="text-sm text-brand-deep-slate/60 leading-relaxed font-serif">
                {language === 'tr' 
                  ? 'Keşfettiğiniz şifa rotalarını saklamak için Experiences sayfasındaki "Rotayı Kaydet" butonuna tıklayın.' 
                  : 'Bookmarks click "Save Route" on the Experiences tab and track them in your favorites dashboard.'}
              </p>
            </div>
            <button
              onClick={() => onTabChange('experiences')}
              className="px-6 py-2.5 bg-brand-deep-slate text-brand-soft-ivory hover:bg-[#0E6F6D] font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm shadow-brand-deep-slate/10 select-none animate-bounce"
            >
              <span>{language === 'tr' ? 'Şifa Rotalarını Keşfet' : 'Browse Wellness Routes'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedJourneys.map((journey) => {
              const participants = journey.partnerIds
                .map(id => PARTNERS_DATA.find(p => p.id === id))
                .filter(Boolean);

              const localizedDuration = journey.duration.replace("Days", t('daysLabel') || "Days");
              
              const localizedCities = journey.cities.map(city => {
                const partner = PARTNERS_DATA.find(p => p.city === city);
                return partner ? translatePartner(partner.id, 'city', city) : city;
              }).join(' ➔ ');

              return (
                <div
                  key={journey.id}
                  className="bg-white rounded-3xl border border-brand-warm-sand/40 p-6 md:p-8 flex flex-col lg:flex-row gap-8 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in"
                >
                  {/* Image side */}
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
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white text-red-500 shadow-sm cursor-pointer z-10 transition-transform duration-300 active:scale-95"
                      title={language === 'tr' ? 'Listeden Kaldır' : 'Remove Route'}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Descriptions */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {journey.tags.map((tag) => (
                          <span key={tag} className="text-[9px] uppercase font-bold text-brand-copper bg-[#FAF7F2] border border-brand-warm-sand/30 px-2 py-0.5 rounded-full">
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
                        {language === 'tr' ? 'ROTASI:' : 'TRACK:'} {localizedCities}
                      </p>

                      <p className="text-xs text-brand-deep-slate/75 leading-relaxed font-serif">
                        {translateJourney(journey.id, journey.description)}
                      </p>
                    </div>

                    {/* Staging actions */}
                    <div className="border-t border-brand-warm-sand/20 pt-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-brand-deep-slate/40 uppercase tracking-widest bg-zinc-50 border border-zinc-100 rounded-md px-2 py-0.5">
                          {participants.length} {language === 'tr' ? 'Şifa Durağı' : 'Healing Hubs'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                        <button
                          onClick={() => toggleSavedRoute(journey.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100/50 cursor-pointer transition-colors"
                        >
                          {language === 'tr' ? 'Favorilerden Kaldır' : 'Remove Route'}
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
            })}
          </div>
        )
      )}

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />

    </div>
  );
}

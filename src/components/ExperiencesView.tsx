import React from 'react';
import { WELLNESS_JOURNEYS, PARTNERS_DATA } from '../data';
import { RouteJourney } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Map, Clock, MapPin, ArrowRight, Compass, Activity, Star, Heart } from 'lucide-react';
import Footer from './Footer';
import { getExperiences } from '../api';

interface ExperiencesViewProps {
  onTabChange: (tab: any) => void;
  onSelectRoute: (partnerIds: string[], title: string) => void;
  onOpenBlog: () => void;
  onOpenEvents: () => void;
  savedRouteIds?: string[];
  toggleSavedRoute?: (id: string) => void;
}

export default function ExperiencesView({ 
  onTabChange, 
  onSelectRoute,
  onOpenBlog,
  onOpenEvents,
  savedRouteIds = [],
  toggleSavedRoute
}: ExperiencesViewProps) {
  const { language, t, translatePartner, translateJourney } = useLanguage();
  const [databaseJourneys, setDatabaseJourneys] = React.useState<RouteJourney[] | null>(null);
  const journeys = databaseJourneys?.length ? databaseJourneys : WELLNESS_JOURNEYS;

  React.useEffect(() => {
    getExperiences()
      .then(({ journeys: loadedJourneys }) => setDatabaseJourneys(loadedJourneys))
      .catch((error) => {
        console.warn('Could not load database experiences.', error);
        setDatabaseJourneys(null);
      });
  }, []);
  
  const handleStartRoute = (journey: RouteJourney) => {
    // Pass translated title to trigger the map panel active banner correctly
    const localizedTitle = translateJourney(journey.id, journey.title);
    onSelectRoute(journey.partnerIds, localizedTitle);
    onTabChange('map');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6fbf9] p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 bg-brand-turquoise/15 text-brand-med-teal px-2.5 py-1 rounded w-fit text-[10px] font-bold uppercase mb-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>{language === 'tr' ? 'Zengin Polifenol ve Kaplıca Rotaları' : 'Polyphenol-rich & Thermal tracks'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#042f2c] tracking-tight">
          {t('experiencesTitle')}
        </h1>
        <p className="text-sm text-brand-deep-slate/60 max-w-2xl font-serif">
          {t('experiencesSubtitle')}
        </p>
      </div>

      {/* Journeys List */}
      <div className="space-y-6">
        {journeys.map((journey) => {
          // Gather partners for metadata
          const participants = journey.partnerIds
            .map(id => PARTNERS_DATA.find(p => p.id === id))
            .filter(Boolean);

          // Localize duration: e.g. "7 Days" -> "7 Gün"
          const localizedDuration = journey.duration.replace("Days", t('daysLabel') || "Days");

          // Localize list of cities in the path
          const localizedCities = journey.cities.map(city => {
            const partner = PARTNERS_DATA.find(p => p.city === city);
            return partner ? translatePartner(partner.id, 'city', city) : city;
          }).join(' ➔ ');

          return (
            <div
              key={journey.id}
              className="bg-white rounded-3xl border border-brand-warm-sand/40 p-6 md:p-8 flex flex-col lg:flex-row gap-8 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Route Thumbnail image */}
              <div className="w-full lg:w-96 h-56 lg:h-64 rounded-2xl overflow-hidden shrink-0 relative bg-brand-warm-sand">
                <img
                  src={journey.imageUrl}
                  alt={translateJourney(journey.id, journey.title)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-brand-deep-slate text-brand-soft-ivory text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{localizedDuration}</span>
                </div>
              </div>

              {/* Route breakdown details */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {journey.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold text-brand-copper bg-[#f6fbf9] border border-brand-warm-sand/50 px-2.5 py-0.5 rounded-full">
                        {language === 'tr' 
                          ? (tag === 'Medical Cellular' ? 'Tıbbi Hücresel' : tag === 'Circadian Reset' ? 'Sirkadiyen Ayar' : tag === 'Epigenetic Diet' ? 'Epigenetik Beslenme' : tag === 'Hydrotherapy' ? 'Hidroterapi' : tag === 'Thermal Detox' ? 'Termal Toksin Arınma' : tag)
                          : tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl md:text-2xl font-extrabold text-brand-deep-slate leading-tight tracking-tight font-sans">
                    {translateJourney(journey.id, journey.title)}
                  </h2>

                  <p className="text-xs text-brand-deep-slate/50 font-semibold uppercase tracking-wider pl-1.5 border-l-2 border-brand-turquoise">
                    {language === 'tr' ? 'GÜZERGAH ROTASI:' : 'ROUTE TRACK:'} {localizedCities}
                  </p>

                  <p className="text-sm text-brand-deep-slate/75 leading-relaxed font-serif">
                    {translateJourney(journey.id, journey.description)}
                  </p>
                </div>

                {/* Listing of stops in route */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-brand-deep-slate/40 tracking-wider">
                    {language === 'tr' ? `Yol Durakları ve Sağlık Odakları (${participants.length})` : `Journey Stops & Healing Places (${participants.length})`}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {participants.map((p: any) => (
                      <div
                        key={p.id}
                        className="bg-[#f6fbf9] hover:bg-brand-warm-sand/20 border border-brand-warm-sand/40 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-brand-med-teal shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-brand-deep-slate truncate max-w-[140px] leading-tight">
                            {translatePartner(p.id, 'name', p.name)}
                          </p>
                          <p className="text-[9px] text-brand-deep-slate/50 leading-none mt-0.5">
                            {translatePartner(p.id, 'city', p.city)} • <Star className="w-2.5 h-2.5 text-brand-copper fill-brand-copper inline text-brand-copper" /> {p.rating}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Active Trigger */}
                <div className="border-t border-brand-warm-sand/20 pt-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                  <div className="text-xs text-brand-deep-slate/50 font-medium font-serif flex-1">
                    {language === 'tr' ? 'Aktivasyon tıklandığında Türkiye topografyası üzerinde kesikli GPS rota bağlantı hatlarını anime eder.' : "Draws animated, uniform-velocity dotted GPS route connections across Türkiye's topography on click."}
                  </div>
                  
                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
                    {toggleSavedRoute && (
                      <button
                        onClick={() => toggleSavedRoute(journey.id)}
                        className={`px-4.5 py-2.5 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                          savedRouteIds.includes(journey.id)
                            ? 'bg-red-50/85 border-red-200 text-red-600 hover:bg-red-100/70'
                            : 'bg-white border-brand-warm-sand/70 text-brand-deep-slate hover:bg-[#f6fbf9]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 transition-transform duration-300 hover:scale-110 ${savedRouteIds.includes(journey.id) ? 'fill-red-500 text-red-500' : 'text-brand-deep-slate/60'}`} />
                        <span>
                          {savedRouteIds.includes(journey.id)
                            ? (language === 'tr' ? 'Rotayı Kaydettin' : 'Saved Route')
                            : (language === 'tr' ? 'Rotayı Kaydet' : 'Save Route')
                          }
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => handleStartRoute(journey)}
                      className="px-6 py-2.5 rounded-xl bg-brand-deep-slate text-brand-soft-ivory hover:bg-brand-turquoise hover:text-brand-deep-slate font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-brand-deep-slate/10 select-none"
                    >
                      <span>{t('selectJourneyPath')}</span>
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />

    </div>
  );
}

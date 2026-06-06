import React, { useEffect, useRef, useState } from 'react';
import { Partner, Category } from '../types';
import { PARTNERS_DATA, CATEGORIES, TURKISH_CITIES } from '../data';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Star, Phone, Mail, Globe, Search, Filter, X, Heart, ShieldCheck, Compass } from 'lucide-react';

interface MapContainerProps {
  partners: Partner[];
  selectedCategory: string;
  onCategorySelect: (catKey: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  focusedPartnerId: string | null;
  setFocusedPartnerId: (id: string | null) => void;
  activeRoutePartnerIds: string[] | null;
  activeRouteTitle: string | null;
}

export default function MapContainer({
  partners,
  selectedCategory,
  onCategorySelect,
  favorites,
  toggleFavorite,
  focusedPartnerId,
  setFocusedPartnerId,
  activeRoutePartnerIds,
  activeRouteTitle
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const heatLayerRef = useRef<any>(null);
  
  const { language, t, translateCategory, translatePartner, translateJourney } = useLanguage();

  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [showMobileList, setShowMobileList] = useState(false);
  const [showDensityLayer, setShowDensityLayer] = useState(false);

  // Keep the list of all 81 cities sorted alphabetically based on active language
  const sortedCities = [...TURKISH_CITIES].sort((a, b) => {
    const nameA = language === 'tr' ? a.nameTr : a.nameEn;
    const nameB = language === 'tr' ? b.nameTr : b.nameEn;
    return nameA.localeCompare(nameB, language);
  });

  // Filter partners based on state (category + search + city) supporting dual language searching!
  const filteredPartners = partners.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    
    const nameTR = translatePartner(p.id, 'name', p.name).toLowerCase();
    const cityTR = translatePartner(p.id, 'city', p.city).toLowerCase();
    const specialtyTR = translatePartner(p.id, 'specialty', p.specialty).toLowerCase();
    const descTR = translatePartner(p.id, 'description', p.description).toLowerCase();
    const catLabelTR = translateCategory(p.category, p.categoryLabel).toLowerCase();

    const sq = searchQuery.toLowerCase().trim();
    const matchesSearch = !sq || 
                          p.name.toLowerCase().includes(sq) || 
                          nameTR.includes(sq) ||
                          p.specialty.toLowerCase().includes(sq) ||
                          specialtyTR.includes(sq) ||
                          p.description.toLowerCase().includes(sq) ||
                          descTR.includes(sq) ||
                          p.city.toLowerCase().includes(sq) ||
                          cityTR.includes(sq) ||
                          p.categoryLabel.toLowerCase().includes(sq) ||
                          catLabelTR.includes(sq);

    const matchesCity = cityFilter === '' || p.city === cityFilter;
    return matchesCategory && matchesSearch && matchesCity;
  });

  // Re-sort to put Premium licensing partners at top of side list (SaaS value!)
  const sortedSidePartners = [...filteredPartners].sort((a, b) => {
    if (a.licenseType === 'Premium' && b.licenseType !== 'Premium') return -1;
    if (a.licenseType !== 'Premium' && b.licenseType === 'Premium') return 1;
    return b.rating - a.rating;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    const L = (window as any).L;
    if (!L) {
      console.error("Leaflet is not loaded from CDN yet.");
      return;
    }

    // Centered specifically over Türkiye (Ankara/Central coordinate)
    const turkeyCenter = [38.9637, 35.2433];
    const map = L.map(mapRef.current, {
      center: turkeyCenter,
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: true,
      maxBounds: L.latLngBounds(L.latLng(35, 25), L.latLng(43, 45)),
      minZoom: 5,
    });

    // Elegant Light Canvas Layer: Voyager Map style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add custom zoom control at bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync / Draw Markers whenever filteredPartners changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    Object.keys(markersRef.current).forEach(id => {
      markersRef.current[id].remove();
    });
    markersRef.current = {};

    // Custom marker helper
    const createMarkerIcon = (categoryColor: string, isPremium: boolean) => {
      const ringColor = isPremium ? '#C08240' : '#FFFFFF';
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center transform hover:scale-115 transition-transform duration-200">
            ${isPremium ? `
              <span class="absolute inline-flex h-9 w-9 rounded-full bg-[#C08240] opacity-25 animate-pulse"></span>
            ` : ''}
            <!-- Inner Pin -->
            <div class="w-7 h-7 rounded-full border-2 shadow-md flex items-center justify-center relative z-10" style="border-color: ${ringColor}; background-color: #FAF7F2;">
              <div class="w-4.5 h-4.5 rounded-full flex items-center justify-center" style="background-color: ${categoryColor}">
                ${isPremium ? `
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#FAF7F2" stroke="#FAF7F2" stroke-width="1">
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
                  </svg>
                ` : `
                  <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                `}
              </div>
            </div>
            <!-- Pin Pointer -->
            <div class="w-0 h-0 border-l-[4.5px] border-l-transparent border-r-[4.5px] border-r-transparent border-t-[7px] -mt-[1px] absolute -bottom-[5px] z-0" style="border-t-color: ${ringColor};"></div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -32]
      });
    };

    // Add markers
    filteredPartners.forEach(partner => {
      const cat = CATEGORIES.find(c => c.key === partner.category);
      const color = cat?.color || '#0F2B2D';
      const isPremium = partner.licenseType === 'Premium';

      const marker = L.marker([partner.latitude, partner.longitude], {
        icon: createMarkerIcon(color, isPremium)
      }).addTo(map);

      // Setup click handler
      marker.on('click', () => {
        setSelectedPartner(partner);
        setFocusedPartnerId(partner.id);
        map.setView([partner.latitude, partner.longitude], 10, { animate: true, duration: 1 });
      });

      markersRef.current[partner.id] = marker;
    });

  }, [filteredPartners]);

  // Handle drawing Journey Route Polyline if list is provided with animation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // Clear old polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Cancel any ongoing drawing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (activeRoutePartnerIds && activeRoutePartnerIds.length > 1) {
      // Find matching partners
      const routePartners = activeRoutePartnerIds
        .map(id => PARTNERS_DATA.find(p => p.id === id))
        .filter((p): p is Partner => p !== undefined);

      if (routePartners.length > 0) {
        const coordinates = routePartners.map(p => [p.latitude, p.longitude] as [number, number]);
        
        // Fit map bounds to show the entire route cleanly first so the drawing is visible
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 });

        // Calculate segment metrics for uniform-speed drawing interpolation
        const segments: { p1: [number, number]; p2: [number, number]; len: number }[] = [];
        let totalLength = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
          const p1 = coordinates[i];
          const p2 = coordinates[i + 1];
          const dy = p2[0] - p1[0];
          const dx = p2[1] - p1[1];
          const len = Math.sqrt(dx * dx + dy * dy);
          segments.push({ p1, p2, len });
          totalLength += len;
        }

        // Initialize the Polyline starting with just the first coordinate element
        polylineRef.current = L.polyline([coordinates[0]], {
          color: '#C08240', // Copper Accent
          weight: 4.5,
          opacity: 0.9,
          dashArray: '8, 8', // elegant dotted line
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        if (totalLength === 0) {
          polylineRef.current.setLatLngs(coordinates);
          return;
        }

        const animationDuration = 1800; // 1.8 seconds total for clean visual path progression
        const animStartTime = performance.now();

        const animatePath = (currentTime: number) => {
          const elapsed = currentTime - animStartTime;
          let progress = elapsed / animationDuration;
          if (progress > 1) progress = 1;

          // Find current uniform coordinates list up to the progress point
          const targetDist = progress * totalLength;
          let accumulatedDist = 0;
          const animatedPoints: [number, number][] = [coordinates[0]];

          for (const seg of segments) {
            if (accumulatedDist + seg.len >= targetDist) {
              const segProgress = (targetDist - accumulatedDist) / seg.len;
              const interpolatedY = seg.p1[0] + segProgress * (seg.p2[0] - seg.p1[0]);
              const interpolatedX = seg.p1[1] + segProgress * (seg.p2[1] - seg.p1[1]);
              animatedPoints.push([interpolatedY, interpolatedX]);
              break;
            } else {
              animatedPoints.push(seg.p2);
              accumulatedDist += seg.len;
            }
          }

          if (polylineRef.current) {
            polylineRef.current.setLatLngs(animatedPoints);
          }

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animatePath);
          } else {
            animationFrameRef.current = null;
          }
        };

        animationFrameRef.current = requestAnimationFrame(animatePath);
      }
    }
  }, [activeRoutePartnerIds]);

  // Handle Heatmap Overlay Layer: Concentrated longevity hotspots
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    if (heatLayerRef.current) {
      heatLayerRef.current.remove();
      heatLayerRef.current = null;
    }

    if (showDensityLayer) {
      // Assemble heatmap coordinates weighted partially by premium rating structure
      const heatData = filteredPartners.map(p => [
        p.latitude,
        p.longitude,
        p.licenseType === 'Premium' ? 1.0 : 0.6 // weighted score
      ]);

      if ((L as any).heatLayer) {
        heatLayerRef.current = (L as any).heatLayer(heatData, {
          radius: 40,
          blur: 25,
          maxZoom: 9,
          gradient: {
            0.1: '#0E6F6D', // soft teal
            0.4: '#4FB8B1', // turquoise
            0.7: '#C08240', // warm copper
            1.0: '#A72B2B'  // dense volcanic red
          }
        }).addTo(map);
      } else {
        console.warn("Leaflet.heat plugin is missing from index.html.");
      }
    }

    return () => {
      if (heatLayerRef.current) {
        heatLayerRef.current.remove();
        heatLayerRef.current = null;
      }
    };
  }, [showDensityLayer, filteredPartners]);

  // Handle focusedPartner changes from other tabs
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    if (focusedPartnerId) {
      const partner = PARTNERS_DATA.find(p => p.id === focusedPartnerId);
      if (partner) {
        setSelectedPartner(partner);
        map.setView([partner.latitude, partner.longitude], 10, { animate: true, duration: 1 });
        
        const marker = markersRef.current[partner.id];
        if (marker && marker.bounce) {
          marker.bounce(1);
        }
      }
    }
  }, [focusedPartnerId]);

  const handlePartnerSelect = (partner: Partner) => {
    setSelectedPartner(partner);
    setFocusedPartnerId(partner.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([partner.latitude, partner.longitude], 10, { animate: true });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-0px)] w-full relative">
      {/* Search and Listing Left Panel */}
      <div className={`absolute md:relative inset-y-0 left-0 w-80 sm:w-96 bg-white border-r border-[#E6D9C2]/40 flex flex-col z-30 md:z-10 shrink-0 shadow-lg transition-transform duration-300 ${showMobileList ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Journey Active Banner */}
        {activeRoutePartnerIds && (
          <div className="bg-brand-copper/10 border-b border-brand-copper/30 px-4 py-2.5 flex items-center justify-between animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-copper animate-spin-slow" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-brand-copper leading-none">
                  {t('routeJourneyActive')}
                </p>
                <p className="text-xs font-semibold text-brand-deep-slate mt-0.5 truncate max-w-[210px]">
                  {translateJourney(activeRouteTitle || '', activeRouteTitle || '')}
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '#'} 
              className="text-brand-deep-slate/60 hover:text-brand-deep-slate text-[10px] underline font-mono cursor-pointer"
            >
              {language === 'tr' ? 'Sıfırla' : 'Reset'}
            </button>
          </div>
        )}

        {/* Filter & Search Header */}
        <div className="p-4 border-b border-brand-warm-sand/30 bg-[#FAF7F2]/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-deep-slate/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPlaceholderMap') || "Search wellness hubs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-sm rounded-xl border border-brand-warm-sand/70 focus:outline-none focus:border-[#0E6F6D]/50 transition-colors placeholder:text-brand-deep-slate/30"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deep-slate/40 hover:text-brand-deep-slate"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* City Selector */}
            <div className="flex-1 relative">
              <select
                value={cityFilter}
                onChange={(e) => {
                  const selectedCityId = e.target.value;
                  setCityFilter(selectedCityId);
                  if (selectedCityId) {
                    const cityObj = TURKISH_CITIES.find(c => c.id === selectedCityId);
                    if (cityObj && mapInstanceRef.current) {
                      mapInstanceRef.current.setView([cityObj.latitude, cityObj.longitude], 9, { animate: true });
                    }
                  } else {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([38.9637, 35.2433], 6, { animate: true });
                    }
                  }
                }}
                className="w-full text-xs bg-white border border-brand-warm-sand/70 rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none text-brand-deep-slate cursor-pointer"
              >
                <option value="">{t('allCities')}</option>
                {sortedCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {language === 'tr' ? city.nameTr : city.nameEn}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-brand-deep-slate/50">
                ▼
              </div>
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'all' || cityFilter !== '' || searchQuery !== '') && (
              <button
                onClick={() => {
                  onCategorySelect('all');
                  setCityFilter('');
                  setSearchQuery('');
                }}
                className="px-2.5 bg-brand-warm-sand/45 hover:bg-brand-warm-sand/70 text-brand-deep-slate text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                {t('cancel')}
              </button>
            )}
          </div>

          {/* Density Heatmap Toggle Switch */}
          <div className="pt-2 px-1 flex items-center justify-between border-t border-[#E6D9C2]/30">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${showDensityLayer ? 'bg-[#A72B2B]' : 'bg-[#0E6F6D]/40'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${showDensityLayer ? 'bg-[#A72B2B]' : 'bg-[#0E6F6D]/50'}`}></span>
              </span>
              <div>
                <p className="text-xs font-bold text-brand-deep-slate leading-none">{t('densityHeatmapLayer')}</p>
                <p className="text-[10px] text-brand-deep-slate/50 mt-0.5 font-serif select-none">{t('toggleHotspots')}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDensityLayer(!showDensityLayer)}
              aria-label="Toggle Density Heatmap Layer"
              className={`scale-90 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showDensityLayer ? 'bg-[#0E6F6D]' : 'bg-[#E6D9C2]/50'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  showDensityLayer ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Categories Chips Row */}
        <div className="border-b border-brand-warm-sand/20 py-2.5 px-4 overflow-x-auto flex gap-1.5 bg-white shrink-0 scrollbar-none">
          <button
            onClick={() => onCategorySelect('all')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand-deep-slate text-white'
                : 'bg-[#FAF7F2] text-brand-deep-slate/70 hover:bg-brand-warm-sand/30'
            }`}
          >
            {language === 'tr' ? `Tüm Kategoriler (${partners.length})` : `All Categories (${partners.length})`}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onCategorySelect(cat.key)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                selectedCategory === cat.key
                  ? 'bg-brand-deep-slate text-white border-brand-deep-slate'
                  : 'bg-white text-brand-deep-slate/70 border-brand-warm-sand/60 hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
              {translateCategory(cat.key, cat.label)}
            </button>
          ))}
        </div>

        {/* Side listings results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]/20">
          <div className="flex justify-between items-center text-xs text-brand-deep-slate/55 px-1">
            <span>
              {language === 'tr' ? `${sortedSidePartners.length} sonuç gösteriliyor` : `Showing ${sortedSidePartners.length} results`}
            </span>
            {cityFilter && (
              <span className="font-semibold text-[#0E6F6D]">
                {translatePartner(sortedSidePartners[0]?.id || '', 'city', cityFilter)}
              </span>
            )}
          </div>

          {sortedSidePartners.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3 animate-in fade-in duration-300">
              <MapPin className="w-8 h-8 text-brand-deep-slate/30 mx-auto" strokeWidth={1} />
              <p className="text-sm font-semibold text-brand-deep-slate/70">{t('noHubsMatchFilters')}</p>
              <p className="text-xs text-brand-deep-slate/50 leading-relaxed font-serif">
                {t('tryAdjustFilters')}
              </p>
            </div>
          ) : (
            sortedSidePartners.map((p) => {
              const isFav = favorites.includes(p.id);
              const isPremium = p.licenseType === 'Premium';
              const isSelected = selectedPartner?.id === p.id;
              
              return (
                <div
                  key={p.id}
                  onClick={() => handlePartnerSelect(p)}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-white border-brand-med-teal ring-2 ring-brand-med-teal/10 shadow-md'
                      : isPremium 
                        ? 'bg-white border-brand-copper/30 hover:border-brand-copper shadow-[0_2px_8px_rgba(192,130,64,0.06)]' 
                        : 'bg-white border-brand-warm-sand/40 hover:border-brand-warm-sand/85 shadow-sm'
                  }`}
                >
                  {/* Premium Badge Layer */}
                  {isPremium && (
                    <div className="absolute top-0.5 right-[4px] bg-brand-copper text-brand-soft-ivory text-[7px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider uppercase">
                      {language === 'tr' ? 'VERİ ANALİTİĞİ LİSANS' : 'FEATURED PLACEMENT'}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <img
                      src={p.imageUrl}
                      alt={translatePartner(p.id, 'name', p.name)}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-lg object-cover bg-brand-warm-sand shrink-0 border border-brand-warm-sand/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          p.category === 'thermal-spa' ? 'bg-brand-turquoise/15 text-brand-med-teal' :
                          p.category === 'hammams' ? 'bg-brand-deep-slate/5 text-brand-deep-slate' :
                          p.category === 'mediterranean-diet' ? 'bg-[#7A8F6A]/15 text-[#7A8F6A]' :
                          p.category === 'longevity-clinics' ? 'bg-brand-copper/15 text-brand-copper' :
                          p.category === 'retreat-nature' ? 'bg-brand-olive-sage/10 text-brand-olive-sage' :
                          'bg-zinc-100 text-zinc-900'
                        }`}>
                          {translateCategory(p.category, p.categoryLabel)}
                        </span>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 text-brand-copper fill-brand-copper" />
                          <span className="text-xs font-semibold text-brand-deep-slate">{p.rating}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-brand-deep-slate mt-1.5 leading-tight truncate">
                        {translatePartner(p.id, 'name', p.name)}
                      </h4>
                      <p className="text-xs text-brand-deep-slate/60 mt-0.5 truncate font-sans">
                        {translatePartner(p.id, 'city', p.city)}
                      </p>
                      
                      <p className="text-[10px] text-brand-deep-slate/50 mt-1 line-clamp-2">
                        {translatePartner(p.id, 'specialty', p.specialty)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="flex-1 h-full bg-[#FAF7F2] relative">
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Heatmap Legend */}
        {showDensityLayer && (
          <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E6D9C2]/60 p-4 shadow-xl max-w-[260px] sm:max-w-xs animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A72B2B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A72B2B]"></span>
              </span>
              <p className="text-[9px] uppercase tracking-widest font-extrabold text-brand-deep-slate font-sans">
                {t('concentrationIndex')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-[#0F2B2D]/40">{t('low')}</span>
              <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-[#0E6F6D] via-[#4FB8B1] via-[#C08240] to-[#A72B2B] shadow-inner" />
              <span className="text-[9px] font-mono text-[#A72B2B] font-bold">{t('dense')}</span>
            </div>
            <p className="text-[9px] text-brand-deep-slate/60 mt-2 leading-relaxed font-serif select-none">
              {t('visualizeZones')}
            </p>
          </div>
        )}

        {/* Floating Mobile Toggle Button */}
        <button
          onClick={() => setShowMobileList(!showMobileList)}
          className="md:hidden absolute bottom-24 right-4 z-20 bg-brand-deep-slate text-brand-soft-ivory p-3.5 rounded-full shadow-2xl border border-white/10 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#0F2B2D' }}
        >
          {showMobileList ? <X className="w-5 h-5 text-[#4FB8B1]" /> : <Filter className="w-5 h-5 text-[#4FB8B1]" />}
        </button>

        {/* Detail Float Card - Renders over map (soft depth shadows) */}
        {selectedPartner && (
          <div className="absolute bottom-24 left-4 right-4 md:bottom-auto md:top-4 md:right-4 z-10 w-auto md:w-96 bg-white rounded-2xl border border-brand-warm-sand/50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300">
            <div className="relative h-44">
              <img
                src={selectedPartner.imageUrl}
                alt={translatePartner(selectedPartner.id, 'name', selectedPartner.name)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-3 right-3 bg-[#FAF7F2] hover:bg-white text-brand-deep-slate p-1.5 rounded-full shadow-lg border border-brand-warm-sand/30 transition-all cursor-pointer z-20"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => toggleFavorite(selectedPartner.id)}
                className="absolute top-3 left-3 bg-[#FAF7F2] hover:bg-white text-brand-deep-slate p-2 rounded-full shadow-lg border border-brand-warm-sand/30 transition-all cursor-pointer z-20"
              >
                <Heart className={`w-4.5 h-4.5 transition-colors ${
                  favorites.includes(selectedPartner.id) ? 'text-red-500 fill-red-500' : 'text-brand-deep-slate/65'
                }`} />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[9px] font-extrabold tracking-wider bg-brand-med-teal text-brand-soft-ivory px-2 py-0.5 rounded-full uppercase">
                    {translateCategory(selectedPartner.category, selectedPartner.categoryLabel)}
                  </span>
                  <h3 className="text-white text-lg font-bold mt-1.5 leading-snug drop-shadow-sm font-sans">
                    {translatePartner(selectedPartner.id, 'name', selectedPartner.name)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3.5">
              <div className="flex justify-between items-center bg-[#FAF7F2] p-2.5 rounded-xl border border-brand-warm-sand/40">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-med-teal" />
                  <span className="text-xs font-semibold text-brand-deep-slate">
                    {translatePartner(selectedPartner.id, 'city', selectedPartner.city)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-brand-copper fill-brand-copper" />
                  <span className="text-xs font-bold text-brand-deep-slate">{selectedPartner.rating}</span>
                  <span className="text-[10px] text-brand-deep-slate/50">({selectedPartner.reviewCount} {language === 'tr' ? 'değerlendirme' : 'reviews'})</span>
                </div>
              </div>

              {selectedPartner.licenseType === 'Premium' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-copper/5 border border-brand-copper/25 text-brand-copper shadow-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    {language === 'tr' ? 'Doğrulanmış Lisanslı Sağlık Ortağı' : 'Verified Premium Wellness Partner'}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-brand-deep-slate/40 font-bold block">
                  {language === 'tr' ? 'Klinik Bilimsel Amacı' : 'Scientific Longevity Purpose'}
                </span>
                <p className="text-xs text-brand-deep-slate/85 font-medium leading-relaxed font-serif">
                  {translatePartner(selectedPartner.id, 'description', selectedPartner.description)}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-brand-warm-sand/30 pt-3.5 text-xs text-brand-deep-slate/75 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-brand-deep-slate/40 font-bold w-16">
                    {language === 'tr' ? 'UZMANLIK:' : 'SPECIALTY:'}
                  </span>
                  <span className="font-semibold text-brand-deep-slate">
                    {translatePartner(selectedPartner.id, 'specialty', selectedPartner.specialty)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-deep-slate/40" />
                  <span>{selectedPartner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-deep-slate/40" />
                  <span>{selectedPartner.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-brand-deep-slate/40" />
                  <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-brand-med-teal hover:underline font-medium">
                    {language === 'tr' ? 'Resmi Sayfayı Ziyaret Et' : 'Visit Official Site'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

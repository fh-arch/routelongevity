import React, { useState, useEffect } from 'react';
import ExploreView from './components/ExploreView';
import MapContainer from './components/MapContainer';
import ExperiencesView from './components/ExperiencesView';
import FavoritesView from './components/FavoritesView';
import PartnerSaaSView from './components/PartnerSaaSView';
import SplashScreen from './components/SplashScreen';
import BlogPage from './components/BlogPage';
import EventsPage from './components/EventsPage';
import AuthModal, { AuthMode, AuthRole, AuthSession } from './components/AuthModal';
import { PARTNERS_DATA } from './data';
import { ActiveTab } from './types';
import { useLanguage } from './context/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Compass, Map as MapIcon, Activity, Heart, User, BookOpen, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getCurrentUser, getFavorites, setFavoriteJourney, setFavoriteListing, signout } from './api';

export default function App() {
  const { t, language } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; role: AuthRole; mode: AuthMode }>({
    isOpen: false,
    role: 'user',
    mode: 'signin',
  });
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('route_longevity_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  // Blog and Events state
  const openBlog = () => {
    setActiveTab('blog');
  };

  const openEvents = () => {
    setActiveTab('events');
  };

  const openAuth = (role: AuthRole, mode: AuthMode) => {
    setAuthModal({ isOpen: true, role, mode });
  };

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => {
        localStorage.setItem('route_longevity_session_user', JSON.stringify(user));
        setAuthSession(user);
      })
      .catch(() => {
        localStorage.removeItem('route_longevity_session_user');
        setAuthSession(null);
      });
  }, []);

  const signOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.warn('Sign out request failed, clearing local session anyway.', error);
    }
    localStorage.removeItem('route_longevity_session_user');
    setAuthSession(null);
    if (activeTab === 'profile') {
      setActiveTab('explore');
    }
  };

  // Load and save favorites to localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('route_longevity_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('route_longevity_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!authSession) return;

    getFavorites()
      .then(({ listingIds, journeyIds }) => {
        setFavorites(listingIds);
        setSavedRouteIds(journeyIds);
        localStorage.setItem('route_longevity_favorites', JSON.stringify(listingIds));
        localStorage.setItem('route_longevity_saved_routes', JSON.stringify(journeyIds));
      })
      .catch((error) => {
        console.warn('Could not load account favorites.', error);
      });
  }, [authSession]);

  const toggleFavorite = async (id: string) => {
    const willSave = !favorites.includes(id);

    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );

    if (authSession) {
      try {
        await setFavoriteListing(id, willSave);
      } catch (error) {
        console.warn('Could not sync listing favorite.', error);
      }
    }
  };

  // Load and save favorite route/wellness journeys to localStorage
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('route_longevity_saved_routes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('route_longevity_saved_routes', JSON.stringify(savedRouteIds));
  }, [savedRouteIds]);

  const toggleSavedRoute = async (id: string) => {
    const willSave = !savedRouteIds.includes(id);

    setSavedRouteIds(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );

    if (authSession) {
      try {
        await setFavoriteJourney(id, willSave);
      } catch (error) {
        console.warn('Could not sync route favorite.', error);
      }
    }
  };

  // State to handle direct focus-out and auto-centering on map pins
  const [focusedPartnerId, setFocusedPartnerId] = useState<string | null>(null);

  // States to handle active route polylines
  const [activeRoutePartnerIds, setActiveRoutePartnerIds] = useState<string[] | null>(null);
  const [activeRouteTitle, setActiveRouteTitle] = useState<string | null>(null);

  const handleFocusPartner = (partnerId: string) => {
    setFocusedPartnerId(partnerId);
    // When focusing a partner, clear route filter to avoid overlapping views
    setActiveRoutePartnerIds(null);
    setActiveRouteTitle(null);
  };

  const handleSelectRoute = (partnerIds: string[], title: string) => {
    setActiveRoutePartnerIds(partnerIds);
    setActiveRouteTitle(title);
    // Clear individual partner focus when a multi-stop route is loaded
    setFocusedPartnerId(null);
  };

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    // Clear individual partner focus if category shifts
    setFocusedPartnerId(null);
  };

  const navItems = [
    { id: 'explore' as ActiveTab, label: t('explore'), icon: Compass },
    { id: 'map' as ActiveTab, label: t('map'), icon: MapIcon },
    { id: 'experiences' as ActiveTab, label: t('experiences'), icon: Activity },
    { id: 'favorites' as ActiveTab, label: t('favorites'), icon: Heart, badge: (favorites.length + savedRouteIds.length) > 0 ? (favorites.length + savedRouteIds.length) : undefined },
    ...(authSession ? [{
      id: 'profile' as ActiveTab,
      label: authSession.role === 'admin'
        ? 'Admin'
        : authSession.role === 'partner'
          ? (language === 'tr' ? 'Ortak Paneli' : 'Partner Hub')
          : (language === 'tr' ? 'Profil' : 'Profile'),
      icon: User,
    }] : []),
  ];

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className="flex flex-col h-screen bg-[#FAFAF8] overflow-hidden font-sans">
      
      {/* Mobile Top Header */}
      <header className="flex lg:hidden items-center justify-between gap-2 px-3 sm:px-5 py-3 sm:py-4 bg-white border-b border-[#E5EDE1]/45 shrink-0 z-40">
        <button
          onClick={() => setActiveTab('explore')}
          className="h-11 w-[126px] sm:h-12 sm:w-[154px] shrink-0 cursor-pointer rounded-xl border border-brand-warm-sand/80 bg-white px-2 py-1 sm:px-2.5 shadow-sm"
        >
          <img
            src="/route-longevity-logo.png"
            alt={t('routeLongevity')}
            className="h-full w-full object-contain scale-[1.08]"
          />
        </button>

        {/* Quick Gazette Dialog Actions & Switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <LanguageSwitcher />
          <button 
            onClick={openBlog}
            className="p-1.5 px-2 sm:px-3 rounded-xl text-[10px] font-bold text-white bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 transition-all flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('blog')}</span>
          </button>
          <button 
            onClick={openEvents}
            className="p-1.5 px-2 sm:px-3 rounded-xl text-[10px] font-bold text-[#FAFAF8] bg-[#5A9D62] hover:bg-[#5A9D62]/90 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('events')}</span>
          </button>
        </div>
      </header>

      <header className="hidden lg:flex items-center justify-between gap-5 px-7 py-4 bg-white/95 border-b border-brand-warm-sand/45 shrink-0 z-40 shadow-sm">
        <button
          onClick={() => setActiveTab('explore')}
          className="h-14 w-[230px] min-w-[230px] rounded-2xl border border-brand-warm-sand/80 bg-white px-3.5 py-1.5 text-left cursor-pointer shadow-sm shadow-brand-deep-slate/5"
        >
          <img
            src="/route-longevity-logo.png"
            alt={t('routeLongevity')}
            className="h-full w-full object-contain scale-[1.08]"
          />
        </button>

        <nav className="flex items-center justify-center gap-1 rounded-2xl bg-[#FAFAF8] border border-brand-warm-sand/55 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-deep-slate text-white shadow-sm'
                    : 'text-brand-deep-slate/62 hover:text-brand-deep-slate hover:bg-white/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-turquoise' : 'text-brand-deep-slate/40'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 bg-brand-copper text-white text-[9px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 min-w-[260px] justify-end">
          <button
            onClick={openBlog}
            className="px-3 py-2 rounded-xl text-xs font-bold text-brand-deep-slate hover:bg-brand-warm-sand/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-brand-copper" />
            <span>{t('blog')}</span>
          </button>
          <button
            onClick={openEvents}
            className="px-3 py-2 rounded-xl text-xs font-bold text-brand-deep-slate hover:bg-brand-warm-sand/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-brand-med-teal" />
            <span>{t('events')}</span>
          </button>
          {!authSession && (
            <button
              onClick={() => openAuth('user', 'signin')}
              className="px-3 py-2 rounded-xl text-xs font-bold text-brand-deep-slate/75 hover:text-brand-deep-slate hover:bg-brand-warm-sand/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{language === 'tr' ? 'Giriş' : 'Sign in'}</span>
            </button>
          )}
          <button
            onClick={() => {
              if (authSession) {
                setActiveTab('profile');
              } else {
                openAuth('partner', 'signin');
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-brand-turquoise/15 text-brand-med-teal hover:bg-brand-turquoise/25 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('b2bPartner')}</span>
          </button>
          {authSession && (
            <button
              onClick={signOut}
              className="px-3 py-2 rounded-xl text-xs font-bold text-brand-deep-slate/65 hover:text-brand-deep-slate hover:bg-brand-warm-sand/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'tr' ? 'Çıkış' : 'Sign out'}</span>
            </button>
          )}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <ExploreView 
                onTabChange={setActiveTab}
                onCategorySelect={handleCategorySelect}
                onFocusPartner={handleFocusPartner}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpenBlog={openBlog}
                onOpenEvents={openEvents}
                onOpenAuth={openAuth}
                authSession={authSession}
              />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <MapContainer 
                partners={PARTNERS_DATA}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                focusedPartnerId={focusedPartnerId}
                setFocusedPartnerId={setFocusedPartnerId}
                activeRoutePartnerIds={activeRoutePartnerIds}
                activeRouteTitle={activeRouteTitle}
              />
            </motion.div>
          )}

          {activeTab === 'experiences' && (
            <motion.div
              key="experiences"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <ExperiencesView 
                onTabChange={setActiveTab}
                onSelectRoute={handleSelectRoute}
                onOpenBlog={openBlog}
                onOpenEvents={openEvents}
                savedRouteIds={savedRouteIds}
                toggleSavedRoute={toggleSavedRoute}
              />
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <FavoritesView 
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                savedRouteIds={savedRouteIds}
                toggleSavedRoute={toggleSavedRoute}
                onTabChange={setActiveTab}
                onFocusPartner={handleFocusPartner}
                onSelectRoute={handleSelectRoute}
                onOpenBlog={openBlog}
                onOpenEvents={openEvents}
              />
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <BlogPage onOpenBlog={openBlog} onOpenEvents={openEvents} />
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <EventsPage onOpenBlog={openBlog} onOpenEvents={openEvents} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <PartnerSaaSView 
                onOpenBlog={openBlog}
                onOpenEvents={openEvents}
                onOpenAuth={openAuth}
                authSession={authSession}
                onTabChange={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="flex lg:hidden bg-white border-t border-[#E5EDE1]/45 py-2 px-1 items-center justify-around shrink-0 z-40 shadow-xl fixed bottom-0 left-0 right-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all relative cursor-pointer ${
                isActive ? 'text-[#5A9D62]' : 'text-[#122328]/55'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FF6B4A] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-sans font-bold mt-1 tracking-wider uppercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        initialRole={authModal.role}
        initialMode={authModal.mode}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={setAuthSession}
      />
    </>
  );
}

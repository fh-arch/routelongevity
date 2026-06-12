import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  translations, 
  categoryTranslations, 
  partnerTranslations, 
  journeyTranslations, 
  blogTranslations, 
  eventTranslations,
  TranslationSet 
} from '../utils/translations';

export type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof TranslationSet) => string;
  translateCategory: (categoryKey: string, fallback: string) => string;
  translatePartner: (
    partnerId: string, 
    field: 'name' | 'description' | 'specialty' | 'city', 
    fallback: string
  ) => string;
  translateJourney: (
    journeyId: string, 
    field: 'title' | 'subtitle' | 'description', 
    fallback: string
  ) => string;
  translateBlog: (
    blogId: string, 
    field: 'title' | 'subtitle' | 'category' | 'content', 
    fallback: string
  ) => string;
  translateEvent: (
    eventId: string, 
    field: 'title' | 'location' | 'description', 
    fallback: string
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('route_longevity_lang');
      if (saved === 'en' || saved === 'tr') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('route_longevity_lang', language);
    } catch (e) {
      // ignore
    }

    document.documentElement.lang = language === 'tr' ? 'tr' : 'en';
    document.documentElement.dir = 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'tr' : 'en'));
  };

  // Safe translation resolver
  const t = (key: keyof TranslationSet): string => {
    const currentSet = translations[language];
    return currentSet[key] !== undefined ? currentSet[key] : (translations['en'][key] || String(key));
  };

  // Safe Category Localizer
  const translateCategory = (categoryKey: string, fallback: string): string => {
    const currentCatSet = categoryTranslations[language];
    return currentCatSet[categoryKey] || fallback;
  };

  // Safe Partner Localizer
  const translatePartner = (
    partnerId: string, 
    field: 'name' | 'description' | 'specialty' | 'city', 
    fallback: string
  ): string => {
    const currentPartnerSet = partnerTranslations[language];
    if (currentPartnerSet && currentPartnerSet[partnerId] && currentPartnerSet[partnerId][field]) {
      return currentPartnerSet[partnerId][field];
    }
    return fallback;
  };

  // Safe Journey Localizer
  const translateJourney = (
    journeyId: string, 
    field: 'title' | 'subtitle' | 'description', 
    fallback: string
  ): string => {
    const currentJourneySet = journeyTranslations[language];
    if (currentJourneySet && currentJourneySet[journeyId] && currentJourneySet[journeyId][field]) {
      return currentJourneySet[journeyId][field];
    }
    return fallback;
  };

  // Safe Blog Localizer
  const translateBlog = (
    blogId: string, 
    field: 'title' | 'subtitle' | 'category' | 'content', 
    fallback: string
  ): string => {
    const currentBlogSet = blogTranslations[language];
    if (currentBlogSet && currentBlogSet[blogId] && currentBlogSet[blogId][field]) {
      return currentBlogSet[blogId][field];
    }
    return fallback;
  };

  // Safe Event Localizer
  const translateEvent = (
    eventId: string, 
    field: 'title' | 'location' | 'description', 
    fallback: string
  ): string => {
    const currentEventSet = eventTranslations[language];
    if (currentEventSet && currentEventSet[eventId] && currentEventSet[eventId][field]) {
      return currentEventSet[eventId][field];
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        toggleLanguage, 
        t, 
        translateCategory, 
        translatePartner, 
        translateJourney,
        translateBlog,
        translateEvent
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

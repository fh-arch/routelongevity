import React from 'react';
import { Compass, Map as MapIcon, Activity, Heart, User, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  favoritesCount: number;
}

export default function Sidebar({ activeTab, onTabChange, favoritesCount }: SidebarProps) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'explore' as ActiveTab, label: t('explore'), icon: Compass },
    { id: 'map' as ActiveTab, label: t('map'), icon: MapIcon },
    { id: 'experiences' as ActiveTab, label: t('experiences'), icon: Activity },
    { id: 'favorites' as ActiveTab, label: t('favorites'), icon: Heart, badge: favoritesCount > 0 ? favoritesCount : undefined },
    { id: 'profile' as ActiveTab, label: t('saasHub'), icon: User },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-brand-warm-sand/40 flex-col h-screen sticky top-0 z-20 shrink-0">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-brand-warm-sand/30 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-deep-slate flex items-center justify-center shadow-md shadow-brand-deep-slate/10 shrink-0">
              {/* Minimalist leaf pin SVG logo */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FAFAF8" />
                <path d="M12 6.5C13 5.5 14.5 5 16 5.5" stroke="#64D2A2" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="font-sans font-extrabold text-[#122328] tracking-tight text-lg block leading-tight">
                ROUTE
              </span>
              <span className="font-sans font-medium text-[#A6D26A] text-xs tracking-[0.2em] block uppercase -mt-0.5">
                Longevity
              </span>
            </div>
        </div>
        <p className="text-[10px] text-brand-deep-slate/50 font-serif italic mt-2">
          {t('mappingHeading')}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-left cursor-pointer group ${
                isActive
                  ? 'bg-brand-deep-slate text-brand-soft-ivory shadow-md shadow-brand-deep-slate/10'
                  : 'text-brand-deep-slate/70 hover:bg-brand-warm-sand/20 hover:text-brand-deep-slate'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? 'text-brand-turquoise' : 'text-brand-deep-slate/40 group-hover:text-brand-deep-slate/70'
                }`} />
                <span className="font-sans font-medium text-sm tracking-wide">
                  {item.label}
                </span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-sm ${
                  isActive 
                    ? 'bg-brand-turquoise text-brand-deep-slate' 
                    : 'bg-brand-deep-slate text-brand-soft-ivory'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* B2B Promo Banner in Sidebar */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-tr from-[#FAFAF8] to-white border border-brand-warm-sand/50 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1 bg-brand-turquoise/10 text-brand-med-teal w-fit px-1.5 py-0.5 rounded text-[9px] font-bold">
          <ShieldCheck className="w-3" />
          <span>{t('b2bPartner')}</span>
        </div>
        <p className="text-xs font-semibold text-brand-deep-slate mb-1">
          {t('wellnessProviderQ')}
        </p>
        <p className="text-[10px] text-brand-deep-slate/60 mb-2 leading-relaxed">
          {t('unlockPremium')}
        </p>
        <button
          onClick={() => onTabChange('profile')}
          className="w-full py-1.5 rounded-lg bg-brand-med-teal hover:bg-brand-deep-slate text-white text-[11px] font-medium transition-colors cursor-pointer"
        >
          {t('saasConsole')}
        </button>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-brand-warm-sand/30 text-center text-[10px] text-brand-deep-slate/40 font-mono">
        {t('version')}
      </div>
    </aside>
  );
}

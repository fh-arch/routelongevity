import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'tr' as const, label: 'Türkçe', flag: '🇹🇷' }
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-warm-sand/55 hover:border-brand-deep-slate/30 text-xs font-bold text-brand-deep-slate bg-white shadow-sm hover:bg-brand-warm-sand/10 transition-all cursor-pointer"
        id="language-switcher-btn"
      >
        <Globe className="w-3.5 h-3.5 text-[#007c73]" />
        <span className="font-sans font-extrabold tracking-wide text-brand-deep-slate select-none">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown 
          className={`w-3 h-3 text-brand-deep-slate/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl border border-[#dcede9]/60 shadow-xl p-1 font-sans text-xs flex flex-col gap-0.5 overflow-hidden"
            id="language-switcher-dropdown"
          >
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#062c2b] text-[#f7fbf9]'
                      : 'text-[#062c2b] hover:bg-[#dcede9]/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span className="font-sans font-extrabold">{lang.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2bc0a6]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Compass, Loader2, RotateCcw, Route, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAgent } from '../../context/AgentContext';
import { useLanguage } from '../../context/LanguageContext';
import HealthWizard from './HealthWizard';
import RouteCard from './RouteCard';

interface AgentChatProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onViewSuggestion: (externalId: string, allIds: string[]) => void;
}

export default function AgentChat({ favorites, toggleFavorite, onViewSuggestion }: AgentChatProps) {
  const { language } = useLanguage();
  const {
    messages,
    isOpen,
    isLoading,
    showWizard,
    suggestions,
    closeAgent,
    sendMessage,
    clearSession,
    saveProfile,
    dismissWizard,
  } = useAgent();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAgent();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAgent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isOpen]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput('');
    await sendMessage(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex justify-end bg-brand-deep-slate/42 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="flex h-full w-full max-w-xl flex-col border-l border-white/50 bg-brand-soft-ivory/86 shadow-2xl backdrop-blur-2xl"
          >
            <header className="border-b border-brand-warm-sand/60 bg-white/60 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-deep-slate text-brand-turquoise">
                    <Compass className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-med-teal">
                      {language === 'tr' ? 'Kişisel rota planlayıcı' : 'Personal route planner'}
                    </p>
                    <h2 className="text-lg font-black text-brand-deep-slate">
                      Route Longevity Planner
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearSession}
                    className="rounded-xl border border-brand-warm-sand/70 bg-white/70 p-2 text-brand-deep-slate/62 hover:text-brand-deep-slate"
                    aria-label={language === 'tr' ? 'Yeni rota' : 'New route'}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={closeAgent}
                    className="rounded-xl border border-brand-warm-sand/70 bg-white/70 p-2 text-brand-deep-slate/62 hover:text-brand-deep-slate"
                    aria-label={language === 'tr' ? 'Kapat' : 'Close'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {showWizard && messages.length === 0 ? (
                <HealthWizard onSave={saveProfile} onSkip={dismissWizard} />
              ) : messages.length === 0 ? (
                <div className="rounded-3xl border border-white/70 bg-white/60 p-5 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-turquoise/14 text-brand-med-teal">
                    <Route className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-3 text-xl font-black text-brand-deep-slate">
                    {language === 'tr' ? 'Rotanı birlikte oluşturalım' : "Let's build your route"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-brand-deep-slate/62">
                    {language === 'tr'
                      ? 'Sağlık hedefini, bütçeni veya bölge tercihini yaz. Ajan yalnızca gerçek Route Longevity kayıtlarından öneri verir.'
                      : 'Tell me your health goal, budget, or preferred region. The agent recommends only real Route Longevity listings.'}
                  </p>
                </div>
              ) : null}

              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-3xl px-4 py-3 shadow-sm ${
                      isUser
                        ? 'bg-brand-deep-slate text-white'
                        : 'border border-white/70 bg-white/72 text-brand-deep-slate'
                    }`}>
                      {message.type === 'loading' ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-brand-deep-slate/65">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {message.content}
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-line text-sm leading-6">{message.content}</p>
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                              {message.suggestions.map((suggestion) => {
                                const externalId = suggestion.externalId || suggestion.listingId;
                                const allIds = suggestions.map((s) => s.externalId || s.listingId).filter(Boolean);
                                return (
                                  <div key={`${message.id}-${externalId}`}>
                                    <RouteCard
                                      suggestion={suggestion}
                                      isFavorite={favorites.includes(externalId)}
                                      onFavorite={toggleFavorite}
                                      onViewMap={(id) => onViewSuggestion(id, allIds)}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={submit} className="border-t border-brand-warm-sand/60 bg-white/70 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 rounded-2xl border border-brand-warm-sand/70 bg-brand-soft-ivory px-3 py-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={language === 'tr' ? 'Devam sorusu yaz...' : 'Ask a follow-up...'}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-brand-deep-slate outline-none placeholder:text-brand-deep-slate/35"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-med-teal text-white transition-colors hover:bg-brand-deep-slate disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={language === 'tr' ? 'Gönder' : 'Send'}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

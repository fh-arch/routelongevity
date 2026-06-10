import React, { useMemo, useState } from 'react';
import { ArrowRight, MapPinned, Route } from 'lucide-react';
import { useAgent } from '../context/AgentContext';
import { useLanguage } from '../context/LanguageContext';
import { AuthMode, AuthRole, AuthSession } from './AuthModal';

interface AgentSearchBarProps {
  authSession: AuthSession | null;
  onOpenAuth: (role: AuthRole, mode: AuthMode) => void;
}

export default function AgentSearchBar({ authSession, onOpenAuth }: AgentSearchBarProps) {
  const { language } = useLanguage();
  const { startWithQuery, isLoading } = useAgent();
  const [query, setQuery] = useState('');

  const placeholders = useMemo(() => (
    language === 'tr'
      ? [
          'Uyku sorunum ve düşük enerjim var. Bana 3 günlük rota planla.',
          'Tükenmiş hissediyorum, toparlanma odaklı bir rota istiyorum.',
          'Enflamasyon ve bağışıklık desteği için 7 günlük rota oluştur.',
        ]
      : [
          'I have sleep problems and low energy. Plan a 3-day route for me.',
          'I feel burned out and need a recovery-focused route.',
          'I want a longevity trip for inflammation and immune support.',
        ]
  ), [language]);

  const placeholder = placeholders[new Date().getMinutes() % placeholders.length];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    if (!authSession) {
      onOpenAuth('user', 'signin');
      return;
    }

    setQuery('');
    await startWithQuery(value);
  };

  return (
    <form
      onSubmit={submit}
      className="mt-2 w-full max-w-3xl rounded-[26px] border border-white/70 bg-brand-soft-ivory/94 p-2.5 shadow-[0_24px_70px_rgba(18,60,53,0.18)] backdrop-blur-xl"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label className="sr-only" htmlFor="agent-route-query">
          {language === 'tr' ? 'Longevity rotası oluştur' : 'Create a longevity route'}
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] bg-white px-4 py-3.5 text-brand-deep-slate shadow-inner ring-1 ring-brand-warm-sand/55">
          <Route className="h-5 w-5 shrink-0 text-brand-med-teal" strokeWidth={1.8} />
          <input
            id="agent-route-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-brand-deep-slate/45"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-brand-copper px-5 py-4 text-sm font-black text-white shadow-[0_16px_35px_rgba(217,110,95,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#c95f51] disabled:cursor-not-allowed disabled:opacity-60 lg:min-w-[190px]"
        >
          <span>{language === 'tr' ? 'Rotamı Oluştur' : 'Generate My Route'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-2 px-2 text-[11px] font-semibold text-brand-deep-slate/58 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {language === 'tr'
            ? 'Kişiselleştirilmiş rotaları kaydetmek, karşılaştırmak ve geliştirmek için giriş gerekir.'
            : 'Personalized routes require sign-in to save, compare and refine recommendations.'}
        </p>
        <span className="inline-flex items-center gap-1.5 text-brand-med-teal">
          <MapPinned className="h-3.5 w-3.5" />
          {language === 'tr' ? 'Gerçek doğrulanmış yerlerle çalışır' : 'Works with real verified places'}
        </span>
      </div>
      {!authSession && (
        <p className="sr-only">
          {language === 'tr'
            ? 'Kişiselleştirilmiş rota planlaması için giriş yapmanız gerekir.'
            : 'Sign in for personalized route planning.'}
        </p>
      )}
    </form>
  );
}

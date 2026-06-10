import React, { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
          'Uyku sorunum var, nereye gitmeliyim?',
          '7 günlük longevity rotası planla, bütçem 3000 euro.',
          'İstanbul yakınında hamam + klinik rotası oluştur.',
        ]
      : [
          'I have sleep problems. Where should I go?',
          'Plan a 7-day longevity route with a EUR 3000 budget.',
          'Create a hammam + clinic route near Istanbul.',
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
      className="mt-2 w-full max-w-2xl rounded-2xl border border-white/18 bg-white/12 p-2 shadow-[0_18px_55px_rgba(4,47,44,0.18)] backdrop-blur-xl"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="agent-route-query">
          {language === 'tr' ? 'Longevity rotası oluştur' : 'Create a longevity route'}
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/92 px-3 py-2 text-brand-deep-slate shadow-inner">
          <Sparkles className="h-4 w-4 shrink-0 text-brand-med-teal" />
          <input
            id="agent-route-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-brand-deep-slate/42"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-turquoise px-4 py-3 text-sm font-black text-brand-deep-slate shadow-sm transition-all hover:bg-brand-highlight-lime disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{language === 'tr' ? 'Rotamı Oluştur' : 'Create My Route'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {!authSession && (
        <p className="px-2 pt-2 text-[11px] font-semibold text-white/62">
          {language === 'tr'
            ? 'Gerçek AI rota planlaması için giriş yapmanız gerekir.'
            : 'Sign in to use real AI route planning.'}
        </p>
      )}
    </form>
  );
}

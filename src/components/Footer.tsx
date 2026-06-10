import React, { useState } from 'react';
import { BookOpen, Calendar, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitContactMessage } from '../api';

interface FooterProps {
  onOpenBlog: () => void;
  onOpenEvents: () => void;
}

export default function Footer({ onOpenBlog, onOpenEvents }: FooterProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email.trim().includes('@')) {
      try {
        setIsSubmitting(true);
        await submitContactMessage({
          name: name.trim() || 'Route Longevity contact',
          email,
          topic: 'footer-contact',
          message: message.trim() || 'Please add me to the Route Longevity gazette and contact list.',
        });
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
          setName('');
          setMessage('');
      }, 5000);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : 'Message could not be saved.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <footer className="w-full bg-[#042f2c] text-[#f6fbf9] rounded-3xl mt-16 overflow-hidden border border-[#f6fbf9]/10 shadow-2xl relative z-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_42%,rgba(43,192,166,0.14))] pointer-events-none" />

      {/* Primary Grid */}
      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left Side: Brand Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-20 w-[210px]">
            <img
              src="/route-longevity-logo-reverse.png"
              alt={t('routeLongevity')}
              className="h-full w-full object-contain object-left"
            />
          </div>
          
          <p className="text-xs md:text-sm text-[#f6fbf9]/75 leading-relaxed font-serif max-w-sm">
            {t('footerDesc')}
          </p>

          <div className="flex items-center gap-2 text-[10px] text-[#0e7a70] uppercase font-bold tracking-widest bg-white/5 py-1 px-2.5 rounded w-fit border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('scienceDatabase')}</span>
          </div>
        </div>

        {/* Middle Column: Resource Sections (Blog & Events Highlights) */}
        <div className="lg:col-span-4 space-y-5">
          <p className="text-[10px] tracking-widest font-mono text-[#f6fbf9]/40 uppercase">
            {t('harnessingHeritage')}
          </p>

          <div className="space-y-3">
            {/* Quick Blog Trigger */}
            <button
              onClick={onOpenBlog}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0e655c]/55 hover:bg-white/[0.08] transition-all duration-300 flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="p-2 bg-[#0e655c]/15 rounded-lg text-[#0e655c]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#f6fbf9] group-hover:text-[#0e655c] transition-colors">
                  {t('scientificGazette')}
                </h4>
                <p className="text-[10px] text-[#f6fbf9]/60 leading-normal mt-0.5">
                  {t('scientificGazetteDesc')}
                </p>
              </div>
            </button>

            {/* Quick Events Trigger */}
            <button
              onClick={onOpenEvents}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0e7a70]/55 hover:bg-white/[0.08] transition-all duration-300 flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="p-2 bg-[#0e7a70]/15 rounded-lg text-[#0e7a70]">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#f6fbf9] group-hover:text-[#0e7a70] transition-colors">
                  {t('workshopsEvents')}
                </h4>
                <p className="text-[10px] text-[#f6fbf9]/60 leading-normal mt-0.5">
                  {t('workshopsEventsDesc')}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Longevity Gazette Subscription */}
        <div className="lg:col-span-3 space-y-4">
          <p className="text-[10px] tracking-widest font-mono text-[#f6fbf9]/40 uppercase">
            {t('longevityGazette')}
          </p>
          <p className="text-xs text-[#f6fbf9]/75 font-serif leading-relaxed">
            {t('gazetteDesc')}
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-[#79c9b8]/20 border border-[#79c9b8]/40 flex items-center gap-2.5 text-xs text-[#d8ebe6]">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#79c9b8]" />
              <div>
                <p className="font-bold">{t('subConfirmed')}</p>
                <p className="text-[10px] text-[#f6fbf9]/60 mt-0.5">{t('welcomeLongevity')}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-white/5 hover:bg-white/[0.08] rounded-xl border border-white/15 focus:outline-none focus:border-[#0e7a70]/50 text-xs text-white placeholder-[#f6fbf9]/30 transition-all font-sans"
              />
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f6fbf9]/40" />
                <input
                  type="email"
                  required
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3.5 bg-white/5 hover:bg-white/[0.08] rounded-xl border border-white/15 focus:outline-none focus:border-[#0e7a70]/50 text-xs text-white placeholder-[#f6fbf9]/30 transition-all font-sans"
                />
              </div>
              <textarea
                placeholder="Message or partnership note"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full py-2.5 px-3.5 bg-white/5 hover:bg-white/[0.08] rounded-xl border border-white/15 focus:outline-none focus:border-[#0e7a70]/50 text-xs text-white placeholder-[#f6fbf9]/30 transition-all font-sans resize-none"
              />
              {error && (
                <div className="text-[10px] text-red-100 bg-red-500/20 border border-red-300/20 rounded-lg px-2.5 py-1.5">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#0e655c] hover:bg-[#0e655c]/90 text-[#f6fbf9] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending...' : t('joinGazette')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Underbar Metadata */}
      <div className="px-8 py-5 border-t border-white/5 bg-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#f6fbf9]/40 font-mono tracking-wider relative z-10 w-full">
        <div>
          <span>© 2026 {t('routeLongevity')} • {t('royalties') || 'TRANSLATED MEDICINE'}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onOpenBlog} className="hover:text-[#0e655c] transition-colors cursor-pointer">{t('journalArticles')}</button>
          <span>•</span>
          <button onClick={onOpenEvents} className="hover:text-[#0e7a70] transition-colors cursor-pointer">{t('epigeneticEvents')}</button>
          <span>•</span>
          <span>{t('ancientRoots')}</span>
        </div>
      </div>
    </footer>
  );
}

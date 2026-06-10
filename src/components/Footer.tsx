import React, { useState } from 'react';
import { BookOpen, Calendar, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitContactMessage } from '../api';

interface FooterProps {
  onOpenBlog: () => void;
  onOpenEvents: () => void;
}

export default function Footer({ onOpenBlog, onOpenEvents }: FooterProps) {
  const { t, language } = useLanguage();
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
    <footer className="w-full bg-brand-deep-slate text-brand-soft-ivory rounded-[32px] mt-16 overflow-hidden border border-white/10 shadow-2xl relative z-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_42%,rgba(21,154,140,0.18))] pointer-events-none" />

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
          
          <p className="text-xs md:text-sm text-brand-soft-ivory/75 leading-relaxed max-w-sm">
            {language === 'tr'
              ? 'Route Longevity, doğrulanmış klinikleri, inzivaları, termal deneyimleri ve sağlıklı yaşam destinasyonlarını kişiselleştirilmiş rotalar içinde görünür kılan global longevity platformudur.'
              : 'Route Longevity is a global longevity route platform connecting verified clinics, retreats, thermal experiences and wellness destinations through personalized route intelligence.'}
          </p>

        </div>

        {/* Middle Column: Resource Sections (Blog & Events Highlights) */}
        <div className="lg:col-span-4 space-y-5">
          <p className="text-[10px] tracking-widest font-mono text-brand-soft-ivory/40 uppercase">
            {language === 'tr' ? 'Kaynaklar' : 'Resources'}
          </p>

          <div className="space-y-3">
            {/* Quick Blog Trigger */}
            <button
              onClick={onOpenBlog}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-med-teal/55 hover:bg-white/[0.08] transition-all duration-300 flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="p-2 bg-brand-med-teal/15 rounded-lg text-brand-med-teal">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-brand-soft-ivory group-hover:text-brand-med-teal transition-colors">
                  {language === 'tr' ? 'Longevity Journal' : 'Longevity Journal'}
                </h4>
                <p className="text-[10px] text-brand-soft-ivory/60 leading-normal mt-0.5">
                  {language === 'tr'
                    ? 'Kanıt odaklı rehberler, destinasyon notları ve rota fikirleri.'
                    : 'Evidence-informed guides, destination notes and route ideas.'}
                </p>
              </div>
            </button>

            {/* Quick Events Trigger */}
            <button
              onClick={onOpenEvents}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-med-teal/55 hover:bg-white/[0.08] transition-all duration-300 flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="p-2 bg-brand-med-teal/15 rounded-lg text-brand-med-teal">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-brand-soft-ivory group-hover:text-brand-med-teal transition-colors">
                  {language === 'tr' ? 'Deneyimler ve Etkinlikler' : 'Experiences & Events'}
                </h4>
                <p className="text-[10px] text-brand-soft-ivory/60 leading-normal mt-0.5">
                  {language === 'tr'
                    ? 'Workshoplar, inzivalar ve sezonluk wellness programları.'
                    : 'Workshops, retreats and seasonal wellness programs.'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Longevity Gazette Subscription */}
        <div className="lg:col-span-3 space-y-4">
          <p className="text-[10px] tracking-widest font-mono text-brand-soft-ivory/40 uppercase">
            {language === 'tr' ? 'Bağlantıda Kal' : 'Stay Connected'}
          </p>
          <p className="text-xs text-brand-soft-ivory/75 leading-relaxed">
            {language === 'tr'
              ? 'Yeni rotalar, partner fırsatları ve bilimsel içerikler için bize ulaşın.'
              : 'Get new route ideas, partner opportunities and evidence-informed updates.'}
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
              <span>{isSubmitting ? (language === 'tr' ? 'Gönderiliyor...' : 'Sending...') : (language === 'tr' ? 'Mesaj Gönder' : 'Send Message')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Underbar Metadata */}
      <div className="px-8 py-5 border-t border-white/5 bg-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#f6fbf9]/40 font-mono tracking-wider relative z-10 w-full">
        <div>
          <span>© 2026 Route Longevity • {language === 'tr' ? 'Kişiselleştirilmiş longevity rotaları' : 'Personalized longevity routes'}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onOpenBlog} className="hover:text-brand-med-teal transition-colors cursor-pointer">{language === 'tr' ? 'Makaleler' : 'Journal'}</button>
          <span>•</span>
          <button onClick={onOpenEvents} className="hover:text-brand-med-teal transition-colors cursor-pointer">{language === 'tr' ? 'Etkinlikler' : 'Events'}</button>
          <span>•</span>
          <span>{language === 'tr' ? 'Partner Ağı' : 'Partner Network'}</span>
        </div>
      </div>
    </footer>
  );
}

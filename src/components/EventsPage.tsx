import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Loader2, MailCheck, MapPin, QrCode, Users, X } from 'lucide-react';
import { getEvents, registerEvent } from '../api';
import { useLanguage } from '../context/LanguageContext';
import type { LongevityEvent } from './BlogEventsModal';
import type { AuthSession } from './AuthModal';
import Footer from './Footer';

interface EventsPageProps {
  onOpenBlog: () => void;
  onOpenEvents: () => void;
  authSession?: AuthSession | null;
}

export default function EventsPage({ onOpenBlog, onOpenEvents, authSession }: EventsPageProps) {
  const { language } = useLanguage();
  const [events, setEvents] = useState<LongevityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeredId, setRegisteredId] = useState('');
  const [confirmationEvent, setConfirmationEvent] = useState<LongevityEvent | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [registrations, setRegistrations] = useState<Record<string, { name: string; email: string }>>({});

  useEffect(() => {
    if (!authSession) return;
    setRegistrations((prev) => {
      const next = { ...prev };
      for (const event of events) {
        next[event.id] = {
          name: next[event.id]?.name || authSession.name || '',
          email: next[event.id]?.email || authSession.email || '',
        };
      }
      return next;
    });
  }, [authSession, events]);

  useEffect(() => {
    setIsLoading(true);
    getEvents(language)
      .then(({ events: apiEvents }) => setEvents(apiEvents))
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Events could not be loaded.'))
      .finally(() => setIsLoading(false));
  }, [language]);

  const submitRegistration = async (event: LongevityEvent) => {
    const registration = registrations[event.id] || { name: '', email: '' };

    if (!registration.name.trim() || !registration.email.includes('@')) {
      setError(language === 'tr' ? 'Lütfen ad ve e-posta girin.' : 'Please enter name and email.');
      return;
    }

    try {
      setError('');
      await registerEvent({ eventId: event.id, name: registration.name, email: registration.email, language });
      setRegisteredId(event.id);
      setConfirmationEvent(event);
      setConfirmationEmail(registration.email);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6fbf9] px-4 py-5 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      <section className="rounded-3xl bg-brand-deep-slate text-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-brand-turquoise">
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {language === 'tr' ? 'Etkinlikler' : 'Events'}
          </span>
        </div>
        <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-normal">
          {language === 'tr' ? 'Atölyeler, rotalar ve bilimsel buluşmalar' : 'Workshops, routes, and scientific gatherings'}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
          {language === 'tr'
            ? 'Route Longevity deneyim takvimi: klinik tarama günleri, termal ritüeller, üretici ziyaretleri ve kürasyonlu rota buluşmaları.'
            : 'The Route Longevity experience calendar: clinical screening days, thermal rituals, producer visits, and curated route gatherings.'}
        </p>
      </section>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-warm-sand/50 bg-white p-4 text-sm font-bold text-brand-deep-slate">
          <Loader2 className="h-4 w-4 animate-spin" />
          {language === 'tr' ? 'Etkinlikler yükleniyor...' : 'Loading events...'}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-3xl border border-brand-warm-sand/45 bg-white overflow-hidden shadow-sm">
            <img src={event.imageUrl} alt={event.title} className="h-44 w-full object-cover" referrerPolicy="no-referrer" />
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#F1F7EA] px-2.5 py-1 text-[10px] font-black text-[#086058]">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 text-xl font-black leading-tight text-brand-deep-slate">{event.title}</h2>
              <p className="mt-3 text-sm leading-6 text-brand-deep-slate/62">{event.description}</p>
              <div className="mt-4 space-y-2 text-xs font-bold text-brand-deep-slate/58">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-med-teal" /> {event.date}</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-med-teal" /> {event.time}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-med-teal" /> {event.location}, {event.city}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-med-teal" /> {event.spotsLeft} spots left</div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-2">
                <input
                  value={registrations[event.id]?.name || ''}
                  onChange={(e) => setRegistrations((prev) => ({
                    ...prev,
                    [event.id]: {
                      name: e.target.value,
                      email: prev[event.id]?.email || '',
                    },
                  }))}
                  placeholder={language === 'tr' ? 'Adınız' : 'Your name'}
                  className="rounded-xl border border-brand-warm-sand/70 bg-[#f6fbf9] px-3 py-2.5 text-sm outline-none focus:border-brand-med-teal"
                />
                <input
                  value={registrations[event.id]?.email || ''}
                  onChange={(e) => setRegistrations((prev) => ({
                    ...prev,
                    [event.id]: {
                      name: prev[event.id]?.name || '',
                      email: e.target.value,
                    },
                  }))}
                  placeholder={language === 'tr' ? 'E-posta' : 'Email'}
                  className="rounded-xl border border-brand-warm-sand/70 bg-[#f6fbf9] px-3 py-2.5 text-sm outline-none focus:border-brand-med-teal"
                />
                <button
                  onClick={() => submitRegistration(event)}
                  className="rounded-xl bg-brand-deep-slate px-4 py-3 text-sm font-black text-white"
                >
                  {registeredId === event.id ? (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-turquoise" />
                      {language === 'tr' ? 'Profile kaydedildi' : 'Saved to profile'}
                    </span>
                  ) : language === 'tr' ? 'Kayıt Ol' : 'Register'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {confirmationEvent && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-deep-slate/45 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 p-6 text-center shadow-[0_28px_90px_rgba(4,47,44,0.24)] backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(121,201,184,0.28),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.28))]" />
            <button
              type="button"
              onClick={() => setConfirmationEvent(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/70 bg-white/60 p-2 text-brand-deep-slate/60 transition hover:text-brand-deep-slate"
              aria-label={language === 'tr' ? 'Kapat' : 'Close'}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-turquoise/18 text-brand-med-teal shadow-sm">
                <MailCheck className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-brand-deep-slate">
                {language === 'tr' ? 'Etkinlik kaydınız yapılmıştır' : 'Your event registration is confirmed'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-brand-deep-slate/65">
                {language === 'tr'
                  ? 'Etkinlik katılım biletiniz ve QR kodunuz mail adresinize gönderildi. Girişte QR kodu gösterebilirsiniz.'
                  : 'Your event ticket and QR code have been sent to your email address. You can show the QR code at check-in.'}
              </p>

              <div className="mt-5 rounded-2xl border border-white/80 bg-white/58 p-4 text-left shadow-inner">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-deep-slate text-brand-turquoise">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-brand-deep-slate">{confirmationEvent.title}</p>
                    <p className="mt-1 text-xs font-semibold text-brand-deep-slate/55">
                      {[confirmationEvent.date, confirmationEvent.time].filter(Boolean).join(' | ')}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-deep-slate/55">
                      {[confirmationEvent.location, confirmationEvent.city].filter(Boolean).join(', ')}
                    </p>
                    <p className="mt-3 text-[11px] font-bold text-brand-med-teal">
                      {confirmationEmail}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmationEvent(null)}
                className="mt-6 rounded-2xl bg-brand-deep-slate px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-brand-med-teal"
              >
                {language === 'tr' ? 'Tamam' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />
    </div>
  );
}

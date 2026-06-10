import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Loader2, MapPin, Users } from 'lucide-react';
import { getEvents, registerEvent } from '../api';
import { useLanguage } from '../context/LanguageContext';
import type { LongevityEvent } from './BlogEventsModal';
import Footer from './Footer';

interface EventsPageProps {
  onOpenBlog: () => void;
  onOpenEvents: () => void;
}

export default function EventsPage({ onOpenBlog, onOpenEvents }: EventsPageProps) {
  const { language } = useLanguage();
  const [events, setEvents] = useState<LongevityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeredId, setRegisteredId] = useState('');
  const [registration, setRegistration] = useState({ name: '', email: '' });

  useEffect(() => {
    setIsLoading(true);
    getEvents(language)
      .then(({ events: apiEvents }) => setEvents(apiEvents))
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Events could not be loaded.'))
      .finally(() => setIsLoading(false));
  }, [language]);

  const submitRegistration = async (eventId: string) => {
    if (!registration.name.trim() || !registration.email.includes('@')) {
      setError(language === 'tr' ? 'Lütfen ad ve e-posta girin.' : 'Please enter name and email.');
      return;
    }

    try {
      setError('');
      await registerEvent({ eventId, name: registration.name, email: registration.email });
      setRegisteredId(eventId);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f7fbf9] px-4 py-5 md:p-8 max-w-7xl mx-auto w-full space-y-8">
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
                  <span key={tag} className="rounded-full bg-[#F1F7EA] px-2.5 py-1 text-[10px] font-black text-[#007c73]">
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
                  value={registration.name}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={language === 'tr' ? 'Adınız' : 'Your name'}
                  className="rounded-xl border border-brand-warm-sand/70 bg-[#f7fbf9] px-3 py-2.5 text-sm outline-none focus:border-brand-med-teal"
                />
                <input
                  value={registration.email}
                  onChange={(e) => setRegistration((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder={language === 'tr' ? 'E-posta' : 'Email'}
                  className="rounded-xl border border-brand-warm-sand/70 bg-[#f7fbf9] px-3 py-2.5 text-sm outline-none focus:border-brand-med-teal"
                />
                <button
                  onClick={() => submitRegistration(event.id)}
                  className="rounded-xl bg-brand-deep-slate px-4 py-3 text-sm font-black text-white"
                >
                  {registeredId === event.id ? (
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-turquoise" /> Registered</span>
                  ) : language === 'tr' ? 'Kayıt Ol' : 'Register'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />
    </div>
  );
}

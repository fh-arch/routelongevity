import { ArrowRight, Heart, MapPin, Star } from 'lucide-react';
import { RouteSuggestion } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface RouteCardProps {
  suggestion: RouteSuggestion;
  isFavorite: boolean;
  onFavorite: (externalId: string) => void;
  onViewMap: (externalId: string) => void;
}

export default function RouteCard({ suggestion, isFavorite, onFavorite, onViewMap }: RouteCardProps) {
  const { language } = useLanguage();
  const externalId = suggestion.externalId || suggestion.listingId;

  return (
    <article className="min-w-[260px] rounded-2xl border border-brand-warm-sand/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="rounded-full bg-brand-turquoise/14 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-brand-med-teal">
            {suggestion.category || suggestion.categoryId}
          </span>
          <h4 className="mt-3 line-clamp-2 text-base font-black leading-tight text-brand-deep-slate">
            {suggestion.name}
          </h4>
        </div>
        {suggestion.rating !== null && suggestion.rating !== undefined && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-soft-ivory px-2 py-1 text-xs font-black text-brand-deep-slate">
            <Star className="h-3 w-3 fill-brand-copper text-brand-copper" />
            {suggestion.rating}
          </span>
        )}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-deep-slate/58">
        <MapPin className="h-3.5 w-3.5" />
        {[suggestion.city, suggestion.country].filter(Boolean).join(', ')}
      </p>

      <p className="mt-3 line-clamp-4 text-xs leading-5 text-brand-deep-slate/68">
        {suggestion.reason}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewMap(externalId)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-deep-slate px-3 py-2 text-[11px] font-black text-white transition-colors hover:bg-brand-med-teal"
        >
          {language === 'tr' ? 'Haritada Gör' : 'View Map'}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onFavorite(externalId)}
          className={`rounded-xl border px-3 py-2 transition-colors ${
            isFavorite
              ? 'border-red-200 bg-red-50 text-red-500'
              : 'border-brand-warm-sand/70 bg-white text-brand-deep-slate/55 hover:text-red-500'
          }`}
          aria-label={language === 'tr' ? 'Favorilere ekle' : 'Save favorite'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
}

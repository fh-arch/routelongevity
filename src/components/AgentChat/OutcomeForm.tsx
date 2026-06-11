import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, Loader2, X } from 'lucide-react';
import { submitJourneyOutcome } from '../../api';
import { useLanguage } from '../../context/LanguageContext';

interface OutcomeFormProps {
  listing: {
    id?: string;
    externalId?: string;
    name: string;
  };
  onClose: () => void;
}

type ChangeVal = -1 | 0 | 1;

const SCORE_LABELS: Record<number, { en: string; tr: string }> = {
  1: { en: 'No benefit',     tr: 'Fayda yok' },
  2: { en: 'Minimal',        tr: 'Çok az' },
  3: { en: 'Slight',         tr: 'Hafif' },
  4: { en: 'Below average',  tr: 'Ortanın altı' },
  5: { en: 'Average',        tr: 'Ortalama' },
  6: { en: 'Good',           tr: 'İyi' },
  7: { en: 'Very good',      tr: 'Çok iyi' },
  8: { en: 'Great',          tr: 'Harika' },
  9: { en: 'Excellent',      tr: 'Mükemmel' },
  10: { en: 'Life-changing', tr: 'Hayat değiştirici' },
};

function ChangeSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ChangeVal;
  onChange: (v: ChangeVal) => void;
}) {
  const options: { val: ChangeVal; label: string }[] = [
    { val: -1, label: '↓' },
    { val: 0,  label: '—' },
    { val: 1,  label: '↑' },
  ];
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-bold text-brand-deep-slate/70">{label}</span>
      <div className="flex gap-1">
        {options.map((o) => (
          <button
            key={o.val}
            type="button"
            onClick={() => onChange(o.val)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-black transition-all ${
              value === o.val
                ? o.val === 1
                  ? 'border-brand-med-teal bg-brand-turquoise/14 text-brand-med-teal'
                  : o.val === -1
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-brand-warm-sand bg-brand-soft-ivory text-brand-deep-slate'
                : 'border-brand-warm-sand/50 bg-white/70 text-brand-deep-slate/40 hover:border-brand-warm-sand'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OutcomeForm({ listing, onClose }: OutcomeFormProps) {
  const { language } = useLanguage();
  const [score, setScore] = useState(7);
  const [visitedAt, setVisitedAt] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [sleep, setSleep] = useState<ChangeVal>(0);
  const [energy, setEnergy] = useState<ChangeVal>(0);
  const [stress, setStress] = useState<ChangeVal>(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitJourneyOutcome({
        listingId: listing.id,
        listingExternalId: listing.externalId,
        visitedAt,
        selfReportedScore: score,
        notes: notes.trim() || undefined,
        biomarkerChange: { sleep, energy, stress },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-brand-deep-slate/40 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="w-full max-w-md rounded-t-3xl border border-white/50 bg-brand-soft-ivory/95 shadow-2xl backdrop-blur-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-warm-sand/40 px-5 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-med-teal">
              {language === 'tr' ? 'Deneyimini paylaş' : 'Share your experience'}
            </p>
            <h3 className="text-base font-black text-brand-deep-slate">{listing.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-brand-warm-sand/60 bg-white/70 p-2 text-brand-deep-slate/55 hover:text-brand-deep-slate"
            aria-label={language === 'tr' ? 'Kapat' : 'Close'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-8 text-center"
              >
                <CheckCircle className="h-12 w-12 text-brand-med-teal" strokeWidth={1.5} />
                <h4 className="text-xl font-black text-brand-deep-slate">
                  {language === 'tr' ? 'Teşekkürler!' : 'Thank you!'}
                </h4>
                <p className="text-sm text-brand-deep-slate/60">
                  {language === 'tr'
                    ? 'Geri bildiriminiz rotaları iyileştirmemize yardımcı olacak.'
                    : 'Your feedback helps improve future route suggestions.'}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 rounded-xl bg-brand-deep-slate px-5 py-2.5 text-xs font-black text-white hover:bg-brand-med-teal"
                >
                  {language === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Visit date */}
                <div>
                  <label className="mb-1.5 block text-xs font-black text-brand-deep-slate">
                    {language === 'tr' ? 'Ziyaret tarihi' : 'Visit date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={visitedAt}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitedAt(e.target.value)}
                    className="w-full rounded-xl border border-brand-warm-sand/60 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-deep-slate outline-none focus:border-brand-med-teal"
                  />
                </div>

                {/* Score */}
                <div>
                  <label className="mb-1.5 block text-xs font-black text-brand-deep-slate">
                    {language === 'tr' ? `Puanın: ${score}/10 — ${SCORE_LABELS[score].tr}` : `Score: ${score}/10 — ${SCORE_LABELS[score].en}`}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full accent-brand-med-teal"
                  />
                  <div className="mt-1 flex justify-between text-[10px] font-bold text-brand-deep-slate/40">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-black text-brand-deep-slate">
                    {language === 'tr' ? 'Notlar (isteğe bağlı)' : 'Notes (optional)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder={language === 'tr' ? 'Deneyimini anlat...' : 'Describe your experience...'}
                    className="w-full resize-none rounded-xl border border-brand-warm-sand/60 bg-white/80 px-3 py-2 text-sm text-brand-deep-slate outline-none placeholder:text-brand-deep-slate/30 focus:border-brand-med-teal"
                  />
                </div>

                {/* Biomarker changes */}
                <div className="rounded-2xl border border-brand-warm-sand/50 bg-white/60 p-4">
                  <p className="mb-3 text-xs font-black text-brand-deep-slate">
                    {language === 'tr' ? 'Değişimler (isteğe bağlı)' : 'Changes noticed (optional)'}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <ChangeSelector
                      label={language === 'tr' ? 'Uyku' : 'Sleep'}
                      value={sleep}
                      onChange={setSleep}
                    />
                    <ChangeSelector
                      label={language === 'tr' ? 'Enerji' : 'Energy'}
                      value={energy}
                      onChange={setEnergy}
                    />
                    <ChangeSelector
                      label={language === 'tr' ? 'Stres' : 'Stress'}
                      value={stress}
                      onChange={setStress}
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-deep-slate py-3 text-sm font-black text-white transition-colors hover:bg-brand-med-teal disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting
                    ? (language === 'tr' ? 'Gönderiliyor...' : 'Submitting...')
                    : (language === 'tr' ? 'Geri Bildirim Gönder' : 'Submit Feedback')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

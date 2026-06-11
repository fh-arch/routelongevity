import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronRight, Leaf, SkipForward } from 'lucide-react';
import { HealthProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HealthWizardProps {
  onSave: (profile: HealthProfile) => Promise<void>;
  onSkip: () => void;
}

const GOALS = [
  { key: 'sleep',    en: 'Sleep',      tr: 'Uyku' },
  { key: 'stress',   en: 'Stress',     tr: 'Stres' },
  { key: 'inflammation', en: 'Inflammation', tr: 'İltihap' },
  { key: 'nutrition', en: 'Nutrition', tr: 'Beslenme' },
  { key: 'longevity', en: 'General Longevity', tr: 'Uzun Ömür' },
  { key: 'biohacking', en: 'Biohacking', tr: 'Biohacking' },
];

const BUDGETS: { key: HealthProfile['budgetRange']; en: string; tr: string; desc_en: string; desc_tr: string }[] = [
  { key: 'economy', en: 'Economy', tr: 'Ekonomi', desc_en: 'Local gems, affordable wellness', desc_tr: 'Yerel yerler, uygun fiyat' },
  { key: 'premium', en: 'Premium', tr: 'Premium', desc_en: 'Curated boutique experiences', desc_tr: 'Seçkin butik deneyimler' },
  { key: 'luxury',  en: 'Luxury',  tr: 'Lüks',   desc_en: 'Top-tier clinics & resorts', desc_tr: 'En iyi klinik & tesisler' },
];

const REGIONS = [
  { key: 'turkiye', en: 'Türkiye', tr: 'Türkiye' },
  { key: 'greece',  en: 'Greece',  tr: 'Yunanistan' },
  { key: 'italy',   en: 'Italy',   tr: 'İtalya' },
  { key: 'spain',   en: 'Spain',   tr: 'İspanya' },
  { key: 'france',  en: 'France',  tr: 'Fransa' },
  { key: 'croatia', en: 'Croatia', tr: 'Hırvatistan' },
];

export default function HealthWizard({ onSave, onSkip }: HealthWizardProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [goals, setGoals] = useState<string[]>([]);
  const [budget, setBudget] = useState<HealthProfile['budgetRange']>('premium');
  const [travelDays, setTravelDays] = useState(7);
  const [regions, setRegions] = useState<string[]>(['turkiye']);

  const toggleGoal = (key: string) =>
    setGoals((prev) => prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]);

  const toggleRegion = (key: string) =>
    setRegions((prev) => prev.includes(key) ? prev.filter((r) => r !== key) : [...prev, key]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        goals: goals.length ? goals : ['longevity'],
        budgetRange: budget,
        travelDays,
        preferredRegions: regions.length ? regions : ['turkiye'],
      });
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    language === 'tr' ? 'Hedefler' : 'Goals',
    language === 'tr' ? 'Bütçe' : 'Budget',
    language === 'tr' ? 'Seyahat' : 'Travel',
  ];

  return (
    <div className="flex flex-col gap-4 px-1 py-2">
      {/* Header */}
      <div className="rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-turquoise/14 text-brand-med-teal">
          <Leaf className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="mt-3 text-center text-xl font-black text-brand-deep-slate">
          {language === 'tr' ? 'Sağlık Profilin' : 'Your Health Profile'}
        </h3>
        <p className="mt-1 text-center text-xs leading-5 text-brand-deep-slate/60">
          {language === 'tr'
            ? 'Ajanın sana özel rotalar önerebilmesi için birkaç soru soralım.'
            : 'Answer a few quick questions so the agent can personalise your route.'}
        </p>

        {/* Step pills */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                i === step
                  ? 'bg-brand-deep-slate text-white'
                  : i < step
                  ? 'bg-brand-turquoise/20 text-brand-med-teal'
                  : 'bg-brand-warm-sand/40 text-brand-deep-slate/40'
              }`}>
                {i < step ? <Check className="inline h-3 w-3" /> : `${i + 1}.`} {label}
              </span>
              {i < steps.length - 1 && <div className="h-px w-4 bg-brand-warm-sand/60" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm"
        >
          {step === 0 && (
            <>
              <p className="mb-3 text-sm font-black text-brand-deep-slate">
                {language === 'tr' ? 'Hangi hedefler seni en çok ilgilendiriyor?' : 'Which goals matter most to you?'}
              </p>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => {
                  const active = goals.includes(g.key);
                  return (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => toggleGoal(g.key)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        active
                          ? 'border-brand-med-teal bg-brand-turquoise/14 text-brand-med-teal'
                          : 'border-brand-warm-sand/60 bg-white/70 text-brand-deep-slate/70 hover:border-brand-med-teal/40'
                      }`}
                    >
                      {active && <Check className="mr-1 inline h-3 w-3" />}
                      {language === 'tr' ? g.tr : g.en}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="mb-3 text-sm font-black text-brand-deep-slate">
                {language === 'tr' ? 'Bütçe tercihini seç' : 'Choose your budget range'}
              </p>
              <div className="flex flex-col gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setBudget(b.key)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                      budget === b.key
                        ? 'border-brand-med-teal bg-brand-turquoise/10'
                        : 'border-brand-warm-sand/60 bg-white/70 hover:border-brand-med-teal/40'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-black text-brand-deep-slate">
                        {language === 'tr' ? b.tr : b.en}
                      </span>
                      <p className="mt-0.5 text-xs text-brand-deep-slate/55">
                        {language === 'tr' ? b.desc_tr : b.desc_en}
                      </p>
                    </div>
                    {budget === b.key && (
                      <Check className="h-4 w-4 shrink-0 text-brand-med-teal" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-3 text-sm font-black text-brand-deep-slate">
                {language === 'tr' ? 'Kaç gün seyahat planlıyorsun?' : 'How many days are you planning to travel?'}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTravelDays((d) => Math.max(1, d - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-warm-sand/60 bg-white/70 text-lg font-black text-brand-deep-slate hover:border-brand-med-teal/40"
                >
                  −
                </button>
                <span className="min-w-[3ch] text-center text-2xl font-black text-brand-deep-slate">
                  {travelDays}
                </span>
                <button
                  type="button"
                  onClick={() => setTravelDays((d) => Math.min(30, d + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-warm-sand/60 bg-white/70 text-lg font-black text-brand-deep-slate hover:border-brand-med-teal/40"
                >
                  +
                </button>
                <span className="text-xs font-semibold text-brand-deep-slate/55">
                  {language === 'tr' ? 'gün' : 'days'}
                </span>
              </div>

              <p className="mb-2 mt-5 text-sm font-black text-brand-deep-slate">
                {language === 'tr' ? 'Tercih ettiğin bölgeler' : 'Preferred regions'}
              </p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => {
                  const active = regions.includes(r.key);
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => toggleRegion(r.key)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        active
                          ? 'border-brand-med-teal bg-brand-turquoise/14 text-brand-med-teal'
                          : 'border-brand-warm-sand/60 bg-white/70 text-brand-deep-slate/70 hover:border-brand-med-teal/40'
                      }`}
                    >
                      {active && <Check className="mr-1 inline h-3 w-3" />}
                      {language === 'tr' ? r.tr : r.en}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-warm-sand/60 bg-white/70 px-3 py-2 text-xs font-bold text-brand-deep-slate/55 hover:text-brand-deep-slate"
        >
          <SkipForward className="h-3.5 w-3.5" />
          {language === 'tr' ? 'Geç' : 'Skip'}
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-med-teal px-4 py-2 text-xs font-black text-white transition-colors hover:bg-brand-deep-slate"
          >
            {language === 'tr' ? 'İleri' : 'Next'}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-deep-slate px-4 py-2 text-xs font-black text-white transition-colors hover:bg-brand-med-teal disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" />
            {saving
              ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...')
              : (language === 'tr' ? 'Profili Kaydet' : 'Save Profile')}
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Lock, Mail, User, UserPlus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { signin, signup } from '../api';

export type AuthRole = 'user' | 'partner';
export type AuthMode = 'signin' | 'signup';

export interface AuthSession {
  id?: string;
  role: AuthRole;
  email: string;
  name: string;
}

interface AuthModalProps {
  isOpen: boolean;
  initialRole: AuthRole;
  initialMode: AuthMode;
  onClose: () => void;
  onSuccess: (session: AuthSession) => void;
}

const emptyForm = {
  name: '',
  businessName: '',
  email: '',
  password: '',
};

export default function AuthModal({ isOpen, initialRole, initialMode, onClose, onSuccess }: AuthModalProps) {
  const { language } = useLanguage();
  const [role, setRole] = useState<AuthRole>(initialRole);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setMode(initialMode);
      setForm(emptyForm);
      setError('');
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen, initialRole, initialMode]);

  if (!isOpen) return null;

  const isSignup = mode === 'signup';
  const isPartner = role === 'partner';

  const copy = {
    title: isSignup
      ? isPartner
        ? language === 'tr' ? 'İş ortağı hesabı oluştur' : 'Create partner account'
        : language === 'tr' ? 'Gezgin hesabı oluştur' : 'Create traveler account'
      : isPartner
        ? language === 'tr' ? 'İş ortağı girişi' : 'Partner sign in'
        : language === 'tr' ? 'Gezgin girişi' : 'Traveler sign in',
    subtitle: isPartner
      ? language === 'tr'
        ? 'Profil, görünürlük verileri, başvuru ve lisans bilgilerinizi yönetin.'
        : 'Manage profile, visibility analytics, applications, and license details.'
      : language === 'tr'
        ? 'Favori rotalarınızı, kayıtlı merkezleri ve etkinlik rezervasyonlarınızı saklayın.'
        : 'Save favorite routes, listed hubs, and event reservations.',
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (isSignup && !form.name.trim()) {
      setError(language === 'tr' ? 'Lütfen adınızı girin.' : 'Please enter your name.');
      return;
    }

    if (isSignup && isPartner && !form.businessName.trim()) {
      setError(language === 'tr' ? 'Lütfen işletme adınızı girin.' : 'Please enter your business name.');
      return;
    }

    if (!form.email.includes('@')) {
      setError(language === 'tr' ? 'Geçerli bir e-posta girin.' : 'Enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError(language === 'tr' ? 'Şifre en az 6 karakter olmalı.' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = isSignup
        ? await signup({
          role,
          name: form.name,
          businessName: form.businessName,
          email: form.email,
          password: form.password,
        })
        : await signin({
          email: form.email,
          password: form.password,
        });

      localStorage.setItem('route_longevity_session_user', JSON.stringify(response.user));
      setSuccess(true);
      onSuccess(response.user);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] bg-[#0F2B2D]/75 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-4xl bg-[#FAF7F2] border border-brand-warm-sand/60 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]"
        >
          <aside className="bg-brand-deep-slate text-white p-6 md:p-8 flex flex-col justify-between gap-8">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-turquoise/15 text-brand-turquoise flex items-center justify-center">
                {isPartner ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-black tracking-normal mt-5">{copy.title}</h2>
              <p className="text-sm text-white/70 leading-6 mt-3">{copy.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRole('user')}
                className={`rounded-xl p-3 text-left border transition-all cursor-pointer ${
                  role === 'user' ? 'bg-white text-brand-deep-slate border-white' : 'bg-white/5 border-white/10 text-white/75'
                }`}
              >
                <User className="w-4 h-4 mb-2" />
                <span className="text-xs font-extrabold">{language === 'tr' ? 'Gezgin' : 'Traveler'}</span>
              </button>
              <button
                onClick={() => setRole('partner')}
                className={`rounded-xl p-3 text-left border transition-all cursor-pointer ${
                  role === 'partner' ? 'bg-white text-brand-deep-slate border-white' : 'bg-white/5 border-white/10 text-white/75'
                }`}
              >
                <Building2 className="w-4 h-4 mb-2" />
                <span className="text-xs font-extrabold">{language === 'tr' ? 'İş Ortağı' : 'Partner'}</span>
              </button>
            </div>
          </aside>

          <section className="p-6 md:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-warm-sand/25 text-brand-deep-slate/55 hover:text-brand-deep-slate transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex bg-white border border-brand-warm-sand/60 rounded-xl p-1 w-fit mb-6">
              <button
                onClick={() => { setMode('signin'); setError(''); setSuccess(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${mode === 'signin' ? 'bg-brand-deep-slate text-white' : 'text-brand-deep-slate/60'}`}
              >
                {language === 'tr' ? 'Giriş yap' : 'Sign in'}
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); setSuccess(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${mode === 'signup' ? 'bg-brand-deep-slate text-white' : 'text-brand-deep-slate/60'}`}
              >
                {language === 'tr' ? 'Hesap aç' : 'Sign up'}
              </button>
            </div>

            {success ? (
              <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#7A8F6A]/12 text-[#7A8F6A] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black text-brand-deep-slate">
                  {language === 'tr' ? 'Oturum hazır' : 'Session ready'}
                </h3>
                <p className="text-sm text-brand-deep-slate/65 leading-6 mt-2 max-w-sm">
                  {language === 'tr'
                    ? 'Hesabınız güvenli oturum ile açıldı.'
                    : 'Your account is signed in with a secure session.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-3 rounded-xl bg-brand-deep-slate hover:bg-brand-med-teal text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  {language === 'tr' ? 'Uygulamaya dön' : 'Return to app'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="block text-xs font-bold text-brand-deep-slate/65 mb-1.5">
                      {language === 'tr' ? 'Ad soyad' : 'Full name'}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full text-sm p-3 bg-white border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                    />
                  </div>
                )}

                {isSignup && isPartner && (
                  <div>
                    <label className="block text-xs font-bold text-brand-deep-slate/65 mb-1.5">
                      {language === 'tr' ? 'İşletme / tesis adı' : 'Business / venue name'}
                    </label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))}
                      className="w-full text-sm p-3 bg-white border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-brand-deep-slate/65 mb-1.5">
                    {language === 'tr' ? 'E-posta' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-brand-deep-slate/35 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full text-sm pl-10 pr-3 py-3 bg-white border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-deep-slate/65 mb-1.5">
                    {language === 'tr' ? 'Şifre' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-brand-deep-slate/35 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="w-full text-sm pl-10 pr-3 py-3 bg-white border border-brand-warm-sand/70 rounded-xl focus:outline-none focus:border-brand-med-teal"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-brand-deep-slate hover:bg-brand-med-teal text-white font-extrabold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSignup ? <UserPlus className="w-4 h-4 text-brand-turquoise" /> : <Lock className="w-4 h-4 text-brand-turquoise" />}
                  <span>
                    {isSignup
                      ? isSubmitting
                        ? language === 'tr' ? 'Oluşturuluyor...' : 'Creating...'
                        : language === 'tr' ? 'Hesap oluştur' : 'Create account'
                      : isSubmitting
                        ? language === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...'
                        : language === 'tr' ? 'Giriş yap' : 'Sign in'}
                  </span>
                </button>
              </form>
            )}
          </section>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

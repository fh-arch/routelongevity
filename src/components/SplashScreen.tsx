import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'enter' | 'visible' | 'exit' | 'hidden'>('enter');

  useEffect(() => {
    const visibleTimer = setTimeout(() => {
      setStage('visible');
    }, 100);

    return () => {
      clearTimeout(visibleTimer);
    };
  }, [onComplete]);

  const handleEnter = () => {
    if (stage === 'exit') return;
    setStage('exit');
    setTimeout(() => {
      setStage('hidden');
      onComplete();
    }, 700);
  };

  if (stage === 'hidden') return null;

  return (
    <div
      id="route-longevity-splash"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-brand-soft-ivory app-glass-shell px-5 transition-opacity duration-700 ease-in-out ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-med-teal via-brand-turquoise to-brand-highlight-lime" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-turquoise/18 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brand-highlight-lime/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-3xl" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.82),rgba(255,255,255,0.34)_44%,rgba(14,122,112,0.14))]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.95),transparent_34%),linear-gradient(rgba(4,47,44,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(4,47,44,0.035)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px]" />

      {/* Main Branding Block */}
      <div
        className={`relative flex w-full max-w-3xl flex-col items-center rounded-[2rem] border border-white/65 bg-white/34 px-5 py-8 text-center shadow-[0_28px_90px_rgba(4,47,44,0.16)] backdrop-blur-2xl sm:px-10 sm:py-10 transition-all duration-1000 ${
          stage === 'enter' ? 'translate-y-4 scale-[0.98] opacity-0' : 'translate-y-0 scale-100 opacity-100'
        }`}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/72 via-white/22 to-brand-turquoise/12 pointer-events-none" />
        
        {/* Route Longevity Brand */}
        <div 
          className={`relative w-[260px] md:w-[360px] mb-8 transition-all duration-1000 transform ${
            stage === 'enter' ? 'opacity-0 scale-75 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <img
            src="/route-longevity-logo.png"
            alt="Route Longevity"
            className="w-full h-auto object-contain"
          />
        </div>

        <div
          className={`relative mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-med-teal shadow-sm backdrop-blur-xl transition-all duration-1000 delay-200 ${
            stage === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          Agentic longevity intelligence
        </div>

        {/* Title */}
        <h1 
          className={`relative font-display font-extrabold text-brand-deep-slate tracking-normal text-3xl md:text-5xl mb-3 transition-all duration-1000 delay-300 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          We’re building the first <span className="text-brand-med-teal">agentic AI for longevity</span>
        </h1>

        <p 
          className={`relative text-brand-deep-slate/72 text-sm md:text-base max-w-xl leading-relaxed transition-all duration-1200 delay-700 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          A glass-clear intelligence layer for longevity routes, verified clinics, wellness retreats, and preventive health travel.
          <span className="text-brand-med-teal text-xs uppercase tracking-widest block mt-3 font-black">
            Heritage data. Modern guidance. Starting from Türkiye.
          </span>
        </p>

        <button
          type="button"
          onClick={handleEnter}
          className={`relative mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-med-teal px-7 py-3.5 text-sm font-black text-white shadow-[0_18px_40px_rgba(8,96,88,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep-slate hover:shadow-[0_22px_50px_rgba(4,47,44,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-turquoise/25 cursor-pointer ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          Enter Route Longevity
          <ArrowRight className="h-4 w-4" />
        </button>

        <div
          className={`relative mt-7 grid grid-cols-3 gap-2 w-full max-w-md transition-all duration-1200 delay-900 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {['Natural', 'Holistic', 'Premium'].map((label) => (
            <div key={label} className="rounded-2xl border border-white/65 bg-white/34 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-brand-deep-slate shadow-sm backdrop-blur-xl">
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Minimal Footer */}
      <div 
        className={`absolute bottom-8 text-center text-[10px] font-mono tracking-widest text-brand-deep-slate/45 transition-opacity duration-1000 delay-1000 ${
          stage === 'enter' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        HERITAGE OF TÜRKİYE • 2026
      </div>
    </div>
  );
}

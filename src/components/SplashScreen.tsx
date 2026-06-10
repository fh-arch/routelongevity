import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'enter' | 'visible' | 'exit' | 'hidden'>('enter');

  useEffect(() => {
    // 1. Enter state triggers instantly on mount.
    const visibleTimer = setTimeout(() => {
      setStage('visible');
    }, 100);

    // 2. Start fade out at 3.8s
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 3800);

    // 3. Complete and unmount at 5.0s
    const completeTimer = setTimeout(() => {
      setStage('hidden');
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (stage === 'hidden') return null;

  return (
    <div
      id="route-longevity-splash"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-soft-ivory transition-opacity duration-1000 ease-in-out ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-turquoise via-brand-highlight-lime to-brand-copper" />
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-br from-brand-turquoise/18 via-transparent to-transparent pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-2/3 w-1/3 bg-gradient-to-tl from-brand-support-purple/12 via-brand-highlight-lime/8 to-transparent pointer-events-none" />

      {/* Main Branding Block */}
      <div className="relative text-center max-w-3xl px-6 flex flex-col items-center">
        
        {/* Route Longevity Brand Card */}
        <div 
          className={`w-[260px] md:w-[340px] rounded-3xl bg-white border border-brand-warm-sand/80 px-8 py-6 shadow-xl shadow-brand-deep-slate/10 mb-8 transition-all duration-1000 transform ${
            stage === 'enter' ? 'opacity-0 scale-75 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <img
            src="/route-longevity-logo.png"
            alt="Route Longevity"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Title */}
        <h1 
          className={`font-display font-extrabold text-brand-deep-slate tracking-normal text-3xl md:text-5xl mb-3 transition-all duration-1000 delay-300 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          Discover Türkiye's <span className="text-brand-med-teal">Longevity Heritage</span>
        </h1>

        {/* Dynamic Line Separator */}
        <div 
          className={`h-[2px] bg-gradient-to-r from-transparent via-brand-olive-sage to-transparent my-4 transition-all duration-1000 delay-500 ease-out`}
          style={{ 
            width: stage === 'enter' ? '0%' : '280px' 
          }}
        />

        {/* Subtitle / Slogan requested: "Ancient Roots, Modern Science. Starting from Türkiye." */}
        <p 
          className={`text-brand-deep-slate/72 text-sm md:text-base font-serif italic max-w-lg leading-relaxed transition-all duration-1200 delay-700 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          Ancient Roots, Modern Science. <br />
          <span className="text-brand-copper font-sans text-xs uppercase tracking-widest not-italic block mt-3 font-black">
            Starting from Türkiye.
          </span>
        </p>

        <div
          className={`mt-8 grid grid-cols-3 gap-2 w-full max-w-md transition-all duration-1200 delay-900 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {['Natural', 'Holistic', 'Premium'].map((label) => (
            <div key={label} className="rounded-2xl border border-brand-warm-sand bg-white/80 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-brand-deep-slate shadow-sm">
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

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-soft-ivory app-glass-shell transition-opacity duration-1000 ease-in-out ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-med-teal via-brand-turquoise to-brand-highlight-lime" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.76),rgba(255,255,255,0.22)_45%,rgba(43,192,166,0.12))]" />

      {/* Main Branding Block */}
      <div className="relative text-center max-w-3xl px-6 flex flex-col items-center">
        
        {/* Route Longevity Brand */}
        <div 
          className={`w-[260px] md:w-[360px] mb-8 transition-all duration-1000 transform ${
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
          We’re building the first <span className="text-brand-med-teal">agentic AI for longevity</span>
        </h1>

        {/* Dynamic Line Separator */}
        <div 
          className={`h-[2px] bg-gradient-to-r from-transparent via-brand-olive-sage to-transparent my-4 transition-all duration-1000 delay-500 ease-out`}
          style={{ 
            width: stage === 'enter' ? '0%' : '280px' 
          }}
        />

        <p 
          className={`text-brand-deep-slate/72 text-sm md:text-base max-w-xl leading-relaxed transition-all duration-1200 delay-700 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          A glass-clear intelligence layer for longevity routes, verified clinics, wellness retreats, and preventive health travel.
          <span className="text-brand-med-teal text-xs uppercase tracking-widest block mt-3 font-black">
            Heritage data. Modern guidance. Starting from Türkiye.
          </span>
        </p>

        <div
          className={`mt-8 grid grid-cols-3 gap-2 w-full max-w-md transition-all duration-1200 delay-900 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {['Natural', 'Holistic', 'Premium'].map((label) => (
            <div key={label} className="rounded-2xl glass-surface px-4 py-3 text-[10px] font-black uppercase tracking-wide text-brand-deep-slate">
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

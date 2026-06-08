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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#122328] transition-opacity duration-1000 ease-in-out ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Absolute Ambient Glow in Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#5A9D62]/15 blur-[120px] animate-pulse pointer-events-none duration-4000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF6B4A]/10 blur-[120px] animate-pulse pointer-events-none duration-6000" />

      {/* Main Branding Block */}
      <div className="relative text-center max-w-2xl px-6 flex flex-col items-center">
        
        {/* Elegant Animated Logo Icon */}
        <div 
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5A9D62] to-[#122328] border border-[#FF6B4A]/30 flex items-center justify-center shadow-xl shadow-black/30 mb-8 transition-all duration-1000 transform ${
            stage === 'enter' ? 'opacity-0 scale-75 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {svgLogo}
        </div>

        {/* Title */}
        <h1 
          className={`font-sans font-extrabold text-[#FAFAF8] tracking-widest text-3xl md:text-4xl uppercase mb-3 transition-all duration-1000 delay-300 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          ROUTE <span className="text-[#FF6B4A]">LONGEVITY</span>
        </h1>

        {/* Dynamic Line Separator */}
        <div 
          className={`h-[1px] bg-gradient-to-r from-transparent via-[#FF6B4A]/70 to-transparent my-4 transition-all duration-1000 delay-500 ease-out`}
          style={{ 
            width: stage === 'enter' ? '0%' : '240px' 
          }}
        />

        {/* Subtitle / Slogan requested: "Ancient Roots, Modern Science. Starting from Türkiye." */}
        <p 
          className={`text-[#E5EDE1] text-sm md:text-base font-serif italic max-w-lg leading-relaxed transition-all duration-1200 delay-700 transform ${
            stage === 'enter' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          "Ancient Roots, Modern Science. <br />
          <span className="text-[#64D2A2] font-sans text-xs uppercase tracking-widest not-italic block mt-2 font-bold">
            Starting from Türkiye.
          </span>
        </p>
      </div>

      {/* Minimal Footer */}
      <div 
        className={`absolute bottom-8 text-center text-[10px] font-mono tracking-widest text-[#FAFAF8]/40 transition-opacity duration-1000 delay-1000 ${
          stage === 'enter' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        DISCOVER THE HERITAGE • 2026
      </div>
    </div>
  );
}

const svgLogo = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
    <path 
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
      fill="#FAFAF8" 
    />
    <path 
      d="M12 6.5C13 5.5 14.5 5 16 5.5" 
      stroke="#FF6B4A" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
  </svg>
);

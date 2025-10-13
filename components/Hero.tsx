// components/Hero.tsx
'use client';

import Galaxy from './Galaxy';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Starfield background */}
      <Galaxy className="absolute inset-0 z-0 pointer-events-auto" />

      {/* Warm vignette to add depth (subtle) */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 60%, rgba(255,78,0,0.12) 0%, rgba(0,0,0,0.0) 60%)',
        }}
      />

      {/* Centered wordmark overlay */}
      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-6">
        <div className="relative">
          {/* soft glow behind the logo */}
          <div className="absolute -inset-8 blur-[40px] opacity-40"
               style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,149,8,0.35) 0%, rgba(0,0,0,0) 70%)' }} />

          {/* CHANGE THIS SRC to the path that works in your browser test */}
          <img
            src="/assets/wordmark_full.svg"
            alt="THE ROCKET GUY"
            className="relative block w-[min(90vw,1100px)] h-auto select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Fade to black into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 z-20"
           style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%)' }} />
    </section>
  );
}

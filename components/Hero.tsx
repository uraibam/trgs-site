// components/Hero.tsx
'use client';

import Galaxy from './Galaxy';

export default function Hero() {
  return (
    <section className="relative h-[88vh] md:h-screen overflow-hidden bg-black">
      {/* Starfield */}
      <Galaxy
        className="absolute inset-0 -z-10"
        density={0.85}
        glowIntensity={0.18}
        saturation={0.12}
        hueShift={220}
        speed={0.7}
        starSpeed={0.25}
        twinkleIntensity={0.12}
        mouseInteraction={true}
        mouseRepulsion={false}
        transparent
      />

      {/* Warm vignette, very subtle */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(80% 55% at 70% 80%, rgba(255,78,0,0.20), rgba(0,0,0,0) 45%)',
        }}
      />

      {/* Wordmark */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <img
          src="/wordmark_full.svg"
          alt="THE ROCKET GUY"
          className="w-[82%] max-w-[1100px] drop-shadow-[0_0_22px_rgba(255,149,8,.35)]"
        />
      </div>

      {/* NOTE: we intentionally removed the bottom fade */}
    </section>
  );
}

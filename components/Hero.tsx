// components/Hero.tsx
'use client';

import Image from 'next/image';
import Galaxy from './Galaxy';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* BACK STARFIELD (main) */}
      <Galaxy
        className="z-0"
        density={0.4}
        glowIntensity={0.3}
        saturation={0.3}
        twinkleIntensity={0.4}
        starSpeed={0.5}
        speed={0.4}
        rotationSpeed={0.2}
        mouseInteraction
      />

      {/* DUST HAZE LAYER (blurred, lower density) 
      <Galaxy
        className="z-0"
        density={0.55}
        glowIntensity={0.60}
        saturation={0.35}
        twinkleIntensity={0.18}
        starSpeed={0.16}
        speed={0.65}
        rotationSpeed={0.02}
        mouseInteraction
        blurPx={10}
        opacity={0.38}
      />*/}

      {/* VIGNETTE for infinite feel */}
      <div className="pointer-events-none absolute inset-0 z-10 vignette" />

      {/* LOGO + subtle glow pulse */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative">
          {/* Warm glow pulse behind the logo */}
          <div className="absolute -inset-24 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,78,0,0.22),rgba(0,0,0,0))] pulse" />
          <Image
            src="/assets/wordmark_full.svg"
            alt="THE ROCKET GUY"
            width={1200}
            height={300}
            priority
            className="relative w-[min(78vw,1100px)] h-auto select-none"
          />
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#proof"
        aria-label="Scroll to next section"
        className="absolute z-30 left-1/2 -translate-x-1/2 bottom-6 scroll-cue"
      >
        <span className="sr-only">Scroll</span>
        <svg width="22" height="36" viewBox="0 0 22 36" aria-hidden="true">
          <rect x="1" y="1" width="20" height="34" rx="10" stroke="white" fill="none" opacity="0.5"/>
          <circle cx="11" cy="9" r="3" fill="white" />
        </svg>
      </a>
    </section>
  );
}

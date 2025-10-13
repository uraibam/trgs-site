// components/Hero.tsx
'use client';

import Image from 'next/image';
import Galaxy from './Galaxy';

export default function Hero() {
  return (
    <section
      className="
        relative isolate
        min-h-[100svh]
        overflow-hidden
        bg-black
      "
    >
      {/* Starfield fills hero, fully opaque to avoid bottom band */}
      <Galaxy
        className="absolute inset-0"
        transparent={false}
        density={0.62}
        glowIntensity={0.20}
        saturation={0.10}
        hueShift={220}
        speed={0.60}
        starSpeed={0.18}
        rotationSpeed={0.020}
        twinkleIntensity={0.18}
        mouseInteraction={true}
        mouseRepulsion={false}
      />

      {/* Centered wordmark */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="w-full max-w-[1200px]">
          <Image
            src="/wordmark_full.svg"
            alt="THE ROCKET GUY"
            width={1800}
            height={420}
            priority
            className="w-full h-auto drop-shadow-[0_0_50px_rgba(255,149,8,0.25)]"
          />
        </div>
      </div>
    </section>
  );
}

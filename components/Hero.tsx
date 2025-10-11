// components/Hero.tsx
'use client';

import Image from 'next/image';
import Galaxy from './Galaxy';

export default function Hero() {
  return (
    <section
      className="relative min-h-[92vh] w-full overflow-hidden bg-black text-white"
      aria-label="Hero"
    >
      {/* BACKGROUND — WebGL galaxy, tuned to React Bits look */}
      <Galaxy
        className="absolute inset-0 z-[1]"
        mouseRepulsion={true}
        mouseInteraction={true}
        density={0.45}
        glowIntensity={0.18}
        saturation={0.18}
        hueShift={220}
        speed={0.6}
        starSpeed={0.3}
        twinkleIntensity={0.25}
        rotationSpeed={0.06}
        transparent={true}
      />

      {/* WARM ORANGE UNDERGLOW */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[30vh] z-[2] mx-auto h-[60vh] w-[90vw] rounded-[50%] blur-[160px]"
        style={{
          background:
            'radial-gradient(ellipse at bottom right, rgba(255,78,0,0.25) 0%, rgba(0,0,0,0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* WORDMARK (static) */}
      <div className="relative z-[3] mx-auto flex min-h-[92vh] max-w-[1400px] items-center justify-center px-6">
        <Image
          src="/assets/wordmark_full.svg"  // your uploaded file
          alt="THE ROCKET GUY"
          width={1400}
          height={280}
          priority
          className="w-[92vw] max-w-[1200px] select-none"
        />
      </div>

      {/* SOFT FADE TO NEXT SECTION */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}

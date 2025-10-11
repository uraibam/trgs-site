// components/Hero.tsx
'use client';

import Galaxy from './Galaxy';

export default function Hero() {
  return (
    <section className="relative h-[88svh] min-h-[560px] overflow-hidden bg-black">
      {/* Starfield background (React Bits vibe, not rainbow) */}
      <div className="absolute inset-0 pointer-events-none">
        <Galaxy
          density={1.1}
          saturation={0.12}
          hueShift={220}
          glowIntensity={0.35}
          twinkleIntensity={0.22}
          mouseInteraction={false}
          mouseRepulsion={false}
          transparent={false}
        />
      </div>

      {/* Subtle warm glow behind wordmark (very gentle) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 40% at 50% 58%, rgba(255,149,8,0.18) 0%, rgba(0,0,0,0) 60%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Centered wordmark */}
      <div className="relative z-10 grid place-items-center h-full">
        <img
          src="/assets/wordmark_full.svg"
          alt="THE ROCKET GUY"
          className="w-[min(90vw,1000px)] select-none block"
          style={{ filter: 'drop-shadow(0 0 40px rgba(255,149,8,0.18))' }}
          draggable={false}
        />
      </div>
    </section>
  );
}

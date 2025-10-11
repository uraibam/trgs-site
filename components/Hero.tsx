import dynamic from 'next/dynamic';
const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black">
      {/* Galaxy stars (opaque) */}
      <Galaxy />

      {/* Warm orange glow under the wordmark */}
      <div className="pointer-events-none absolute inset-x-0 top-[28vh] mx-auto h-[56vh] w-[86vw] rounded-[50%]
                      bg-[radial-gradient(ellipse_at_center,rgba(255,78,0,0.25)_0%,rgba(0,0,0,0)_65%)]
                      blur-3xl" />

      {/* Soft fade to black into next section */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black" />

      {/* Wordmark + animations */}
      <div className="relative z-10 flex min-h-[92vh] items-center justify-center">
        <div className="relative w-[min(92vw,1200px)]">
          {/* Your golden wordmark */}
          <img
            src="/assets/wordmark_full.svg"
            alt="THE ROCKET GUY"
            className="w-full select-none pointer-events-none"
            draggable={false}
          />

          {/* ---- SVG rocket path (SMIL). Always begins at 0s. ---- */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                <stop offset="40%"  stopColor="rgba(255,255,255,0.45)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
              </linearGradient>
              <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Adjust M/L points to sit on the K diagonal visually */}
            <path id="flight" d="M50 18 L59 8"
              stroke="url(#trail)" strokeWidth="1.6" strokeLinecap="round" fill="none" filter="url(#trailGlow)">
              <animate attributeName="stroke-dasharray" values="0,50; 12,50" dur="1.6s" begin="0s" fill="freeze"/>
              <animate attributeName="stroke-dashoffset" values="0; -12" dur="1.6s" begin="0s" fill="freeze"/>
              <animate attributeName="opacity" values="1; 0.6" begin="1.6s" dur="0.6s" fill="freeze"/>
            </path>

            <g fill="#fff" opacity="1">
              <path d="M0 0 L2.5 1.2 L0 2.4 L0.7 1.2 Z" />
              <animateMotion dur="1.6s" begin="0s" fill="freeze">
                {/* both href + xlinkHref for older browsers */}
                <mpath href="#flight" xlinkHref="#flight" />
              </animateMotion>
              <animate attributeName="opacity" values="1;0" begin="1.6s" dur="0.4s" fill="freeze"/>
            </g>
          </svg>

          {/* ---- CSS fallback animation (works even if SMIL is off) ---- */}
          <div className="rocket-fallback pointer-events-none absolute inset-0">
            {/* Tweak the four CSS variables below to nudge position */}
            <div className="rocket-trail" style={{ 
              // start (x1,y1) → end (x2,y2) in percentage of this overlay box
              // these match the path above roughly; adjust if needed
              // @ts-ignore – custom properties
              ['--x1' as any]: '50%', ['--y1' as any]: '60%',
              ['--x2' as any]: '59%', ['--y2' as any]: '40%'
            }} />
            <div className="rocket-dot" style={{ 
              ['--x1' as any]: '50%', ['--y1' as any]: '60%',
              ['--x2' as any]: '59%', ['--y2' as any]: '40%'
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}

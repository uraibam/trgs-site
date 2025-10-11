import dynamic from 'next/dynamic';

const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black">
      {/* Galaxy (now opaque so stars are guaranteed visible) */}
      <Galaxy className="opacity-100" />

      {/* Warm orange glow below the wordmark */}
      <div className="pointer-events-none absolute inset-x-0 top-[28vh] mx-auto h-[56vh] w-[86vw] rounded-[50%]
                      bg-[radial-gradient(ellipse_at_center,rgba(255,78,0,0.25)_0%,rgba(0,0,0,0)_65%)]
                      blur-3xl" />

      {/* Subtle fade to black */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />

      {/* Wordmark + animated rocket trail */}
      <div className="relative z-10 flex min-h-[92vh] items-center justify-center">
        <div className="relative w-[min(92vw,1200px)]">
          {/* Use your golden wordmark */}
          <img
            src="/assets/wordmark_full.svg"
            alt="THE ROCKET GUY"
            className="w-full select-none pointer-events-none drop-shadow-[0_0_56px_rgba(255,78,0,0.35)]"
            draggable={false}
          />

          {/* Trail & rocket overlay */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.0)" />
                <stop offset="35%"  stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
              </linearGradient>
              <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Tweak this path so it sits exactly on your “K” slash */}
            <path id="flight" d="M50 18 L59 8"
              stroke="url(#trail)" strokeWidth="1.6" strokeLinecap="round" fill="none" filter="url(#trailGlow)">
              <animate attributeName="stroke-dasharray" values="0,50; 12,50" dur="1.4s" begin="0s" fill="freeze"
                       keySplines="0.2 0.8 0.2 1" calcMode="spline"/>
              <animate attributeName="stroke-dashoffset" values="0; -12" dur="1.4s" begin="0s" fill="freeze"
                       keySplines="0.2 0.8 0.2 1" calcMode="spline"/>
              <animate attributeName="opacity" values="1; 0.7" begin="1.4s" dur="0.6s" fill="freeze"/>
            </path>

            {/* Tiny rocket that rides the path */}
            <g fill="#fff" opacity="1">
              <path d="M0 0 L2.4 1.2 L0 2.4 L0.6 1.2 Z" />
              <animateMotion dur="1.4s" begin="0s" fill="freeze" keySplines="0.2 0.8 0.2 1" calcMode="spline">
                <mpath href="#flight" />
              </animateMotion>
              <animate attributeName="opacity" values="1; 0" begin="1.4s" dur="0.4s" fill="freeze"/>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

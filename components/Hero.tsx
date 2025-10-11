import dynamic from 'next/dynamic';

const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black">
      {/* Galaxy background */}
      <Galaxy />

      {/* Warm orange glow behind wordmark (very soft) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[55vh] w-[85vw] rounded-[50%]
                      bg-[radial-gradient(ellipse_at_center,rgba(255,78,0,0.20)_0%,rgba(0,0,0,0)_65%)]
                      blur-3xl" />

      {/* Subtle top-to-bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black" />

      {/* Wordmark + animated rocket overlay */}
      <div className="relative z-10 flex min-h-[92vh] items-center justify-center">
        <div className="relative w-[min(92vw,1200px)]">
          {/* static white wordmark */}
          <img
            src="/assets/rocket_wordmark_white.svg"
            alt="THE ROCKET GUY"
            className="w-full select-none pointer-events-none
                       drop-shadow-[0_0_56px_rgba(255,78,0,0.35)]"
            draggable={false}
          />

          {/* overlay SVG for the diagonal slash trail + rocket */}
          {/* Coordinates use a normalized 100x30 viewBox so it scales with the image */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full"
            viewBox="0 0 100 30"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
              </linearGradient>
              <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Diagonal flight path: tweak these coords if your K position differs */}
            <path
              id="flight"
              d="M50 18 L59 8"
              stroke="url(#trail)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              filter="url(#trailGlow)"
            >
              {/* dash draw animation */}
              <animate
                attributeName="stroke-dasharray"
                values="0,50; 12,50"
                dur="1.2s"
                fill="freeze"
                keySplines="0.2 0.8 0.2 1"
                calcMode="spline"
              />
              <animate
                attributeName="stroke-dashoffset"
                values="0; -12"
                dur="1.2s"
                fill="freeze"
                keySplines="0.2 0.8 0.2 1"
                calcMode="spline"
              />
              {/* Fade the trail slightly at the end */}
              <animate
                attributeName="opacity"
                values="1; 0.7"
                begin="1.2s"
                dur="0.6s"
                fill="freeze"
              />
            </path>

            {/* Small rocket shape that rides the path */}
            <g fill="#fff" opacity="1">
              <path id="rocketShape" d="M0 0 L2.4 1.2 L0 2.4 L0.6 1.2 Z" />
              <animateMotion dur="1.2s" fill="freeze" keySplines="0.2 0.8 0.2 1" calcMode="spline">
                <mpath xlinkHref="#flight" />
              </animateMotion>
              <animate attributeName="opacity" values="1; 0" begin="1.2s" dur="0.4s" fill="freeze" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

'use client';

import dynamic from 'next/dynamic';
const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black">
      {/* 0) CSS starfield fallback (always visible, sits behind everything) */}
      <div className="pointer-events-none absolute inset-0 z-0 css-starfield" />

      {/* 1) WebGL galaxy stars (opaque); if WebGL fails, CSS starfield is still there */}
      <Galaxy className="z-[1]" />

      {/* 2) Warm orange glow under the wordmark */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[28vh] z-[2] mx-auto h-[56vh] w-[86vw] rounded-[50%] blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,78,0,0.28) 0%, rgba(0,0,0,0) 65%)',
        }}
      />

      {/* 3) Soft fade to black into next section (kept subtle so stars are visible) */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-black/10 to-black" />

      {/* 4) Wordmark + rocket animation overlays */}
      <div className="relative z-[4] flex min-h-[92vh] items-center justify-center">
        <div className="relative w-[min(92vw,1200px)]">
          {/* Your golden wordmark (don’t recolor) */}
          <img
            src="/assets/wordmark_full.svg"
            alt="THE ROCKET GUY"
            className="w-full select-none pointer-events-none"
            draggable={false}
          />

          {/* 4A) SVG rocket + SMIL path (if supported) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full z-[5]"
            viewBox="0 0 100 30"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.45)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
              </linearGradient>
              <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Adjust these two numbers to fine-tune over the “K” */}
            <path
              id="flight"
              d="M50 18 L59 8"
              stroke="url(#trail)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              filter="url(#trailGlow)"
            >
              <animate attributeName="stroke-dasharray" values="0,50; 12,50" dur="1.6s" begin="0s" fill="freeze" />
              <animate attributeName="stroke-dashoffset" values="0; -12" dur="1.6s" begin="0s" fill="freeze" />
              <animate attributeName="opacity" values="1; 0.6" begin="1.6s" dur="0.6s" fill="freeze" />
            </path>

            <g fill="#fff" opacity="1">
              <path d="M0 0 L2.5 1.2 L0 2.4 L0.7 1.2 Z" />
              <animateMotion dur="1.6s" begin="0s" fill="freeze">
                <mpath href="#flight" xlinkHref="#flight" />
              </animateMotion>
              <animate attributeName="opacity" values="1;0" begin="1.6s" dur="0.4s" fill="freeze" />
            </g>
          </svg>

          {/* 4B) CSS fallback rocket (works if SMIL is blocked, e.g., some Safari) */}
          <div className="pointer-events-none absolute inset-0 z-[6]">
            <div
              className="rf-trail"
              style={
                {
                  // tweak these to match the K slash in your layout
                  ['--x1' as any]: '50%',
                  ['--y1' as any]: '60%',
                  ['--x2' as any]: '59%',
                  ['--y2' as any]: '40%',
                } as React.CSSProperties
              }
            />
            <div
              className="rf-dot"
              style={
                {
                  ['--x1' as any]: '50%',
                  ['--y1' as any]: '60%',
                  ['--x2' as any]: '59%',
                  ['--y2' as any]: '40%',
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </div>

      {/* Inline global CSS: starfield + fallback rocket keyframes.
         Using inline styles here removes any dependency on other CSS files. */}
      <style jsx global>{`
        /* ---------- CSS STARFIELD (fallback + layer with Galaxy) ---------- */
        .css-starfield {
          background:
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8), transparent 2px),
            radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.7), transparent 2px),
            radial-gradient(1.2px 1.2px at 80% 30%, rgba(255,255,255,0.9), transparent 3px),
            radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.6), transparent 2px),
            radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.7), transparent 2px),
            radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.7), transparent 2px),
            radial-gradient(1.4px 1.4px at 20% 60%, rgba(255,255,255,0.8), transparent 3px);
          background-repeat: repeat;
          background-size: 600px 600px;
          animation: star-pan 60s linear infinite;
          opacity: 0.9; /* bright enough on black */
        }
        @keyframes star-pan {
          from { background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
          to   { background-position: -1200px -800px, -900px -300px, -1400px -500px, -1100px -1000px, -800px -1100px, -1300px -700px, -600px -1000px; }
        }

        /* ---------- CSS ROCKET FALLBACK ---------- */
        .rf-trail, .rf-dot {
          position: absolute;
          transform: translate(-50%, -50%);
          left: var(--x1);
          top: var(--y1);
        }

        .rf-trail {
          width: 2px;
          height: 0;
          background: linear-gradient(to top left, rgba(255,255,255,0), rgba(255,255,255,0.95));
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.8));
          transform-origin: bottom left;
          animation: rf-grow 1.6s ease-out forwards;
        }

        .rf-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #fff;
          animation: rf-move 1.6s ease-out forwards, rf-fade 0.4s ease-out 1.6s forwards;
        }

        @keyframes rf-move {
          from { left: var(--x1); top: var(--y1); }
          to   { left: var(--x2); top: var(--y2); }
        }
        @keyframes rf-grow {
          0%   { height: 0; opacity: 1; }
          100% { height: 160px; opacity: 0.6; }
        }
        @keyframes rf-fade { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </section>
  );
}

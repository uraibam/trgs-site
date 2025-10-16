'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const SUBSCRIBE_URL = 'https://subscribepage.io/FounderConfessions';

export default function Newsletter() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-title"
      className="bg-[var(--bg)] text-[var(--text)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          {/* Background image (full-bleed) */}
          <div className="relative h-[260px] md:h-[360px] lg:h-[420px]">
            <Image
              src="/assets/amin_newsletter.png"
              alt="Amin speaking"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover grayscale"
            />
            {/* Left scrim for legibility */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
            />
          </div>

          {/* Left text block overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="pointer-events-auto px-6 md:px-10 lg:px-12">
              <div className="max-w-xl">
                <h2
                  id="newsletter-title"
                  className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight"
                  style={{ textTransform: 'uppercase' }}
                >
                  <span className="block">The 3%</span>
                  <span className="block">Newsletter</span>
                </h2>

                <p className="mt-3 text-sm md:text-base text-white/80">
                  3% Founder companion stack
                </p>

                <div className="mt-5">
                  <motion.a
                    href={SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={prefersReduced ? undefined : { scale: 1.02, y: -2 }}
                    whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center justify-center rounded-lg bg-[color:var(--flare)]
                               px-4 md:px-5 py-2.5 md:py-3 font-semibold text-black
                               shadow-[0_8px_30px_rgba(255,78,0,0.25)]
                               hover:bg-[color:var(--glow)]
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Sign up to newsletter
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Top hairline so the card matches page chrome */}
          <div aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </section>
  );
}

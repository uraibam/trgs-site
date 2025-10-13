'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

type Props = {
  /** flip to true later if you want to show a small diagram/visual on the right */
  showVisual?: boolean;
  visualSrc?: string; // e.g. "/assets/trgs-covenant.svg"
  visualAlt?: string;
  bookHref?: string;
  downloadHref?: string;
};

export default function Philosophy({
  showVisual = false,
  visualSrc,
  visualAlt = '',
  bookHref = '/#book-amin',
  downloadHref = '/assets/founder-vs-manager.pdf',
}: Props) {
  const prefersReduced = useReducedMotion();

  const container = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="relative isolate border-t border-white/5"
    >
      {/* very soft warm vignette that blends up from Proof */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 inset-x-0 h-24
                   bg-gradient-to-b from-black/0 via-[#FF4E00]/[0.06] to-black/0"
      />

      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          className="grid items-start gap-10 md:grid-cols-12"
        >
          <div className="md:col-span-8">
            <h2
              id="philosophy-title"
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
            >
              Amin: The Architect of the 3%
            </h2>

            {/* warm underline glow */}
            <div
              aria-hidden
              className="mt-2 h-1 w-20 rounded-full
                         bg-[radial-gradient(closest-side,_theme(colors.orange.500),_transparent_60%)]"
            />

            <div className="prose prose-invert prose-p:leading-relaxed mt-6 max-w-none">
              <p>
                Amin is not a consultant, nor a coach. He is a builder of ecosystems. Known as The
                Rocket Guy, he has lived at the collision of science, philosophy, and venture
                creation. From engineering nanotechnology to reshaping startup futures, Amin has
                turned complexity into clarity for those driven to build beyond convention. Through
                Phoenix Venture House, he founded TRGs as a covenant for the rare 3% who refuse
                excuses, and instead choose to build what others only imagine.
              </p>
              <p>
                His work fuses systems thinking and designing frameworks that turn reflection into
                measurable progress. Every model, from Founder Mode to OKRs Philosophy, embodies his
                pursuit of aligning soul, mind, and system so progress becomes intentional, not
                accidental.
              </p>
              <p>
                At TRGs, Amin’s philosophy is simple:{' '}
                <strong>clarity for founders, systems for teams, and fire for CEOs.</strong> His
                life’s work is dedicated to the 3% who build not just companies, but civilizations
                of meaning.
              </p>
            </div>

            /*<div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={bookHref}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5
                           text-sm font-medium text-white ring-1 ring-white/15
                           hover:bg-white/15 hover:ring-white/20 focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                           focus-visible:ring-white/50 transition"
              >
                Book Amin
              </Link>*/

              <Link
                href={downloadHref}
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2.5
                           text-sm font-medium text-white/80 ring-1 ring-white/15
                           hover:text-white hover:bg-white/5 hover:ring-white/25
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-offset-2 focus-visible:ring-offset-black
                           focus-visible:ring-white/50 transition"
              >
                Download the Founder Mode Guide
              </Link>
            </div>
          </div>

          {/* Optional small visual slot (kept off for now to avoid overwhelming the page) */}
          {showVisual && visualSrc ? (
            <div className="md:col-span-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visualSrc}
                alt={visualAlt}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4
                           shadow-[0_0_80px_-30px_rgba(255,149,8,0.25)]"
                loading="lazy"
                decoding="async"
              />
              <p className="mt-3 text-xs text-white/50">
                Diagram preview — swap with any framework (e.g., 3% Covenant, TAS Model, RPSW).
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import data from '../content/pillars.json';

type PillarCard = {
  title: string;
  oneLiner: string;
  icon?: string; // ignored (iconless)
};

type PillarsData = {
  title: string;
  subhead: string;
  cards: PillarCard[];
};

export default function Pillars() {
  const prefersReduced = useReducedMotion();
  const { title, subhead, cards } = data as PillarsData;

  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hijackWheel, setHijackWheel] = useState(true); // End/Esc turns this off

  const safeCards = useMemo(() => cards ?? [], [cards]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
    };

    const onWheel = (e: WheelEvent) => {
      if (!hijackWheel) return; // allow normal page scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // already horizontal
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'End' || e.key === 'Escape') setHijackWheel(false);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel as EventListener, { passive: false });
    window.addEventListener('keydown', onKey);
    onScroll();

    const onResize = () => onScroll();
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', onScroll as EventListener);
      el.removeEventListener('wheel', onWheel as EventListener);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [hijackWheel]);

  return (
    <section
      id="pillars"
      aria-labelledby="pillars-title"
      className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-4">
          <h2
            id="pillars-title"
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            {title}
          </h2>
        <p className="mt-1 text-white/70 max-w-2xl">{subhead}</p>
        </header>

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02]">
          {/* Edge glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-16 rounded-l-2xl
                       bg-gradient-to-r from-[rgba(255,78,0,0.08)] to-transparent z-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 rounded-r-2xl
                       bg-gradient-to-l from-[rgba(255,78,0,0.08)] to-transparent z-10"
          />

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-[color:var(--flare)]/70"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Rail */}
          <div
            ref={railRef}
            className="relative z-0 flex gap-6 overflow-x-auto scroll-smooth px-6 py-8 md:py-10 snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
            aria-label="TRGS Stack filmstrip"
          >
            {safeCards.map((card, idx) => (
              <motion.article
                key={`${card.title}-${idx}`}
                className="snap-center shrink-0 w-[280px] md:w-[320px] lg:w-[360px]"
                whileHover={
                  prefersReduced ? undefined : { scale: 1.02, translateY: -4 }
                }
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 h-full">
                  <h3 className="text-lg md:text-xl font-medium tracking-tight">
                    {card.title}
                  </h3>

                  {/* Abstract gradient tile (media placeholder) */}
                  <div
                    aria-hidden
                    className="mt-5 h-36 md:h-40 rounded-xl ring-1 ring-white/10
                               bg-[radial-gradient(100%_80%_at_50%_10%,rgba(255,149,8,0.18),transparent_60%)]"
                  />

                  <p className="mt-4 text-sm md:text-base text-white/80 leading-relaxed">
                    {card.oneLiner}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* SR-only list for accessibility */}
        <ul className="sr-only">
          {safeCards.map((c, i) => (
            <li key={i}>
              {c.title} — {c.oneLiner}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import journey from '../content/journey.json';

type Item = {
  title: string;
  caption: string;
  image: string;
  alt?: string;
  placeholder?: boolean;
};
type Phase = { name: string; items: Item[] };

const CAPTION_MAX = 80; // truncate per-tile to keep the rail tidy

function truncate(s: string, n: number) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export default function Journey() {
  const phases = (journey as { phases: Phase[] }).phases;

  // Flatten items for the rail
  const flat = useMemo(
    () =>
      phases.flatMap((p) =>
        p.items.map((i) => ({
          phase: p.name,
          title: i.title,
          caption: i.caption,
          image: i.image,
          alt: i.alt || i.title,
        })),
      ),
    [phases],
  );

  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Compute phase name for the active center card
  const activePhase = useMemo(() => {
    if (!flat.length) return '';
    return flat[activeIndex]?.phase ?? '';
  }, [flat, activeIndex]);

  // Recompute active index on scroll (closest card center to container center)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const children = Array.from(rail.children) as HTMLElement[];
        if (!children.length) return;

        const center = rail.scrollLeft + rail.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;

        children.forEach((el, idx) => {
          const left = (el as HTMLElement).offsetLeft;
          const width = (el as HTMLElement).offsetWidth;
          const cardCenter = left + width / 2;
          const d = Math.abs(cardCenter - center);
          if (d < bestDist) {
            bestDist = d;
            best = idx;
          }
        });
        setActiveIndex(best);
        ticking = false;
      });
    };

    // translate vertical wheel to horizontal scroll without fighting native inertia
    const onWheel = (e: WheelEvent) => {
      // if horizontal intent already, let it pass
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      rail.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    };

    rail.addEventListener('scroll', onScroll, { passive: true });
    rail.addEventListener('wheel', onWheel as EventListener, { passive: false });
    // fire once for initial phase
    onScroll();

    const onResize = () => onScroll();
    window.addEventListener('resize', onResize);

    return () => {
      rail.removeEventListener('scroll', onScroll as EventListener);
      rail.removeEventListener('wheel', onWheel as EventListener);
      window.removeEventListener('resize', onResize);
    };
  }, [flat.length]);

  return (
    <section id="journey" className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header copy aligned with Philosophy section scale */}
        <header className="mb-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            The Journey Forged in Fire
          </h2>
          <p className="mt-1 text-white/70 max-w-2xl">
            Not years. Phases. Pivots that shaped the method.
          </p>
        </header>

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02]">
          {/* Edge glows */}
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

          {/* Phase chip inside container */}
          <div className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/90">
            <span className="opacity-80">Phase:</span>
            <span className="ml-2 font-medium">{activePhase}</span>
          </div>

          {/* Rail */}
          <div
            ref={railRef}
            className="relative z-0 flex gap-6 overflow-x-auto scroll-smooth px-6 py-8 md:py-10
                       snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {flat.map((it, idx) => {
              // distance from active index for subtle vertical offset & rotation
              const delta = Math.abs(idx - activeIndex);
              const lift = Math.max(0, 16 - delta * 6); // px up for cards near center
              const tilt = Math.min(1.5, delta * 0.6); // deg

              return (
                <motion.article
                  key={`${it.phase}-${it.title}-${idx}`}
                  className="snap-center shrink-0 w-[220px] md:w-[260px] lg:w-[300px]"
                  style={{ translateY: `-${lift}px` }}
                  initial={false}
                  whileHover={{ scale: 1.02, rotateZ: -Math.sign(idx - activeIndex) * 1.2 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  <div className="relative h-[320px] md:h-[360px] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/[0.03]">
                    <Image
                      src={it.image}
                      alt={it.alt ?? it.title}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
                      priority={idx < 3}
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-snug text-white/85">
                    {truncate(it.caption, CAPTION_MAX)}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Screen-reader friendly list */}
        <ul className="sr-only">
          {phases.map((p, pi) =>
            p.items.map((i, ii) => (
              <li key={`${pi}-${ii}`}>
                {p.name} - {i.title}: {i.caption}
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}

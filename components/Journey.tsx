'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CircularGallery from './circular-gallery/CircularGallery';
import journey from '../content/journey.json';


type Phase = { name: string; items: { title: string; caption: string; image: string; alt?: string; placeholder?: boolean }[] };

export default function SectionJourney() {
  const phases = journey.phases as Phase[];
  const flatItems = useMemo(
    () =>
      phases.flatMap(p =>
        p.items.map(i => ({
          image: i.image,
          text: i.caption,
          alt: i.alt || i.title
        }))
      ),
    [phases]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [seen, setSeen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Map index to phase name
  const indexToPhase = (idx: number) => {
    let count = 0;
    for (const p of phases) {
      const next = count + p.items.length;
      if (idx < next) return p.name;
      count = next;
    }
    return phases[phases.length - 1]?.name ?? '';
  };

  const activePhase = indexToPhase(activeIndex);

  return (
    <section id="journey" ref={sectionRef} className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <header className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Journey</h2>
          <p className="mt-2 text-white/70 max-w-2xl">
            Years and moments that shaped the TRGS approach.
          </p>
          <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-white/80">
            <span className="opacity-80">Phase:</span>
            <span className="ml-2 font-medium text-white">{activePhase}</span>
          </div>
        </header>

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-[1px]">
          <CircularGallery
            items={flatItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
            onIndexChange={handleIndexChange}
          />
        </div>

        {/* Offscreen accessible list for screen readers */}
        <ul className="sr-only">
          {phases.map((p, pi) =>
            p.items.map((i, ii) => (
              <li key={`${pi}-${ii}`}>
                {p.name} — {i.title}: {i.caption}
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

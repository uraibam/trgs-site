'use client';

import { useMemo, useState } from 'react';
import Gallery from './Gallery';
import journey from '../content/journey.json';

type Item = {
  title: string;
  caption: string;
  image: string;
  alt?: string;
  placeholder?: boolean;
};

type Phase = {
  name: string;
  items: Item[];
};

export default function Journey() {
  const phases = (journey as { phases: Phase[] }).phases;

  // Flatten items for the Gallery input
  const flatItems = useMemo(
    () =>
      phases.flatMap((p) =>
        p.items.map((i) => ({
          image: i.image,
          text: i.caption,
          alt: i.alt || i.title,
        })),
      ),
    [phases],
  );

  // Active tile index reported by Gallery (center snap)
  const [activeIndex, setActiveIndex] = useState(0);

  // Map a flat index to its phase name
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

  const handleIndexChange = (i: number) => setActiveIndex(i);

  return (
    <section id="journey" className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Copy updated */}
        <header className="mb-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            The Journey Forged in Fire
          </h2>
          <p className="mt-1 text-white/70 max-w-2xl">
            Not years. Phases. Pivots that shaped the method.
          </p>
        </header>

        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-[1px]">
          {/* Phase chip inside the gallery */}
          <div className="gallery-phase-chip">
            <span style={{ opacity: 0.8, marginRight: 6 }}>Phase:</span>
            <span style={{ fontWeight: 600 }}>{activePhase}</span>
          </div>

          <Gallery
            items={flatItems}
            bend={2}
            textColor="#ffffff"
            borderRadius={0.12}
            scrollSpeed={1.6}
            scrollEase={0.12}
            onIndexChange={handleIndexChange}
          />
        </div>

        {/* Offscreen accessible list for screen readers */}
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

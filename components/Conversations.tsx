'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import data from '../content/conversations.json';

type Episode = {
  id: string;
  title: string;
  guest?: string;
  image: string;
  youtube: string;
};

type ConversationsData = {
  title: string;
  subhead?: string;
  episodes: Episode[];
  platforms?: { name: string; href: string }[];
};

export default function Conversations() {
  const prefersReduced = useReducedMotion();
  const { title, subhead, episodes, platforms } = data as ConversationsData;

  return (
    <section
      id="conversations"
      aria-labelledby="conversations-title"
      className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Banner / strip */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(120%_140%_at_50%_-20%,rgba(255,149,8,0.18),transparent_60%)] p-6 md:p-8">
          <h2
            id="conversations-title"
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            {title}
          </h2>
          {subhead ? (
            <p className="mt-1 text-white/70">{subhead}</p>
          ) : null}
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((ep, idx) => (
            <a
              key={ep.id}
              href={ep.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={ep.image}
                  alt={`${ep.title}${ep.guest ? ` — ${ep.guest}` : ''}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  priority={idx === 0}
                  className="object-cover"
                />
                {/* Play overlay */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                  initial={false}
                  animate={
                    prefersReduced
                      ? { backgroundColor: 'rgba(0,0,0,0.0)' }
                      : undefined
                  }
                >
                  <motion.div
                    className="rounded-full bg-black/50 ring-1 ring-white/30 p-4"
                    whileHover={prefersReduced ? undefined : { scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                  >
                    {/* Play triangle */}
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path d="M10 8L20 14L10 20V8Z" fill="currentColor" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Subtle dark gradient for legibility */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24
                             bg-gradient-to-t from-black/55 via-black/20 to-transparent"
                />
              </div>

              <div className="p-4">
                <h3 className="text-base md:text-lg font-medium tracking-tight">
                  {ep.title}
                </h3>
                {ep.guest ? (
                  <p className="mt-1 text-sm text-white/70">with {ep.guest}</p>
                ) : null}
              </div>
            </a>
          ))}
        </div>

        {/* Platform row (placeholder links) */}
        {platforms && platforms.length ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href /* TODO: replace '#' with real platform URLs */}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/85 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {p.name}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

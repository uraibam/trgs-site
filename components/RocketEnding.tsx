'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type Social = { name: string; href: string; icon: React.ReactNode };

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path
        fill="currentColor"
        d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.7 3 12 3 12 3s-6.7 0-8.7.4A4 4 0 0 0 .5 6.2C.1 8.2.1 12 .1 12s0 3.8.4 5.8a4 4 0 0 0 2.8 2.8C5.3 21 12 21 12 21s6.7 0 8.7-.4a4 4 0 0 0 2.8-2.8c.4-2 .4-5.8.4-5.8s0-3.8-.4-5.8zM9.8 15.5V8.5l6 3.5-6 3.5z"
      />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.8a1 1 0 1 1 1.4 1.4A1 1 0 0 1 18 6.8z"
      />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path
        fill="currentColor"
        d="M14.5 2h2c.3 2.2 1.7 3.8 3.5 4.4v2c-1.6-.1-3-.7-4.3-1.7v7.2c0 3.3-2.6 6-5.9 6.1A6 6 0 0 1 3.9 14a6 6 0 0 1 6.6-5.9v2.3a3.7 3.7 0 1 0 3.7 3.7V2z"
      />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path
        fill="currentColor"
        d="M3 3h4.4l5 6.6 5.8-6.6H21l-7.4 8.4L21 21h-4.4l-5.3-7-6 7H3l7.7-8.9L3 3z"
      />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path
        fill="currentColor"
        d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM10 9h3.8v1.8h.1c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8V21h-4v-5.3c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-4V9z"
      />
    </svg>
  );
}

export default function RocketEnding() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Translate image gently up as user scrolls the section
  const y = prefersReduced ? 0 : useTransform(scrollYProgress, [0, 1], [0, -16]);

  const socials: Social[] = [
    { name: 'YouTube', href: '#', icon: <IconYouTube /> },       // TODO: replace with real URL
    { name: 'Instagram', href: '#', icon: <IconInstagram /> },   // TODO
    { name: 'TikTok', href: '#', icon: <IconTikTok /> },          // TODO
    { name: 'X', href: '#', icon: <IconX /> },                    // TODO
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/therocketguy/', icon: <IconLinkedIn /> }
  ];

  return (
    <section id="rocket" className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Join the Journey</h2>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          {/* Rocket image with subtle parallax */}
          <motion.div style={{ y }}>
            <div className="relative h-[280px] md:h-[420px] lg:h-[520px]">
              <Image
                src="/assets/rocket.png"
                alt="Rocket — cinematic ending"
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
                decoding="async"
              />
              {/* Soft vignette for cinematic feel */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(0,0,0,0.05),rgba(0,0,0,0.45))]"
              />
            </div>
          </motion.div>
        </div>

        {/* Socials */}
        <nav aria-label="Social links" className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04]
                         px-4 py-2 text-sm text-white/85 hover:bg-white/[0.10] hover:text-white
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span className="opacity-80">{s.icon}</span>
              <span>{s.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

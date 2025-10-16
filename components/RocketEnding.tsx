'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import React from 'react';

const LINKS = {
  youtube: '#',                 // TODO: replace when ready
  instagram: '#',               // TODO
  tiktok: '#',                  // TODO
  facebook: '#',                // TODO
  linkedin: 'https://www.linkedin.com/in/therocketguy/',
};

function IconRocket() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M14.2 2c-2.6 1.1-5.1 3.7-6.7 6.4l-2.3.5c-.9.2-1.6.9-1.8 1.8l-.6 2.6 2.6-.6c.9-.2 1.6-.9 1.8-1.8l.5-2.2C10.5 6.9 13 4.5 14.9 3.8c.4-.1.8.2.7.6-.2 1.1-.6 3.2-1.7 5.2l-3.2 3.2c-1.4 2.4-1.9 4.8-2 6-.1.5.4.9.8.7 1.3-.5 3.7-1.2 6-2l3.2-3.2c2-1.1 4.1-1.5 5.2-1.7.4-.1.7.3.6.7-.7 1.9-3.1 4.4-4.7 6.2l-2.2.5c-.9.2-1.6.9-1.8 1.8l-.6 2.6 2.6-.6c.9-.2 1.6-.9 1.8-1.8l.5-2.3c2.7-1.6 5.3-4.2 6.4-6.7.6-1.4.1-3.1-1.1-4.2-1.3-1.3-3-1.7-4.4-1.1C18.5 5 17 3.5 16 2.7 15.3 2.1 14.7 1.8 14.2 2z"
      />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path fill="currentColor" d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.7 3 12 3 12 3s-6.7 0-8.7.4A4 4 0 0 0 .5 6.2C.1 8.2.1 12 .1 12s0 3.8.4 5.8a4 4 0 0 0 2.8 2.8C5.3 21 12 21 12 21s6.7 0 8.7-.4a4 4 0 0 0 2.8-2.8c.4-2 .4-5.8.4-5.8s0-3.8-.4-5.8zM9.8 15.5V8.5l6 3.5-6 3.5z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm6-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path fill="currentColor" d="M14.5 2h2c.3 2.2 1.7 3.8 3.5 4.4v2c-1.6-.1-3-.7-4.3-1.7v7.2c0 3.3-2.6 6-5.9 6.1A6 6 0 0 1 3.9 14a6 6 0 0 1 6.6-5.9v2.3a3.7 3.7 0 1 0 3.7 3.7V2z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path fill="currentColor" d="M13 22V12h3.2l.5-3.8H13V6.1c0-1.1.3-1.9 1.9-1.9h1.9V.6C16.4.4 15.1.3 13.8.3 10.9.3 9 2 9 5.6v2.6H6v3.8h3V22h4z" />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM10 9h3.8v1.8h.1c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8V21h-4v-5.3c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-4V9z" />
    </svg>
  );
}

export default function RocketEnding() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = prefersReduced ? 0 : useTransform(scrollYProgress, [0, 1], [0, -16]);

  const cells: { label: string; href: string; icon?: React.ReactNode }[] = [
    { label: 'Join the Journey', href: '#', icon: <IconRocket /> },           // left title cell (non-link or site-wide CTA later)
    { label: 'YouTube', href: LINKS.youtube, icon: <IconYouTube /> },
    { label: 'Instagram', href: LINKS.instagram, icon: <IconInstagram /> },
    { label: 'TikTok', href: LINKS.tiktok, icon: <IconTikTok /> },
    { label: 'Facebook', href: LINKS.facebook, icon: <IconFacebook /> },
    { label: 'LinkedIn', href: LINKS.linkedin, icon: <IconLinkedIn /> },
  ];

  return (
    <section id="rocket" className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          {/* Artwork */}
          <motion.div style={{ y }}>
            <div className="relative h-[260px] md:h-[380px] lg:h-[440px]">
              <Image
                src="/assets/rocket.png"
                alt="Rocket — cinematic ending"
                fill
                sizes="100vw"
                className="object-cover"
                decoding="async"
                priority={false}
              />
              {/* vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(0,0,0,0.05),rgba(0,0,0,0.45))]"
              />
            </div>
          </motion.div>

          {/* Bottom dock */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto">
              <div
                className="grid divide-x divide-white/15 overflow-x-auto rounded-b-2xl border-t border-white/10
                           bg-black/85 backdrop-blur-[2px]"
                style={{ gridTemplateColumns: 'minmax(220px,1.2fr) repeat(5, minmax(88px, 1fr))' }}
              >
                {/* Left title cell */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="inline-block rounded bg-white/5 p-2 text-[color:var(--flare)]">
                    <IconRocket />
                  </span>
                  <span className="text-lg font-semibold tracking-tight uppercase">Join the Journey</span>
                </div>

                {/* Social cells */}
                {cells.slice(1).map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.label}
                    className="group flex items-center justify-center px-4 py-4 focus-visible:outline-none
                               focus-visible:ring-2 focus-visible:ring-white/60 hover:bg-white/[0.06]"
                  >
                    <span className="text-white/90 group-hover:text-white">{c.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

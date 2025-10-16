'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

const SUBSCRIBE_URL = 'https://subscribepage.io/FounderConfessions';

export default function Newsletter() {
  const prefersReduced = useReducedMotion();
  const [email, setEmail] = useState('');
  const [human, setHuman] = useState(''); // honeypot
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (human) return; // bot
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: 'error', text: 'Enter a valid email.' });
      return;
    }
    setSubmitting(true);
    setMessage({ type: 'info', text: 'Opening subscribe page…' });

    const url = `${SUBSCRIBE_URL}?email=${encodeURIComponent(email)}`;
    // Open hosted subscribe page; show inline confirmation
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setSubmitting(false);
      setMessage({ type: 'success', text: 'Check the new tab to finish subscribing.' });
    }, 300);
  }

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-title"
      className="relative bg-[var(--bg)] text-[var(--text)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          {/* Left: copy + form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h2 id="newsletter-title" className="text-3xl md:text-4xl font-semibold tracking-tight">
              The 3% Confessions
            </h2>
            <p className="mt-2 text-white/70 max-w-prose">
              Tactics and hard truths from the builder’s edge. No fluff.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              {/* Honeypot */}
              <label className="sr-only">
                Leave this field empty
                <input
                  type="text"
                  value={human}
                  onChange={(e) => setHuman(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />
              </label>

              <div>
                <label htmlFor="newsletter-email" className="block text-sm text-white/80">
                  Work email
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@work.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white placeholder-white/40
                             outline-none ring-0 focus:border-white/30"
                  required
                />
                <p className="mt-2 text-xs text-white/50">
                  No spam. One email a week. Unsubscribe anytime.
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={prefersReduced ? undefined : { scale: 1.02, y: -1 }}
                whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-xl bg-[color:var(--flare)] px-5 py-3
                           font-medium text-black hover:bg-[color:var(--glow)]
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Opening…' : 'Subscribe'}
              </motion.button>

              {/* Inline status */}
              <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                {message ? (
                  <span
                    className={
                      message.type === 'error'
                        ? 'text-red-300'
                        : message.type === 'success'
                        ? 'text-green-300'
                        : 'text-white/70'
                    }
                  >
                    {message.text}
                  </span>
                ) : null}
              </div>
            </form>
          </div>
          {/* Right: photo (bleed) */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 min-h-[360px] md:min-h-[520px]">
            <Image
              src="/assets/amin_newsletter.png"   // <-- fixed path + extension
              alt="Amin — grayscale portrait"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale"
              priority={false}
              />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(0,0,0,0),rgba(0,0,0,0.35))]"
              />
          </div>
        </div>
      </div>
    </section>
  );
}

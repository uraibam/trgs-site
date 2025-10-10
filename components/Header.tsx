// components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Minimal premium header:
 * - Wordmark (left), CTA (right)
 * - Glass/blur bg with hairline border
 * - Compresses on scroll
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/55 backdrop-blur supports-[backdrop-filter]:bg-black/45"
      aria-label="Site header"
    >
      <div
        className={[
          "mx-auto max-w-7xl px-4 sm:px-6",
          scrolled ? "h-12" : "h-16",
          "transition-[height] duration-200 ease-out",
          "flex items-center justify-between"
        ].join(" ")}
      >
        <Link href="/" aria-label="TRGS home" className="flex items-center gap-2">
          <Image
            src="/assets/wordmark_short.png"  // your uploaded logo
            alt="TRGS"
            width={160}
            height={40}
            priority
            className="h-8 w-auto select-none"
          />
        </Link>

        <a
          href="#newsletter"
          className="inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium bg-white text-black hover:bg-white/90 shadow-sm shadow-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-colors"
          aria-label="Join the 3 percent newsletter"
        >
          Join the 3%
        </a>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import LogoLoop from "./LogoLoop";

/**
 * Edit logos list here once, order is preserved.
 * (Using your real paths under /public/logos)
 */
const LOGOS = [
  "/logos/intel.svg",
  "/logos/virgin_media.png",
  "/logos/texaco.png",
  "/logos/snap_retail.png",
  "/logos/sky.png",
  "/logos/salim_habib.svg",
  "/logos/principles_you.png",
  "/logos/resource_linked.png",
  "/logos/insync.svg",
  "/logos/mohsyn.png",
  "/logos/eocean.png",
  "/logos/nick.png",
  "/logos/denning.png",
  "/logos/angel_school.png",
  "/logos/atu.png",
  "/logos/bordgais.png",
  "/logos/dcu.png",
  "/logos/decode.png",
  "/logos/duhs.png",
  "/logos/eir.png",
  "/logos/enterprise_ireland.svg",
  "/logos/ku.png",
  "/logos/nicat.png",
  "/logos/ned.png",
] as const;

const logoItems = LOGOS.map((src) => ({ src, alt: src.split("/").pop() || "logo" }));

// Placeholder metrics – update copy/values freely:
const METRICS = [
  { label: "Ventures touched", value: "50+" },
  { label: "Capital unlocked", value: "$120M+" },
  { label: "Workshops & talks", value: "120+" },
  { label: "Avg. founder NPS", value: "86" },
];

export default function ProofSection() {
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    // Micro-delay to ensure the loop paints first. Prevents any LCP/CLS risk.
    const id = setTimeout(() => setShowMetrics(true), 40);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      aria-label="Proof"
      className="relative isolate"
    >
      {/* Warm vignette that blends with the hero 
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 420px at 50% 0%, rgba(255,78,0,0.10), rgba(0,0,0,0) 60%)",
        }}
      />*/}

      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-14">
        {/* Logo Loop */}
        <div className="relative">
          <LogoLoop
            logos={logoItems}
            speed={10}                // ≈ 10 px/s subtle premium
            direction="left"
            logoHeight={32}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Clients and partners"
          />
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Metrics */}
        {showMetrics && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {METRICS.map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-semibold tracking-tight"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.82) 60%, rgba(255,78,0,0.65) 100%)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {m.value}
                </div>
                <div className="mt-2 text-sm md:text-base text-white/70">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

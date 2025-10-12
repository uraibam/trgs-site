// components/Hero.tsx
import Image from "next/image";
import Galaxy from "./Galaxy";

export default function Hero() {
  return (
    <section
      className="
        relative h-[100svh] min-h-[620px]
        w-full overflow-hidden
        isolate
      "
    >
      {/* GALAXY — tuned to match React Bits feel */}
      <Galaxy
        className="absolute inset-0"
        /* feel */
        density={0.55}           // fewer stars → more depth
        glowIntensity={0.35}
        saturation={0.12}
        hueShift={50}
        /* motion */
        speed={0.8}
        starSpeed={1.2}
        rotationSpeed={0.05}
        twinkleIntensity={0.55}
        /* interaction */
        mouseInteraction={true}
        mouseRepulsion={true}
        repulsionStrength={0.6}
        /* visuals */
        transparent={false}      // solid canvas → no alpha edge strip
      />

      {/* Wordmark (kept golden) */}
      <div
        className="
          absolute inset-0 grid place-items-center
          px-6
        "
      >
        <Image
          src="/wordmark_full.svg"
          alt="THE ROCKET GUY"
          width={1600}
          height={420}
          priority
          className="
            w-[min(92vw,1200px)]
            drop-shadow-[0_0_40px_rgba(255,149,8,0.25)]
          "
        />
      </div>

      {/* Optional vignette for contrast (very subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* Fade to black into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
        }}
      />
    </section>
  );
}

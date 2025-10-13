import Image from "next/image";
import Galaxy from "./Galaxy";

export default function Hero() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-black">
      <Galaxy className="absolute inset-0" />

      {/* Vignette for cinematic depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 55%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,1) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Subtle pulsing glow */}
        <div
          aria-hidden="true"
          className="absolute -z-10 h-[45vh] w-[65vw] rounded-full blur-3xl"
          style={{
            bottom: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,78,0,0.22) 0%, rgba(255,78,0,0.06) 60%, rgba(255,78,0,0) 100%)",
            animation: "pulseGlow 5s ease-in-out infinite",
          }}
        />

        <Image
          src="/wordmark_full.png"
          alt="THE ROCKET GUY"
          width={1400}
          height={320}
          priority
          className="w-[min(88vw,1200px)] h-auto select-none"
        />

        {/* Scroll cue */}
        <a
          href="#proof"
          className="group absolute bottom-6 md:bottom-8 inline-flex flex-col items-center gap-2 text-white/70"
          aria-label="Scroll to next section"
        >
          <svg
            className="h-4 w-4 opacity-70 group-hover:opacity-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "cueBob 2.2s ease-in-out infinite" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span className="text-xs tracking-wide">Scroll</span>
        </a>
      </div>
    </div>
  );
}

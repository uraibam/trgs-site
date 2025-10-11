// components/Hero.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Galaxy from "./Galaxy";

/**
 * Premium Hero
 * - Fullscreen galaxy background
 * - Centered wordmark with soft glow
 * - Animated rocket overlay (1.8s), fades into galaxy
 * - Warm orange gradient bottom-right
 * - Bottom fade to black for next section
 */

export default function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Galaxy background */}
      <div className="absolute inset-0 -z-10">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1.5}
          glowIntensity={0.45}
          saturation={0.7}
          hueShift={200}
          twinkleIntensity={0.35}
          rotationSpeed={0.06}
          transparent
        />
      </div>

      {/* Warm radial orange glow, bottom-right */}
      <div
        className="pointer-events-none absolute inset-0 -z-5"
        style={{
          background:
            "radial-gradient(40% 40% at 95% 95%, rgba(255,78,0,0.35) 0%, rgba(255,149,8,0.15) 30%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Center content */}
      <div className="relative z-0 mx-auto flex h-full max-w-6xl items-center justify-center px-6 text-center">
        <div className="relative">
          {/* Wordmark */}
          <Image
            src="/assets/wordmark_full.png"
            alt="The Rocket Guy"
            width={1200}
            height={300}
            priority
            className="mx-auto h-auto w-[75vw] max-w-[1100px] drop-shadow-[0_0_30px_rgba(255,78,0,0.15)]"
          />

          {/* Rocket overlay & trail */}
          <RocketLiftOff />
        </div>
      </div>

      {/* Bottom fade to black (handoff to next section) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}

/** Small rocket that lifts off from the “K” area with a soft orange trail */
function RocketLiftOff() {
  // Positioning the rocket relative to the wordmark image box
  // (tweaked visually; adjust if your PNG differs)
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Trail */}
      <motion.div
        initial={{ opacity: 0.6, scale: 0.6, x: "22%", y: "-18%", filter: "blur(10px)" }}
        animate={{ opacity: [0.6, 0.4, 0.0], scale: [0.6, 1.2, 1.6], x: ["22%", "38%"], y: ["-18%", "-34%"] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,78,0,0.55), rgba(255,78,0,0.25), rgba(0,0,0,0))",
          width: 80,
          height: 80,
          borderRadius: "50%",
          transformOrigin: "center",
        }}
      />

      {/* Rocket */}
      <motion.svg
        initial={{ opacity: 0.95, rotate: -35, x: "20%", y: "-20%" }}
        animate={{ opacity: [0.95, 0.9, 0.0], x: ["20%", "38%"], y: ["-20%", "-36%"] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        width="28"
        height="28"
        viewBox="0 0 24 24"
        className="drop-shadow-[0_0_10px_rgba(255,149,8,0.6)]"
        aria-hidden
      >
        {/* Simple rocket icon (mono) */}
        <path
          fill="#FF9508"
          d="M21 3c-4.5 1-7 3.5-9 7l-3 1 1-3c3.5-2 6-4.5 7-9 0 0 3 2 4 4zM9 14l1-1c1 1 2 2 3 3l-1 1c-2 0-4 2-4 4 0 0-1-3 1-4s4-3 0-3z"
        />
        <circle cx="14" cy="7" r="2" fill="#FFFFFF" />
      </motion.svg>
    </div>
  );
}

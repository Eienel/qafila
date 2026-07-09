"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// The hero centrepiece: a glowing fanous. An elegant SVG lantern always
// renders as the base; when a generated render exists at /hero-lantern.png it
// fades in over the top. No broken-image state, works with or without the asset.
export function HeroLantern() {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      <motion.div
        aria-hidden
        className="absolute h-3/4 w-3/4 rounded-full bg-gold-glow/40 blur-3xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <FallbackLantern flicker={!reduce} hidden={loaded} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-lantern.png"
        alt="A glowing brass fanous lantern resting on a marble pedestal"
        onLoad={() => setLoaded(true)}
        className={`absolute z-10 h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(23,19,13,0.35)] transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function FallbackLantern({ flicker, hidden }: { flicker: boolean; hidden: boolean }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={`relative z-[5] h-4/5 w-4/5 transition-opacity duration-500 ${
        hidden ? "opacity-0" : "opacity-100"
      } ${flicker ? "animate-flicker" : ""}`}
      role="img"
      aria-label="Lantern"
    >
      <defs>
        <radialGradient id="hero-glow" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0%" stopColor="#F1D48A" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C1A" />
        </radialGradient>
      </defs>
      <line x1="100" y1="6" x2="100" y2="34" stroke="#A67C1A" strokeWidth="3" />
      <rect x="72" y="34" width="56" height="12" rx="6" fill="#8A6416" />
      <path d="M58 52 H142 L128 214 H72 Z" fill="url(#hero-glow)" stroke="#8A6416" strokeWidth="3" />
      <g stroke="#17130D" strokeWidth="2.5" opacity="0.4" fill="none">
        <line x1="80" y1="66" x2="120" y2="200" />
        <line x1="120" y1="66" x2="80" y2="200" />
        <line x1="70" y1="100" x2="130" y2="100" />
        <line x1="66" y1="150" x2="134" y2="150" />
      </g>
      <rect x="72" y="214" width="56" height="16" rx="4" fill="#8A6416" />
      <rect x="84" y="230" width="32" height="20" rx="4" fill="#C79A3B" />
    </svg>
  );
}

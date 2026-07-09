"use client";

import { motion } from "framer-motion";

// The fanous (lantern) brand mark. Aniconic, geometric, light-based — a gold
// glow breathing on ambient black. Full lifecycle states arrive in later
// milestones; this is the idle "lit" hero mark.
export function Lantern() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        aria-hidden
        className="absolute h-40 w-40 rounded-full bg-gold-glow blur-3xl"
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg
        width="88"
        height="120"
        viewBox="0 0 88 120"
        fill="none"
        className="relative drop-shadow-lantern"
      >
        {/* top ring + hanger */}
        <line x1="44" y1="2" x2="44" y2="14" stroke="#D4AF37" strokeWidth="2" />
        <rect x="30" y="14" width="28" height="6" rx="3" fill="#A67C1A" />
        {/* lantern body */}
        <path
          d="M24 24 H64 L58 96 H30 Z"
          fill="url(#glow)"
          stroke="#D4AF37"
          strokeWidth="2"
        />
        {/* mashrabiya-style lattice: 8-point star hints */}
        <g stroke="#0B0B0C" strokeWidth="1.5" opacity="0.5">
          <line x1="34" y1="30" x2="54" y2="90" />
          <line x1="54" y1="30" x2="34" y2="90" />
          <line x1="30" y1="46" x2="58" y2="46" />
          <line x1="30" y1="70" x2="58" y2="70" />
        </g>
        {/* base */}
        <rect x="30" y="96" width="28" height="8" rx="2" fill="#A67C1A" />
        <rect x="36" y="104" width="16" height="10" rx="2" fill="#D4AF37" />
        <defs>
          <radialGradient id="glow" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#F1D48A" />
            <stop offset="100%" stopColor="#A67C1A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

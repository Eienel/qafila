import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Light "dawn" surfaces (landing top half) ---
        canvas: "#F5F1E8", // warm ivory paper
        "canvas-2": "#EFE8D9", // deeper cream band
        ink: "#17130D", // near-black warm — body text on light
        "ink-dim": "#6B6254", // muted warm gray

        // --- Gold accent (locked, one accent for the whole page) ---
        gold: "#C79A3B", // primary accent, works on light and dark
        "gold-glow": "#F1D48A", // lit-lantern highlight (dark bg)
        "gold-deep": "#8A6416", // gold that passes contrast as text on cream
        "gold-ink": "#6E4E10",

        // --- Dark "dusk" surfaces (landing lower half + app) ---
        night: "#0B0B0C", // ambient black
        "night-2": "#141210", // warm elevated surface
        "night-3": "#1E1A15", // higher elevation / modals
        mist: "#F4F1EA", // off-white text on dark
        "mist-dim": "#A69E8D", // muted text on dark

        // --- Status ---
        success: "#2FB380",
        danger: "#E5484D",

        // --- Legacy aliases (existing app components) ---
        bg: "#0B0B0C",
        "bg-deep": "#000000",
        surface: "#141210",
        "surface-2": "#1E1A15",
        text: "#F4F1EA",
        "text-hi": "#FFFFFF",
        "text-dim": "#A69E8D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: [
          "var(--font-display-latin)",
          "var(--font-display-ar)",
          "Georgia",
          "serif",
        ],
      },
      boxShadow: {
        lantern: "0 0 80px -12px rgba(241,212,138,0.55)",
        "lantern-sm": "0 0 40px -10px rgba(241,212,138,0.45)",
        soft: "0 24px 60px -24px rgba(23,19,13,0.25)",
        "gold-cta": "0 10px 30px -10px rgba(199,154,59,0.5)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.85" },
          "45%": { opacity: "1" },
          "55%": { opacity: "0.78" },
        },
      },
      animation: {
        flicker: "flicker 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

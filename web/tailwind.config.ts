import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0C",
        "bg-deep": "#000000",
        surface: "#141416",
        "surface-2": "#1C1C1F",
        gold: "#D4AF37",
        "gold-glow": "#F1D48A",
        "gold-deep": "#A67C1A",
        text: "#F5F5F5",
        "text-hi": "#FFFFFF",
        "text-dim": "#A1A1AA",
        success: "#2FB380",
        danger: "#E5484D",
      },
      borderColor: {
        DEFAULT: "rgba(212,175,55,0.18)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lantern: "0 0 40px -8px rgba(241,212,138,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

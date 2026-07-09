"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

// Segmented EN / AR switch. `tone` adapts it to light or dark surfaces.
export function LocaleToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: "en" | "ar") => router.replace(pathname, { locale: next });

  const border = tone === "light" ? "border-ink/[0.15]" : "border-gold/25";
  const idle = tone === "light" ? "text-ink-dim hover:text-ink" : "text-mist-dim hover:text-mist";
  const active =
    tone === "light" ? "bg-ink text-canvas" : "bg-gradient-to-b from-gold-glow to-gold text-night";

  return (
    <div className={`inline-flex overflow-hidden rounded-full border ${border} text-xs`}>
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-3 py-1.5 font-medium transition-colors ${
            locale === l ? active : idle
          }`}
        >
          {l === "en" ? "EN" : "ع"}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: "en" | "ar") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="inline-flex overflow-hidden rounded-md border border-[rgba(212,175,55,0.18)] text-sm">
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-3 py-1.5 transition-colors ${
            locale === l
              ? "bg-gold text-bg font-medium"
              : "text-text-dim hover:text-text"
          }`}
        >
          {l === "en" ? "EN" : "العربية"}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LocaleToggle } from "./LocaleToggle";
import { ArrowRight } from "@phosphor-icons/react";

// Landing top nav on the light surface. One line, <= 72px.
export function SiteNav() {
  const t = useTranslations("nav");
  const links: [string, string][] = [
    ["#how", t("howItWorks")],
    ["#security", t("security")],
    ["#about", t("about")],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl font-semibold text-ink">
          Qafila
        </Link>
        <div className="hidden items-center gap-8 text-sm text-ink-dim md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-ink">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LocaleToggle tone="light" />
          <Link href="/app" className="btn-dark hidden px-5 py-2.5 sm:inline-flex">
            {t("getStarted")}
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

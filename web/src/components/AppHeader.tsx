"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LocaleToggle } from "./LocaleToggle";
import { WalletConnect } from "./ConnectButton";

// App (dark) header — carries the landing's language into the working space.
export function AppHeader() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-40 border-b border-gold/[0.12] bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl font-semibold text-gold-glow">
          Qafila
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden text-sm text-mist-dim transition-colors hover:text-mist sm:block"
          >
            {t("dashboard")}
          </Link>
          <LocaleToggle tone="dark" />
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}

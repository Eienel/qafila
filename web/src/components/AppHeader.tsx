"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LocaleToggle } from "./LocaleToggle";
import { WalletConnect } from "./ConnectButton";

export function AppHeader() {
  const t = useTranslations("nav");
  return (
    <header className="flex items-center justify-between border-b border-[rgba(212,175,55,0.18)] py-4">
      <Link href="/" className="text-lg font-semibold tracking-wide text-text-hi">
        Qafila <span className="text-gold">قافلة</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/app" className="text-sm text-text-dim hover:text-text">
          {t("dashboard")}
        </Link>
        <LocaleToggle />
        <WalletConnect />
      </div>
    </header>
  );
}

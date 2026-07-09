import { useTranslations } from "next-intl";
import { LocaleToggle } from "@/components/LocaleToggle";
import { WalletConnect } from "@/components/ConnectButton";
import { Lantern } from "@/components/Lantern";

export default function Home() {
  const t = useTranslations();

  const steps = [
    { title: t("how.step1Title"), body: t("how.step1Body") },
    { title: t("how.step2Title"), body: t("how.step2Body") },
    { title: t("how.step3Title"), body: t("how.step3Body") },
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <span className="text-lg font-semibold tracking-wide text-text-hi">
          Qafila <span className="text-gold">قافلة</span>
        </span>
        <div className="flex items-center gap-3">
          <LocaleToggle />
          <WalletConnect />
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-8 py-16 text-center">
        <Lantern />
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-text-hi md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-text-dim">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col items-center gap-3">
          <WalletConnect />
          <span className="text-xs text-text-dim">{t("hero.network")}</span>
        </div>
      </section>

      <section className="border-t border-[rgba(212,175,55,0.18)] py-16">
        <h2 className="mb-10 text-center text-2xl font-semibold text-text-hi">
          {t("how.title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-[rgba(212,175,55,0.18)] bg-surface p-6 text-start"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold text-gold">
                {i + 1}
              </div>
              <h3 className="mb-2 font-medium text-text-hi">{s.title}</h3>
              <p className="text-sm leading-relaxed text-text-dim">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[rgba(212,175,55,0.18)] py-6 text-center text-xs text-text-dim">
        Polygon Amoy testnet · demo only
      </footer>
    </main>
  );
}

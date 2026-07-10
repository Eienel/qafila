import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { StepFlow } from "@/components/StepFlow";
import { Reveal } from "@/components/Reveal";
import { PolygonMark } from "@/components/PolygonMark";
import { ArrowRight, Vault, Scales, Key } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  const t = useTranslations();

  const steps = [
    { title: t("how.step1Title"), body: t("how.step1Body") },
    { title: t("how.step2Title"), body: t("how.step2Body") },
    { title: t("how.step3Title"), body: t("how.step3Body") },
  ];

  const features = [
    { Icon: Vault, title: t("features.secureTitle"), body: t("features.secureBody") },
    { Icon: Scales, title: t("features.trustTitle"), body: t("features.trustBody") },
    { Icon: Key, title: t("features.releaseTitle"), body: t("features.releaseBody") },
  ];

  const problems = [
    { title: t("problems.feesTitle"), body: t("problems.feesBody") },
    { title: t("problems.slowTitle"), body: t("problems.slowBody") },
    { title: t("problems.rejectTitle"), body: t("problems.rejectBody") },
  ];

  return (
    <div className="grain">
      {/* HERO — full-bleed lantern photo, headline over the cream feather */}
      <section className="relative isolate min-h-[100dvh] overflow-hidden bg-canvas md:min-h-[92vh]">
        {/* photo: full-bleed on mobile, right panel on desktop (mirrors to the
            left in RTL so the headline always sits on the cream side) */}
        <div className="absolute inset-0 md:inset-y-0 md:left-[40%] md:right-0 rtl:md:left-0 rtl:md:right-[40%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero.png"
            alt="A lit fanous lantern on the wall of an old Arabian alley at dusk"
            className="h-full w-full object-cover object-[65%_center] rtl:-scale-x-100"
          />
        </div>
        {/* cream feather: strong on mobile for legibility, subtle blend on desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-canvas from-40% via-canvas/85 via-60% to-canvas/30 md:via-canvas/50 md:via-52% md:to-transparent md:to-78% rtl:bg-gradient-to-l" />
        {/* top scrim so the transparent nav stays legible */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-canvas/85 to-transparent" />
        {/* bottom fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent" />

        <SiteNav />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl items-center px-6 pt-24 pb-28 md:min-h-[92vh]">
          <Reveal className="max-w-xl">
            <p className="eyebrow mb-5">{t("hero.kicker")}</p>
            <h1 className="font-display text-5xl leading-[1.03] text-ink md:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
              {t("hero.subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/app" className="btn-dark">
                {t("hero.cta")}
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
              <a href="#how" className="btn-line">
                {t("hero.secondary")}
              </a>
            </div>
            <div className="mt-10 flex items-center gap-2.5 text-sm text-ink-dim">
              <span>{t("hero.builtOn")}</span>
              <PolygonMark className="h-5 text-ink" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES — the dusk begins: a dark panel on the fading-light band */}
      <section
        id="security"
        className="bg-gradient-to-b from-canvas to-canvas-2 px-6 pb-24 pt-4"
      >
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-night px-6 py-16 md:px-16 md:py-20">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-64 opacity-70"
              style={{
                background:
                  "radial-gradient(50% 100% at 50% 0%, rgba(241,212,138,0.14), transparent 70%)",
              }}
            />
            <Reveal className="relative text-center">
              <p className="eyebrow mb-4 text-gold">{t("features.kicker")}</p>
              <h2 className="font-display text-4xl text-mist md:text-5xl">{t("features.title")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-mist-dim">{t("features.subtitle")}</p>
            </Reveal>

            <div className="relative mt-14 grid gap-10 md:grid-cols-3">
              {features.map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.1} className="text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-night-2 shadow-lantern-sm">
                    <Icon weight="light" className="h-9 w-9 text-gold-glow" />
                  </div>
                  <h3 className="font-display text-2xl text-mist">{title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-mist-dim">
                    {body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — full dusk */}
      <section id="how" className="bg-night px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14 max-w-xl">
            <h2 className="font-display text-4xl text-mist md:text-5xl">{t("how.title")}</h2>
            <p className="mt-3 text-mist-dim">{t("how.subtitle")}</p>
          </Reveal>
          <StepFlow steps={steps} />
        </div>
      </section>

      {/* PROBLEMS — night, asymmetric 2-col (not three equal cards) */}
      <section id="about" className="bg-night px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow mb-4 text-gold">{t("problems.kicker")}</p>
            <h2 className="font-display text-4xl leading-tight text-mist md:text-5xl">
              {t("problems.title")}
            </h2>
          </Reveal>
          <div className="divide-y divide-gold/[0.12]">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex gap-6 py-6 first:pt-0">
                  <span className="font-display text-3xl text-gold/70">{`0${i + 1}`}</span>
                  <div>
                    <h3 className="text-lg font-medium text-mist">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist-dim">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — the lantern at its brightest */}
      <section className="relative overflow-hidden bg-night px-6 py-28">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-glow/10 blur-3xl"
        />
        <Reveal className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl leading-tight text-mist md:text-6xl">
            {t("finalCta.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-mist-dim">{t("finalCta.subtitle")}</p>
          <Link href="/app" className="btn-gold mt-9 px-7 py-3 text-base">
            {t("finalCta.cta")}
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

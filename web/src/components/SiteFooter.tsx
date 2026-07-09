import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { XLogo, DiscordLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr";

// Dark footer — the resting "dusk" at the bottom of the dawn-to-dusk page.
export function SiteFooter() {
  const t = useTranslations("footer");

  const columns: [string, [string, string][]][] = [
    [
      t("product"),
      [
        ["#how", t("howItWorks")],
        ["/app", t("dashboard")],
        ["#security", t("security")],
      ],
    ],
    [
      t("company"),
      [
        ["#about", t("about")],
        ["#", t("careers")],
        ["#", t("contact")],
      ],
    ],
    [
      t("resources"),
      [
        ["#", t("docs")],
        ["#", t("faq")],
      ],
    ],
  ];

  return (
    <footer className="bg-night px-6 pb-10 pt-16 text-mist">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl font-semibold text-gold-glow">Qafila</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist-dim">{t("tagline")}</p>
          </div>
          {columns.map(([title, items]) => (
            <div key={title}>
              <h4 className="eyebrow mb-4 text-mist-dim">{title}</h4>
              <ul className="space-y-2.5 text-sm text-mist-dim">
                {items.map(([href, label]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="transition-colors hover:text-gold-glow">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="transition-colors hover:text-gold-glow">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gold/[0.12] pt-6 text-xs text-mist-dim sm:flex-row">
          <span>© 2026 {t("rights")}</span>
          <div className="flex items-center gap-4">
            <span>{t("testnet")}</span>
            <div className="flex items-center gap-3 text-mist-dim">
              <a href="#" aria-label="X" className="hover:text-gold-glow"><XLogo className="h-4 w-4" /></a>
              <a href="#" aria-label="Discord" className="hover:text-gold-glow"><DiscordLogo className="h-4 w-4" /></a>
              <a href="#" aria-label="GitHub" className="hover:text-gold-glow"><GithubLogo className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

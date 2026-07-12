"use client";

import { useTranslations } from "next-intl";
import { useEscrows } from "@/hooks/useEscrows";
import { supplierReputation } from "@/lib/reputation";
import { shortAddr } from "@/lib/format";

const TIER_STYLE: Record<string, string> = {
  gold: "text-gold border-gold/40 bg-gold/10",
  silver: "text-text-hi border-[rgba(212,175,55,0.25)] bg-surface-2",
  bronze: "text-amber-300/80 border-amber-500/25 bg-amber-500/5",
  new: "text-text-dim border-[rgba(212,175,55,0.18)] bg-surface-2",
};

// On-chain supplier reputation: a trust score derived from this exporter's
// completed-trade history. Reads the same trades the dashboard already loads.
export function SupplierReputation({ address }: { address: string }) {
  const t = useTranslations("reputation");
  const { trades, isLoading } = useEscrows();
  const rep = supplierReputation(address, trades);

  if (isLoading) return null;

  const pct = rep.cleanRate === null ? null : Math.round(rep.cleanRate * 100);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-hi">{t("title")}</p>
          <p className="mt-0.5 font-mono text-xs text-text-dim">{shortAddr(address)}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${TIER_STYLE[rep.tier]}`}>
          {t(`tier.${rep.tier}`)}
        </span>
      </div>

      {rep.total === 0 ? (
        <p className="mt-3 text-sm text-text-dim">{t("noHistory")}</p>
      ) : (
        <>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-text-hi">{rep.score}</span>
            <span className="text-xs text-text-dim">/ 100 · {t("trustScore")}</span>
          </div>

          {/* score bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
              style={{ width: `${rep.score}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
            <Stat label={t("released")} value={rep.released} tone="good" />
            <Stat label={t("disputed")} value={rep.disputed} tone={rep.disputed ? "bad" : undefined} />
            <Stat label={t("refunded")} value={rep.refunded} />
            <Stat label={t("active")} value={rep.active} />
          </div>

          {pct !== null && (
            <p className="mt-3 text-xs text-text-dim">
              {t("cleanRate", { pct })}
            </p>
          )}
          <p className="mt-1 text-[11px] text-text-dim">{t("sourceNote")}</p>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-text";
  return (
    <div>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
      <p className="text-[11px] text-text-dim">{label}</p>
    </div>
  );
}

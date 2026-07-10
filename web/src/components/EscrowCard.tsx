"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { TradeView } from "@/hooks/useEscrows";
import { StatusChip } from "./StatusChip";
import { LanternLifecycle } from "./LanternLifecycle";
import { formatAmount, shortAddr } from "@/lib/format";
import { tokenFor } from "@/contracts/tokens";

export function EscrowCard({ trade, role }: { trade: TradeView; role?: "importer" | "exporter" }) {
  const t = useTranslations("escrow");
  const token = tokenFor(trade.token);
  return (
    <Link
      href={`/escrow/${trade.id}`}
      className="card block hover:-translate-y-1 hover:border-gold/40 hover:shadow-lantern-sm"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs text-text-dim">
            {t("title")} #{trade.id}
          </p>
          <p className="mt-0.5 text-2xl font-semibold text-text-hi">
            {formatAmount(trade.amount, token.decimals)}{" "}
            <span className="text-sm text-gold">{token.symbol}</span>
          </p>
        </div>
        <StatusChip state={trade.state} />
      </div>
      <LanternLifecycle state={trade.state} size="sm" />
      <div className="mt-4 flex justify-between text-xs text-text-dim">
        <span>
          {t("exporter")}: <span className="font-mono">{shortAddr(trade.exporter)}</span>
        </span>
        {role && <span className="text-gold">{role === "importer" ? "▸" : "◂"}</span>}
      </div>
    </Link>
  );
}

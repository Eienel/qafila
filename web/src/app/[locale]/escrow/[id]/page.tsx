"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { StatusChip } from "@/components/StatusChip";
import { LanternLifecycle } from "@/components/LanternLifecycle";
import { EscrowActions } from "@/components/EscrowActions";
import { useEscrow } from "@/hooks/useEscrows";
import { formatAmount, shortAddr, AMOY_EXPLORER } from "@/lib/format";
import { zeroHash } from "viem";

export default function EscrowPage() {
  const t = useTranslations("escrow");
  const params = useParams();
  const id = Number(params.id);
  const { trade, isLoading, refetch } = useEscrow(id);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20">
      <AppHeader />
      <Link href="/app" className="mt-6 inline-block text-sm text-text-dim hover:text-text">
        ← {t("back")}
      </Link>

      {isLoading || !trade ? (
        <p className="mt-16 text-center text-text-dim">…</p>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-text-dim">
                {t("title")} #{trade.id}
              </p>
              <p className="mt-1 text-4xl font-semibold text-text-hi">
                {formatAmount(trade.amount)} <span className="text-lg text-gold">AEDx</span>
              </p>
            </div>
            <StatusChip state={trade.state} />
          </div>

          {/* Funds-held-in-trust: mashrabiya lattice panel */}
          <div className="mashrabiya rounded-xl border border-[rgba(212,175,55,0.18)] p-6">
            <LanternLifecycle state={trade.state} />
          </div>

          <div className="card grid grid-cols-2 gap-4 text-sm">
            <Detail label={t("importer")} value={shortAddr(trade.importer)} mono />
            <Detail label={t("exporter")} value={shortAddr(trade.exporter)} mono />
            <Detail
              label={t("condition")}
              value={trade.requiredDocHash === zeroHash ? t("conditionConfirm") : t("conditionHash")}
            />
            <Detail
              label={t("deadline")}
              value={new Date(Number(trade.deadline) * 1000).toLocaleDateString("en-US")}
            />
            {trade.requiredDocHash !== zeroHash && (
              <Detail label={t("agreedHash")} value={trade.requiredDocHash} mono full />
            )}
            {trade.submittedDocHash !== zeroHash && (
              <Detail label={t("submittedHash")} value={trade.submittedDocHash} mono full />
            )}
          </div>

          {trade.state === "Released" && (
            <motion.div
              className="card relative overflow-hidden border-success/40 bg-success/5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* the light "passes" to the exporter */}
              <motion.div
                aria-hidden
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-gold-glow/30 to-transparent"
                initial={{ x: "-30%" }}
                animate={{ x: "130%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <p className="relative text-sm font-medium text-success">✓ {t("released")}</p>
            </motion.div>
          )}

          <div className="card">
            <EscrowActions trade={trade} onChange={refetch} />
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({
  label,
  value,
  mono,
  full,
}: {
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="mb-0.5 text-xs text-text-dim">{label}</p>
      <p className={`text-text ${mono ? "break-all font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

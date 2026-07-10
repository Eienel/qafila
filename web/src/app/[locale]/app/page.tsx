"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { AppHeader } from "@/components/AppHeader";
import { EscrowCard } from "@/components/EscrowCard";
import { CreateEscrowForm } from "@/components/CreateEscrowForm";
import { Modal } from "@/components/Modal";
import { useEscrows } from "@/hooks/useEscrows";
import { ESCROW_ADDRESS, isPlaceholderAddress } from "@/contracts";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { address, isConnected } = useAccount();
  const { trades, isLoading, refetch } = useEscrows();
  const [open, setOpen] = useState(false);

  const notDeployed = isPlaceholderAddress(ESCROW_ADDRESS);

  const roleOf = (importer: string, exporter: string) => {
    if (!address) return undefined;
    if (address.toLowerCase() === importer.toLowerCase()) return "importer" as const;
    if (address.toLowerCase() === exporter.toLowerCase()) return "exporter" as const;
    return undefined;
  };

  return (
    <div className="min-h-[100dvh] bg-night text-mist">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 pb-20 animate-fade-up">
      <div className="mt-10 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl text-mist">{t("title")}</h1>
          <p className="mt-1 text-sm text-mist-dim">{t("subtitle")}</p>
        </div>
        <button className="btn-gold" onClick={() => setOpen(true)} disabled={!isConnected || notDeployed}>
          {t("new")}
        </button>
      </div>

      {notDeployed && (
        <p className="mt-6 rounded-md border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
          {t("notDeployed")}
        </p>
      )}

      {!isConnected ? (
        <p className="mt-16 text-center text-text-dim">{t("connectFirst")}</p>
      ) : isLoading ? (
        <p className="mt-16 text-center text-text-dim">{tc("loading")}</p>
      ) : trades.length === 0 ? (
        <p className="mt-16 text-center text-text-dim">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {trades.map((tr) => (
            <EscrowCard key={tr.id} trade={tr} role={roleOf(tr.importer, tr.exporter)} />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={t("new")}>
        <CreateEscrowForm
          onDone={() => {
            setOpen(false);
            refetch();
          }}
        />
      </Modal>
      </main>
    </div>
  );
}

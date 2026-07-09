"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { zeroHash } from "viem";
import { escrowAbi, aedxAbi, ESCROW_ADDRESS, AEDX_ADDRESS } from "@/contracts";
import type { TradeView } from "@/hooks/useEscrows";
import { hashFile } from "@/lib/hash";

type Role = "importer" | "exporter" | "observer";

export function EscrowActions({ trade, onChange }: { trade: TradeView; onChange: () => void }) {
  const t = useTranslations("escrow");
  const { address } = useAccount();
  const [docHash, setDocHash] = useState<`0x${string}`>(zeroHash);

  const role: Role =
    address?.toLowerCase() === trade.importer.toLowerCase()
      ? "importer"
      : address?.toLowerCase() === trade.exporter.toLowerCase()
      ? "exporter"
      : "observer";

  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  if (isSuccess) {
    setTimeout(() => {
      reset();
      onChange();
    }, 500);
  }
  const busy = isPending || confirming;

  // Allowance gate for funding.
  const { data: allowance } = useReadContract({
    address: AEDX_ADDRESS,
    abi: aedxAbi as any,
    functionName: "allowance",
    args: address ? [address, ESCROW_ADDRESS] : undefined,
    query: { enabled: !!address && trade.state === "Created" && role === "importer" },
  });
  const approved = (allowance as bigint | undefined) ?? 0n;
  const needsApproval = approved < trade.amount;

  const write = (fn: string, args: any[], target: `0x${string}` = ESCROW_ADDRESS, abi: any = escrowAbi) =>
    writeContract({ address: target, abi, functionName: fn, args });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setDocHash(await hashFile(f));
  }

  const btn = (label: string, onClick: () => void, disabled = false, kind: "gold" | "ghost" = "gold") => (
    <button className={kind === "gold" ? "btn-gold" : "btn-ghost"} onClick={onClick} disabled={busy || disabled}>
      {label}
    </button>
  );

  // --- CREATED: importer funds (approve → fund) ---
  if (trade.state === "Created" && role === "importer") {
    return (
      <div className="flex flex-wrap gap-3">
        {btn(t("faucet"), () => write("mint", [address, trade.amount], AEDX_ADDRESS, aedxAbi), false, "ghost")}
        {needsApproval
          ? btn(busy ? t("approving") : t("approve"), () =>
              write("approve", [ESCROW_ADDRESS, trade.amount], AEDX_ADDRESS, aedxAbi)
            )
          : btn(busy ? t("funding") : t("fund"), () => write("fund", [BigInt(trade.id)]))}
      </div>
    );
  }

  // --- FUNDED: exporter submits doc; importer may refund after deadline ---
  if (trade.state === "Funded") {
    const past = BigInt(Math.floor(Date.now() / 1000)) >= trade.deadline;
    return (
      <div className="space-y-4">
        {role === "exporter" && (
          <div className="space-y-3">
            <label className="block text-sm text-text-dim">{t("uploadDoc")}</label>
            <input
              type="file"
              onChange={onFile}
              className="text-sm text-text-dim file:mr-3 file:rounded file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-gold"
            />
            {docHash !== zeroHash && (
              <p className="break-all font-mono text-[11px] text-text-dim">{docHash}</p>
            )}
            {btn(busy ? t("submitting") : t("submitDoc"), () => write("submitDoc", [BigInt(trade.id), docHash]), docHash === zeroHash)}
            {trade.requiredDocHash !== zeroHash && (
              <p className="text-xs text-text-dim">{t("autoReleaseNote")}</p>
            )}
          </div>
        )}
        {role === "importer" &&
          past &&
          btn(busy ? t("refunding") : t("refund"), () => write("refund", [BigInt(trade.id)]), false, "ghost")}
      </div>
    );
  }

  // --- SHIPPED: importer confirms & releases, or disputes ---
  if (trade.state === "Shipped") {
    const hashMatches = trade.requiredDocHash !== zeroHash && trade.submittedDocHash === trade.requiredDocHash;
    return (
      <div className="flex flex-wrap gap-3">
        {(role === "importer" || hashMatches) &&
          btn(busy ? t("releasing") : t("release"), () => write("release", [BigInt(trade.id)]))}
        {role === "importer" &&
          btn(busy ? t("disputing") : t("dispute"), () => write("dispute", [BigInt(trade.id)]), false, "ghost")}
      </div>
    );
  }

  // --- DISPUTED: importer may refund ---
  if (trade.state === "Disputed" && role === "importer") {
    return <div>{btn(busy ? t("refunding") : t("refund"), () => write("refund", [BigInt(trade.id)]), false, "ghost")}</div>;
  }

  return null;
}

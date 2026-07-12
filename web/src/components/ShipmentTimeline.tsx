"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { escrowAbi, ESCROW_ADDRESS } from "@/contracts";
import { MILESTONE_STATUSES, milestoneStatus } from "@/contracts/milestones";
import { useMilestones } from "@/hooks/useMilestones";
import type { TradeView } from "@/hooks/useEscrows";

export function ShipmentTimeline({ trade }: { trade: TradeView }) {
  const t = useTranslations("track");
  const { address } = useAccount();
  const { milestones, refetch } = useMilestones(trade.id);

  const isExporter = address?.toLowerCase() === trade.exporter.toLowerCase();
  const canPost = isExporter && (trade.state === "Funded" || trade.state === "Shipped");

  const [status, setStatus] = useState(0);
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  if (isSuccess) {
    setTimeout(() => {
      reset();
      setLocation("");
      setNote("");
      refetch();
    }, 400);
  }
  const busy = isPending || confirming;

  function post() {
    writeContract({
      address: ESCROW_ADDRESS,
      abi: escrowAbi as any,
      functionName: "postMilestone",
      args: [BigInt(trade.id), status, location, note],
    });
  }

  // Nothing to show and nobody to post: hide the whole panel.
  if (milestones.length === 0 && !canPost) return null;

  return (
    <div className="card">
      <p className="mb-4 text-sm font-medium text-text-hi">{t("title")}</p>

      {milestones.length === 0 ? (
        <p className="text-sm text-text-dim">{t("empty")}</p>
      ) : (
        <ol className="relative space-y-5 ps-6">
          {/* vertical rail */}
          <span
            aria-hidden
            className="absolute inset-y-1 start-[7px] w-px bg-[rgba(212,175,55,0.25)]"
          />
          {milestones.map((m, i) => {
            const s = milestoneStatus(m.status);
            return (
              <li key={i} className="relative">
                <span className="absolute -start-6 top-0 text-sm leading-5">{s.icon}</span>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-medium text-text">{t(`status.${s.key}`)}</span>
                  {m.location && <span className="text-xs text-gold">· {m.location}</span>}
                  <span className="ms-auto font-mono text-[11px] text-text-dim">
                    {new Date(Number(m.timestamp) * 1000).toLocaleString("en-US")}
                  </span>
                </div>
                {m.note && <p className="mt-0.5 text-xs text-text-dim">{m.note}</p>}
              </li>
            );
          })}
        </ol>
      )}

      {canPost && (
        <div className="mt-5 space-y-3 border-t border-[rgba(212,175,55,0.14)] pt-4">
          <p className="text-xs text-text-dim">{t("postHint")}</p>
          <div className="flex flex-wrap gap-2">
            <select
              className="input flex-1"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              {MILESTONE_STATUSES.map((s) => (
                <option key={s.code} value={s.code}>
                  {t(`status.${s.key}`)}
                </option>
              ))}
            </select>
            <input
              className="input flex-1"
              placeholder={t("locationPh")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <input
            className="input"
            placeholder={t("notePh")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="btn-gold" onClick={post} disabled={busy}>
            {busy ? t("posting") : t("post")}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { escrowAbi, ESCROW_ADDRESS, AEDX_ADDRESS } from "@/contracts";
import { screenCounterparty, type ScreeningVerdict } from "@/lib/screening";
import { hashFile } from "@/lib/hash";
import { parseAmount } from "@/lib/format";
import { ScreeningBadge } from "./ScreeningBadge";
import { zeroHash, isAddress } from "viem";

export function CreateEscrowForm({ onDone }: { onDone: () => void }) {
  const t = useTranslations("create");
  const tc = useTranslations("common");
  const [name, setName] = useState("");
  const [exporter, setExporter] = useState("");
  const [amount, setAmount] = useState("1000");
  const [mode, setMode] = useState<"hash" | "confirm">("hash");
  const [docHash, setDocHash] = useState<`0x${string}`>(zeroHash);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(Date.now() + 7 * 864e5);
    return d.toISOString().slice(0, 10);
  });
  const [screening, setScreening] = useState(false);
  const [verdict, setVerdict] = useState<ScreeningVerdict>();
  const [error, setError] = useState<string>();

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  if (isSuccess) {
    // Give the chain a beat, then refresh the dashboard.
    setTimeout(onDone, 400);
  }

  async function runScreen() {
    if (!name) return;
    setScreening(true);
    try {
      setVerdict(await screenCounterparty(name));
    } finally {
      setScreening(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setDocHash(await hashFile(f));
  }

  function submit() {
    setError(undefined);
    if (!verdict) return setError(t("needScreen"));
    if (!isAddress(exporter)) return setError("Invalid exporter address");
    const required = mode === "hash" ? docHash : zeroHash;
    const deadlineTs = BigInt(Math.floor(new Date(deadline).getTime() / 1000));
    writeContract({
      address: ESCROW_ADDRESS,
      abi: escrowAbi as any,
      functionName: "createTrade",
      args: [exporter as `0x${string}`, AEDX_ADDRESS, parseAmount(amount), required, deadlineTs],
    });
  }

  const busy = isPending || confirming;

  return (
    <div className="space-y-4">
      <Field label={t("counterpartyName")}>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder={t("counterpartyNamePh")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVerdict(undefined);
            }}
          />
          <button className="btn-ghost shrink-0" onClick={runScreen} disabled={!name || screening}>
            {t("screen")}
          </button>
        </div>
        <div className="mt-2">
          <ScreeningBadge result={verdict} loading={screening} />
        </div>
      </Field>

      <Field label={t("exporter")}>
        <input className="input" placeholder="0x…" value={exporter} onChange={(e) => setExporter(e.target.value)} />
      </Field>

      <Field label={t("amount")}>
        <input className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>

      <Field label={t("mode")}>
        <div className="flex gap-2">
          <ModeBtn active={mode === "hash"} onClick={() => setMode("hash")}>
            {t("modeHash")}
          </ModeBtn>
          <ModeBtn active={mode === "confirm"} onClick={() => setMode("confirm")}>
            {t("modeConfirm")}
          </ModeBtn>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-text-dim">
          {mode === "hash" ? t("modeHashHelp") : t("modeConfirmHelp")}
        </p>
      </Field>

      {mode === "hash" && (
        <Field label={t("docFile")}>
          <input type="file" className="text-sm text-text-dim file:mr-3 file:rounded file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-gold" onChange={onFile} />
          {docHash !== zeroHash && (
            <p className="mt-1 break-all font-mono text-[11px] text-text-dim">{docHash}</p>
          )}
        </Field>
      )}

      <Field label={t("deadline")}>
        <input type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </Field>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button className="btn-ghost" onClick={onDone} disabled={busy}>
          {tc("cancel")}
        </button>
        <button className="btn-gold" onClick={submit} disabled={busy}>
          {busy ? t("creating") : t("submit")}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-text-dim">{label}</span>
      {children}
    </label>
  );
}

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
        active ? "border-gold bg-gold/10 text-gold" : "border-[rgba(212,175,55,0.18)] text-text-dim hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

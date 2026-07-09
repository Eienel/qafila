import type { EscrowState } from "@/contracts";

const STYLES: Record<EscrowState, string> = {
  Created: "border-text-dim/40 text-text-dim",
  Funded: "border-gold/50 text-gold",
  Shipped: "border-gold-glow/60 text-gold-glow",
  Released: "border-success/60 text-success",
  Refunded: "border-text-dim/40 text-text-dim",
  Disputed: "border-danger/60 text-danger",
};

export function StatusChip({
  state,
  label,
}: {
  state: EscrowState;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[state]}`}
    >
      {label ?? state}
    </span>
  );
}

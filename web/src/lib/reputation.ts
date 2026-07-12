import type { TradeView } from "@/hooks/useEscrows";

// Supplier reputation derived purely from on-chain trade history — no self-
// reported reviews, nothing to fake. We read the same trades the dashboard
// already loads and aggregate the ones where a given address is the exporter.
export type Reputation = {
  address: string;
  total: number; // all trades where this address is exporter
  released: number; // paid out cleanly (good)
  disputed: number; // importer disputed after shipment (bad)
  refunded: number; // deal fell through / timeout (unfavourable)
  active: number; // still in-flight (Created/Funded/Shipped)
  cleanRate: number | null; // released / terminal, or null if no terminal trades
  score: number; // 0–100 trust score
  tier: "new" | "bronze" | "silver" | "gold";
};

export function supplierReputation(address: string, trades: TradeView[]): Reputation {
  const mine = trades.filter(
    (t) => t.exporter.toLowerCase() === address.toLowerCase()
  );

  const released = mine.filter((t) => t.state === "Released").length;
  const disputed = mine.filter((t) => t.state === "Disputed").length;
  const refunded = mine.filter((t) => t.state === "Refunded").length;
  const active = mine.filter(
    (t) => t.state === "Created" || t.state === "Funded" || t.state === "Shipped"
  ).length;

  const terminal = released + disputed + refunded;
  const cleanRate = terminal === 0 ? null : released / terminal;

  // Score: reward clean completions and volume of history, penalise disputes
  // hardest. Deterministic and explainable — judges can trace every point.
  let score = 0;
  if (terminal > 0) {
    const base = (cleanRate ?? 0) * 100; // 0–100 from clean-completion rate
    const disputePenalty = disputed * 15; // disputes hurt most
    const refundPenalty = refunded * 5; // fell-through deals hurt less
    const historyBonus = Math.min(released, 5) * 2; // trust builds with a track record
    score = Math.max(0, Math.min(100, base - disputePenalty - refundPenalty + historyBonus));
  }

  const tier: Reputation["tier"] =
    terminal === 0
      ? "new"
      : score >= 85 && released >= 5
      ? "gold"
      : score >= 70 && released >= 2
      ? "silver"
      : "bronze";

  return { address, total: mine.length, released, disputed, refunded, active, cleanRate, score, tier };
}

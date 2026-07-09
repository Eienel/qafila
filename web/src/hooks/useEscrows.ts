"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { escrowAbi, ESCROW_ADDRESS, STATES, type EscrowState } from "@/contracts";

export type TradeView = {
  id: number;
  importer: `0x${string}`;
  exporter: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  requiredDocHash: `0x${string}`;
  submittedDocHash: `0x${string}`;
  deadline: bigint;
  state: EscrowState;
  stateIndex: number;
};

function toView(id: number, raw: any): TradeView {
  return {
    id,
    importer: raw.importer,
    exporter: raw.exporter,
    token: raw.token,
    amount: raw.amount,
    requiredDocHash: raw.requiredDocHash,
    submittedDocHash: raw.submittedDocHash,
    deadline: raw.deadline,
    state: STATES[Number(raw.state)],
    stateIndex: Number(raw.state),
  };
}

/// Reads tradeCount, then fans out getTrade(0..count-1) via multicall.
export function useEscrows() {
  const { data: count } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: escrowAbi as any,
    functionName: "tradeCount",
  });

  const n = count ? Number(count) : 0;
  const contracts = Array.from({ length: n }, (_, i) => ({
    address: ESCROW_ADDRESS,
    abi: escrowAbi as any,
    functionName: "getTrade",
    args: [BigInt(i)],
  }));

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: { enabled: n > 0 },
  });

  const trades: TradeView[] = (data ?? [])
    .map((r, i) => (r.status === "success" ? toView(i, r.result) : null))
    .filter((t): t is TradeView => t !== null)
    .reverse(); // newest first

  return { trades, count: n, isLoading, refetch };
}

export function useEscrow(id: number) {
  const { data, isLoading, refetch } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: escrowAbi as any,
    functionName: "getTrade",
    args: [BigInt(id)],
    query: { enabled: Number.isFinite(id) && id >= 0 },
  });
  return {
    trade: data ? toView(id, data) : undefined,
    isLoading,
    refetch,
  };
}

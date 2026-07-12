"use client";

import { useReadContract } from "wagmi";
import { escrowAbi, ESCROW_ADDRESS } from "@/contracts";

export type MilestoneView = {
  status: number;
  location: string;
  note: string;
  timestamp: bigint;
};

/// Reads the on-chain shipment-tracking timeline for a trade (getMilestones).
export function useMilestones(id: number) {
  const { data, isLoading, refetch } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: escrowAbi as any,
    functionName: "getMilestones",
    args: [BigInt(id)],
    query: { enabled: Number.isFinite(id) && id >= 0 },
  });

  const milestones: MilestoneView[] = ((data as any[]) ?? []).map((m) => ({
    status: Number(m.status),
    location: m.location,
    note: m.note,
    timestamp: m.timestamp,
  }));

  return { milestones, isLoading, refetch };
}

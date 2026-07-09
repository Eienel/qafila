import { keccak256 } from "viem";

/// Hash a file's raw bytes with keccak256 — the same hash the exporter submits
/// on-chain and the importer agrees to up front.
export async function hashFile(file: File): Promise<`0x${string}`> {
  const buf = new Uint8Array(await file.arrayBuffer());
  return keccak256(buf);
}

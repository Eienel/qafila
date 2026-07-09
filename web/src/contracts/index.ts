import addresses from "./addresses.json";
import EscrowAbi from "./Escrow.abi.json";
import AEDxAbi from "./AEDx.abi.json";

// Env vars win over the checked-in addresses (filled by `npm run deploy:amoy`).
export const ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_ADDRESS ||
  addresses.escrow) as `0x${string}`;
export const AEDX_ADDRESS = (process.env.NEXT_PUBLIC_AEDX_ADDRESS ||
  addresses.aedx) as `0x${string}`;

export const escrowAbi = EscrowAbi;
export const aedxAbi = AEDxAbi;

// Enum order must match Escrow.sol State.
export const STATES = [
  "Created",
  "Funded",
  "Shipped",
  "Released",
  "Refunded",
  "Disputed",
] as const;

export type EscrowState = (typeof STATES)[number];

export function isPlaceholderAddress(a: string) {
  return /^0x0{40}$/.test(a);
}

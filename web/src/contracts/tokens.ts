import { AEDX_ADDRESS } from "./index";

export type TokenInfo = {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  mintable: boolean; // true if the app can faucet-mint it (our AEDx)
  faucetUrl?: string; // external faucet for non-mintable tokens
};

// Circle's official USDC on Polygon PoS Amoy testnet.
// Verify against https://amoy.polygonscan.com/address/0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
export const AMOY_USDC_ADDRESS =
  "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" as `0x${string}`;

export const TOKENS: TokenInfo[] = [
  {
    address: AEDX_ADDRESS,
    symbol: "AEDx",
    name: "AED Stablecoin (Demo)",
    decimals: 6,
    mintable: true,
  },
  {
    address: AMOY_USDC_ADDRESS,
    symbol: "USDC",
    name: "USD Coin (Amoy testnet)",
    decimals: 6,
    mintable: false,
    faucetUrl: "https://faucet.circle.com/",
  },
];

export const DEFAULT_TOKEN = TOKENS[0];

export function tokenFor(address?: string): TokenInfo {
  const hit = TOKENS.find(
    (tk) => tk.address.toLowerCase() === (address ?? "").toLowerCase()
  );
  // Unknown tokens still render sanely (6-decimals assumption, generic symbol).
  return (
    hit ?? {
      address: (address ?? "0x0") as `0x${string}`,
      symbol: "tokens",
      name: "ERC-20",
      decimals: 6,
      mintable: false,
    }
  );
}

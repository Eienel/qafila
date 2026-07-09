// AEDx has 6 decimals. Western Arabic numerals (Gulf convention) — force the
// en-US number system even under an Arabic locale so digits stay 0–9.
export function formatAmount(amount: bigint, decimals = 6): string {
  const base = 10n ** BigInt(decimals);
  const whole = amount / base;
  const frac = amount % base;
  const fracStr = frac === 0n ? "" : "." + frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return new Intl.NumberFormat("en-US").format(Number(whole)) + fracStr;
}

export function parseAmount(value: string, decimals = 6): bigint {
  const [whole, frac = ""] = value.trim().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0");
}

export function shortAddr(a?: string): string {
  if (!a) return "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export const AMOY_EXPLORER = "https://amoy.polygonscan.com";

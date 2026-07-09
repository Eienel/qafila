# Qafila — قافلة

> **Programmable trade escrow that pays suppliers on proof of shipment — the letter of credit, without the bank.**

A "smart-contract letter of credit" built for the Polygon *Smart Commerce Infrastructure Challenge* (UAE). A small importer locks stablecoin in escrow on **Polygon Amoy testnet**; their overseas supplier is paid the moment a shipment condition is proven. On-chain mechanics stay invisible to end users and are only surfaced for demo judges.

## Repository layout

| Path | What |
| --- | --- |
| `contracts/` | Hardhat project — escrow contract + `AEDx` mock ERC-20 stablecoin. |
| `web/` | Next.js (App Router) + TypeScript + Tailwind app — wagmi/viem/RainbowKit, framer-motion, next-intl (EN/AR + RTL). |

## Milestone status

- [x] **M1 — Scaffold + wallet connect on Amoy** (this commit)
- [ ] M2 — Escrow contract: states, events, SafeERC20, reentrancy guard, tests, deploy
- [ ] M3 — Frontend flows (create → screen → fund → submit doc → release) + dashboard
- [ ] M4 — Design system (lantern theme, motifs, RTL polish, halal framing)
- [ ] M5 — Seed escrows + 2-minute demo script

## Run it

### Web
```bash
cd web
cp .env.example .env      # add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID for WalletConnect
npm install
npm run dev               # http://localhost:3000  (redirects to /en)
```
Injected wallets (MetaMask) work without a WalletConnect project id; the id is only needed for the WalletConnect QR flow.

### Contracts
```bash
cd contracts
npm install
npm run compile
```

## Notes

- **Target chain:** Polygon Amoy (chainId `80002`). The demo stablecoin is `AEDx`, a freely-mintable mock ERC-20 — **not** a real stablecoin.
- **Scope guardrails:** Qafila is *not* a stablecoin issuer, settlement rail, KYC product, or duplicate-financing registry. Counterparty screening will stand on the OpenSanctions match API (M3).
- **Arabic copy** in `web/messages/ar.json` is a **placeholder pending native-speaker review** — not final, not machine-translation-approved for production.

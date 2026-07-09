# Qafila — قافلة

> **Programmable trade escrow that pays suppliers on proof of shipment — the letter of credit, without the bank.**

A "smart-contract letter of credit" built for the Polygon *Smart Commerce Infrastructure Challenge* (UAE). A small importer locks stablecoin in escrow on **Polygon Amoy testnet**; their overseas supplier is paid the moment a shipment condition is proven. On-chain mechanics stay invisible to end users and are only surfaced for demo judges.

## Repository layout

| Path | What |
| --- | --- |
| `contracts/` | Hardhat project — escrow contract + `AEDx` mock ERC-20 stablecoin. |
| `web/` | Next.js (App Router) + TypeScript + Tailwind app — wagmi/viem/RainbowKit, framer-motion, next-intl (EN/AR + RTL). |

## Milestone status

- [x] **M1** — Scaffold + wallet connect on Amoy
- [x] **M2** — Escrow contract: states, events, SafeERC20, reentrancy guard, 6 tests, deploy script
- [x] **M3** — Frontend flows (create → screen → fund → submit doc → release) + dashboard
- [x] **M4** — Design system (lantern theme, khatam/mashrabiya motifs, RTL, halal framing)
- [x] **M5** — Seed escrows + [2-minute demo script](./DEMO.md)

See **[DEMO.md](./DEMO.md)** for the full deploy → seed → demo walkthrough.

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
npm test                          # 6 passing lifecycle/guard tests
cp .env.example .env              # PRIVATE_KEY (importer) + AMOY_RPC_URL
npm run deploy:amoy               # deploys AEDx + Escrow, writes addresses + ABIs into web/
EXPORTER_ADDRESS=0x… npm run seed:amoy   # seeds 2 demo escrows
```

> **Offline solc:** this environment blocks the solc binary host, so the Hardhat
> compiler cache is pre-seeded from the npm `solc` package. On a normal machine
> Hardhat downloads solc itself — no action needed.

## Notes

- **Target chain:** Polygon Amoy (chainId `80002`). The demo stablecoin is `AEDx`, a freely-mintable mock ERC-20 — **not** a real stablecoin.
- **Scope guardrails:** Qafila is *not* a stablecoin issuer, settlement rail, KYC product, or duplicate-financing registry. Counterparty screening stands on the OpenSanctions match API (`OPENSANCTIONS_API_KEY`), with a deterministic offline stub for demos.
- **Screening & docs:** counterparty names are screened server-side via `/api/screen`; shipment documents are hashed client-side (keccak256) and only the hash goes on-chain.
- **Arabic copy** in `web/messages/ar.json` is a **placeholder pending native-speaker review** — not final, not machine-translation-approved for production.

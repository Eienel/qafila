# Qafila — 2-minute demo script

> Goal: show a small importer paying a new overseas supplier through a
> smart-contract letter of credit, with counterparty screening and an
> automatic release on proof of shipment — no bank in the loop.

## One-time setup (before the demo)

1. **Two wallets** in the browser (e.g. two MetaMask accounts): **Importer** and **Exporter**. Both on **Polygon Amoy** (chainId 80002). Get test POL from a [Polygon faucet](https://faucet.polygon.technology/).
2. **Deploy + seed** (contracts):
   ```bash
   cd contracts
   cp .env.example .env            # set PRIVATE_KEY (importer) + AMOY_RPC_URL
   npm install && npm run compile
   npm run deploy:amoy             # writes addresses + ABIs into web/
   EXPORTER_ADDRESS=0x<exporter> npm run seed:amoy
   ```
3. **Web app**:
   ```bash
   cd web
   cp .env.example .env            # NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
   # (optional) OPENSANCTIONS_API_KEY for a live screening call
   npm install && npm run dev
   ```
   The deploy step already wrote the live addresses; env vars can override them.

Open `http://localhost:3000` → it lands on the EN hero. Toggle **EN / العربية** once to show full RTL.

## The 2-minute run

| # | Say | Do | On screen |
|---|-----|----|-----------|
| 1 | "A UAE importer wants to pay a new overseas supplier — normally a 7–10 day letter of credit with a 40% rejection rate." | Connect the **Importer** wallet → open **Dashboard**. | Two seeded escrows; lantern lifecycle cards. |
| 2 | "They screen the counterparty first — we stand on OpenSanctions, we don't rebuild it." | Click **New escrow**, type a supplier name → **Screen** → badge shows **Screened — clear**. | Green screening badge. |
| 3 | "Funds are locked in trust — amana — not sent. The lantern lights up." | Open the seeded **Funded** escrow (#0). | Gold glow; funds held in the mashrabiya panel. |
| 4 | "The supplier proves shipment by submitting the agreed document. Its keccak256 hash is checked on-chain." | Switch to the **Exporter** wallet → open escrow #0 → upload **Bill of Lading.pdf** → **Submit document hash**. | State → Shipped. |
| 4b | "Along the way the supplier posts shipment milestones — booked, in transit, delivered — each written on-chain and shown as a verifiable tracking timeline." | As the **Exporter**, in **Shipment tracking**, pick a status + location → **Post update**. | Timeline grows with each milestone. |
| 5 | "The hash matches the agreed hash, so the escrow releases automatically — the light passes to the supplier." | Watch the auto-release (or, in importer-confirms mode, tap **Confirm & release**). | Success-green receipt, gold light sweep, tx hash → Amoy explorer. |
| 6 | "The honest frontier: proving physical goods actually shipped. Our MVP uses doc-hash + buyer confirmation and is explicit that trustless physical-delivery verification is the hard part." | — | — |

## Fallbacks if the network is slow
- The **importer-confirms** escrow (#1) needs no document — just **Fund** then **Confirm & release**. Use it if a file upload stalls.
- Screening runs offline via a deterministic stub when `OPENSANCTIONS_API_KEY` is unset (names containing "ofac/sanction/blocked" show **review**).

## Notes for judges
- Contract: `Escrow.sol` — SafeERC20, ReentrancyGuard, only-party modifiers, an event at every state transition (the on-chain proof panel reads these).
- Stablecoin `AEDx` is a mock ERC-20 (testnet only), standing in for a bank-issued AED token.
- Arabic UI copy is a placeholder pending native-speaker review.

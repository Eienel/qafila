# Qafila — قافلة
### Programmable trade escrow that pays suppliers on proof of shipment — the letter of credit, without the bank.

**Polygon Smart Commerce Infrastructure Challenge (UAE) — Submission**
Live demo: **https://qafila-theta.vercel.app/en** · Chain: **Polygon Amoy** (chainId 80002)

---

## 1. Team

> *Fill in before submitting.*

| Name | Role | Background / credentials |
|---|---|---|
| _[you]_ | _Founder / Full-stack + Solidity_ | _e.g. yrs building on EVM, prior fintech/trade experience_ |
| _[teammate]_ | _[role]_ | _[credentials]_ |

**Why us:** we build end-to-end — the escrow contract, the bilingual product, and the compliance framing — and we are opinionated about *what not to build* (see §7). We optimise for a real UAE SME workflow, not a crypto demo.

---

## 2. Problem statement & target market

### The problem
Cross-border trade still settles on the **letter of credit (LC)** — a 400-year-old bank instrument. For a small UAE importer buying from a new overseas supplier it means:

- **7–10 days** to issue and process a single LC.
- **~40% of first-presentation documents get rejected** on discrepancies, triggering re-submission cycles.
- **Fees of ~0.75%–1.5%+** of trade value, plus correspondent-bank charges and FX spread.
- **Trust asymmetry:** the supplier won't ship until paid; the importer won't pay until shipped. The bank exists to bridge that gap — and charges for it.

For an SME doing $20k–$100k orders, the LC is slow, expensive, and often simply **unavailable** (banks deprioritise small tickets).

### The market
The UAE is a **USD 50B+ remittance and trade-payment hub** and, uniquely, now has **regulatory clarity** for payment tokens (CBUAE Payment Token Services Regulation; sovereign AED stablecoin live; Digital Dirham CBDC launched Dec 2025). That combination — huge trade flow + a legal home for a regulated dirham stablecoin — is why this belongs in the UAE now.

**Beachhead:** UAE-based SME importers (electronics, textiles, machinery, FMCG) paying overseas suppliers, initially in the $20k–$100k per-order band that banks underserve.

---

## 3. The solution

Qafila turns the letter of credit into a smart contract. An importer locks a regulated stablecoin in escrow on Polygon; the supplier is paid **the moment an agreed shipment condition is proven** — no bank in the loop, settlement in minutes not days.

**Live in the MVP today:**
- **Escrow lifecycle** `Created → Funded → Shipped → Released` (plus `Refunded` / `Disputed`), an event at every transition.
- **Two release conditions:** an agreed **document hash** (instant auto-release when the exporter's keccak256 matches) or **importer confirms** (human check).
- **Counterparty screening** before an escrow is created — we stand on the **OpenSanctions** match API, we do not rebuild sanctions matching.
- **On-chain shipment tracking:** the exporter posts milestones (booked → in transit → delivered); each is logged on-chain as a verifiable timeline.
- **Settles in real Circle USDC on Amoy** or a mock AEDx dirham token (any ERC-20).
- **Bilingual EN/AR, full RTL**, with *amana* (funds-held-in-trust) framing that resonates with the region.
- **Blockchain is invisible to the user** — surfaced only for judges via an on-chain proof panel.

---

## 4. Technical architecture on Polygon

```
┌──────────────────────────────┐        ┌───────────────────────────────┐
│  Importer wallet (MetaMask)  │        │  Exporter wallet (MetaMask)   │
└───────────────┬──────────────┘        └───────────────┬───────────────┘
                │  RainbowKit / wagmi / viem             │
                ▼                                        ▼
        ┌───────────────────────────────────────────────────────┐
        │        Next.js App Router (Vercel) — EN/AR, RTL        │
        │   reads state via multicall · signs txs client-side    │
        │   /api/screen → OpenSanctions match API (server-side)  │
        └───────────────────────────┬───────────────────────────┘
                                    │  JSON-RPC (Amoy)
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │   Escrow.sol  (Polygon Amoy → PoS mainnet path)        │
        │   • SafeERC20 · ReentrancyGuard · only-party modifiers │
        │   • checks-effects-interactions · custom errors        │
        │   • events at every transition (audit trail)           │
        │   • token-agnostic (any ERC-20 stablecoin)             │
        └───────────────────────────────────────────────────────┘
```

**Design decisions:**
- **Polygon PoS** for low, predictable fees and EVM tooling maturity — an SME paying $50k cannot absorb L1 gas, and Polygon's UAE regulatory alignment (dirham stablecoins, Digital Dirham) makes it the natural settlement layer.
- **Zero-backend by design:** the app reads all state from the chain (multicall) and hashes documents **client-side** (keccak256) — only the hash goes on-chain, so sensitive trade documents never leave the browser. The only server code is the screening proxy.
- **Token-agnostic contract:** we accept any ERC-20, so we can swap mock AEDx → real USDC → a CBUAE-licensed AED token without redeploying business logic.
- **Security posture:** SafeERC20, ReentrancyGuard, checks-effects-interactions, only-party access control, custom errors, event coverage. 7 passing lifecycle/guard tests; Polygonscan source verification.

**Stack:** Solidity 0.8.24 + Hardhat + OpenZeppelin · Next.js/TypeScript/Tailwind · wagmi/viem/RainbowKit · next-intl · OpenSanctions.

---

## 5. Revenue model & scalability

We price **against the bank LC**, which today costs an SME ~0.75%–1.5%+ and 7–10 days. We are faster and dramatically cheaper, so we can charge a real fee and still be a bargain.

### Revenue streams
1. **Escrow settlement fee — primary.** A flat **0.4% of trade value** per released escrow (bounded, e.g. min $15 / cap $250 on large tickets). On a $30k average order that is **~$120 per completed trade** — roughly one-quarter of a bank LC, settling in minutes.
2. **SaaS tier for active importers.** Monthly plan (e.g. $99–$499) with a reduced 0.15% fee, role-filtered dashboards, saved counterparties, and reporting — for SMEs running many trades.
3. **FX / on-ramp spread (Phase 2).** A thin spread (~0.3%) when a non-crypto importer funds an escrow in fiat via an integrated on/off-ramp. This unlocks the mass market that never touches a wallet.
4. **Invoice financing take-rate (Phase 2, parked).** An escrow's on-chain track record is underwriting data. We take a fee on financing extended against it — a high-margin layer built on data we already generate.

We **do not** take custody spread / yield on escrowed funds — that is a regulated activity we deliberately avoid (see §7).

### Unit economics (illustrative)
- Avg trade: **$30,000** · take rate **0.4%** → **$120 gross revenue / trade**.
- Marginal cost per trade: gas (cents on Polygon) + screening API call → **< $1**. Near-100% gross margin at the transaction layer.
- **1,000 trades/month** (a small fraction of one trade corridor) → **~$120k/month** transaction revenue before SaaS/financing layers.

### Scalability
- **Technically:** stateless frontend on Vercel's edge; all trade state on Polygon. Adding volume adds no infra. Polygon PoS handles the throughput; each trade is a handful of transactions.
- **Commercially:** the contract is token- and corridor-agnostic. New trade lanes (UAE→India, UAE→China, GCC intra-region) are go-to-market, not rebuilds. The reputation graph (see roadmap) compounds — every completed trade makes the network more valuable and harder to leave.

---

## 6. Launch roadmap & go-to-market

### Roadmap
- **Now (MVP):** escrow + doc-hash/confirm release + screening + on-chain shipment tracking + EN/AR, on Amoy with real USDC.
- **Q4 2026 — Trust & clarity:** role-filtered importer/exporter dashboards; **signed carrier attestation** (`ecrecover`, first real oracle step); encrypted document storage on IPFS; milestone/partial releases; supplier reputation from on-chain history; external security review.
- **Q1 2027 — Real shipment proof:** integrate the **electronic Bill of Lading (eBL)** using DCSA standards + the MLETR legal framework; **Chainlink Functions** to auto-release on a genuine shipment event; multi-document conditions.
- **Q2 2027 — Compliant money & scale:** settle in a **CBUAE-licensed AED payment token** (replacing mock AEDx) under the Payment Token Services Regulation; fiat on/off-ramp; dispute-resolution module; security audit + **Polygon PoS mainnet** launch.

### Go-to-market
1. **Land:** partner with 1–2 **UAE trade/freight forwarders and trade-finance brokers** who already sit on deal flow from SMEs banks reject. They bring the first importers; we handle onboarding.
2. **Wedge:** target importers on **new supplier relationships** — the exact case where trust is lowest and an LC is most painful/unavailable. Escrow shines precisely where the bank is slow or absent.
3. **Expand:** grow within a corridor (e.g. UAE↔India electronics), then add corridors. Use the **on-chain reputation graph** as a retention moat — a supplier's clean track record is portable value they won't rebuild elsewhere.
4. **Compliance-first credibility:** lead with OpenSanctions screening + CBUAE-aligned stablecoin framing so a conservative SME (and their auditor) is comfortable. This is a trust product; regulatory posture *is* marketing.

---

## 7. Scope guardrails — what we deliberately do not build

We stand on incumbents rather than rebuilding them. Qafila is **not** a stablecoin issuer, **not** a settlement rail, **not** a KYC/identity product, **not** a duplicate-financing registry, and takes **no custody yield** on escrowed funds. Focus stays on the SME-facing escrow experience plus UAE-stablecoin / halal framing on top of existing verification (OpenSanctions, Circle, eBL, Chainlink).

### The honest frontier
A keccak256 document match proves the exporter *holds an agreed file*, not that goods physically shipped — the oracle problem, which no MVP solves trustlessly. Our edge is being **explicit** about it and standing on real verification (carrier signatures → eBL → licensed oracles) rather than pretending a hash already proves shipment.

---

## 8. MVP / prototype

- **Live app:** https://qafila-theta.vercel.app/en (toggle EN/العربية for full RTL)
- **2-minute demo script:** [`DEMO.md`](./DEMO.md)
- **Contracts (Polygon Amoy):** `Escrow.sol` + mock `AEDx` — SafeERC20, ReentrancyGuard, only-party modifiers, 7 passing tests, Polygonscan-verified.
- **Repository layout:** [`README.md`](./README.md) · **Roadmap:** [`ROADMAP.md`](./ROADMAP.md)

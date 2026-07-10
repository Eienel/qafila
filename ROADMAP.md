# Qafila — Roadmap

> From a working smart-contract escrow to trustless proof of shipment.
> A browsable version lives at **`/docs`** (enable GitHub Pages → Deploy from branch → `main` / `docs`).

Qafila turns the letter of credit into a smart contract: an importer locks stablecoin in escrow on Polygon, and the supplier is paid the moment an agreed condition is met. This roadmap is honest about the one hard part — proving physical shipment — and how we close it.

**Live now:** Polygon Amoy testnet · Escrow + mock AEDx · EN/AR UI with full RTL.

---

## ✅ Shipped — Q3 2026 (MVP)

The escrow works end to end, demoable in two minutes.

- Solidity escrow: `Created → Funded → Shipped → Released`, plus `Refunded` / `Disputed`. SafeERC20, reentrancy guard, only-party access, an event at every transition.
- Two release conditions: **agreed document hash** (instant auto-release) and **importer confirms** (human check).
- Counterparty screening via the OpenSanctions match API before an escrow is created.
- Client-side keccak256 document hashing; only the hash goes on-chain.
- Bilingual EN/AR interface, full RTL, lantern lifecycle view.
- Settles in **real Circle USDC on Amoy** or a mock **AEDx** dirham token (selectable per escrow); the contract accepts any ERC-20.

## Q4 2026 — Trust & clarity

Sharpen the two-sided experience and take the first real step past the doc-hash handshake.

- Role-filtered dashboard: separate importer and exporter inboxes.
- **Signed carrier attestation** release *(first oracle step)* — the contract verifies a shipping party's signature (`ecrecover`) instead of a static file hash.
- Encrypted document storage on IPFS / web3.storage, not just the on-chain hash.
- Milestone / partial releases (deposit on shipment, balance on delivery).
- Polygonscan-verified source and a first external security review.

## Q1 2027 — Real shipment proof (the oracle)

Replace "a file both sides hold" with data from a party that actually knows the goods moved.

- Integrate the **electronic Bill of Lading (eBL)** using DCSA standards and the MLETR legal framework. *(eBL adoption reached ~11% in 2025; DCSA targets 100% by 2030.)*
- **Chainlink Functions** to read eBL / logistics-platform state and auto-release on a genuine shipment event.
- Multi-document conditions: invoice + Bill of Lading + inspection certificate.
- Optional IoT / port "gate-out" signals for higher-value lanes.

## Q2 2027 — Compliant money & scale

Swap the mock token for regulated rails and open to non-crypto SMEs.

- Settle in a **CBUAE-licensed AED payment token** under the Payment Token Services Regulation, replacing mock AEDx. *(RAKBANK AED stablecoin approved in-principle Jan 2026; sovereign dirham stablecoin live; Digital Dirham CBDC launched Dec 2025.)*
- Fiat on/off-ramp so an importer never has to touch crypto.
- Dispute-resolution / arbitration module for the `Disputed` state.
- Security audit and Polygon PoS mainnet launch.

---

## The honest frontier

A keccak256 document match proves the exporter *holds an agreed file*, not that goods physically shipped. That is the oracle problem, and no MVP solves it trustlessly. Our edge is being explicit about it and standing on real verification (eBL, carrier signatures, licensed oracles) — not pretending a hash already proves shipment.

## What we deliberately do not build

We stand on incumbents rather than rebuilding them: **not** a stablecoin issuer, **not** a settlement rail, **not** a KYC/identity product, **not** a duplicate-financing registry. Focus stays on the SME-facing escrow experience plus UAE stablecoin / halal framing on top of existing verification.

## Phase 2 (parked)

A tokenized shared-loyalty module for the same SME network, and invoice financing built on an escrow's on-chain track record.

---

### References
- Electronic bill of lading & MLETR — [DCSA eBL standard](https://dcsa.org/standards/bill-of-lading), [DCSA interoperability milestone](https://dcsa.org/newsroom/ebl-interoperability-milestone)
- Oracles for trade finance — [Chainlink use cases](https://chain.link/use-cases), [Chainlink docs](https://docs.chain.link/)
- UAE stablecoin rails — [CBUAE Payment Token Services Regulation](https://rulebook.centralbank.ae/en/rulebook/payment-token-services-regulation)

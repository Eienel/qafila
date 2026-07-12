# Qafila — recording script (~3 min)

> Record-ready shooting script for the hackathon demo video. Narration is
> verbatim (say it as written); **[DO]** lines are your clicks. Aim ~3 min.
> Live app: https://qafila-theta.vercel.app/en · Chain: Polygon Amoy (80002).

---

## Before you hit record (setup checklist)

- [ ] **Two wallets** in the browser, both on **Polygon Amoy**, both with a little **POL** for gas:
      - **Importer** (your deploy wallet `0x173a…97Ea`)
      - **Exporter** (your second wallet — the supplier)
      - Faucet if needed: https://faucet.polygon.technology/
- [ ] App open at https://qafila-theta.vercel.app/en (hard-refresh so the latest build loads).
- [ ] Have a small file ready to use as the "Bill of Lading" (any PDF/image).
- [ ] Zoom browser to ~110%, close other tabs, hide bookmarks bar.
- [ ] Optional: pre-create **one escrow and release it** with the exporter so their
      **Supplier reputation** shows a real score (not "New") during the demo. See "Warm-up" below.

### Warm-up (optional, off-camera — gives the supplier a track record)
Run one full escrow to `Released` before recording: create → fund → submit matching doc → auto-release. Now that exporter address shows Silver/Gold reputation on camera.

---

## The recording (~3 min)

### 0:00 — Hook (landing page)
**[DO]** Start on the EN hero. Toggle **EN / العربية** once, then back.
> "This is Qafila — a letter of credit, without the bank. A UAE importer paying a
> new overseas supplier normally waits 7 to 10 days for a bank LC, with a 40%
> document-rejection rate and fees over 1%. We settle it on Polygon in minutes —
> and it works in Arabic and English, fully right-to-left."

### 0:20 — Screen the counterparty
**[DO]** Go to **Dashboard** → **New escrow**. Type a supplier name → **Screen** → show the green badge.
> "First, compliance. Before any money moves we screen the counterparty — we stand
> on OpenSanctions, we don't rebuild sanctions matching. Screened, clear."

### 0:35 — Create the trade
**[DO]** Paste the **Exporter** wallet address. Pick a token (**USDC** or AEDx), amount e.g. **12,000**. Choose **Doc-hash** mode → upload the Bill of Lading file (show the keccak256 hash appear). Set a deadline → **Create**. Confirm the tx.
> "I define the trade: the supplier's wallet, the amount, and the release condition.
> The agreed shipment document is hashed right here in the browser — only the
> keccak256 hash goes on-chain, the file never leaves my device."

### 0:55 — Fund into trust (amana)
**[DO]** On the new escrow: **Approve**, then **Fund**. Show the lantern light up / mashrabiya panel.
> "I fund the escrow. The money isn't sent to the supplier — it's locked in trust,
> amana. The lantern lights: funds are held, not gone."

### 1:20 — Switch to the supplier, post shipment tracking
**[DO]** Switch wallet to the **Exporter**. Open the same escrow → **Shipment tracking** panel. Post a couple of milestones: *In transit — Arabian Sea*, then *Delivered — Rotterdam*. Show the timeline grow.
> "Now the supplier's side. As the goods move, they post shipment milestones —
> in transit, delivered — and every one is written on-chain. This is order tracking
> you can actually verify, not a status in some carrier's private database."

### 1:45 — Prove shipment → auto-release
**[DO]** Still as exporter: upload the **same** Bill of Lading file → **Submit document hash**. Watch it auto-release (gold light sweep, success receipt, tx link).
> "To claim payment, the supplier submits the agreed document. Its hash matches the
> one we locked in — so the contract releases the funds automatically, in the same
> transaction. No bank, no 10-day wait. The light passes to the supplier."

### 2:10 — Supplier reputation
**[DO]** Scroll to the **Supplier reputation** card on the escrow. Point at the score / tier / released count.
> "And every completed trade builds something Alibaba can't fake: an on-chain
> reputation. This supplier's trust score is derived purely from their settled
> history — released, disputed, refunded — not self-reported reviews."

### 2:30 — The honest frontier + the ask
**[DO]** Show the on-chain proof panel / tx on Amoy Polygonscan.
> "We're honest about the hard part: a document hash proves the supplier holds the
> agreed file, not that goods physically shipped. That's the oracle problem — and
> our roadmap closes it with carrier signatures and the electronic Bill of Lading.
> Built on Polygon, aligned with the UAE's licensed dirham-stablecoin rails, Qafila
> turns a 400-year-old bank instrument into a smart contract. Thank you."

---

## Fallbacks if something stalls
- **Tx slow?** Keep talking over the pending state — Amoy usually confirms in seconds.
- **File upload stalls?** Use an **importer-confirms** escrow instead: create with "Importer confirms" mode, fund, then as the importer tap **Confirm & release** (no document needed).
- **Reputation shows "New"?** You skipped the warm-up — either run one release live, or just narrate it as "a brand-new supplier with no history yet, which the score reflects honestly."
- **Wrong network?** RainbowKit will prompt to switch to Amoy — accept it.

## What each beat proves (for judges)
- Screening → **compliance / real-world fit**
- Client-side hashing → **privacy / technical care**
- Fund + auto-release → **the core innovation** (trustless LC)
- Shipment tracking → **UX + verifiable logistics**
- Reputation → **network moat / impact**
- Honest frontier → **credibility**

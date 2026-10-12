# Tieout

<p align="center">
  <img src="public/brand/tieout-logo-light.png#gh-light-mode-only" alt="Tieout Logo" width="380" />
  <img src="public/brand/tieout-logo-dark.png#gh-dark-mode-only" alt="Tieout Logo" width="380" />
</p>

<p align="center">
  <strong>Evidence over narrative. Ecommerce-native financial diligence reconciliation.</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#the-problem">The Problem</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#key-pages--walkthrough">Key Pages</a> •
  <a href="#sample-deal-falcon--trust">Sample Deal</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## Overview

**Tieout** is a dedicated diligence and reconciliation platform purpose-built for ecommerce acquirers, aggregators, and private equity deal teams. 

Traditional Quality of Earnings (QoE) software and accounting tools rely exclusively on General Ledgers (QuickBooks, Xero) and raw bank statements. In direct-to-consumer (D2C) and marketplace ecommerce, that creates a dangerous blind spot: **seller spreadsheets can say whatever the seller wants, while the General Ledger only knows what was manually categorized.**

Tieout bridges this gap by connecting directly to the systems where ecommerce transactions actually occur:
- **Storefronts & Orders:** Shopify order lines, returns, and gross sales.
- **Payment Processors:** Stripe & PayPal payouts, processor processing fees, holdbacks, and chargebacks.
- **Banking:** Actual checking account deposit tie-outs and non-customer transaction identification.
- **Ad Networks:** Meta Ads & Google Ads billing invoices, attributed vs. blended CAC.
- **Operations & Supply Chain:** Landed supplier invoices, 3PL contracts, and domain/account transfer registers.

In minutes—not weeks of manual spreadsheet modeling—Tieout rebuilds the seller's true P&L from source records, calculates verified Seller's Discretionary Earnings (SDE), flags operational dealbreakers, and drafts an Investment Committee memo with live price adjustments.

---

## The Problem

### 1. General Ledger QoE Doesn't Understand Ecommerce
Existing AI QoE platforms (e.g. QoEAgent, Finsider, Shepi) test transactions inside the accounting software. But in modern ecommerce:
- A seller can record $100k of revenue in Xero that never cleared from Stripe.
- A supplier price hike in May might never be recast across historical COGS.
- Meta ad bills paid from a founder's personal credit card never show up on the company's ledger.
- A seller claiming high profitability may have funded cash flow with personal owner deposits disguised as wholesale revenue.

### 2. High-Stakes Speed vs. Diligence Depth
Top acquirers promise rapid offers (soft LOIs within 12–48 hours) and 10–20 day exclusivity closings. Rushing diligence leads to post-close margin collapse; slow diligence causes target brands to walk away or miss seasonal inventory purchasing windows.

---

## How It Works

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SOURCE DATA INGESTION                           │
│  Shopify Orders │ Stripe & PayPal Payouts │ Bank Feeds │ Ad Platforms  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ALGORITHMIC RECONCILIATION ENGINE                    │
│                                                                        │
│  1. Cash Tie-Out: Payout-to-deposit matching (identifies missing       │
│     cash, owner top-ups, unverified deposits).                         │
│  2. Bottom-Up P&L: Rebuilds Gross Margin from supplier invoices and    │
│     real ad spend (exposes unrecorded COGS inflation & unbooked ads).  │
│  3. Add-Back Audit: Verifies personal and one-off expense claims.      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     DECISION & EXECUTION LAYER                         │
│                                                                        │
│  • Verified SDE & Price Multiple adjustment in real time               │
│  • Formal Exception Log with status tracking (Verified/Accepted/etc)   │
│  • Day-One Operational Handover & Risk Matrix                          │
│  • Auto-Generated Investment Committee (IC) Diligence Memo             │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Cash Tie-Out:** Matches every single processor payout from Stripe and PayPal against bank statement deposits by date and dollar amount. Catches missing transfers and flags personal owner injections masquerading as revenue.
2. **Bottom-Up P&L Rebuild:** Recomputes monthly revenue (gross minus refunds), cost of goods sold from supplier factory invoices, and marketing from ad platform bills rather than seller self-reported numbers.
3. **Audited Exception Log:** Converts every variance into a formal diligence finding recording what the seller claimed, what evidence proved, the dollar impact, and deal implications.
4. **Dynamic Price Recalculation:** Toggle individual findings on or off to immediately see how verified SDE and implied valuation change at the target multiple.
5. **Operational Handover Register:** Audits day-one continuity risks (e.g. personal domain registrars, personal payment cards linked to Meta Business Manager, verbal supplier contracts).

---

## Key Pages & Walkthrough

| Route | Name | Purpose |
|---|---|---|
| `/` | **Landing Page** | High-impact overview of Tieout, the ecommerce diligence problem, competitor comparison table, and operator thesis. |
| `/demo` | **Deal Pipeline** | Multi-deal pipeline tracking acquisition targets across stages with side-by-side comparison of **Seller SDE** vs. **Verified SDE**. |
| `/demo/new` | **Seller Intake** | Frictionless seller onboarding simulation. Connects data sources read-only and runs automated reconciliation. |
| `/demo/deals/falcon-trust?tour=1` | **Diligence Workspace** | Comprehensive deal room featuring 6 specialized modules with an interactive 6-step guided tour. |

### Workspace Modules

- **Overview:** Executive summary displaying Stated SDE ($307k) vs. Verified SDE ($213k), Asking Price ($1.02M) vs. Indicated Value (~$707k), and an interactive waterfall variance breakdown.
- **Cash Tie-Out:** Full timeline strip showing all processor payouts matched to bank deposits, uncovering unreceived payouts and non-customer funds.
- **P&L Rebuild:** Month-by-month reconciliation table and Gross Margin trajectory revealing supplier price inflation.
- **Exception Log:** The deal decision center. Change finding statuses (`Verified`, `Accepted in price`, `Specialist`, `Unresolved`) and flip the price adjustment switch to watch valuations react in real time.
- **Handover:** Concentrated supplier risks, owned channel retention metrics, and transferrable asset blockers (domain push, Meta admin rights, payment cards).
- **IC Memo:** Live-updated, copy-ready Investment Committee memo summarizing findings, adjustments, and open points.

---

## Sample Deal: "Falcon & Trust"

The demo environment includes a realistic synthetic dataset for **Falcon & Trust**, a D2C fashion brand operating on Shopify across Sweden and Germany:

- **Seller Asking Price:** $1,020,000 (3.32x stated SDE)
- **Seller-Claimed SDE:** $307,166
- **Tieout Verified SDE:** $213,010 (**-30.7% variance**)
- **Indicated Valuation:** ~$707,000 (at seller's 3.32x multiple)

### Key Discrepancies Uncovered:
1. **Unrecorded COGS Increase (EX-01):** The primary factory in Porto increased unit prices by 8% in May. The seller's spreadsheet maintained static margins, masking a $42,400 profit shortfall.
2. **Missing Cash Payout (EX-02):** A $3,180 PayPal payout from Black Friday week was initiated but never deposited into the bank account.
3. **Founder Capital Injection (EX-03):** Two bank deposits totaling $28,000 in Q1 were founder cash injections to fund inventory, incorrectly booked as wholesale revenue.
4. **Unbooked Ad Spend (EX-04):** $24,800 in Meta Ads spend ran on the founder's personal American Express card and was omitted from the company P&L.
5. **Day-One Closing Blockers:** The store domain (`falcontrust.com`) is held in a personal registrar account, and the Meta ad account payment method is tied to an unassigned personal card.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with curated dark-navy and glassmorphic palette
- **Animation & Micro-interactions:** [Motion (Framer Motion v12)](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Engine:** Deterministic, seeded pure TypeScript synthetic diligence generator (`src/lib/engine.ts`)

---

## Getting Started

### Prerequisites
- Node.js 18.18.0 or newer
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/parthivabhani/Tieout.git
   cd Tieout
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Key Scripts

- `npm run dev`: Launch local development server
- `npm run build`: Compile production Next.js build
- `npm run start`: Start production server
- `npm run lint`: Run ESLint validation

---

## Project Structure

```
tieout/
├── public/
│   └── brand/
│       ├── tieout-logo-light.png   # Transparent logo (dark text for light surfaces)
│       ├── tieout-logo-dark.png    # Transparent logo (white text for dark surfaces)
│       ├── tieout-mark.png         # Ribbon checkmark icon
│       └── ecomma-logo.svg         # Partner/firm vector logo
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML shell & metadata
│   │   ├── page.tsx                # Commercial landing page
│   │   ├── globals.css             # Tailwind & design system styles
│   │   └── demo/
│   │       ├── layout.tsx          # Workspace header with interactive logo back-link
│   │       ├── page.tsx            # Deal pipeline view
│   │       ├── new/
│   │       │   └── page.tsx        # Seller intake & data connection flow
│   │       └── deals/
│   │           └── [id]/
│   │               └── page.tsx    # Interactive deal room workspace
│   ├── components/
│   │   ├── brand/
│   │   │   ├── TieoutMark.tsx      # Optimized Tieout mark & wordmark components
│   │   │   └── EcommaLogo.tsx      # Scalable Ecomma brand SVG
│   │   ├── landing/                # Hero, Flow, Features, Comparison, Closing
│   │   └── app/
│   │       ├── Workspace.tsx       # Main workspace coordinator with tour state
│   │       ├── AppNav.tsx          # Deal room tab navigation
│   │       ├── charts.tsx          # Financial strips & margin comparison charts
│   │       └── tabs/               # Overview, Cash, Pnl, Exceptions, Handover, Memo
│   └── lib/
│       ├── engine.ts               # Reconciliation calculation & synthetic data engine
│       ├── format.ts               # Currency, percentage, and rounding utilities
│       └── site.ts                 # Project metadata & contact config
├── package.json
└── tsconfig.json
```

---

## License

Private repository. Developed for demonstration and strategic diligence evaluation.

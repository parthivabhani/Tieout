// Synthetic seller pack + reconciliation engine.
// Everything is generated from a fixed seed so the demo is identical every run.
// "Falcon & Trust" and all figures are fictional.

export type Severity = "critical" | "serious" | "warning";
export type Status = "Verified" | "Accepted in price" | "Specialist" | "Unresolved";

export interface Day {
  t: number;
  m: number;
  gross: number;
  orders: number;
  refunds: number;
  stripeNet: number;
  paypalNet: number;
  fees: number;
}
export interface Payout {
  id: string;
  src: "Stripe" | "PayPal";
  t: number;
  amt: number;
  bankId?: string;
  bankT?: number;
}
export interface BankLine {
  id: string;
  t: number;
  amt: number;
  desc: string;
  kind?: "owner" | "wholesale";
  payoutId?: string;
}
export interface Month {
  label: string;
  short: string;
  gross: number;
  refunds: number;
  orders: number;
  fees: number;
  payouts: number;
  bankMatched: number;
  bankOther: number;
  ownerIn: number;
  wholesale: number;
  net: number;
  refundRate: number;
  metaPlatform: number;
  metaLedger: number;
  google: number;
  attributed: number;
  cogsClaimed: number;
  cogsVerified: number;
  fulfil: number;
  software: number;
  cs: number;
  owner: number;
  oneOff: number;
  wholesaleCogs: number;
  revClaimed: number;
  revVerified: number;
  profitClaimed: number;
  gmClaimed: number;
  gmVerified: number;
}
export interface Exception {
  id: string;
  sev: Severity;
  area: string;
  short: string;
  claim: string;
  evidence: string;
  source: string;
  period: string;
  diff: number;
  impact: number;
  implication: string;
  status: Status;
  apply: boolean;
}
export interface Addback {
  label: string;
  amt: number;
  evidence: string;
  verdict: string;
  tone: "good" | "bad" | "info";
}

function rng(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

export function buildDeal() {
  const r = rng(20261013);
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const DAY = 864e5;
  const START = Date.UTC(2025, 9, 1);
  const N_DAYS = 365;
  const LABELS = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26"];
  const SEASON = [0.95, 1.22, 1.48, 0.86, 0.8, 0.9, 0.96, 1.0, 0.95, 0.9, 0.93, 1.05];
  const BASE_DAILY = 3900;
  const AOV = 68;
  const monthOf = (t: number) => {
    const d = new Date(t);
    return (d.getUTCFullYear() - 2025) * 12 + d.getUTCMonth() - 9;
  };
  const id = (p: string) => p + "_" + Math.floor(r() * 2 ** 40).toString(36).padStart(8, "0");

  // Shopify orders, rolled up per day
  const days: Day[] = [];
  for (let i = 0; i < N_DAYS; i++) {
    const t = START + i * DAY;
    const m = monthOf(t);
    const wd = new Date(t).getUTCDay();
    const wk = wd === 0 || wd === 6 ? 1.12 : 0.95;
    const gross = BASE_DAILY * SEASON[m] * wk * (0.8 + 0.4 * r());
    const orders = Math.max(1, Math.round(gross / AOV));
    const refundRate = m >= 1 && m <= 3 ? 0.14 : 0.085;
    const refunds = gross * refundRate * (0.7 + 0.6 * r());
    const net = gross - refunds;
    const sOrders = Math.round(orders * 0.78);
    const pOrders = orders - sOrders;
    const stripeFee = net * 0.78 * 0.029 + sOrders * 0.3;
    const paypalFee = net * 0.22 * 0.0349 + pOrders * 0.49;
    days.push({
      t, m, gross: r2(gross), orders, refunds: r2(refunds),
      stripeNet: r2(net * 0.78 - stripeFee), paypalNet: r2(net * 0.22 - paypalFee), fees: r2(stripeFee + paypalFee),
    });
  }

  // Processor payouts: Stripe every 2 days, PayPal weekly
  const payouts: Payout[] = [];
  for (let i = 0; i < N_DAYS; i += 2) {
    const amt = r2(days[i].stripeNet + (days[i + 1] ? days[i + 1].stripeNet : 0));
    payouts.push({ id: id("po"), src: "Stripe", t: days[Math.min(i + 1, N_DAYS - 1)].t + 2 * DAY, amt });
  }
  for (let i = 0; i < N_DAYS; i += 7) {
    let amt = 0;
    for (let j = i; j < Math.min(i + 7, N_DAYS); j++) amt += days[j].paypalNet;
    payouts.push({ id: id("pp"), src: "PayPal", t: days[Math.min(i + 6, N_DAYS - 1)].t + DAY, amt: r2(amt) });
  }
  payouts.sort((a, b) => a.t - b.t);

  // Bank statement: every payout lands 1–3 days later, except one March Stripe
  // payout. Three non-processor inflows are planted.
  const march = payouts.filter((p) => p.src === "Stripe" && monthOf(p.t) === 5);
  const missing = march.reduce((a, b) => (b.amt > a.amt ? b : a));
  const bank: BankLine[] = [];
  for (const p of payouts) {
    if (p === missing) continue;
    bank.push({
      id: id("bk"), t: p.t + (1 + Math.floor(r() * 3)) * DAY, amt: p.amt,
      desc: p.src === "Stripe" ? "STRIPE PAYMENTS EUROPE LTD" : "PAYPAL EUROPE TRANSFER",
    });
  }
  const OTHER: BankLine[] = [
    { id: "", t: Date.UTC(2026, 1, 14), amt: 12000, desc: "TRANSFER FROM G LINDQVIST", kind: "owner" },
    { id: "", t: Date.UTC(2026, 5, 3), amt: 6500, desc: "TRANSFER FROM G LINDQVIST", kind: "owner" },
    { id: "", t: Date.UTC(2026, 7, 19), amt: 18400, desc: "NORDSTIL AB INV-2207", kind: "wholesale" },
  ];
  for (const o of OTHER) bank.push({ ...o, id: id("bk") });
  bank.sort((a, b) => a.t - b.t);

  // Matching: exact amount, 0–5 days after payout, each deposit used once
  const used = new Set<string>();
  for (const p of payouts) {
    const hit = bank.find((b) => !used.has(b.id) && Math.abs(b.amt - p.amt) < 0.005 && b.t - p.t >= 0 && b.t - p.t <= 5 * DAY);
    if (hit) {
      used.add(hit.id);
      p.bankId = hit.id;
      p.bankT = hit.t;
      hit.payoutId = p.id;
    }
  }
  const unmatchedPayouts = payouts.filter((p) => !p.bankId);
  const unmatchedDeposits = bank.filter((b) => !b.payoutId);

  // Monthly roll-up
  const M = LABELS.map((label) => ({
    label, short: label.slice(0, 3), gross: 0, refunds: 0, orders: 0, fees: 0, payouts: 0, bankMatched: 0, bankOther: 0, ownerIn: 0, wholesale: 0,
  })) as Month[];
  for (const d of days) {
    const x = M[d.m];
    x.gross += d.gross; x.refunds += d.refunds; x.orders += d.orders; x.fees += d.fees;
  }
  // Matched deposits count in their payout's month, so month-end timing isn't variance
  for (const p of payouts) {
    const m = Math.min(monthOf(p.t), 11);
    M[m].payouts += p.amt;
    if (p.bankId) M[m].bankMatched += p.amt;
  }
  for (const b of bank) {
    const m = monthOf(b.t);
    if (!M[m]) continue;
    if (!b.payoutId) M[m].bankOther += b.amt;
    if (b.kind === "owner") M[m].ownerIn += b.amt;
    if (b.kind === "wholesale") M[m].wholesale += b.amt;
  }
  const PERSONAL_CARD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2100, 2600, 3000];
  M.forEach((x, i) => {
    x.net = x.gross - x.refunds;
    x.refundRate = x.refunds / x.gross;
    x.metaPlatform = x.net * 0.21 * (0.92 + 0.16 * r());
    x.metaLedger = x.metaPlatform - PERSONAL_CARD[i];
    x.google = x.net * 0.07 * (0.9 + 0.2 * r());
    x.attributed = x.metaPlatform * 3.9 + x.google * 4.6;
    x.cogsClaimed = x.net * 0.38;
    x.cogsVerified = x.net * (i >= 7 ? 0.43 : 0.38);
    x.fulfil = x.net * 0.085;
    x.software = 680;
    x.cs = 1200;
    x.owner = 4000;
    x.oneOff = (i === 3 ? 12000 : 0) + (i === 6 ? 5200 : 0);
    x.wholesaleCogs = x.wholesale * 0.5;
    x.revClaimed = x.net + x.ownerIn + x.wholesale;
    x.revVerified = x.net + x.wholesale;
    const opex = x.fees + x.google + x.fulfil + x.software + x.cs + x.owner + x.oneOff;
    x.profitClaimed = x.revClaimed - x.cogsClaimed - x.metaLedger - opex;
    x.gmClaimed = 1 - x.cogsClaimed / x.net;
    x.gmVerified = 1 - x.cogsVerified / x.net;
  });
  const sum = (k: keyof Month) => M.reduce((a, x) => a + (x[k] as number), 0);

  const addbacks: Addback[] = [
    { label: "Owner salary", amt: 48000, evidence: "Payroll entries", verdict: "Replaced by operator cost", tone: "info" },
    { label: "Rebrand agency (Jan)", amt: 12000, evidence: "Invoice #A-1182", verdict: "Verified one-off", tone: "good" },
    { label: "Trade show (Apr)", amt: 5200, evidence: "Card statement + receipt", verdict: "Verified one-off", tone: "good" },
    { label: "Apps & software", amt: 8160, evidence: "Klaviyo, Gorgias, Recharge", verdict: "Rejected: needed to run the store", tone: "bad" },
  ];
  const profitClaimed = sum("profitClaimed");
  const sdeClaimed = profitClaimed + addbacks.reduce((a, b) => a + b.amt, 0);
  const ask = 1020000;

  const cogsGap = M.reduce((a, x) => a + (x.cogsVerified - x.cogsClaimed), 0);
  const personalAds = PERSONAL_CARD.reduce((a, b) => a + b, 0);
  const ownerIn = sum("ownerIn");
  const wholesale = sum("wholesale");
  const metaShare = sum("metaPlatform") / (sum("metaPlatform") + sum("google"));
  const attribRatio = sum("attributed") / sum("net");
  const refundPeak = Math.max(...M.map((x) => x.refundRate));
  const refundBase = M.filter((_, i) => i > 3).reduce((a, x) => a + x.refundRate, 0) / 8;

  // Same "decision record" shape as Ecomma's published diligence checklist
  const exceptions: Exception[] = [
    {
      id: "EX-01", sev: "critical", area: "Revenue", short: "Owner transfers counted as sales",
      claim: "Revenue includes every bank inflow",
      evidence: `Two deposits from "G LINDQVIST" (the founder, personally) match no Stripe or PayPal payout.`,
      source: "Bank CSV × processor payouts",
      period: "Feb & Jun 26", diff: ownerIn, impact: -ownerIn,
      implication: "Founder topped up the account and it was booked as sales. Remove from revenue.",
      status: "Verified", apply: true,
    },
    {
      id: "EX-02", sev: "critical", area: "Cash", short: "A Stripe payout never reached the bank",
      claim: "Every payout lands in the business account",
      evidence: `Stripe payout ${missing.id} on ${iso(missing.t)} has no matching bank deposit within 5 days.`,
      source: "Stripe payouts × Bank CSV",
      period: "Mar 26", diff: missing.amt, impact: 0,
      implication: "The sales are real, but the cash went somewhere else. Ask for the other account's statement.",
      status: "Unresolved", apply: false,
    },
    {
      id: "EX-03", sev: "serious", area: "Marketing", short: "Ads paid on a card outside the books",
      claim: "Ad spend in the ledger is complete",
      evidence: "Meta billing is higher than the ledger for Jul–Sep. The difference was charged to a card that isn't in the books.",
      source: "Meta billing × Xero",
      period: "Jul–Sep 26", diff: personalAds, impact: -personalAds,
      implication: "Cost of acquiring customers is understated. Add it back to costs.",
      status: "Verified", apply: true,
    },
    {
      id: "EX-04", sev: "serious", area: "Margin", short: "Supplier price rise missing from P&L",
      claim: "Product cost stayed at 38% of sales",
      evidence: "Supplier invoices show unit cost +8% and higher freight from May.",
      source: "Supplier invoices × Xero",
      period: "May–Sep 26", diff: cogsGap, impact: -cogsGap,
      implication: "Gross margin really fell from 62% to 57%. Use the lower margin going forward.",
      status: "Verified", apply: true,
    },
    {
      id: "EX-05", sev: "serious", area: "Add-backs", short: "Founder's work needs replacing",
      claim: "Owner salary can be fully added back",
      evidence: "The founder does supplier emails, buying and creative direction every week.",
      source: "Seller interview × task list",
      period: "TTM", diff: 48000, impact: -24000,
      implication: "A hands-off buyer must pay someone to do this. Replacement cost is about $24k a year.",
      status: "Accepted in price", apply: true,
    },
    {
      id: "EX-06", sev: "warning", area: "Add-backs", short: "Software isn't optional",
      claim: "Apps & software are non-essential",
      evidence: "Klaviyo flows drive 21% of revenue. Gorgias runs customer support.",
      source: "Klaviyo × Shopify",
      period: "TTM", diff: 8160, impact: -8160,
      implication: "This is a running cost, not a one-off. Reject the add-back.",
      status: "Verified", apply: true,
    },
    {
      id: "EX-07", sev: "warning", area: "Revenue", short: "One-off wholesale order",
      claim: "The wholesale order will repeat",
      evidence: "A single Nordstil AB invoice. No repeat order and no contract.",
      source: "Bank CSV × invoices",
      period: "Aug 26", diff: wholesale, impact: -(wholesale * 0.5),
      implication: "Don't pay a multiple on a one-off. Exclude its profit from the base.",
      status: "Accepted in price", apply: true,
    },
    {
      id: "EX-08", sev: "warning", area: "Customers", short: "Refunds spike in winter",
      claim: "Refund rate is stable at 8–9%",
      evidence: `Refunds peaked at ${(refundPeak * 100).toFixed(1)}% in Nov–Jan vs ${(refundBase * 100).toFixed(1)}% the rest of the year.`,
      source: "Shopify refunds",
      period: "Nov 25–Jan 26", diff: 0, impact: 0,
      implication: "Seasonal, or one bad product? Needs a returns breakdown by SKU.",
      status: "Specialist", apply: false,
    },
    {
      id: "EX-09", sev: "warning", area: "Marketing", short: "Ad platforms double-count sales",
      claim: "Meta & Google ROAS as reported",
      evidence: `Meta + Google together claim ${(attribRatio * 100).toFixed(0)}% of actual store sales.`,
      source: "Ad platforms × Shopify",
      period: "TTM", diff: 0, impact: 0,
      implication: "Judge the ad engine on real orders, not platform dashboards.",
      status: "Verified", apply: false,
    },
    {
      id: "EX-10", sev: "serious", area: "Suppliers", short: "One factory, verbal terms",
      claim: "The supplier relationship transfers",
      evidence: "84% of product cost comes from one factory in Porto. Terms are verbal, with no contract.",
      source: "Supplier invoices",
      period: "Current", diff: 0, impact: 0,
      implication: "Get written consent and terms before the LOI becomes binding.",
      status: "Unresolved", apply: false,
    },
  ];

  const dependencies = [
    { asset: "Shopify store", owner: "Founder (staff account)", method: "Ownership transfer", state: "Ready" },
    { asset: "Domain falcontrust.com", owner: "Founder's personal registrar", method: "Registrar push", state: "Ready" },
    { asset: "Meta Business Manager", owner: "Founder's personal profile", method: "Add buyer as admin", state: "At risk" },
    { asset: "Meta ad payment card", owner: "Personal card (not in books)", method: "Replace before close", state: "Blocked" },
    { asset: "Klaviyo (email & SMS)", owner: "Business account", method: "Account transfer", state: "Ready" },
    { asset: "Stripe", owner: "Linked to seller entity", method: "New account + KYC", state: "Rebuild" },
    { asset: "Porto factory", owner: "Verbal, founder's email", method: "Written consent", state: "Blocked" },
    { asset: "3PL (Malmö)", owner: "Contract, assignable", method: "Notice of assignment", state: "Ready" },
  ] as const;

  return {
    deal: {
      id: "falcon-trust",
      name: "Falcon & Trust",
      category: "Fashion · D2C · Shopify",
      region: "Sweden / Germany",
      ttm: "Oct 2025 – Sep 2026",
      ask,
      sdeClaimed,
      profitClaimed,
    },
    months: M,
    days,
    payouts,
    bank,
    unmatchedPayouts,
    unmatchedDeposits,
    addbacks,
    exceptions,
    dependencies,
    stats: {
      orders: sum("orders"), gross: sum("gross"), net: sum("net"), refunds: sum("refunds"),
      metaShare, attribRatio, supplierShare: 0.84, topSkuShare: 0.41, klaviyoShare: 0.21,
      cogsGap, personalAds, ownerIn, wholesale, missing,
      stripeCount: payouts.filter((p) => p.src === "Stripe").length,
      paypalCount: payouts.filter((p) => p.src === "PayPal").length,
    },
  };
}

export type Deal = ReturnType<typeof buildDeal>;

export function verify(deal: Deal, exceptions: Exception[]) {
  const adj = exceptions.filter((e) => e.apply && e.impact);
  const sde = deal.deal.sdeClaimed + adj.reduce((a, e) => a + e.impact, 0);
  const mult = deal.deal.ask / deal.deal.sdeClaimed;
  return { adj, sde, mult, price: sde * mult };
}

export interface PnlRow {
  line: string;
  seller: number;
  rebuilt: number;
  source: string;
  total?: boolean;
}

// Seller P&L vs the P&L rebuilt from source systems, TTM.
export function pnlRows(deal: Deal): PnlRow[] {
  const t = (k: keyof Month) => deal.months.reduce((a, x) => a + (x[k] as number), 0);
  const rows: PnlRow[] = [
    { line: "Revenue", seller: t("revClaimed"), rebuilt: t("revVerified"), source: "Shopify orders net of refunds; owner transfers removed" },
    { line: "Cost of goods", seller: -t("cogsClaimed"), rebuilt: -(t("cogsVerified") + t("wholesaleCogs")), source: "Supplier invoices; wholesale cost added" },
  ];
  rows.push({ line: "Gross profit", seller: rows[0].seller + rows[1].seller, rebuilt: rows[0].rebuilt + rows[1].rebuilt, source: "", total: true });
  const opex: PnlRow[] = [
    { line: "Paid media", seller: -(t("metaLedger") + t("google")), rebuilt: -(t("metaPlatform") + t("google")), source: "Meta & Google billing, not the ledger" },
    { line: "Processor fees", seller: -t("fees"), rebuilt: -t("fees"), source: "Stripe & PayPal payout reports" },
    { line: "Fulfilment (3PL)", seller: -t("fulfil"), rebuilt: -t("fulfil"), source: "3PL invoices" },
    { line: "Software & support", seller: -(t("software") + t("cs")), rebuilt: -(t("software") + t("cs")), source: "Card statements" },
    { line: "Owner salary & one-offs", seller: -(t("owner") + t("oneOff")), rebuilt: -(t("owner") + t("oneOff")), source: "Payroll, invoices" },
  ];
  rows.push(...opex);
  rows.push({
    line: "Net profit",
    seller: rows[2].seller + opex.reduce((a, r) => a + r.seller, 0),
    rebuilt: rows[2].rebuilt + opex.reduce((a, r) => a + r.rebuilt, 0),
    source: "",
    total: true,
  });
  return rows;
}

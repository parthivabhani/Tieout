"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plug, GitCompareArrows, Calculator, Gavel, Check, X } from "lucide-react";
import clsx from "clsx";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    icon: Plug,
    title: "Connect",
    head: "Read-only access to the systems that produced the numbers",
    body: "The seller connects Shopify, Stripe, PayPal and their ad accounts, or uploads exports. Add the bank statement, the Xero file and supplier invoices. Tieout works from what those systems recorded, not from screenshots or the seller's own summary.",
  },
  {
    icon: GitCompareArrows,
    title: "Tie out",
    head: "Every payout matched to a bank deposit, in both directions",
    body: "Each Stripe and PayPal payout is matched to a deposit by amount and date. Two lists come out: payouts that never reached the bank, and deposits that didn't come from a processor, such as owner top-ups, loans or one-off wholesale orders.",
  },
  {
    icon: Calculator,
    title: "Rebuild",
    head: "The P&L rebuilt from orders, invoices and ad billing",
    body: "Revenue comes from orders net of refunds. Product cost comes from supplier invoices. Ad spend comes from platform billing, not the ledger. Each add-back is tested against the evidence behind it, so the seller's P&L and the rebuilt one can be compared line by line.",
  },
  {
    icon: Gavel,
    title: "Decide",
    head: "One exception log, in the format your checklist already uses",
    body: "Each finding records the claim, the evidence, the period, the difference and what it means for the deal. Mark each one Verified, Accepted in price, Specialist or Unresolved. Verified earnings and the indicated price update as you go, and the IC memo is drafted for you.",
  },
];

function Visual({ i }: { i: number }) {
  if (i === 0) {
    const src = ["Shopify", "Stripe", "PayPal", "Klarna", "Bank CSV", "Meta Ads", "Google Ads", "Xero", "Supplier PDFs"];
    return (
      <div className="grid grid-cols-3 gap-3">
        {src.map((s, k) => (
          <motion.div key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.05 }} className="panel-inner flex items-center gap-2 px-3 py-3 text-[13px] text-white/85">
            <span className="h-2 w-2 rounded-full bg-good shadow-[0_0_10px_#2fc28a]" /> {s}
          </motion.div>
        ))}
      </div>
    );
  }
  if (i === 1) {
    const rows = [
      ["po_7nbw…", "$5,370.24", "—", false],
      ["po_k2rq…", "$1,284.10", "Mar 07", true],
      ["pp_31ze…", "$2,906.55", "Mar 09", true],
      ["po_x8fa…", "$1,190.42", "Mar 09", true],
    ] as const;
    return (
      <div className="space-y-2.5">
        {rows.map(([id, amt, d, ok], k) => (
          <motion.div key={id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.08 }} className="panel-inner grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3 text-[13px]">
            <span className="font-mono text-white/60">{id}</span>
            <span className="num text-white">{amt}</span>
            <span className="text-white/50">{d}</span>
            <span className={clsx("grid h-6 w-6 place-items-center rounded-full", ok ? "bg-good/15 text-good" : "bg-crit/15 text-crit")}>{ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}</span>
          </motion.div>
        ))}
        <div className="pt-2 text-[12.5px] text-white/50">235 of 236 matched · 3 deposits with no payout</div>
      </div>
    );
  }
  if (i === 2) {
    const rows = [
      ["Revenue", "$1,315,547", "$1,297,047"],
      ["Cost of goods", "−$485,886", "−$521,682"],
      ["Paid media", "−$353,537", "−$361,237"],
      ["Net profit", "$233,806", "$171,810"],
    ];
    return (
      <div className="panel-inner overflow-hidden">
        <div className="grid grid-cols-3 border-b border-white/5 px-4 py-2.5 text-[11px] uppercase tracking-wider text-white/40"><span>Line</span><span className="text-right">Seller</span><span className="text-right">Rebuilt</span></div>
        {rows.map(([l, a, b], k) => (
          <motion.div key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: k * 0.07 }} className={clsx("grid grid-cols-3 px-4 py-3 text-[13.5px]", k === 3 && "bg-white/[0.03] font-semibold")}>
            <span className="text-white/80">{l}</span>
            <span className="num text-right text-white/45 line-through decoration-white/20">{a}</span>
            <span className="num text-right text-white">{b}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  const items = [
    ["EX-01", "Owner transfers counted as sales", "Verified", "bg-good"],
    ["EX-04", "Supplier price rise missing", "Verified", "bg-good"],
    ["EX-05", "Founder's work needs replacing", "Accepted in price", "bg-cyan"],
    ["EX-10", "One factory, verbal terms", "Unresolved", "bg-crit"],
  ];
  return (
    <div className="space-y-2.5">
      {items.map(([id, t, s, c], k) => (
        <motion.div key={id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.07 }} className="panel-inner flex items-center gap-3 px-4 py-3 text-[13.5px]">
          <span className="font-mono text-[12px] text-white/45">{id}</span>
          <span className="flex-1 text-white/90">{t}</span>
          <span className="flex items-center gap-1.5 text-[12px] text-white/70"><span className={`h-2 w-2 rounded-full ${c}`} />{s}</span>
        </motion.div>
      ))}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-deep to-cyan/80 px-4 py-3 text-[13.5px] font-semibold text-white">
        <span>Verified SDE</span><span className="num">$213,010</span>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [i, setI] = useState(1);
  const S = steps[i];
  return (
    <section id="how" className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand-deep/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-cyan">
            <span className="h-[3px] w-8 rounded-full bg-cyan" /> How it works
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            From a seller&apos;s raw data to a decision, <span className="font-display font-medium italic text-cyan">in four steps.</span>
          </h2>
        </Reveal>

        <div className="mt-12 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1.5 scrollbar-none">
          {steps.map((s, k) => (
            <button key={s.title} onClick={() => setI(k)} className={clsx("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-medium transition", k === i ? "bg-cyan text-navy-950" : "text-white/65 hover:text-white")}>
              <s.icon className="h-4 w-4" />
              <span className="text-[11px] opacity-60">0{k + 1}</span> {s.title}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="panel relative p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <div className="font-display text-6xl text-white/10">0{i + 1}</div>
                <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-tight">{S.head}</h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-white/65">{S.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 flex gap-2">
              {steps.map((_, k) => (
                <button key={k} aria-label={`Step ${k + 1}`} onClick={() => setI(k)} className={clsx("h-1.5 rounded-full transition-all", k === i ? "w-10 bg-cyan" : "w-4 bg-white/15")} />
              ))}
            </div>
          </div>
          <div className="panel min-h-[340px] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Visual i={i} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

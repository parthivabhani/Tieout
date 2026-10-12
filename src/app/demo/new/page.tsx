"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, CreditCard, Wallet, Landmark, Megaphone, Search, BookOpen, FileText, Check, Loader2, ArrowRight, Package, Info } from "lucide-react";
import clsx from "clsx";
import { buildDeal, verify } from "@/lib/engine";
import { usd } from "@/lib/format";

const SOURCES = [
  { key: "shopify", name: "Shopify", how: "OAuth · read-only", icon: ShoppingBag, what: "Orders, refunds, products" },
  { key: "stripe", name: "Stripe", how: "OAuth · read-only", icon: CreditCard, what: "Charges, fees, payouts" },
  { key: "paypal", name: "PayPal", how: "CSV export", icon: Wallet, what: "Transactions, transfers" },
  { key: "bank", name: "Bank statement", how: "CSV / MT940 upload", icon: Landmark, what: "Every deposit and withdrawal" },
  { key: "meta", name: "Meta Ads", how: "OAuth · read-only", icon: Megaphone, what: "Billing, attributed revenue" },
  { key: "google", name: "Google Ads", how: "OAuth · read-only", icon: Search, what: "Billing, conversions" },
  { key: "xero", name: "Xero", how: "OAuth · read-only", icon: BookOpen, what: "The seller's own P&L" },
  { key: "invoices", name: "Supplier invoices", how: "PDF upload", icon: FileText, what: "Landed cost per unit" },
];

export default function NewDeal() {
  const deal = useMemo(() => buildDeal(), []);
  const verifiedSde = useMemo(() => verify(deal, deal.exceptions).sde, [deal]);
  const [connected, setConnected] = useState<string[]>([]);
  const [phase, setPhase] = useState<"connect" | "run" | "done">("connect");
  const [step, setStep] = useState(0);

  const STEPS = [
    { t: "Reading Shopify orders", d: `${deal.stats.orders.toLocaleString()} orders · ${usd(deal.stats.gross)} gross` },
    { t: "Reading processor payouts", d: `${deal.stats.stripeCount} Stripe + ${deal.stats.paypalCount} PayPal payouts` },
    { t: "Matching payouts to the bank", d: `${deal.payouts.length - deal.unmatchedPayouts.length} of ${deal.payouts.length} matched · ${deal.unmatchedDeposits.length} deposits with no payout` },
    { t: "Rebuilding the P&L from source", d: "Revenue, product cost, ad billing, fees" },
    { t: "Testing the seller's add-backs", d: `${deal.addbacks.length} add-backs checked against evidence` },
    { t: "Writing the exception log", d: `${deal.exceptions.length} findings · ${deal.exceptions.filter((e) => e.status === "Unresolved").length} unresolved` },
  ];

  useEffect(() => {
    if (phase !== "run") return;
    if (step >= STEPS.length) {
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [phase, step, STEPS.length]);

  const all = connected.length === SOURCES.length;

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cyan">New deal</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Falcon &amp; Trust <span className="font-display italic font-medium text-white/50">· seller intake</span>
      </h1>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan/20 bg-cyan/[0.06] p-4 text-[13.5px] leading-relaxed text-white/75">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
        <p>
          The seller gets a link and connects their accounts read-only, or uploads exports. Nobody re-types numbers, and the seller never sends a spreadsheet they built themselves. <b className="text-white">In this demo, click &ldquo;Load sample seller pack&rdquo;.</b>
        </p>
      </div>

      {phase === "connect" && (
          <motion.section key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SOURCES.map((s, i) => {
                const on = connected.includes(s.key);
                return (
                  <motion.button
                    key={s.key}
                    onClick={() => setConnected((c) => (on ? c.filter((k) => k !== s.key) : [...c, s.key]))}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={clsx("panel relative p-5 text-left transition", on ? "ring-1 ring-good/60" : "hover:bg-white/[0.04]")}
                  >
                    <div className="flex items-center justify-between">
                      <span className={clsx("grid h-11 w-11 place-items-center rounded-2xl", on ? "bg-good/15 text-good" : "bg-white/5 text-cyan")}><s.icon className="h-5 w-5" /></span>
                      <span className={clsx("rounded-full px-2.5 py-1 text-[11px] font-medium", on ? "bg-good/15 text-good" : "bg-white/5 text-white/55")}>{on ? "Connected" : "Connect"}</span>
                    </div>
                    <div className="mt-4 text-[15px] font-semibold">{s.name}</div>
                    <div className="mt-0.5 text-[12px] text-white/45">{s.how}</div>
                    <div className="mt-3 text-[12.5px] text-white/65">{s.what}</div>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => setConnected(SOURCES.map((s) => s.key))} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13.5px] font-medium text-white/85 transition hover:bg-white/5">
                <Package className="h-4 w-4" /> Load sample seller pack
              </button>
              <button
                disabled={!all}
                onClick={() => { setPhase("run"); setStep(0); }}
                className={clsx("flex items-center gap-2 rounded-full px-6 py-2.5 text-[13.5px] font-semibold transition", all ? "bg-cyan text-navy-950 hover:bg-white" : "cursor-not-allowed bg-white/10 text-white/35")}
              >
                Run tie-out <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-[12.5px] text-white/45">{connected.length} of {SOURCES.length} sources</span>
            </div>
          </motion.section>
        )}

        {phase !== "connect" && (
          <motion.section key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="panel p-6 sm:p-8">
              <div className="text-[13px] font-semibold text-white/80">Running the tie-out</div>
              <ol className="mt-6 space-y-5">
                {STEPS.map((s, i) => {
                  const state = i < step ? "done" : i === step && phase === "run" ? "run" : phase === "done" ? "done" : "wait";
                  return (
                    <li key={s.t} className="flex gap-4">
                      <span className={clsx("grid h-8 w-8 shrink-0 place-items-center rounded-full border", state === "done" ? "border-good/40 bg-good/15 text-good" : state === "run" ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-white/10 text-white/25")}>
                        {state === "done" ? <Check className="h-4 w-4" /> : state === "run" ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-[12px]">{i + 1}</span>}
                      </span>
                      <div>
                        <div className={clsx("text-[14.5px] font-medium", state === "wait" ? "text-white/35" : "text-white")}>{s.t}</div>
                        <AnimatePresence>
                          {state === "done" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="num text-[12.5px] text-white/50">{s.d}</motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="panel flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="text-[13px] font-semibold text-white/80">Result</div>
                <div className="mt-6 space-y-5">
                  <div>
                    <div className="text-[12px] text-white/45">Seller-stated earnings</div>
                    <div className="num font-display text-4xl text-white/50 line-through decoration-white/20">{usd(deal.deal.sdeClaimed)}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-white/45">Supported by evidence</div>
                    <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: phase === "done" ? 1 : 0.15 }} className="num font-display text-5xl text-cyan">
                      {phase === "done" ? usd(verifiedSde) : "$———"}
                    </motion.div>
                  </div>
                </div>
              </div>
              <Link
                href="/demo/deals/falcon-trust?tour=1"
                className={clsx("mt-8 flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[14px] font-semibold transition", phase === "done" ? "bg-cyan text-navy-950 hover:bg-white" : "pointer-events-none bg-white/5 text-white/30")}
              >
                Open the results <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.section>
        )}
    </main>
  );
}

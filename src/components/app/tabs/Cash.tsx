"use client";
import { Activity, BarChart3, Landmark, Table2 } from "lucide-react";
import type { Deal } from "@/lib/engine";
import { iso } from "@/lib/engine";
import { usd, pct } from "@/lib/format";
import { Panel, PanelHead, Explain } from "../ui";
import { PayoutStrip, GapBars } from "../charts";

export function Cash({ deal }: { deal: Deal }) {
  const matched = deal.payouts.length - deal.unmatchedPayouts.length;
  const m = deal.stats.missing;
  const kind = { owner: "Founder's personal transfer", wholesale: "Wholesale invoice" } as const;
  const tot = (k: "orders" | "gross" | "refunds" | "fees" | "payouts" | "bankMatched") => deal.months.reduce((a, x) => a + x[k], 0);
  return (
    <div className="space-y-5">
      <Explain>
        <b className="text-white">Did the money really arrive?</b> When a customer pays, Stripe or PayPal collects it and later sends a <i>payout</i> to the seller&apos;s bank. Tieout checked all {deal.payouts.length} payouts against bank deposits by amount and date. <b className="text-white">{matched} matched.</b> One {usd(m.amt, 2)} payout never arrived, and {deal.unmatchedDeposits.length} deposits came from somewhere other than customers.
      </Explain>

      <Panel>
        <PanelHead icon={Activity} title="Every payout, across the year" sub="Each line is one payout. Green = found in the bank. Red = not found. Hover any line." right={<span className="num rounded-full bg-good/15 px-3 py-1 text-[12px] font-semibold text-good">{pct(matched / deal.payouts.length, 1)} matched</span>} />
        <PayoutStrip deal={deal} />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <Panel>
          <PanelHead icon={BarChart3} title="Where the cash doesn't line up, by month" sub="Two kinds of gap" />
          <div className="mb-4 flex flex-wrap gap-4 text-[12px] text-white/60">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-crit" />Payout never reached the bank</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[3px] bg-warn" />Deposit with no payout behind it</span>
          </div>
          <GapBars deal={deal} />
        </Panel>
        <Panel>
          <PanelHead icon={Landmark} title="Money that didn't come from customers" sub="The seller's P&L counts all three as revenue" />
          <div className="space-y-2.5">
            {deal.unmatchedDeposits.map((b) => (
              <div key={b.id} className="panel-inner grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3.5">
                <span className="num font-mono text-[12px] text-white/45">{iso(b.t)}</span>
                <div className="min-w-0">
                  <div className="truncate font-mono text-[12.5px] text-white/85">{b.desc}</div>
                  <div className="text-[12px] text-warn">{kind[b.kind!]}</div>
                </div>
                <span className="num text-[15px] font-semibold">{usd(b.amt)}</span>
              </div>
            ))}
            <div className="panel-inner grid grid-cols-[auto_1fr_auto] items-center gap-4 border-crit/30 px-4 py-3.5">
              <span className="num font-mono text-[12px] text-white/45">{iso(m.t)}</span>
              <div className="min-w-0">
                <div className="truncate font-mono text-[12.5px] text-white/85">STRIPE {m.id}</div>
                <div className="text-[12px] text-crit">Paid out, but no bank deposit</div>
              </div>
              <span className="num text-[15px] font-semibold">{usd(m.amt, 2)}</span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead icon={Table2} title="Monthly tie-out" sub="Shopify orders → refunds → processor fees → payouts → bank" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-wider text-white/40">
                {["Month", "Orders", "Gross sales", "Refunds", "Refund %", "Fees", "Payouts", "In bank", "Gap"].map((h, i) => (
                  <th key={h} className={`px-3 py-2.5 font-medium ${i ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="num">
              {[...deal.months, { label: "TTM", orders: tot("orders"), gross: tot("gross"), refunds: tot("refunds"), fees: tot("fees"), payouts: tot("payouts"), bankMatched: tot("bankMatched") }].map((x, i) => {
                const gap = x.payouts - x.bankMatched;
                const total = i === 12;
                return (
                  <tr key={x.label} className={`border-t border-white/5 ${total ? "font-semibold" : ""}`}>
                    <td className="px-3 py-2.5">{x.label}</td>
                    <td className="px-3 py-2.5 text-right text-white/70">{x.orders.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">{usd(x.gross)}</td>
                    <td className="px-3 py-2.5 text-right text-white/70">{usd(-x.refunds)}</td>
                    <td className={`px-3 py-2.5 text-right ${x.refunds / x.gross > 0.12 ? "text-warn" : "text-white/70"}`}>{pct(x.refunds / x.gross)}</td>
                    <td className="px-3 py-2.5 text-right text-white/70">{usd(-x.fees)}</td>
                    <td className="px-3 py-2.5 text-right">{usd(x.payouts)}</td>
                    <td className="px-3 py-2.5 text-right">{usd(x.bankMatched)}</td>
                    <td className={`px-3 py-2.5 text-right ${gap > 1 ? "text-crit" : "text-good/80"}`}>{gap > 1 ? usd(-gap) : "✓"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

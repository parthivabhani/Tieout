"use client";
import { TrendingDown, ReceiptText, Scale } from "lucide-react";
import clsx from "clsx";
import type { Deal } from "@/lib/engine";
import { pnlRows } from "@/lib/engine";
import { usd } from "@/lib/format";
import { Panel, PanelHead, Explain } from "../ui";
import { MarginChart } from "../charts";

export function Pnl({ deal }: { deal: Deal }) {
  const rows = pnlRows(deal);
  const tone = { good: "text-good", bad: "text-crit", info: "text-cyan" };
  return (
    <div className="space-y-5">
      <Explain>
        <b className="text-white">Is the profit real?</b> Tieout rebuilds the profit and loss statement from what actually happened: orders minus refunds for revenue, supplier invoices for product cost, and ad-platform bills for marketing. Then it compares that with the seller&apos;s version, line by line. It also checks every <i>add-back</i>, the costs a seller says a new owner won&apos;t have.
      </Explain>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Panel>
          <PanelHead icon={TrendingDown} title="Gross margin: seller's P&L vs supplier invoices" sub="The seller kept product cost flat. The invoices show it rising in May." />
          <div className="mb-3 flex gap-5 text-[12px] text-white/60">
            <span className="flex items-center gap-2"><span className="h-[3px] w-4 rounded-full bg-cyan" />Rebuilt from invoices</span>
            <span className="flex items-center gap-2"><span className="h-[3px] w-4 rounded-full bg-serious" />Seller&apos;s P&amp;L</span>
          </div>
          <MarginChart deal={deal} />
        </Panel>
        <Panel>
          <PanelHead icon={ReceiptText} title="Add-backs" sub="What the seller added back, and what the evidence supports" />
          <div className="space-y-2.5">
            {deal.addbacks.map((a) => (
              <div key={a.label} className="panel-inner flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="text-[14px] font-medium">{a.label}</div>
                  <div className="mt-0.5 text-[12px] text-white/45">Evidence: {a.evidence}</div>
                  <div className={clsx("mt-2 text-[12.5px] font-medium", tone[a.tone])}>{a.verdict}</div>
                </div>
                <div className="num font-display text-[22px] leading-none">{usd(a.amt)}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead icon={Scale} title="Seller's P&L vs rebuilt P&L (TTM)" sub="Rebuilt from source systems, not from the seller's spreadsheet" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13.5px]">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-wider text-white/40">
                <th className="px-3 py-2.5 font-medium">Line</th>
                <th className="px-3 py-2.5 text-right font-medium">Seller</th>
                <th className="px-3 py-2.5 text-right font-medium">Rebuilt</th>
                <th className="px-3 py-2.5 text-right font-medium">Difference</th>
                <th className="px-3 py-2.5 font-medium">Rebuilt from</th>
              </tr>
            </thead>
            <tbody className="num">
              {rows.map((r) => {
                const d = r.rebuilt - r.seller;
                return (
                  <tr key={r.line} className={clsx("border-t border-white/5", r.total && "bg-white/[0.025] font-semibold")}>
                    <td className="px-3 py-3">{r.line}</td>
                    <td className="px-3 py-3 text-right text-white/60">{usd(r.seller)}</td>
                    <td className="px-3 py-3 text-right">{usd(r.rebuilt)}</td>
                    <td className={clsx("px-3 py-3 text-right", Math.abs(d) < 1 ? "text-white/25" : "text-crit")}>{Math.abs(d) < 1 ? "—" : usd(d)}</td>
                    <td className="px-3 py-3 text-[12.5px] font-normal text-white/45">{r.source}</td>
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

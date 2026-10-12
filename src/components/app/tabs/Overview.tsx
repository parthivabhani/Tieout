"use client";
import { GitCompareArrows, ShieldAlert, Database, ArrowRight } from "lucide-react";
import type { Deal, Exception } from "@/lib/engine";
import { verify } from "@/lib/engine";
import { usd, pct, round1k } from "@/lib/format";
import { Panel, PanelHead, Explain, Stat, SevTag, StatusTag } from "../ui";
import { Bridge } from "../charts";

export function Overview({ deal, ex, go }: { deal: Deal; ex: Exception[]; go: (t: string) => void }) {
  const v = verify(deal, ex);
  const open = ex.filter((e) => e.status === "Unresolved" || e.status === "Specialist");
  const S = deal.stats;
  const sources = [
    ["Shopify", `${S.orders.toLocaleString()} orders`, "ok"],
    ["Stripe", `${S.stripeCount} payouts`, "bad"],
    ["PayPal", `${S.paypalCount} payouts`, "ok"],
    ["Bank CSV", `${deal.bank.length} deposits`, "bad"],
    ["Meta Ads", "12 months billing", "warn"],
    ["Google Ads", "12 months billing", "ok"],
    ["Xero", "Seller P&L", "warn"],
    ["Supplier invoices", "46 PDFs", "warn"],
  ] as const;
  const dot = { ok: "bg-good", bad: "bg-crit", warn: "bg-warn" };

  return (
    <div className="space-y-5">
      <Explain>
        <b className="text-white">The short answer.</b> The seller says the business earns {usd(deal.deal.sdeClaimed)} a year. Their own data supports <b className="text-cyan">{usd(v.sde)}</b>. At the same multiple they&apos;re asking for, that values the business at about <b className="text-white">{usd(round1k(v.price))}</b>, not {usd(deal.deal.ask)}. Every step below links to the evidence behind it.
      </Explain>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat k="Seller-stated earnings (SDE)" v={usd(deal.deal.sdeClaimed)} sub={`TTM, after ${deal.addbacks.length} add-backs`} strike />
        <Stat k="Verified earnings" v={usd(v.sde)} accent sub={<><span className="text-crit">{usd(v.sde - deal.deal.sdeClaimed)}</span> · {pct(v.sde / deal.deal.sdeClaimed - 1)}</>} />
        <Stat k="Asking price" v={usd(deal.deal.ask)} sub={`${v.mult.toFixed(2)}× the seller's earnings`} />
        <Stat k="Indicated price, same multiple" v={usd(round1k(v.price))} sub={<><span className="text-crit">{usd(round1k(v.price - deal.deal.ask))}</span> vs ask</>} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Panel>
          <PanelHead icon={GitCompareArrows} title="From the seller's number to the verified number" sub="Each red step is one finding. Hover for the reason. Switch findings on or off in the Exception log." />
          <Bridge start={deal.deal.sdeClaimed} adj={v.adj} />
        </Panel>
        <Panel>
          <PanelHead icon={ShieldAlert} title="Blocking a firm offer" sub="Not resolved yet, or waiting on a specialist" right={<button onClick={() => go("exceptions")} className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-white/70 hover:bg-white/5">All findings</button>} />
          <div className="space-y-2.5">
            {open.map((e) => (
              <div key={e.id} className="panel-inner p-4">
                <div className="flex items-center justify-between gap-3">
                  <SevTag sev={e.sev} id={e.id} />
                  <StatusTag s={e.status} />
                </div>
                <div className="mt-2.5 text-[14px] font-medium">{e.short}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-white/55">{e.implication}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead icon={Database} title="What Tieout read" sub="Source systems connected for this deal. The dot shows whether that source raised a finding." right={<button onClick={() => go("cash")} className="hidden items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[12px] text-white/75 hover:bg-white/10 sm:flex">See the tie-out <ArrowRight className="h-3 w-3" /></button>} />
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {sources.map(([n, c, s]) => (
            <div key={n} className="panel-inner flex items-center gap-3 px-4 py-3">
              <span className={`h-2 w-2 rounded-full ${dot[s]}`} />
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium">{n}</div>
                <div className="num text-[12px] text-white/45">{c}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

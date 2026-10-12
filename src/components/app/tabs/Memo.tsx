"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Deal, Exception } from "@/lib/engine";
import { verify } from "@/lib/engine";
import { usd, pct, round1k } from "@/lib/format";
import { Explain, SevTag, StatusTag } from "../ui";

export function memoText(deal: Deal, ex: Exception[]) {
  const v = verify(deal, ex);
  const S = deal.stats;
  const L: string[] = [];
  L.push(`DILIGENCE SUMMARY: ${deal.deal.name} (${deal.deal.category}, ${deal.deal.region})`);
  L.push(`Period: TTM ${deal.deal.ttm}`);
  L.push("");
  L.push(`Seller-stated SDE: ${usd(deal.deal.sdeClaimed)}`);
  L.push(`Verified SDE: ${usd(v.sde)} (${pct(v.sde / deal.deal.sdeClaimed - 1)})`);
  L.push(`Ask: ${usd(deal.deal.ask)} (${v.mult.toFixed(2)}x stated). Indicated at the same multiple: ${usd(round1k(v.price))}`);
  L.push("");
  L.push("Adjustments applied:");
  v.adj.forEach((e) => L.push(`- ${e.id} ${usd(e.impact)}: ${e.short}. ${e.implication}`));
  L.push("");
  L.push("Open before a firm offer:");
  ex.filter((e) => e.status === "Unresolved" || e.status === "Specialist").forEach((e) => L.push(`- ${e.id} [${e.status}]: ${e.short}. ${e.implication}`));
  L.push("");
  L.push(`Cash: ${deal.payouts.length - deal.unmatchedPayouts.length}/${deal.payouts.length} payouts matched to the bank. ${deal.unmatchedDeposits.length} non-processor deposits (${usd(S.ownerIn + S.wholesale)}).`);
  L.push(`Concentration: top supplier ${pct(S.supplierShare, 0)} of COGS (verbal terms); Meta ${pct(S.metaShare, 0)} of ad spend; top SKU ${pct(S.topSkuShare, 0)} of revenue.`);
  return L.join("\n");
}

export function Memo({ deal, ex }: { deal: Deal; ex: Exception[] }) {
  const v = verify(deal, ex);
  const [copied, setCopied] = useState(false);
  const open = ex.filter((e) => e.status === "Unresolved" || e.status === "Specialist");
  return (
    <div className="space-y-5">
      <Explain>
        <b className="text-white">The write-up, drafted for you.</b> Everything above becomes a one-page summary for the investment committee. It updates as you change statuses and switches in the Exception log. Copy it into the memo template, or send it to the Head of Investments.
      </Explain>
      <article className="mx-auto max-w-3xl overflow-hidden rounded-[28px] bg-white text-body shadow-2xl">
        <div className="flex items-center justify-between gap-4 bg-navy-900 px-8 py-5 text-white">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">Investment committee · Diligence summary</div>
            <div className="mt-1 text-xl font-semibold">{deal.deal.name}</div>
          </div>
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(memoText(deal, ex)); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {} }}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12.5px] font-medium hover:bg-white/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy text"}
          </button>
        </div>
        <div className="space-y-7 px-8 py-8 text-[14.5px] leading-relaxed">
          <p className="text-muted">{deal.deal.category} · {deal.deal.region} · TTM {deal.deal.ttm}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Seller SDE", usd(deal.deal.sdeClaimed)],
              ["Verified SDE", usd(v.sde)],
              ["Ask", usd(deal.deal.ask)],
              ["Indicated", usd(round1k(v.price))],
            ].map(([k, val], i) => (
              <div key={k} className={`rounded-2xl p-4 ${i === 1 ? "bg-cyan-tint" : "bg-paper"}`}>
                <div className="text-[11.5px] text-soft">{k}</div>
                <div className="num mt-1 font-display text-[22px] leading-none text-ink">{val}</div>
              </div>
            ))}
          </div>
          <section>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand">Recommendation</h4>
            <p className="mt-2 text-ink">
              Proceed, but re-price. Earnings hold at {usd(v.sde)}, {pct(1 - v.sde / deal.deal.sdeClaimed, 0)} below the seller&apos;s figure. That is mostly product margin and add-backs, not fake revenue. Offer at verified SDE, subject to resolving the {open.length} open items before the LOI becomes binding.
            </p>
          </section>
          <section>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand">Adjustments applied</h4>
            <ul className="mt-3 divide-y divide-rule">
              {v.adj.map((e) => (
                <li key={e.id} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span><b className="font-mono text-[12px] text-soft">{e.id}</b> <span className="text-ink">{e.short}.</span> <span className="text-muted">{e.implication}</span></span>
                  <span className="num shrink-0 font-semibold text-crit">{usd(e.impact)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand">Open before a firm offer</h4>
            <ul className="mt-3 space-y-2.5">
              {open.map((e) => (
                <li key={e.id} className="flex items-start gap-3 rounded-2xl bg-navy-900 p-3.5 text-white">
                  <SevTag sev={e.sev} id={e.id} />
                  <span className="flex-1 text-[13.5px]">{e.short}. <span className="text-white/60">{e.implication}</span></span>
                  <StatusTag s={e.status} />
                </li>
              ))}
            </ul>
          </section>
          <p className="border-t border-rule pt-5 text-[12px] text-soft">Generated by Tieout from {deal.stats.orders.toLocaleString()} orders, {deal.payouts.length} payouts, {deal.bank.length} bank lines, ad billing, the seller&apos;s Xero file and supplier invoices. Sample data.</p>
        </div>
      </article>
    </div>
  );
}

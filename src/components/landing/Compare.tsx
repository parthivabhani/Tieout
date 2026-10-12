import { Check, Minus, X } from "lucide-react";
import clsx from "clsx";
import { Reveal } from "@/components/ui/Reveal";

type V = 1 | 0.5 | 0 | string;
const cols = [
  { name: "Tieout", sub: "Ecommerce-native", us: true },
  { name: "AI QoE software", sub: "QoEAgent, Finsider, Shepi" },
  { name: "QoE firms", sub: "Boutique CPAs, eightx, ClearView" },
  { name: "Marketplace vetting", sub: "Flippa, Empire Flippers" },
  { name: "Ecom accounting", sub: "A2X, Link My Books, Synder" },
  { name: "Analyst + spreadsheet", sub: "Today's default" },
];
const rows: [string, V[]][] = [
  ["Reads Shopify, Stripe & PayPal directly", [1, 0, 0.5, 1, 1, 0.5]],
  ["Matches payouts to bank deposits (proof of cash)", [1, 1, 1, 0.5, 0.5, 0.5]],
  ["Checks ad billing and platform attribution", [1, 0, 0.5, 0, 0, 0.5]],
  ["Tests every add-back against its evidence", [1, 1, 1, 0.5, 0, 0.5]],
  ["Account-transfer & dependency register", [1, 0, 0, 0.5, 0, 0.5]],
  ["Works on private, off-market deals", [1, 1, 1, 0, 1, 1]],
  ["Same evidence reused for the resale", [1, 0, 0, 0, 0, 0]],
  ["Time to first result", ["Minutes", "24–72 h", "2–6 weeks", "3–4 weeks", "n/a", "Days–weeks"]],
  ["Cost per deal", ["Platform fee", "$1k–$10k", "$4k–$25k", "In broker fee", "Monthly sub", "Analyst time"]],
];

function Cell({ v, us }: { v: V; us?: boolean }) {
  if (typeof v === "string") return <span className={clsx("text-[13px]", us ? "font-semibold text-white" : "text-muted")}>{v}</span>;
  if (v === 1) return <span className={clsx("mx-auto grid h-7 w-7 place-items-center rounded-full", us ? "bg-cyan text-navy-950" : "bg-mint-soft text-mint")}><Check className="h-4 w-4" strokeWidth={3} /></span>;
  if (v === 0.5) return <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-[#fdf3dc] text-[#b7791f]" title="Partly, or manually"><Minus className="h-4 w-4" strokeWidth={3} /></span>;
  return <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-paper text-soft/60"><X className="h-4 w-4" strokeWidth={2.5} /></span>;
}

export function Compare() {
  return (
    <section id="compare" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand">
            <span className="h-[3px] w-8 rounded-full bg-cyan" /> Is anyone already solving this?
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Lots of tools check a general ledger. <span className="font-display font-medium italic text-brand">None of them speak ecommerce.</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            We compared more than 15 products and services. The new AI quality-of-earnings tools reconcile a general ledger against the bank. None of them read Shopify, processor payouts or ad platforms. Ecommerce accounting apps reconcile payouts going forward, but they don&apos;t test a seller&apos;s claims.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 overflow-x-auto rounded-[28px] border border-rule">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[26%] bg-white p-5 text-[12px] font-medium uppercase tracking-wider text-soft">Capability</th>
                {cols.map((c) => (
                  <th key={c.name} className={clsx("p-5 text-center align-bottom", c.us ? "bg-navy-900 text-white" : "bg-white")}>
                    <div className={clsx("text-[14px] font-semibold", c.us ? "text-white" : "text-ink")}>{c.name}</div>
                    <div className={clsx("mt-0.5 text-[11.5px] font-normal", c.us ? "text-cyan" : "text-soft")}>{c.sub}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, vals], r) => (
                <tr key={label} className="border-t border-rule">
                  <td className="bg-white p-5 text-[14px] font-medium text-body">{label}</td>
                  {vals.map((v, k) => (
                    <td key={k} className={clsx("p-4 text-center", k === 0 ? "bg-navy-900" : r % 2 ? "bg-paper/60" : "bg-white")}>
                      <Cell v={v} us={k === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-4 text-[12px] text-soft">
          <span className="inline-flex items-center gap-1"><Minus className="h-3 w-3" /> = partly, or done by hand.</span> Prices and turnaround are as published by vendors and 2026 comparison guides (QoEAgent, Finsider, Shepi, ClearView QoE, eightx, Flippa, Empire Flippers). Not independently verified.
        </p>
      </div>
    </section>
  );
}

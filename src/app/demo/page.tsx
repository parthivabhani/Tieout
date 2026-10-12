import Link from "next/link";
import { ArrowUpRight, Plus, Info, Lock } from "lucide-react";
import clsx from "clsx";

type D = {
  name: string;
  cat: string;
  ask: string;
  said?: number;
  verified?: number;
  note: string;
  tone: "good" | "warn" | "crit" | "info";
  href?: string;
  progress?: number;
};

const columns: { stage: string; hint: string; deals: D[] }[] = [
  {
    stage: "Intake",
    hint: "Seller connecting accounts",
    deals: [{ name: "Brightbloom Baby", cat: "Baby · Shopify · UK", ask: "$310k", note: "4 of 7 sources connected", tone: "info", progress: 4 / 7 }],
  },
  {
    stage: "Fit screen",
    hint: "First tie-out done",
    deals: [{ name: "Lumen Pet Co.", cat: "Pet · Shopify · US", ask: "$420k", said: 131, verified: 124, note: "Clean. Ready for a soft LOI.", tone: "good" }],
  },
  {
    stage: "Soft LOI",
    hint: "Offer on verified earnings",
    deals: [{ name: "Saltwick Home", cat: "Home · Shopify · DE", ask: "$760k", said: 236, verified: 198, note: "Offer sent at verified SDE", tone: "info" }],
  },
  {
    stage: "Diligence",
    hint: "Exception log open",
    deals: [{ name: "Falcon & Trust", cat: "Fashion · Shopify · SE/DE", ask: "$1.02M", said: 307, verified: 213, note: "2 items unresolved", tone: "crit", href: "/demo/deals/falcon-trust?tour=1" }],
  },
  {
    stage: "Closed → Operate",
    hint: "Verified pack reused for resale",
    deals: [{ name: "Kiln & Co.", cat: "Ceramics · Shopify · NL", ask: "$540k", said: 178, verified: 171, note: "Pack shared with buyer", tone: "good" }],
  },
];

const toneDot = { good: "bg-good", warn: "bg-warn", crit: "bg-crit", info: "bg-cyan" };

function Card({ d }: { d: D }) {
  const live = !!d.href;
  const delta = d.said && d.verified ? d.verified / d.said - 1 : null;
  const body = (
    <div className={clsx("panel group relative overflow-hidden p-5 transition", live ? "ring-1 ring-cyan/40 hover:-translate-y-0.5 hover:ring-cyan" : "opacity-80")}>
      {live && <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan/15 blur-2xl" />}
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold">{d.name}</div>
          <div className="mt-0.5 text-[12px] text-white/50">{d.cat}</div>
        </div>
        {live ? (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan text-navy-950 transition group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[10.5px] text-white/45"><Lock className="h-3 w-3" />Preview</span>
        )}
      </div>
      {d.said && d.verified ? (
        <div className="relative mt-5 grid grid-cols-2 gap-2">
          <div className="panel-inner p-3">
            <div className="text-[10.5px] uppercase tracking-wider text-white/40">Seller SDE</div>
            <div className="num mt-1 font-display text-[22px] leading-none text-white/60 line-through decoration-white/25">${d.said}k</div>
          </div>
          <div className="panel-inner p-3">
            <div className="text-[10.5px] uppercase tracking-wider text-white/40">Verified</div>
            <div className="num mt-1 font-display text-[22px] leading-none">${d.verified}k</div>
          </div>
        </div>
      ) : (
        <div className="relative mt-5">
          <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan" style={{ width: `${(d.progress ?? 0) * 100}%` }} /></div>
        </div>
      )}
      <div className="relative mt-4 flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1.5 text-white/70"><span className={`h-1.5 w-1.5 rounded-full ${toneDot[d.tone]}`} />{d.note}</span>
        <span className="text-white/40">Ask {d.ask}</span>
      </div>
      {delta !== null && (
        <div className="relative mt-3 text-[11.5px] text-white/40">
          {delta < -0.1 ? <span className="text-crit">{(delta * 100).toFixed(0)}% vs seller</span> : <span className="text-good">{(delta * 100).toFixed(0)}% vs seller</span>}
        </div>
      )}
    </div>
  );
  return live ? <Link href={d.href!}>{body}</Link> : body;
}

export default function Pipeline() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cyan">Deal pipeline</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Every deal, <span className="font-display italic font-medium text-cyan">seller&apos;s numbers vs evidence.</span>
          </h1>
        </div>
        <Link href="/demo/new" className="flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-[13.5px] font-semibold text-navy-950 transition hover:bg-white">
          <Plus className="h-4 w-4" /> Start a new deal
        </Link>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan/20 bg-cyan/[0.06] p-4 text-[13.5px] leading-relaxed text-white/75">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
        <p>
          <b className="text-white">How to read this:</b> each card is an acquisition target. The struck-through number is what the seller says the business earns. The number beside it is what their own Shopify, payment, bank and ad data supports.{" "}
          <b className="text-white">Falcon &amp; Trust</b> is fully loaded: open it to see how Tieout got there. The other cards are previews.
        </p>
      </div>

      <div className="mt-8 grid gap-5 overflow-x-auto pb-4 md:grid-cols-5">
        {columns.map((c) => (
          <section key={c.stage} className="min-w-[240px]">
            <div className="mb-3 flex items-baseline justify-between px-1">
              <h2 className="text-[13px] font-semibold">{c.stage}</h2>
              <span className="text-[11.5px] text-white/40">{c.hint}</span>
            </div>
            <div className="space-y-4">{c.deals.map((d) => <Card key={d.name} d={d} />)}</div>
          </section>
        ))}
      </div>
    </main>
  );
}

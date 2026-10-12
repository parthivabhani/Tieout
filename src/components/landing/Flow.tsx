import { Reveal } from "@/components/ui/Reveal";
import { Inbox, Filter, FileSignature, SearchCheck, KeyRound, LineChart } from "lucide-react";

const stages = [
  { icon: Inbox, stage: "Seller intake", now: "P&L, website, asking price", tieout: "Seller connects accounts. First tie-out runs straight away." },
  { icon: Filter, stage: "Fit screen", now: "Check numbers against criteria", tieout: "Verified SDE, refund rate and concentration before anyone books a call." },
  { icon: FileSignature, stage: "Soft LOI", now: "12–48 hours under Equire", tieout: "Offer priced on verified earnings, with open items listed." },
  { icon: SearchCheck, stage: "Diligence", now: "10–20 working days", tieout: "The exception log replaces the spreadsheet. Statuses, evidence and the memo all live in one place." },
  { icon: KeyRound, stage: "Close & handover", now: "Store, accounts, suppliers, SOPs", tieout: "A day-one dependency register shows what's ready, at risk or blocked." },
  { icon: LineChart, stage: "Sell & operate", now: "Reviewed financials for buyers", tieout: "The same verified pack goes to the next buyer. The same pipeline runs owner reporting." },
];

export function Flow() {
  return (
    <section className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand">
              <span className="h-[3px] w-8 rounded-full bg-cyan" /> Where it fits
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
              Built around Ecomma&apos;s deal flow, <span className="font-display font-medium italic text-brand">not a generic one.</span>
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-muted lg:pb-2">
            Ecomma sits on both sides of every deal: it buys from founders and sells to buyers. That means the same evidence gets used twice. It prices the acquisition, then it becomes the &ldquo;reviewed financials&rdquo; the next buyer relies on.
          </p>
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute left-[27px] top-0 h-full w-[2px] bg-gradient-to-b from-cyan via-brand-deep to-navy-900 lg:left-0 lg:top-[27px] lg:h-[2px] lg:w-full lg:bg-gradient-to-r" />
          <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
            {stages.map((s, i) => (
              <Reveal key={s.stage} delay={i * 0.06}>
                <li className="flex gap-5 lg:block">
                  <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-4 border-paper bg-navy-900 text-cyan shadow-lg"><s.icon className="h-5 w-5" /></span>
                  <div className="lg:mt-6">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-soft">Step {i + 1}</div>
                    <div className="mt-1 text-[17px] font-semibold text-ink">{s.stage}</div>
                    <div className="mt-1 text-[13px] text-soft">{s.now}</div>
                    <div className="mt-4 rounded-2xl border border-cyan-soft bg-white p-4 text-[13.5px] leading-snug text-body shadow-sm">
                      <span className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-deep">With Tieout</span>
                      {s.tieout}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/ui/Reveal";
import { FileSpreadsheet, Timer, Zap } from "lucide-react";

const cards = [
  {
    icon: FileSpreadsheet,
    k: "01",
    title: "A seller's P&L is a claim, not evidence",
    body: "An intake starts with a P&L, a website and an asking price. Before an offer means anything, every line has to be traced back to orders, payouts, bank deposits, invoices and ad billing.",
    foot: "Ecomma's own diligence checklist lists 9 areas and 40+ checks.",
  },
  {
    icon: Timer,
    k: "02",
    title: "Tracing it is slow, manual work",
    body: "Rebuilding a P&L means reconciling up to 24 months of data across five or more systems, usually in spreadsheets. QoE firms quote 4–6 weeks and $10–25k for a deal under $5M.",
    foot: "Ecomma's intern roles list “rebuild P&L, normalise EBITDA” as core work.",
  },
  {
    icon: Zap,
    k: "03",
    title: "But speed is what Ecomma promises",
    body: "Equire promises partners a soft LOI in 12–48 hours and diligence in 10–20 working days. At 30+ deals a year, plus every seller screened and turned down, verification is the bottleneck.",
    foot: "Partner tiers: soft LOI <48h (Blue) down to <12h (Platinum).",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand">
            <span className="h-[3px] w-8 rounded-full bg-cyan" /> The problem
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl">
            Ecomma&apos;s value is <span className="font-display italic font-medium text-brand">evidence over narrative.</span> Getting the evidence is still manual.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            We read Ecomma&apos;s Desk articles, diligence checklist, seller guide and job posts. The same problem shows up everywhere: by the time the numbers are trusted, the deal has slowed down.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-[28px] border border-rule bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,.25)]">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-tint transition group-hover:scale-125" />
                <div className="relative flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-cyan"><c.icon className="h-5 w-5" /></span>
                  <span className="font-display text-3xl text-navy-900/15">{c.k}</span>
                </div>
                <h3 className="relative mt-7 text-xl font-semibold tracking-tight text-ink">{c.title}</h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-muted">{c.body}</p>
                <p className="relative mt-6 border-t border-rule pt-4 text-[12.5px] text-soft">{c.foot}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

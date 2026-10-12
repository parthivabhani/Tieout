"use client";
import { motion } from "motion/react";
import { Landmark, CreditCard, Megaphone, Factory, PieChart, UserRound } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const cards = [
  { icon: Landmark, tag: "Revenue", title: "Owner top-ups booked as sales", amt: "−$18.5k", note: "Bank deposits with no processor payout behind them", tint: "from-cyan-soft to-white" },
  { icon: CreditCard, tag: "Cash", title: "A payout that never reached the bank", amt: "$5.4k", note: "Stripe paid it out. The business account never received it.", tint: "from-[#fde3e2] to-white" },
  { icon: Megaphone, tag: "Marketing", title: "Ads paid on a card outside the books", amt: "−$7.7k", note: "Meta billing higher than the ledger", tint: "from-[#feecd9] to-white" },
  { icon: Factory, tag: "Margin", title: "Supplier price rise kept off the P&L", amt: "−$26.6k", note: "Invoices +8% from May. Margin 62% → 57%.", tint: "from-mint-soft to-white" },
  { icon: PieChart, tag: "Attribution", title: "Ad platforms claiming 115% of sales", amt: "115%", note: "Meta + Google both counting the same orders", tint: "from-cyan-soft to-white" },
  { icon: UserRound, tag: "Add-backs", title: "Founder's salary added back in full", amt: "−$24k", note: "A hands-off buyer still has to pay someone for that work", tint: "from-[#e7e4fb] to-white" },
];

const tilt = [-6, 3, -2, 5, -4, 2];
const drop = [8, 34, 52, 52, 34, 8];

export function Catches() {
  return (
    <section id="catches" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-muted shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-crit" /> Planted in the sample deal, found automatically
          </div>
          <h2 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[56px]">
            WHAT A SPREADSHEET <span className="font-display font-medium italic text-brand">misses,</span> TIEOUT PINS UP.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] text-muted">
            Every one of these comes straight from problems Ecomma&apos;s team writes about. Each finding links back to the source rows that prove it.
          </p>
        </Reveal>
      </div>

      {/* Clothesline */}
      <div className="relative mx-auto mt-16 max-w-[1500px]">
        <svg className="pointer-events-none absolute inset-x-0 top-6 hidden h-24 w-full lg:block" viewBox="0 0 1500 100" preserveAspectRatio="none" aria-hidden>
          <path d="M0 10 Q 750 120 1500 10" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
        <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-6 lg:gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: -30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt[i] }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 90, damping: 12, delay: i * 0.07 }}
              whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
              className="relative mx-auto w-full max-w-[300px] lg:mt-[var(--drop)]"
              style={{ ["--drop" as string]: `${drop[i]}px`, transformOrigin: "50% 0%" }}
            >
              <div className="absolute -top-3 left-1/2 z-10 h-7 w-5 -translate-x-1/2 rounded-[5px] bg-cyan shadow-md">
                <div className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <div className="rounded-[22px] border border-rule bg-white p-3 shadow-[0_24px_40px_-20px_rgba(15,23,42,.35)]">
                <div className={`relative flex h-36 flex-col justify-between overflow-hidden rounded-[16px] bg-gradient-to-br ${c.tint} p-4`}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-cyan"><c.icon className="h-[18px] w-[18px]" /></span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted">{c.tag}</span>
                  </div>
                  <div className="num font-display text-[34px] leading-none text-ink">{c.amt}</div>
                </div>
                <div className="px-1.5 pb-2 pt-3.5">
                  <div className="text-[14.5px] font-semibold leading-snug text-ink">{c.title}</div>
                  <div className="mt-1 text-[12.5px] leading-snug text-soft">{c.note}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

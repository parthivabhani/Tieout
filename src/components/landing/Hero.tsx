"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, X, TriangleAlert, Landmark, CreditCard, ShoppingBag, Megaphone } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

function Ribbon() {
  // Flowing navy shape on the right, in the spirit of the organic hero inspirations.
  return (
    <svg className="pointer-events-none absolute right-0 top-0 h-full w-[54%] min-w-[600px]" viewBox="0 0 800 900" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="rb-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a4a9a" />
          <stop offset=".55" stopColor="#0f172a" />
          <stop offset="1" stopColor="#060b18" />
        </linearGradient>
        <linearGradient id="rb-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#57cafb" stopOpacity=".0" />
          <stop offset=".4" stopColor="#57cafb" stopOpacity=".55" />
          <stop offset="1" stopColor="#d6f0fb" stopOpacity=".9" />
        </linearGradient>
        <filter id="rb-grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 .18" /></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <path d="M250 0 C 170 140, 360 250, 270 400 C 200 520, 120 600, 180 760 C 210 840, 290 880, 320 900 L 800 900 L 800 0 Z" fill="url(#rb-a)" />
      <path d="M250 0 C 170 140, 360 250, 270 400 C 200 520, 120 600, 180 760 C 210 840, 290 880, 320 900 L 800 900 L 800 0 Z" filter="url(#rb-grain)" />
      <path d="M222 0 C 142 150, 330 250, 240 400 C 172 520, 90 610, 152 770 C 182 850, 260 885, 290 900" fill="none" stroke="url(#rb-b)" strokeWidth="26" strokeLinecap="round" opacity=".9" />
      <g opacity=".07" stroke="#fff">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1="340" x2="800" y1={60 + i * 60} y2={60 + i * 60} />
        ))}
      </g>
    </svg>
  );
}

function SourceChip({ icon, label, state, delay, className }: { icon: React.ReactNode; label: string; state: "ok" | "bad" | "warn"; delay: number; className: string }) {
  const s = {
    ok: { c: "text-good", i: <Check className="h-3.5 w-3.5" /> },
    bad: { c: "text-crit", i: <X className="h-3.5 w-3.5" /> },
    warn: { c: "text-warn", i: <TriangleAlert className="h-3.5 w-3.5" /> },
  }[state];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease }}
      className={`absolute flex items-center gap-2.5 rounded-2xl border border-white/10 bg-navy-900/95 px-3 py-2 text-[12.5px] text-white/90 shadow-2xl shadow-navy-950/40 backdrop-blur-md ${className}`}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-cyan">{icon}</span>
      <span>{label}</span>
      <span className={s.c}>{s.i}</span>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-16">
      <div className="absolute inset-0 -z-10 hidden lg:block"><Ribbon /></div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand">
            <span className="h-[3px] w-8 rounded-full bg-cyan" />
            Diligence, tied out
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[76px]"
          >
            The seller tells a story.
            <br />
            <span className="font-display font-medium italic tracking-[-0.02em] text-brand">The ledger</span> tells the truth.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease }} className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted">
            Tieout reads a seller&apos;s Shopify, Stripe, PayPal, bank and ad accounts. It matches every payout to a bank deposit and rebuilds the P&amp;L from source data. Your deal team gets <b className="font-semibold text-ink">verified earnings and an exception log in minutes</b>, not after weeks of spreadsheets.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease }} className="mt-9 flex flex-wrap gap-3">
            <Link href="/demo" className="group inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-navy-900/20 transition hover:bg-brand">
              Open the live demo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a href="#how" className="inline-flex items-center rounded-xl border-2 border-navy-900/90 px-6 py-3 text-[15px] font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white">
              See how it works
            </a>
          </motion.div>

          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.45 }} className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-rule pt-7">
            {[
              ["236", "payouts matched", "to the bank, in the sample deal"],
              ["10", "exceptions raised", "each with its evidence"],
              ["$94k", "didn't hold up", "of the seller's stated earnings"],
            ].map(([n, l, s]) => (
              <div key={l}>
                <dt className="font-display text-[34px] leading-none text-ink">{n}</dt>
                <dd className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{l}</dd>
                <dd className="mt-0.5 text-[12px] text-soft">{s}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual */}
        <div className="relative min-h-[520px] lg:min-h-[600px]">
          <div className="absolute inset-0 overflow-hidden rounded-[36px] bg-navy-900 lg:hidden">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-deep/60 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
          </div>

          <SourceChip icon={<ShoppingBag className="h-3.5 w-3.5" />} label="Shopify · 20,866 orders" state="ok" delay={0.5} className="left-[6%] top-[6%] lg:left-[14%]" />
          <SourceChip icon={<CreditCard className="h-3.5 w-3.5" />} label="Stripe · 1 payout missing" state="bad" delay={0.65} className="right-[4%] top-[14%]" />
          <SourceChip icon={<Megaphone className="h-3.5 w-3.5" />} label="Meta · claims 115% of sales" state="warn" delay={0.8} className="bottom-[16%] left-[4%] lg:left-[10%]" />
          <SourceChip icon={<Landmark className="h-3.5 w-3.5" />} label="Bank · 3 deposits unexplained" state="bad" delay={0.95} className="bottom-[5%] right-[6%]" />

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="absolute left-1/2 top-1/2 w-[min(400px,88%)] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="animate-float rounded-[28px] border border-white/15 bg-white p-6 shadow-[0_40px_80px_-20px_rgba(6,11,24,.55)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft">Falcon &amp; Trust · TTM</div>
                  <div className="mt-1 text-[15px] font-semibold text-ink">Seller earnings, checked</div>
                </div>
                <span className="rounded-full bg-cyan-tint px-2.5 py-1 text-[11px] font-semibold text-brand">Sample deal</span>
              </div>
              <div className="mt-6 space-y-4">
                <Row label="Seller says" value="$307,166" w={100} color="bg-navy-700/25" ink="text-muted" strike />
                <Row label="Evidence says" value="$213,010" w={69} color="bg-gradient-to-r from-brand-deep to-cyan" ink="text-ink" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-paper p-3.5">
                  <div className="text-[11px] text-soft">Asking price</div>
                  <div className="num mt-0.5 text-[17px] font-semibold text-ink">$1,020,000</div>
                </div>
                <div className="rounded-2xl bg-mint-soft p-3.5">
                  <div className="text-[11px] text-mint">Same multiple, verified</div>
                  <div className="num mt-0.5 text-[17px] font-semibold text-ink">$707,000</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-crit" /> 2 items unresolved before a firm offer
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, w, color, ink, strike }: { label: string; value: string; w: number; color: string; ink: string; strike?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="text-muted">{label}</span>
        <span className={`num font-display text-[26px] leading-none ${ink} ${strike ? "line-through decoration-crit/70 decoration-2" : ""}`}>{value}</span>
      </div>
      <div className="mt-2 h-2.5 rounded-full bg-paper">
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 1.2, delay: 0.9, ease }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

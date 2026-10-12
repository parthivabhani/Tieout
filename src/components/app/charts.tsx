"use client";
import { motion } from "motion/react";
import clsx from "clsx";
import type { Deal, Exception, Payout } from "@/lib/engine";
import { iso } from "@/lib/engine";
import { usd, usdK, pct } from "@/lib/format";
import { useTip } from "./Tooltip";

const ease = [0.22, 1, 0.36, 1] as const;

/** Floating-bar bridge from seller SDE to verified SDE. */
export function Bridge({ start, adj }: { start: number; adj: Exception[] }) {
  const tip = useTip();
  const steps = [...adj].sort((a, b) => a.impact - b.impact);
  let run = start;
  const rows = steps.map((e) => {
    const r = { e, from: run + e.impact, to: run };
    run += e.impact;
    return r;
  });
  const end = run;
  const lo = Math.min(end * 0.85, start * 0.55);
  const x = (v: number) => ((v - lo) / (start - lo)) * 100;
  const Bar = ({ l, r, color, delay, t }: { l: number; r: number; color: string; delay: number; t: React.ReactNode }) => (
    <div className="relative h-7">
      <motion.div
        {...tip(t)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(r - l, 0.8)}%` }}
        transition={{ duration: 0.8, delay, ease }}
        className={clsx("absolute top-1 bottom-1 cursor-default rounded-[6px]", color)}
        style={{ left: `${l}%` }}
      />
    </div>
  );
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,250px)_1fr_76px] items-center gap-x-4 gap-y-1.5 text-[13px]">
        <div className="font-semibold">Seller-stated SDE</div>
        <Bar l={0} r={100} color="bg-white/25" delay={0} t={<><b>Seller-stated SDE</b><br />{usd(start)}</>} />
        <div className="num text-right font-semibold">{usdK(start)}</div>
        {rows.map(({ e, from, to }, i) => (
          <div key={e.id} className="contents">
            <div className="truncate text-white/65" title={e.short}>{e.short}</div>
            <Bar l={x(from)} r={x(to)} color="bg-crit/85" delay={0.15 + i * 0.08} t={<><b>{e.id}</b> · {usd(e.impact)}<br />{e.implication}</>} />
            <div className="num text-right text-white/70">{usdK(e.impact)}</div>
          </div>
        ))}
        <div className="font-semibold text-cyan">Verified SDE</div>
        <Bar l={0} r={x(end)} color="bg-gradient-to-r from-brand-deep to-cyan" delay={0.2 + rows.length * 0.08} t={<><b>Verified SDE</b><br />{usd(end)}</>} />
        <div className="num text-right font-semibold text-cyan">{usdK(end)}</div>
      </div>
      <div className="mt-3 text-[11.5px] text-white/35">The axis starts at {usdK(lo)}, not zero, so the smaller steps stay readable.</div>
    </div>
  );
}

/** One tick per payout across the year: matched (green) or missing from the bank (red). */
export function PayoutStrip({ deal }: { deal: Deal }) {
  const tip = useTip();
  const t0 = deal.payouts[0].t, t1 = deal.payouts[deal.payouts.length - 1].t;
  const pos = (p: Payout) => ((p.t - t0) / (t1 - t0)) * 100;
  const lanes: ("Stripe" | "PayPal")[] = ["Stripe", "PayPal"];
  return (
    <div>
      {lanes.map((lane) => (
        <div key={lane} className="mb-3 grid grid-cols-[64px_1fr] items-center gap-3">
          <div className="text-[12px] text-white/55">{lane}</div>
          <div className="relative h-10 rounded-xl bg-white/[0.03]">
            {deal.payouts.filter((p) => p.src === lane).map((p) => {
              const ok = !!p.bankId;
              return (
                <span
                  key={p.id}
                  {...tip(
                    <>
                      <b className="font-mono">{p.id}</b> · {usd(p.amt, 2)}
                      <br />Paid out {iso(p.t)}
                      <br />{ok ? <>In bank {iso(p.bankT!)} ✓</> : <span className="text-crit">No bank deposit found</span>}
                    </>
                  )}
                  className={clsx("absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition hover:scale-150", ok ? "h-6 w-[3px] bg-good/70 hover:bg-good" : "h-9 w-[5px] bg-crit shadow-[0_0_12px_#f0605d]")}
                  style={{ left: `${pos(p)}%` }}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[64px_1fr] gap-3">
        <div />
        <div className="flex justify-between text-[11px] text-white/35">
          {deal.months.map((m) => <span key={m.label}>{m.short}</span>)}
        </div>
      </div>
    </div>
  );
}

/** Single-series line pair: gross margin per seller P&L vs per invoices. */
export function MarginChart({ deal }: { deal: Deal }) {
  const tip = useTip();
  const W = 640, H = 240, P = { l: 40, r: 48, t: 16, b: 28 };
  const ymin = 0.5, ymax = 0.66;
  const x = (i: number) => P.l + (i * (W - P.l - P.r)) / 11;
  const y = (v: number) => P.t + (H - P.t - P.b) * (1 - (v - ymin) / (ymax - ymin));
  const line = (k: "gmClaimed" | "gmVerified") => deal.months.map((m, i) => `${i ? "L" : "M"}${x(i)},${y(m[k])}`).join(" ");
  const last = deal.months[11];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gross margin by month">
      {[0.5, 0.54, 0.58, 0.62, 0.66].map((g) => (
        <g key={g}>
          <line x1={P.l} x2={W - P.r} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,.06)" />
          <text x={P.l - 8} y={y(g) + 4} textAnchor="end" className="fill-white/35 text-[11px]">{Math.round(g * 100)}%</text>
        </g>
      ))}
      <line x1={x(7)} x2={x(7)} y1={P.t} y2={H - P.b} stroke="rgba(255,255,255,.25)" strokeDasharray="3 4" />
      <text x={x(7) + 6} y={P.t + 12} className="fill-white/50 text-[11px]">Supplier +8%</text>
      <motion.path d={line("gmClaimed")} fill="none" stroke="#f29a4a" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }} />
      <motion.path d={line("gmVerified")} fill="none" stroke="#57cafb" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2, ease }} />
      <text x={x(11) + 8} y={y(last.gmClaimed) + 4} className="fill-white text-[12px]">{pct(last.gmClaimed, 0)}</text>
      <text x={x(11) + 8} y={y(last.gmVerified) + 4} className="fill-cyan text-[12px] font-semibold">{pct(last.gmVerified, 0)}</text>
      {deal.months.map((m, i) => (
        <g key={m.label}>
          <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-white/35 text-[11px]">{m.short}</text>
          <rect
            x={x(i) - 22} y={P.t} width={44} height={H - P.t - P.b} fill="transparent"
            {...tip(<><b>{m.label}</b><br />Seller P&amp;L {pct(m.gmClaimed)}<br />From invoices {pct(m.gmVerified)}</>)}
          />
        </g>
      ))}
    </svg>
  );
}

/** Monthly bars: cash that left Stripe/PayPal but never reached the bank. */
export function GapBars({ deal }: { deal: Deal }) {
  const tip = useTip();
  const vals = deal.months.map((m) => m.payouts - m.bankMatched);
  const other = deal.months.map((m) => m.bankOther);
  const max = Math.max(...vals, ...other) * 1.15;
  return (
    <div className="grid grid-cols-12 items-end gap-2" style={{ height: 180 }}>
      {deal.months.map((m, i) => (
        <div key={m.label} className="flex h-full flex-col items-center justify-end gap-1" {...tip(<><b>{m.label}</b><br />Payouts missing from bank: {usd(vals[i], 2)}<br />Deposits with no payout: {usd(other[i])}</>)}>
          <div className="flex w-full flex-1 items-end justify-center gap-1">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(vals[i] / max) * 100}%` }} transition={{ duration: 0.7, delay: i * 0.03, ease }} className="w-[38%] min-h-[2px] rounded-t-[5px] bg-crit" style={{ opacity: vals[i] > 1 ? 1 : 0.15 }} />
            <motion.div initial={{ height: 0 }} animate={{ height: `${(other[i] / max) * 100}%` }} transition={{ duration: 0.7, delay: i * 0.03 + 0.1, ease }} className="w-[38%] min-h-[2px] rounded-t-[5px] bg-warn" style={{ opacity: other[i] > 1 ? 1 : 0.15 }} />
          </div>
          <div className="text-[11px] text-white/35">{m.short}</div>
        </div>
      ))}
    </div>
  );
}

export function Meter({ label, value, threshold, higherIsBetter, note }: { label: string; value: number; threshold: number; higherIsBetter?: boolean; note: string }) {
  const tip = useTip();
  const bad = higherIsBetter ? value < threshold : value > threshold;
  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
        <span className="text-white/85">{label}</span>
        <span className="flex items-center gap-2">
          <span className="num font-display text-[22px] leading-none">{pct(value, 0)}</span>
          <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-semibold", bad ? "bg-serious/15 text-serious" : "bg-good/15 text-good")}>{bad ? (higherIsBetter ? "Below target" : "Above threshold") : "OK"}</span>
        </span>
      </div>
      <div className="relative mt-2.5 h-2 rounded-full bg-white/[0.06]">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${value * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className={clsx("h-full rounded-full", bad ? "bg-serious" : "bg-good")} />
        <span {...tip(<>{higherIsBetter ? "Target floor" : "Comfort ceiling"}: {pct(threshold, 0)}</>)} className="absolute -top-1.5 h-5 w-[3px] -translate-x-1/2 rounded-full bg-white" style={{ left: `${threshold * 100}%` }} />
      </div>
      <div className="mt-2 text-[12.5px] text-white/45">{note}</div>
    </div>
  );
}

export function Ring({ value, total, label }: { value: number; total: number; label: string }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="10" />
        <motion.circle cx="60" cy="60" r={r} fill="none" stroke="#2fc28a" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / total) }} transition={{ duration: 1.1, ease }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="num font-display text-3xl leading-none">{value}/{total}</div>
          <div className="mt-1 text-[11px] text-white/50">{label}</div>
        </div>
      </div>
    </div>
  );
}

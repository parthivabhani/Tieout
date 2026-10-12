"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, FileSearch } from "lucide-react";
import clsx from "clsx";
import type { Deal, Exception, Severity, Status } from "@/lib/engine";
import { verify } from "@/lib/engine";
import { usd, round1k } from "@/lib/format";
import { Explain, SevTag, statusColor } from "../ui";

const STATUSES: Status[] = ["Verified", "Accepted in price", "Specialist", "Unresolved"];
const FILTERS: ("all" | Severity)[] = ["all", "critical", "serious", "warning"];
const ORDER: Record<Severity, number> = { critical: 0, serious: 1, warning: 2 };

export function Exceptions({ deal, ex, setEx }: { deal: Deal; ex: Exception[]; setEx: (f: (e: Exception[]) => Exception[]) => void }) {
  const [f, setF] = useState<(typeof FILTERS)[number]>("all");
  const [open, setOpen] = useState<string | null>("EX-01");
  const v = verify(deal, ex);
  const list = ex.filter((e) => f === "all" || e.sev === f).sort((a, b) => ORDER[a.sev] - ORDER[b.sev]);
  const upd = (id: string, patch: Partial<Exception>) => setEx((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-5">
      <Explain>
        <b className="text-white">One list of everything that didn&apos;t check out.</b> Each finding records what the seller claimed, what the evidence shows, the period, the difference and what it means for the deal. These are the same fields as Ecomma&apos;s diligence checklist. Set a status, and use the switch to decide whether a finding changes the price. <b className="text-white">Try switching off EX-05</b> and watch the numbers move.
      </Explain>

      <div className="sticky top-[72px] z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-navy-900/85 p-3 backdrop-blur-xl">
        <div className="flex gap-1 rounded-full bg-white/[0.04] p-1">
          {FILTERS.map((x) => (
            <button key={x} onClick={() => setF(x)} className={clsx("rounded-full px-3.5 py-1.5 text-[12.5px] font-medium capitalize transition", f === x ? "bg-white/10 text-white" : "text-white/50 hover:text-white")}>
              {x === "all" ? `All ${ex.length}` : x}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-5 pr-2 text-[12.5px]">
          <span className="text-white/50">Verified SDE <b className="num ml-1 font-display text-[19px] font-normal text-cyan">{usd(v.sde)}</b></span>
          <span className="text-white/50">Indicated price <b className="num ml-1 font-display text-[19px] font-normal text-white">{usd(round1k(v.price))}</b></span>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((e) => {
          const isOpen = open === e.id;
          return (
            <motion.div layout key={e.id} className={clsx("panel overflow-hidden", isOpen && "ring-1 ring-white/10")}>
              <div className="flex items-center gap-4 p-4 sm:p-5">
                {e.impact ? (
                  <button
                    role="switch"
                    aria-checked={e.apply}
                    aria-label={`Apply ${e.id} to price`}
                    onClick={() => upd(e.id, { apply: !e.apply })}
                    className={clsx("relative h-6 w-11 shrink-0 rounded-full transition", e.apply ? "bg-cyan" : "bg-white/15")}
                  >
                    <span className={clsx("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all", e.apply ? "left-6" : "left-1")} />
                  </button>
                ) : (
                  <span className="h-6 w-11 shrink-0 text-center text-[10.5px] leading-6 text-white/30" title="No direct price impact">info</span>
                )}
                <button onClick={() => setOpen(isOpen ? null : e.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                  <SevTag sev={e.sev} id={e.id} />
                  <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/55 sm:inline">{e.area}</span>
                  <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium">{e.short}</span>
                  <span className={clsx("num hidden text-[14px] sm:inline", e.impact ? (e.apply ? "text-crit" : "text-white/30 line-through") : "text-white/30")}>{e.impact ? usd(e.impact) : "—"}</span>
                  <ChevronDown className={clsx("h-4 w-4 shrink-0 text-white/40 transition", isOpen && "rotate-180")} />
                </button>
                <div className="relative hidden md:block">
                  <span className={clsx("pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full", statusColor[e.status])} />
                  <select
                    value={e.status}
                    onChange={(ev) => upd(e.id, { status: ev.target.value as Status })}
                    className="appearance-none rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-7 pr-4 text-[12.5px] text-white/85 outline-none hover:bg-white/[0.07]"
                  >
                    {STATUSES.map((s) => <option key={s} className="bg-navy-900">{s}</option>)}
                  </select>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="grid gap-3 border-t border-white/5 p-4 sm:p-5 md:grid-cols-4">
                      {[
                        ["The seller's claim", e.claim],
                        ["What the evidence shows", e.evidence],
                        ["Difference", e.diff ? `${usd(e.diff, e.id === "EX-02" ? 2 : 0)} · ${e.period}` : e.period],
                        ["What it means for the deal", e.implication],
                      ].map(([k, val]) => (
                        <div key={k} className="panel-inner p-4">
                          <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/40">{k}</div>
                          <div className="mt-2 text-[13.5px] leading-snug text-white/85">{val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 px-5 pb-5 text-[12px] text-white/45">
                      <FileSearch className="h-3.5 w-3.5 text-cyan" /> Source: <span className="text-white/75">{e.source}</span>
                      <span className="md:hidden">
                        <select value={e.status} onChange={(ev) => upd(e.id, { status: ev.target.value as Status })} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12.5px] text-white">
                          {STATUSES.map((s) => <option key={s} className="bg-navy-900">{s}</option>)}
                        </select>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, Banknote, Calculator, ListChecks, KeyRound, FileText, Compass, X, ArrowRight, ArrowLeft, MapPin, CalendarRange, Tag } from "lucide-react";
import clsx from "clsx";
import { buildDeal, type Exception } from "@/lib/engine";
import { Overview } from "./tabs/Overview";
import { Cash } from "./tabs/Cash";
import { Pnl } from "./tabs/Pnl";
import { Exceptions } from "./tabs/Exceptions";
import { Handover } from "./tabs/Handover";
import { Memo } from "./tabs/Memo";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "cash", label: "Cash tie-out", icon: Banknote },
  { key: "pnl", label: "P&L rebuild", icon: Calculator },
  { key: "exceptions", label: "Exception log", icon: ListChecks },
  { key: "handover", label: "Handover", icon: KeyRound },
  { key: "memo", label: "IC memo", icon: FileText },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const TOUR: { tab: TabKey; title: string; body: string }[] = [
  { tab: "overview", title: "Start with the answer", body: "A seller sent a P&L and asked $1.02M. Tieout read their actual Shopify, Stripe, PayPal, bank and ad data. Top row: what they claim vs what the evidence supports. The bar chart shows each step in between." },
  { tab: "cash", title: "Did the money really arrive?", body: "Every Stripe and PayPal payout is matched to a bank deposit. One payout never arrived. Three deposits weren't customers at all: two were the founder topping up the account. Hover the red line." },
  { tab: "pnl", title: "Is the profit real?", body: "The P&L is rebuilt from invoices and ad bills, not from the seller's spreadsheet. The supplier raised prices in May, and the seller's P&L never showed it. Margin is really 57%, not 62%." },
  { tab: "exceptions", title: "Decide, finding by finding", body: "This is the same decision record as Ecomma's diligence checklist. Switch a finding off, or change its status, and the verified earnings and price update instantly. Try it." },
  { tab: "handover", title: "Will it survive the handover?", body: "What's concentrated, and what's tied to the founder personally. Two items block closing: the ad card and the verbal factory terms." },
  { tab: "memo", title: "The write-up is already drafted", body: "Everything becomes a one-page IC summary that reflects every decision you made. Copy it and you're done." },
];

export function Workspace() {
  const deal = useMemo(() => buildDeal(), []);
  const [ex, setEx] = useState<Exception[]>(deal.exceptions);
  const [tab, setTab] = useState<TabKey>("overview");
  const [tour, setTour] = useState<number | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tour") === "1") setTour(0);
  }, []);
  useEffect(() => {
    if (tour !== null) setTab(TOUR[tour].tab);
  }, [tour]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const unresolved = ex.filter((e) => e.status === "Unresolved").length;

  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-32 pt-6 sm:px-6">
      {/* Deal bar */}
      <div className="panel flex flex-wrap items-center gap-x-6 gap-y-3 rounded-full px-5 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#c9d6ea] to-[#f2e7da] font-display text-[15px] font-semibold text-navy-900">F&amp;T</span>
          <div>
            <div className="text-[16px] font-semibold leading-tight">{deal.deal.name}</div>
            <div className="text-[11.5px] text-white/45">Diligence · day 4 of 20</div>
          </div>
        </div>
        <span className="hidden h-6 w-px bg-white/10 md:block" />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-white/60">
          <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />{deal.deal.category}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{deal.deal.region}</span>
          <span className="flex items-center gap-1.5"><CalendarRange className="h-3.5 w-3.5" />TTM {deal.deal.ttm}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="rounded-full bg-crit/15 px-3 py-1 text-[12px] font-semibold text-crit">{unresolved} unresolved</span>
          <button onClick={() => setTour(0)} className="flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-[13px] font-semibold text-navy-950 transition hover:bg-white">
            <Compass className="h-4 w-4" /> Guided tour
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 -mx-4 mt-5 bg-navy-950/60 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
        <nav className="flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-navy-900/80 p-1.5 backdrop-blur-xl scrollbar-none sm:inline-flex">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); setTour(null); }} className={clsx("relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition", tab === t.key ? "text-navy-950" : "text-white/60 hover:text-white")}>
              {tab === t.key && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-cyan" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <t.icon className="relative h-4 w-4" />
              <span className="relative">{t.label}</span>
              {t.key === "exceptions" && <span className={clsx("relative rounded-full px-1.5 text-[11px]", tab === t.key ? "bg-navy-950/15" : "bg-white/10")}>{ex.length}</span>}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-5">
          {tab === "overview" && <Overview deal={deal} ex={ex} go={(t) => setTab(t as TabKey)} />}
          {tab === "cash" && <Cash deal={deal} />}
          {tab === "pnl" && <Pnl deal={deal} />}
          {tab === "exceptions" && <Exceptions deal={deal} ex={ex} setEx={setEx} />}
          {tab === "handover" && <Handover deal={deal} />}
          {tab === "memo" && <Memo deal={deal} ex={ex} />}
        </motion.div>
      </AnimatePresence>

      {/* Guided tour */}
      <AnimatePresence>
        {tour !== null && (
          <motion.aside
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-5 right-5 z-50 w-[min(400px,calc(100vw-2.5rem))] overflow-hidden rounded-[26px] border border-cyan/30 bg-navy-850/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)] backdrop-blur-xl"
          >
            <div className="h-1 bg-white/5"><motion.div className="h-full bg-cyan" animate={{ width: `${((tour + 1) / TOUR.length) * 100}%` }} /></div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">Guided tour · {tour + 1} of {TOUR.length}</span>
                <button onClick={() => setTour(null)} aria-label="Close tour" className="grid h-7 w-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tour} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <h4 className="mt-3 text-[18px] font-semibold leading-snug">{TOUR[tour].title}</h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{TOUR[tour].body}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex items-center justify-between">
                <button disabled={tour === 0} onClick={() => setTour((t) => (t! > 0 ? t! - 1 : t))} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-white/60 transition hover:text-white disabled:opacity-30">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                {tour < TOUR.length - 1 ? (
                  <button onClick={() => setTour((t) => t! + 1)} className="flex items-center gap-1.5 rounded-full bg-cyan px-4 py-2 text-[13px] font-semibold text-navy-950 hover:bg-white">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => setTour(null)} className="rounded-full bg-cyan px-4 py-2 text-[13px] font-semibold text-navy-950 hover:bg-white">Finish</button>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
}

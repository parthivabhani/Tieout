import clsx from "clsx";
import { Lightbulb } from "lucide-react";
import type { Severity, Status } from "@/lib/engine";

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("panel min-w-0 p-5 sm:p-6", className)}>{children}</section>;
}

export function PanelHead({ icon: Icon, title, sub, right }: { icon: React.ElementType; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan"><Icon className="h-[18px] w-[18px]" /></span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold leading-tight">{title}</h3>
        {sub && <p className="mt-1 text-[12.5px] leading-snug text-white/50">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/** A plain-language line at the top of each tab: what you're looking at and why it matters. */
export function Explain({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-cyan/20 bg-cyan/[0.06] px-4 py-3.5 text-[13.5px] leading-relaxed text-white/75">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
      <div>{children}</div>
    </div>
  );
}

export const statusColor: Record<Status, string> = {
  Verified: "bg-good",
  "Accepted in price": "bg-cyan",
  Specialist: "bg-warn",
  Unresolved: "bg-crit",
};

export function StatusTag({ s }: { s: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-white/80">
      <span className={clsx("h-2 w-2 rounded-full", statusColor[s])} />
      {s}
    </span>
  );
}

const sevStyle: Record<Severity, string> = {
  critical: "bg-crit/15 text-crit",
  serious: "bg-serious/15 text-serious",
  warning: "bg-warn/15 text-warn",
};

export function SevTag({ sev, id }: { sev: Severity; id?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold", sevStyle[sev])}>
      <span className="h-1.5 w-1.5 rounded-[2px] bg-current" />
      {id ?? sev}
    </span>
  );
}

export function Stat({ k, v, sub, accent, strike }: { k: string; v: string; sub?: React.ReactNode; accent?: boolean; strike?: boolean }) {
  return (
    <div className={clsx("panel relative overflow-hidden p-5", accent && "ring-1 ring-cyan/40")}>
      {accent && <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan/20 blur-2xl" />}
      <div className="relative text-[12px] font-medium text-white/55">{k}</div>
      <div className={clsx("num relative mt-2 font-display text-[34px] leading-none tracking-tight", accent ? "text-cyan" : "text-white", strike && "text-white/55 line-through decoration-white/25 decoration-2")}>{v}</div>
      {sub && <div className="relative mt-2.5 text-[12.5px] text-white/50">{sub}</div>}
    </div>
  );
}

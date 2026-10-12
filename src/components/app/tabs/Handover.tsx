"use client";
import { Gauge, KeyRound } from "lucide-react";
import clsx from "clsx";
import type { Deal } from "@/lib/engine";
import { Panel, PanelHead, Explain } from "../ui";
import { Meter, Ring } from "../charts";

const stateStyle: Record<string, string> = {
  Ready: "bg-good/15 text-good",
  "At risk": "bg-serious/15 text-serious",
  Blocked: "bg-crit/15 text-crit",
  Rebuild: "bg-warn/15 text-warn",
};

export function Handover({ deal }: { deal: Deal }) {
  const S = deal.stats;
  const ready = deal.dependencies.filter((d) => d.state === "Ready").length;
  return (
    <div className="space-y-5">
      <Explain>
        <b className="text-white">Will the business still work after the founder leaves?</b> Two questions. First, what happens if one supplier, ad account or product has a bad month. Second, which accounts and relationships actually move to the buyer at closing, and which are tied to the founder personally.
      </Explain>
      <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
        <Panel>
          <PanelHead icon={Gauge} title="Concentration" sub="White tick = threshold" />
          <div className="divide-y divide-white/5">
            <Meter label="Top supplier's share of product cost" value={S.supplierShare} threshold={0.5} note="One factory in Porto. Terms are verbal." />
            <Meter label="Meta's share of ad spend" value={S.metaShare} threshold={0.6} note="If the ad account is restricted, most new customers stop." />
            <Meter label="Top product's share of revenue" value={S.topSkuShare} threshold={0.35} note="Merino crew knit. Sells mostly Oct–Feb." />
            <Meter label="Revenue from owned audience (email, SMS)" value={S.klaviyoShare} threshold={0.25} higherIsBetter note="Below the 25% floor in Ecomma's operator playbook. Retention is an upside lever." />
          </div>
        </Panel>
        <Panel>
          <PanelHead icon={KeyRound} title="Day-one dependency register" sub="What has to move to the buyer at closing" />
          <div className="mb-5 flex items-center gap-6">
            <Ring value={ready} total={deal.dependencies.length} label="ready to move" />
            <div className="space-y-1.5 text-[13px] text-white/65">
              <div><b className="text-crit">2 blocked:</b> the personal ad card and the verbal factory terms</div>
              <div><b className="text-serious">1 at risk:</b> Meta Business Manager on the founder&apos;s profile</div>
              <div><b className="text-warn">1 to rebuild:</b> Stripe needs a new account and KYC</div>
            </div>
          </div>
          <div className="space-y-2">
            {deal.dependencies.map((d) => (
              <div key={d.asset} className="panel-inner grid grid-cols-[1.2fr_1.2fr_auto] items-center gap-3 px-4 py-3 text-[13px]">
                <div className="font-medium">{d.asset}</div>
                <div className="text-white/50">{d.owner}<div className="text-[11.5px] text-white/35">{d.method}</div></div>
                <span className={clsx("rounded-full px-2.5 py-1 text-[11.5px] font-semibold", stateStyle[d.state])}>{d.state}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

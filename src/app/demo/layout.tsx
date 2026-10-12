import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TieoutWordmark } from "@/components/brand/TieoutMark";
import { EcommaLogo } from "@/components/brand/EcommaLogo";
import { TooltipProvider } from "@/components/app/Tooltip";
import { AppNav } from "@/components/app/AppNav";

export const metadata = { title: "Tieout · Demo workspace" };

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="app-bg min-h-screen text-white">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-950/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3 transition hover:opacity-90" title="Back to Tieout home">
              <TieoutWordmark dark />
              <span className="hidden h-5 w-px bg-white/15 sm:block" />
              <EcommaLogo className="hidden h-[20px] sm:h-[22px] w-auto text-white sm:block" />
            </Link>
            <AppNav />
            <Link href="/" className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12.5px] text-white/70 transition hover:bg-white/5 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">About Tieout</span>
            </Link>
            <div className="hidden h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-deep to-cyan text-[12px] font-semibold sm:grid" title="Ecomma deal team">EC</div>
          </div>
        </header>
        {children}
      </div>
    </TooltipProvider>
  );
}

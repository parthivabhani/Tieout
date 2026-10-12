import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { TieoutWordmark } from "@/components/brand/TieoutMark";
import { EcommaLogo } from "@/components/brand/EcommaLogo";
import { site } from "@/lib/site";

const questions = [
  "Between a seller's intake and a soft LOI, where does your team's time actually go?",
  "What does your AI qualification tool already check, and where does it stop?",
  "How many sellers do you screen for each one you buy?",
  "Which finding most often changes the price after diligence?",
  "Would buyers trust “reviewed financials” more if they could see the tie-out?",
];

export function Closing() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 py-24 text-white sm:py-32">
        <svg className="pointer-events-none absolute -right-20 top-0 h-full w-[60%] opacity-60" viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="cl-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#0a4a9a" /><stop offset="1" stopColor="#57cafb" stopOpacity=".5" /></linearGradient>
          </defs>
          <path d="M600 0 L 260 0 C 160 120, 360 220, 240 340 C 140 440, 260 540, 340 600 L 600 600 Z" fill="url(#cl-g)" opacity=".35" />
        </svg>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-cyan">
              <span className="h-[3px] w-8 rounded-full bg-cyan" /> What we&apos;d like to learn
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              We built this from what Ecomma publishes. <span className="font-display font-medium italic text-cyan">Tell us where it&apos;s wrong.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/65">
              Tieout is a working concept on sample data. Before building more, we&apos;d like to know whether this is where your team loses time, and what a real deal would need.
            </p>
            <Link href="/demo" className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-cyan px-6 py-3.5 text-[15px] font-semibold text-navy-950 transition hover:bg-white">
              Walk through the sample deal <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <Reveal key={q} delay={i * 0.06}>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                  <p className="text-[15.5px] leading-snug text-white/90">{q}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-navy-950 py-10 text-white/50">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 text-[13px] sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-4">
            <TieoutWordmark dark />
            <span className="h-5 w-px bg-white/15" />
            <span className="flex items-center gap-2"><span className="translate-y-[3.5px]">concept for</span> <EcommaLogo className="h-[20px] sm:h-[22px] w-auto text-white" /></span>
          </div>
          <div className="max-w-md sm:text-right">
            A concept by {site.team}, {site.school}. Not an Ecomma product. All deal data is fictional.
          </div>
        </div>
      </footer>
    </>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { TieoutWordmark } from "@/components/brand/TieoutMark";
import { EcommaLogo } from "@/components/brand/EcommaLogo";

const links = [
  ["The problem", "#problem"],
  ["How it works", "#how"],
  ["What it catches", "#catches"],
  ["Compare", "#compare"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={clsx("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_#e5e7eb]" : "bg-transparent")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <TieoutWordmark />
          <span className="hidden h-5 w-px bg-rule sm:block" />
          <span className="hidden items-center gap-2 text-xs font-medium text-soft sm:flex">
            built for <EcommaLogo className="h-[22px] sm:h-[24px] w-auto text-navy-900" />
          </span>
        </Link>
        <nav className={clsx("ml-auto hidden items-center gap-7 rounded-full px-5 py-2 text-[13.5px] font-medium text-muted transition md:flex", !scrolled && "bg-white/90 shadow-sm backdrop-blur")}>
          {links.map(([l, h]) => (
            <a key={h} href={h} className="transition-colors hover:text-ink">{l}</a>
          ))}
        </nav>
        <Link href="/demo" className="ml-auto rounded-full bg-navy-900 px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-brand md:ml-0">
          Open live demo
        </Link>
      </div>
    </header>
  );
}

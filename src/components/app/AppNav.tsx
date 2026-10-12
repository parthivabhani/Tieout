"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Plus, FileSearch } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/demo", label: "Pipeline", icon: LayoutGrid, match: (p: string) => p === "/demo" },
  { href: "/demo/deals/falcon-trust", label: "Falcon & Trust", icon: FileSearch, match: (p: string) => p.startsWith("/demo/deals") },
  { href: "/demo/new", label: "New deal", icon: Plus, match: (p: string) => p === "/demo/new" },
];

export function AppNav() {
  const p = usePathname();
  return (
    <nav className="mx-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
      {items.map((it) => {
        const on = it.match(p);
        return (
          <Link key={it.href} href={it.href} className={clsx("flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition", on ? "bg-white/10 text-white" : "text-white/55 hover:text-white")}>
            <it.icon className="h-3.5 w-3.5" /> {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

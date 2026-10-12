"use client";
import { createContext, useCallback, useContext, useState } from "react";

type Tip = { x: number; y: number; content: React.ReactNode } | null;
const Ctx = createContext<(t: Tip) => void>(() => {});

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [tip, setTip] = useState<Tip>(null);
  return (
    <Ctx.Provider value={setTip}>
      {children}
      {tip && (
        <div
          className="pointer-events-none fixed z-[100] max-w-[280px] rounded-xl border border-white/10 bg-navy-800/95 px-3 py-2 text-[12.5px] leading-relaxed text-white shadow-2xl backdrop-blur"
          style={{ left: Math.min(tip.x + 14, (typeof window !== "undefined" ? window.innerWidth : 1200) - 300), top: tip.y + 16 }}
        >
          {tip.content}
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Spread the returned props onto any element to give it a hover tooltip. */
export function useTip() {
  const set = useContext(Ctx);
  return useCallback(
    (content: React.ReactNode) => ({
      onMouseMove: (e: React.MouseEvent) => set({ x: e.clientX, y: e.clientY, content }),
      onMouseLeave: () => set(null),
    }),
    [set]
  );
}

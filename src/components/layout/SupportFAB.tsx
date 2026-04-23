"use client";

import { Coffee } from "lucide-react";

interface SupportFABProps {
  onClick: () => void;
}

/**
 * Floating "Buy me a coffee" button.
 * Bottom-right on mobile; above the minimap on desktop so it doesn't collide.
 */
export function SupportFAB({ onClick }: SupportFABProps) {
  return (
    <button
      onClick={onClick}
      className="group fixed z-30 flex items-center gap-2 rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/25 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40 active:translate-y-0 bottom-5 right-4 md:bottom-28 md:right-5"
      title="Buy me a coffee — support the project"
      aria-label="Buy me a coffee"
    >
      <Coffee className="h-4 w-4 transition-transform group-hover:-rotate-6 group-hover:scale-110" />
      <span>Buy me a coffee</span>
    </button>
  );
}

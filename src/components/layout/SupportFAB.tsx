"use client";

import { Coffee } from "lucide-react";

interface SupportFABProps {
  onClick: () => void;
}

/**
 * Circular "Buy me a coffee" floating action button.
 * The label arches across the top half only; the Coffee icon sits in the middle.
 *
 * Mobile: bottom-right corner. Desktop: sits to the left of the minimap.
 */
export function SupportFAB({ onClick }: SupportFABProps) {
  return (
    <button
      onClick={onClick}
      className="group fixed bottom-5 right-4 z-30 flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-zinc-950 shadow-lg shadow-amber-500/30 ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:scale-[1.04] active:translate-y-0 md:right-[172px]"
      title="Buy me a coffee — support the project"
      aria-label="Buy me a coffee"
    >
      {/* Arched label across the top half */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <path
            id="support-fab-arc-top"
            d="M 14,50 A 36,36 0 0,1 86,50"
            fill="none"
          />
        </defs>
        <text
          className="fill-zinc-950"
          style={{
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "0.16em",
          }}
        >
          <textPath
            href="#support-fab-arc-top"
            startOffset="50%"
            textAnchor="middle"
          >
            BUY ME A COFFEE
          </textPath>
        </text>
      </svg>

      {/* Centered Coffee icon */}
      <Coffee
        className="relative z-10 h-7 w-7 transition-transform group-hover:-rotate-6 group-hover:scale-110"
        strokeWidth={2.5}
      />
    </button>
  );
}

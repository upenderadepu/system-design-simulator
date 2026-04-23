"use client";

import { Coffee } from "lucide-react";

interface SupportFABProps {
  onClick: () => void;
}

/**
 * Circular "Buy me a coffee" floating action button.
 * The label curls around the disc (SVG textPath) and slowly rotates.
 * Coffee icon stays centered and still.
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
      {/* Rotating text ring */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]"
        aria-hidden="true"
      >
        <defs>
          <path
            id="support-fab-ring"
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text
          className="fill-zinc-950 font-bold"
          style={{ fontSize: "10px", letterSpacing: "0.18em" }}
        >
          <textPath href="#support-fab-ring" startOffset="0">
            BUY ME A COFFEE · BUY ME A COFFEE ·
          </textPath>
        </text>
      </svg>

      {/* Centered Coffee icon */}
      <Coffee className="relative z-10 h-7 w-7 transition-transform group-hover:-rotate-6 group-hover:scale-110" />
    </button>
  );
}

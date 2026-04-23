"use client";

import { Coffee } from "lucide-react";

interface SupportFABProps {
  onClick: () => void;
}

/**
 * Circular "Buy me a coffee" floating action button.
 * Colors follow the site's cyan accent palette. Label arches across a 210° arc
 * so it never clips; Coffee icon stays centered.
 *
 * Mobile: bottom-right corner. Desktop: sits to the left of the minimap.
 */
export function SupportFAB({ onClick }: SupportFABProps) {
  return (
    <button
      onClick={onClick}
      className="group fixed bottom-5 right-4 z-30 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/50 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 text-zinc-950 shadow-lg shadow-cyan-500/30 ring-1 ring-black/10 transition-transform hover:-translate-y-0.5 hover:scale-[1.04] active:translate-y-0 md:right-[172px]"
      title="Buy me a coffee — support the project"
      aria-label="Buy me a coffee"
    >
      {/* Arched label — 210° arc along the bottom, text reads upright */}
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <path
            id="support-fab-arc-bottom"
            d="M 15.23,40.68 A 36,36 0 1,1 84.77,40.68"
            fill="none"
          />
        </defs>
        <text
          style={{
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "0.1em",
            fill: "#09090b",
            stroke: "#09090b",
            strokeWidth: "0.6",
            paintOrder: "stroke fill",
          }}
        >
          <textPath
            href="#support-fab-arc-bottom"
            startOffset="50%"
            textAnchor="middle"
          >
            BUY ME A COFFEE
          </textPath>
        </text>
      </svg>

      {/* Centered Coffee icon — smaller so text reads as the hero */}
      <Coffee
        className="relative z-10 h-5 w-5 transition-transform group-hover:-rotate-6 group-hover:scale-110"
        strokeWidth={2.75}
      />
    </button>
  );
}

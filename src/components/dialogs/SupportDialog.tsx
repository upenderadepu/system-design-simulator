"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Copy, Check, Heart } from "lucide-react";

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

const UPI_ID = "vijaygupta1818@ptyes";

export function SupportDialog({ open, onClose }: SupportDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail — user can still scan QR
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 my-6 w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl">
        {/* Decorative gradient header */}
        <div className="relative h-24 overflow-hidden bg-gradient-to-br from-rose-500/20 via-amber-500/10 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(244,63,94,0.18),transparent_60%)]" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/60 text-zinc-400 backdrop-blur transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 -bottom-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/30 to-amber-500/20 shadow-[0_0_40px_-8px_rgba(244,63,94,0.5)]">
              <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-10 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
            Enjoying SystemSim?
          </h2>
          <p className="mx-auto mt-2 max-w-[280px] text-xs leading-relaxed text-zinc-400">
            If this helped you prep for a system design interview — or if you just want to keep it alive and open-source — a chai would mean a lot.
          </p>

          {/* QR */}
          <div className="mt-5 flex justify-center">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-100 p-2 shadow-lg">
              <Image
                src="/support-upi-qr.jpg"
                alt="UPI QR code — scan to support Vijay Gupta"
                width={1012}
                height={1600}
                className="h-auto w-[240px] rounded-md"
                priority={false}
              />
            </div>
          </div>

          {/* UPI ID + copy */}
          <button
            onClick={handleCopy}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-[11px] text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
          >
            {UPI_ID}
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-zinc-500" />
            )}
          </button>

          <p className="mt-4 text-[11px] text-zinc-500">
            Pay what feels right · No pressure · No ads
          </p>

          <div className="mt-5 border-t border-zinc-800 pt-4">
            <p className="text-[11px] text-zinc-500">
              Built with <Heart className="inline h-3 w-3 fill-rose-400 text-rose-400" /> by{" "}
              <span className="font-medium text-zinc-300">Vijay Gupta</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

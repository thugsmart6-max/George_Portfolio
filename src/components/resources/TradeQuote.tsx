"use client";

import { useEffect, useState } from "react";
import { TRADE_QUOTES } from "@/lib/research";

export function TradeQuote({
  variant = "inline",
}: {
  variant?: "inline" | "hero";
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % TRADE_QUOTES.length),
      7000
    );
    return () => window.clearInterval(id);
  }, []);

  const q = TRADE_QUOTES[i];

  if (variant === "hero") {
    return (
      <span className="block normal-case">
        <span className="display block text-[clamp(1.85rem,4.6vw,4rem)] font-medium leading-[1.12] tracking-[-0.03em]">
          “{q.text}”
        </span>
        <span className="mt-5 block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          — {q.by}
        </span>
      </span>
    );
  }

  return (
    <p className="max-w-3xl text-[11px] leading-relaxed tracking-[0.04em] text-[var(--accent-2)] sm:text-xs">
      “{q.text}”
      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        — {q.by}
      </span>
    </p>
  );
}

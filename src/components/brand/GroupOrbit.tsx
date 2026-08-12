"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VERTICALS } from "@/lib/brand";

export function GroupOrbit() {
  const [active, setActive] = useState<string>(VERTICALS[0].slug);
  const current = VERTICALS.find((v) => v.slug === active) ?? VERTICALS[0];
  const idx = VERTICALS.findIndex((v) => v.slug === active);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <div className="absolute inset-[10%] rounded-full border border-[var(--border)]" />
        <div className="absolute inset-[24%] rounded-full border border-[var(--border)]" />
        <div className="absolute inset-[38%] rounded-full border border-dashed border-[var(--border)]" />

        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)]">
              {String(idx + 1).padStart(2, "0")} /{" "}
              {String(VERTICALS.length).padStart(2, "0")}
            </p>
            <p className="display mt-2 text-4xl">{current.mark}</p>
          </div>
        </div>

        {VERTICALS.map((v, i) => {
          const angle = (i / VERTICALS.length) * Math.PI * 2 - Math.PI / 2;
          const r = 42;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          const on = active === v.slug;
          return (
            <button
              key={v.slug}
              type="button"
              onClick={() => setActive(v.slug)}
              data-cursor="explore"
              className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-bold tracking-[0.08em] transition-all ${
                on
                  ? "scale-110 border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]"
                  : "border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={v.name}
            >
              {v.mark}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.slug}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="relative border border-[var(--border)] bg-[var(--bg-secondary)] p-8 md:p-10"
        >
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            {current.sector}
          </p>
          <h3 className="display mt-4 text-4xl md:text-5xl">{current.name}</h3>
          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[var(--accent-2)]">
            {current.role}
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            {current.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {VERTICALS.map((v) => (
              <button
                key={v.slug}
                type="button"
                onClick={() => setActive(v.slug)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] ${
                  active === v.slug
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--text-muted)]"
                }`}
              >
                {v.mark}
              </button>
            ))}
          </div>
          <Link
            href="/group"
            className="mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            Full ecosystem map
            <span className="h-px w-10 bg-[var(--text-primary)]" />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

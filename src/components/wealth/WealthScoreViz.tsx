"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WealthScoreResult } from "@/types";
import { cn } from "@/lib/utils";

export function WealthScoreViz({ result }: { result: WealthScoreResult }) {
  const [active, setActive] = useState<string | null>(null);
  const [openWhy, setOpenWhy] = useState(false);
  const radius = 90;
  const cx = 120;
  const cy = 120;

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="relative mx-auto h-[240px] w-[240px]" data-cursor="data">
          <svg viewBox="0 0 240 240" className="h-full w-full">
            {result.breakdown.map((factor, i) => {
              const total = result.breakdown.length;
              const start = (i / total) * Math.PI * 2 - Math.PI / 2;
              const end = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - 0.08;
              const r1 = radius;
              const r2 = radius - 18;
              const large = end - start > Math.PI ? 1 : 0;
              const x1 = cx + r1 * Math.cos(start);
              const y1 = cy + r1 * Math.sin(start);
              const x2 = cx + r1 * Math.cos(end);
              const y2 = cy + r1 * Math.sin(end);
              const x3 = cx + r2 * Math.cos(end);
              const y3 = cy + r2 * Math.sin(end);
              const x4 = cx + r2 * Math.cos(start);
              const y4 = cy + r2 * Math.sin(start);
              const path = `M ${x1} ${y1} A ${r1} ${r1} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r2} ${r2} 0 ${large} 0 ${x4} ${y4} Z`;
              const intensity = factor.score / 100;
              return (
                <motion.path
                  key={factor.key}
                  d={path}
                  fill={`color-mix(in srgb, var(--accent) ${Math.round(18 + intensity * 70)}%, transparent)`}
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: active === factor.key ? 1.04 : 1,
                  }}
                  style={{ transformOrigin: "120px 120px" }}
                  onMouseEnter={() => setActive(factor.key)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="eyebrow">Wealth Score</p>
            <p className="display text-6xl text-[var(--accent)]">{result.score}</p>
            <p className="text-sm text-[var(--text-muted)]">/ 100</p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {result.breakdown.map((factor) => (
            <button
              key={factor.key}
              type="button"
              onMouseEnter={() => setActive(factor.key)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "flex w-full items-center justify-between border border-transparent px-3 py-2 text-left transition-colors",
                active === factor.key && "border-[var(--border)] bg-white/[0.02]"
              )}
            >
              <span className="text-sm">{factor.label}</span>
              <span
                className={cn(
                  "text-sm",
                  factor.status === "strong" && "text-[var(--accent)]",
                  factor.status === "moderate" && "text-[var(--warning)]",
                  factor.status === "weak" && "text-[var(--danger)]"
                )}
              >
                {factor.score}
              </span>
            </button>
          ))}

          <AnimatePresence>
            {active ? (
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pt-2 text-sm text-[var(--text-secondary)]"
              >
                {result.breakdown.find((f) => f.key === active)?.detail}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpenWhy((v) => !v)}
            className="mt-4 text-sm text-[var(--accent)]"
          >
            Why your score is {result.score}
          </button>
          <AnimatePresence>
            {openWhy ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden text-sm text-[var(--text-secondary)]"
              >
                <p className="mt-2 font-medium text-[var(--text-primary)]">
                  Strengths
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {result.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="mt-4 font-medium text-[var(--text-primary)]">
                  Focus areas
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {result.weaknesses.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="mt-4 font-medium text-[var(--text-primary)]">
                  Recommendations
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {result.recommendations.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

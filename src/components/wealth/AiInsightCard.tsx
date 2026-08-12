"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AiInsight } from "@/types";

export function AiInsightCard({ insight }: { insight: AiInsight }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8" data-cursor="ask">
      <p className="eyebrow text-[var(--accent)]">{insight.title}</p>
      <p className="display mt-4 text-2xl leading-snug md:text-3xl">
        {insight.message}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-6 text-sm text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
      >
        {open ? "Hide analysis" : "Why? · What changes? · Impact"}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-6 border-t border-[var(--border)] pt-6 text-sm md:grid-cols-3">
              <div>
                <p className="eyebrow">Why</p>
                <p className="mt-2 text-[var(--text-secondary)]">{insight.why}</p>
              </div>
              <div>
                <p className="eyebrow">What changes</p>
                <ul className="mt-2 space-y-1 text-[var(--text-secondary)]">
                  {insight.whatChanges.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">Projected impact</p>
                <p className="mt-2 text-[var(--text-secondary)]">
                  {insight.projectedImpact}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { formatINR } from "@/lib/utils";
import type { FinancialGoal, GoalProjection } from "@/types";

export function GoalTimeline({
  goal,
  projection,
}: {
  goal: FinancialGoal;
  projection: GoalProjection;
}) {
  const startYear = new Date().getFullYear();
  const endYear = new Date(goal.targetDate).getFullYear();
  const years: number[] = [];
  for (let y = startYear; y <= Math.max(endYear, startYear + 1); y++) years.push(y);

  const progress = Math.min(100, projection.progressPercent);
  const projectedRatio = projection.onTrack
    ? 1
    : Math.min(
        1,
        (goal.currentSavings +
          goal.monthlyContribution * projection.monthsRemaining) /
          goal.targetAmount
      );

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{goal.category}</p>
          <h3 className="display mt-2 text-3xl">{goal.name}</h3>
        </div>
        <p className="display text-4xl text-[var(--accent)]">
          {progress.toFixed(0)}%
        </p>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          {years.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
        <div className="relative mt-4 h-16">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--border-strong)]" />
          <motion.div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-[var(--accent)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--accent)]"
            initial={{ left: 0 }}
            whileInView={{ left: `calc(${progress}% - 6px)` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-[var(--text-primary)]"
            style={{ left: "calc(100% - 6px)" }}
            title="Target"
          />
          <motion.div
            className="absolute top-[70%] h-px border-t border-dashed border-[var(--warning)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${projectedRatio * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-[var(--text-secondary)]">
          <span>Current {formatINR(goal.currentSavings)}</span>
          <span>Target {formatINR(goal.targetAmount)}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-[var(--text-muted)]">Required / month</p>
          <p className="mt-1 text-[var(--text-primary)]">
            {formatINR(projection.requiredMonthlySavings)}
          </p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Status</p>
          <p
            className={
              projection.onTrack ? "text-[var(--accent)]" : "text-[var(--warning)]"
            }
          >
            {projection.onTrack ? "On track" : "Needs acceleration"}
          </p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">
            {projection.expectedShortfall > 0 ? "Shortfall" : "Surplus"}
          </p>
          <p>
            {formatINR(
              projection.expectedShortfall > 0
                ? projection.expectedShortfall
                : projection.expectedSurplus
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

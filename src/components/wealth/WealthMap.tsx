"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { formatINR, formatPercent } from "@/lib/utils";
import type { WealthMetrics, GoalProjection } from "@/types";

const nodes = [
  { id: "income", label: "Income", x: 50, y: 8 },
  { id: "cashflow", label: "Cash Flow", x: 50, y: 28 },
  { id: "expense", label: "Expense", x: 22, y: 48 },
  { id: "savings", label: "Savings", x: 78, y: 48 },
  { id: "assets", label: "Assets", x: 78, y: 68 },
  { id: "liabilities", label: "Liabilities", x: 22, y: 68 },
  { id: "networth", label: "Net Worth", x: 50, y: 82 },
  { id: "goals", label: "Goals", x: 50, y: 96 },
];

const edges = [
  ["income", "cashflow"],
  ["cashflow", "expense"],
  ["cashflow", "savings"],
  ["savings", "assets"],
  ["assets", "networth"],
  ["liabilities", "networth"],
  ["networth", "goals"],
];

export function WealthMap({
  metrics,
  goals,
}: {
  metrics: WealthMetrics;
  goals: GoalProjection[];
}) {
  const [active, setActive] = useState("networth");

  const details: Record<string, string> = {
    income: `Monthly income ${formatINR(metrics.monthlyIncome)}`,
    cashflow: `Savings ${formatINR(metrics.monthlySavings)} after expenses`,
    expense: `Monthly expenses ${formatINR(metrics.monthlyExpenses)}`,
    savings: `Savings rate ${formatPercent(metrics.savingsRate)}`,
    assets: `Total assets ${formatINR(metrics.totalAssets)}`,
    liabilities: `Total liabilities ${formatINR(metrics.totalLiabilities)}`,
    networth: `Net worth ${formatINR(metrics.netWorth)}`,
    goals: goals.length
      ? goals.map((g) => `${g.name} ${g.progressPercent.toFixed(0)}%`).join(" · ")
      : "No goals yet",
  };

  const find = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-4 md:p-8">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-xl md:aspect-[5/4]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {edges.map(([a, b]) => {
            const n1 = find(a);
            const n2 = find(b);
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="var(--accent)"
                strokeOpacity="0.35"
                strokeWidth="0.35"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
              />
            );
          })}
          {nodes.map((node) => (
            <g
              key={node.id}
              onClick={() => setActive(node.id)}
              className="cursor-pointer"
              data-cursor="explore"
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={active === node.id ? 3.2 : 2.4}
                fill={active === node.id ? "var(--accent)" : "var(--surface)"}
                stroke="var(--accent)"
                strokeWidth="0.4"
                whileHover={{ scale: 1.15 }}
              />
              <text
                x={node.x}
                y={node.y - 4.5}
                textAnchor="middle"
                fill="#a7abb3"
                fontSize="3"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 border-t border-[var(--border)] pt-4 text-center">
        <p className="eyebrow">{nodes.find((n) => n.id === active)?.label}</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {details[active]}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { GoalTimeline } from "@/components/goals/GoalTimeline";
import { ProgressiveFinanceForm } from "@/components/finance/ProgressiveFinanceForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { FinancialGoal, GoalProjection } from "@/types";

const steps = [
  {
    id: "1",
    title: "What are you building toward?",
    field: "name",
    type: "text" as const,
    placeholder: "Buy House",
  },
  {
    id: "2",
    title: "Which category?",
    field: "category",
    type: "choice" as const,
    options: [
      "Home",
      "Vehicle",
      "Education",
      "Retirement",
      "Emergency",
      "Travel",
      "Wedding",
      "Other",
    ],
  },
  {
    id: "3",
    title: "Target amount?",
    field: "targetAmount",
    type: "number" as const,
  },
  {
    id: "4",
    title: "Current savings toward it?",
    field: "currentSavings",
    type: "number" as const,
  },
  {
    id: "5",
    title: "Target date?",
    field: "targetDate",
    type: "date" as const,
  },
  {
    id: "6",
    title: "Monthly contribution?",
    field: "monthlyContribution",
    type: "number" as const,
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [projections, setProjections] = useState<GoalProjection[]>([]);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/goals");
    const json = await res.json();
    setGoals(json.goals || []);
    setProjections(json.projections || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="px-5 py-10 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Goals</p>
          <h1 className="display mt-3 text-4xl md:text-5xl">
            Give money a destination
          </h1>
        </div>
        {!adding ? (
          <Button onClick={() => setAdding(true)}>Create a goal</Button>
        ) : null}
      </div>

      <div className="mt-10 space-y-6">
        {adding ? (
          <ProgressiveFinanceForm
            steps={steps}
            submitLabel="Create goal"
            onSubmit={async (values) => {
              const res = await fetch("/api/goals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: values.name,
                  category: values.category,
                  targetAmount: Number(values.targetAmount),
                  currentSavings: Number(values.currentSavings || 0),
                  targetDate: values.targetDate,
                  monthlyContribution: Number(values.monthlyContribution || 0),
                  priority: "high",
                }),
              });
              if (!res.ok) throw new Error((await res.json()).error || "Failed");
              setAdding(false);
              await load();
            }}
          />
        ) : null}

        {!adding && goals.length === 0 ? (
          <EmptyState
            title="Give your money somewhere to go."
            ctaLabel="Create a goal"
            onCta={() => setAdding(true)}
          />
        ) : null}

        {goals.map((goal) => {
          const projection = projections.find((p) => p.goalId === goal.id);
          if (!projection) return null;
          return (
            <div key={goal.id} className="relative">
              <GoalTimeline goal={goal} projection={projection} />
              <button
                type="button"
                className="mt-2 text-xs text-[var(--danger)]"
                onClick={async () => {
                  await fetch(`/api/goals/${goal.id}`, { method: "DELETE" });
                  await load();
                }}
              >
                Delete goal
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

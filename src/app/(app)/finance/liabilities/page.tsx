"use client";

import { useCallback, useEffect, useState } from "react";
import { FinanceList } from "@/components/finance/FinanceList";
import { ProgressiveFinanceForm } from "@/components/finance/ProgressiveFinanceForm";
import type { LiabilityRecord } from "@/types";

const categories = [
  "Home Loan",
  "Personal Loan",
  "Credit Card",
  "Education Loan",
  "Vehicle Loan",
  "Other",
];

const steps = [
  {
    id: "1",
    title: "What kind of liability?",
    field: "category",
    type: "choice" as const,
    options: categories,
  },
  {
    id: "2",
    title: "Name this liability",
    field: "name",
    type: "text" as const,
  },
  {
    id: "3",
    title: "Outstanding amount?",
    field: "outstandingAmount",
    type: "number" as const,
  },
  {
    id: "4",
    title: "Monthly EMI? (optional)",
    field: "monthlyEMI",
    type: "number" as const,
    optional: true,
  },
];

export default function LiabilitiesPage() {
  const [items, setItems] = useState<LiabilityRecord[]>([]);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/liabilities");
    const json = await res.json();
    setItems(json.items || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="eyebrow">Liabilities</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">What you owe</h1>
      <div className="mt-8">
        {adding ? (
          <ProgressiveFinanceForm
            steps={steps}
            submitLabel="Add liability"
            onSubmit={async (values) => {
              const res = await fetch("/api/liabilities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: values.name,
                  category: values.category,
                  outstandingAmount: Number(values.outstandingAmount),
                  monthlyEMI: values.monthlyEMI
                    ? Number(values.monthlyEMI)
                    : undefined,
                }),
              });
              if (!res.ok) throw new Error((await res.json()).error || "Failed");
              setAdding(false);
              await load();
            }}
          />
        ) : (
          <FinanceList
            items={items.map((i) => ({
              id: i.id,
              title: i.name,
              subtitle: i.category,
              amount: i.outstandingAmount,
              meta: i.monthlyEMI ? `EMI ${i.monthlyEMI}` : undefined,
            }))}
            emptyTitle="No liabilities recorded — a clean slate or incomplete map."
            emptyCta="Add a liability"
            onAdd={() => setAdding(true)}
            onDelete={async (id) => {
              await fetch(`/api/liabilities/${id}`, { method: "DELETE" });
              await load();
            }}
          />
        )}
      </div>
    </div>
  );
}

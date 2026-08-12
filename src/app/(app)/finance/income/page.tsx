"use client";

import { useCallback, useEffect, useState } from "react";
import { FinanceList } from "@/components/finance/FinanceList";
import { ProgressiveFinanceForm } from "@/components/finance/ProgressiveFinanceForm";
import { formatINR } from "@/lib/utils";
import type { IncomeRecord } from "@/types";

const steps = [
  {
    id: "1",
    title: "What type of money is this?",
    field: "category",
    type: "choice" as const,
    options: ["Salary", "Business", "Rental", "Freelance", "Other"],
  },
  {
    id: "2",
    title: "How much?",
    field: "amount",
    type: "number" as const,
    placeholder: "100000",
  },
  {
    id: "3",
    title: "How often?",
    field: "frequency",
    type: "choice" as const,
    options: ["monthly", "yearly", "one-time", "weekly"],
  },
  {
    id: "4",
    title: "Anything else?",
    field: "description",
    type: "text" as const,
    optional: true,
    placeholder: "Optional description",
  },
];

export default function IncomePage() {
  const [items, setItems] = useState<IncomeRecord[]>([]);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    const qs = filter ? `?category=${encodeURIComponent(filter)}` : "";
    const res = await fetch(`/api/income${qs}`);
    const json = await res.json();
    setItems(json.items || []);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="eyebrow">Income</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">Money comes in</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {["", "Salary", "Business", "Rental", "Freelance", "Other"].map((c) => (
          <button
            key={c || "all"}
            type="button"
            onClick={() => setFilter(c)}
            className={`border px-3 py-1 text-xs ${
              filter === c
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)]"
            }`}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {adding ? (
          <ProgressiveFinanceForm
            steps={steps}
            submitLabel="Add income"
            onSubmit={async (values) => {
              const res = await fetch("/api/income", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  category: values.category,
                  amount: Number(values.amount),
                  frequency: values.frequency,
                  date: new Date().toISOString(),
                  description: values.description,
                }),
              });
              if (!res.ok) {
                const j = await res.json();
                throw new Error(j.error || "Failed");
              }
              setAdding(false);
              await load();
            }}
          />
        ) : (
          <FinanceList
            items={items.map((i) => ({
              id: i.id,
              title: formatINR(i.amount),
              subtitle: i.category,
              amount: i.amount,
              meta: `${i.frequency}${i.description ? ` · ${i.description}` : ""}`,
            }))}
            emptyTitle="Your wealth story starts here."
            emptyCta="Add your first income"
            onAdd={() => setAdding(true)}
            onDelete={async (id) => {
              await fetch(`/api/income/${id}`, { method: "DELETE" });
              await load();
            }}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { FinanceList } from "@/components/finance/FinanceList";
import { ProgressiveFinanceForm } from "@/components/finance/ProgressiveFinanceForm";
import type { AssetRecord } from "@/types";

const categories = [
  "Bank Balance",
  "Mutual Funds",
  "Stocks",
  "Gold",
  "Property",
  "FD",
  "Cash",
  "Other",
];

const steps = [
  {
    id: "1",
    title: "What kind of asset?",
    field: "category",
    type: "choice" as const,
    options: categories,
  },
  {
    id: "2",
    title: "What should we call it?",
    field: "name",
    type: "text" as const,
    placeholder: "Savings Account",
  },
  {
    id: "3",
    title: "Current value?",
    field: "currentValue",
    type: "number" as const,
  },
  {
    id: "4",
    title: "Notes?",
    field: "notes",
    type: "text" as const,
    optional: true,
  },
];

export default function AssetsPage() {
  const [items, setItems] = useState<AssetRecord[]>([]);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/assets");
    const json = await res.json();
    setItems(json.items || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="eyebrow">Assets</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">What you own</h1>
      <div className="mt-8">
        {adding ? (
          <ProgressiveFinanceForm
            steps={steps}
            submitLabel="Add asset"
            onSubmit={async (values) => {
              const res = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: values.name,
                  category: values.category,
                  currentValue: Number(values.currentValue),
                  date: new Date().toISOString(),
                  notes: values.notes,
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
              amount: i.currentValue,
              meta: i.notes,
            }))}
            emptyTitle="Let's discover what you already own."
            emptyCta="Add an asset"
            onAdd={() => setAdding(true)}
            onDelete={async (id) => {
              await fetch(`/api/assets/${id}`, { method: "DELETE" });
              await load();
            }}
          />
        )}
      </div>
    </div>
  );
}

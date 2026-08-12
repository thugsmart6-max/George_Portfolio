"use client";

import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface Item {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  meta?: string;
}

export function FinanceList({
  items,
  emptyTitle,
  emptyCta,
  onAdd,
  onDelete,
}: {
  items: Item[];
  emptyTitle: string;
  emptyCta: string;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  if (!items.length) {
    return (
      <EmptyState title={emptyTitle} ctaLabel={emptyCta} onCta={onAdd} />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={onAdd}>Add</Button>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 border border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          data-cursor="data"
        >
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{item.subtitle}</p>
            <p className="mt-1 text-lg">{item.title}</p>
            {item.meta ? (
              <p className="mt-1 text-xs text-[var(--text-muted)]">{item.meta}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <p className="display text-2xl">{formatINR(item.amount)}</p>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="text-xs text-[var(--danger)]"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

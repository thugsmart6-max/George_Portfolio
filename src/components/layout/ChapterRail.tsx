"use client";

import { scrollToId } from "@/lib/scroll-to-id";

type Item = { id: string; label: string };

export function ChapterRail({ items }: { items: Item[] }) {
  if (!items.length) return null;

  return (
    <aside className="pointer-events-none fixed bottom-8 left-5 z-30 hidden 2xl:block">
      <nav className="pointer-events-auto space-y-2 border border-[var(--border)] bg-[var(--bg-primary)]/90 p-3 backdrop-blur-sm">
        <p className="px-1 pb-1 font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)]">
          ON PAGE
        </p>
        {items.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              window.history.replaceState(null, "", `#${item.id}`);
              scrollToId(item.id);
            }}
            className="flex items-center gap-3 px-1 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

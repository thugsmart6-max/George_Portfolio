"use client";

import { useMemo, useState } from "react";
import { formatINR } from "@/lib/utils";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
const COLS = 12;
const MAX_HOLD = 6;

type Plot = {
  id: string;
  row: string;
  col: number;
  price: number;
  sold: boolean;
};

function plotPrice(row: string, col: number) {
  const rowIdx = ROWS.indexOf(row as (typeof ROWS)[number]);
  const base = 9_50_000 - rowIdx * 55_000 + col * 12_000;
  return Math.round(base / 5_000) * 5_000;
}

function isSold(row: string, col: number) {
  return (row.charCodeAt(0) * 13 + col * 7) % 11 === 0;
}

function buildPlots(): Plot[] {
  return ROWS.flatMap((row) =>
    Array.from({ length: COLS }, (_, i) => {
      const col = i + 1;
      return {
        id: `${row}${col}`,
        row,
        col,
        price: plotPrice(row, col),
        sold: isSold(row, col),
      };
    })
  );
}

const PLOTS = buildPlots();

export function PlotTicketMarket() {
  const [held, setHeld] = useState<string[]>([]);

  const selected = useMemo(
    () => PLOTS.filter((p) => held.includes(p.id)),
    [held]
  );
  const total = selected.reduce((sum, p) => sum + p.price, 0);
  const listed = PLOTS.filter((p) => !p.sold).length;

  function toggle(plot: Plot) {
    if (plot.sold) return;
    setHeld((prev) => {
      if (prev.includes(plot.id)) return prev.filter((id) => id !== plot.id);
      if (prev.length >= MAX_HOLD) return prev;
      return [...prev, plot.id];
    });
  }

  return (
    <div className="overflow-hidden border border-[var(--border)]">
      <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--accent-2)]">
                Plot selling · like tickets
              </p>
              <h3 className="display mt-2 text-3xl uppercase md:text-4xl">
                Land like a stock
              </h3>
            </div>
            <p className="font-mono text-[11px] text-[var(--text-muted)]">
              {listed} listed · {PLOTS.length - listed} sold
            </p>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Intermediating work: pick plots the way you pick theatre seats.
            Front rows sit on the road frontage. Prices tick like a listing —
            educational mock, not a live exchange.
          </p>

          <div className="mt-8 overflow-x-auto pb-2">
            <div className="mx-auto min-w-[520px] max-w-3xl">
              <div className="mb-6 h-2 rounded-full bg-[var(--text-primary)]" />
              <p className="mb-4 text-center text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
                Road frontage
              </p>

              <div className="space-y-1.5">
                {ROWS.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 font-mono text-[11px] text-[var(--text-muted)]">
                      {row}
                    </span>
                    <div className="grid flex-1 grid-cols-12 gap-1">
                      {PLOTS.filter((p) => p.row === row).map((plot) => {
                        const on = held.includes(plot.id);
                        return (
                          <button
                            key={plot.id}
                            type="button"
                            disabled={plot.sold}
                            onClick={() => toggle(plot)}
                            title={`${plot.id} · ${formatINR(plot.price, true)}${plot.sold ? " · sold" : ""}`}
                            className={`aspect-square rounded-[3px] text-[8px] font-semibold transition-all sm:text-[9px] ${
                              plot.sold
                                ? "cursor-not-allowed bg-[var(--border)] text-[var(--text-muted)]"
                                : on
                                  ? "bg-[var(--accent-2)] text-white"
                                  : "bg-[var(--surface-solid)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-[#0a0708]"
                            }`}
                            aria-pressed={on}
                            aria-label={`Plot ${plot.id}, ${formatINR(plot.price)}`}
                          >
                            {plot.col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-6 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--surface-solid)]" />
                  Listed
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--accent-2)]" />
                  Held
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--border)]" />
                  Sold
                </li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="border-t border-[var(--border)] bg-[var(--bg-secondary)]/70 p-4 sm:p-6 lg:border-l lg:border-t-0">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--text-muted)]">
            Ticket slip
          </p>
          {selected.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--text-secondary)]">
              Tap a listed plot. Hold up to {MAX_HOLD} parcels — same muscle
              memory as booking seats.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {selected.map((plot) => (
                <li
                  key={plot.id}
                  className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] pb-2 text-sm"
                >
                  <span className="font-mono">{plot.id}</span>
                  <span className="tabular-nums">
                    {formatINR(plot.price, true)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 border-t border-[var(--border)] pt-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Basket
            </p>
            <p className="display mt-2 text-3xl tabular-nums md:text-4xl">
              {formatINR(total)}
            </p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {selected.length === 1 ? "1 plot" : `${selected.length} plots`} ·
              demo only
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

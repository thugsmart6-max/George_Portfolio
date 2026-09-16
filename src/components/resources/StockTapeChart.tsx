"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatNsePrice } from "@/lib/nse-format";

export type TapeBar = {
  t: number;
  time: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

const RANGES = [
  { id: "1M", days: 32 },
  { id: "3M", days: 95 },
  { id: "6M", days: 190 },
  { id: "1Y", days: 370 },
  { id: "2Y", days: 800 },
] as const;

type Series = (number | null)[];

function lineOf(
  values: (number | null)[],
  x: (i: number) => number,
  y: (n: number) => number
) {
  return values
    .map((n, i) => (n != null ? `${x(i)},${y(n)}` : null))
    .filter(Boolean)
    .join(" ");
}

export function StockTapeChart({
  bars,
  sma50,
  sma200,
  ema50,
  bbUpper,
  bbMid,
  bbLower,
  supports = [],
  resistances = [],
}: {
  bars: TapeBar[];
  sma50: Series;
  sma200: Series;
  ema50?: Series;
  bbUpper?: Series;
  bbMid?: Series;
  bbLower?: Series;
  supports?: number[];
  resistances?: number[];
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("1Y");
  const [hover, setHover] = useState<number | null>(null);
  const [showEma, setShowEma] = useState(false);
  const [showBb, setShowBb] = useState(false);
  const [showSr, setShowSr] = useState(false);

  const view = useMemo(() => {
    const spec = RANGES.find((r) => r.id === range) ?? RANGES[3];
    const from = Date.now() - spec.days * 24 * 60 * 60 * 1000;
    const mapped = bars.map((bar, i) => ({
      bar,
      sma50: sma50[i] ?? null,
      sma200: sma200[i] ?? null,
      ema50: ema50?.[i] ?? null,
      bbUpper: bbUpper?.[i] ?? null,
      bbMid: bbMid?.[i] ?? null,
      bbLower: bbLower?.[i] ?? null,
    }));
    const sliced = mapped.filter((row) => row.bar.t >= from);
    return sliced.length ? sliced : mapped;
  }, [bars, range, sma50, sma200, ema50, bbUpper, bbMid, bbLower]);

  if (view.length < 2) {
    return (
      <div className="flex h-56 items-center border border-dashed border-[var(--border)] px-4 text-sm text-[var(--text-muted)]">
        Insufficient historical data
      </div>
    );
  }

  const w = 920;
  const h = 280;
  const volH = 56;
  const prices = view.flatMap((row) => {
    const pack = [row.bar.c, row.sma50, row.sma200];
    if (showEma) pack.push(row.ema50);
    if (showBb) pack.push(row.bbUpper, row.bbMid, row.bbLower);
    return pack.filter((n): n is number => n != null);
  });
  if (showSr) prices.push(...supports, ...resistances);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const volMax = Math.max(...view.map((row) => row.bar.v), 1);
  const x = (i: number) => (i / (view.length - 1)) * w;
  const y = (price: number) => 12 + ((max - price) / span) * (h - 28);
  const priceLine = view.map((row, i) => `${x(i)},${y(row.bar.c)}`).join(" ");
  const sma50Line = lineOf(
    view.map((r) => r.sma50),
    x,
    y
  );
  const sma200Line = lineOf(
    view.map((r) => r.sma200),
    x,
    y
  );
  const emaLine = showEma
    ? lineOf(
        view.map((r) => r.ema50),
        x,
        y
      )
    : "";
  const bbUpperLine = showBb
    ? lineOf(
        view.map((r) => r.bbUpper),
        x,
        y
      )
    : "";
  const bbMidLine = showBb
    ? lineOf(
        view.map((r) => r.bbMid),
        x,
        y
      )
    : "";
  const bbLowerLine = showBb
    ? lineOf(
        view.map((r) => r.bbLower),
        x,
        y
      )
    : "";
  const active = hover != null ? view[hover] : view[view.length - 1];
  const up = active.bar.c >= (view[Math.max(0, (hover ?? view.length - 1) - 1)]?.bar.c ?? active.bar.c);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            NSE tape · Alice Blue
          </p>
          <p className="mt-1 font-mono text-sm">
            {formatNsePrice(active.bar.c)}
            <span className="ml-2 text-[var(--text-muted)]">
              {new Date(active.bar.t).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={cn(
                "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                range === item.id
                  ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 flex flex-wrap gap-1">
        {[
          { id: "ema", on: showEma, set: setShowEma, label: "EMA 50" },
          { id: "bb", on: showBb, set: setShowBb, label: "Bollinger" },
          { id: "sr", on: showSr, set: setShowSr, label: "S / R" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => item.set((v) => !v)}
            className={cn(
              "border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
              item.on
                ? "border-[var(--accent)] text-[var(--accent-strong)]"
                : "border-[var(--border)] text-[var(--text-muted)]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h + volH + 8}`}
          className="h-64 min-w-[520px] w-full md:h-80"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - box.left) / box.width;
            setHover(Math.min(view.length - 1, Math.max(0, Math.round(ratio * (view.length - 1)))));
          }}
        >
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1="0"
              x2={w}
              y1={h * g}
              y2={h * g}
              stroke="var(--border)"
              strokeDasharray="4 6"
            />
          ))}
          {showSr
            ? supports.map((level) => (
                <line
                  key={`s-${level}`}
                  x1="0"
                  x2={w}
                  y1={y(level)}
                  y2={y(level)}
                  stroke="var(--positive)"
                  strokeDasharray="5 5"
                  opacity="0.7"
                />
              ))
            : null}
          {showSr
            ? resistances.map((level) => (
                <line
                  key={`r-${level}`}
                  x1="0"
                  x2={w}
                  y1={y(level)}
                  y2={y(level)}
                  stroke="var(--danger)"
                  strokeDasharray="5 5"
                  opacity="0.7"
                />
              ))
            : null}
          <polygon
            points={`0,${h} ${priceLine} ${w},${h}`}
            fill={up ? "var(--accent)" : "var(--danger)"}
            opacity="0.1"
          />
          <polyline points={priceLine} fill="none" stroke="var(--text-primary)" strokeWidth="2.2" />
          {sma50Line ? <polyline points={sma50Line} fill="none" stroke="var(--accent)" strokeWidth="1.4" /> : null}
          {sma200Line ? (
            <polyline points={sma200Line} fill="none" stroke="var(--accent-2)" strokeWidth="1.4" />
          ) : null}
          {emaLine ? <polyline points={emaLine} fill="none" stroke="var(--text-secondary)" strokeWidth="1.2" /> : null}
          {bbMidLine ? (
            <polyline points={bbMidLine} fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3 4" />
          ) : null}
          {bbUpperLine ? (
            <polyline points={bbUpperLine} fill="none" stroke="var(--text-muted)" strokeWidth="1" />
          ) : null}
          {bbLowerLine ? (
            <polyline points={bbLowerLine} fill="none" stroke="var(--text-muted)" strokeWidth="1" />
          ) : null}
          {hover != null ? (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1="0"
              y2={h + volH}
              stroke="var(--border-strong)"
              strokeDasharray="3 4"
            />
          ) : null}
          {view.map((row, i) => (
            <rect
              key={row.bar.t}
              x={x(i) - w / view.length / 3}
              y={h + 8 + (1 - row.bar.v / volMax) * volH}
              width={Math.max(1.2, w / view.length / 1.8)}
              height={(row.bar.v / volMax) * volH}
              fill="var(--border-strong)"
              opacity="0.55"
            />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        <span>Price</span>
        <span className="text-[var(--accent)]">SMA 50</span>
        <span className="text-[var(--accent-2)]">SMA 200</span>
        <span>Volume</span>
      </div>
    </div>
  );
}

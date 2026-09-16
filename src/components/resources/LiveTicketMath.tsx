"use client";

import { useMemo, useState } from "react";
import type { AliceHolding } from "@/lib/alice-types";
import { formatINR } from "@/lib/utils";
import {
  formatNsePct,
  formatNsePrice,
  type NseQuote,
} from "@/lib/nse-format";

const SCENARIOS = [-2, -1, 1, 2] as const;

export function sharesForCapital(
  capital: number,
  ltp: number,
  lotSize: number | null | undefined,
  qtyOverride: number | null
) {
  if (qtyOverride != null && qtyOverride > 0) return Math.floor(qtyOverride);
  if (!(ltp > 0) || !(capital > 0)) return 0;
  const raw = Math.floor(capital / ltp);
  const lot = lotSize && lotSize > 1 ? Math.floor(lotSize) : 1;
  return Math.floor(raw / lot) * lot;
}

export function LiveTicketMath({
  quote,
  holding = null,
  aliceConnected = false,
}: {
  quote: NseQuote | null;
  holding?: AliceHolding | null;
  aliceConnected?: boolean;
}) {
  const [capital, setCapital] = useState(100000);
  const [qtyOverride, setQtyOverride] = useState("");
  const [stopPct, setStopPct] = useState(5);

  const ltp = quote?.price ?? null;
  const parsedQty = qtyOverride.trim() ? Number(qtyOverride) : null;
  const qty =
    parsedQty != null && Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : null;

  const math = useMemo(() => {
    if (ltp == null || ltp <= 0) return null;
    const shares = sharesForCapital(capital, ltp, quote?.lotSize, qty);
    const cost = shares * ltp;
    const unused = capital - cost;
    const prev = quote?.previousClose ?? null;
    const dayPnl = prev != null ? shares * (ltp - prev) : null;
    const high = quote?.fiftyTwoWeekHigh ?? null;
    const low = quote?.fiftyTwoWeekLow ?? null;
    const rangePct =
      high != null && low != null && high !== low ? ((ltp - low) / (high - low)) * 100 : quote?.rangePct ?? null;
    const stop = ltp * (1 - stopPct / 100);
    const risk = shares * (ltp - stop);
    const scenarios = SCENARIOS.map((pct) => {
      const price = ltp * (1 + pct / 100);
      return { pct, price, pnl: shares * (price - ltp) };
    });
    return { shares, cost, unused, dayPnl, rangePct, stop, risk, scenarios };
  }, [capital, ltp, qty, quote?.lotSize, quote?.previousClose, quote?.fiftyTwoWeekHigh, quote?.fiftyTwoWeekLow, quote?.rangePct, stopPct]);

  return (
    <section className="ig-panel border-t border-[var(--border)]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2.5 text-sm font-semibold tracking-wide">
            <span className="ig-badge">Live</span>
            Ticket math
          </p>
          <p className="mt-1 max-w-xl text-xs text-[var(--text-muted)]">
            Classroom sizing from Alice LTP. Not an order, not advice.
          </p>
        </div>
        {quote?.symbol ? (
          <p className="font-mono text-[11px] tracking-[0.14em] text-[var(--text-muted)]">
            NSE {quote.symbol}
          </p>
        ) : null}
      </div>

      {!aliceConnected ? (
        <p className="border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          Connect Alice Blue above to mark this ticket to live LTP. Inputs stay here so you can still sketch size.
        </p>
      ) : null}

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-4">
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Capital (₹)
            </span>
            <input
              type="number"
              min={0}
              step={1000}
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value) || 0)}
              className="focus-ring w-full border-b border-[var(--border-strong)] bg-transparent px-0 py-3 text-base"
            />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Quantity override
            </span>
            <input
              type="number"
              min={0}
              step={1}
              placeholder="Leave blank to size from capital"
              value={qtyOverride}
              onChange={(e) => setQtyOverride(e.target.value)}
              className="focus-ring w-full border-b border-[var(--border-strong)] bg-transparent px-0 py-3 text-base"
            />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Stop distance %
            </span>
            <input
              type="number"
              min={0.5}
              max={50}
              step={0.5}
              value={stopPct}
              onChange={(e) => setStopPct(Number(e.target.value) || 0)}
              className="focus-ring w-full border-b border-[var(--border-strong)] bg-transparent px-0 py-3 text-base"
            />
          </label>
        </div>

        {ltp == null || !math ? (
          <p className="self-center text-sm text-[var(--text-muted)]">
            No LTP yet — search a name and wait for the Alice sheet.
          </p>
        ) : (
          <dl className="grid grid-cols-2 gap-px bg-[var(--border)]">
            <Stat label="LTP" value={formatNsePrice(ltp)} />
            <Stat label="Shares" value={math.shares.toLocaleString("en-IN")} />
            <Stat label="Ticket cost" value={formatINR(Math.round(math.cost))} />
            <Stat label="Unused cash" value={formatINR(Math.round(math.unused))} />
            <Stat
              label="Day P&L on ticket"
              value={math.dayPnl == null ? "—" : formatINR(Math.round(math.dayPnl))}
              tone={math.dayPnl == null ? undefined : math.dayPnl >= 0 ? "up" : "down"}
            />
            <Stat label="52-week place" value={formatNsePct(math.rangePct)} />
            <Stat label="Stop" value={formatNsePrice(math.stop)} />
            <Stat label="Rupee risk" value={formatINR(Math.round(math.risk))} />
          </dl>
        )}
      </div>

      {math ? (
        <div className="mt-6 overflow-x-auto">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Move from LTP
          </p>
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <th className="py-2 font-medium">Move</th>
                <th className="py-2 font-medium">Price</th>
                <th className="py-2 font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {math.scenarios.map((row) => (
                <tr key={row.pct} className="border-b border-[var(--border)]">
                  <td className="py-2 font-mono">{row.pct > 0 ? `+${row.pct}%` : `${row.pct}%`}</td>
                  <td className="py-2">{formatNsePrice(row.price)}</td>
                  <td className={row.pnl >= 0 ? "py-2 text-[var(--positive)]" : "py-2 text-[var(--danger)]"}>
                    {formatINR(Math.round(row.pnl))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {holding && holding.qty > 0 ? (
        <div className="mt-6 border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Book vs this ticket
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <p className="text-sm">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Held</span>
              {holding.qty.toLocaleString("en-IN")} @ {formatNsePrice(holding.buy)}
            </p>
            <p className="text-sm">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Book P&L</span>
              <span className={holding.pnl >= 0 ? "text-[var(--positive)]" : "text-[var(--danger)]"}>
                {formatINR(Math.round(holding.pnl))} ({formatNsePct(holding.pnlPct)})
              </span>
            </p>
            <p className="text-sm">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Hypothetical day
              </span>
              {math?.dayPnl == null ? "—" : formatINR(Math.round(math.dayPnl))}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="bg-[var(--bg-primary)] px-3 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</dt>
      <dd
        className={
          tone === "up"
            ? "mt-1 font-mono text-sm text-[var(--positive)]"
            : tone === "down"
              ? "mt-1 font-mono text-sm text-[var(--danger)]"
              : "mt-1 font-mono text-sm"
        }
      >
        {value}
      </dd>
    </div>
  );
}

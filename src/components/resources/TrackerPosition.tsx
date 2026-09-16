"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatINR, formatPercent } from "@/lib/utils";
import type { AliceHolding, AlicePortfolio, AliceQuote } from "@/lib/alice-types";
import {
  TRACKER_EVENT,
  closedPnl,
  lotCost,
  lotValue,
  markOpen,
  nseKey,
  readBook,
  symbolXirr,
  todayIso,
  writeBook,
  type ClosedLot,
  type OpenLot,
  type TrackerBook,
} from "@/lib/tracker-book";
import { TrackerLotForm } from "@/components/resources/TrackerLotForm";

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "up" | "down";
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p
        className={`mt-1 font-semibold tabular-nums ${
          tone === "down" ? "text-[var(--danger)]" : tone === "up" ? "text-[var(--positive)]" : ""
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
}

export function TrackerPosition({ symbol }: { symbol: string }) {
  const key = nseKey(symbol);
  const [book, setBook] = useState<TrackerBook>({ opens: [], closed: [] });
  const [alice, setAlice] = useState<AliceHolding | null>(null);
  const [quote, setQuote] = useState<AliceQuote | null>(null);
  const [connected, setConnected] = useState(false);

  const persist = useCallback((next: TrackerBook) => {
    setBook(next);
    writeBook(next);
  }, []);

  const load = useCallback(async () => {
    setBook(readBook());
    try {
      const statusRes = await fetch("/api/alice/status", { cache: "no-store" });
      const status = (await statusRes.json()) as { connected?: boolean };
      if (!status.connected) {
        setConnected(false);
        setAlice(null);
        setQuote(null);
        return;
      }
      setConnected(true);
      const [holdRes, quoteRes] = await Promise.all([
        fetch("/api/alice/holdings", { cache: "no-store" }),
        fetch(`/api/alice/quotes?symbols=${encodeURIComponent(key)}`, { cache: "no-store" }),
      ]);
      if (holdRes.ok) {
        const data = (await holdRes.json()) as AlicePortfolio;
        setAlice(data.holdings?.find((row) => nseKey(row.symbol) === key) ?? null);
      }
      if (quoteRes.ok) {
        const data = (await quoteRes.json()) as { quotes?: Record<string, AliceQuote> };
        setQuote(data.quotes?.[key] ?? null);
      }
    } catch {
      /* keep last */
    }
  }, [key]);

  useEffect(() => {
    void load();
    const onChange = () => setBook(readBook());
    window.addEventListener(TRACKER_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(TRACKER_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [load]);

  const opens = useMemo(
    () => book.opens.filter((lot) => lot.symbol === key).map((lot) => markOpen(lot, quote?.ltp)),
    [book.opens, key, quote?.ltp]
  );
  const closed = useMemo(
    () => book.closed.filter((lot) => lot.symbol === key),
    [book.closed, key]
  );
  const markedBook = useMemo(
    () => ({
      opens,
      closed,
    }),
    [closed, opens]
  );

  const aliceLive = Boolean(connected && alice);
  const cost = aliceLive
    ? alice!.invested
    : opens.reduce((sum, lot) => sum + lotCost(lot), 0);
  const live = aliceLive ? alice!.value : opens.reduce((sum, lot) => sum + lotValue(lot), 0);
  const qtyOpen = aliceLive ? alice!.qty : opens.reduce((sum, lot) => sum + lot.qty, 0);
  const avgBuy = aliceLive
    ? alice!.buy
    : qtyOpen
      ? (cost - opens.reduce((sum, lot) => sum + lot.fees, 0)) / qtyOpen
      : 0;
  const ltp = quote?.ltp ?? alice?.ltp ?? opens[0]?.current ?? 0;
  const pnl = live - cost;
  const pnlPct = cost ? (pnl / cost) * 100 : 0;
  const realized = closed.reduce((sum, lot) => sum + closedPnl(lot), 0);
  const irr = symbolXirr(markedBook, key);
  const name = alice?.name || opens[0]?.name || closed[0]?.name || key;

  function addLot(lot: OpenLot) {
    persist({ ...book, opens: [...book.opens, lot] });
  }

  function removeOpen(id: string) {
    persist({ ...book, opens: book.opens.filter((lot) => lot.id !== id) });
  }

  function sellOpen(lot: OpenLot) {
    const closedLot: ClosedLot = {
      id: `${lot.id}-x`,
      symbol: lot.symbol,
      name: lot.name,
      qty: lot.qty,
      buy: lot.buy,
      fees: lot.fees,
      boughtAt: lot.boughtAt,
      soldAt: todayIso(),
      sell: lot.current,
      sellFees: 0,
    };
    persist({
      opens: book.opens.filter((row) => row.id !== lot.id),
      closed: [...book.closed, closedLot],
    });
  }

  return (
    <div className="space-y-6">
      <div className="border border-[var(--border)]">
        <div className="border-b border-[var(--border)] px-5 py-5 md:px-8">
          <p className="font-medium">
            {name} <span className="font-mono text-[11px] text-[var(--text-muted)]">{key}</span>
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {aliceLive
              ? "Live qty from Alice Blue. Typed lots on this name are kept for dates/XIRR and not added to the live book."
              : "Browser lots for this name. Connect Alice to mark LTP."}
          </p>
        </div>
        <div className="grid gap-4 bg-[var(--bg-secondary)]/60 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          <Stat label="Qty" value={qtyOpen ? String(qtyOpen) : "—"} />
          <Stat label="Avg buy" value={qtyOpen ? formatINR(avgBuy) : "—"} />
          <Stat
            label="LTP"
            value={
              ltp
                ? ltp.toLocaleString("en-IN", { maximumFractionDigits: 2 })
                : "—"
            }
            hint={
              quote?.changePct != null ? `Today ${formatPercent(quote.changePct)}` : "Tape when Alice is connected"
            }
            tone={
              quote?.changePct == null ? undefined : quote.changePct < 0 ? "down" : "up"
            }
          />
          <Stat label="Invested" value={cost ? formatINR(Math.round(cost)) : "—"} />
          <Stat label="Live value" value={live ? formatINR(Math.round(live)) : "—"} />
          <Stat
            label={pnl < 0 ? "Unrealized loss" : "Unrealized profit"}
            value={cost ? `${formatINR(Math.round(pnl))} · ${formatPercent(pnlPct)}` : "—"}
            tone={pnl < 0 ? "down" : pnl > 0 ? "up" : undefined}
          />
          <Stat
            label="Realized"
            value={formatINR(Math.round(realized))}
            hint={closed.length ? `${closed.length} closed lot${closed.length === 1 ? "" : "s"}` : "No sells yet"}
            tone={realized < 0 ? "down" : realized > 0 ? "up" : undefined}
          />
          <Stat
            label="XIRR"
            value={irr == null ? "—" : formatPercent(irr * 100)}
            hint={
              irr == null
                ? "Alice holdings have no buy date. Add dated lots for this name."
                : "From dated lots in this browser"
            }
            tone={irr == null ? undefined : irr < 0 ? "down" : "up"}
          />
        </div>
        <div className="flex flex-wrap gap-4 border-t border-[var(--border)] px-5 py-3 md:px-8">
          <Link
            href={`/resources/analysis?stock=${encodeURIComponent(key)}`}
            className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]"
            data-cursor="link"
          >
            Analysis
          </Link>
          <Link
            href="/resources/tracker"
            className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]"
            data-cursor="link"
          >
            All names
          </Link>
        </div>
      </div>

      <div className="border border-[var(--border)]">
        <div className="border-b border-[var(--border)] px-5 py-4 md:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Dated lots
          </p>
        </div>
        <TrackerLotForm
          lockedSymbol={key}
          submitLabel={`Add lot on ${key}`}
          onAdd={addLot}
        />
        {opens.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)] md:p-8">No dated lots on this name yet.</p>
        ) : (
          <ul>
            {opens.map((lot) => {
              const lotPnl = lotValue(lot) - lotCost(lot);
              return (
                <li key={lot.id} className="border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {lot.qty} @ {formatINR(lot.buy)}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                        Bought {lot.boughtAt}
                        {lot.fees ? ` · fees ${formatINR(lot.fees)}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={
                          lotPnl < 0
                            ? "font-mono text-[11px] text-[var(--danger)]"
                            : "font-mono text-[11px] text-[var(--positive)]"
                        }
                      >
                        {formatINR(Math.round(lotPnl))}
                      </span>
                      <button
                        type="button"
                        className="text-[10px] uppercase tracking-[0.16em]"
                        onClick={() => sellOpen(lot)}
                      >
                        Sell @ LTP
                      </button>
                      <button
                        type="button"
                        className="text-[10px] uppercase tracking-[0.16em] text-[var(--danger)]"
                        onClick={() => removeOpen(lot.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {closed.length ? (
        <div className="border border-[var(--border)]">
          <div className="border-b border-[var(--border)] px-5 py-4 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Closed lots
            </p>
          </div>
          <ul>
            {closed.map((lot) => {
              const lotPnl = closedPnl(lot);
              return (
                <li key={lot.id} className="border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:px-8">
                  <p className="font-medium">
                    {lot.qty} sold @ {formatINR(lot.sell)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                    {lot.boughtAt} → {lot.soldAt} · {formatINR(Math.round(lotPnl))}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

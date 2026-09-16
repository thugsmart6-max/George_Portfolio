"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { formatINR, formatPercent } from "@/lib/utils";
import type { AliceFunds, AliceHolding, AlicePortfolio, AliceQuote } from "@/lib/alice-types";
import {
  TRACKER_EVENT,
  bookXirr,
  closedPnl,
  lotCost,
  lotValue,
  markOpen,
  nseKey,
  readBook,
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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[var(--border)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
      {children}
    </span>
  );
}

export function TrackerDesk() {
  const [book, setBook] = useState<TrackerBook>({ opens: [], closed: [] });
  const [ready, setReady] = useState(false);
  const [holdings, setHoldings] = useState<AliceHolding[]>([]);
  const [funds, setFunds] = useState<AliceFunds | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, AliceQuote>>({});
  const [nifty, setNifty] = useState<AliceQuote | null>(null);

  const persist = useCallback((next: TrackerBook) => {
    setBook(next);
    writeBook(next);
  }, []);

  const refreshLocal = useCallback(() => {
    setBook(readBook());
  }, []);

  const loadAlice = useCallback(async (spin = true) => {
    if (spin) setLoading(true);
    setError(null);
    try {
      const statusRes = await fetch("/api/alice/status", { cache: "no-store" });
      const status = (await statusRes.json()) as { connected?: boolean };
      if (!status.connected) {
        setConnected(false);
        setHoldings([]);
        setFunds(null);
        setQuotes({});
        setNifty(null);
        return;
      }
      setConnected(true);
      const res = await fetch("/api/alice/holdings", { cache: "no-store" });
      const data = (await res.json()) as AlicePortfolio & { error?: string };
      if (!res.ok) {
        if (res.status === 401) setConnected(false);
        setError(data.error || "Could not load Alice Blue holdings.");
        setHoldings([]);
        return;
      }
      setHoldings(data.holdings ?? []);
      setFunds(data.funds ?? null);
    } catch {
      setError("Could not load Alice Blue holdings.");
    } finally {
      if (spin) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLocal();
    setReady(true);
    void loadAlice();
    const onChange = () => refreshLocal();
    window.addEventListener(TRACKER_EVENT, onChange);
    window.addEventListener("storage", onChange);
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        refreshLocal();
        void loadAlice(false);
      }
    }, 45_000);
    return () => {
      window.removeEventListener(TRACKER_EVENT, onChange);
      window.removeEventListener("storage", onChange);
      window.clearInterval(timer);
    };
  }, [loadAlice, refreshLocal]);

  const aliceSymbols = useMemo(
    () => new Set(holdings.map((row) => nseKey(row.symbol))),
    [holdings]
  );

  const markedOpens = useMemo(
    () => book.opens.map((lot) => markOpen(lot, quotes[lot.symbol]?.ltp)),
    [book.opens, quotes]
  );

  const browserOpens = useMemo(() => {
    if (!connected) return markedOpens;
    return markedOpens.filter((lot) => !aliceSymbols.has(lot.symbol));
  }, [aliceSymbols, connected, markedOpens]);

  const markSymbols = useMemo(() => {
    const keys = [...book.opens.map((lot) => lot.symbol), ...holdings.map((row) => nseKey(row.symbol))];
    return [...new Set(keys.filter(Boolean))];
  }, [book.opens, holdings]);

  const markKey = markSymbols.join(",");

  useEffect(() => {
    if (!connected) return;
    let gone = false;
    async function mark() {
      try {
        const list = ["NIFTY", ...markSymbols].slice(0, 12).join(",");
        const res = await fetch(`/api/alice/quotes?symbols=${encodeURIComponent(list)}`, {
          cache: "no-store",
        });
        if (!res.ok || gone) return;
        const data = (await res.json()) as { quotes?: Record<string, AliceQuote> };
        const next = data.quotes ?? {};
        setQuotes(next);
        setNifty(next.NIFTY ?? next.NIFTY50 ?? null);
      } catch {
        /* keep last */
      }
    }
    void mark();
    return () => {
      gone = true;
    };
  }, [connected, markKey]);

  const aliceInvested = holdings.reduce((sum, row) => sum + row.invested, 0);
  const aliceLive = holdings.reduce((sum, row) => sum + row.value, 0);
  const browserInvested = browserOpens.reduce((sum, lot) => sum + lotCost(lot), 0);
  const browserLive = browserOpens.reduce((sum, lot) => sum + lotValue(lot), 0);
  const invested = aliceInvested + browserInvested;
  const live = aliceLive + browserLive;
  const unrealized = live - invested;
  const realized = book.closed.reduce((sum, lot) => sum + closedPnl(lot), 0);
  const absPct = invested ? (unrealized / invested) * 100 : 0;
  const irr = bookXirr({ opens: markedOpens, closed: book.closed });

  const dayPnl = [...holdings, ...browserOpens.map((lot) => ({
    symbol: lot.symbol,
    value: lotValue(lot),
  }))].reduce((sum, row) => {
    const q = quotes[nseKey(row.symbol)];
    if (q?.changePct == null) return sum;
    return sum + row.value * (q.changePct / 100);
  }, 0);

  const empty = invested <= 0 && live <= 0 && book.closed.length === 0;

  const positions = useMemo(() => {
    const map = new Map<
      string,
      {
        symbol: string;
        name: string;
        source: "alice" | "browser";
        qty: number;
        buy: number;
        ltp: number;
        invested: number;
        value: number;
        pnl: number;
        pnlPct: number;
      }
    >();
    for (const row of holdings) {
      map.set(nseKey(row.symbol), {
        symbol: nseKey(row.symbol),
        name: row.name,
        source: "alice",
        qty: row.qty,
        buy: row.buy,
        ltp: row.ltp,
        invested: row.invested,
        value: row.value,
        pnl: row.pnl,
        pnlPct: row.pnlPct,
      });
    }
    const bySym = new Map<string, OpenLot[]>();
    for (const lot of browserOpens) {
      const list = bySym.get(lot.symbol) ?? [];
      list.push(lot);
      bySym.set(lot.symbol, list);
    }
    for (const [symbol, lots] of bySym) {
      if (map.has(symbol)) continue;
      const qty = lots.reduce((s, l) => s + l.qty, 0);
      const cost = lots.reduce((s, l) => s + lotCost(l), 0);
      const value = lots.reduce((s, l) => s + lotValue(l), 0);
      const buy = qty ? (cost - lots.reduce((s, l) => s + l.fees, 0)) / qty : 0;
      const pnl = value - cost;
      map.set(symbol, {
        symbol,
        name: lots[0].name,
        source: "browser",
        qty,
        buy,
        ltp: lots[0].current,
        invested: cost,
        value,
        pnl,
        pnlPct: cost ? (pnl / cost) * 100 : 0,
      });
    }
    return [...map.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [browserOpens, holdings]);

  function addLot(lot: OpenLot) {
    persist({ ...book, opens: [...book.opens, lot] });
  }

  function removeOpen(id: string) {
    persist({ ...book, opens: book.opens.filter((lot) => lot.id !== id) });
  }

  function sellOpen(lot: OpenLot, sell: number) {
    if (sell < 0) return;
    const closed: ClosedLot = {
      id: `${lot.id}-x`,
      symbol: lot.symbol,
      name: lot.name,
      qty: lot.qty,
      buy: lot.buy,
      fees: lot.fees,
      boughtAt: lot.boughtAt,
      soldAt: todayIso(),
      sell,
      sellFees: 0,
    };
    persist({
      opens: book.opens.filter((row) => row.id !== lot.id),
      closed: [...book.closed, closed],
    });
  }

  const fundsBits = [
    funds?.tradingLimit != null ? `Limit ${formatINR(Math.round(funds.tradingLimit))}` : null,
    funds?.openingCash != null ? `Cash ${formatINR(Math.round(funds.openingCash))}` : null,
    funds?.collateral != null ? `Collateral ${formatINR(Math.round(funds.collateral))}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="border border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 md:px-8">
          <div className="flex flex-wrap gap-2">
            <Chip>{connected ? "Live tape" : "Waiting for Alice"}</Chip>
            <Chip>NSE equity</Chip>
            <Chip>
              {positions.length} name{positions.length === 1 ? "" : "s"}
            </Chip>
          </div>
          <button
            type="button"
            onClick={() => void loadAlice()}
            className="btn-ghost btn-no-arrow px-3 py-2 text-[10px]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {empty ? (
          <p className="px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">
            Connect Alice Blue or add a dated lot. One book: invested, live value, and P&amp;L from qty ×
            price. XIRR only when buy dates exist on typed lots.
          </p>
        ) : (
          <div className="grid gap-4 bg-[var(--bg-secondary)]/60 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
            <Stat label="Invested" value={formatINR(Math.round(invested))} />
            <Stat label="Live book" value={formatINR(Math.round(live))} />
            <Stat
              label={unrealized < 0 ? "Unrealized loss" : "Unrealized profit"}
              value={`${formatINR(Math.round(unrealized))} · ${formatPercent(absPct)}`}
              tone={unrealized < 0 ? "down" : unrealized > 0 ? "up" : undefined}
            />
            <Stat
              label="Realized"
              value={formatINR(Math.round(realized))}
              hint={book.closed.length ? `${book.closed.length} closed lot${book.closed.length === 1 ? "" : "s"}` : "No sells yet"}
              tone={realized < 0 ? "down" : realized > 0 ? "up" : undefined}
            />
            <Stat
              label="XIRR"
              value={irr == null ? "—" : formatPercent(irr * 100)}
              hint={irr == null ? "Needs dated lots in this browser" : "Typed lots only"}
              tone={irr == null ? undefined : irr < 0 ? "down" : "up"}
            />
            <Stat
              label="Today (tape)"
              value={
                connected && Number.isFinite(dayPnl) && Object.keys(quotes).length
                  ? formatINR(Math.round(dayPnl))
                  : "—"
              }
              hint="From Alice LTP vs previous close"
              tone={dayPnl < 0 ? "down" : dayPnl > 0 ? "up" : undefined}
            />
            <Stat
              label="Nifty 50"
              value={
                nifty?.ltp != null
                  ? nifty.ltp.toLocaleString("en-IN", { maximumFractionDigits: 2 })
                  : "—"
              }
              hint={
                nifty?.changePct != null
                  ? `${formatPercent(nifty.changePct)} today · classroom, not since you bought`
                  : "Connect Alice to quote the index"
              }
              tone={
                nifty?.changePct == null ? undefined : nifty.changePct < 0 ? "down" : "up"
              }
            />
            <Stat
              label="Cash / limit"
              value={fundsBits[0] ?? "—"}
              hint={fundsBits.slice(1).join(" · ") || "From Alice funds, if connected"}
            />
          </div>
        )}
        <p className="border-t border-[var(--border)] px-5 py-3 text-[11px] text-[var(--text-muted)] md:px-8">
          Alice names win when both books have the same symbol (no double count). Typed lots stay in this
          browser. Not tax, not SEBI advice.
        </p>
        {error ? <p className="px-5 py-3 text-sm text-[var(--danger)] md:px-8">{error}</p> : null}
      </div>

      <div className="border border-[var(--border)]">
        <div className="border-b border-[var(--border)] px-5 py-4 md:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Positions
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Open a name for lots, XIRR on that name, and analysis.
          </p>
        </div>
        {loading && connected && positions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">Loading live holdings…</p>
        ) : positions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">No open names yet.</p>
        ) : (
          <ul>
            {positions.map((row) => {
              const loss = row.pnl < 0;
              const q = quotes[row.symbol];
              return (
                <li
                  key={row.symbol}
                  className="border-b border-[var(--border)] px-5 py-5 last:border-b-0 md:px-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="min-w-0 break-words font-medium">
                        {row.name}{" "}
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">{row.symbol}</span>
                      </p>
                      <p className="mt-1 break-words font-mono text-[11px] text-[var(--text-muted)]">
                        {row.qty} × avg {formatINR(row.buy)} · LTP{" "}
                        {row.ltp.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ·{" "}
                        {row.source === "alice" ? "Alice" : "Browser lot"}
                        {q?.changePct != null ? ` · day ${formatPercent(q.changePct)}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/resources/tracker/${encodeURIComponent(row.symbol)}`}
                        className="inline-flex min-h-11 items-center px-1 text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]"
                        data-cursor="link"
                      >
                        Holding
                      </Link>
                      <Link
                        href={`/resources/analysis?stock=${encodeURIComponent(row.symbol)}`}
                        className="inline-flex min-h-11 items-center px-1 text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]"
                        data-cursor="link"
                      >
                        Analysis
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Stat label="Invested" value={formatINR(Math.round(row.invested))} />
                    <Stat label="Live value" value={formatINR(Math.round(row.value))} />
                    <Stat
                      label={loss ? "Unrealized loss" : "Unrealized profit"}
                      value={`${formatINR(Math.round(row.pnl))} · ${formatPercent(row.pnlPct)}`}
                      tone={loss ? "down" : "up"}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border border-[var(--border)]">
        <TrackerLotForm submitLabel="Add lot" onAdd={addLot} />
        <p className="border-b border-[var(--border)] px-5 py-3 text-xs text-[var(--text-secondary)] md:px-8">
          If Alice already holds the name, this lot is kept as history but not double-counted in the live book.
        </p>
        {!ready || markedOpens.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)] md:p-8">No browser lots yet.</p>
        ) : (
          <ul>
            {markedOpens.map((lot) => {
              const pnl = lotValue(lot) - lotCost(lot);
              const skipped = connected && aliceSymbols.has(lot.symbol);
              return (
                <li key={lot.id} className="border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{lot.symbol}</p>
                      <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                        {lot.qty} @ {formatINR(lot.buy)} · {lot.boughtAt}
                        {lot.fees ? ` · fees ${formatINR(lot.fees)}` : ""}
                        {skipped ? " · Alice already counts this name" : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={pnl < 0 ? "font-mono text-[11px] text-[var(--danger)]" : "font-mono text-[11px] text-[var(--positive)]"}
                      >
                        {formatINR(Math.round(pnl))}
                      </span>
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.16em]"
                        onClick={() => sellOpen(lot, lot.current)}
                      >
                        Sell @ LTP
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.16em] text-[var(--danger)]"
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

      {book.closed.length ? (
        <div className="border border-[var(--border)]">
          <div className="border-b border-[var(--border)] px-5 py-4 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Closed lots
            </p>
          </div>
          <ul>
            {book.closed.map((lot) => {
              const pnl = closedPnl(lot);
              return (
                <li key={lot.id} className="border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:px-8">
                  <p className="font-medium">
                    {lot.symbol} · {lot.qty} sold @ {formatINR(lot.sell)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                    {lot.boughtAt} → {lot.soldAt} · {formatINR(Math.round(pnl))}
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

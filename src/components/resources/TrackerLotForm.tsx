"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatINR, formatPercent } from "@/lib/utils";
import type { AliceSearchHit } from "@/lib/alice-types";
import { nseTicker, parseAmount, stripLeadingZeros } from "@/lib/nse-symbol";
import { money, todayIso, type OpenLot } from "@/lib/tracker-book";

export type TapeLookup = {
  symbol: string;
  name: string;
  ltp: number | null;
  ltpSource: "alice-blue" | "screener" | null;
  changePct: number | null;
  pe: number | null;
  marketCapCr: number | null;
  connected: boolean;
  url: string | null;
  error?: string;
};

function cleanAmountText(raw: string) {
  return stripLeadingZeros(raw.replace(/,/g, ""));
}

function AmountField({
  label,
  value,
  onValue,
}: {
  label: string;
  value: string;
  onValue: (text: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onValue(cleanAmountText(e.target.value))}
        onBlur={() => {
          if (!value.trim()) {
            onValue("");
            return;
          }
          onValue(String(parseAmount(value)));
        }}
        className="min-h-11 w-full border-b border-[var(--border-strong)] bg-transparent py-2.5 text-base outline-none"
      />
    </label>
  );
}

function formatPx(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function TrackerLotForm({
  lockedSymbol,
  submitLabel,
  onAdd,
}: {
  lockedSymbol?: string;
  submitLabel: string;
  onAdd: (lot: OpenLot) => void;
}) {
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [symbolText, setSymbolText] = useState(lockedSymbol ?? "");
  const [qtyText, setQtyText] = useState("100");
  const [buyText, setBuyText] = useState("");
  const [feesText, setFeesText] = useState("0");
  const [currentText, setCurrentText] = useState("");
  const [boughtAt, setBoughtAt] = useState(todayIso());
  const [tape, setTape] = useState<TapeLookup | null>(null);
  const [looking, setLooking] = useState(false);
  const [committed, setCommitted] = useState(lockedSymbol ?? "");
  const [hits, setHits] = useState<AliceSearchHit[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [active, setActive] = useState(0);

  const key = nseTicker(lockedSymbol || committed);
  const qty = parseAmount(qtyText);
  const buy = parseAmount(buyText);
  const fees = parseAmount(feesText);
  const current = parseAmount(currentText);
  const ltp = tape?.ltp ?? null;
  const mark = current || ltp || 0;
  const cost = qty * buy + fees;
  const live = qty * mark;
  const pnl = live - cost;
  const pnlPct = cost ? (pnl / cost) * 100 : 0;

  useEffect(() => {
    setBoughtAt(todayIso());
  }, []);

  useEffect(() => {
    if (lockedSymbol) {
      setSymbolText(lockedSymbol);
      setCommitted(lockedSymbol);
    }
  }, [lockedSymbol]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setSuggestOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (lockedSymbol) return;
    const query = symbolText.trim();
    if (query.length < 1) {
      setHits([]);
      setSuggesting(false);
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      setSuggesting(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
          cache: "no-store",
        });
        const data = (await res.json()) as { results?: AliceSearchHit[] };
        if (ctrl.signal.aborted) return;
        setHits(data.results ?? []);
        setActive(0);
        setSuggestOpen(true);
      } catch {
        if (!ctrl.signal.aborted) setHits([]);
      } finally {
        if (!ctrl.signal.aborted) setSuggesting(false);
      }
    }, 180);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [lockedSymbol, symbolText]);

  useEffect(() => {
    if (!key) {
      setTape(null);
      setCurrentText("");
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      setLooking(true);
      try {
        const res = await fetch(`/api/stocks/${encodeURIComponent(key)}/lookup`, {
          cache: "no-store",
          signal: ctrl.signal,
        });
        const data = (await res.json()) as TapeLookup & { error?: string };
        if (ctrl.signal.aborted) return;
        if (!res.ok) {
          setTape({
            symbol: key,
            name: key,
            ltp: null,
            ltpSource: null,
            changePct: null,
            pe: null,
            marketCapCr: null,
            connected: false,
            url: null,
            error: data.error || "Could not look up this NSE name.",
          });
          return;
        }
        setTape(data);
        if (!currentTouched && data.ltp != null) {
          setCurrentText(String(data.ltp));
        }
      } catch {
        if (!ctrl.signal.aborted) setTape(null);
      } finally {
        if (!ctrl.signal.aborted) setLooking(false);
      }
    }, 280);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, lockedSymbol]);

  function pickSymbol(hit: AliceSearchHit) {
    const symbol = nseTicker(hit.symbol);
    setSymbolText(symbol);
    setCommitted(symbol);
    setSuggestOpen(false);
    setHits([]);
    setCurrentTouched(false);
    setTape(null);
    if (hit.ltp != null) setCurrentText(String(hit.ltp));
  }

  function addLot(e: React.FormEvent) {
    e.preventDefault();
    const symbol = nseTicker(tape?.symbol || key);
    if (!symbol || qty <= 0 || buy < 0) return;
    onAdd({
      id: `${symbol}-${Date.now()}`,
      symbol,
      name: (tape?.name || symbol).toUpperCase(),
      qty: money(qty),
      buy: money(buy),
      fees: money(fees),
      boughtAt: boughtAt || todayIso(),
      current: money(mark) || money(buy),
    });
    if (!lockedSymbol) {
      setSymbolText("");
      setCommitted("");
      setTape(null);
      setHits([]);
      setCurrentTouched(false);
      setBuyText("");
      setCurrentText("");
    }
  }

  const sourceLabel =
    tape?.ltpSource === "alice-blue"
      ? "Alice Blue LTP"
      : tape?.ltpSource === "screener"
        ? "Screener.in price"
        : looking
          ? "Looking up…"
          : "No live price yet";

  return (
    <form onSubmit={addLot}>
      <div
        className={`grid min-w-0 gap-4 border-b border-[var(--border)] p-4 sm:p-5 md:p-8 ${
          lockedSymbol ? "sm:grid-cols-2 lg:grid-cols-5 lg:items-end" : "sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
        }`}
      >
        {lockedSymbol ? null : (
          <div ref={boxRef} className="relative space-y-2 lg:col-span-2">
            <label className="block space-y-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">NSE symbol</span>
              <input
                value={symbolText}
                onChange={(e) => {
                  setSymbolText(e.target.value);
                  setCurrentTouched(false);
                  setSuggestOpen(true);
                }}
                onFocus={() => hits.length && setSuggestOpen(true)}
                onBlur={() => {
                  const next = nseTicker(symbolText);
                  setSymbolText(next);
                  if (next) setCommitted(next);
                }}
                onKeyDown={(e) => {
                  if (!suggestOpen || !hits.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => (i + 1) % hits.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => (i - 1 + hits.length) % hits.length);
                  } else if (e.key === "Enter" && hits[active]) {
                    e.preventDefault();
                    pickSymbol(hits[active]);
                  } else if (e.key === "Escape") {
                    setSuggestOpen(false);
                  }
                }}
                placeholder="INFY, HDFC…"
                aria-autocomplete="list"
                aria-controls={listId}
                aria-expanded={suggestOpen}
                autoComplete="off"
                className="min-h-11 w-full border-b border-[var(--border-strong)] bg-transparent py-2.5 text-base outline-none"
              />
            </label>
            {suggestOpen && (suggesting || hits.length > 0 || symbolText.trim().length >= 1) ? (
              <ul
                id={listId}
                role="listbox"
                className="absolute z-40 mt-1 max-h-56 w-full overflow-auto overscroll-contain border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-glow)]"
              >
                {suggesting && !hits.length ? (
                  <li className="px-4 py-3 text-sm text-[var(--text-muted)]">Searching NSE…</li>
                ) : hits.length ? (
                  hits.map((hit, i) => (
                    <li key={hit.symbol} role="option" aria-selected={i === active}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => pickSymbol(hit)}
                        className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left ${
                          i === active ? "bg-[var(--accent-dim)]" : ""
                        }`}
                      >
                        <span>
                          <span className="block min-w-0 break-words font-medium">{hit.name}</span>
                          <span className="mt-0.5 block font-mono text-[11px] text-[var(--text-muted)]">
                            {nseTicker(hit.symbol) || hit.symbol} · NSE
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[11px] tabular-nums">
                          {hit.ltp != null ? `₹${formatPx(hit.ltp)}` : "—"}
                        </span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-[var(--text-muted)]">No NSE match yet.</li>
                )}
              </ul>
            ) : null}
          </div>
        )}
        <AmountField label="Qty" value={qtyText} onValue={setQtyText} />
        <AmountField label="Buy" value={buyText} onValue={setBuyText} />
        <AmountField label="Fees" value={feesText} onValue={setFeesText} />
        <label className="block space-y-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Buy date</span>
          <input
            type="date"
            value={boughtAt}
            onChange={(e) => setBoughtAt(e.target.value)}
            className="min-h-11 w-full border-b border-[var(--border-strong)] bg-transparent py-2.5 text-base outline-none"
          />
        </label>
        <AmountField
          label="Today"
          value={currentText}
          onValue={(text) => {
            setCurrentTouched(true);
            setCurrentText(text);
          }}
        />
        <button
          type="submit"
          className={`btn-primary min-h-11 w-full px-5 py-3 text-[11px] sm:w-auto ${lockedSymbol ? "lg:col-span-5" : "lg:col-span-6"}`}
        >
          {submitLabel}
        </button>
      </div>
      <div className="border-b border-[var(--border)] px-4 py-4 text-sm text-[var(--text-secondary)] sm:px-5 md:px-8">
        {key ? (
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <p className="min-w-0 break-words">
              Stored as <span className="font-mono">{key}</span>
              {tape?.name && tape.name !== key ? ` · ${tape.name}` : ""}
              {looking ? " · fetching Alice + Screener" : ""}
              {tape?.error ? <span className="mt-2 block text-[var(--danger)]">{tape.error}</span> : null}
            </p>
            <p className="text-left sm:text-right">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Current price · {sourceLabel}
              </span>
              <span className="mt-1 block text-lg font-semibold tabular-nums text-[var(--text-primary)]">
                {ltp != null ? `₹${formatPx(ltp)}` : looking ? "…" : "—"}
              </span>
              {tape?.changePct != null ? (
                <span
                  className={
                    tape.changePct < 0 ? "text-[var(--danger)]" : tape.changePct > 0 ? "text-[var(--positive)]" : ""
                  }
                >
                  {formatPercent(tape.changePct)} today
                </span>
              ) : null}
            </p>
          </div>
        ) : (
          <p>Type a name — suggestions appear. Qty and buy drop leading zeros (0999 → 999).</p>
        )}
        {qty > 0 && buy > 0 && mark > 0 ? (
          <p
            className={`mt-2 font-medium tabular-nums ${
              pnl < 0 ? "text-[var(--danger)]" : pnl > 0 ? "text-[var(--positive)]" : ""
            }`}
          >
            {pnl < 0 ? "Loss" : pnl > 0 ? "Profit" : "Flat"} vs today: {formatINR(Math.round(pnl))}
            {cost ? ` · ${formatPercent(pnlPct)}` : ""}
            {` (${qty} × ${formatINR(buy)} vs ${formatINR(mark)})`}
          </p>
        ) : null}
      </div>
    </form>
  );
}

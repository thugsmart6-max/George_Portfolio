"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { AliceSearchHit } from "@/lib/alice-types";

const NSE_QUICK = [
  "TCS",
  "INFY",
  "RELIANCE",
  "HDFCBANK",
  "ICICIBANK",
  "KPITTECH",
  "TATAMOTORS",
  "SBIN",
];

export function StockSearch({
  initial = "",
  compact = false,
}: {
  initial?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(initial);
  const [hits, setHits] = useState<AliceSearchHit[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const typed = useRef(false);

  useEffect(() => {
    setQ(initial);
    typed.current = false;
    setOpen(false);
    setHits([]);
  }, [initial]);

  useEffect(() => {
    const query = q.trim();
    if (!typed.current || query.length < 2) {
      setHits([]);
      setNotice(null);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as { results?: AliceSearchHit[]; notice?: string };
        if (!ctrl.signal.aborted) {
          setHits(data.results ?? []);
          setNotice(data.notice ?? null);
          setActive(0);
          setOpen(true);
        }
      } catch {
        if (!ctrl.signal.aborted) setHits([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(symbol: string) {
    const stock = symbol.trim();
    if (!stock) return;
    setOpen(false);
    router.push(`/resources/analysis?stock=${encodeURIComponent(stock)}`);
  }

  return (
    <div
      className={
        compact
          ? ""
          : "border border-[var(--border)] bg-[var(--surface-elevated)] p-5 md:p-8"
      }
    >
      {compact ? null : (
        <>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            NSE only
          </p>
          <p className="display mt-2 text-2xl md:text-3xl">Search a listed name</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Any NSE equity. Connect Alice Blue — the result is calculated from that symbol’s tape, not from a stored JSON report.
          </p>
        </>
      )}
      <form
        className={compact ? "flex gap-2" : "mt-6 flex flex-col gap-3 sm:flex-row"}
        onSubmit={(e) => {
          e.preventDefault();
          const pick = hits[active];
          go(pick?.symbol ?? q);
        }}
      >
        <div ref={boxRef} className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent)]"
          />
          <input
            value={q}
            onChange={(e) => {
              typed.current = true;
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => hits.length && setOpen(true)}
            onKeyDown={(e) => {
              if (!open || !hits.length) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => (i + 1) % hits.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => (i - 1 + hits.length) % hits.length);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Search NSE — RELIANCE, TCS, ITC…"
            aria-label="Search NSE stocks"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open}
            className="min-w-0 w-full border border-[var(--border-strong)] bg-[var(--bg-primary)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent)]"
          />
          {open && (loading || hits.length > 0 || q.trim().length >= 2) ? (
            <ul
              id={listId}
              role="listbox"
              className="absolute z-30 mt-1 max-h-72 w-full overflow-auto border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-glow)]"
            >
              {loading && !hits.length ? (
                <li className="px-4 py-3 text-sm text-[var(--text-muted)]">
                  Searching NSE…
                </li>
              ) : hits.length ? (
                hits.map((hit, i) => (
                  <li key={hit.symbol} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => {
                        setQ(hit.symbol);
                        go(hit.symbol);
                      }}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left ${
                        i === active ? "bg-[var(--accent-dim)]" : ""
                      }`}
                    >
                      <span>
                        <span className="block font-semibold">{hit.name}</span>
                        <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                          {hit.symbol} · NSE · Equity
                        </span>
                      </span>
                      <span className="shrink-0 text-right font-mono text-[11px] tracking-[0.12em] text-[var(--accent-strong)]">
                        {hit.ltp != null
                          ? `₹${hit.ltp.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
                          : hit.symbol}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-[var(--text-muted)]">
                  {notice ?? "NSE stock not found. Please search for a valid NSE-listed equity."}
                </li>
              )}
            </ul>
          ) : null}
        </div>
        <button type="submit" className="btn-primary px-5 py-3 text-[11px]">
          Show analysis
        </button>
      </form>
      <div className={compact ? "mt-3 flex flex-wrap gap-2" : "mt-4 flex flex-wrap gap-2"}>
        <span className="self-center text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          NSE
        </span>
        {NSE_QUICK.map((symbol) => (
          <button
            key={symbol}
            type="button"
            onClick={() => {
              setQ(symbol);
              go(symbol);
            }}
            className="border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

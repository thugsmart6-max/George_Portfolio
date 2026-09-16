"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { AliceQuote } from "@/lib/alice-types";

function formatPrice(n: number | null) {
  if (n == null) return "—";
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPct(n: number | null) {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function stamp(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type LiveState = { connected: boolean; quote: AliceQuote | null };

const inflight = new Map<string, Promise<LiveState>>();

async function loadAliceQuote(symbol: string): Promise<LiveState> {
  const pending = inflight.get(symbol);
  if (pending) return pending;

  const job = (async (): Promise<LiveState> => {
    const statusRes = await fetch("/api/alice/status", { cache: "no-store" });
    const status = (await statusRes.json()) as { connected?: boolean };
    if (!status.connected) return { connected: false, quote: null };
    const res = await fetch(`/api/alice/quote?symbol=${encodeURIComponent(symbol)}`, {
      cache: "no-store",
    });
    if (res.status === 401) return { connected: false, quote: null };
    if (!res.ok) return { connected: true, quote: null };
    const data = (await res.json()) as { quote?: AliceQuote | null };
    return { connected: true, quote: data.quote ?? null };
  })();

  inflight.set(symbol, job);
  try {
    return await job;
  } finally {
    inflight.delete(symbol);
  }
}

function useAliceQuote(symbol?: string | null) {
  const [live, setLive] = useState<AliceQuote | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ticker = (symbol ?? "").trim();
    if (!ticker) {
      setLive(null);
      setConnected(false);
      return;
    }

    let gone = false;
    let timer = 0;

    async function load() {
      try {
        const next = await loadAliceQuote(ticker);
        if (gone) return;
        setConnected(next.connected);
        setLive(next.quote);
      } catch {
        if (!gone) setLive(null);
      }
    }

    void load();
    const onVis = () => {
      if (!document.hidden) void load();
    };
    timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 20_000);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      gone = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [symbol]);

  return { live, connected };
}

export function AliceQuoteBlock({
  symbol,
  price,
  changePct,
  fallback,
}: {
  symbol?: string | null;
  price: number | null;
  changePct: number | null;
  fallback?: string;
}) {
  const { live } = useAliceQuote(symbol);
  const ltp = live?.ltp ?? price;
  const pct = live?.changePct ?? changePct;
  const up = (pct ?? 0) >= 0;

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        Current price
        {live ? (
          <span className="ml-2 font-mono tracking-normal text-[var(--accent-strong)]">Live</span>
        ) : null}
      </dt>
      <dd className="display mt-1 text-2xl">{ltp != null ? formatPrice(ltp) : fallback ?? "—"}</dd>
      {pct != null ? (
        <p className={`mt-1 text-sm font-semibold ${up ? "text-[var(--positive)]" : "text-[var(--danger)]"}`}>
          {up ? <TrendingUp className="mr-1 inline" size={14} /> : <TrendingDown className="mr-1 inline" size={14} />}
          {formatPct(pct)}
        </p>
      ) : fallback && ltp == null ? (
        <p className="mt-1 text-xs text-[var(--text-muted)]">Connect Alice Blue for live LTP</p>
      ) : null}
    </div>
  );
}

export function AliceFeedNote({
  symbol,
  asOf,
}: {
  symbol?: string | null;
  asOf: string | null;
}) {
  const { live, connected } = useAliceQuote(symbol);
  const when = stamp(live?.asOf ?? asOf);

  return (
    <p className="relative z-10 mt-4 text-[11px] text-[var(--text-muted)]">
      Live NSE figures via Alice Blue
      {when ? ` · ${when}` : ""}
      {!connected ? " · connect above for LTP" : connected && !live ? " · waiting for LTP" : ""}
    </p>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { formatINR, formatPercent } from "@/lib/utils";
import type { AliceFunds, AliceHolding, AlicePortfolio } from "@/lib/alice-types";

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p
        className={`mt-1 font-semibold tabular-nums ${
          tone === "down" ? "text-[var(--danger)]" : tone === "up" ? "text-[var(--positive)]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function fundsLine(funds: AliceFunds | null) {
  if (!funds) return null;
  const bits = [
    funds.tradingLimit != null ? `Limit ${formatINR(Math.round(funds.tradingLimit))}` : null,
    funds.openingCash != null ? `Cash ${formatINR(Math.round(funds.openingCash))}` : null,
    funds.collateral != null ? `Collateral ${formatINR(Math.round(funds.collateral))}` : null,
  ].filter(Boolean);
  return bits.length ? bits.join(" · ") : null;
}

export function AliceHoldings() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AliceHolding[]>([]);
  const [funds, setFunds] = useState<AliceFunds | null>(null);
  const [asOf, setAsOf] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statusRes = await fetch("/api/alice/status", { cache: "no-store" });
      const status = (await statusRes.json()) as { connected?: boolean };
      if (!status.connected) {
        setConnected(false);
        setRows([]);
        setFunds(null);
        setAsOf(null);
        return;
      }
      setConnected(true);
      const res = await fetch("/api/alice/holdings", { cache: "no-store" });
      const data = (await res.json()) as AlicePortfolio & { error?: string };
      if (!res.ok) {
        if (res.status === 401) setConnected(false);
        setError(data.error || "Could not load Alice Blue holdings.");
        setRows([]);
        return;
      }
      setRows(data.holdings ?? []);
      setFunds(data.funds ?? null);
      setAsOf(data.asOf ?? null);
    } catch {
      setError("Could not load Alice Blue holdings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [load]);

  if (!connected) {
    if (loading) {
      return (
        <div className="border border-[var(--border)] px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">
          Checking Alice Blue holdings…
        </div>
      );
    }
    return (
      <div className="border border-[var(--border)] px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">
        Connect Alice Blue above to load your live CNC/MTF book and LTP. This tracker does not use Yahoo Finance.
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4 md:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Alice Blue holdings
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Live CNC / MTF book from your account, marked to Alice Blue LTP.
            {asOf
              ? ` · ${new Date(asOf).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </p>
          {fundsLine(funds) ? (
            <p className="mt-2 font-mono text-[11px] text-[var(--text-muted)]">{fundsLine(funds)}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="btn-ghost btn-no-arrow px-3 py-2 text-[10px]"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error ? (
        <p className="px-5 py-4 text-sm text-[var(--danger)] md:px-8">{error}</p>
      ) : loading && rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">Loading live holdings…</p>
      ) : rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-[var(--text-secondary)] md:px-8">
          Alice Blue is connected, but this account has no equity holdings to show.
        </p>
      ) : (
        <ul>
          {rows.map((row) => {
            const loss = row.pnl < 0;
            return (
              <li
                key={`${row.symbol}-${row.product}`}
                className="border-b border-[var(--border)] px-5 py-5 last:border-b-0 md:px-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {row.name}{" "}
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">{row.symbol}</span>
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                      {row.qty} × buy {formatPrice(row.buy)} · LTP {formatPrice(row.ltp)} · {row.product}
                    </p>
                  </div>
                  <Link
                    href={`/resources/analysis?stock=${encodeURIComponent(row.symbol)}`}
                    className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]"
                    data-cursor="link"
                  >
                    Analysis
                  </Link>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <Stat label="Invested" value={formatINR(Math.round(row.invested))} />
                  <Stat label="Live value" value={formatINR(Math.round(row.value))} />
                  <Stat label="LTP" value={formatPrice(row.ltp)} />
                  <Stat
                    label={loss ? "Loss" : "Profit"}
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
  );
}

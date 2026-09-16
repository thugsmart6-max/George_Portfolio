"use client";

import { useEffect, useState } from "react";
import { LiveTicketMath } from "@/components/resources/LiveTicketMath";
import { NseAnalysisBoard } from "@/components/resources/NseAnalysisBoard";
import { LoaderOne } from "@/components/ui/loader";
import type { NseAnalysis } from "@/lib/analysis-engine";
import type { NseSheet } from "@/lib/nse-format";

const STEPS = [
  "Searching NSE instrument…",
  "Fetching market data…",
  "Loading historical prices…",
  "Calculating technical indicators…",
  "Building risk analysis…",
  "Preparing stock insights…",
];

type AnalysisPayload = NseAnalysis & { insight?: string | null };

export function AliceAnalysisCanvas({
  query,
  initialSheet = null,
  aliceConnected = false,
}: {
  query: string;
  initialSheet?: NseSheet | null;
  aliceConnected?: boolean;
}) {
  const [sheet, setSheet] = useState<NseSheet | null>(initialSheet);
  const [connected, setConnected] = useState(aliceConnected);
  const [analysis, setAnalysis] = useState<AnalysisPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setSheet(initialSheet);
    setConnected(aliceConnected);
    setAnalysis(null);
    setError(null);
    setLoading(true);
    setStep(0);
  }, [initialSheet, aliceConnected, query]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }, 700);
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    const ticker = query.trim();
    if (!ticker) {
      setLoading(false);
      setError("Add an NSE equity symbol to analyse.");
      return;
    }

    let gone = false;
    async function load(first: boolean) {
      if (first) setLoading(true);
      try {
        const [analysisRes, sheetRes] = await Promise.all([
          fetch(`/api/stocks/${encodeURIComponent(ticker)}/analysis`, { cache: "no-store" }),
          fetch(`/api/alice/sheet?symbol=${encodeURIComponent(ticker)}`, { cache: "no-store" }),
        ]);
        if (gone) return;

        const analysisJson = (await analysisRes.json()) as AnalysisPayload & { error?: string };
        if (!analysisRes.ok) {
          setError(analysisJson.error ?? "Unable to retrieve market data right now. Please try again.");
          setAnalysis(null);
        } else {
          setError(null);
          setAnalysis(analysisJson);
        }

        if (sheetRes.ok) {
          const sheetJson = (await sheetRes.json()) as { connected?: boolean; sheet?: NseSheet | null };
          setConnected(Boolean(sheetJson.connected));
          if (sheetJson.sheet) setSheet(sheetJson.sheet);
        }
      } catch {
        if (!gone) {
          setError("Unable to retrieve market data right now. Please try again.");
        }
      } finally {
        if (!gone) setLoading(false);
      }
    }

    void load(true);
    const timer = window.setInterval(() => {
      if (!document.hidden) void load(false);
    }, 45_000);
    return () => {
      gone = true;
      window.clearInterval(timer);
    };
  }, [query]);

  if (loading) {
    return (
      <div className="ig-sheet flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 py-16">
        <LoaderOne />
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {STEPS[step]}
        </p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="ig-sheet border border-[var(--border)] px-5 py-10 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--accent-2)]">NSE · Equity</p>
          <h2 className="display mt-3 text-3xl">{query.toUpperCase()}</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">{error}</p>
          <p className="mt-3 max-w-xl text-sm text-[var(--text-muted)]">
            Analysis is calculated from that symbol’s live Alice Blue series. Stored classroom reports for a few
            teaching names are not used on this page.
          </p>
        </div>
      ) : analysis ? (
        <NseAnalysisBoard analysis={analysis} />
      ) : null}

      {sheet?.quote ? (
        <LiveTicketMath
          quote={sheet.quote}
          holding={sheet.holding ?? null}
          aliceConnected={connected}
        />
      ) : null}
    </>
  );
}

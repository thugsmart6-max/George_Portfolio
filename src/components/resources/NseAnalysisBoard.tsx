"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/componentry";
import { StockTapeChart } from "@/components/resources/StockTapeChart";
import { formatNsePct, formatNsePrice, formatNseQty } from "@/lib/nse-format";
import { cn } from "@/lib/utils";
import type { NseAnalysis } from "@/lib/analysis-engine";

type Payload = NseAnalysis & { insight?: string | null };

function stamp(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toneOf(n: number | null): "up" | "down" | undefined {
  if (n == null || !Number.isFinite(n) || n === 0) return undefined;
  return n > 0 ? "up" : "down";
}

function Metric({
  label,
  value,
  tone,
  large,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
  large?: boolean;
}) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono",
          large ? "text-lg md:text-xl" : "text-sm",
          tone === "up" && "text-[var(--positive)]",
          tone === "down" && "text-[var(--danger)]"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function numOrNa(n: number | null, kind: "price" | "pct" | "qty" | "plain" = "plain") {
  if (n == null) return "—";
  if (kind === "price") return formatNsePrice(n);
  if (kind === "pct") return formatNsePct(n);
  if (kind === "qty") return formatNseQty(n);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function EmptyTape({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-5">
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{children}</p>
    </div>
  );
}

function Chip({ children, live }: { children: ReactNode; live?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        live
          ? "border-[var(--positive)] text-[var(--positive)]"
          : "border-[var(--border)] text-[var(--text-muted)]"
      )}
    >
      {children}
    </span>
  );
}

function Section({
  n,
  title,
  kicker,
  children,
}: {
  n: string;
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section className="ig-panel border-t border-[var(--border)]">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="ig-badge">{n}</span>
            <h3 className="display text-xl uppercase leading-none md:text-2xl">{title}</h3>
          </div>
          {kicker ? (
            <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--text-muted)]">{kicker}</p>
          ) : null}
        </header>
        {children}
      </section>
    </Reveal>
  );
}

function cr(n: number | null, suffix = "Cr") {
  if (n == null) return "Data unavailable";
  return `₹${n.toLocaleString("en-IN")} ${suffix}`;
}

export function NseAnalysisBoard({ analysis }: { analysis: Payload }) {
  const q = analysis.quote;
  const t = analysis.technical;
  const f = analysis.fundamentals;
  const up = (q.changePct ?? 0) >= 0;
  const live = analysis.metadata.connected;
  const techScore = analysis.scorecard.categories.find((c) => c.id === "technical")?.score ?? null;
  const overall = analysis.scorecard.overall;

  return (
    <article className="ig-sheet">
      <header className="ig-mast px-5 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap gap-2">
          <Chip live={live}>{live ? "Live tape" : "Waiting for Alice"}</Chip>
          <Chip>NSE · Equity</Chip>
          <Chip>{analysis.metadata.barCount} daily bars</Chip>
          <Chip>{analysis.metadata.source}</Chip>
        </div>
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-[var(--accent-strong)]">
              {analysis.stock.symbol}
            </p>
            <h2 className="display mt-2 text-[clamp(2.1rem,5vw,4.2rem)] leading-[0.9]">
              {analysis.stock.name}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {live
                ? `Last print ${stamp(analysis.metadata.updatedAt)}. Chart, indicators and scores use this series only.`
                : `Connect Alice Blue to fill LTP, history, indicators and scores for ${analysis.stock.symbol}. The sheet stays empty until the tape loads.`}{" "}
              Not a buy or sell.
            </p>
          </div>
          <div className="min-w-[220px]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Last traded</p>
            <p className="display mt-1 text-5xl md:text-6xl">{formatNsePrice(q.ltp)}</p>
            <p
              className={cn(
                "mt-2 font-mono text-sm",
                up ? "text-[var(--positive)]" : "text-[var(--danger)]"
              )}
            >
              {formatNsePct(q.changePct)} · {formatNsePrice(q.change)}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Metric label="Open" value={numOrNa(q.open, "price")} />
              <Metric label="High" value={numOrNa(q.high, "price")} />
              <Metric label="Low" value={numOrNa(q.low, "price")} />
            </div>
          </div>
        </div>
      </header>

      <Section n="01" title="Stock overview" kicker="Identity">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Exchange" value="NSE" />
          <Metric label="Segment" value="Equity" />
          <Metric label="Symbol" value={analysis.stock.symbol} large />
          <Metric label="Company" value={analysis.stock.name} />
        </div>
      </Section>

      <Section n="02" title="Key market metrics" kicker="Session">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="LTP" value={numOrNa(q.ltp, "price")} large />
          <Metric label="Previous close" value={numOrNa(q.previousClose, "price")} />
          <Metric label="Open" value={numOrNa(q.open, "price")} />
          <Metric label="High" value={numOrNa(q.high, "price")} />
          <Metric label="Low" value={numOrNa(q.low, "price")} />
          <Metric label="Volume" value={numOrNa(q.volume, "qty")} />
          <Metric label="Day change" value={numOrNa(q.change, "price")} tone={toneOf(q.change)} />
          <Metric label="Day change %" value={numOrNa(q.changePct, "pct")} tone={toneOf(q.changePct)} />
        </div>
      </Section>

      <Section n="03" title="Price chart" kicker="Daily tape">
        <StockTapeChart
          bars={analysis.historical.bars}
          sma50={analysis.technical.sma50Series}
          sma200={analysis.technical.sma200Series}
          ema50={analysis.technical.ema50Series}
          bbUpper={analysis.technical.bbUpperSeries}
          bbMid={analysis.technical.bbMidSeries}
          bbLower={analysis.technical.bbLowerSeries}
          supports={analysis.levels.support.map((l) => l.price)}
          resistances={analysis.levels.resistance.map((l) => l.price)}
        />
      </Section>

      <Section n="04" title="Business analysis" kicker={f.source ?? "Fundamentals"}>
        {f.available ? (
          <>
            {f.about ? (
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{f.about}</p>
            ) : null}
            {f.keyPoints ? (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{f.keyPoints}</p>
            ) : null}
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="Market cap" value={cr(f.marketCapCr)} large />
              <Metric label="Sales (latest year)" value={cr(f.revenue)} />
              <Metric label="Source" value={f.source ?? "Screener.in"} />
            </div>
            {f.url ? (
              <p className="mt-3 text-[11px] text-[var(--text-muted)]">
                Snapshot from {f.source}.{" "}
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline">
                  Open Screener.in
                </a>
                . Separate from Alice Blue LTP.
              </p>
            ) : null}
          </>
        ) : (
          <EmptyTape>{f.message} Revenue and segment mix are not in the broker tape.</EmptyTape>
        )}
      </Section>

      <Section n="05" title="Financial analysis" kicker="Profitability">
        {f.available ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <Metric label="PAT" value={cr(f.pat)} />
            <Metric label="EPS" value={f.eps != null ? String(f.eps) : "Data unavailable"} />
            <Metric label="ROE" value={f.roe != null ? `${f.roe}%` : "Data unavailable"} />
            <Metric label="ROCE" value={f.roce != null ? `${f.roce}%` : "Data unavailable"} />
            <Metric label="Borrowings" value={cr(f.debt)} />
          </div>
        ) : (
          <EmptyTape>PAT, EPS, ROE, ROCE and debt are not fabricated from the broker feed.</EmptyTape>
        )}
      </Section>

      <Section n="06" title="Management / ownership" kicker="Holding">
        {f.available ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <Metric
              label="Promoter holding"
              value={f.promoterHolding != null ? `${f.promoterHolding}%` : "Data unavailable"}
              large
            />
            <Metric label="Source" value={f.source ?? "Screener.in"} />
          </div>
        ) : (
          <EmptyTape>Promoter holding is not supplied by Alice Blue.</EmptyTape>
        )}
      </Section>

      <Section n="07" title="Valuation" kicker="Multiples">
        {f.available ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="P/E" value={f.pe != null ? String(f.pe) : "Data unavailable"} large />
            <Metric label="P/B" value={f.pb != null ? f.pb.toFixed(2) : "Data unavailable"} />
            <Metric label="Book value" value={f.bookValue != null ? `₹${f.bookValue}` : "Data unavailable"} />
            <Metric
              label="Dividend yield"
              value={f.dividendYield != null ? `${f.dividendYield}%` : "Data unavailable"}
            />
          </div>
        ) : (
          <EmptyTape>P/E and P/B are not in the Alice Blue quote.</EmptyTape>
        )}
      </Section>

      <Section
        n="08"
        title="Technical analysis"
        kicker={techScore != null ? `${techScore}/100` : "Score unavailable"}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Chip live={analysis.trend.label.includes("Bull")}>{analysis.trend.label}</Chip>
          {analysis.trend.reasons.map((row) => (
            <span
              key={row.text}
              className={cn(
                "border px-2 py-1 text-[11px]",
                row.ok
                  ? "border-[var(--positive)]/40 text-[var(--text-secondary)]"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              )}
            >
              {row.ok ? "✓" : "–"} {row.text}
            </span>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="SMA 20" value={numOrNa(t.sma20, "price")} />
          <Metric label="SMA 50" value={numOrNa(t.sma50, "price")} />
          <Metric label="SMA 100" value={numOrNa(t.sma100, "price")} />
          <Metric label="SMA 200" value={numOrNa(t.sma200, "price")} />
          <Metric label="EMA 20" value={numOrNa(t.ema20, "price")} />
          <Metric label="EMA 50" value={numOrNa(t.ema50, "price")} />
          <Metric label="EMA 200" value={numOrNa(t.ema200, "price")} />
          <Metric label="RSI 14" value={numOrNa(t.rsi14)} />
          <Metric label="MACD" value={numOrNa(t.macd)} />
          <Metric label="MACD signal" value={numOrNa(t.macdSignal)} />
          <Metric label="MACD hist" value={numOrNa(t.macdHist)} tone={toneOf(t.macdHist)} />
          <Metric label="Stoch RSI" value={numOrNa(t.stochRsi)} />
          <Metric label="ATR" value={numOrNa(t.atr, "price")} />
          <Metric label="Bollinger mid" value={numOrNa(t.bbMid, "price")} />
          <Metric label="HV" value={numOrNa(t.histVol, "pct")} />
          <Metric label="Rel volume" value={numOrNa(t.relativeVolume)} />
        </div>
      </Section>

      <Section n="09" title="Support & resistance" kicker="Swings">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[var(--positive)]">Support</p>
            {analysis.levels.support.length ? (
              <ul className="space-y-2">
                {analysis.levels.support.map((level) => (
                  <li
                    key={`s-${level.price}`}
                    className="border border-[var(--border)] border-l-[3px] border-l-[var(--positive)] px-3 py-3"
                  >
                    <p className="flex items-baseline justify-between gap-3 font-mono text-sm">
                      <span>{formatNsePrice(level.price)}</span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {level.strength}
                      </span>
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">{level.why}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyTape>Insufficient historical data</EmptyTape>
            )}
          </div>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[var(--danger)]">Resistance</p>
            {analysis.levels.resistance.length ? (
              <ul className="space-y-2">
                {analysis.levels.resistance.map((level) => (
                  <li
                    key={`r-${level.price}`}
                    className="border border-[var(--border)] border-l-[3px] border-l-[var(--danger)] px-3 py-3"
                  >
                    <p className="flex items-baseline justify-between gap-3 font-mono text-sm">
                      <span>{formatNsePrice(level.price)}</span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {level.strength}
                      </span>
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">{level.why}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyTape>Insufficient historical data</EmptyTape>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="52-week high" value={numOrNa(t.high52, "price")} />
          <Metric label="52-week low" value={numOrNa(t.low52, "price")} />
          <Metric label="From 52w high" value={numOrNa(t.distHigh52, "pct")} tone={toneOf(t.distHigh52)} />
          <Metric label="From 52w low" value={numOrNa(t.distLow52, "pct")} tone={toneOf(t.distLow52)} />
        </div>
      </Section>

      <Section n="10" title="Risk analysis" kicker={analysis.risk.level}>
        <div className="mb-4">
          <div className="ig-meter">
            <span
              style={{
                width:
                  analysis.risk.level === "Unavailable"
                    ? "0%"
                    : analysis.risk.level === "Low"
                      ? "22%"
                      : analysis.risk.level === "Moderate"
                        ? "48%"
                        : analysis.risk.level === "High"
                          ? "74%"
                          : "100%",
              }}
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{analysis.risk.explanation}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.risk.metrics.map((m) => (
            <Metric key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      </Section>

      <Section n="11" title="Returns & path" kicker="Realised">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="1D" value={numOrNa(analysis.returns.d1, "pct")} tone={toneOf(analysis.returns.d1)} />
          <Metric label="1W" value={numOrNa(analysis.returns.w1, "pct")} tone={toneOf(analysis.returns.w1)} />
          <Metric label="1M" value={numOrNa(analysis.returns.m1, "pct")} tone={toneOf(analysis.returns.m1)} />
          <Metric label="3M" value={numOrNa(analysis.returns.m3, "pct")} tone={toneOf(analysis.returns.m3)} />
          <Metric label="6M" value={numOrNa(analysis.returns.m6, "pct")} tone={toneOf(analysis.returns.m6)} />
          <Metric label="1Y" value={numOrNa(analysis.returns.y1, "pct")} tone={toneOf(analysis.returns.y1)} large />
          <Metric label="CAGR" value={numOrNa(analysis.returns.cagr, "pct")} tone={toneOf(analysis.returns.cagr)} />
          <Metric
            label="Max drawdown"
            value={numOrNa(analysis.returns.maxDrawdown, "pct")}
            tone={toneOf(analysis.returns.maxDrawdown)}
          />
          <Metric label="Recovery" value={numOrNa(analysis.returns.recovery, "pct")} />
          <Metric label="Sharpe (rf=0)" value={numOrNa(analysis.returns.sharpe)} />
          <Metric label="Volatility" value={numOrNa(analysis.returns.volatility, "pct")} />
        </div>
      </Section>

      <Section n="12" title="Evidence summary" kicker="Tape only">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Technical trend" value={analysis.evidence.technicalTrend} large />
          <Metric label="Momentum" value={analysis.evidence.momentum} />
          <Metric label="Volatility" value={analysis.evidence.volatility} />
          <Metric label="Price structure" value={analysis.evidence.priceStructure} />
          <Metric label="Risk" value={analysis.evidence.risk} />
        </div>
      </Section>

      <Section n="13" title="Future / scenario" kicker="No target">
        <div className="border border-[var(--border)] bg-[var(--surface)] px-5 py-6">
          <p className="display text-2xl uppercase md:text-3xl">Path already printed</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            No forecast and no target price. Realised 1Y {numOrNa(analysis.returns.y1, "pct")}. CAGR{" "}
            {numOrNa(analysis.returns.cagr, "pct")}. This is the loaded Alice Blue series only.
          </p>
        </div>
      </Section>

      <Section n="14" title="Investment thesis" kicker="Not advice">
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["Trend", analysis.evidence.technicalTrend],
              ["Momentum", analysis.evidence.momentum],
              ["Volatility", analysis.evidence.volatility],
              ["Structure", analysis.evidence.priceStructure],
              ["Risk", analysis.evidence.risk],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] py-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</span>
              <span className="text-right text-sm">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n="15"
        title="Transparent scorecard"
        kicker={overall == null ? "Partial" : `${overall}/100`}
      >
        {overall != null ? (
          <div className="mb-6">
            <p className="display text-5xl">{overall}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Weighted from available tape
            </p>
            <div className="ig-meter mt-3">
              <span style={{ width: `${Math.min(100, Math.max(0, overall))}%` }} />
            </div>
          </div>
        ) : (
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Overall unavailable — only categories with Alice Blue tape are scored.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.scorecard.categories.map((c) => (
            <div key={c.id} className="border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{c.label}</p>
              <p className="display mt-2 text-3xl">{c.score == null ? "—" : c.score}</p>
              <div className="ig-meter mt-3">
                <span style={{ width: `${c.score == null ? 0 : Math.min(100, Math.max(0, c.score))}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">Weight {Math.round(c.weight * 100)}%</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{c.explanation}</p>
              {c.metrics.length ? (
                <p className="mt-2 font-mono text-[11px] text-[var(--text-muted)]">{c.metrics.join(" · ")}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {analysis.insight ? (
        <Reveal>
          <section className="ig-panel border-t border-[var(--border)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Reading</p>
            <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
              {analysis.insight}
            </p>
          </section>
        </Reveal>
      ) : null}

      {analysis.metadata.notes.length ? (
        <p className="border-t border-[var(--border)] px-5 py-5 text-[11px] text-[var(--text-muted)] md:px-8">
          {analysis.metadata.notes.join(" · ")}
        </p>
      ) : null}
    </article>
  );
}

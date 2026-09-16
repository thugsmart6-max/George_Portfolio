"use client";

import {
  AlertTriangle,
  Brain,
  Building2,
  Check,
  Cog,
  Cpu,
  Gauge,
  Landmark,
  Shield,
  Sparkles,
  Telescope,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { findStockLesson } from "@/lib/stock-lessons";
import { getStockReport, reportTotal, verdictLabel } from "@/lib/stock-reports";
import { AliceFeedNote, AliceQuoteBlock } from "@/components/resources/AliceQuoteBlock";
import {
  formatNseCr,
  formatNsePct,
  formatNsePrice,
  formatNseQty,
  formatNseRatioPct,
  formatNseX,
  type NseSheet,
  type NseYearRow,
} from "@/lib/nse-format";

function ScorePill({ n }: { n?: number }) {
  if (n == null) return null;
  const label = Number.isInteger(n) ? String(n) : n.toFixed(1);
  return (
    <span className="rounded-full bg-[var(--accent-dim)] px-2.5 py-0.5 font-mono text-xs text-[var(--accent-strong)]">
      {label}/10
    </span>
  );
}

function SecHead({ n, title, score }: { n: string; title: string; score?: number }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="flex items-center gap-2.5 text-sm font-semibold tracking-wide">
        <span className="ig-badge">{n}</span>
        {title}
      </p>
      <ScorePill n={score} />
    </div>
  );
}

function AreaChart({ values, up }: { values: number[]; up?: boolean }) {
  if (values.length < 2) return null;
  const w = 640;
  const h = 150;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const coords = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - 10 - ((v - min) / span) * (h - 20);
    return { x, y };
  });
  const line = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const stroke = up === false ? "var(--danger)" : "var(--accent)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-36 w-full" aria-hidden>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="var(--border)" strokeDasharray="4 6" />
      ))}
      <polygon points={`0,${h} ${line} ${w},${h}`} fill={stroke} opacity="0.14" />
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="2.6" />
    </svg>
  );
}

function TwinBars({ rows }: { rows: NseYearRow[] }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.flatMap((r) => [r.revenueCr, r.patCr]), 1);
  return (
    <div>
      <div className="mb-2 flex gap-4 text-[11px] text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 bg-[var(--accent)]" /> Revenue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 bg-[var(--accent-2)]" /> PAT
        </span>
      </div>
      <div className="flex h-40 items-end gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div
                className="w-[42%] rounded-t-sm bg-[var(--accent)]"
                style={{ height: `${Math.max(6, (row.revenueCr / max) * 100)}%` }}
              />
              <div
                className="w-[42%] rounded-t-sm bg-[var(--accent-2)]"
                style={{ height: `${Math.max(4, (row.patCr / max) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
            <span>{item.label}</span>
            <span className="font-mono">{item.value.toFixed(1)}x</span>
          </div>
          <div className="ig-meter">
            <span style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function downsample(values: number[], count = 64) {
  if (values.length <= count) return values;
  const step = (values.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => values[Math.round(i * step)]);
}

function scoreLabel(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function LineIcon({ text }: { text: string }) {
  const t = text.toLowerCase();
  if (t.includes("sdv") || t.includes("software defined")) return <Cpu size={15} />;
  if (t.includes("ev") || t.includes("powertrain") || t.includes("electric")) return <Zap size={15} />;
  if (t.includes("adas") || t.includes("autonomous")) return <Gauge size={15} />;
  if (t.includes("embedded") || t.includes("vehicle engineering")) return <Cog size={15} />;
  if (t.includes("ai") || t.includes("connected")) return <Brain size={15} />;
  return <Check size={15} />;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-mono text-sm">{value}</p>
    </div>
  );
}

function vsDma(price: number | null, dma: number | null) {
  if (price == null || dma == null || dma === 0) return "—";
  const pct = ((price - dma) / dma) * 100;
  return `${price >= dma ? "Above" : "Below"} ${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function RangeMeter({
  label,
  low,
  high,
  value,
  empty,
}: {
  label: string;
  low: number | null;
  high: number | null;
  value: number | null;
  empty: string;
}) {
  if (low == null || high == null || value == null || high === low) {
    return (
      <div className="border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{empty}</p>
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100));
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
      <div className="ig-meter mt-2">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[var(--text-muted)]">
        <span>{formatNsePrice(low)}</span>
        <span className="text-[var(--text-primary)]">{pct.toFixed(0)}%</span>
        <span>{formatNsePrice(high)}</span>
      </div>
    </div>
  );
}

export function EquityInfographic({
  query = "",
  sheet = null,
  aliceConnected = false,
}: {
  query?: string;
  sheet?: NseSheet | null;
  aliceConnected?: boolean;
}) {
  const lesson = findStockLesson(query);
  const report = lesson ? getStockReport(lesson) : null;
  const quote = sheet?.quote ?? null;
  const fun = sheet?.fundamentals ?? null;
  const peers = sheet?.peers ?? [];

  if (!query) {
    return (
      <article className="ig-sheet">
        <header className="ig-mast px-5 py-12 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent-strong)]">NSE · Alice Blue live</p>
          <h2 className="display mt-3 text-4xl md:text-6xl">Search an NSE name</h2>
          <p className="mt-4 max-w-xl text-base text-[var(--text-secondary)]">
            Connect Alice Blue, then search. The nine-block sheet fills with live LTP, day range, volume, and the 1-year tape from your broker session.
          </p>
        </header>
      </article>
    );
  }

  if (!quote && !lesson) {
    return (
      <article className="ig-sheet">
        <header className="ig-mast px-5 py-12 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent-strong)]">NSE · Alice Blue</p>
          <h2 className="display mt-3 text-4xl">{query}</h2>
          <p className="mt-4 max-w-xl text-base text-[var(--text-secondary)]">
            {aliceConnected
              ? "Alice Blue did not return a live NSE quote for this search."
              : "Connect Alice Blue above to load live LTP for this name. This sheet does not use Yahoo Finance."}
          </p>
        </header>
      </article>
    );
  }

  const scores = lesson && report ? reportTotal(lesson, report) : null;
  const pillars =
    lesson && report
      ? ([
          ["Business", lesson.scores.business],
          ["Financials", lesson.scores.financials],
          ["Management", lesson.scores.management],
          ["Valuation", lesson.scores.valuation],
          ["Technicals", lesson.scores.technicals],
          ["Risk", report.riskScore],
          ["Outlook", report.outlookScore],
        ] as const)
      : [];
  const up = (quote?.changePct ?? 0) >= 0;
  const spark = quote && quote.closes.length >= 2 ? downsample(quote.closes) : report?.tech.spark ?? [];
  const title = lesson?.name ?? quote?.name ?? query;
  const subtitle = report?.tagline ?? fun?.description ?? "";
  const chips = report?.chips ?? ([quote?.sector, quote?.industry].filter(Boolean) as string[]);
  const peerBars =
    report?.peerBars ??
    peers.filter((p) => p.pe != null).map((p) => ({ label: p.symbol, value: p.pe as number }));
  const mgmt = report?.management ?? [];
  const yearRows = report?.years?.length ? report.years : fun?.years ?? [];
  const financeRows = report?.finance ?? [];
  const chartUp = spark.length >= 2 ? spark[spark.length - 1] >= spark[0] : up;

  return (
    <article className="ig-sheet">
      <header className="ig-mast px-5 py-8 md:px-8 md:py-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_auto]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--accent-strong)]">
              {report?.exchange ?? `NSE: ${quote?.symbol ?? lesson?.symbol}`}
            </p>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.92]">{title}</h2>
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">{subtitle}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="border border-[var(--border)] bg-[var(--accent-dim)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <dl className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Market cap
              </dt>
              <dd className="display mt-1 text-2xl">{report?.marketCap ?? formatNseCr(fun?.marketCap ?? null)}</dd>
            </div>
            <AliceQuoteBlock
              symbol={quote?.symbol ?? lesson?.symbol ?? query}
              price={quote?.price ?? null}
              changePct={quote?.changePct ?? null}
              fallback={report?.priceBand}
            />
            <div className="border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Sector
              </dt>
              <dd className="mt-1 text-sm font-semibold leading-snug">
                {report?.sector ?? quote?.sector ?? lesson?.sector ?? "NSE EQ"}
                {(report?.industry ?? quote?.industry) ? (
                  <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">
                    {report?.industry ?? quote?.industry}
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>
        </div>
        <AliceFeedNote symbol={quote?.symbol ?? lesson?.symbol ?? query} asOf={quote?.asOf ?? null} />
        <p className="relative z-10 mt-2 text-[11px] text-[var(--text-muted)]">
          Classroom scores are teaching only — not a buy or sell. Live LTP is Alice Blue when connected.
        </p>
      </header>

      <div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">
        <section className="ig-panel">
          <SecHead n="01" title="Business quality" score={lesson?.scores.business} />
          <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <Building2 size={14} /> What they do
              </p>
              <p className="mt-2 text-[15px] leading-relaxed">
                {report?.does ?? fun?.description ?? "Read the annual report for what this company sells."}
              </p>
              {report?.doesLines?.length ? (
                <ul className="mt-3 space-y-2">
                  {report.doesLines.map((line) => (
                    <li key={line} className="ig-icon-tile">
                      <LineIcon text={line} />
                      <p className="text-sm font-semibold leading-snug">{line}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
              {report?.position ? (
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">Industry position. </span>
                  {report.position}
                </p>
              ) : fun?.website ? (
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{fun.website}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Key moat</p>
              {(
                report?.moat ??
                [
                  quote?.industry ? `Industry: ${quote.industry}` : "Listed NSE equity",
                  "Read the annual report for switching cost",
                ]
              ).map((m) => (
                <div key={m} className="ig-icon-tile">
                  <Check size={15} />
                  <p className="text-sm font-semibold leading-snug">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ig-panel">
          <SecHead n="02" title="Financial analysis" score={lesson?.scores.financials} />
          <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Revenue & PAT (₹ Cr)
              </p>
              {yearRows.length ? (
                <TwinBars rows={yearRows} />
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No classroom year series for this name yet.</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Key financials
              </p>
              <ul className="space-y-1.5">
                {financeRows.map((row) => (
                  <li key={row.label} className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] py-1.5 text-sm">
                    <span className="text-[var(--text-muted)]">{row.label}</span>
                    <span className="shrink-0 font-mono font-semibold">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {report?.financeTakeaway ? (
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{report.financeTakeaway}</p>
          ) : null}
          {quote?.price != null ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="Live LTP" value={formatNsePrice(quote.price)} />
              <Metric label="Change %" value={formatNsePct(quote.changePct ?? null)} />
              <Metric label="Volume" value={formatNseQty(quote.volume ?? null)} />
              <Metric label="Day range" value={`${formatNsePrice(quote.dayLow)} · ${formatNsePrice(quote.dayHigh)}`} />
            </div>
          ) : null}
        </section>

        <section className="ig-panel">
          <SecHead n="03" title="Management quality" score={lesson?.scores.management} />
          <ul className="grid gap-2 sm:grid-cols-2">
            {mgmt.map((m) => (
              <li key={m.label} className="ig-icon-tile items-start">
                <Users size={15} className="mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug">{m.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="ig-panel">
          <SecHead n="04" title="Valuation analysis" score={lesson?.scores.valuation} />
          <div className="grid grid-cols-2 gap-2">
            {(report?.valuation ?? []).map((row) => (
              <Metric key={row.label} label={row.label} value={row.value} />
            ))}
            {fun && !report?.valuation.length ? (
              <>
                <Metric label="P/E (TTM)" value={formatNseX(fun.trailingPe ?? null)} />
                <Metric label="P/B" value={formatNseX(fun.priceToBook ?? null)} />
              </>
            ) : null}
          </div>
          {report?.fairValue || report?.marginOfSafety ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {report.fairValue ? <Metric label="Fair value range" value={report.fairValue} /> : null}
              {report.marginOfSafety ? <Metric label="Margin of safety" value={report.marginOfSafety} /> : null}
            </div>
          ) : null}
          {peerBars.length ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Valuation compared to peers (P/E)
              </p>
              <HBars items={peerBars} />
            </div>
          ) : null}
          {quote?.price != null ? (
            <div className="mt-3">
              <RangeMeter
                label="Live price in 52-week range"
                low={quote.fiftyTwoWeekLow ?? null}
                high={quote.fiftyTwoWeekHigh ?? null}
                value={quote.price}
                empty="Alice Blue 52-week map fills after Connect."
              />
            </div>
          ) : null}
          {report?.valuationNote ? (
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{report.valuationNote}</p>
          ) : null}
        </section>
      </div>

      <div className="grid gap-px bg-[var(--border)] lg:grid-cols-3">
        <section className="ig-panel">
          <SecHead n="05" title="Technical analysis" score={lesson?.scores.technicals} />
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            <TrendingUp size={13} /> 1-year price chart
          </p>
          {spark.length >= 2 ? (
            <AreaChart values={spark} up={chartUp} />
          ) : (
            <div className="flex h-36 items-center border border-dashed border-[var(--border)] bg-[var(--surface)] px-4">
              <p className="text-sm text-[var(--text-muted)]">No chart series for this name yet.</p>
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Metric label="Trend (long)" value={report?.tech.trendLong ?? report?.tech.trend ?? "—"} />
            <Metric label="Trend (medium)" value={report?.tech.trendMid ?? "—"} />
            <Metric label="Trend (short)" value={report?.tech.trendShort ?? "—"} />
            <Metric label="Volume" value={report?.tech.volume ?? formatNseQty(quote?.volume ?? null)} />
            <Metric label="Support" value={report?.tech.support ?? formatNsePrice(quote?.fiftyTwoWeekLow ?? null)} />
            <Metric label="Resistance" value={report?.tech.resistance ?? formatNsePrice(quote?.fiftyTwoWeekHigh ?? null)} />
            <Metric label="Delivery %" value={report?.tech.delivery ?? "—"} />
            <Metric
              label="Vs 20 DMA"
              value={quote?.sma20 ? vsDma(quote.price ?? null, quote.sma20) : "Connect for live DMA"}
            />
          </div>
        </section>

        <section className="ig-panel">
          <SecHead n="06" title="Risk analysis" score={report?.riskScore} />
          <div className="grid grid-cols-2 gap-2">
            {(
              report?.risks ?? [
                { label: "Business", items: ["Client / product concentration"] },
                { label: "Industry", items: [quote?.sector ? `${quote.sector} cycle` : "Sector cycle"] },
                { label: "Financial", items: ["Margin and cash conversion"] },
                { label: "Market", items: ["Price can run far from value"] },
              ]
            ).map((r) => (
              <div key={r.label} className="border border-[var(--danger)]/25 bg-[var(--signal-dim)] p-3">
                <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--danger)]">
                  <AlertTriangle size={12} /> {r.label}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                  {r.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="ig-panel">
          <SecHead n="07" title="Future outlook" score={report?.outlookScore} />
          <ol className="relative ml-3 border-l-2 border-[var(--accent)]">
            {(
              [
                ["1Y", report?.outlook.y1 ?? "Watch the next four quarters vs the last print."],
                ["3Y", report?.outlook.y3 ?? "Does the main tap of money still grow?"],
                ["5Y", report?.outlook.y5 ?? "Is this still the same shop in five years?"],
              ] as const
            ).map(([k, v]) => (
              <li key={k} className="relative py-3 pl-5">
                <span className="absolute -left-[9px] top-4 h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--surface-elevated)]" />
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                  <Telescope size={12} /> {k}
                </p>
                <p className="mt-1 text-sm leading-snug">{v}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[1.35fr_0.9fr]">
        <section className="ig-panel">
          <SecHead n="08" title="Investment thesis" />
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ["Bull", report?.thesis.bull ?? "The shop keeps earning and the price is not already full.", "var(--positive)", report?.thesisTargets?.bull],
                ["Base", report?.thesis.base ?? "Ordinary years. Chart and PE need a re-check each quarter.", "var(--accent)", report?.thesisTargets?.base],
                ["Bear", report?.thesis.bear ?? "Cycle turns or the multiple was the whole story.", "var(--danger)", report?.thesisTargets?.bear],
              ] as const
            ).map(([k, v, color, target]) => (
              <div key={k} className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                <div className="h-1.5" style={{ background: color }} />
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
                    {k} case
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{v}</p>
                  {target ? (
                    <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">Classroom band {target}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ig-panel bg-[var(--accent-dim)]">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className="ig-badge">09</span> Scorecard
          </p>
          {scores ? (
            <>
              <p className="display mt-4 text-6xl leading-none text-[var(--accent-strong)]">{scores.score100}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                / 100 · {verdictLabel(scores.score100)}
              </p>
              <ul className="mt-5 space-y-2.5">
                {pillars.map(([k, v]) => (
                  <li key={k}>
                    <div className="mb-1 flex justify-between text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      <span>{k}</span>
                      <span className="font-mono">{scoreLabel(v)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                      <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(100, v * 10)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              No classroom score for this NSE name yet. Live Alice Blue numbers are above. We do not print a buy or sell.
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            Teaching score only — never a buy, hold, or sell. Live price is Alice Blue, not the score.
          </p>
        </section>
      </div>

      <footer className="grid gap-px bg-[var(--border)] md:grid-cols-2">
        <div className="ig-panel">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Landmark size={13} /> Research analyst verdict
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {report?.verdictQuote ??
              lesson?.reasons.overall ??
              "The nine boxes are a homework layout, not registered research. Live price is Alice Blue when connected."}
          </p>
        </div>
        <div className="ig-panel">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Sparkles size={13} /> Key investment drivers
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {(report?.drivers ?? [quote?.sector, "Cash conversion", "Valuation vs peers"].filter(Boolean) as string[]).map(
              (d) => (
                <li key={d} className="bg-[var(--accent-dim)] px-3 py-1.5 text-sm font-semibold text-[var(--accent-strong)]">
                  {d}
                </li>
              )
            )}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Shield size={13} /> How to read this sheet
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Teaching scores only — never a buy, hold, or sell. Connect Alice Blue above if you want live LTP on this name.
          </p>
        </div>
      </footer>
    </article>
  );
}

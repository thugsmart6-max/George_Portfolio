"use client";

import { useMemo, useState } from "react";
import { formatINR } from "@/lib/utils";
import {
  brokerageCalculate,
  emiCalculate,
  gstCalculate,
  lumpsumFutureValue,
  marginCalculate,
  sipFutureValue,
  swpProjection,
  type BrokerSegment,
  type GstMode,
} from "@/lib/calculators";

type Tab =
  | "sip"
  | "lumpsum"
  | "swp"
  | "gst"
  | "emi"
  | "brokerage"
  | "margin";

const tabs: { id: Tab; label: string }[] = [
  { id: "sip", label: "SIP" },
  { id: "lumpsum", label: "Lumpsum" },
  { id: "swp", label: "SWP" },
  { id: "gst", label: "GST" },
  { id: "emi", label: "EMI" },
  { id: "brokerage", label: "Brokerage" },
  { id: "margin", label: "Margin" },
];

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}) {
  const pct = ((clamp(value, min, max) - min) / (max - min || 1)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <label className="text-sm text-[var(--text-secondary)]">{label}</label>
        <div className="flex w-full max-w-none items-center gap-1 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3 py-2.5 sm:w-auto sm:min-w-[8.5rem] sm:max-w-[10rem]">
          {prefix ? (
            <span className="text-sm font-semibold text-[var(--accent-2)]">
              {prefix}
            </span>
          ) : null}
          <input
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : min}
            onChange={(e) =>
              onChange(clamp(Number(e.target.value), min, max))
            }
            className="w-full min-w-0 bg-transparent text-right text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix ? (
            <span className="shrink-0 text-sm text-[var(--text-muted)]">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range"
        style={{ "--range-pct": `${pct}%` } as React.CSSProperties}
        aria-label={label}
      />
      <div className="flex justify-between gap-2 text-[10px] text-[var(--text-muted)]">
        <span className="truncate">
          {prefix}
          {min.toLocaleString("en-IN")}
          {suffix}
        </span>
        <span className="truncate text-right">
          {prefix}
          {max.toLocaleString("en-IN")}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function Donut({
  a,
  b,
  aLabel,
  bLabel,
  centerHint = "share",
  aColor = "var(--text-muted)",
  bColor = "var(--accent-2)",
}: {
  a: number;
  b: number;
  aLabel: string;
  bLabel: string;
  centerHint?: string;
  aColor?: string;
  bColor?: string;
}) {
  const total = Math.max(a + b, 1);
  const aPct = (a / total) * 100;
  const bPct = (b / total) * 100;
  const r = 54;
  const c = 2 * Math.PI * r;
  const aLen = (aPct / 100) * c;
  const bLen = (bPct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
      <div className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40">
        <svg viewBox="0 0 140 140" className="-rotate-90 h-full w-full">
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="18"
          />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={aColor}
            strokeWidth="18"
            strokeDasharray={`${aLen} ${c - aLen}`}
          />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={bColor}
            strokeWidth="18"
            strokeDasharray={`${bLen} ${c - bLen}`}
            strokeDashoffset={-aLen}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Split
            </p>
            <p className="mt-1 text-sm font-semibold">
              {Math.round(bPct)}%{" "}
              <span className="font-normal text-[var(--text-muted)]">
                {centerHint}
              </span>
            </p>
          </div>
        </div>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: aColor }}
          />
          <span className="text-[var(--text-secondary)]">{aLabel}</span>
        </li>
        <li className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: bColor }}
          />
          <span className="text-[var(--text-secondary)]">{bLabel}</span>
        </li>
      </ul>
    </div>
  );
}

function ResultRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2 text-sm text-[var(--text-secondary)]">
        {accent ? (
          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-2)]" />
        ) : (
          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--text-muted)]" />
        )}
        <span className="truncate">{label}</span>
      </div>
      <p
        className={`shrink-0 text-right text-sm font-semibold tabular-nums sm:text-base ${
          accent ? "text-[var(--accent-2)]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InvestResults({
  invested,
  gains,
  total,
}: {
  invested: number;
  gains: number;
  total: number;
}) {
  return (
    <>
      <div className="space-y-1">
        <ResultRow
          label="Invested amount"
          value={formatINR(Math.round(invested))}
        />
        <ResultRow
          label="Est. returns"
          value={formatINR(Math.round(gains))}
          accent
        />
        <div className="mt-2 border-t border-[var(--border)] pt-4">
          <p className="text-sm text-[var(--text-secondary)]">Total value</p>
          <p className="display mt-1 break-all text-3xl tabular-nums text-[var(--accent-2)] sm:text-4xl md:text-5xl">
            {formatINR(Math.round(total))}
          </p>
        </div>
      </div>
      <Donut
        a={invested}
        b={Math.max(0, gains)}
        aLabel="Invested amount"
        bLabel="Est. returns"
        centerHint="returns"
      />
    </>
  );
}

export function FinanceCalculators({ initial = "sip" }: { initial?: Tab }) {
  const [tab, setTab] = useState<Tab>(initial);

  const [sipAmt, setSipAmt] = useState(25000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  const [lumpAmt, setLumpAmt] = useState(100000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);

  const [swpCorpus, setSwpCorpus] = useState(2500000);
  const [swpWithdraw, setSwpWithdraw] = useState(20000);
  const [swpRate, setSwpRate] = useState(8);
  const [swpYears, setSwpYears] = useState(15);

  const [gstAmount, setGstAmount] = useState(100000);
  const [gstRate, setGstRate] = useState(18);
  const [gstMode, setGstMode] = useState<GstMode>("exclusive");

  const [emiPrincipal, setEmiPrincipal] = useState(1000000);
  const [emiRate, setEmiRate] = useState(9);
  const [emiYears, setEmiYears] = useState(5);

  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(110);
  const [brokerQty, setBrokerQty] = useState(100);
  const [segment, setSegment] = useState<BrokerSegment>("delivery");

  const [marginPrice, setMarginPrice] = useState(500);
  const [marginQty, setMarginQty] = useState(100);
  const [marginPct, setMarginPct] = useState(20);

  const sip = useMemo(
    () => sipFutureValue(sipAmt, sipRate, sipYears),
    [sipAmt, sipRate, sipYears]
  );
  const lump = useMemo(
    () => lumpsumFutureValue(lumpAmt, lumpRate, lumpYears),
    [lumpAmt, lumpRate, lumpYears]
  );
  const swp = useMemo(
    () => swpProjection(swpCorpus, swpWithdraw, swpRate, swpYears),
    [swpCorpus, swpWithdraw, swpRate, swpYears]
  );
  const gst = useMemo(
    () => gstCalculate(gstAmount, gstRate, gstMode),
    [gstAmount, gstRate, gstMode]
  );
  const emi = useMemo(
    () => emiCalculate(emiPrincipal, emiRate, emiYears),
    [emiPrincipal, emiRate, emiYears]
  );
  const broker = useMemo(
    () => brokerageCalculate(buyPrice, sellPrice, brokerQty, segment),
    [buyPrice, sellPrice, brokerQty, segment]
  );
  const margin = useMemo(
    () => marginCalculate(marginPrice, marginQty, marginPct),
    [marginPrice, marginQty, marginPct]
  );

  const summary = (() => {
    if (tab === "sip") {
      return `A monthly SIP of ${formatINR(sipAmt)} for ${sipYears} years at ${sipRate}% p.a. may grow to about ${formatINR(Math.round(sip.futureValue))}.`;
    }
    if (tab === "lumpsum") {
      return `A lumpsum of ${formatINR(lumpAmt)} for ${lumpYears} years at ${lumpRate}% p.a. may grow to about ${formatINR(Math.round(lump.futureValue))}.`;
    }
    if (tab === "swp") {
      return swp.sustained
        ? `Withdrawing ${formatINR(swpWithdraw)} / month from ${formatINR(swpCorpus)} at ${swpRate}% may sustain the full ${swpYears} years.`
        : `At this pace, the corpus may last about ${swp.yearsLasted.toFixed(1)} years — not the full ${swpYears}.`;
    }
    if (tab === "gst") {
      return gstMode === "exclusive"
        ? `On ${formatINR(gstAmount)} exclusive of GST @ ${gstRate}%, total payable is about ${formatINR(Math.round(gst.total))}.`
        : `Of ${formatINR(gstAmount)} inclusive of GST @ ${gstRate}%, tax is about ${formatINR(Math.round(gst.gst))}.`;
    }
    if (tab === "emi") {
      return `A loan of ${formatINR(emiPrincipal)} at ${emiRate}% for ${emiYears} years means EMI of about ${formatINR(Math.round(emi.emi))}.`;
    }
    if (tab === "brokerage") {
      return `${segment === "delivery" ? "Delivery" : "Intraday"} round-trip on ${brokerQty} shares: total charges ~${formatINR(Math.round(broker.totalCharges))}, net P&L ~${formatINR(Math.round(broker.netPnL))}.`;
    }
    return `Trade value ${formatINR(Math.round(margin.tradeValue))} at ${margin.marginPercent}% margin needs about ${formatINR(Math.round(margin.marginRequired))} (~${margin.leverage.toFixed(1)}x).`;
  })();

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] shadow-[var(--shadow-glow)] sm:rounded-2xl">
      {/* Scrollable Groww-style tabs */}
      <div className="border-b border-[var(--border)] px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex min-w-full gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-1 sm:min-w-0">
              {tabs.map((t) => {
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-[0.06em] transition-colors sm:px-4 sm:text-xs ${
                      on
                        ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="hidden shrink-0 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] md:block">
            Instant estimate
          </p>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 border-b border-[var(--border)] p-4 sm:space-y-8 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          {tab === "sip" && (
            <>
              <SliderField
                label="Monthly investment"
                value={sipAmt}
                onChange={setSipAmt}
                min={500}
                max={200000}
                step={500}
                prefix="₹"
              />
              <SliderField
                label="Expected return rate (p.a)"
                value={sipRate}
                onChange={setSipRate}
                min={1}
                max={30}
                step={0.5}
                suffix="%"
              />
              <SliderField
                label="Time period"
                value={sipYears}
                onChange={setSipYears}
                min={1}
                max={40}
                step={1}
                suffix="Yr"
              />
            </>
          )}

          {tab === "lumpsum" && (
            <>
              <SliderField
                label="Total investment"
                value={lumpAmt}
                onChange={setLumpAmt}
                min={1000}
                max={10000000}
                step={1000}
                prefix="₹"
              />
              <SliderField
                label="Expected return rate (p.a)"
                value={lumpRate}
                onChange={setLumpRate}
                min={1}
                max={30}
                step={0.5}
                suffix="%"
              />
              <SliderField
                label="Time period"
                value={lumpYears}
                onChange={setLumpYears}
                min={1}
                max={40}
                step={1}
                suffix="Yr"
              />
            </>
          )}

          {tab === "swp" && (
            <>
              <SliderField
                label="Total investment"
                value={swpCorpus}
                onChange={setSwpCorpus}
                min={100000}
                max={50000000}
                step={50000}
                prefix="₹"
              />
              <SliderField
                label="Withdrawal per month"
                value={swpWithdraw}
                onChange={setSwpWithdraw}
                min={1000}
                max={500000}
                step={1000}
                prefix="₹"
              />
              <SliderField
                label="Expected return rate (p.a)"
                value={swpRate}
                onChange={setSwpRate}
                min={1}
                max={20}
                step={0.5}
                suffix="%"
              />
              <SliderField
                label="Time period"
                value={swpYears}
                onChange={setSwpYears}
                min={1}
                max={40}
                step={1}
                suffix="Yr"
              />
            </>
          )}

          {tab === "gst" && (
            <>
              <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
                {(["exclusive", "inclusive"] as GstMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setGstMode(m)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                      gstMode === m
                        ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <SliderField
                label="Amount"
                value={gstAmount}
                onChange={setGstAmount}
                min={100}
                max={10000000}
                step={100}
                prefix="₹"
              />
              <SliderField
                label="GST rate"
                value={gstRate}
                onChange={setGstRate}
                min={0}
                max={28}
                step={1}
                suffix="%"
              />
            </>
          )}

          {tab === "emi" && (
            <>
              <SliderField
                label="Loan amount"
                value={emiPrincipal}
                onChange={setEmiPrincipal}
                min={50000}
                max={50000000}
                step={10000}
                prefix="₹"
              />
              <SliderField
                label="Interest rate (p.a)"
                value={emiRate}
                onChange={setEmiRate}
                min={1}
                max={24}
                step={0.1}
                suffix="%"
              />
              <SliderField
                label="Loan tenure"
                value={emiYears}
                onChange={setEmiYears}
                min={1}
                max={30}
                step={1}
                suffix="Yr"
              />
            </>
          )}

          {tab === "brokerage" && (
            <>
              <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
                {([
                  ["delivery", "Delivery"],
                  ["intraday", "Intraday"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSegment(id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                      segment === id
                        ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <SliderField
                label="Buy price"
                value={buyPrice}
                onChange={setBuyPrice}
                min={1}
                max={10000}
                step={1}
                prefix="₹"
              />
              <SliderField
                label="Sell price"
                value={sellPrice}
                onChange={setSellPrice}
                min={1}
                max={10000}
                step={1}
                prefix="₹"
              />
              <SliderField
                label="Quantity"
                value={brokerQty}
                onChange={setBrokerQty}
                min={1}
                max={10000}
                step={1}
              />
            </>
          )}

          {tab === "margin" && (
            <>
              <SliderField
                label="Share price"
                value={marginPrice}
                onChange={setMarginPrice}
                min={1}
                max={10000}
                step={1}
                prefix="₹"
              />
              <SliderField
                label="Quantity"
                value={marginQty}
                onChange={setMarginQty}
                min={1}
                max={10000}
                step={1}
              />
              <SliderField
                label="Margin required"
                value={marginPct}
                onChange={setMarginPct}
                min={5}
                max={100}
                step={1}
                suffix="%"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Tip: 20% margin ≈ 5x leverage (illustrative equity intraday
                style).
              </p>
            </>
          )}

          <p className="rounded-xl bg-[var(--bg-secondary)] px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            {summary}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-6 bg-[var(--bg-secondary)]/60 p-4 sm:gap-8 sm:p-6 md:p-8">
          {(tab === "sip" || tab === "lumpsum") && (
            <InvestResults
              invested={tab === "sip" ? sip.invested : lump.invested}
              gains={tab === "sip" ? sip.gains : lump.gains}
              total={tab === "sip" ? sip.futureValue : lump.futureValue}
            />
          )}

          {tab === "swp" && (
            <>
              <div className="space-y-1">
                <ResultRow
                  label="Total withdrawn"
                  value={formatINR(Math.round(swp.totalWithdrawn))}
                />
                <ResultRow
                  label="Ending corpus"
                  value={formatINR(Math.round(swp.endingCorpus))}
                  accent
                />
                <div className="mt-2 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--text-secondary)]">Status</p>
                  <p className="display mt-1 text-2xl sm:text-3xl md:text-4xl">
                    {swp.sustained
                      ? "Sustains full period"
                      : `~${swp.yearsLasted.toFixed(1)} years`}
                  </p>
                </div>
              </div>
              <Donut
                a={Math.max(0, swp.endingCorpus)}
                b={Math.max(0, swp.totalWithdrawn)}
                aLabel="Ending corpus"
                bLabel="Withdrawn"
                centerHint="out"
                aColor="var(--accent)"
                bColor="var(--accent-2)"
              />
            </>
          )}

          {tab === "gst" && (
            <>
              <div className="space-y-1">
                <ResultRow
                  label="Taxable value"
                  value={formatINR(Math.round(gst.base))}
                />
                <ResultRow
                  label="GST"
                  value={formatINR(Math.round(gst.gst))}
                  accent
                />
                <ResultRow
                  label="CGST / SGST"
                  value={`${formatINR(Math.round(gst.cgst))} each`}
                />
                <div className="mt-2 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--text-secondary)]">Total</p>
                  <p className="display mt-1 break-all text-3xl tabular-nums text-[var(--accent-2)] sm:text-4xl md:text-5xl">
                    {formatINR(Math.round(gst.total))}
                  </p>
                </div>
              </div>
              <Donut
                a={gst.base}
                b={Math.max(0, gst.gst)}
                aLabel="Base amount"
                bLabel="GST"
                centerHint="tax"
              />
            </>
          )}

          {tab === "emi" && (
            <>
              <div className="space-y-1">
                <ResultRow
                  label="Principal"
                  value={formatINR(Math.round(emiPrincipal))}
                />
                <ResultRow
                  label="Total interest"
                  value={formatINR(Math.round(emi.interest))}
                  accent
                />
                <div className="mt-2 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Monthly EMI
                  </p>
                  <p className="display mt-1 break-all text-3xl tabular-nums text-[var(--accent-2)] sm:text-4xl md:text-5xl">
                    {formatINR(Math.round(emi.emi))}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Total payment {formatINR(Math.round(emi.totalPayment))}
                  </p>
                </div>
              </div>
              <Donut
                a={emiPrincipal}
                b={Math.max(0, emi.interest)}
                aLabel="Principal"
                bLabel="Interest"
                centerHint="interest"
              />
            </>
          )}

          {tab === "brokerage" && (
            <>
              <div className="space-y-1">
                <ResultRow
                  label="Turnover"
                  value={formatINR(Math.round(broker.turnover))}
                />
                <ResultRow
                  label="Brokerage"
                  value={formatINR(Math.round(broker.brokerage))}
                />
                <ResultRow label="STT" value={formatINR(Math.round(broker.stt))} />
                <ResultRow
                  label="Exchange + SEBI + IPFT"
                  value={formatINR(
                    Math.round(broker.exchange + broker.sebi + broker.ipft)
                  )}
                />
                <ResultRow
                  label="Stamp + GST + DP"
                  value={formatINR(
                    Math.round(broker.stamp + broker.gst + broker.dp)
                  )}
                />
                <ResultRow
                  label="Total charges"
                  value={formatINR(Math.round(broker.totalCharges))}
                  accent
                />
                <div className="mt-2 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--text-secondary)]">Net P&L</p>
                  <p
                    className={`display mt-1 break-all text-3xl tabular-nums sm:text-4xl md:text-5xl ${
                      broker.netPnL >= 0
                        ? "text-[var(--positive)]"
                        : "text-[var(--danger)]"
                    }`}
                  >
                    {formatINR(Math.round(broker.netPnL))}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Gross P&L {formatINR(Math.round(broker.grossPnL))}
                  </p>
                </div>
              </div>
              <Donut
                a={Math.max(0, broker.buyValue)}
                b={Math.max(0, broker.totalCharges)}
                aLabel="Buy value"
                bLabel="Total charges"
                centerHint="cost"
              />
            </>
          )}

          {tab === "margin" && (
            <>
              <div className="space-y-1">
                <ResultRow
                  label="Trade value"
                  value={formatINR(Math.round(margin.tradeValue))}
                />
                <ResultRow
                  label="Leverage"
                  value={`${margin.leverage.toFixed(1)}x`}
                />
                <ResultRow
                  label="Margin %"
                  value={`${margin.marginPercent}%`}
                />
                <div className="mt-2 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Margin required
                  </p>
                  <p className="display mt-1 break-all text-3xl tabular-nums text-[var(--accent-2)] sm:text-4xl md:text-5xl">
                    {formatINR(Math.round(margin.marginRequired))}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Exposure {formatINR(Math.round(margin.exposure))}
                  </p>
                </div>
              </div>
              <Donut
                a={margin.marginRequired}
                b={Math.max(0, margin.tradeValue - margin.marginRequired)}
                aLabel="Your margin"
                bLabel="Broker exposure"
                centerHint="fund"
                aColor="var(--accent-2)"
                bColor="var(--text-muted)"
              />
            </>
          )}

          <p className="text-[11px] leading-relaxed text-[var(--warning)]">
            Illustrative only — charges & margins vary by broker, exchange, and
            product. Not SEBI-registered advice.
          </p>
        </div>
      </div>
    </div>
  );
}

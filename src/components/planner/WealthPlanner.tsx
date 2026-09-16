"use client";

import { useEffect, useMemo, useState } from "react";
import { sipFutureValue } from "@/lib/calculators";
import {
  classifyDebt,
  inflationFutureValue,
  realValueAfterInflation,
  salaryBuffers,
  sipYearlyPath,
  swpCorpusNeeded,
  yearsToSipTarget,
} from "@/lib/planner";
import { cn, formatINR, formatPercent } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll-to-id";
import { PlannerSlider } from "@/components/planner/PlannerSlider";

const GOAL_PRESETS = [10_000, 50_000, 1_00_000] as const;
const SIP_PRESETS = [5_000, 10_000, 25_000] as const;

const JUMP = [
  { id: "snapshot", label: "Desk" },
  { id: "investing", label: "SIP" },
  { id: "goal", label: "Goal" },
  { id: "debt", label: "Debt" },
  { id: "savings", label: "Buffers" },
  { id: "inflation", label: "Inflation" },
] as const;

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
      <p className="display mt-1 text-xl tabular-nums md:text-2xl">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
}

function SipPathChart({
  points,
}: {
  points: { year: number; futureValue: number; invested: number }[];
}) {
  if (points.length < 2) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Move years of discipline to see the path.</p>
    );
  }
  const w = 520;
  const h = 140;
  const max = Math.max(...points.map((p) => p.futureValue), 1);
  const x = (i: number) => (i / (points.length - 1)) * w;
  const y = (v: number) => 8 + ((max - v) / max) * (h - 16);
  const future = points.map((p, i) => `${x(i)},${y(p.futureValue)}`).join(" ");
  const invested = points.map((p, i) => `${x(i)},${y(p.invested)}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full min-w-[280px]" aria-hidden>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1="0"
            x2={w}
            y1={h * g}
            y2={h * g}
            stroke="var(--border)"
            strokeDasharray="4 6"
          />
        ))}
        <polygon points={`0,${h} ${future} ${w},${h}`} fill="var(--accent)" opacity="0.12" />
        <polyline points={invested} fill="none" stroke="var(--text-muted)" strokeWidth="1.4" />
        <polyline points={future} fill="none" stroke="var(--accent-2)" strokeWidth="2.2" />
      </svg>
      <div className="mt-2 flex gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        <span className="text-[var(--accent-2)]">Corpus</span>
        <span>Invested</span>
      </div>
    </div>
  );
}

export function WealthPlanner() {
  const [sipAmt, setSipAmt] = useState(10_000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(15);

  const [wantMonth, setWantMonth] = useState(50_000);
  const [monthlyYield, setMonthlyYield] = useState(0.5);

  const [debtAmount, setDebtAmount] = useState(5_00_000);
  const [debtRate, setDebtRate] = useState(14);
  const [investRate, setInvestRate] = useState(12);

  const [salary, setSalary] = useState(50_000);

  const [todayCost, setTodayCost] = useState(1_00_000);
  const [inflation, setInflation] = useState(6);
  const [inflYears, setInflYears] = useState(10);

  const sip = useMemo(
    () => sipFutureValue(sipAmt, sipRate, sipYears),
    [sipAmt, sipRate, sipYears]
  );
  const goal = useMemo(
    () => swpCorpusNeeded(wantMonth, monthlyYield),
    [wantMonth, monthlyYield]
  );
  const debt = useMemo(
    () => classifyDebt(debtRate, investRate, debtAmount),
    [debtRate, investRate, debtAmount]
  );
  const buffers = useMemo(() => salaryBuffers(salary), [salary]);
  const infl = useMemo(
    () => inflationFutureValue(todayCost, inflation, inflYears),
    [todayCost, inflation, inflYears]
  );
  const path = useMemo(
    () => sipYearlyPath(sipAmt, sipRate, sipYears),
    [sipAmt, sipRate, sipYears]
  );
  const pace = useMemo(
    () => yearsToSipTarget(sipAmt, sipRate, goal.corpus),
    [sipAmt, sipRate, goal.corpus]
  );
  const coverage = goal.corpus > 0 ? Math.min(100, (sip.futureValue / goal.corpus) * 100) : 0;
  const gap = Math.max(0, goal.corpus - sip.futureValue);
  const sipOfSalary = salary > 0 ? (sipAmt / salary) * 100 : 0;
  const realSip = useMemo(
    () => realValueAfterInflation(sip.futureValue, inflation, sipYears),
    [sip.futureValue, inflation, sipYears]
  );

  const debtTone =
    debt.kind === "good"
      ? "text-[var(--positive)]"
      : debt.kind === "bad"
        ? "text-[var(--danger)]"
        : "text-[var(--warning)]";

  useEffect(() => {
    const go = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      window.setTimeout(() => scrollToId(id), 80);
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2">
        {JUMP.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              window.history.replaceState(null, "", `#${item.id}`);
              scrollToId(item.id);
            }}
            className="border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <section id="snapshot" className="ig-sheet scroll-mt-28 overflow-hidden border border-[var(--border)]">
        <div className="ig-mast px-4 py-6 sm:px-6 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--accent-strong)]">
            Live desk · not advice
          </p>
          <h3 className="display mt-2 text-3xl md:text-4xl">Your plan in one look</h3>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            SIP, SWP corpus, debt spread and salary buffers use the same sliders below. Change one number — this
            strip updates.
          </p>
        </div>
        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[var(--surface-elevated)] p-4">
            <Stat
              label="SIP corpus"
              value={formatINR(Math.round(sip.futureValue), true)}
              hint={`${sipYears}y · ${formatPercent(sipRate)} p.a.`}
            />
          </div>
          <div className="bg-[var(--surface-elevated)] p-4">
            <Stat
              label="SWP need"
              value={formatINR(Math.round(goal.corpus), true)}
              hint={`${formatINR(wantMonth)} / month`}
            />
          </div>
          <div className="bg-[var(--surface-elevated)] p-4">
            <Stat
              label="Goal coverage"
              value={`${coverage.toFixed(0)}%`}
              hint={
                pace.reached
                  ? `SIP reaches the corpus in ~${pace.years} year${pace.years === 1 ? "" : "s"}`
                  : `Gap ${formatINR(Math.round(gap), true)} after ${sipYears}y`
              }
            />
          </div>
          <div className="bg-[var(--surface-elevated)] p-4">
            <Stat
              label="Debt read"
              value={debt.kind}
              hint={`${debt.spread >= 0 ? "+" : ""}${formatPercent(debt.spread)} spread`}
            />
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <div className="ig-meter">
            <span style={{ width: `${coverage}%` }} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            Coverage is SIP future value ÷ SWP corpus. Not a forecast. SIP is {formatPercent(sipOfSalary)} of
            salary in this sketch.
          </p>
        </div>
      </section>

      <section id="investing" className="scroll-mt-28 overflow-hidden border border-[var(--border)]">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="space-y-6 border-b border-[var(--border)] p-4 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Investing · SIP → SWP
            </p>
            <h3 className="display text-3xl uppercase md:text-4xl">Discipline first</h3>
            <div className="flex flex-wrap gap-2">
              {SIP_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSipAmt(n)}
                  className={cn(
                    "px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]",
                    sipAmt === n
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                      : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  ₹{n.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <PlannerSlider
              label="Monthly SIP"
              value={sipAmt}
              onChange={setSipAmt}
              min={0}
              max={2_00_000}
              step={500}
              prefix="₹"
            />
            <PlannerSlider
              label="Expected return (p.a)"
              value={sipRate}
              onChange={setSipRate}
              min={1}
              max={20}
              step={0.5}
              suffix="%"
            />
            <PlannerSlider
              label="Years of discipline"
              value={sipYears}
              onChange={setSipYears}
              min={1}
              max={40}
              step={1}
              suffix="Yr"
            />
          </div>
          <div className="bg-[var(--bg-secondary)]/60 p-4 sm:p-6 md:p-8">
            <p className="text-sm text-[var(--text-secondary)]">After a proper discipline</p>
            <p className="display mt-2 break-all text-4xl tabular-nums text-[var(--accent-2)] md:text-5xl">
              {formatINR(Math.round(sip.futureValue))}
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--text-muted)]">Invested</dt>
                <dd className="tabular-nums">{formatINR(Math.round(sip.invested))}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--text-muted)]">Est. gains</dt>
                <dd className="tabular-nums text-[var(--accent-2)]">{formatINR(Math.round(sip.gains))}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--text-muted)]">Today’s buying power</dt>
                <dd className="tabular-nums">{formatINR(Math.round(realSip))}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <SipPathChart points={path} />
            </div>
          </div>
        </div>
      </section>

      <section id="goal" className="scroll-mt-28 overflow-hidden border border-[var(--border)]">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="space-y-6 border-b border-[var(--border)] p-4 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Goal planner</p>
            <h3 className="display text-3xl uppercase md:text-4xl">If I want this / month</h3>
            <div className="flex flex-wrap gap-2">
              {GOAL_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setWantMonth(n)}
                  className={cn(
                    "px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]",
                    wantMonth === n
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                      : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  ₹{n.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <PlannerSlider
              label="Desired monthly income"
              value={wantMonth}
              onChange={setWantMonth}
              min={1_000}
              max={5_00_000}
              step={1_000}
              prefix="₹"
            />
            <PlannerSlider
              label="Monthly yield"
              value={monthlyYield}
              onChange={setMonthlyYield}
              min={0.1}
              max={2}
              step={0.1}
              suffix="%"
            />
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              Corpus = (monthly income × 100) ÷ monthly yield. At 0.5% a month, ₹50,000 SWP needs ₹1 Cr — the
              notebook formula.
            </p>
          </div>
          <div className="bg-[var(--bg-secondary)]/60 p-4 sm:p-6 md:p-8">
            <p className="text-sm text-[var(--text-secondary)]">So SWP need</p>
            <p className="display mt-2 break-all text-4xl tabular-nums text-[var(--accent-2)] md:text-5xl">
              {formatINR(Math.round(goal.corpus))}
            </p>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              ~{formatPercent(goal.annualRatePercent)} simple annual · {formatINR(wantMonth)} / month
            </p>
            <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              {pace.reached
                ? `This SIP sketch hits that corpus in about ${pace.years} years at the return you typed.`
                : `This SIP does not reach the SWP corpus in ${sipYears} years. Shortfall ${formatINR(Math.round(gap))}.`}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Stat label="Coverage" value={`${coverage.toFixed(0)}%`} />
              <Stat label="Shortfall" value={formatINR(Math.round(gap), true)} />
            </div>
          </div>
        </div>
      </section>

      <section id="debt" className="scroll-mt-28 overflow-hidden border border-[var(--border)]">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="space-y-6 border-b border-[var(--border)] p-4 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Debt planner</p>
            <h3 className="display text-3xl uppercase md:text-4xl">Good or bad</h3>
            <PlannerSlider
              label="Debt amount"
              value={debtAmount}
              onChange={setDebtAmount}
              min={10_000}
              max={2_00_00_000}
              step={10_000}
              prefix="₹"
            />
            <PlannerSlider
              label="Debt interest (p.a)"
              value={debtRate}
              onChange={setDebtRate}
              min={1}
              max={36}
              step={0.5}
              suffix="%"
            />
            <PlannerSlider
              label="If that money were invested (p.a)"
              value={investRate}
              onChange={setInvestRate}
              min={1}
              max={24}
              step={0.5}
              suffix="%"
            />
          </div>
          <div className="bg-[var(--bg-secondary)]/60 p-4 sm:p-6 md:p-8">
            <p className="text-sm text-[var(--text-secondary)]">Difference</p>
            <p className={`display mt-2 text-4xl md:text-5xl ${debtTone}`}>
              {debt.spread >= 0 ? "+" : ""}
              {formatPercent(debt.spread)}
            </p>
            <p className={`mt-3 text-sm font-semibold uppercase tracking-[0.16em] ${debtTone}`}>
              {debt.kind} debt
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {debt.verdict} Spread on {formatINR(debtAmount)} is about{" "}
              {formatINR(Math.round(Math.abs(debt.yearlyGap)))} a year.
            </p>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Teaching rule only: compare the loan rate with an assumed return. Real loans have fees, tax, and
              risk.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="savings" className="scroll-mt-28 border border-[var(--border)] p-4 sm:p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Savings · Emergency
          </p>
          <h3 className="display mt-2 text-3xl uppercase">Salary buffers</h3>
          <div className="mt-6">
            <PlannerSlider
              label="Monthly salary"
              value={salary}
              onChange={setSalary}
              min={10_000}
              max={10_00_000}
              step={1_000}
              prefix="₹"
            />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="border border-[var(--border)] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Saving · 6 months
              </p>
              <p className="display mt-3 text-2xl tabular-nums md:text-3xl">
                {formatINR(buffers.savingsTarget)}
              </p>
            </div>
            <div className="border border-[var(--border)] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Emergency · 3 months
              </p>
              <p className="display mt-3 text-2xl tabular-nums md:text-3xl">
                {formatINR(buffers.emergencyTarget)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Combined cash cushion {formatINR(buffers.combinedTarget)}. SIP above is {formatPercent(sipOfSalary)} of
            this salary — a sketch, not a payroll instruction.
          </p>
        </section>

        <section id="inflation" className="scroll-mt-28 border border-[var(--border)] p-4 sm:p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Inflation calculator
          </p>
          <h3 className="display mt-2 text-3xl uppercase">Tomorrow&apos;s cost</h3>
          <div className="mt-6 space-y-5">
            <PlannerSlider
              label="Today&apos;s amount"
              value={todayCost}
              onChange={setTodayCost}
              min={1_000}
              max={1_00_00_000}
              step={1_000}
              prefix="₹"
            />
            <PlannerSlider
              label="Inflation (p.a)"
              value={inflation}
              onChange={setInflation}
              min={1}
              max={15}
              step={0.5}
              suffix="%"
            />
            <PlannerSlider
              label="Years"
              value={inflYears}
              onChange={setInflYears}
              min={1}
              max={40}
              step={1}
              suffix="Yr"
            />
          </div>
          <p className="display mt-6 text-3xl tabular-nums text-[var(--accent-2)] md:text-4xl">
            {formatINR(Math.round(infl.future))}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Extra {formatINR(Math.round(infl.extraNeeded))} to keep the same buying power. Your SIP corpus in{" "}
            {sipYears} years is about {formatINR(Math.round(realSip))} in today&apos;s rupees at this inflation.
          </p>
        </section>
      </div>
    </div>
  );
}

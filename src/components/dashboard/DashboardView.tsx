"use client";

import type { DashboardData } from "@/types";
import { greetingForHour, formatINR, formatPercent, cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { WealthScoreViz } from "@/components/wealth/WealthScoreViz";
import { AiInsightCard } from "@/components/wealth/AiInsightCard";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

/**
 * Dashboard Module — display only.
 * All values arrive precomputed from Wealth Engine / Goal Engine / AI.
 */
export function DashboardView({ data }: { data: DashboardData }) {
  const hasData =
    data.metrics.monthlyIncome > 0 ||
    data.metrics.totalAssets > 0 ||
    data.metrics.totalLiabilities > 0;

  if (!hasData) {
    return (
      <div className="px-5 py-16 md:px-8">
        <p className="eyebrow">Module 6 · Dashboard</p>
        <h1 className="display mt-4 text-5xl">
          {greetingForHour()}, {data.profile.name}.
        </h1>
        <div className="mt-12">
          <EmptyState
            title="Your wealth story starts here."
            description="Module 2 needs data before the Wealth Engine can speak."
            ctaLabel="Add income"
            ctaHref="/finance/income"
          />
        </div>
      </div>
    );
  }

  const primaryGoal = data.goals[0];
  const change = data.netWorthChangePercent;

  return (
    <div className="px-5 py-12 md:px-8 md:py-16">
      <header className="grid gap-8 border-b border-[var(--border)] pb-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="eyebrow">Module 6 · Dashboard</p>
          <h1 className="display mt-4 text-4xl md:text-6xl">
            {greetingForHour()}, {data.profile.name}.
          </h1>
          <p className="mt-4 max-w-md text-[var(--text-secondary)]">
            Display layer only — numbers computed upstream by Profile → Finance →
            Wealth Engine → Goals → AI.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] md:items-end md:text-right">
          <p>User ID {data.profile.userId}</p>
          <p>{data.profile.profession}</p>
          <p>KYC {data.profile.kycStatus.replace("_", " ")}</p>
          <Link href="/profile" className="link-underline text-[var(--accent)]">
            Module 1 · Profile
          </Link>
        </div>
      </header>

      {/* Card 1 — Net Worth as editorial giant type */}
      <section className="border-b border-[var(--border)] py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="eyebrow">01 · Net Worth</p>
          <Link
            href="/wealth-map"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
          >
            Open map →
          </Link>
        </div>
        <p className="display mt-4 text-[clamp(3.5rem,12vw,8rem)] leading-none">
          <AnimatedNumber value={data.metrics.netWorth} format="inr" />
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-[var(--text-secondary)]">
          <span>Assets {formatINR(data.metrics.totalAssets)}</span>
          <span>− Liabilities {formatINR(data.metrics.totalLiabilities)}</span>
          {change != null ? (
            <span
              className={cn(
                change >= 0 ? "text-[var(--accent)]" : "text-[var(--danger)]"
              )}
            >
              {change >= 0 ? "+" : ""}
              {formatPercent(change)} vs prior
            </span>
          ) : null}
        </div>
      </section>

      {/* Card 2 + 3 */}
      <section className="grid border-b border-[var(--border)] md:grid-cols-2">
        <div className="border-b border-[var(--border)] py-12 md:border-b-0 md:border-r md:pr-10">
          <p className="eyebrow">02 · Wealth Score</p>
          <p className="display mt-4 text-7xl text-[var(--accent)] md:text-8xl">
            {data.wealthScore.score}
            <span className="text-3xl text-[var(--text-muted)]"> / 100</span>
          </p>
          <p className="mt-4 max-w-sm text-sm text-[var(--text-secondary)]">
            {data.wealthScore.recommendations[0]}
          </p>
          <Link
            href="#score-detail"
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
          >
            Why this score
          </Link>
        </div>
        <div className="py-12 md:pl-10">
          <p className="eyebrow">03 · Monthly Savings</p>
          <p className="display mt-4 text-6xl md:text-7xl">
            {formatINR(data.metrics.monthlySavings)}
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <dt className="text-[var(--text-muted)]">Income</dt>
              <dd>{formatINR(data.metrics.monthlyIncome)}</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <dt className="text-[var(--text-muted)]">Expenses</dt>
              <dd>{formatINR(data.metrics.monthlyExpenses)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Savings rate</dt>
              <dd className="text-[var(--accent)]">
                {formatPercent(data.metrics.savingsRate)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Card 4 — Goals */}
      <section className="border-b border-[var(--border)] py-14">
        <div className="flex items-end justify-between gap-4">
          <p className="eyebrow">04 · Goal Progress</p>
          <Link
            href="/goals"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
          >
            Module 4 →
          </Link>
        </div>
        {primaryGoal ? (
          <div className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="display text-4xl md:text-5xl">{primaryGoal.name}</h2>
              <p className="display text-6xl text-[var(--accent)]">
                {primaryGoal.progressPercent.toFixed(0)}%
              </p>
            </div>
            <div className="mt-6 h-px bg-[var(--border)]">
              <div
                className="h-px bg-[var(--accent)] transition-all duration-700"
                style={{
                  width: `${Math.min(100, primaryGoal.progressPercent)}%`,
                }}
              />
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Required {formatINR(primaryGoal.requiredMonthlySavings)} / month ·{" "}
              {primaryGoal.onTrack ? "On track" : "Needs acceleration"}
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="Give your money somewhere to go."
              ctaLabel="Create a goal"
              ctaHref="/goals"
            />
          </div>
        )}
      </section>

      {/* Card 5 — AI */}
      <section className="py-14">
        <div className="flex items-end justify-between gap-4">
          <p className="eyebrow">05 · AI Recommendation</p>
          <Link
            href="/coach"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
          >
            Module 5 · Coach →
          </Link>
        </div>
        <div className="mt-8">
          {data.insight ? <AiInsightCard insight={data.insight} /> : null}
        </div>
      </section>

      {/* Architecture strip */}
      <section className="invert-block mt-4 px-6 py-10 md:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-60">
          System pipeline
        </p>
        <p className="display mt-4 text-2xl leading-snug md:text-3xl">
          Profile → Finance → Engine → Goals → AI → Dashboard
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
          <Link href="/finance" className="hover:opacity-100">
            Money
          </Link>
          <Link href="/finance/income" className="hover:opacity-100">
            Income
          </Link>
          <Link href="/finance/expenses" className="hover:opacity-100">
            Expenses
          </Link>
          <Link href="/finance/assets" className="hover:opacity-100">
            Assets
          </Link>
          <Link href="/finance/liabilities" className="hover:opacity-100">
            Liabilities
          </Link>
        </div>
      </section>

      <section id="score-detail" className="scroll-mt-24 py-14">
        <p className="eyebrow">Wealth Engine detail</p>
        <div className="mt-8">
          <WealthScoreViz result={data.wealthScore} />
        </div>
        <dl className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
          <div className="border-t border-[var(--border)] pt-4">
            <dt className="text-[var(--text-muted)]">Debt ratio</dt>
            <dd className="display mt-2 text-3xl">
              {formatPercent(data.metrics.debtRatio)}
            </dd>
          </div>
          <div className="border-t border-[var(--border)] pt-4">
            <dt className="text-[var(--text-muted)]">Emergency fund</dt>
            <dd className="display mt-2 text-3xl">
              {data.metrics.emergencyFundMonths.toFixed(1)} mo
            </dd>
          </div>
          <div className="border-t border-[var(--border)] pt-4">
            <dt className="text-[var(--text-muted)]">Liquid assets</dt>
            <dd className="display mt-2 text-3xl">
              {formatINR(data.metrics.liquidAssets)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

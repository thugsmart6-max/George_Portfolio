/** Wealth planner helpers — SIP/SWP, salary buffers, inflation, debt quality. */

import { sipFutureValue } from "@/lib/calculators";

export const SAVINGS_MONTHS = 6;
export const EMERGENCY_MONTHS = 3;

export function salaryBuffers(monthlySalary: number) {
  const salary = Math.max(0, monthlySalary);
  return {
    savingsTarget: salary * SAVINGS_MONTHS,
    emergencyTarget: salary * EMERGENCY_MONTHS,
    combinedTarget: salary * (SAVINGS_MONTHS + EMERGENCY_MONTHS),
  };
}

/**
 * Reverse SWP: corpus needed so `monthlyRatePercent` of the corpus
 * equals the desired monthly withdrawal.
 *
 * Paper: (? × 0.5) / 100 = 50,000  →  NEED = ₹1,00,00,000
 */
export function swpCorpusNeeded(
  monthlyWithdrawal: number,
  monthlyRatePercent: number
) {
  const withdrawal = Math.max(0, monthlyWithdrawal);
  const rate = monthlyRatePercent;
  if (rate <= 0) {
    return {
      corpus: 0,
      annualRatePercent: 0,
      monthlyYield: 0,
    };
  }
  return {
    corpus: (withdrawal * 100) / rate,
    annualRatePercent: rate * 12,
    monthlyYield: withdrawal,
  };
}

export function inflationFutureValue(
  amount: number,
  annualInflationPercent: number,
  years: number
) {
  const today = Math.max(0, amount);
  const y = Math.max(0, years);
  const future = today * Math.pow(1 + annualInflationPercent / 100, y);
  return {
    today,
    future,
    extraNeeded: Math.max(0, future - today),
    purchasingPower: future > 0 ? today / future : 1,
  };
}

export type DebtKind = "good" | "bad" | "neutral";

export function classifyDebt(
  debtInterestPercent: number,
  investmentReturnPercent: number,
  debtAmount = 0
) {
  const spread = investmentReturnPercent - debtInterestPercent;
  const kind: DebtKind =
    spread > 0.05 ? "good" : spread < -0.05 ? "bad" : "neutral";
  const yearlyGap = (debtAmount * spread) / 100;

  return {
    spread,
    kind,
    yearlyGap,
    verdict:
      kind === "good"
        ? "Good debt — expected return beats the interest cost."
        : kind === "bad"
          ? "Bad debt — interest costs more than you can reasonably earn."
          : "Neutral — cost and return are too close to call.",
  };
}

export function sipYearlyPath(
  monthlyInvestment: number,
  annualRatePercent: number,
  years: number
) {
  const y = Math.max(0, Math.round(years));
  return Array.from({ length: y + 1 }, (_, year) => {
    const row = sipFutureValue(monthlyInvestment, annualRatePercent, year);
    return { year, invested: row.invested, futureValue: row.futureValue, gains: row.gains };
  });
}

export function yearsToSipTarget(
  monthlyInvestment: number,
  annualRatePercent: number,
  target: number,
  maxYears = 40
) {
  const goal = Math.max(0, target);
  if (goal <= 0) {
    return { years: 0, reached: true, value: 0 };
  }
  for (let year = 1; year <= maxYears; year += 1) {
    const row = sipFutureValue(monthlyInvestment, annualRatePercent, year);
    if (row.futureValue >= goal) {
      return { years: year, reached: true, value: row.futureValue };
    }
  }
  const last = sipFutureValue(monthlyInvestment, annualRatePercent, maxYears);
  return { years: maxYears, reached: false, value: last.futureValue };
}

export function realValueAfterInflation(futureAmount: number, inflationPercent: number, years: number) {
  const n = Math.max(0, years);
  const denom = Math.pow(1 + inflationPercent / 100, n);
  if (!denom) return futureAmount;
  return futureAmount / denom;
}

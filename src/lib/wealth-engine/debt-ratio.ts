import { safeDivide } from "@/lib/utils";

/** Debt ratio as total debt relative to annualized income, as a percentage. */
export function calculateDebtRatio(
  totalDebt: number,
  monthlyIncome: number
): number {
  if (monthlyIncome <= 0) return totalDebt > 0 ? 100 : 0;
  const annualIncome = monthlyIncome * 12;
  return safeDivide(totalDebt, annualIncome) * 100;
}

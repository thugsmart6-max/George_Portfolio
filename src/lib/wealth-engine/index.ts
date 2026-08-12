import { toMonthlyAmount } from "@/lib/utils";
import type {
  AssetRecord,
  ExpenseRecord,
  FinancialGoal,
  IncomeRecord,
  LiabilityRecord,
  WealthMetrics,
  WealthScoreResult,
} from "@/types";
import { calculateNetWorth } from "./net-worth";
import {
  calculateSavings,
  calculateSavingsRate,
} from "./savings-rate";
import { calculateDebtRatio } from "./debt-ratio";
import {
  calculateEmergencyFundMonths,
  isLiquidAsset,
} from "./emergency-fund";
import { calculateWealthScore } from "./wealth-score";

export * from "./net-worth";
export * from "./savings-rate";
export * from "./debt-ratio";
export * from "./emergency-fund";
export * from "./wealth-score";

export function computeWealthMetrics(input: {
  income: IncomeRecord[];
  expenses: ExpenseRecord[];
  assets: AssetRecord[];
  liabilities: LiabilityRecord[];
}): WealthMetrics {
  const monthlyIncome = input.income.reduce(
    (sum, item) => sum + toMonthlyAmount(item.amount, item.frequency),
    0
  );
  const monthlyExpenses = input.expenses.reduce(
    (sum, item) => sum + toMonthlyAmount(item.amount, item.frequency),
    0
  );
  const totalAssets = input.assets.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  const totalLiabilities = input.liabilities.reduce(
    (sum, item) => sum + item.outstandingAmount,
    0
  );
  const liquidAssets = input.assets
    .filter((a) => isLiquidAsset(a.category))
    .reduce((sum, a) => sum + a.currentValue, 0);

  const monthlySavings = calculateSavings(monthlyIncome, monthlyExpenses);

  return {
    netWorth: calculateNetWorth(totalAssets, totalLiabilities),
    totalAssets,
    totalLiabilities,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate: calculateSavingsRate(monthlyIncome, monthlyExpenses),
    debtRatio: calculateDebtRatio(totalLiabilities, monthlyIncome),
    emergencyFundMonths: calculateEmergencyFundMonths(
      liquidAssets,
      monthlyExpenses
    ),
    liquidAssets,
  };
}

export function computeFullWealthAnalysis(input: {
  income: IncomeRecord[];
  expenses: ExpenseRecord[];
  assets: AssetRecord[];
  liabilities: LiabilityRecord[];
  goals: FinancialGoal[];
}): {
  metrics: WealthMetrics;
  wealthScore: WealthScoreResult;
} {
  const metrics = computeWealthMetrics(input);
  const uniqueAssetCategories = new Set(input.assets.map((a) => a.category))
    .size;
  const goalProgresses = input.goals.map((g) =>
    g.targetAmount > 0
      ? Math.min(100, (g.currentSavings / g.targetAmount) * 100)
      : 0
  );
  const averageGoalProgress =
    goalProgresses.length > 0
      ? goalProgresses.reduce((a, b) => a + b, 0) / goalProgresses.length
      : 0;

  const wealthScore = calculateWealthScore({
    metrics,
    uniqueAssetCategories,
    averageGoalProgress,
    goalCount: input.goals.length,
  });

  return { metrics, wealthScore };
}

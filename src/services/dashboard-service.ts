import { connectDB } from "@/lib/db";
import { WealthSnapshot } from "@/models";
import { computeFullWealthAnalysis } from "@/lib/wealth-engine";
import { projectGoals } from "@/lib/goal-engine";
import { getAllFinancialData } from "./financial-service";
import { listGoals } from "./goal-service";
import { getUserByUserId } from "./user-service";
import { generatePrimaryInsight } from "./ai-service";
import type { DashboardData } from "@/types";

function groupSum(
  items: { category: string; value: number }[]
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.category, (map.get(item.category) ?? 0) + item.value);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getDashboardData(
  userId: string
): Promise<DashboardData | null> {
  const profile = await getUserByUserId(userId);
  if (!profile) return null;

  const [{ income, expenses, assets, liabilities }, goals] = await Promise.all([
    getAllFinancialData(userId),
    listGoals(userId),
  ]);

  const { metrics, wealthScore } = computeFullWealthAnalysis({
    income,
    expenses,
    assets,
    liabilities,
    goals,
  });

  const projections = projectGoals(goals);
  const insight = generatePrimaryInsight({
    profile,
    metrics,
    wealthScore,
    goals,
    projections,
  });

  await connectDB();
  const snapshots = await WealthSnapshot.find({ userId })
    .sort({ capturedAt: -1 })
    .limit(12)
    .lean();

  // Capture a daily snapshot if none today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const hasToday = snapshots.some(
    (s) => new Date(s.capturedAt).getTime() >= startOfDay.getTime()
  );
  if (!hasToday) {
    await WealthSnapshot.create({
      userId,
      netWorth: metrics.netWorth,
      totalAssets: metrics.totalAssets,
      totalLiabilities: metrics.totalLiabilities,
      monthlyIncome: metrics.monthlyIncome,
      monthlyExpenses: metrics.monthlyExpenses,
      savingsRate: metrics.savingsRate,
      debtRatio: metrics.debtRatio,
      emergencyFundMonths: metrics.emergencyFundMonths,
      wealthScore: wealthScore.score,
      capturedAt: new Date(),
    });
  }

  const orderedSnapshots = (
    await WealthSnapshot.find({ userId }).sort({ capturedAt: 1 }).limit(12).lean()
  ).map((s) => ({
    date: new Date(s.capturedAt).toISOString(),
    netWorth: s.netWorth,
    savingsRate: s.savingsRate,
    wealthScore: s.wealthScore,
  }));

  const previous =
    orderedSnapshots.length >= 2
      ? orderedSnapshots[orderedSnapshots.length - 2]
      : null;

  const netWorthChangePercent =
    previous && previous.netWorth !== 0
      ? ((metrics.netWorth - previous.netWorth) / Math.abs(previous.netWorth)) *
        100
      : null;

  return {
    profile,
    metrics,
    wealthScore,
    goals: projections,
    insight,
    previousNetWorth: previous?.netWorth ?? null,
    netWorthChangePercent,
    assetAllocation: groupSum(
      assets.map((a) => ({ category: a.category, value: a.currentValue }))
    ),
    debtBreakdown: groupSum(
      liabilities.map((l) => ({
        category: l.category,
        value: l.outstandingAmount,
      }))
    ),
    incomeByCategory: groupSum(
      income.map((i) => ({ category: i.category, value: i.amount }))
    ),
    expenseByCategory: groupSum(
      expenses.map((e) => ({ category: e.category, value: e.amount }))
    ),
    snapshots: orderedSnapshots,
  };
}

import { clamp } from "@/lib/utils";
import type { WealthMetrics, WealthScoreResult, ScoreFactor } from "@/types";

export const SCORE_WEIGHTS = {
  savingsRate: 0.3,
  debtRatio: 0.2,
  emergencyFund: 0.2,
  netWorth: 0.15,
  diversification: 0.1,
  goals: 0.05,
} as const;

function scoreSavingsRate(rate: number): number {
  if (rate >= 40) return 100;
  if (rate >= 30) return 85;
  if (rate >= 20) return 70;
  if (rate >= 10) return 50;
  if (rate > 0) return 30;
  return 10;
}

function scoreDebtRatio(ratio: number): number {
  if (ratio <= 20) return 100;
  if (ratio <= 35) return 80;
  if (ratio <= 50) return 60;
  if (ratio <= 75) return 40;
  if (ratio <= 100) return 25;
  return 10;
}

function scoreEmergency(months: number): number {
  if (months >= 6) return 100;
  if (months >= 3) return 75;
  if (months >= 1) return 45;
  if (months > 0) return 25;
  return 5;
}

function scoreNetWorth(netWorth: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return netWorth > 0 ? 50 : 20;
  const monthsOfIncome = netWorth / monthlyIncome;
  if (monthsOfIncome >= 36) return 100;
  if (monthsOfIncome >= 24) return 85;
  if (monthsOfIncome >= 12) return 70;
  if (monthsOfIncome >= 6) return 55;
  if (monthsOfIncome >= 0) return 40;
  return 15;
}

function scoreDiversification(uniqueAssetCategories: number): number {
  if (uniqueAssetCategories >= 5) return 100;
  if (uniqueAssetCategories === 4) return 80;
  if (uniqueAssetCategories === 3) return 65;
  if (uniqueAssetCategories === 2) return 45;
  if (uniqueAssetCategories === 1) return 30;
  return 10;
}

function scoreGoals(avgProgress: number, goalCount: number): number {
  if (goalCount === 0) return 40;
  if (avgProgress >= 70) return 100;
  if (avgProgress >= 45) return 80;
  if (avgProgress >= 25) return 60;
  if (avgProgress > 0) return 45;
  return 25;
}

function statusFromScore(score: number): ScoreFactor["status"] {
  if (score >= 75) return "strong";
  if (score >= 50) return "moderate";
  return "weak";
}

export function calculateWealthScore(input: {
  metrics: WealthMetrics;
  uniqueAssetCategories: number;
  averageGoalProgress: number;
  goalCount: number;
}): WealthScoreResult {
  const { metrics, uniqueAssetCategories, averageGoalProgress, goalCount } =
    input;

  const factors: Omit<ScoreFactor, "weightedScore">[] = [
    {
      key: "savingsRate",
      label: "Savings Rate",
      score: scoreSavingsRate(metrics.savingsRate),
      weight: SCORE_WEIGHTS.savingsRate,
      status: "moderate",
      detail: `You save ${metrics.savingsRate.toFixed(1)}% of income.`,
    },
    {
      key: "debtRatio",
      label: "Debt Ratio",
      score: scoreDebtRatio(metrics.debtRatio),
      weight: SCORE_WEIGHTS.debtRatio,
      status: "moderate",
      detail: `Debt is ${metrics.debtRatio.toFixed(1)}% of annual income.`,
    },
    {
      key: "emergencyFund",
      label: "Emergency Fund",
      score: scoreEmergency(metrics.emergencyFundMonths),
      weight: SCORE_WEIGHTS.emergencyFund,
      status: "moderate",
      detail: `${metrics.emergencyFundMonths.toFixed(1)} months of expenses covered.`,
    },
    {
      key: "netWorth",
      label: "Net Worth",
      score: scoreNetWorth(metrics.netWorth, metrics.monthlyIncome),
      weight: SCORE_WEIGHTS.netWorth,
      status: "moderate",
      detail: "Net worth relative to earning power.",
    },
    {
      key: "diversification",
      label: "Asset Diversification",
      score: scoreDiversification(uniqueAssetCategories),
      weight: SCORE_WEIGHTS.diversification,
      status: "moderate",
      detail: `${uniqueAssetCategories} asset categor${uniqueAssetCategories === 1 ? "y" : "ies"} held.`,
    },
    {
      key: "goals",
      label: "Goal Progress",
      score: scoreGoals(averageGoalProgress, goalCount),
      weight: SCORE_WEIGHTS.goals,
      status: "moderate",
      detail:
        goalCount === 0
          ? "No active goals yet."
          : `Average goal progress ${averageGoalProgress.toFixed(0)}%.`,
    },
  ];

  const breakdown: ScoreFactor[] = factors.map((f) => {
    const weightedScore = f.score * f.weight;
    return {
      ...f,
      status: statusFromScore(f.score),
      weightedScore,
    };
  });

  const score = Math.round(
    clamp(
      breakdown.reduce((sum, f) => sum + f.weightedScore, 0),
      0,
      100
    )
  );

  const strengths = breakdown
    .filter((f) => f.status === "strong")
    .map((f) => f.detail);

  const weaknesses = breakdown
    .filter((f) => f.status === "weak")
    .map((f) => f.detail);

  const recommendations: string[] = [];
  const byKey = Object.fromEntries(breakdown.map((f) => [f.key, f]));

  if (byKey.savingsRate.score < 70) {
    recommendations.push(
      "Raise your savings rate toward 30% by trimming discretionary spend."
    );
  }
  if (byKey.emergencyFund.score < 75) {
    recommendations.push(
      "Build liquid reserves to cover at least 3–6 months of expenses."
    );
  }
  if (byKey.debtRatio.score < 60) {
    recommendations.push(
      "Prioritize high-interest debt to lower your debt-to-income burden."
    );
  }
  if (byKey.diversification.score < 65) {
    recommendations.push(
      "Spread assets across more categories to reduce concentration risk."
    );
  }
  if (byKey.goals.score < 60) {
    recommendations.push(
      "Define clear goals with monthly contributions to give capital direction."
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain discipline — your fundamentals are strong. Review goals quarterly."
    );
  }

  return {
    score,
    breakdown,
    strengths:
      strengths.length > 0
        ? strengths
        : ["You are building a measurable financial foundation."],
    weaknesses:
      weaknesses.length > 0
        ? weaknesses
        : ["No critical weaknesses detected — keep refining."],
    recommendations,
  };
}

import { addMonths, monthsBetween, safeDivide } from "@/lib/utils";
import type { FinancialGoal, GoalProjection } from "@/types";

export function projectGoal(goal: FinancialGoal, asOf = new Date()): GoalProjection {
  const targetDate = new Date(goal.targetDate);
  const monthsRemaining = Math.max(1, monthsBetween(asOf, targetDate));
  const remaining = Math.max(0, goal.targetAmount - goal.currentSavings);
  const progressPercent =
    goal.targetAmount > 0
      ? Math.min(100, (goal.currentSavings / goal.targetAmount) * 100)
      : 0;

  const requiredMonthlySavings = safeDivide(remaining, monthsRemaining);
  const contribution = goal.monthlyContribution;

  let projectedCompletionDate: string | null = null;
  let expectedShortfall = 0;
  let expectedSurplus = 0;
  let onTrack = false;

  if (remaining <= 0) {
    projectedCompletionDate = asOf.toISOString();
    expectedSurplus = goal.currentSavings - goal.targetAmount;
    onTrack = true;
  } else if (contribution > 0) {
    const monthsNeeded = Math.ceil(remaining / contribution);
    const projected = addMonths(asOf, monthsNeeded);
    projectedCompletionDate = projected.toISOString();
    onTrack = projected <= targetDate;

    const projectedAtTarget =
      goal.currentSavings + contribution * monthsRemaining;
    if (projectedAtTarget >= goal.targetAmount) {
      expectedSurplus = projectedAtTarget - goal.targetAmount;
    } else {
      expectedShortfall = goal.targetAmount - projectedAtTarget;
    }
  } else {
    expectedShortfall = remaining;
    onTrack = false;
  }

  return {
    goalId: goal.id,
    name: goal.name,
    progressPercent,
    requiredMonthlySavings,
    projectedCompletionDate,
    expectedShortfall,
    expectedSurplus,
    monthsRemaining,
    onTrack,
  };
}

export function projectGoals(goals: FinancialGoal[]): GoalProjection[] {
  return goals.map((g) => projectGoal(g));
}

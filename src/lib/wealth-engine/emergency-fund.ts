import { safeDivide } from "@/lib/utils";

const LIQUID_CATEGORIES = new Set([
  "Bank Balance",
  "Cash",
  "FD",
  "Mutual Funds",
]);

export function isLiquidAsset(category: string): boolean {
  return LIQUID_CATEGORIES.has(category);
}

export function calculateEmergencyFundMonths(
  liquidAssets: number,
  monthlyExpenses: number
): number {
  if (monthlyExpenses <= 0) return liquidAssets > 0 ? 12 : 0;
  return safeDivide(liquidAssets, monthlyExpenses);
}

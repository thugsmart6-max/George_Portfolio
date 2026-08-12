import { safeDivide } from "@/lib/utils";

export function calculateSavings(income: number, expenses: number): number {
  return income - expenses;
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return safeDivide(income - expenses, income) * 100;
}

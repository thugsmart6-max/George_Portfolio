import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number, compact = false): string {
  if (!Number.isFinite(amount)) return "₹0";

  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 1_00_00_000) {
      return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    }
    if (abs >= 1_00_000) {
      return `₹${(amount / 1_00_000).toFixed(2)} L`;
    }
    if (abs >= 1_000) {
      return `₹${(amount / 1_000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(digits)}%`;
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function toMonthlyAmount(
  amount: number,
  frequency: "monthly" | "yearly" | "one-time" | "weekly"
): number {
  switch (frequency) {
    case "yearly":
      return amount / 12;
    case "weekly":
      return (amount * 52) / 12;
    case "one-time":
      return 0;
    default:
      return amount;
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function safeDivide(numerator: number, denominator: number): number {
  if (!denominator || !Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return 0;
  }
  return numerator / denominator;
}

export function monthsBetween(from: Date, to: Date): number {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  return Math.max(0, years * 12 + months);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

import { z } from "zod";

const frequency = z.enum(["monthly", "yearly", "one-time", "weekly"]);

export const incomeSchema = z.object({
  amount: z.coerce.number().positive().max(1_000_000_000),
  category: z.enum(["Salary", "Business", "Rental", "Freelance", "Other"]),
  frequency,
  date: z.coerce.date(),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export const expenseSchema = z.object({
  amount: z.coerce.number().positive().max(1_000_000_000),
  category: z.enum([
    "Food",
    "Rent",
    "Travel",
    "Shopping",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other",
  ]),
  frequency,
  date: z.coerce.date(),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export const assetSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.enum([
    "Bank Balance",
    "Mutual Funds",
    "Stocks",
    "Gold",
    "Property",
    "FD",
    "Cash",
    "Other",
  ]),
  currentValue: z.coerce.number().min(0).max(1_000_000_000_000),
  purchaseValue: z.coerce.number().min(0).max(1_000_000_000_000).optional(),
  date: z.coerce.date(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const liabilitySchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.enum([
    "Home Loan",
    "Personal Loan",
    "Credit Card",
    "Education Loan",
    "Vehicle Loan",
    "Other",
  ]),
  outstandingAmount: z.coerce.number().min(0).max(1_000_000_000_000),
  monthlyEMI: z.coerce.number().min(0).max(1_000_000_000).optional(),
  interestRate: z.coerce.number().min(0).max(100).optional(),
  dueDate: z.coerce.date().optional(),
});

export const goalSchema = z.object({
  name: z.string().trim().min(1).max(100),
  targetAmount: z.coerce.number().positive().max(1_000_000_000_000),
  currentSavings: z.coerce.number().min(0).max(1_000_000_000_000),
  targetDate: z.coerce.date(),
  monthlyContribution: z.coerce.number().min(0).max(1_000_000_000),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  category: z.enum([
    "Home",
    "Vehicle",
    "Education",
    "Retirement",
    "Emergency",
    "Travel",
    "Wedding",
    "Other",
  ]),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/)
    .optional(),
  age: z.coerce.number().int().min(16).max(100).optional(),
  profession: z.string().trim().min(2).max(80).optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  onboardingCompleted: z.boolean().optional(),
});

export const aiChatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.string().optional(),
});

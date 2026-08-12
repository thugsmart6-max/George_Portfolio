export type Frequency = "monthly" | "yearly" | "one-time" | "weekly";

export type IncomeCategory =
  | "Salary"
  | "Business"
  | "Rental"
  | "Freelance"
  | "Other";

export type ExpenseCategory =
  | "Food"
  | "Rent"
  | "Travel"
  | "Shopping"
  | "Utilities"
  | "Entertainment"
  | "Healthcare"
  | "Education"
  | "Other";

export type AssetCategory =
  | "Bank Balance"
  | "Mutual Funds"
  | "Stocks"
  | "Gold"
  | "Property"
  | "FD"
  | "Cash"
  | "Other";

export type LiabilityCategory =
  | "Home Loan"
  | "Personal Loan"
  | "Credit Card"
  | "Education Loan"
  | "Vehicle Loan"
  | "Other";

export type GoalCategory =
  | "Home"
  | "Vehicle"
  | "Education"
  | "Retirement"
  | "Emergency"
  | "Travel"
  | "Wedding"
  | "Other";

export type GoalPriority = "low" | "medium" | "high";

export type KycStatus = "not_started" | "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "pro" | "enterprise";

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  profession: string;
  profileImage?: string;
  kycStatus: KycStatus;
  subscriptionStatus: SubscriptionStatus;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeRecord {
  id: string;
  userId: string;
  amount: number;
  category: IncomeCategory;
  frequency: Frequency;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  frequency: Frequency;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetRecord {
  id: string;
  userId: string;
  name: string;
  category: AssetCategory;
  currentValue: number;
  purchaseValue?: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiabilityRecord {
  id: string;
  userId: string;
  name: string;
  category: LiabilityCategory;
  outstandingAmount: number;
  monthlyEMI?: number;
  interestRate?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  monthlyContribution: number;
  priority: GoalPriority;
  category: GoalCategory;
  createdAt: string;
  updatedAt: string;
}

export interface WealthMetrics {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number;
  debtRatio: number;
  emergencyFundMonths: number;
  liquidAssets: number;
}

export interface ScoreFactor {
  key: string;
  label: string;
  score: number;
  weight: number;
  weightedScore: number;
  status: "strong" | "moderate" | "weak";
  detail: string;
}

export interface WealthScoreResult {
  score: number;
  breakdown: ScoreFactor[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface GoalProjection {
  goalId: string;
  name: string;
  progressPercent: number;
  requiredMonthlySavings: number;
  projectedCompletionDate: string | null;
  expectedShortfall: number;
  expectedSurplus: number;
  monthsRemaining: number;
  onTrack: boolean;
}

export interface AiInsight {
  title: string;
  message: string;
  why: string;
  whatChanges: string[];
  projectedImpact: string;
  priority: "high" | "medium" | "low";
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface DashboardData {
  profile: UserProfile;
  metrics: WealthMetrics;
  wealthScore: WealthScoreResult;
  goals: GoalProjection[];
  insight: AiInsight | null;
  previousNetWorth: number | null;
  netWorthChangePercent: number | null;
  assetAllocation: { name: string; value: number }[];
  debtBreakdown: { name: string; value: number }[];
  incomeByCategory: { name: string; value: number }[];
  expenseByCategory: { name: string; value: number }[];
  snapshots: {
    date: string;
    netWorth: number;
    savingsRate: number;
    wealthScore: number;
  }[];
}

export interface SessionPayload {
  sub: string;
  userId: string;
  email: string;
  name: string;
}

import { connectDB } from "@/lib/db";
import {
  User,
  Income,
  Expense,
  Asset,
  Liability,
  Goal,
  WealthSnapshot,
  AiRecommendation,
} from "@/models";
import { hashPassword } from "@/lib/auth/password";
import { computeFullWealthAnalysis } from "@/lib/wealth-engine";
import { jsonError, jsonOk, handleApiError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return jsonError("Seed disabled in production", 403);
    }

    const body = await request.json().catch(() => ({}));
    if (body.secret !== process.env.SEED_SECRET) {
      return jsonError("Invalid seed secret", 403);
    }

    await connectDB();

    await Promise.all([
      User.deleteMany({
        email: {
          $in: ["rahul@wealthcreator.dev", "george@antonay.dev"],
        },
      }),
      Income.deleteMany({ userId: "U1001" }),
      Expense.deleteMany({ userId: "U1001" }),
      Asset.deleteMany({ userId: "U1001" }),
      Liability.deleteMany({ userId: "U1001" }),
      Goal.deleteMany({ userId: "U1001" }),
      WealthSnapshot.deleteMany({ userId: "U1001" }),
      AiRecommendation.deleteMany({ userId: "U1001" }),
    ]);

    const passwordHash = await hashPassword("George@1234");
    await User.create({
      userId: "U1001",
      name: "George Antonay",
      email: "george@antonay.dev",
      mobile: "9876543210",
      passwordHash,
      age: 28,
      profession: "Design Engineer",
      onboardingCompleted: true,
      kycStatus: "not_started",
      subscriptionStatus: "pro",
    });

    await Income.create({
      userId: "U1001",
      amount: 100000,
      category: "Salary",
      frequency: "monthly",
      date: new Date(),
      description: "Monthly salary",
    });

    const expenseRows = [
      { category: "Rent", amount: 25000 },
      { category: "Food", amount: 12000 },
      { category: "Travel", amount: 8000 },
      { category: "Utilities", amount: 5000 },
      { category: "Entertainment", amount: 6000 },
      { category: "Shopping", amount: 8000 },
      { category: "Healthcare", amount: 3000 },
      { category: "Other", amount: 3000 },
    ] as const;

    await Expense.insertMany(
      expenseRows.map((e) => ({
        userId: "U1001",
        amount: e.amount,
        category: e.category,
        frequency: "monthly",
        date: new Date(),
      }))
    );

    await Asset.insertMany([
      {
        userId: "U1001",
        name: "Savings Account",
        category: "Bank Balance",
        currentValue: 200000,
        purchaseValue: 200000,
        date: new Date(),
      },
      {
        userId: "U1001",
        name: "Equity Funds",
        category: "Mutual Funds",
        currentValue: 300000,
        purchaseValue: 250000,
        date: new Date(),
      },
      {
        userId: "U1001",
        name: "Bluechip Basket",
        category: "Stocks",
        currentValue: 200000,
        purchaseValue: 160000,
        date: new Date(),
      },
      {
        userId: "U1001",
        name: "Family Gold",
        category: "Gold",
        currentValue: 100000,
        purchaseValue: 80000,
        date: new Date(),
      },
      {
        userId: "U1001",
        name: "City Plot Share",
        category: "Property",
        currentValue: 200000,
        purchaseValue: 180000,
        date: new Date(),
      },
    ]);

    await Liability.create({
      userId: "U1001",
      name: "Personal Loan",
      category: "Personal Loan",
      outstandingAmount: 300000,
      monthlyEMI: 12000,
      interestRate: 12.5,
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 24)),
    });

    await Goal.create({
      userId: "U1001",
      name: "Buy House",
      targetAmount: 5000000,
      currentSavings: 500000,
      targetDate: new Date("2032-12-31"),
      monthlyContribution: 25000,
      priority: "high",
      category: "Home",
    });

    await Goal.create({
      userId: "U1001",
      name: "Emergency Fund",
      targetAmount: 420000,
      currentSavings: 300000,
      targetDate: new Date("2027-06-30"),
      monthlyContribution: 10000,
      priority: "high",
      category: "Emergency",
    });

    const analysis = computeFullWealthAnalysis({
      income: [
        {
          id: "1",
          userId: "U1001",
          amount: 100000,
          category: "Salary",
          frequency: "monthly",
          date: new Date().toISOString(),
          createdAt: "",
          updatedAt: "",
        },
      ],
      expenses: expenseRows.map((e, i) => ({
        id: String(i),
        userId: "U1001",
        amount: e.amount,
        category: e.category,
        frequency: "monthly" as const,
        date: new Date().toISOString(),
        createdAt: "",
        updatedAt: "",
      })),
      assets: [
        { currentValue: 200000, category: "Bank Balance" },
        { currentValue: 300000, category: "Mutual Funds" },
        { currentValue: 200000, category: "Stocks" },
        { currentValue: 100000, category: "Gold" },
        { currentValue: 200000, category: "Property" },
      ].map((a, i) => ({
        id: String(i),
        userId: "U1001",
        name: "x",
        category: a.category as never,
        currentValue: a.currentValue,
        date: new Date().toISOString(),
        createdAt: "",
        updatedAt: "",
      })),
      liabilities: [
        {
          id: "1",
          userId: "U1001",
          name: "Personal Loan",
          category: "Personal Loan" as const,
          outstandingAmount: 300000,
          createdAt: "",
          updatedAt: "",
        },
      ],
      goals: [
        {
          id: "1",
          userId: "U1001",
          name: "Buy House",
          targetAmount: 5000000,
          currentSavings: 500000,
          targetDate: "2032-12-31",
          monthlyContribution: 25000,
          priority: "high",
          category: "Home",
          createdAt: "",
          updatedAt: "",
        },
      ],
    });

    const now = new Date();
    const snapshots = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (5 - i));
      const growth = i * 18000;
      return {
        userId: "U1001",
        netWorth: 620000 + growth,
        totalAssets: 920000 + growth,
        totalLiabilities: 300000,
        monthlyIncome: 100000,
        monthlyExpenses: 70000,
        savingsRate: 30,
        debtRatio: analysis.metrics.debtRatio,
        emergencyFundMonths: analysis.metrics.emergencyFundMonths,
        wealthScore: 60 + i,
        capturedAt: d,
      };
    });
    await WealthSnapshot.insertMany(snapshots);

    return jsonOk({
      success: true,
      demo: {
        email: "george@antonay.dev",
        password: "George@1234",
        userId: "U1001",
        metrics: analysis.metrics,
        wealthScore: analysis.wealthScore.score,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

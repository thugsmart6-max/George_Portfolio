import { connectDB } from "@/lib/db";
import { Goal } from "@/models";
import { projectGoals } from "@/lib/goal-engine";
import type { FinancialGoal } from "@/types";

function mapGoal(doc: {
  _id: { toString(): string };
  userId: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: Date;
  monthlyContribution: number;
  priority: FinancialGoal["priority"];
  category: FinancialGoal["category"];
  createdAt: Date;
  updatedAt: Date;
}): FinancialGoal {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    name: doc.name,
    targetAmount: doc.targetAmount,
    currentSavings: doc.currentSavings,
    targetDate: doc.targetDate.toISOString(),
    monthlyContribution: doc.monthlyContribution,
    priority: doc.priority,
    category: doc.category,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listGoals(userId: string) {
  await connectDB();
  const docs = await Goal.find({ userId }).sort({ targetDate: 1 });
  return docs.map(mapGoal);
}

export async function createGoal(
  userId: string,
  data: Omit<FinancialGoal, "id" | "userId" | "createdAt" | "updatedAt">
) {
  await connectDB();
  const doc = await Goal.create({
    ...data,
    userId,
    targetDate: new Date(data.targetDate),
  });
  return mapGoal(doc);
}

export async function updateGoal(
  userId: string,
  id: string,
  data: Partial<Omit<FinancialGoal, "id" | "userId" | "createdAt" | "updatedAt">>
) {
  await connectDB();
  const payload = {
    ...data,
    ...(data.targetDate ? { targetDate: new Date(data.targetDate) } : {}),
  };
  const doc = await Goal.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return doc ? mapGoal(doc) : null;
}

export async function deleteGoal(userId: string, id: string) {
  await connectDB();
  const result = await Goal.deleteOne({ _id: id, userId });
  return result.deletedCount === 1;
}

export async function getGoalProjections(userId: string) {
  const goals = await listGoals(userId);
  return { goals, projections: projectGoals(goals) };
}

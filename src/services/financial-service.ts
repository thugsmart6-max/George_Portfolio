import { connectDB } from "@/lib/db";
import { Income, Expense, Asset, Liability } from "@/models";
import type {
  AssetRecord,
  ExpenseRecord,
  IncomeRecord,
  LiabilityRecord,
} from "@/types";

function mapIncome(doc: {
  _id: { toString(): string };
  userId: string;
  amount: number;
  category: IncomeRecord["category"];
  frequency: IncomeRecord["frequency"];
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}): IncomeRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    amount: doc.amount,
    category: doc.category,
    frequency: doc.frequency,
    date: doc.date.toISOString(),
    description: doc.description,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function mapExpense(doc: {
  _id: { toString(): string };
  userId: string;
  amount: number;
  category: ExpenseRecord["category"];
  frequency: ExpenseRecord["frequency"];
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}): ExpenseRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    amount: doc.amount,
    category: doc.category,
    frequency: doc.frequency,
    date: doc.date.toISOString(),
    description: doc.description,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function mapAsset(doc: {
  _id: { toString(): string };
  userId: string;
  name: string;
  category: AssetRecord["category"];
  currentValue: number;
  purchaseValue?: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}): AssetRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    name: doc.name,
    category: doc.category,
    currentValue: doc.currentValue,
    purchaseValue: doc.purchaseValue,
    date: doc.date.toISOString(),
    notes: doc.notes,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function mapLiability(doc: {
  _id: { toString(): string };
  userId: string;
  name: string;
  category: LiabilityRecord["category"];
  outstandingAmount: number;
  monthlyEMI?: number;
  interestRate?: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}): LiabilityRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    name: doc.name,
    category: doc.category,
    outstandingAmount: doc.outstandingAmount,
    monthlyEMI: doc.monthlyEMI,
    interestRate: doc.interestRate,
    dueDate: doc.dueDate?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listIncome(userId: string, category?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { userId };
  if (category) filter.category = category;
  const docs = await Income.find(filter).sort({ date: -1 });
  return docs.map(mapIncome);
}

export async function createIncome(
  userId: string,
  data: Omit<IncomeRecord, "id" | "userId" | "createdAt" | "updatedAt">
) {
  await connectDB();
  const doc = await Income.create({ ...data, userId, date: new Date(data.date) });
  return mapIncome(doc);
}

export async function updateIncome(
  userId: string,
  id: string,
  data: Partial<Omit<IncomeRecord, "id" | "userId" | "createdAt" | "updatedAt">>
) {
  await connectDB();
  const payload = {
    ...data,
    ...(data.date ? { date: new Date(data.date) } : {}),
  };
  const doc = await Income.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return doc ? mapIncome(doc) : null;
}

export async function deleteIncome(userId: string, id: string) {
  await connectDB();
  const result = await Income.deleteOne({ _id: id, userId });
  return result.deletedCount === 1;
}

export async function listExpenses(userId: string, category?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { userId };
  if (category) filter.category = category;
  const docs = await Expense.find(filter).sort({ date: -1 });
  return docs.map(mapExpense);
}

export async function createExpense(
  userId: string,
  data: Omit<ExpenseRecord, "id" | "userId" | "createdAt" | "updatedAt">
) {
  await connectDB();
  const doc = await Expense.create({
    ...data,
    userId,
    date: new Date(data.date),
  });
  return mapExpense(doc);
}

export async function updateExpense(
  userId: string,
  id: string,
  data: Partial<Omit<ExpenseRecord, "id" | "userId" | "createdAt" | "updatedAt">>
) {
  await connectDB();
  const payload = {
    ...data,
    ...(data.date ? { date: new Date(data.date) } : {}),
  };
  const doc = await Expense.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return doc ? mapExpense(doc) : null;
}

export async function deleteExpense(userId: string, id: string) {
  await connectDB();
  const result = await Expense.deleteOne({ _id: id, userId });
  return result.deletedCount === 1;
}

export async function listAssets(userId: string, category?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { userId };
  if (category) filter.category = category;
  const docs = await Asset.find(filter).sort({ updatedAt: -1 });
  return docs.map(mapAsset);
}

export async function createAsset(
  userId: string,
  data: Omit<AssetRecord, "id" | "userId" | "createdAt" | "updatedAt">
) {
  await connectDB();
  const doc = await Asset.create({ ...data, userId, date: new Date(data.date) });
  return mapAsset(doc);
}

export async function updateAsset(
  userId: string,
  id: string,
  data: Partial<Omit<AssetRecord, "id" | "userId" | "createdAt" | "updatedAt">>
) {
  await connectDB();
  const payload = {
    ...data,
    ...(data.date ? { date: new Date(data.date) } : {}),
  };
  const doc = await Asset.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return doc ? mapAsset(doc) : null;
}

export async function deleteAsset(userId: string, id: string) {
  await connectDB();
  const result = await Asset.deleteOne({ _id: id, userId });
  return result.deletedCount === 1;
}

export async function listLiabilities(userId: string, category?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { userId };
  if (category) filter.category = category;
  const docs = await Liability.find(filter).sort({ updatedAt: -1 });
  return docs.map(mapLiability);
}

export async function createLiability(
  userId: string,
  data: Omit<LiabilityRecord, "id" | "userId" | "createdAt" | "updatedAt">
) {
  await connectDB();
  const doc = await Liability.create({
    ...data,
    userId,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });
  return mapLiability(doc);
}

export async function updateLiability(
  userId: string,
  id: string,
  data: Partial<
    Omit<LiabilityRecord, "id" | "userId" | "createdAt" | "updatedAt">
  >
) {
  await connectDB();
  const payload = {
    ...data,
    ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
  };
  const doc = await Liability.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return doc ? mapLiability(doc) : null;
}

export async function deleteLiability(userId: string, id: string) {
  await connectDB();
  const result = await Liability.deleteOne({ _id: id, userId });
  return result.deletedCount === 1;
}

export async function getAllFinancialData(userId: string) {
  const [income, expenses, assets, liabilities] = await Promise.all([
    listIncome(userId),
    listExpenses(userId),
    listAssets(userId),
    listLiabilities(userId),
  ]);
  return { income, expenses, assets, liabilities };
}

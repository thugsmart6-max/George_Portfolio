import { requireUser } from "@/lib/auth/require-user";
import {
  createIncome,
  listIncome,
} from "@/services/financial-service";
import { incomeSchema } from "@/validators/finance";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await listIncome(auth.session.userId, category);
    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const body = await request.json();
    const data = incomeSchema.parse(body);
    const item = await createIncome(auth.session.userId, {
      amount: data.amount,
      category: data.category,
      frequency: data.frequency,
      date: data.date.toISOString(),
      description: data.description || undefined,
    });
    return jsonOk({ item }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

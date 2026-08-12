import { requireUser } from "@/lib/auth/require-user";
import {
  createLiability,
  listLiabilities,
} from "@/services/financial-service";
import { liabilitySchema } from "@/validators/finance";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await listLiabilities(auth.session.userId, category);
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
    const data = liabilitySchema.parse(body);
    const item = await createLiability(auth.session.userId, {
      name: data.name,
      category: data.category,
      outstandingAmount: data.outstandingAmount,
      monthlyEMI: data.monthlyEMI,
      interestRate: data.interestRate,
      dueDate: data.dueDate?.toISOString(),
    });
    return jsonOk({ item }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

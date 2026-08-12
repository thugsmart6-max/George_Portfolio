import { requireUser } from "@/lib/auth/require-user";
import { createAsset, listAssets } from "@/services/financial-service";
import { assetSchema } from "@/validators/finance";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await listAssets(auth.session.userId, category);
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
    const data = assetSchema.parse(body);
    const item = await createAsset(auth.session.userId, {
      name: data.name,
      category: data.category,
      currentValue: data.currentValue,
      purchaseValue: data.purchaseValue,
      date: data.date.toISOString(),
      notes: data.notes || undefined,
    });
    return jsonOk({ item }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

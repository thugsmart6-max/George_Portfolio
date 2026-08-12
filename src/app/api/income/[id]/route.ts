import { requireUser } from "@/lib/auth/require-user";
import { deleteIncome, updateIncome } from "@/services/financial-service";
import { incomeSchema } from "@/validators/finance";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const { id } = await params;
    const body = await request.json();
    const data = incomeSchema.partial().parse(body);
    const item = await updateIncome(auth.session.userId, id, {
      ...data,
      date: data.date?.toISOString(),
      description: data.description || undefined,
    });
    if (!item) return jsonError("Income not found", 404);
    return jsonOk({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const { id } = await params;
    const ok = await deleteIncome(auth.session.userId, id);
    if (!ok) return jsonError("Income not found", 404);
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

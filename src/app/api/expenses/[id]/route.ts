import { requireUser } from "@/lib/auth/require-user";
import { deleteExpense, updateExpense } from "@/services/financial-service";
import { expenseSchema } from "@/validators/finance";
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
    const data = expenseSchema.partial().parse(body);
    const item = await updateExpense(auth.session.userId, id, {
      ...data,
      date: data.date?.toISOString(),
      description: data.description || undefined,
    });
    if (!item) return jsonError("Expense not found", 404);
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
    const ok = await deleteExpense(auth.session.userId, id);
    if (!ok) return jsonError("Expense not found", 404);
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

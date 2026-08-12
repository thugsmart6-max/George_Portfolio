import { requireUser } from "@/lib/auth/require-user";
import { deleteGoal, updateGoal } from "@/services/goal-service";
import { goalSchema } from "@/validators/finance";
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
    const data = goalSchema.partial().parse(body);
    const goal = await updateGoal(auth.session.userId, id, {
      ...data,
      targetDate: data.targetDate?.toISOString(),
    });
    if (!goal) return jsonError("Goal not found", 404);
    return jsonOk({ goal });
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
    const ok = await deleteGoal(auth.session.userId, id);
    if (!ok) return jsonError("Goal not found", 404);
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

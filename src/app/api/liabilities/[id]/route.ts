import { requireUser } from "@/lib/auth/require-user";
import {
  deleteLiability,
  updateLiability,
} from "@/services/financial-service";
import { liabilitySchema } from "@/validators/finance";
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
    const data = liabilitySchema.partial().parse(body);
    const item = await updateLiability(auth.session.userId, id, {
      ...data,
      dueDate: data.dueDate?.toISOString(),
    });
    if (!item) return jsonError("Liability not found", 404);
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
    const ok = await deleteLiability(auth.session.userId, id);
    if (!ok) return jsonError("Liability not found", 404);
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

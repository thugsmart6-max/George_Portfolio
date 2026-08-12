import { requireUser } from "@/lib/auth/require-user";
import { deleteAsset, updateAsset } from "@/services/financial-service";
import { assetSchema } from "@/validators/finance";
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
    const data = assetSchema.partial().parse(body);
    const item = await updateAsset(auth.session.userId, id, {
      ...data,
      date: data.date?.toISOString(),
      notes: data.notes || undefined,
    });
    if (!item) return jsonError("Asset not found", 404);
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
    const ok = await deleteAsset(auth.session.userId, id);
    if (!ok) return jsonError("Asset not found", 404);
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

import { requireUser } from "@/lib/auth/require-user";
import { getUserByUserId, updateUserProfile } from "@/services/user-service";
import { profileUpdateSchema } from "@/validators/finance";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const user = await getUserByUserId(auth.session.userId);
    if (!user) return jsonError("User not found", 404);
    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const body = await request.json();
    const updates = profileUpdateSchema.parse(body);
    const user = await updateUserProfile(auth.session.userId, updates);
    if (!user) return jsonError("User not found", 404);
    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

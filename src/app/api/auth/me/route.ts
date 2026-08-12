import { requireUser } from "@/lib/auth/require-user";
import { getUserByUserId } from "@/services/user-service";
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
